'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Share2, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  BlogContent, 
  BlogTableOfContents, 
  BlogMobileTableOfContents, 
  BlogReadingProgress, 
  BlogPerformanceOptimizer, 
  BlogMobileOptimizer 
} from '@/components/blog'
import { Post, formatDate } from '@/lib/blog-utils'
import { useBlogInteraction } from './hooks'
import { RelatedPostCard, ShareMenu } from './components'
import { BLOG_STYLES } from './types'

interface BlogDetailProps {
  post: Post
  relatedPosts?: Post[]
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post, relatedPosts = [] }) => {
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const shareButtonRef = useRef<HTMLButtonElement>(null)
  
  // 使用統一的互動 hook
  const {
    isLiked,
    likeCount,
    handleLike,
    showShareMenu,
    toggleShareMenu,
    shareOnFacebook,
    shareOnTwitter,
    shareOnLine,
    copyLink
  } = useBlogInteraction({ post })

  // 監聽點擊事件以關閉分享選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current && 
        !shareMenuRef.current.contains(event.target as Node) &&
        shareButtonRef.current && 
        !shareButtonRef.current.contains(event.target as Node)
      ) {
        // 這裡需要一個關閉分享選單的方法
        if (showShareMenu) {
          toggleShareMenu()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareMenu, toggleShareMenu])
  
  // 處理標籤點擊
  const handleTagClick = (tag: string) => {
    // 導航到帶有標籤篩選的 blog 頁面
    window.location.href = `/blog?tag=${encodeURIComponent(tag)}`
  }

  // 計算圖片數量和內容長度用於性能監控
  const imagesCount = (post.content.match(/<img[^>]*>/g) || []).length
  const contentLength = post.content.length

  return (
    <BlogMobileOptimizer>
      <BlogPerformanceOptimizer 
        postId={post.slug}
        contentLength={contentLength}
        imagesCount={imagesCount}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* 閱讀進度條 */}
        <BlogReadingProgress />
        
        {/* 桌面版目錄 */}
        <BlogTableOfContents content={post.content} />
        
        {/* 移動端目錄 */}
        <BlogMobileTableOfContents content={post.content} />

        <article className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* 文章標題區域 */}
          <header className="mb-8 sm:mb-12">
            <div className="text-center">
              {/* 分類標籤 */}
              {post.category && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
            >
                  <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                  {post.category}
                </span>
                </motion.div>
              )}
            
              {/* 文章標題 */}
              <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            >
                {post.title}
              </motion.h1>
              
              {/* 文章摘要 */}
              {post.summary && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
            >
                  {post.summary}
                </motion.p>
              )}
            
              {/* 文章元資訊 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-sm text-gray-500"
              >
                {/* 作者資訊 */}
                {post.author && (
                  <div className="flex items-center space-x-3">
                    {post.author.avatar && (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{post.author.name}</div>
                      {post.author.title && (
                        <div className="text-xs text-gray-500">{post.author.title}</div>
                      )}
                    </div>
                    </div>
                  )}

                {/* 發布日期 */}
                <div className="flex items-center space-x-4">
                  <span>發布於 {formatDate(post.publishedAt)}</span>
                  {post.readTime && <span>• {post.readTime} 分鐘閱讀</span>}
                </div>
              </motion.div>
            </div>
          </header>
            
          {/* 封面圖片 */}
          {post.coverImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8 sm:mb-12"
          >
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
              </div>
            </motion.div>
          )}

          {/* 文章內容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <BlogContent content={post.content} />
          </motion.div>
          
          {/* 文章底部互動區 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="border-t border-gray-200 pt-8 mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              {/* 標籤 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            
              {/* 互動按鈕 */}
              <div className="flex items-center space-x-4">
                {/* 點讚按鈕 */}
              <button
                onClick={handleLike}
                className={cn(
                    BLOG_STYLES.BUTTON_BASE,
                    isLiked ? BLOG_STYLES.BUTTON_LIKED : BLOG_STYLES.BUTTON_DEFAULT
                )}
              >
                  <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                  <span>{likeCount}</span>
              </button>
              
                {/* 分享按鈕 */}
              <div className="relative">
                <button
                  ref={shareButtonRef}
                  onClick={toggleShareMenu}
                    className={cn(BLOG_STYLES.BUTTON_BASE, BLOG_STYLES.BUTTON_DEFAULT)}
                >
                    <Share2 className="w-4 h-4" />
                    <span>分享</span>
                      </button>
                  
                  {/* 分享選單 */}
                  <ShareMenu
                      ref={shareMenuRef}
                    isVisible={showShareMenu}
                    onFacebookShare={shareOnFacebook}
                    onTwitterShare={shareOnTwitter}
                    onLineShare={shareOnLine}
                    onCopyLink={copyLink}
                  />
                    </div>
              </div>
            </div>
          </motion.div>
          
          {/* 相關文章 */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="border-t border-gray-200 pt-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                相關文章
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <RelatedPostCard 
                    key={relatedPost.id}
                    post={relatedPost} 
                    index={index} 
                    originPostId={post.id}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </article>
        </div>
    </BlogMobileOptimizer>
  )
}

export default BlogDetail 