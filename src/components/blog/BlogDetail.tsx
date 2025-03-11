'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { Post } from '@/types/blog'
import BlogPost from './BlogPost'
import Loading from '../common/Loading'
import { BackToTop } from '../common/blog/BackToTop'
import { ShareButtons } from '../common/blog/ShareButtons'
import { TableOfContents } from '../common/blog/TableOfContents'
import SanityImage from '../common/blog/SanityImage'
import Link from 'next/link'
import ErrorBoundary from '../common/ErrorBoundary'

interface BlogDetailProps {
  post: Post
  recentPosts: Post[]
}

export default function BlogDetail({ post, recentPosts }: BlogDetailProps) {
  const [isLoading] = useState(false)
  const [showToc, setShowToc] = useState(false)

  // 監聽滾動以顯示/隱藏目錄
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setShowToc(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* 文章頭部背景 */}
        <div className="relative h-[40vh] md:h-[50vh] bg-primary">
          {post.mainImage && (
            <SanityImage
              image={post.mainImage}
              alt={post.mainImage.alt || post.title}
              className="object-cover opacity-20"
              fill
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-primary/90" />
          
          {/* 文章標題區 */}
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white relative z-10 max-w-4xl"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                {post.categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/blog/category/${category.slug}`}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
                <span>{format(new Date(post.publishedAt), 'PPP', { locale: zhTW })}</span>
                {post.updatedAt && (
                  <>
                    <span>•</span>
                    <span>更新於 {format(new Date(post.updatedAt), 'PPP', { locale: zhTW })}</span>
                  </>
                )}
                <span>•</span>
                <span>{post.readingTime} 分鐘閱讀</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 主要內容區 */}
        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 文章內容 */}
            <div className="lg:col-span-8 xl:col-span-9">
              <BlogPost post={post} />
            </div>

            {/* 側邊欄 */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-8">
              {/* 作者資訊卡片 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  {post.author?.image && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <SanityImage
                        image={post.author.image}
                        alt={post.author.name}
                        className="object-cover"
                        fill
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-lg">{post.author.name}</h3>
                    <p className="text-gray-500 text-sm">作者</p>
                  </div>
                </div>
                {post.author.bio && (
                  <p className="text-gray-600 text-sm">{post.author.bio}</p>
                )}
              </motion.div>

              {/* 文章目錄 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6 sticky top-24"
              >
                <h3 className="font-medium text-lg mb-4">目錄</h3>
                <TableOfContents post={post} />
              </motion.div>

              {/* 最新文章 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="font-medium text-lg mb-4">最新文章</h3>
                <div className="space-y-4">
                  {recentPosts.map((recentPost) => (
                    <Link
                      key={recentPost._id}
                      href={`/blog/${recentPost.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-4">
                        {recentPost.mainImage ? (
                          <div className="relative w-16 h-16 rounded overflow-hidden">
                            <SanityImage
                              image={recentPost.mainImage}
                              alt={recentPost.title}
                              className="object-cover"
                              fill
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">無圖片</span>
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {recentPost.title}
                          </h4>
                          <p className="text-gray-500 text-xs mt-1">
                            {format(new Date(recentPost.publishedAt), 'PP', { locale: zhTW })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* 分享按鈕 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="font-medium text-lg mb-4">分享文章</h3>
                <ShareButtons url={window.location.href} title={post.title} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* 回到頂部按鈕 */}
        <BackToTop />

        {/* 載入中狀態 */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Loading size="lg" theme="primary" text="載入中..." />
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
} 