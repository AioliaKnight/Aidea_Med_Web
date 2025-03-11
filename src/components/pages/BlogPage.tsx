'use client'

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Link from 'next/link'
import { client, handleSanityError, urlForImage } from '@/lib/sanity/client'
import { toast } from 'react-hot-toast'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { Spinner } from '@/components/common/Spinner'
import { useRouter, useSearchParams } from 'next/navigation'
import debounce from 'lodash/debounce'
import SanityImage from '@/components/blog/SanityImage'
import { motion, AnimatePresence } from 'framer-motion'
import { PortableText } from '@portabletext/react'

// 使用單獨的文件存儲類型定義
import { Post, Category } from '@/types/blog'

// ============================================================================
// 常量與類型定義
// ============================================================================

// 組件 Props 定義
interface BlogPageProps {
  initialCategory?: string
  posts?: Post[]
}

// 博客卡片 Props
interface BlogCardProps {
  post: Post
  index: number
}

// 分類過濾器 Props
interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

// 搜索欄 Props
interface SearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

// 文章列表 Props
interface PostListProps {
  posts: Post[]
  loading: boolean
  error: string | null
  hasMore: boolean
  onLoadMore: () => void
}

// 頁面狀態
type PageState = 'loading' | 'error' | 'empty' | 'loaded'

// 分頁設置
const POSTS_PER_PAGE = 9
const QUERY_TIMEOUT = 15000 // 15秒查詢超時
const RETRY_ATTEMPTS = 2 // 失敗後重試次數

// ============================================================================
// 動畫配置
// ============================================================================

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
    }
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08
      }
    }
  },
  cardReveal: {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }
}

// ============================================================================
// Sanity 查詢片段
// ============================================================================

const GROQ_FRAGMENTS = {
  // 基本查詢片段 - 用於輕量級查詢
  basicPost: `
    _id,
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt
    },
    "categories": categories[]->{
      _id, 
      title,
      "slug": slug.current
    }
  `,
  
  // 完整查詢片段 - 用於更詳細的信息
  fullPost: `
    _id,
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    updatedAt,
    excerpt,
    mainImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt
    },
    "categories": categories[]->{
      _id,
      title,
      "slug": slug.current,
      description
    },
    "readingTime": round(length(pt::text(content)) / 5 / 180)
  `
}

