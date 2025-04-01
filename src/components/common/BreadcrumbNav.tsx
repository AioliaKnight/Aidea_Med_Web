'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight, Home } from 'lucide-react'

// 定義麵包屑項目類型
export interface BreadcrumbItem {
  href: string
  label: string
  isCurrent?: boolean
}

// 定義元件屬性
interface BreadcrumbNavProps {
  // 自訂麵包屑項目，優先使用
  items?: BreadcrumbItem[]
  // 根目錄標籤，預設為"首頁"
  homeLabel?: string
  // 自訂類名
  className?: string
  // 是否顯示首頁圖標
  showHomeIcon?: boolean
  // 是否顯示JSON-LD結構化資料
  includeJsonLd?: boolean
  // 自訂分隔符類名
  separatorClassName?: string
}

// 頁面路徑映射表，用於將路徑轉換為易讀標籤
const pathMap: Record<string, string> = {
  '': '首頁',
  'service': '服務項目',
  'case': '成功案例',
  'team': '專業團隊',
  'contact': '聯絡我們',
  'blog': '醫療行銷部落格'
}

/**
 * 麵包屑導航元件
 * 用於顯示當前頁面在網站層級結構中的位置
 * 自動根據URL路徑生成麵包屑，也可以手動指定
 */
export default function BreadcrumbNav({
  items,
  homeLabel = '首頁',
  className = '',
  showHomeIcon = true,
  includeJsonLd = true,
  separatorClassName = 'text-gray-400'
}: BreadcrumbNavProps) {
  const pathname = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  
  // 根據當前路徑生成麵包屑
  useEffect(() => {
    // 如果提供了自訂項目，直接使用
    if (items) {
      setBreadcrumbs(items)
      return
    }
    
    // 拆分路徑並移除空字符串
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    
    // 建立麵包屑陣列，始終包含首頁
    const breadcrumbItems: BreadcrumbItem[] = [
      { href: '/', label: homeLabel, isCurrent: pathSegments.length === 0 }
    ]
    
    // 為每個路徑段建立麵包屑項目
    if (pathSegments.length > 0) {
      let currentPath = ''
      
      pathSegments.forEach((segment, index) => {
        // 累加路徑
        currentPath += `/${segment}`
        
        // 判斷是否為最後一個項目
        const isLast = index === pathSegments.length - 1
        
        // 嘗試從映射表中獲取標籤，如果沒有，則美化路徑段
        const label = 
          // 對於案例詳情頁處理
          (segment === 'case' && pathSegments.length > index + 1) 
            ? '成功案例詳情'
            // 嘗試從映射表獲取，如果不存在則美化
            : pathMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        
        // 將此麵包屑添加到陣列
        breadcrumbItems.push({
          href: currentPath,
          label,
          isCurrent: isLast
        })
      })
    }
    
    setBreadcrumbs(breadcrumbItems)
  }, [pathname, items, homeLabel])
  
  // 生成JSON-LD結構化資料
  const generateJsonLd = () => {
    if (!includeJsonLd || breadcrumbs.length === 0) return null
    
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@id': `https://www.aideamed.com${item.href}`,
          'name': item.label
        }
      }))
    }
    
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    )
  }
  
  return (
    <>
      {/* 麵包屑導航 */}
      <nav aria-label="麵包屑導航" className={cn('text-sm py-3', className)}>
        <ol className="flex flex-wrap items-center">
          {breadcrumbs.map((item, index) => {
            // 是否為最後一個項目（當前頁面）
            const isLast = index === breadcrumbs.length - 1
            
            return (
              <li key={item.href} className="flex items-center">
                {/* 麵包屑項目 */}
                {isLast ? (
                  // 當前頁面不可點擊
                  <span 
                    className="font-medium text-primary"
                    aria-current="page"
                  >
                    {index === 0 && showHomeIcon ? (
                      <span className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        <span>{item.label}</span>
                      </span>
                    ) : (
                      item.label
                    )}
                  </span>
                ) : (
                  // 可點擊的上層頁面連結
                  <Link 
                    href={item.href}
                    className="text-gray-600 hover:text-primary hover:underline transition-colors"
                  >
                    {index === 0 && showHomeIcon ? (
                      <span className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        <span>{item.label}</span>
                      </span>
                    ) : (
                      item.label
                    )}
                  </Link>
                )}
                
                {/* 分隔符（非最後一個項目顯示） */}
                {!isLast && (
                  <span className={cn('mx-2 flex-shrink-0', separatorClassName)} aria-hidden="true">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      
      {/* JSON-LD 結構化資料 */}
      {generateJsonLd()}
    </>
  )
} 