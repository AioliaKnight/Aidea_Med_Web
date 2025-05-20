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
import { 
  trackBlogView, 
  trackBlogInteraction, 
  trackRelatedBlogClick,
  trackBlogShare,
  trackUserBehavior
} from '@/lib/analytics'

// 共用樣式常數
const BUTTON_BASE_STYLES = "flex items-center space-x-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-colors"
const BUTTON_LIKED_STYLES = "bg-red-50 text-red-500"
const BUTTON_DEFAULT_STYLES = "bg-gray-100 text-gray-600 hover:bg-gray-200"
const SHARE_BUTTON_STYLES = "flex items-center w-full px-4 py-3 sm:py-2 text-sm text-gray-700 hover:bg-gray-100"

// 相關文章卡片組件
const RelatedPostCard: React.FC<{ post: Post, index: number, originPostId?: string }> = ({ post, index, originPostId }) => {
  // 處理點擊事件
  const handleClick = () => {
    if (originPostId) {
      trackRelatedBlogClick(originPostId, post.slug, post.title, index + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <Link href={`/blog/${post.slug}`} className="block" onClick={handleClick}>
        <div className="relative h-40 sm:h-48 w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform hover:scale-105 duration-500"
          />
          {post.category && (
            <span className="absolute top-3 left-3 bg-white/90 text-primary text-xs font-medium px-2 py-1 rounded-full">
              {post.category}
            </span>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 leading-tight line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatDate(post.publishedAt)}</span>
            {post.readTime && <span>{post.readTime} 分鐘閱讀</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

interface BlogDetailProps {
  post: Post
  relatedPosts?: Post[]
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post, relatedPosts = [] }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const shareButtonRef = useRef<HTMLButtonElement>(null)
  
  // 記錄頁面加載性能
  useEffect(() => {
    // 等待頁面完全加載
    window.addEventListener('load', () => {
      // 使用 Performance API 收集性能指標
      if (window.performance) {
        const navEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintEntries = window.performance.getEntriesByType('paint');
        
        let firstContentfulPaint = 0;
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          firstContentfulPaint = fcpEntry.startTime;
        }
        
        // 追蹤內容加載性能
        trackUserBehavior('content_load', 'blog', post.id, 0);
      }
    });
    
    // 追蹤文章瀏覽
    trackBlogView(post.id, post.title, post.category, post.author?.name);
  }, [post]);

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
      
      // 追蹤點讚事件
      trackBlogInteraction(post.id, post.title, 'like');
    } else {
      delete likedPosts[post.id]
      
      // 追蹤取消點讚事件
      trackBlogInteraction(post.id, post.title, 'unlike');
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
    
    // 追蹤分享事件
    trackBlogShare(post.id, post.title, 'facebook');
  }

  const shareOnTwitter = () => {
    const url = encodeURIComponent(getFullArticleUrl())
    const text = encodeURIComponent(post.title)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
    setShowShareMenu(false)
    
    // 追蹤分享事件
    trackBlogShare(post.id, post.title, 'twitter');
  }

  const shareOnLine = () => {
    const url = encodeURIComponent(getFullArticleUrl())
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, '_blank')
    setShowShareMenu(false)
    
    // 追蹤分享事件
    trackBlogShare(post.id, post.title, 'line');
  }

  const copyLink = () => {
    navigator.clipboard.writeText(getFullArticleUrl())
    setShowShareMenu(false)
    toast.success("連結已複製到剪貼簿", {
      duration: 2000
    })
    
    // 追蹤複製連結事件
    trackBlogShare(post.id, post.title, 'copy');
  }
  
  // 處理標籤點擊
  const handleTagClick = (tag: string) => {
    // 導航到標籤頁面
    window.location.href = `/blog?tag=${encodeURIComponent(tag)}`
    
    // 追蹤標籤點擊
    trackUserBehavior('tag_click', 'blog', tag);
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
    .prose div.step-guide,
    .prose div.legal-note,
    .prose div.faq-section,
    .prose div.faq-item {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      margin: 1.5rem 0 !important;
      padding: 0.75rem !important;
      border-radius: 0.5rem !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
      position: relative !important;
      z-index: 1 !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    
    @media (min-width: 640px) {
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
      .prose div.step-guide,
      .prose div.legal-note,
      .prose div.faq-section,
      .prose div.faq-item {
        margin: 2rem 0 !important;
        padding: 1rem !important;
      }
    }
    
    /* 設定 legal-note 樣式 */
    .prose div.legal-note {
      border-left: 4px solid #6b7280 !important;
      background-color: #f9fafb !important;
    }
    
    /* 法規依據內部樣式 */
    .prose div.legal-note h4 {
      display: flex !important;
      align-items: center !important;
      font-weight: 600 !important;
      color: #1f2937 !important;
      margin-bottom: 0.75rem !important;
      font-size: 1rem !important;
    }
    
    @media (min-width: 640px) {
      .prose div.legal-note h4 {
        font-size: 1.125rem !important;
      }
    }
    
    .prose div.legal-note h4:before {
      content: '⚖️' !important;
      margin-right: 0.5rem !important;
    }
    
    .prose div.legal-note p {
      color: #4b5563 !important;
      margin-bottom: 0.5rem !important;
      font-size: 0.9375rem !important;
    }
    
    @media (min-width: 640px) {
      .prose div.legal-note p {
        font-size: 1rem !important;
      }
    }
    
    .prose div.legal-note ul {
      list-style-type: disc !important;
      padding-left: 1.25rem !important;
      margin-top: 0.5rem !important;
    }
    
    @media (min-width: 640px) {
      .prose div.legal-note ul {
        padding-left: 1.5rem !important;
      }
    }
    
    .prose div.legal-note li {
      color: #4b5563 !important;
      margin-bottom: 0.25rem !important;
      display: list-item !important;
      font-size: 0.9375rem !important;
    }
    
    @media (min-width: 640px) {
      .prose div.legal-note li {
        font-size: 1rem !important;
      }
    }
    
    /* FAQ區塊樣式 */
    .prose div.faq-section {
      padding: 0 !important;
      overflow: hidden !important;
      border: 1px solid #e5e7eb !important;
      background-color: #ffffff !important;
    }
    
    .prose div.faq-section h3 {
      background-color: rgba(230, 39, 51, 0.1) !important;
      color: #e62733 !important;
      font-weight: 700 !important;
      padding: 0.75rem 1rem !important;
      margin: 0 !important;
      font-size: 1rem !important;
      line-height: 1.5 !important;
      display: block !important;
    }
    
    @media (min-width: 640px) {
      .prose div.faq-section h3 {
        padding: 1rem !important;
        font-size: 1.125rem !important;
      }
    }
    
    .prose div.faq-item {
      border-bottom: 1px solid #e5e7eb !important;
      margin: 0 !important;
      padding: 1rem !important;
    }
    
    @media (min-width: 640px) {
      .prose div.faq-item {
        padding: 1.5rem !important;
      }
    }
    
    .prose div.faq-item:last-child {
      border-bottom: none !important;
    }
    
    .prose div.faq-item h4 {
      font-size: 1rem !important;
      font-weight: 600 !important;
      color: #e62733 !important;
      margin-bottom: 0.75rem !important;
      display: block !important;
    }
    
    @media (min-width: 640px) {
      .prose div.faq-item h4 {
        font-size: 1.125rem !important;
      }
    }
    
    .prose div.faq-item p {
      color: #4b5563 !important;
      margin-bottom: 0.5rem !important;
      display: block !important;
      font-size: 0.9375rem !important;
    }
    
    @media (min-width: 640px) {
      .prose div.faq-item p {
        font-size: 1rem !important;
      }
    }
    
    .prose div.faq-item ul {
      list-style-type: disc !important;
      padding-left: 1.25rem !important;
      margin-top: 0.5rem !important;
    }
    
    @media (min-width: 640px) {
      .prose div.faq-item ul {
        padding-left: 1.5rem !important;
      }
    }
    
    .prose div.faq-item li {
      color: #4b5563 !important;
      margin-bottom: 0.25rem !important;
      display: list-item !important;
      font-size: 0.9375rem !important;
    }
    
    @media (min-width: 640px) {
      .prose div.faq-item li {
        font-size: 1rem !important;
      }
    }

    /* CTA區塊樣式強化 */
    .prose div.cta-section {
      display: block !important;
      background-color: #ebf5ff !important;
      padding: 1.5rem 1rem !important;
      border-radius: 0.5rem !important;
      margin: 1.5rem 0 !important;
      text-align: center !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    }
    
    @media (min-width: 640px) {
      .prose div.cta-section {
        padding: 2rem !important;
        margin: 2rem 0 !important;
      }
    }
    
    .prose div.cta-section h3 {
      color: #1e40af !important;
      font-weight: 700 !important;
      font-size: 1.25rem !important;
      margin-bottom: 0.75rem !important;
      display: block !important;
    }
    
    @media (min-width: 640px) {
      .prose div.cta-section h3 {
        font-size: 1.5rem !important;
        margin-bottom: 1rem !important;
      }
    }
    
    .prose div.cta-section p {
      color: #1e3a8a !important;
      margin-bottom: 1rem !important;
      display: block !important;
      font-size: 0.9375rem !important;
    }
    
    @media (min-width: 640px) {
      .prose div.cta-section p {
        margin-bottom: 1.5rem !important;
        font-size: 1rem !important;
      }
    }
    
    .prose div.cta-section a.cta-button {
      display: inline-block !important;
      background-color: #2563eb !important;
      color: white !important;
      font-weight: 600 !important;
      padding: 0.625rem 1.5rem !important;
      border-radius: 0.375rem !important;
      text-decoration: none !important;
      transition: background-color 0.2s !important;
      font-size: 0.9375rem !important;
    }
    
    @media (min-width: 640px) {
      .prose div.cta-section a.cta-button {
        padding: 0.75rem 2rem !important;
        font-size: 1rem !important;
      }
    }
    
    .prose div.cta-section a.cta-button:hover {
      background-color: #1d4ed8 !important;
      text-decoration: none !important;
    }
    
    /* 行動裝置 touch targets 優化 */
    @media (max-width: 640px) {
      .prose a {
        padding: 0.125rem 0 !important;
      }
      
      .prose div a.cta-button {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        padding: 0.75rem 1rem !important;
      }
    }
    
    /* 確保所有區塊內元素在低級瀏覽器中也能正確顯示 */
    .prose div h1, .prose div h2, .prose div h3, 
    .prose div h4, .prose div h5, .prose div h6,
    .prose div p, .prose div ul, .prose div ol,
    .prose div li, .prose div blockquote, .prose div pre,
    .prose div img, .prose div figure, .prose div table {
      visibility: visible !important;
      opacity: 1 !important;
      display: initial !important;
    }
    
    /* 特別處理標題元素 */
    .prose div h1, .prose div h2, .prose div h3, 
    .prose div h4, .prose div h5, .prose div h6 {
      display: block !important;
    }
    
    /* 特別處理段落元素 */
    .prose div p {
      display: block !important;
    }
    
    /* 特別處理列表元素 */
    .prose div ul, .prose div ol {
      display: block !important;
    }
    
    .prose div li {
      display: list-item !important;
    }
  `

  // 在頂層渲染樣式標籤，改進注入方式，確保最高優先級
  useEffect(() => {
    // 檢查是否已存在樣式標籤
    const existingStyle = document.getElementById('blog-detail-styles');
    if (!existingStyle) {
      const styleTag = document.createElement('style');
      styleTag.id = 'blog-detail-styles';
      styleTag.innerHTML = styles;
      // 將樣式標籤放在head最後，確保優先級最高
      document.head.appendChild(styleTag);
    } else {
      // 如果已經存在，更新它的內容確保樣式最新
      existingStyle.innerHTML = styles;
    }
    
    // 添加額外的在線樣式修復，直接操作DOM確保自定義區塊正確顯示
    setTimeout(() => {
      const customBlocks = document.querySelectorAll('.prose div.cta-section, .prose div.legal-note, .prose div.faq-section, .prose div.faq-item');
      customBlocks.forEach(block => {
        if (block instanceof HTMLElement) {
          block.style.display = 'block';
          block.style.visibility = 'visible';
          block.style.opacity = '1';
          
          // 對子元素也應用樣式
          const children = block.querySelectorAll('*');
          children.forEach(child => {
            if (child instanceof HTMLElement) {
              child.style.display = '';
              child.style.visibility = 'visible';
              child.style.opacity = '1';
            }
          });
        }
      });
    }, 100);
    
    return () => {
      // 組件卸載時移除樣式
      const styleTag = document.getElementById('blog-detail-styles');
      if (styleTag) {
        document.head.removeChild(styleTag);
      }
    };
  }, []);

  return (
    <article className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 回到文章列表 - 增加觸控區域 */}
          <Link 
            href="/blog" 
            className="inline-flex items-center text-gray-600 hover:text-primary mb-6 sm:mb-8 py-2"
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
          
          {/* 封面圖片 - 調整高度 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[280px] sm:h-[400px] w-full rounded-xl overflow-hidden mb-6 sm:mb-8"
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            {post.category && (
              <span className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/90 text-primary text-xs sm:text-sm font-medium px-3 py-1 sm:px-4 sm:py-1.5 rounded-full">
                {post.category}
              </span>
            )}
          </motion.div>
          
          {/* 文章標題區塊 - 調整文字大小和間距 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 sm:mb-8"
          >
            {/* 主標題 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight text-gray-900 tracking-tight">
              {post.title}
            </h1>
            
            {/* 副標題/摘要 */}
            {post.summary && (
              <p className="text-lg sm:text-xl text-gray-600 font-normal mt-3 sm:mt-4 leading-relaxed">
                {post.summary}
              </p>
            )}
          </motion.div>
          
          {/* AI優化摘要區塊 - 改善間距 */}
          {post.summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-6 sm:mb-8 bg-gray-50 rounded-lg p-4 sm:p-6 border-l-4 border-primary"
            >
              <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">文章重點摘要</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 mb-3">{post.summary}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-sm text-gray-600 font-medium">關鍵字：</span>
                    {post.tags.map((tag, index) => (
                      <span key={tag} className="text-sm text-primary font-medium">
                        {tag}{index < post.tags.length - 1 ? '、' : ''}
                      </span>
                    ))}
                  </div>
                )}
                {post.readTime && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">閱讀時間：</span> 約 {post.readTime} 分鐘
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* 文章元信息 - 優化間距與觸控 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap sm:flex-nowrap items-center justify-between mb-8 sm:mb-10 py-4 border-y border-gray-200 gap-y-4"
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
            
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              {/* 點讚按鈕 - 增加觸控區域 */}
              <button
                onClick={handleLike}
                className={cn(
                  BUTTON_BASE_STYLES,
                  "min-w-[70px] justify-center",
                  isLiked ? BUTTON_LIKED_STYLES : BUTTON_DEFAULT_STYLES
                )}
                aria-label={isLiked ? "取消喜歡文章" : "喜歡文章"}
              >
                <Heart className={cn(
                  "h-4 w-4", 
                  isLiked && "fill-red-500 text-red-500"
                )} />
                <span className="text-xs sm:text-sm font-medium">{likeCount}</span>
              </button>
              
              {/* 分享按鈕 - 增加觸控區域 */}
              <div className="relative">
                <button
                  ref={shareButtonRef}
                  onClick={toggleShareMenu}
                  className={cn(BUTTON_BASE_STYLES, "min-w-[70px] justify-center", BUTTON_DEFAULT_STYLES)}
                  aria-expanded={showShareMenu}
                  aria-haspopup="true"
                  aria-label="分享文章"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">分享</span>
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
                          <path d="M19.365 9.863c.349 0 .63.285.631.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.433.596-.065.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.066-.022.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
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
          
          {/* 文章內容 - CSS樣式部分需更新 */}
          <BlogContent content={post.content} />
          
          {/* 文章標籤 - 增強移動端體驗 */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 sm:mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">相關標籤</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 sm:px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors mb-2"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* 相關文章區塊 - 優化移動端佈局 */}
          {relatedPosts && relatedPosts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 sm:mt-16 pt-8 border-t border-gray-200"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">延伸閱讀</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <RelatedPostCard 
                    key={relatedPost.slug} 
                    post={relatedPost} 
                    index={index} 
                    originPostId={post.id}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </article>
  )
}

export default BlogDetail 