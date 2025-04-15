'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Share2, Heart, FacebookIcon, TwitterIcon, LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BlogContent } from '@/components/blog'
import { Post, formatDate } from '@/lib/blog-utils'
import toast from 'react-hot-toast'

// 共用樣式常數
const BUTTON_BASE_STYLES = "flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors"
const BUTTON_LIKED_STYLES = "bg-red-50 text-red-500"
const BUTTON_DEFAULT_STYLES = "bg-gray-100 text-gray-600 hover:bg-gray-200"
const SHARE_BUTTON_STYLES = "flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

interface BlogDetailProps {
  post: Post
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const shareButtonRef = useRef<HTMLButtonElement>(null)

  // 基於文章ID生成固定的點讚基數，確保相同文章每次渲染點讚數一致
  useEffect(() => {
    // 將文章ID轉換為數字（簡單雜湊）
    let seed = 0
    for (let i = 0; i < post.id.length; i++) {
      seed += post.id.charCodeAt(i)
    }
    
    // 基於雜湊生成一個10-60之間的固定數字
    const baseLikes = 10 + (seed % 50)
    
    // 檢查文章是否已經被點讚
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    if (likedPosts[post.id]) {
      setIsLiked(true)
      setLikeCount(baseLikes + 1)
    } else {
      setLikeCount(baseLikes)
    }
  }, [post.id])

  // 監聽點擊事件以關閉分享選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current && 
        !shareMenuRef.current.contains(event.target as Node) &&
        shareButtonRef.current && 
        !shareButtonRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 處理點讚
  const handleLike = () => {
    // 更新點讚狀態
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    
    // 更新點讚數量
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1)
    
