'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { urlForImage } from '@/lib/sanity/client'
import { Post, BlogSettings, Category } from '@/types/blog'
import { SubscriptionForm } from '../common/blog/SubscriptionForm'
import { BackToTop } from '../common/blog/BackToTop'
import { Loading } from '../common/Loading'
import Image from 'next/image'
import Link from 'next/link'

interface BlogPageProps {
  posts: Post[]
  settings: BlogSettings
  hasMore: boolean
  categories: Category[]
  currentPage: number
  totalPages: number
}

export const BlogPage = ({
  posts: initialPosts,
  settings,
  hasMore: initialHasMore,
  categories,
  currentPage: initialPage,
  totalPages,
}: BlogPageProps) => {
  const [posts, setPosts] = useState(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const loadMore = async () => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    try {
      const nextPage = currentPage + 1
      const response = await fetch(`/api/posts?page=${nextPage}&category=${selectedCategory}&search=${searchTerm}`)
      const data = await response.json()
      
      setPosts(prev => [...prev, ...data.posts])
      setHasMore(data.hasMore)
      setCurrentPage(nextPage)
    } catch (error) {
      console.error('載入更多文章時發生錯誤:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = async (category: string) => {
    setIsLoading(true)
    setSelectedCategory(category)
    try {
      const response = await fetch(`/api/posts?page=1&category=${category}&search=${searchTerm}`)
      const data = await response.json()
      
      setPosts(data.posts)
      setHasMore(data.hasMore)
      setCurrentPage(1)
    } catch (error) {
      console.error('切換分類時發生錯誤:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts?page=1&category=${selectedCategory}&search=${searchTerm}`)
      const data = await response.json()
      
      setPosts(data.posts)
      setHasMore(data.hasMore)
      setCurrentPage(1)
    } catch (error) {
      console.error('搜尋文章時發生錯誤:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 標題區塊 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">{settings.title}</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {settings.description}
        </p>
      </motion.div>

      {/* 搜尋和篩選 */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category.slug
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋文章..."
            className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            搜尋
          </button>
        </form>
      </div>

      {/* 文章列表 */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loading size="lg" theme="primary" text="載入中..." />
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link href={`/blog/${post.slug}`} key={post._id}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {post.mainImage && (
                  <div className="relative aspect-video">
                    <Image
                      src={urlForImage(post.mainImage).url()}
                      alt={post.mainImage.alt || post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.map((category) => (
                      <span
                        key={category._id}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {category.title}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{format(new Date(post.publishedAt), 'PPP', { locale: zhTW })}</span>
                    <span>{post.readingTime} 分鐘閱讀</span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">沒有找到相關文章</p>
        </div>
      )}

      {/* 載入更多按鈕 */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className={`px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? '載入中...' : '載入更多'}
          </button>
        </div>
      )}

      {/* 訂閱表單 */}
      <div className="mt-16">
        <SubscriptionForm />
      </div>

      {/* 回到頂部按鈕 */}
      <BackToTop />
    </div>
  )
} 