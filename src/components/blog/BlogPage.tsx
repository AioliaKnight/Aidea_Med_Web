'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { urlForImage } from '@/lib/sanity/client'
import { Post, BlogSettings } from '@/types/blog'
import { SubscriptionForm } from '@/components/common/blog/SubscriptionForm'
import { BackToTop } from '@/components/common/blog/BackToTop'

interface BlogPageProps {
  posts: Post[]
  settings: BlogSettings
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

export const BlogPage = ({
  posts,
  settings,
  total,
  page,
  totalPages,
  hasMore,
}: BlogPageProps) => {
  const [currentPage, setCurrentPage] = useState(page)
  const [isLoading, setIsLoading] = useState(false)
  const [allPosts, setAllPosts] = useState(posts)

  const loadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/blog?page=${currentPage + 1}&limit=9`
      )
      const data = await response.json()
      setAllPosts((prev) => [...prev, ...data.posts])
      setCurrentPage(data.page)
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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

      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allPosts.map((post, index) => (
          <motion.article
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {post.mainImage && (
              <img
                src={urlForImage(post.mainImage).url()}
                alt={post.mainImage.alt || post.title}
                className="w-full aspect-video object-cover"
              />
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
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{format(new Date(post.publishedAt), 'PPP', { locale: zhTW })}</span>
                <span>{post.readingTime} 分鐘閱讀</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

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