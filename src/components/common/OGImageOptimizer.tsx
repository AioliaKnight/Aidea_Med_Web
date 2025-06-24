'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface OGImageOptimizerProps {
  title?: string
  description?: string
  imagePath?: string
  type?: 'website' | 'article' | 'profile'
  locale?: string
  siteName?: string
}

/**
 * Open Graph 圖片優化組件
 * 動態管理頁面的 OG 和 Twitter 卡片元資料
 * 
 * 功能特點：
 * - 動態注入 OG 標籤
 * - 優化圖片尺寸和格式
 * - 支援多種內容類型
 * - 自動生成 Twitter Cards
 * - 醫療內容 EEAT 優化
 */
export default function OGImageOptimizer({
  title,
  description,
  imagePath,
  type = 'website',
  locale = 'zh_TW',
  siteName = 'Aidea:Med 醫療行銷顧問'
}: OGImageOptimizerProps) {
  const pathname = usePathname()

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
    const currentUrl = `${baseUrl}${pathname}`
    
    // 預設圖片路徑
    const defaultOGImage = `${baseUrl}/og-image.jpg`
    const imageUrl = imagePath ? `${baseUrl}${imagePath}` : defaultOGImage

    // 更新或創建 OG 標籤的函數
    const updateOrCreateMetaTag = (property: string, content: string, isProperty = true) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`
      let metaTag = document.querySelector(selector)
      
      if (!metaTag) {
        metaTag = document.createElement('meta')
        if (isProperty) {
          metaTag.setAttribute('property', property)
        } else {
          metaTag.setAttribute('name', property)
        }
        document.head.appendChild(metaTag)
      }
      
      metaTag.setAttribute('content', content)
    }

    // 基本 Open Graph 標籤
    updateOrCreateMetaTag('og:title', title || document.title)
    updateOrCreateMetaTag('og:description', description || '')
    updateOrCreateMetaTag('og:url', currentUrl)
    updateOrCreateMetaTag('og:type', type)
    updateOrCreateMetaTag('og:locale', locale)
    updateOrCreateMetaTag('og:site_name', siteName)
    
    // 圖片相關標籤
    updateOrCreateMetaTag('og:image', imageUrl)
    updateOrCreateMetaTag('og:image:width', '1200')
    updateOrCreateMetaTag('og:image:height', '630')
    updateOrCreateMetaTag('og:image:alt', title || '醫療行銷專業服務')
    updateOrCreateMetaTag('og:image:type', 'image/jpeg')
    
    // 備用圖片
    const altImageUrl = `${baseUrl}/og-image-alt.jpg`
    updateOrCreateMetaTag('og:image', altImageUrl)
    updateOrCreateMetaTag('og:image:width', '1200')
    updateOrCreateMetaTag('og:image:height', '630')

    // Twitter Cards 標籤
    updateOrCreateMetaTag('twitter:card', 'summary_large_image', false)
    updateOrCreateMetaTag('twitter:site', '@aideamed', false)
    updateOrCreateMetaTag('twitter:creator', '@aideamed', false)
    updateOrCreateMetaTag('twitter:title', title || document.title, false)
    updateOrCreateMetaTag('twitter:description', description || '', false)
    updateOrCreateMetaTag('twitter:image', imageUrl, false)
    updateOrCreateMetaTag('twitter:image:alt', title || '醫療行銷專業服務', false)

    // 文章特定標籤
    if (type === 'article') {
      updateOrCreateMetaTag('article:section', '醫療行銷')
      updateOrCreateMetaTag('article:tag', '醫療行銷,診所經營,數位行銷')
      updateOrCreateMetaTag('article:author', 'https://www.aideamed.com/team')
      
      // 取得發布時間（如果可用）
      const publishedTime = document.querySelector('time[datetime]')?.getAttribute('datetime')
      if (publishedTime) {
        updateOrCreateMetaTag('article:published_time', publishedTime)
      }
    }

    // 醫療專業內容標籤（EEAT 優化）
    updateOrCreateMetaTag('author', 'Aidea:Med 醫療行銷團隊', false)
    updateOrCreateMetaTag('expertise', '醫療行銷專業知識', false)
    updateOrCreateMetaTag('authoritativeness', '醫療行銷領域權威', false)
    updateOrCreateMetaTag('trustworthiness', '值得信賴的醫療行銷建議', false)
    
    // LinkedIn 優化
    updateOrCreateMetaTag('linkedin:owner', 'Aidea:Med')
    
    // Facebook 應用 ID（如果有的話）
    const fbAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
    if (fbAppId) {
      updateOrCreateMetaTag('fb:app_id', fbAppId)
    }

    // 為醫療內容添加專業認證標記
    updateOrCreateMetaTag('medical-content', 'verified', false)
    updateOrCreateMetaTag('content-type', 'medical-marketing', false)
    
  }, [title, description, imagePath, type, locale, siteName, pathname])

  return null // 這是一個無渲染組件
}

/**
 * 生成動態 OG 圖片 URL 的輔助函數
 * 可用於根據內容動態生成圖片
 */
export function generateDynamicOGImage(params: {
  title: string
  subtitle?: string
  type?: 'blog' | 'service' | 'team' | 'general'
  theme?: 'light' | 'dark'
}) {
  const { title, subtitle, type = 'general', theme = 'light' } = params
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
  
  // 如果有動態圖片生成服務，可以在這裡構建 URL
  // 例如使用 Vercel OG 或其他服務
  const encodedTitle = encodeURIComponent(title)
  const encodedSubtitle = subtitle ? encodeURIComponent(subtitle) : ''
  
  // 範例：動態圖片生成 URL
  // return `${baseUrl}/api/og?title=${encodedTitle}&subtitle=${encodedSubtitle}&type=${type}&theme=${theme}`
  
  // 目前使用靜態圖片，未來可擴展為動態生成
  return `${baseUrl}/og-image-${type}.jpg`
}

/**
 * 檢查圖片是否存在的輔助函數
 */
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * 為不同頁面類型獲取適當的 OG 圖片
 */
export function getOGImageForPage(pathname: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
  
  // 根據路徑返回適當的圖片
  if (pathname.startsWith('/blog/')) {
    return `${baseUrl}/images/og/blog-default.jpg`
  } else if (pathname.startsWith('/team')) {
    return `${baseUrl}/images/og/team.jpg`
  } else if (pathname.startsWith('/service')) {
    return `${baseUrl}/images/og/service.jpg`
  } else if (pathname.startsWith('/contact')) {
    return `${baseUrl}/images/og/contact.jpg`
  }
  
  // 預設首頁圖片
  return `${baseUrl}/og-image.jpg`
} 