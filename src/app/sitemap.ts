import { MetadataRoute } from 'next'

/**
 * 提供給搜尋引擎的網站地圖
 * 包含所有重要的頁面與動態路由
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // 基本靜態路由
  const routes = ['', '/service', '/team', '/case', '/contact'].map(
    (route) => ({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  )

  return routes
} 