import { MetadataRoute } from 'next'
import { caseStudies } from '@/components/pages/CasePage'

/**
 * 提供給搜尋引擎的網站地圖
 * 包含所有重要的頁面與動態路由
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.aideamed.com'
  
  // 基本靜態路由
  const staticRoutes = ['', '/service', '/team', '/case', '/contact'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  )
  
  // 動態案例頁面 - 使用實際案例資料
  const caseRoutes = caseStudies.map(caseStudy => ({
    url: `${baseUrl}/case/${caseStudy.id}`,
    lastModified: caseStudy.updatedDate ? new Date(caseStudy.updatedDate) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  
  // 組合所有路由
  return [...staticRoutes, ...caseRoutes]
} 