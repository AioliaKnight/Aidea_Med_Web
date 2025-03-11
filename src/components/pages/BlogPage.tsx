'use client'

import { useEffect, useState, useCallback } from 'react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import { client, handleSanityError } from '@/lib/sanity/client'
import { urlForImage } from '@/lib/sanity/client'
import { toast } from 'react-hot-toast'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { Spinner } from '@/components/common/Spinner'
import { useRouter, useSearchParams } from 'next/navigation'
import debounce from 'lodash/debounce'
import SanityImage from '@/components/blog/SanityImage'

// 使用單獨的文件存儲類型定義
import { Post, Category } from '@/types/blog'

// 組件 Props 定義
interface BlogPageProps {
  initialCategory?: string
  posts?: Post[]
}

// 博客卡片組件
const BlogCard = ({ post }: { post: Post }) => {
  const formattedDate = post.publishedAt
    ? format(new Date(post.publishedAt), 'yyyy年MM月dd日', { locale: zhTW })
    : '發布日期未知';

  return (
    <article className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-white h-full">
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
            className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
          >
            閱讀更多
            <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

// 分類篩選器組件
const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: { 
  categories: Category[], 
  selectedCategory: string, 
  onCategoryChange: (category: string) => void 
}) => (
  <div className="mb-8 overflow-x-auto pb-2">
    <div className="flex space-x-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        全部文章
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onCategoryChange(category.title)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === category.title
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
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
      <input
        type="text"
        placeholder="搜尋文章..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
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
  <div className="space-y-8">
    {error && (
      <div className="rounded-md bg-red-50 p-4 text-red-700">
        <p>{error}</p>
      </div>
    )}
    
    {posts.length > 0 ? (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    ) : !loading && !error ? (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">沒有找到相關文章</p>
      </div>
    ) : null}
    
    {loading && (
      <div className="flex justify-center py-8">
        <Spinner className="h-8 w-8 text-blue-600" />
      </div>
    )}
    
    {hasMore && posts.length > 0 && !loading && (
      <div className="flex justify-center pt-4">
        <button
          onClick={onLoadMore}
          className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
      let filter = '*[_type == "post"';
      
      // 添加搜索過濾
      if (searchQuery) {
        filter += ` && (title match "*${searchQuery}*" || excerpt match "*${searchQuery}*")`;
      }
      
      // 添加分類過濾
      if (selectedCategory && selectedCategory !== 'all') {
        filter += ` && "${selectedCategory}" in categories[]->title`;
      }
      
      // 關閉查詢條件
      filter += ']';
      
      // 完整查詢
      const query = `${filter} | order(publishedAt desc) {
        _id, 
        title, 
        "slug": slug.current, 
        publishedAt, 
        excerpt, 
        mainImage, 
        categories[]->{title, "slug": slug.current}
      }[${(page - 1) * postsPerPage}...${page * postsPerPage}]`;
      
      const result = await client.fetch(query);
      
      // 更新結果數據
      if (result.length < postsPerPage) {
        setHasMore(false);
      }
      
      setPosts(prev => (page === 1 ? result : [...prev, ...result]));
    } catch (err) {
      const errorMessage = handleSanityError(err);
      console.error('Error fetching posts:', err);
      setError('無法載入文章列表：' + errorMessage);
      toast.error('無法載入文章列表');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedCategory, initialPosts, postsPerPage]);

  // 延遲搜索，避免頻繁請求
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setPage(1);
      setHasMore(true);
      setPosts([]); // 清空當前文章，避免舊的搜索結果混合
      
      // 更新 URL 參數
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

  // 分類改變處理器
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setPage(1);
    setHasMore(true);
    setPosts([]); // 清空當前文章
    
    // 更新 URL 參數
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
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">部落格</h1>
            <p className="mt-4 text-xl text-gray-600">探索醫療行銷的最新趨勢、案例分析和專業見解</p>
          </div>

          <div className="mx-auto max-w-5xl">
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
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
} 