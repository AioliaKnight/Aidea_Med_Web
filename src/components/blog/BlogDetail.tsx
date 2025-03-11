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
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'

interface BlogDetailProps {
  post: Post
  recentPosts: Post[]
}

export default function BlogDetail({ post, recentPosts }: BlogDetailProps) {
  const [isLoading] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  // 監聽滾動以顯示/隱藏目錄
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50/30">
        {/* 文章頭部 */}
        <div className="relative py-12 md:py-16 lg:py-20 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* 分類標籤 */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  {post.categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/blog/category/${category.slug}`}
                      className="px-4 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary rounded-full text-sm font-medium transition-colors"
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              )}
              
              {/* 標題 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                {post.title}
              </h1>

              {/* 文章資訊 */}
              <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{format(new Date(post.publishedAt), 'PPP', { locale: zhTW })}</span>
                </div>
                {post.updatedAt && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>更新於 {format(new Date(post.updatedAt), 'PPP', { locale: zhTW })}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>{post.readingTime} 分鐘閱讀</span>
                </div>
              </div>

              {/* 作者資訊 */}
              {post.author && (
                <div className="flex items-center gap-4 mt-8 p-6 bg-gray-50/50 rounded-xl">
                  {post.author.image && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-white">
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
                    <div className="flex items-center gap-2 mb-1">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                    </div>
                    {post.author.bio && (
                      <p className="text-gray-500 text-sm">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* 主要內容區 */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 文章內容 */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <BlogPost post={post} />
              </div>
            </div>

            {/* 側邊欄 */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-8">
              {/* 文章目錄 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 sticky top-24"
              >
                <h3 className="font-medium text-lg mb-4 text-gray-900">目錄</h3>
                <TableOfContents post={post} />
              </motion.div>

              {/* 最新文章 */}
              {recentPosts && recentPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h3 className="font-medium text-lg mb-4 text-gray-900">最新文章</h3>
                  <div className="space-y-4">
                    {recentPosts.map((recentPost) => (
                      <Link
                        key={recentPost._id}
                        href={`/blog/${recentPost.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-4">
                          {recentPost.mainImage ? (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                              <SanityImage
                                image={recentPost.mainImage}
                                alt={recentPost.title}
                                className="object-cover"
                                fill
                                sizes="80px"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">無圖片</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                              {recentPost.title}
                            </h4>
                            <p className="text-gray-500 text-xs mt-2">
                              {format(new Date(recentPost.publishedAt), 'PP', { locale: zhTW })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 分享按鈕 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="font-medium text-lg mb-4 text-gray-900">分享文章</h3>
                <ShareButtons url={currentUrl} title={post.title} />
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