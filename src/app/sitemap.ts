import { MetadataRoute } from 'next'

/**
 * 提供給搜尋引擎的網站地圖
 * 包含所有重要的頁面與動態路由
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aideamed.com'
  
  // 基本靜態路由
  const staticRoutes = ['', '/service', '/team', '/case', '/contact'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  )
  
  // 動態案例頁面 - 靜態定義部分案例路由，避免服務器端渲染問題
  const caseRoutes = [
    {
      url: `${baseUrl}/case/north-district-dental`,
      lastModified: new Date('2023-11-20T00:00:00Z'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/case/east-district-dental`,
      lastModified: new Date('2023-09-15T00:00:00Z'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/case/central-district-dental`,
      lastModified: new Date('2023-08-10T00:00:00Z'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/case/south-district-dental`,
      lastModified: new Date('2023-10-18T00:00:00Z'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  ]
  
  // 組合所有路由
  return [...staticRoutes, ...caseRoutes]
} 