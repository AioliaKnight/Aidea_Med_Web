'use client'

import React, { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram, ExternalLink, Heart, MessageCircle, RefreshCw } from 'lucide-react'
import { useInstagram, type InstagramPost } from '@/hooks/useInstagram'

// 格式化時間（移動到這裡以減少代碼重複）

// 格式化時間
const formatTimeAgo = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 24) {
    return `${diffInHours}小時前`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}天前`
  }
}

// Instagram 貼文卡片組件
const InstagramPostCard = memo(({ post, index }: { post: InstagramPost; index: number }) => {
  const [imageError, setImageError] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
    >
      {/* 圖片區域 */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageError ? '/images/blog/default_lg.jpg' : post.media_url}
          alt={post.caption.slice(0, 100) + '...'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        
        {/* Instagram 標誌覆蓋 */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full p-2">
          <Instagram className="w-4 h-4 text-white" />
        </div>
        
        {/* 互動數據覆蓋 */}
        {(post.like_count || post.comments_count) && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center justify-between text-white text-sm">
              {post.like_count && (
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{post.like_count}</span>
                </div>
              )}
              {post.comments_count && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments_count}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* 內容區域 */}
      <div className="p-4">
        {/* 時間標記 */}
        <div className="text-gray-500 text-xs mb-2">
          {formatTimeAgo(post.timestamp)}
        </div>
        
        {/* 貼文內容 */}
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-3">
          {post.caption}
        </p>
        
        {/* 查看更多按鈕 */}
        <Link
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium transition-colors"
        >
          <span>在 Instagram 查看</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  )
})

// 主要 Instagram Feed 組件
const InstagramFeed = memo(function InstagramFeed() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })
  
  // 使用 Instagram hook 獲取資料
  const { posts, loading, error, refetch } = useInstagram()
  
  return (
    <section ref={ref} className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 標題區域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Instagram className="w-4 h-4" />
            <span>Instagram 動態</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            最新動態與洞察
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            關注我們的 Instagram，獲取最新的醫療行銷洞察、成功案例分享，以及行業趨勢分析
          </p>
        </motion.div>
        
        {/* Instagram 貼文網格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {posts.slice(0, 6).map((post, index) => (
            <InstagramPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
        
        {/* 載入狀態 */}
        {loading && !posts.length && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 錯誤狀態 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 p-6 bg-yellow-50 rounded-lg border border-yellow-200"
          >
            <p className="text-yellow-800 mb-4">載入 Instagram 內容時發生問題</p>
            <button
              onClick={() => refetch()}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              重新載入
            </button>
          </motion.div>
        )}
        
        {/* 關注按鈕 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="https://www.instagram.com/aidea.med/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Instagram className="w-5 h-5" />
            <span>關注 @aidea.med</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
})

export default InstagramFeed 