    // 保存到本地存儲
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    if (newLikedState) {
      likedPosts[post.id] = true
      toast.success("感謝您的喜歡！您的支持是我們創作的動力", {
        duration: 2000
      })
    } else {
      delete likedPosts[post.id]
    }
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
  }

  // 分享功能
  const toggleShareMenu = () => {
    setShowShareMenu(prev => !prev)
  }

  // 獲取完整的文章網址（包含網站域名）
  const getFullArticleUrl = () => {
    // 獲取站點URL，如果未定義則使用當前窗口位置
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    (typeof window !== 'undefined' ? window.location.origin : 'https://www.aideamed.com')
    // 使用window.location.pathname獲取當前路徑，確保始終使用當前頁面的實際URL
    const path = typeof window !== 'undefined' ? window.location.pathname : `/blog/${post.slug}`
    return `${siteUrl}${path}`
  }

  const shareOnFacebook = () => {
    const url = encodeURIComponent(getFullArticleUrl())
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
    setShowShareMenu(false)
  }

  const shareOnTwitter = () => {
    const url = encodeURIComponent(getFullArticleUrl())
    const text = encodeURIComponent(post.title)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
    setShowShareMenu(false)
  }

  const shareOnLine = () => {
    const url = encodeURIComponent(getFullArticleUrl())
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, '_blank')
    setShowShareMenu(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(getFullArticleUrl())
    setShowShareMenu(false)
    toast.success("連結已複製到剪貼簿", {
      duration: 2000
    })
  }
  
  // 添加在最後面，export default 之前
  const styles = `
    /* 確保文章中的 div 元素顯示 */
    .prose div {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      min-height: 20px;
    }
    
    /* 自定義區塊樣式 */
    .prose div.stat-highlight,
    .prose div.response-model,
    .prose div.action-checklist,
    .prose div.case-study,
    .prose div.pro-tip,
    .prose div.action-plan,
    .prose div.cta-section,
    .prose div.warning-box,
    .prose div.info-box,
    .prose div.note-box,
    .prose div.image-gallery,
    .prose div.expert-quote,
    .prose div.product-recommendation,
    .prose div.timeline,
    .prose div.step-guide {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      margin: 2rem 0 !important;
      padding: 1rem !important;
      border-radius: 0.5rem !important;
    }
    
    /* 排除聊天組件受到文章樣式的影響 */
    .prose div.respondio-webchat,
    .prose div.respondio-launcher,
    .prose div[id^="respondio"] {
      position: fixed !important;
      display: block !important;
      visibility: visible !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    /* 確保聊天組件內部元素正常顯示 */
    .prose div.respondio-webchat *,
    .prose div.respondio-launcher * {
      display: inherit !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  `;

  return (
    <article className="py-12 bg-white">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 回到文章列表 */}
          <Link 
            href="/blog" 
            className="inline-flex items-center text-gray-600 hover:text-primary mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回行銷新知
          </Link>
          
          {/* 封面圖片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] w-full rounded-xl overflow-hidden mb-8"
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            {post.category && (
              <span className="absolute top-6 left-6 bg-white/90 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
                {post.category}
              </span>
            )}
          </motion.div>
          
          {/* 文章標題區塊 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            {/* 主標題 */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-900 tracking-tight">
              {post.title}
            </h1>
            
            {/* 副標題/摘要 */}
            {post.summary && (
              <p className="text-xl text-gray-600 font-normal mt-4 leading-relaxed">
                {post.summary}
              </p>
            )}
          </motion.div>
          
          {/* 文章元信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-between mb-10 py-4 border-y border-gray-200"
          >
            <div className="flex items-center">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="rounded-full mr-4 border-2 border-white shadow-sm"
                />
              )}
              <div>
                <div className="font-semibold text-gray-900">{post.author.name}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(post.publishedAt)}
                  {post.updatedAt && post.updatedAt !== post.publishedAt && (
                    <span> (更新於 {formatDate(post.updatedAt)})</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* 點讚按鈕 */}
              <button
                onClick={handleLike}
                className={cn(
                  BUTTON_BASE_STYLES,
                  isLiked ? BUTTON_LIKED_STYLES : BUTTON_DEFAULT_STYLES
                )}
                aria-label={isLiked ? "取消喜歡文章" : "喜歡文章"}
              >
                <Heart className={cn(
                  "h-4 w-4", 
                  isLiked && "fill-red-500 text-red-500"
                )} />
                <span className="text-xs font-medium">{likeCount}</span>
              </button>
              
              {/* 分享按鈕 */}
              <div className="relative">
                <button
                  ref={shareButtonRef}
                  onClick={toggleShareMenu}
                  className={cn(BUTTON_BASE_STYLES, BUTTON_DEFAULT_STYLES)}
                  aria-expanded={showShareMenu}
                  aria-haspopup="true"
                  aria-label="分享文章"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs font-medium">分享</span>
                </button>
                
                {showShareMenu && (
                  <div 
                    ref={shareMenuRef}
                    className="share-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10"
                    role="menu"
                  >
                    <div className="py-1">
                      <button
                        onClick={shareOnFacebook}
                        className={SHARE_BUTTON_STYLES}
                        role="menuitem"
                      >
                        <FacebookIcon className="h-4 w-4 mr-2" />
                        分享到 Facebook
                      </button>
                      <button
                        onClick={shareOnTwitter}
                        className={SHARE_BUTTON_STYLES}
                        role="menuitem"
                      >
                        <TwitterIcon className="h-4 w-4 mr-2" />
                        分享到 Twitter
                      </button>
                      <button
                        onClick={shareOnLine}
                        className={SHARE_BUTTON_STYLES}
                        role="menuitem"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2 fill-current">
                          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.433.596-.065.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.066-.022.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                        </svg>
                        分享到 LINE
                      </button>
                      <button
                        onClick={copyLink}
                        className={SHARE_BUTTON_STYLES}
                        role="menuitem"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        複製連結
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* 文章內容 */}
          <BlogContent content={post.content} />
          
          {/* 文章標籤 */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">相關標籤</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default BlogDetail 