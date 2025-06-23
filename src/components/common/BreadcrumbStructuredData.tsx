'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

interface BreadcrumbItem {
  name: string
  item: string
  position: number
}

interface BreadcrumbStructuredDataProps {
  customItems?: BreadcrumbItem[]
}

const PAGE_NAMES: Record<string, string> = {
  '/': '首頁',
  '/service': '服務項目',
  '/case': '成功案例',
  '/team': '專業團隊', 
  '/contact': '聯絡我們',
  '/blog': '行銷新知',
  '/privacy': '隱私權政策',
  '/service/clinic-branding': '診所品牌策略',
  '/service/digital-marketing': '數位行銷優化',
  '/service/social-media': '社群媒體經營',
  '/service/seo-optimization': 'SEO搜尋優化',
  '/service/website-design': '網站設計開發',
  '/service/ai-integration': 'AI整合行銷',
  '/service/medical-ad-compliance': '醫療廣告法規',
  '/service/content-strategy': '內容策略規劃'
}

/**
 * Breadcrumb 結構化數據組件
 * 生成符合 Schema.org BreadcrumbList 格式的結構化數據
 * 幫助搜尋引擎理解網站的層次結構和導航路徑
 */
export default function BreadcrumbStructuredData({ customItems }: BreadcrumbStructuredDataProps) {
  const pathname = usePathname()
  
  const breadcrumbStructuredData = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
    
    // 如果提供了自定義項目，使用自定義項目
    if (customItems) {
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': customItems.map(item => ({
          '@type': 'ListItem',
          'position': item.position,
          'name': item.name,
          'item': item.item.startsWith('http') ? item.item : `${baseUrl}${item.item}`
        }))
      }
    }
    
    // 自動生成麵包屑
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbItems: BreadcrumbItem[] = []
    
    // 添加首頁
    breadcrumbItems.push({
      name: 'Aidea:Med 醫療行銷顧問',
      item: baseUrl,
      position: 1
    })
    
    // 構建路徑並添加每個層級
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const position = index + 2
      
      // 獲取頁面名稱
      let pageName = PAGE_NAMES[currentPath]
      
      // 如果是動態路由或未定義的頁面，使用 segment 作為名稱
      if (!pageName) {
        // 格式化 segment 名稱
        pageName = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
      
      breadcrumbItems.push({
        name: pageName,
        item: `${baseUrl}${currentPath}`,
        position
      })
    })
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbItems.map(item => ({
        '@type': 'ListItem',
        'position': item.position,
        'name': item.name,
        'item': item.item
      }))
    }
  }, [pathname, customItems])
  
  // 只在首頁時不渲染 (因為首頁不需要麵包屑)
  if (pathname === '/') {
    return null
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbStructuredData)
      }}
    />
  )
} 