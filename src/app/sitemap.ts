import { MetadataRoute } from 'next'
import { caseStudies } from '@/data/cases'

/**
 * 提供給搜尋引擎的網站地圖
 * 包含所有重要的頁面與動態路由
 * 使用 Next.js 內建的 MetadataRoute.Sitemap 功能
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 從環境變數讀取基礎URL，如果不存在則使用預設值
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com'
  
  // 基本靜態路由
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/service', 
    '/team', 
    '/case', 
    '/contact',
    '/blog'
  ].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      // Next.js 官方定義使用的是 changeFrequency
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1 : 0.8,
    })
  )
  
  // 動態案例頁面 - 使用實際案例資料
  const caseRoutes: MetadataRoute.Sitemap = Array.isArray(caseStudies) 
    ? caseStudies.map(caseStudy => ({
        url: `${baseUrl}/case/${caseStudy.id}`,
        lastModified: caseStudy.updatedDate 
          ? new Date(caseStudy.updatedDate) 
          : new Date(caseStudy.publishedDate || new Date()),
        changeFrequency: 'monthly',
        priority: 0.7,
      }))
    : []
  
  // 獲取部落格資料
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const blogResponse = await fetch(`${baseUrl}/api/blog`, {
      method: 'GET',
      next: { revalidate: 3600 }, // 使用 ISR, 每小時更新一次
    })
    
    if (blogResponse.ok) {
      const blogData = await blogResponse.json()
      
      blogRoutes = blogData.map((article: any) => ({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: article.updatedAt 
          ? new Date(article.updatedAt) 
          : new Date(article.publishedAt || new Date()),
        changeFrequency: 'monthly',
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching blog data for sitemap:', error)
    // 繼續處理已有的資料，不因部落格獲取失敗而中斷整個 sitemap 生成
  }
  
  // 組合所有路由
  return [...staticRoutes, ...caseRoutes, ...blogRoutes]
} 