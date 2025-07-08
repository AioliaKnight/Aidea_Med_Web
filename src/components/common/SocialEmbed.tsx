'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * SocialEmbed 組件 - 使用 Meta oEmbed API 嵌入社群媒體內容
 * 
 * 支援平台：
 * - Facebook 貼文和頁面
 * - Instagram 貼文
 * - Threads 貼文
 * 
 * 特色：
 * - 自動檢測內容類型
 * - 響應式設計
 * - 載入狀態顯示
 * - 錯誤處理
 * - 快取機制
 */

interface OEmbedResponse {
  html: string
  width: number
  height: number
  type: 'rich' | 'photo' | 'video' | 'link'
  version: string
  title?: string
  author_name?: string
  author_url?: string
  provider_name?: string
  provider_url?: string
  cache_age?: number
  thumbnail_url?: string
  thumbnail_width?: number
  thumbnail_height?: number
}

interface SocialEmbedProps {
  /** 要嵌入的社群媒體內容 URL */
  url: string
  /** 指定平台類型，如果不指定會自動檢測 */
  platform?: 'facebook' | 'instagram' | 'threads' | 'auto'
  /** 最大寬度（像素） */
  maxWidth?: number
  /** 最大高度（像素） */
  maxHeight?: number
  /** 是否顯示邊框 */
  showBorder?: boolean
  /** 自定義 CSS 類名 */
  className?: string
  /** 錯誤時的回退內容 */
  fallback?: React.ReactNode
  /** 載入完成回調 */
  onLoad?: () => void
  /** 錯誤回調 */
  onError?: (error: string) => void
}

