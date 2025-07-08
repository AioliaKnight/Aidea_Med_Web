import { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog-server'
import { 
  siteConfig, 
  sitemapConfig, 
  existingRoutes,
  calculateBlogPriority,
  getChangeFrequency,
  getPriority 
} from '@/config/seo'

/**
 * 優化的網站地圖生成器
 * 整合統一的 SEO 配置，提升性能和維護性
 * 最後更新: 2024-12-19
 * 
 * SEO 優化重點：
 * - 使用統一配置文件管理所有 SEO 設定
 * - 智能優先級分配基於內容相關性
 * - 動態更新頻率基於內容新鮮度
 * - 醫療專業內容優先級提升
 * - 優化的錯誤處理和性能
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date()
  
  try {
    // 靜態路由 - 基於統一配置
    const staticRoutes: MetadataRoute.Sitemap = existingRoutes.map(route => ({
      url: `${siteConfig.siteUrl}${route}`,
      lastModified: currentDate,
      changeFrequency: getChangeFrequency(route),
      priority: getPriority(route),
    }))

    // 獲取動態部落格路由
    const blogRoutes = await generateBlogRoutes(currentDate)
    
    // 組合所有路由
    const allRoutes = [
      ...staticRoutes,
      ...blogRoutes,
    ].filter(route => route.url) // 過濾無效路由

    // 排序：優先級高的在前，相同優先級按最後修改時間排序
    allRoutes.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (b.priority || 0) - (a.priority || 0)
      }
      return new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime()
    })

    // 限制項目數量符合 Google 建議
    if (allRoutes.length > sitemapConfig.maxEntries) {
      console.warn(`Sitemap has ${allRoutes.length} items, limiting to ${sitemapConfig.maxEntries}`)
      return allRoutes.slice(0, sitemapConfig.maxEntries)
    }

    // 記錄生成統計
    console.log(`✅ Sitemap generated successfully with ${allRoutes.length} routes:
      - Static routes: ${staticRoutes.length}
      - Blog routes: ${blogRoutes.length}
      - Total priority distribution:
        - Priority 1.0: ${allRoutes.filter(r => r.priority === 1.0).length}
        - Priority 0.9+: ${allRoutes.filter(r => (r.priority || 0) >= 0.9).length}
        - Priority 0.8+: ${allRoutes.filter(r => (r.priority || 0) >= 0.8).length}`)
    
    return allRoutes

  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // 錯誤時返回基本靜態路由
    return existingRoutes.map(route => ({
      url: `${siteConfig.siteUrl}${route}`,
      lastModified: currentDate,
      changeFrequency: getChangeFrequency(route),
      priority: getPriority(route),
    }))
  }
}

/**
 * 生成部落格路由
 */
async function generateBlogRoutes(currentDate: Date): Promise<MetadataRoute.Sitemap> {
  try {
    const allBlogPosts = await getAllBlogPosts()
    
    if (!allBlogPosts || !Array.isArray(allBlogPosts) || allBlogPosts.length === 0) {
      console.warn('No blog posts found for sitemap generation')
      return []
    }

    return allBlogPosts.map((post) => {
      // 使用統一配置計算優先級和更新頻率
      const { priority, changeFrequency } = calculateBlogPriority(post)
      
      // 確定最後修改時間
      const lastModified = post.updatedAt 
        ? new Date(post.updatedAt) 
        : post.publishedAt 
          ? new Date(post.publishedAt) 
          : currentDate

      return {
        url: `${siteConfig.siteUrl}/blog/${post.slug}`,
        lastModified,
        changeFrequency,
        priority,
      }
    })

  } catch (error) {
    console.error('Error fetching blog data for sitemap:', error)
    return []
  }
} 