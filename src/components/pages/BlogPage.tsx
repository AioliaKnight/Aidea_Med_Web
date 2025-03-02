'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import { client, handleSanityError } from '@/lib/sanity'
import { groq } from 'next-sanity'
import { urlForImage } from '@/lib/sanity'
import { toast } from 'react-hot-toast'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { Spinner } from '@/components/common/Spinner'
import { useRouter, useSearchParams } from 'next/navigation'
import debounce from 'lodash/debounce'

interface Post {
  _id: string
  title: string
  slug: string
  publishedAt: string
  excerpt: string
  mainImage?: {
    asset: {
      _ref: string
    }
  }
  categories: Array<{
    title: string
  }>
}

interface Category {
  _id: string
  title: string
  description?: string
}

export default function BlogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  )
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('q') || ''
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const postsPerPage = 9

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const query = groq`*[_type == "category"] {
          _id,
          title,
          description
        }`
        const result = await client.fetch(query)
        setCategories(result)
      } catch (err) {
        const errorMessage = handleSanityError(err);
        console.error('Error fetching categories:', err)
        setError('無法載入文章分類：' + errorMessage)
        toast.error('無法載入文章分類')
      }
    }

    const fetchPosts = async () => {
      try {
        const query = groq`*[_type == "post" ${
          searchQuery
            ? `&& (title match "*${searchQuery}*" || excerpt match "*${searchQuery}*")`
            : ''
        }] | order(publishedAt desc) {
          _id,
          title,
          "slug": slug.current,
          publishedAt,
          excerpt,
          mainImage,
          categories[]->{
            title
          }
        }[${(page - 1) * postsPerPage}...${page * postsPerPage}]`
        const result = await client.fetch(query)
        if (result.length < postsPerPage) {
          setHasMore(false)
        }
        setPosts(prev => (page === 1 ? result : [...prev, ...result]))
        setLoading(false)
      } catch (err) {
        const errorMessage = handleSanityError(err);
        console.error('Error fetching posts:', err)
        setError('無法載入文章列表：' + errorMessage)
        toast.error('無法載入文章列表')
        setLoading(false)
      }
    }

    fetchCategories()
    fetchPosts()
  }, [page, searchQuery])

  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value)
    setPage(1)
    setHasMore(true)
    setPosts([]) // 清空當前文章，避免舊的搜索結果混合
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    router.push(`/blog?${params.toString()}`)
  }, 500)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/blog?${params.toString()}`)
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post =>
        post.categories.some(cat => cat.title === selectedCategory)
      )

  const featuredPost = filteredPosts[0]

  if (error) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-red-50 p-6 rounded-xl border border-red-100">
            <h1 className="text-2xl font-bold text-red-700 mb-4">載入錯誤</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
              >
                重新整理
              </button>
              <Link 
                href="/studio"
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors text-center"
              >
                前往 Sanity Studio 檢查
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            專業知識庫
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            分享牙醫診所經營與行銷的專業知識，協助您掌握產業趨勢，提升診所競爭力。
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="search"
                placeholder="搜尋文章..."
                defaultValue={searchQuery}
                onChange={e => debouncedSearch(e.target.value)}
                className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <svg
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Featured Post */}
          {loading && page === 1 ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12 animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-w-16 aspect-h-9 lg:aspect-none lg:h-full bg-gray-200" />
                <div className="p-8 lg:p-12">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="h-8 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            </div>
          ) : featuredPost ? (
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12 group hover:shadow-xl transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-w-16 aspect-h-9 lg:aspect-none lg:h-full relative">
                    {featuredPost.mainImage ? (
                      <Image
                        src={urlForImage(featuredPost.mainImage).url()}
                        alt={featuredPost.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="p-8 lg:p-12">
                    <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-2">
                      {featuredPost.categories && featuredPost.categories.length > 0 ? (
                        featuredPost.categories.map((category, index) => (
                          <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                            {category.title}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                          未分類
                        </span>
                      )}
                      <span className="text-gray-500">
                        {format(new Date(featuredPost.publishedAt), 'PPP', {
                          locale: zhTW,
                        })}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                    <span className="text-primary font-semibold group-hover:underline">
                      閱讀全文 →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : null}

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => handleCategoryChange('all')}
            >
              全部文章
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedCategory === category.title
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryChange(category.title)}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {loading && page === 1 ? (
              [1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="h-6 bg-gray-200 rounded mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))
            ) : (
              <>
                {filteredPosts.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-xl text-gray-600">
                      {searchQuery
                        ? `找不到與「${searchQuery}」相關的文章`
                        : '目前還沒有文章'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* 如果有特色文章，則展示除了第一篇之外的所有文章 */}
                    {featuredPost 
                      ? filteredPosts.slice(1).map((post) => (
                          <Link key={post._id} href={`/blog/${post.slug}`}>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow h-full">
                              <div className="aspect-w-16 aspect-h-9 relative">
                                {post.mainImage ? (
                                  <Image
                                    src={urlForImage(post.mainImage).url()}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200" />
                                )}
                              </div>
                              <div className="p-6">
                                <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-2">
                                  {post.categories && post.categories.length > 0 ? (
                                    post.categories.map((category, index) => (
                                      <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                                        {category.title}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                                      未分類
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                <span className="text-primary font-semibold group-hover:underline">
                                  閱讀全文 →
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))
                      : filteredPosts.map((post) => (
                          <Link key={post._id} href={`/blog/${post.slug}`}>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow h-full">
                              <div className="aspect-w-16 aspect-h-9 relative">
                                {post.mainImage ? (
                                  <Image
                                    src={urlForImage(post.mainImage).url()}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200" />
                                )}
                              </div>
                              <div className="p-6">
                                <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-2">
                                  {post.categories && post.categories.length > 0 ? (
                                    post.categories.map((category, index) => (
                                      <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                                        {category.title}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                                      未分類
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                <span className="text-primary font-semibold group-hover:underline">
                                  閱讀全文 →
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))
                    }
                    {loading && page > 1 && (
                      <div className="col-span-full flex justify-center py-8">
                        <Spinner />
                      </div>
                    )}
                    {!loading && hasMore && filteredPosts.length > 0 && (
                      <div className="col-span-full flex justify-center py-8">
                        <button
                          onClick={loadMore}
                          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
                        >
                          載入更多
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Newsletter Section */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">訂閱電子報</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              定期收到最新的牙醫診所經營與行銷資訊，掌握產業趨勢與實用策略。
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="請輸入您的電子郵件"
                className="flex-1 px-6 py-3 rounded-full text-gray-900"
              />
              <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
                訂閱
              </button>
            </div>
          </div>
        </div>
      </main>
    </ErrorBoundary>
  )
} 