export const SocialEmbed: React.FC<SocialEmbedProps> = ({
  url,
  platform = 'auto',
  maxWidth = 500,
  maxHeight,
  showBorder = true,
  className = '',
  fallback,
  onLoad,
  onError
}) => {
  const [embedHtml, setEmbedHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [detectedPlatform, setDetectedPlatform] = useState<string>('')

  // 自動檢測平台類型
  const detectPlatform = (url: string): 'facebook' | 'instagram' | 'threads' | null => {
    if (url.includes('facebook.com') || url.includes('fb.me')) {
      return 'facebook'
    }
    if (url.includes('instagram.com')) {
      return 'instagram'
    }
    if (url.includes('threads.net')) {
      return 'threads'
    }
    return null
  }

  // 獲取對應平台的 oEmbed API 端點
  const getOEmbedEndpoint = (platform: string, url: string): string => {
    const encodedUrl = encodeURIComponent(url)
    
    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/plugins/oembed.json/?url=${encodedUrl}&maxwidth=${maxWidth}`
      
      case 'instagram':
        return `https://api.instagram.com/oembed/?url=${encodedUrl}&maxwidth=${maxWidth}`
      
      case 'threads':
        return `https://threads.net/oembed/?url=${encodedUrl}&maxwidth=${maxWidth}`
      
      default:
        throw new Error(`不支援的平台: ${platform}`)
    }
  }

  // 獲取 oEmbed 內容
  const fetchOEmbedContent = async () => {
    try {
      setLoading(true)
      setError('')

      // 確定要使用的平台
      const targetPlatform = platform === 'auto' ? detectPlatform(url) : platform
      
      if (!targetPlatform) {
        throw new Error('無法識別的社群媒體平台。請確認 URL 是來自 Facebook、Instagram 或 Threads。')
      }

      setDetectedPlatform(targetPlatform)

      // 構建 API 端點
      const endpoint = getOEmbedEndpoint(targetPlatform, url)

      // 發送請求
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('找不到指定的內容。請確認 URL 是否正確且內容為公開狀態。')
        }
        if (response.status === 403) {
          throw new Error('無權存取此內容。請確認內容為公開狀態。')
        }
        throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`)
      }

      const data: OEmbedResponse = await response.json()

      if (!data.html) {
        throw new Error('無法獲取嵌入內容。')
      }

      // 處理嵌入的 HTML，確保響應式
      let processedHtml = data.html

      // 為 Instagram 嵌入添加響應式處理
      if (targetPlatform === 'instagram') {
        processedHtml = processedHtml.replace(
          /width="\d+"/g, 
          `style="max-width: ${maxWidth}px; width: 100%;"`
        )
      }

      // 為 Facebook 嵌入添加響應式處理
      if (targetPlatform === 'facebook') {
        processedHtml = processedHtml.replace(
          /data-width="\d+"/g,
          `data-width="${maxWidth}"`
        )
      }

      setEmbedHtml(processedHtml)
      onLoad?.()

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '載入社群媒體內容時發生未知錯誤'
      setError(errorMessage)
      onError?.(errorMessage)
      console.error('SocialEmbed 錯誤:', err)
    } finally {
      setLoading(false)
    }
  }

  // 當 URL 或平台改變時重新載入
  useEffect(() => {
    if (url) {
      fetchOEmbedContent()
    }
  }, [url, platform, maxWidth])

  // 載入狀態
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`w-full max-w-lg mx-auto ${className}`}
      >
        <div className={`
          bg-gray-50 rounded-lg p-6 text-center
          ${showBorder ? 'border border-gray-200' : ''}
        `}>
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">載入社群媒體內容中...</p>
          {detectedPlatform && (
            <p className="text-gray-500 text-xs mt-2">
              平台: {detectedPlatform.charAt(0).toUpperCase() + detectedPlatform.slice(1)}
            </p>
          )}
        </div>
      </motion.div>
    )
  }

  // 錯誤狀態
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`w-full max-w-lg mx-auto ${className}`}
      >
        <div className={`
          bg-red-50 border-red-200 rounded-lg p-6 text-center
          ${showBorder ? 'border' : ''}
        `}>
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">載入失敗</h3>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          <button
            onClick={fetchOEmbedContent}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            重新嘗試
          </button>
          {fallback && (
            <div className="mt-4 pt-4 border-t border-red-200">
              {fallback}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // 成功載入，顯示嵌入內容
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-lg mx-auto ${className}`}
      style={{ 
        maxWidth: maxWidth,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined
      }}
    >
      <div className={`
        ${showBorder ? 'border border-gray-200 rounded-lg overflow-hidden' : ''}
        ${maxHeight ? 'overflow-hidden' : ''}
      `}>
        <div 
          dangerouslySetInnerHTML={{ __html: embedHtml }}
          className="social-embed-content"
        />
      </div>
      
      {/* 平台標識 */}
      {detectedPlatform && (
        <div className="text-center mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            來自 {detectedPlatform.charAt(0).toUpperCase() + detectedPlatform.slice(1)}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default SocialEmbed

// 使用範例組件
export const SocialEmbedExamples: React.FC = () => {
  const examples = [
    {
      title: 'Facebook 貼文',
      url: 'https://www.facebook.com/facebook/posts/10158756736436729',
      description: '嵌入 Facebook 公開貼文'
    },
    {
      title: 'Instagram 貼文',
      url: 'https://www.instagram.com/p/CXXXXXxXXXX/',
      description: '嵌入 Instagram 公開貼文'
    },
    {
      title: 'Threads 貼文',
      url: 'https://www.threads.net/@username/post/XXXXXXXXXXXXX',
      description: '嵌入 Threads 公開貼文'
    }
  ]

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-center mb-8">SocialEmbed 使用範例</h2>
      
      {examples.map((example, index) => (
        <div key={index} className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
          <p className="text-gray-600 mb-4">{example.description}</p>
          <div className="bg-gray-50 p-4 rounded mb-4">
            <code className="text-sm">
              {`<SocialEmbed url="${example.url}" />`}
            </code>
          </div>
          <SocialEmbed
            url={example.url}
            maxWidth={400}
            fallback={
              <div className="text-center text-gray-500">
                <p>示範用途 - 請使用真實的公開貼文 URL</p>
              </div>
            }
          />
        </div>
      ))}
    </div>
  )
} 