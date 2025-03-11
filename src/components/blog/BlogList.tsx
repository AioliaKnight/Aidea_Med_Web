'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Link from 'next/link'
import { client } from '@/lib/sanity'
import { toast } from 'react-hot-toast'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { Spinner } from '@/components/common/Spinner'
import { useRouter, useSearchParams } from 'next/navigation'
import debounce from 'lodash/debounce'
import SanityImage from '@/components/common/blog/SanityImage'
import { motion } from 'framer-motion'
import { Post, Category, BlogSettings } from '@/types/blog'
import { BackToTop } from '../common/blog/BackToTop'

interface BlogListProps {
  posts?: Post[]
  settings?: BlogSettings
  categories?: Category[]
  title?: string
  description?: string
  currentPage?: number
  totalPosts?: number
  postsPerPage?: number
  isCategory?: boolean
  categorySlug?: string
}

// 文章卡片組件
interface BlogCardProps {
  post: Post
  index: number
}

// 使用 React.memo 包裝 BlogCard 組件以避免不必要的重渲染
const BlogCard = React.memo(({ post, index }: BlogCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full"
    >
      <Link href={`/blog/${post.slug}`} className="block group">
        <div className="relative h-48 overflow-hidden">
          {post.mainImage ? (
            <SanityImage
              image={post.mainImage}
              width={600}
              height={340}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              alt={post.title}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">無圖片</span>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories?.map((category) => (
              <span key={category._id} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {category.title}
              </span>
            ))}
          </div>
          
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          <p className="text-gray-600 line-clamp-3 mb-3 text-sm">
            {post.excerpt}
          </p>
          
          <div className="mt-auto pt-3 flex items-center justify-between text-sm text-gray-500">
            <span>{format(new Date(post.publishedAt), 'PP', { locale: zhTW })}</span>
            <span className="text-primary font-medium group-hover:underline">閱讀更多</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

BlogCard.displayName = 'BlogCard';

export default function BlogList({
  posts: initialPosts = [],
  settings,
  categories = [],
  title = '部落格', 
  description = '探索醫療行銷的最新趨勢和見解',
  currentPage = 1,
  totalPosts = 0,
  postsPerPage = 10,
  isCategory = false,
  categorySlug = '',
}: BlogListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || '')
  const [page, setPage] = useState(currentPage)
  const [hasMore, setHasMore] = useState(initialPosts.length < totalPosts)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 處理搜尋查詢變更
  useEffect(() => {
    const query = searchParams?.get('q')
    if (query) {
      setSearchQuery(query)
      handleSearch(query)
    }
  }, [searchParams])
  
  // 處理加載更多文章
  const loadMore = async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const nextPage = page + 1
      const offset = (nextPage - 1) * postsPerPage
      
      const query = `*[_type == "post" && status == "published" ${
        selectedCategory ? `&& count(categories[*[_id == "${selectedCategory}"]]) > 0` : ''
      } ${
        searchQuery ? `&& (title match "*${searchQuery}*" || excerpt match "*${searchQuery}*")` : ''
      }] | order(publishedAt desc) [${offset}...${offset + postsPerPage}] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        mainImage,
        "categories": categories[]->{
          _id,
          title,
          "slug": slug.current
        }
      }`
      
      const result = await client.fetch(query)
      
      if (result && result.length > 0) {
        setPosts(prev => [...prev, ...result])
        setPage(nextPage)
        setHasMore(result.length === postsPerPage)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('載入更多文章時發生錯誤:', error)
      toast.error('載入文章失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }
  
  // 處理分類篩選
  const handleCategoryChange = async (categoryId: string) => {
    if (loading) return
    
    setLoading(true)
    setSelectedCategory(categoryId)
    
    try {
      const query = `*[_type == "post" && status == "published" ${
        categoryId ? `&& count(categories[*[_id == "${categoryId}"]]) > 0` : ''
      } ${
        searchQuery ? `&& (title match "*${searchQuery}*" || excerpt match "*${searchQuery}*")` : ''
      }] | order(publishedAt desc) [0...${postsPerPage}] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        mainImage,
        "categories": categories[]->{
          _id,
          title,
          "slug": slug.current
        }
      }`
      
      const result = await client.fetch(query)
      
      setPosts(result || [])
      setPage(1)
      setHasMore((result || []).length === postsPerPage)
      
      // 更新 URL 參數
      if (categoryId) {
        const category = categories.find(c => c._id === categoryId)
        if (category) {
          router.push(`/blog/category/${category.slug}`)
        }
      } else {
        router.push('/blog')
      }
    } catch (error) {
      console.error('篩選分類時發生錯誤:', error)
      toast.error('載入文章失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }
  
  // 處理搜尋
  const handleSearch = async (query: string) => {
    if (loading) return
    
    setLoading(true)
    setSearchQuery(query)
    
    try {
      if (!query.trim()) {
        // 如果搜尋為空，恢復到原來的分類篩選
        handleCategoryChange(selectedCategory)
        return
      }
      
      const searchQueryEscaped = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      
      const searchQuery = `*[_type == "post" && status == "published" ${
        selectedCategory ? `&& count(categories[*[_id == "${selectedCategory}"]]) > 0` : ''
      } && (title match "*${searchQueryEscaped}*" || excerpt match "*${searchQueryEscaped}*")] | order(publishedAt desc) [0...${postsPerPage}] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        mainImage,
        "categories": categories[]->{
          _id,
          title,
          "slug": slug.current
        }
      }`
      
      const result = await client.fetch(searchQuery)
      
      setPosts(result || [])
      setPage(1)
      setHasMore((result || []).length === postsPerPage)
      
      // 更新 URL 參數
      const params = new URLSearchParams()
      params.set('q', query)
      router.push(`/blog?${params.toString()}`)
    } catch (error) {
      console.error('搜尋文章時發生錯誤:', error)
      toast.error('搜尋失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }
  
  // 防抖處理搜尋輸入
  const debouncedSearch = debounce((value: string) => {
    handleSearch(value)
  }, 500)
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="container mx-auto px-4">
          {/* 頁面標題 */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
          </div>
          
          {/* 搜尋和篩選區 */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8 sm:flex sm:flex-wrap items-center justify-between">
            {/* 搜尋框 */}
            <div className="mb-4 sm:mb-0 sm:flex-1 sm:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜尋文章..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    debouncedSearch(e.target.value)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            
            {/* 分類篩選 */}
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap items-center space-x-2">
                <span className="text-sm text-gray-500">分類:</span>
                <button
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    !selectedCategory ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryChange('')}
                >
                  全部
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategory === category._id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleCategoryChange(category._id)}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* 文章列表 */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <BlogCard key={post._id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                {searchQuery ? '沒有找到相關文章' : '尚無文章'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    handleSearch('')
                  }}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  清除搜尋
                </button>
              )}
            </div>
          )}
          
          {/* 載入更多按鈕 */}
          {hasMore && posts.length > 0 && (
            <div className="mt-10 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Spinner size="sm" />
                    <span className="ml-2">載入中...</span>
                  </span>
                ) : (
                  '載入更多文章'
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* 回到頂部按鈕 */}
        <BackToTop />
      </div>
    </ErrorBoundary>
  )
} 