// 備用安全查詢 - 用於故障恢復
const FALLBACK_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...9] {
  ${GROQ_FRAGMENTS.basicPost}
}`

// ============================================================================
// 輔助函數
// ============================================================================

// 格式化日期函數
const formatPublishDate = (date: string | undefined): string => {
  if (!date) return '發布日期未知'
  try {
    return format(new Date(date), 'yyyy年MM月dd日', { locale: zhTW })
  } catch (e) {
    console.error('日期格式化錯誤:', e)
    return '發布日期未知'
  }
}

// 簡化文章數據結構
const simplifyPost = (post: any): Post => {
  if (!post) return {} as Post
  
  return {
    _id: post._id || '',
    _type: post._type || 'post',
    title: post.title || '無標題',
    slug: post.slug || '',
    publishedAt: post.publishedAt || '',
    updatedAt: post.updatedAt || '',
    excerpt: post.excerpt || '',
    mainImage: post.mainImage || null,
    categories: Array.isArray(post.categories) 
      ? post.categories.map((cat: any) => ({
          _id: cat._id || '',
          title: cat.title || '',
          slug: cat.slug || '',
          description: cat.description || ''
        }))
      : [],
    readingTime: post.readingTime || 0,
    author: post.author || null,
    content: post.content || [],
    status: post.status || 'published'
  }
}

// 獲取狀態文本
const getStatusText = (state: PageState, error: string | null): { title: string, message: string, icon: React.ReactNode } => {
  switch (state) {
    case 'loading':
      return {
        title: '載入中',
        message: '正在載入文章內容，請稍候...',
        icon: (
          <Spinner className="mb-6 h-12 w-12 text-primary" />
        )
      }
    case 'error':
      return {
        title: '載入失敗',
        message: error || '無法載入文章，請稍後再試',
        icon: (
          <svg 
            className="mx-auto mb-4 h-16 w-16 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        )
      }
    case 'empty':
      return {
        title: '沒有找到符合條件的文章',
        message: '請嘗試使用其他關鍵詞或瀏覽所有文章類別',
        icon: (
          <svg 
            className="mx-auto mb-4 h-16 w-16 text-blue-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
            />
          </svg>
        )
      }
    default:
      return {
        title: '',
        message: '',
        icon: null
      }
  }
}

// 以重試機制執行查詢
const executeQueryWithRetry = async (query: string, params: any = {}, maxRetries: number = RETRY_ATTEMPTS) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // 設置查詢超時
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('查詢超時')), QUERY_TIMEOUT)
      })
      
      // 嘗試執行查詢
      return await Promise.race([
        client.fetch(query, params, {
          cache: 'no-store'
        }),
        timeoutPromise
      ]);
    } catch (err) {
      lastError = err;
      console.log(`查詢失敗 (嘗試 ${attempt + 1}/${maxRetries + 1}):`, err);
      
      // 最後一次嘗試失敗時，拋出錯誤
      if (attempt === maxRetries) {
        throw err;
      }
      
      // 延遲後重試 (增加延遲時間)
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
}

// ============================================================================
// 子組件
// ============================================================================

// 博客卡片組件
const BlogCard = ({ post, index }: BlogCardProps) => {
  const formattedDate = formatPublishDate(post.publishedAt)
  
  // 檢查 slug 是否存在
  const postSlug = post.slug || `post-${post._id}`
                  
  // 檢查分類是否存在
  const hasCategories = Array.isArray(post.categories) && post.categories.length > 0
  
  // 檢查文章是否有摘要
  const hasExcerpt = Boolean(post.excerpt && post.excerpt.trim().length > 0)
  
  return (
    <motion.article 
      variants={animations.cardReveal}
      className="group flex h-full flex-col overflow-hidden border border-gray-100 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <SanityImage
          image={post.mainImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
          priority={index < 3}
        />
        
        {hasCategories && (
          <div className="absolute right-2 top-2 z-10">
            <span className="inline-block bg-primary px-3 py-1 text-xs font-semibold text-white">
              {post.categories[0].title}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-auto">
          <h3 className="mb-2 line-clamp-2 text-xl font-semibold tracking-tight text-gray-900">
            {post.title}
          </h3>
          
          <p className="mb-4 text-sm text-gray-500">{formattedDate}</p>
          
          {hasExcerpt ? (
            <p className="mb-4 line-clamp-3 text-gray-600">{post.excerpt}</p>
          ) : (
            <p className="mb-4 line-clamp-3 text-gray-600">查看本篇文章了解更多...</p>
          )}
        </div>
        
        <div className="pt-4">
          <Link
            href={`/blog/${postSlug}`}
            className="inline-flex items-center font-medium text-primary transition-colors hover:text-primary-dark"
            aria-label={`閱讀更多關於 ${post.title} 的內容`}
          >
            閱讀更多
            <svg
              className="ml-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// 分類過濾器組件
const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => (
  <div className="mb-8">
    <h2 className="mb-4 text-lg font-medium text-gray-800">依主題篩選</h2>
    <div className="flex flex-wrap gap-2">
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onCategoryChange('all')}
        className={`text-sm font-medium transition-colors ${
          selectedCategory === 'all'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        } px-4 py-2`}
        aria-pressed={selectedCategory === 'all'}
      >
        全部
      </motion.button>
      
      {categories.map((category) => (
        <motion.button
          key={category._id}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.slug)}
          className={`text-sm font-medium transition-colors ${
            selectedCategory === category.slug
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } px-4 py-2`}
          aria-pressed={selectedCategory === category.slug}
        >
          {category.title}
        </motion.button>
      ))}
    </div>
  </div>
)

// 搜索欄組件
const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => (
  <div className="mb-8">
    <h2 className="mb-4 text-lg font-medium text-gray-800">搜尋文章</h2>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      
      <input
        type="text"
        name="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full border-0 bg-white py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
        placeholder="輸入關鍵字搜尋..."
        aria-label="搜尋文章"
      />
    </div>
  </div>
)

// 狀態顯示組件
const StatusDisplay = ({ state, error }: { state: PageState, error: string | null }) => {
  const { title, message, icon } = getStatusText(state, error)
  
  if (state === 'loading' || state === 'error' || state === 'empty') {
    const bgColors = {
      loading: 'bg-white',
      error: 'bg-red-50',
      empty: 'bg-blue-50'
    }
    
    const textColors = {
      loading: 'text-gray-800',
      error: 'text-red-800',
      empty: 'text-blue-800'
    }
    
    const messageColors = {
      loading: 'text-gray-600',
      error: 'text-red-600',
      empty: 'text-blue-600'
    }
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`rounded-lg ${bgColors[state]} p-8 text-center`}
      >
        {icon}
        <h3 className={`mb-2 text-xl font-semibold ${textColors[state]}`}>{title}</h3>
        <p className={messageColors[state]}>{message}</p>
        
        {state === 'error' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center justify-center rounded bg-primary px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
          >
            重新載入
          </motion.button>
        )}
      </motion.div>
    )
  }
  
  return null
}

// 文章列表組件
const PostList = ({ posts, loading, error, hasMore, onLoadMore }: PostListProps) => {
  // 使用 IntersectionObserver 實現自動載入更多
  const loadMoreRef = useRef<HTMLDivElement>(null)
  
  // 確定當前狀態
  const state: PageState = loading && posts.length === 0 
    ? 'loading' 
    : error 
      ? 'error' 
      : posts.length === 0 && !loading 
        ? 'empty' 
        : 'loaded'
  
  useEffect(() => {
    if (!loadMoreRef.current || loading || !hasMore || state !== 'loaded') return
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 0.5 }
    )
    
    observer.observe(loadMoreRef.current)
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [loading, hasMore, onLoadMore, state])
  
  return (
    <div>
      <AnimatePresence mode="wait">
        {state !== 'loaded' ? (
          <StatusDisplay key={state} state={state} error={error} />
        ) : (
          <motion.div 
            key="loaded"
            variants={animations.staggerContainer}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post, index) => (
              <BlogCard key={post._id} post={post} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {state === 'loaded' && loading && (
        <div className="mt-8 flex justify-center">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      )}

      {state === 'loaded' && !loading && hasMore && (
        <div ref={loadMoreRef} className="mt-12 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLoadMore}
            className="inline-flex items-center justify-center rounded bg-primary px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
            aria-label="載入更多文章"
          >
            載入更多文章
          </motion.button>
        </div>
      )}
    </div>
  )
}

// 主題區塊 - 用於顯示CTA
const CTASection = () => (
  <section className="bg-primary py-16 text-white sm:py-20">
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="mb-6 text-2xl font-bold sm:text-3xl">想了解更多醫療行銷策略？</h2>
        <p className="mb-8 text-lg">
          訂閱我們的電子報，獲取最新的醫療行銷趨勢、案例研究和專業建議
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded bg-white px-6 py-3 text-base font-medium text-primary transition-colors hover:bg-gray-100"
          >
            預約免費諮詢
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
)

// ============================================================================
// 主組件
// ============================================================================

export default function BlogPage({ initialCategory, posts: initialPosts }: BlogPageProps = {}) {
  // ========== 狀態管理 ==========
  const router = useRouter()
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>(initialPosts || [])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || searchParams.get('category') || 'all'
  )
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('q') || ''
  )
  const [loading, setLoading] = useState<boolean>(!initialPosts)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(!initialPosts)
  const [total, setTotal] = useState<number>(0)
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const [retryCount, setRetryCount] = useState<number>(0)
  
  // 記錄組件是否仍然掛載
  const isMounted = useRef<boolean>(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // ========== API 請求邏輯 ==========
  
  // 獲取分類列表
  const fetchCategories = useCallback(async () => {
    try {
      // 簡化查詢，確保獲取所有必要字段
      const query = `*[_type == "category" && defined(title)] {
          _id,
          title,
          "slug": slug.current,
          description
      } | order(title asc)`
      
      const result = await executeQueryWithRetry(query)
      
      if (isMounted.current) {
        setCategories(result || [])
      }
    } catch (err) {
      if (!isMounted.current) return
      
      const errorMessage = handleSanityError(err)
      console.error('Error fetching categories:', errorMessage)
      toast.error('無法載入文章分類')
    }
  }, [])

  // 構建查詢條件
  const buildFilterConditions = useCallback((category: string, search: string): string => {
    // 確保至少篩選發布狀態和 slug 存在
    let filterConditions = '_type == "post" && defined(slug.current)'
    
    // 添加分類過濾
    if (category && category !== 'all') {
      filterConditions += ` && "${category}" in categories[]->slug.current`
    }
    
    // 添加搜索過濾（簡化以避免複雜查詢導致錯誤）
    if (search) {
      filterConditions += ` && (title match "*${search}*" || excerpt match "*${search}*")`
    }
    
    return filterConditions
  }, [])

  // 獲取文章列表
  const fetchPosts = useCallback(async () => {
    // 如果有初始文章且是第一頁，直接使用
    if (initialPosts && page === 1 && isInitialLoad) {
      setIsInitialLoad(false)
      setPosts(initialPosts)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 構建過濾條件
      const filterConditions = buildFilterConditions(selectedCategory, searchQuery)
      
      // 計算分頁
      const start = (page - 1) * POSTS_PER_PAGE
      const end = start + POSTS_PER_PAGE
      
      // 使用簡化的查詢
      const query = `{
        "posts": *[${filterConditions}] | order(publishedAt desc) [${start}...${end}] {
          ${GROQ_FRAGMENTS.basicPost}
        },
        "total": count(*[${filterConditions}])
      }`
      
      // 執行查詢（帶有重試機制）
      const result = await executeQueryWithRetry(query)
      
      // 不再掛載，不執行後續操作
      if (!isMounted.current) return
      
      // 處理空結果的情況
      if (!result || !result.posts) {
        setLoading(false)
        if (page === 1) {
          setPosts([])
        }
        setHasMore(false)
        return
      }
      
      // 處理和轉換數據
      const processedPosts = (result.posts || []).map((post: any) => simplifyPost(post))
      
      // 更新狀態
      setPosts(prevPosts => page === 1 ? processedPosts : [...prevPosts, ...processedPosts])
      setTotal(result.total || 0)
      setHasMore((result.total || 0) > (start + (result.posts?.length || 0)))
      setLoading(false)
      setIsInitialLoad(false)
      setRetryCount(0) // 重置重試計數
    } catch (err) {
      console.error('Error fetching posts:', err)
      
      if (!isMounted.current) return
      
      // 如果是第一次嘗試失敗，增加重試計數並在短暫延遲後再次嘗試
      if (retryCount < RETRY_ATTEMPTS) {
        setRetryCount(prev => prev + 1)
        setTimeout(() => {
          if (isMounted.current) {
            fetchPosts()
          }
        }, 2000) // 2秒後重試
        return
      }
      
      // 嘗試使用備用方案
      if (page === 1) {
        try {
          const fallbackResult = await executeQueryWithRetry(FALLBACK_QUERY)
          setPosts(fallbackResult.map((post: any) => simplifyPost(post)))
          setHasMore(false)
          setLoading(false)
          toast.success('已使用備用方式載入文章')
          return
        } catch (fallbackErr) {
          console.error('Fallback query also failed:', fallbackErr)
        }
      }
      
      const errorMessage = err instanceof Error ? err.message : handleSanityError(err)
      setError('無法載入文章：' + errorMessage)
      setLoading(false)
      setPosts(page === 1 ? [] : posts)
      toast.error('無法載入文章，請稍後再試')
    }
  }, [initialPosts, page, searchQuery, selectedCategory, buildFilterConditions, isInitialLoad, posts, retryCount])

  // ========== 事件處理邏輯 ==========
  
  // 搜索防抖動處理
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value)
      setPage(1)
      setPosts([])
      
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('q', value)
      } else {
        params.delete('q')
      }
        
      router.push(`/blog?${params.toString()}`)
    }, 500),
    [router, searchParams]
  )

  // 處理分類變更
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setPage(1)
    setPosts([])
    
    const params = new URLSearchParams(searchParams.toString())
    if (category !== 'all') {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    
    router.push(`/blog?${params.toString()}`)
  }, [router, searchParams])

  // 載入更多文章
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1)
    }
  }, [loading, hasMore])

  // ========== 副作用 ==========
  
  // 初始加載分類
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // 數據獲取
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts, page, searchQuery, selectedCategory])
  
  // 重設頁面（當搜索或分類變更時）
  useEffect(() => {
    // 僅在非初始載入時執行
    if (!isInitialLoad) {
      setPage(1)
      setPosts([])
    }
  }, [searchQuery, selectedCategory, isInitialLoad])
  
  // ========== 計算派生數據 ==========
  
  // 計算顯示的結果統計信息
  const resultStats = useMemo(() => {
    if (loading && posts.length === 0) return null
    
    let message = `顯示 ${posts.length} 篇文章`
    if (total > 0) {
      message += ` (共 ${total} 篇)`
    }
    
    if (selectedCategory !== 'all') {
      const categoryTitle = categories.find(c => c.slug === selectedCategory)?.title
      if (categoryTitle) {
        message += ` - 分類: ${categoryTitle}`
      }
    }
    
    if (searchQuery) {
      message += ` - 搜尋: "${searchQuery}"`
    }
    
    return message
  }, [posts.length, total, selectedCategory, categories, searchQuery, loading])

  // ========== 渲染 ==========
  return (
    <ErrorBoundary fallback={<div className="py-12 text-center text-red-600">博客頁面載入發生錯誤</div>}>
      {/* 頁面頭部 */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">專業洞察</h1>
            <div className="mx-auto mb-6 h-1 w-20 bg-primary"></div>
            <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-600">
              探索醫療行銷的最新趨勢、案例分析和專業見解，助您的診所脫穎而出
            </p>
          </motion.div>

          {/* 主要內容區 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto max-w-7xl"
          >
            <div className="gap-12 lg:flex">
              {/* 側邊欄 */}
              <div className="mb-10 lg:mb-0 lg:w-1/4">
                <div className="lg:sticky lg:top-24">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <SearchBar 
                      searchQuery={searchQuery} 
                      onSearchChange={debouncedSearch} 
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <CategoryFilter 
                      categories={categories} 
                      selectedCategory={selectedCategory} 
                      onCategoryChange={handleCategoryChange} 
                    />
                  </motion.div>
                </div>
              </div>
              
              {/* 文章列表區 */}
              <div className="lg:w-3/4">
                {resultStats && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 text-sm text-gray-500"
                  >
                    {resultStats}
                  </motion.div>
                )}
                
                <PostList 
                  posts={posts} 
                  loading={loading} 
                  error={error} 
                  hasMore={hasMore} 
                  onLoadMore={loadMore} 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA 區塊 */}
      <CTASection />
    </ErrorBoundary>
  )
} 