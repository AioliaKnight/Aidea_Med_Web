'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface SEOOptimizerProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  structuredData?: Record<string, any>
  noIndex?: boolean
  noFollow?: boolean
}

/**
 * SEO 優化組件
 * 動態管理頁面的 SEO 元素，包括結構化數據、Open Graph、Twitter Cards 等
 * 
 * 功能特點：
 * - 動態注入結構化數據
 * - 管理 canonical URL
 * - 優化社交媒體分享
 * - 支援醫療內容的 EEAT 優化
 * - 自動生成 breadcrumb 結構化數據
 */
export default function SEOOptimizer({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  structuredData,
  noIndex = false,
  noFollow = false
}: SEOOptimizerProps) {
  const pathname = usePathname()

  useEffect(() => {
    // 動態更新頁面標題
    if (title) {
      document.title = title
    }

    // 動態更新 meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', description)
    }

    // 動態更新 keywords
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', keywords.join(', '))
    }

    // 動態更新 canonical URL
    if (canonicalUrl) {
      let linkCanonical = document.querySelector('link[rel="canonical"]')
      if (!linkCanonical) {
        linkCanonical = document.createElement('link')
        linkCanonical.setAttribute('rel', 'canonical')
        document.head.appendChild(linkCanonical)
      }
      linkCanonical.setAttribute('href', canonicalUrl)
    }

    // 動態更新 robots meta
    const robotsContent = []
    if (noIndex) robotsContent.push('noindex')
    else robotsContent.push('index')
    if (noFollow) robotsContent.push('nofollow')
    else robotsContent.push('follow')

    let metaRobots = document.querySelector('meta[name="robots"]')
    if (!metaRobots) {
      metaRobots = document.createElement('meta')
      metaRobots.setAttribute('name', 'robots')
      document.head.appendChild(metaRobots)
    }
    metaRobots.setAttribute('content', robotsContent.join(', '))

    // 動態注入結構化數據
    if (structuredData) {
      const scriptId = 'dynamic-structured-data'
      let existingScript = document.getElementById(scriptId)
      
      if (existingScript) {
        existingScript.remove()
      }

      const script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }

    // 自動生成 breadcrumb 結構化數據
    const breadcrumbData = generateBreadcrumbData(pathname)
    if (breadcrumbData) {
      const breadcrumbScriptId = 'breadcrumb-structured-data'
      let existingBreadcrumbScript = document.getElementById(breadcrumbScriptId)
      
      if (existingBreadcrumbScript) {
        existingBreadcrumbScript.remove()
      }

      const breadcrumbScript = document.createElement('script')
      breadcrumbScript.id = breadcrumbScriptId
      breadcrumbScript.type = 'application/ld+json'
      breadcrumbScript.textContent = JSON.stringify(breadcrumbData)
      document.head.appendChild(breadcrumbScript)
    }

    // 醫療內容的 EEAT 優化標記
    if (pathname.includes('/blog/') || pathname.includes('/service/')) {
      addMedicalContentMarkers()
    }

  }, [title, description, keywords, canonicalUrl, structuredData, noIndex, noFollow, pathname])

  return null // 這是一個純功能組件，不渲染任何內容
}

/**
 * 生成 breadcrumb 結構化數據
 */
function generateBreadcrumbData(pathname: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
  const pathSegments = pathname.split('/').filter(segment => segment)
  
  if (pathSegments.length === 0) return null

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: '首頁',
      item: baseUrl
    }
  ]

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const position = index + 2
    
    let name = segment
    // 轉換路徑名稱為中文
    switch (segment) {
      case 'blog':
        name = '行銷新知'
        break
      case 'service':
        name = '服務項目'
        break
      case 'case':
        name = '成功案例'
        break
      case 'team':
        name = '專業團隊'
        break
      case 'contact':
        name = '聯絡我們'
        break
      case 'medical-ad-compliance':
        name = '醫療廣告法規遵循'
        break
      default:
        // 保持原始名稱或進行其他轉換
        name = decodeURIComponent(segment)
    }

    breadcrumbItems.push({
      '@type': 'ListItem',
      position,
      name,
      item: `${baseUrl}${currentPath}`
    })
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems
  }
}

/**
 * 添加醫療內容的 EEAT 優化標記
 */
function addMedicalContentMarkers() {
  // 添加醫療內容標記
  let medicalContentMeta = document.querySelector('meta[name="medical-content"]')
  if (!medicalContentMeta) {
    medicalContentMeta = document.createElement('meta')
    medicalContentMeta.setAttribute('name', 'medical-content')
    medicalContentMeta.setAttribute('content', 'true')
    document.head.appendChild(medicalContentMeta)
  }

  // 添加專業權威性標記
  let authorityMeta = document.querySelector('meta[name="content-authority"]')
  if (!authorityMeta) {
    authorityMeta = document.createElement('meta')
    authorityMeta.setAttribute('name', 'content-authority')
    authorityMeta.setAttribute('content', 'medical-marketing-expert')
    document.head.appendChild(authorityMeta)
  }

  // 添加內容審核標記
  let reviewedMeta = document.querySelector('meta[name="content-reviewed"]')
  if (!reviewedMeta) {
    reviewedMeta = document.createElement('meta')
    reviewedMeta.setAttribute('name', 'content-reviewed')
    reviewedMeta.setAttribute('content', 'medical-professional')
    document.head.appendChild(reviewedMeta)
  }
}

// 注意：SEO 輔助函數已移至 src/lib/seo-utils.ts 以支援服務器端使用
// 請從 @/lib/seo-utils 導入 generateArticleStructuredData、generateServiceStructuredData、generateFAQStructuredData 