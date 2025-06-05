'use client'

/**
 * Blog 互動功能統一 Hook
 * 集中管理點讚、分享、追蹤等互動功能
 */

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { 
  trackBlogView, 
  trackBlogInteraction, 
  trackBlogShare,
  trackUserBehavior
} from '@/lib/analytics'
import { Post } from '@/lib/blog-utils'

interface UseBlogInteractionProps {
  post: Post
}

interface UseBlogInteractionReturn {
  // 點讚相關
  isLiked: boolean
  likeCount: number
  handleLike: () => void
  
  // 分享相關
  showShareMenu: boolean
  toggleShareMenu: () => void
  shareOnFacebook: () => void
  shareOnTwitter: () => void
  shareOnLine: () => void
  copyLink: () => void
  
  // 工具函數
  getFullArticleUrl: () => string
}

export const useBlogInteraction = ({ post }: UseBlogInteractionProps): UseBlogInteractionReturn => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)

  // 初始化點讚狀態
  useEffect(() => {
    // 從 localStorage 讀取點讚狀態，兼容舊格式
    const likedPostsData = localStorage.getItem('likedPosts')
    let likedPosts: string[] = []
    let isPostLiked = false
    
    if (likedPostsData) {
      try {
        const parsed = JSON.parse(likedPostsData)
        
        // 檢查是否為舊的物件格式
        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          // 舊格式：{ "post-id": true }
          likedPosts = Object.keys(parsed).filter(key => parsed[key])
          isPostLiked = !!parsed[post.slug]
          
          // 轉換為新格式並保存
          localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
        } else if (Array.isArray(parsed)) {
          // 新格式：["post-id1", "post-id2"]
          likedPosts = parsed
          isPostLiked = likedPosts.includes(post.slug)
        }
      } catch (error) {
        console.warn('解析 likedPosts 數據失敗:', error)
        // 重置為空陣列
        likedPosts = []
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
      }
    }
    
    setIsLiked(isPostLiked)
    
    // 設置初始點讚數（這裡可以從 API 獲取真實數據）
    setLikeCount(Math.floor(Math.random() * 50) + 10)
    
    // 追蹤文章瀏覽
    trackBlogView(post.slug, post.title, post.category || '')
  }, [post.slug, post.title, post.category])

  // 處理點讚
  const handleLike = useCallback(() => {
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1)
    
    // 更新 localStorage，確保使用陣列格式
    const likedPostsData = localStorage.getItem('likedPosts')
    let likedPosts: string[] = []
    
    if (likedPostsData) {
      try {
        const parsed = JSON.parse(likedPostsData)
        
        // 確保轉換為陣列格式
        if (Array.isArray(parsed)) {
          likedPosts = parsed
        } else if (typeof parsed === 'object') {
          // 從舊格式轉換
          likedPosts = Object.keys(parsed).filter(key => parsed[key])
        }
      } catch (error) {
        console.warn('解析 likedPosts 數據失敗:', error)
        likedPosts = []
      }
    }
    
    // 更新陣列
    if (newLikedState) {
      if (!likedPosts.includes(post.slug)) {
        likedPosts.push(post.slug)
      }
    } else {
      const index = likedPosts.indexOf(post.slug)
      if (index > -1) {
        likedPosts.splice(index, 1)
      }
    }
    
    // 保存更新後的陣列
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
    
    // 追蹤互動
    trackBlogInteraction(post.slug, 'like', newLikedState ? 'add' : 'remove')
    
    // 顯示提示
    toast.success(newLikedState ? '已加入喜愛！' : '已取消喜愛')
  }, [isLiked, post.slug])

  // 切換分享選單
  const toggleShareMenu = useCallback(() => {
    setShowShareMenu(prev => !prev)
  }, [])

  // 獲取完整文章 URL
  const getFullArticleUrl = useCallback(() => {
    return `${window.location.origin}/blog/${post.slug}`
  }, [post.slug])

  // Facebook 分享
  const shareOnFacebook = useCallback(() => {
    const url = getFullArticleUrl()
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
    
    trackBlogShare(post.slug, 'facebook', post.title)
    setShowShareMenu(false)
    toast.success('已開啟 Facebook 分享')
  }, [getFullArticleUrl, post.slug, post.title])

  // Twitter 分享
  const shareOnTwitter = useCallback(() => {
    const url = getFullArticleUrl()
    const text = `${post.title} - Aidea:Med 醫療行銷顧問`
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
    
    trackBlogShare(post.slug, 'twitter', post.title)
    setShowShareMenu(false)
    toast.success('已開啟 Twitter 分享')
  }, [getFullArticleUrl, post.slug, post.title])

  // LINE 分享
  const shareOnLine = useCallback(() => {
    const url = getFullArticleUrl()
    const text = `${post.title} - Aidea:Med 醫療行銷顧問`
    const shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
    
    trackBlogShare(post.slug, 'line', post.title)
    setShowShareMenu(false)
    toast.success('已開啟 LINE 分享')
  }, [getFullArticleUrl, post.slug, post.title])

  // 複製連結
  const copyLink = useCallback(async () => {
    const url = getFullArticleUrl()
    
    try {
      await navigator.clipboard.writeText(url)
      trackBlogShare(post.slug, 'copy_link', post.title)
      setShowShareMenu(false)
      toast.success('連結已複製到剪貼簿')
    } catch {
      toast.error('複製連結失敗')
    }
  }, [getFullArticleUrl, post.slug, post.title])

  return {
    // 點讚相關
    isLiked,
    likeCount,
    handleLike,
    
    // 分享相關
    showShareMenu,
    toggleShareMenu,
    shareOnFacebook,
    shareOnTwitter,
    shareOnLine,
    copyLink,
    
    // 工具函數
    getFullArticleUrl
  }
} 