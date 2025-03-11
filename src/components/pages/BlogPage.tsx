'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Link from 'next/link'
import { client, handleSanityError } from '@/lib/sanity/client'
import { toast } from 'react-hot-toast'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { Spinner } from '@/components/common/Spinner'
import { useRouter, useSearchParams } from 'next/navigation'
import debounce from 'lodash/debounce'
import SanityImage from '@/components/blog/SanityImage'
import { motion } from 'framer-motion'

// 使用單獨的文件存儲類型定義
import { Post, Category } from '@/types/blog'

// 組件 Props 定義
interface BlogPageProps {
  initialCategory?: string
  posts?: Post[]
}

// 動畫配置
const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  },
  slideUp: {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }
};

// 博客卡片組件
const BlogCard = ({ post }: { post: Post }) => {
  const formattedDate = post.publishedAt
    ? format(new Date(post.publishedAt), 'yyyy年MM月dd日', { locale: zhTW })
    : '發布日期未知';

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col overflow-hidden bg-white h-full border border-gray-100"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <SanityImage
          image={post.mainImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-500 hover:scale-105"
          priority={false}
        />
      </div>
      <div className="flex flex-col flex-grow p-6">
        <div className="flex-grow">
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 line-clamp-2">
            {post.title}
          </h3>
          <p className="mb-4 text-sm text-gray-500">{formattedDate}</p>
          <p className="mb-4 text-gray-600 line-clamp-3">{post.excerpt}</p>
        </div>
        <div className="mt-auto">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center font-medium text-primary hover:underline"
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
  );
};

// 分類過濾器組件
const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: { 
  categories: Category[], 
  selectedCategory: string, 
  onCategoryChange: (category: string) => void 
}) => (
  <div className="mb-8">
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          selectedCategory === 'all'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        aria-pressed={selectedCategory === 'all'}
      >
        全部
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onCategoryChange(category.slug)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === category.slug
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          aria-pressed={selectedCategory === category.slug}
        >
          {category.title}
        </button>
      ))}
    </div>
  </div>
);

// 搜索欄組件
const SearchBar = ({ 
  searchQuery, 
  onSearchChange 
}: { 
  searchQuery: string, 
  onSearchChange: (value: string) => void 
}) => (
  <div className="mb-8">
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
        className="block w-full bg-white py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary border-0"
        placeholder="搜尋文章..."
        aria-label="搜尋文章"
      />
    </div>
  </div>
);

// 文章列表組件
const PostList = ({ 
  posts, 
  loading, 
  error, 
  hasMore, 
  onLoadMore 
}: { 
  posts: Post[], 
  loading: boolean, 
  error: string | null, 
  hasMore: boolean, 
  onLoadMore: () => void 
}) => (
  <div>
    {error && (
      <div className="mb-8 rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    )}

    {posts.length === 0 && !loading && !error ? (
      <div className="mb-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-600">
        沒有找到符合條件的文章
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    )}

    {loading && (
      <div className="mt-8 flex justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )}

    {!loading && hasMore && posts.length > 0 && (
      <div className="mt-12 flex justify-center">
        <button
          onClick={onLoadMore}
          className="inline-flex items-center justify-center bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 transition-colors"
          aria-label="載入更多文章"
        >
          載入更多文章
        </button>
      </div>
    )}
  </div>
);

export default function BlogPage({ initialCategory, posts: initialPosts }: BlogPageProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || searchParams.get('category') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('q') || ''
  );
  const [loading, setLoading] = useState(!initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(!initialPosts);
  const postsPerPage = 9;

  // 獲取分類列表
  const fetchCategories = useCallback(async () => {
    try {
      const query = '*[_type == "category"] {_id, title, description, "slug": slug.current}';
      const result = await client.fetch(query);
      setCategories(result);
    } catch (err) {
      const errorMessage = handleSanityError(err);
      console.error('Error fetching categories:', err);
      setError('無法載入文章分類：' + errorMessage);
      toast.error('無法載入文章分類');
    }
  }, []);

  // 獲取文章列表
  const fetchPosts = useCallback(async () => {
    // 如果有初始文章，則不需要再次獲取
    if (initialPosts && page === 1) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 構建基本查詢
      let filterConditions = '_type == "post" && status == "published"';
      
      // 添加分類過濾
      if (selectedCategory && selectedCategory !== 'all') {
        filterConditions += ` && "${selectedCategory}" in categories[]->slug.current`;
      }
      
      // 添加搜索過濾
      if (searchQuery) {
        filterConditions += ` && (title match "*${searchQuery}*" || excerpt match "*${searchQuery}*")`;
      }
      
      // 計算分頁
      const start = (page - 1) * postsPerPage;
      const end = start + postsPerPage;
      
      // 執行查詢
      const query = `{
        "posts": *[${filterConditions}] | order(publishedAt desc) [${start}...${end}] {
          _id,
          _type,
          title,
          slug,
          publishedAt,
          excerpt,
          mainImage,
          categories[]->{
            _id,
            title,
            "slug": slug.current
          }
        },
        "total": count(*[${filterConditions}])
      }`;
      
      const result = await client.fetch(query);
      
      // 更新狀態
      setPosts(prevPosts => page === 1 ? result.posts : [...prevPosts, ...result.posts]);
      setHasMore(result.total > (page * postsPerPage));
      setLoading(false);
    } catch (err) {
      const errorMessage = handleSanityError(err);
      console.error('Error fetching posts:', err);
      setError('無法載入文章：' + errorMessage);
      setLoading(false);
      toast.error('無法載入文章');
    }
  }, [initialPosts, page, postsPerPage, searchQuery, selectedCategory]);

  // 搜索防抖動處理
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setPage(1);
      setPosts([]);
      
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      
      router.push(`/blog?${params.toString()}`);
    }, 500),
    [router, searchParams]
  );

  // 處理分類變更
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setPage(1);
    setPosts([]);
    
    const params = new URLSearchParams(searchParams.toString());
    if (category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    router.push(`/blog?${params.toString()}`);
  }, [router, searchParams]);

  // 載入更多文章
  const loadMore = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  // 初始加載及數據獲取
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, page, searchQuery, selectedCategory]);

  return (
    <ErrorBoundary fallback={<div className="py-12 text-center text-red-600">博客頁面載入發生錯誤</div>}>
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">專業洞察</h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              探索醫療行銷的最新趨勢、案例分析和專業見解，助您的診所脫穎而出
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-5xl"
          >
            <SearchBar 
              searchQuery={searchQuery} 
              onSearchChange={debouncedSearch} 
            />
            
            <CategoryFilter 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onCategoryChange={handleCategoryChange} 
            />
            
            <PostList 
              posts={posts} 
              loading={loading} 
              error={error} 
              hasMore={hasMore} 
              onLoadMore={loadMore} 
            />
          </motion.div>
        </div>
      </section>
      
      <section className="bg-primary text-white py-16 sm:py-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">想了解更多醫療行銷策略？</h2>
            <p className="text-lg mb-8">
              訂閱我們的電子報，獲取最新的醫療行銷趨勢、案例研究和專業建議
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium hover:bg-gray-100 transition-all duration-300 text-base"
            >
              預約免費諮詢
            </Link>
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
} 