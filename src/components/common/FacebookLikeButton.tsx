'use client'

import { useEffect, useRef } from 'react'

/**
 * Facebook Like Button 組件
 * 
 * 此組件使用 Facebook JavaScript SDK 來顯示讚按鈕，支援：
 * 1. 自訂分享網址
 * 2. 響應式寬度設定
 * 3. 顯示使用者頭像
 * 4. 分享功能
 */

interface FacebookLikeButtonProps {
  /** 要按讚的網址，預設為當前頁面 */
  href?: string
  /** 按鈕寬度 */
  width?: number | string
  /** 是否顯示分享按鈕 */
  share?: boolean
  /** 是否顯示朋友的頭像 */
  showFaces?: boolean
  /** 按鈕佈局樣式 */
  layout?: 'standard' | 'box_count' | 'button_count' | 'button'
  /** 按鈕大小 */
  size?: 'small' | 'medium' | 'large'
  /** 動作類型 */
  action?: 'like' | 'recommend'
  /** 色彩主題 */
  colorScheme?: 'light' | 'dark'
  /** 自訂 CSS 類別 */
  className?: string
}

export const FacebookLikeButton: React.FC<FacebookLikeButtonProps> = ({
  href = typeof window !== 'undefined' ? window.location.href : '',
  width = 450,
  share = true,
  showFaces = true,
  layout = 'standard',
  size = 'medium',
  action = 'like',
  colorScheme = 'light',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 確保 Facebook SDK 已載入
    const initializeLikeButton = () => {
      if (window.FB && containerRef.current) {
        // 重新解析 XFBML 元素
        window.FB.XFBML?.parse(containerRef.current)
      }
    }

    // 如果 SDK 已載入，立即初始化
    if (window.FB) {
      initializeLikeButton()
    } else {
      // 等待 SDK 載入
      const checkSDK = setInterval(() => {
        if (window.FB) {
          clearInterval(checkSDK)
          initializeLikeButton()
        }
      }, 100)

      // 10 秒後停止檢查
      setTimeout(() => {
        clearInterval(checkSDK)
      }, 10000)

      return () => clearInterval(checkSDK)
    }
  }, [href, width, share, showFaces, layout, size, action, colorScheme])

  return (
    <div ref={containerRef} className={`facebook-like-button ${className}`}>
      <div
        className="fb-like"
        data-href={href}
        data-width={width}
        data-layout={layout}
        data-action={action}
        data-size={size}
        data-share={share.toString()}
        data-show-faces={showFaces.toString()}
        data-colorscheme={colorScheme}
      />
    </div>
  )
}

/**
 * Facebook Comments Plugin 組件
 */
interface FacebookCommentsProps {
  /** 留言的網址，預設為當前頁面 */
  href?: string
  /** 留言框寬度 */
  width?: number | string
  /** 顯示的留言數量 */
  numPosts?: number
  /** 留言排序方式 */
  orderBy?: 'social' | 'reverse_time' | 'time'
  /** 色彩主題 */
  colorScheme?: 'light' | 'dark'
  /** 自訂 CSS 類別 */
  className?: string
}

export const FacebookComments: React.FC<FacebookCommentsProps> = ({
  href = typeof window !== 'undefined' ? window.location.href : '',
  width = 450,
  numPosts = 5,
  orderBy = 'social',
  colorScheme = 'light',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initializeComments = () => {
      if (window.FB && containerRef.current) {
        window.FB.XFBML?.parse(containerRef.current)
      }
    }

    if (window.FB) {
      initializeComments()
    } else {
      const checkSDK = setInterval(() => {
        if (window.FB) {
          clearInterval(checkSDK)
          initializeComments()
        }
      }, 100)

      setTimeout(() => clearInterval(checkSDK), 10000)
      return () => clearInterval(checkSDK)
    }
  }, [href, width, numPosts, orderBy, colorScheme])

  return (
    <div ref={containerRef} className={`facebook-comments ${className}`}>
      <div
        className="fb-comments"
        data-href={href}
        data-width={width}
        data-numposts={numPosts}
        data-order-by={orderBy}
        data-colorscheme={colorScheme}
      />
    </div>
  )
}

/**
 * Facebook Share Button 組件
 */
interface FacebookShareButtonProps {
  /** 要分享的網址 */
  href?: string
  /** 按鈕佈局 */
  layout?: 'box_count' | 'button_count' | 'button' | 'icon_link' | 'icon'
  /** 按鈕大小 */
  size?: 'small' | 'medium' | 'large'
  /** 自訂 CSS 類別 */
  className?: string
}

export const FacebookShareButton: React.FC<FacebookShareButtonProps> = ({
  href = typeof window !== 'undefined' ? window.location.href : '',
  layout = 'button_count',
  size = 'medium',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initializeShareButton = () => {
      if (window.FB && containerRef.current) {
        window.FB.XFBML?.parse(containerRef.current)
      }
    }

    if (window.FB) {
      initializeShareButton()
    } else {
      const checkSDK = setInterval(() => {
        if (window.FB) {
          clearInterval(checkSDK)
          initializeShareButton()
        }
      }, 100)

      setTimeout(() => clearInterval(checkSDK), 10000)
      return () => clearInterval(checkSDK)
    }
  }, [href, layout, size])

  return (
    <div ref={containerRef} className={`facebook-share-button ${className}`}>
      <div
        className="fb-share-button"
        data-href={href}
        data-layout={layout}
        data-size={size}
      />
    </div>
  )
}

// 擴展 Window 介面以支援 Facebook SDK
declare global {
  interface Window {
    FB?: {
      XFBML?: {
        parse: (element?: HTMLElement) => void
      }
    }
  }
}

export default FacebookLikeButton 