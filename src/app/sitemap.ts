import { MetadataRoute } from 'next'
import { caseStudies } from '@/data/cases'
import { getAllBlogPosts } from '@/lib/blog-server'

/**
 * 提供給搜尋引擎的網站地圖
 * 包含所有重要的頁面與動態路由
 * 使用 Next.js 內建的 MetadataRoute.Sitemap 功能
 * 最後更新: 2024-06-15
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 從環境變數讀取基礎URL，如果不存在則使用預設值
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com'
  
  // 取得目前日期作為最後更新時間
  const currentDate = new Date()
  
  // 基本靜態路由 - 這些是確認存在的主要頁面
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/service`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    }
  ]
  
  // 實際已實現的服務詳情頁面
  const serviceDetailRoutes: MetadataRoute.Sitemap = [
    // 目前已確認實現的服務頁面
    {
      url: `${baseUrl}/service/medical-ad-compliance`,
      lastModified: currentDate,
      changeFrequency: 'weekly', 
      priority: 0.95, // 保持高優先級
    }
    // 註: 其他服務頁面如 brand-strategy, digital-marketing 等
    // 待實際建立後再添加到 sitemap
  ]
  
  // 實際已實現的團隊成員詳情頁面
  const teamDetailRoutes: MetadataRoute.Sitemap = [
    // 註: 團隊成員詳情頁面待實際建立後再添加到 sitemap
  ]
  
  // 動態案例頁面 - 使用實際案例資料
  const caseRoutes: MetadataRoute.Sitemap = Array.isArray(caseStudies) 
    ? caseStudies.map(caseStudy => ({
        url: `${baseUrl}/case/${caseStudy.id}`,
        lastModified: caseStudy.updatedDate 
          ? new Date(caseStudy.updatedDate) 
          : new Date(caseStudy.publishedDate || currentDate),
        changeFrequency: 'monthly',
        priority: caseStudy.featured ? 0.8 : 0.7,
      }))
    : []
  
  // 獲取部落格資料 - 使用檔案系統而非API
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    // 使用伺服器端函數獲取所有部落格文章
    const allBlogPosts = await getAllBlogPosts()
    
    // 確保成功獲取文章資料
    if (allBlogPosts && Array.isArray(allBlogPosts) && allBlogPosts.length > 0) {
      blogRoutes = allBlogPosts.map((post) => {
        // 確保文章有有效的發布日期
        const publishDate = post.publishedAt ? new Date(post.publishedAt) : currentDate;
        const monthsOld = (currentDate.getFullYear() - publishDate.getFullYear()) * 12 + 
                          (currentDate.getMonth() - publishDate.getMonth());
        
        // 較新的內容更頻繁更新
        let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
        if (monthsOld < 1) {
          changeFrequency = 'weekly';
        } else if (monthsOld > 12) {
          changeFrequency = 'yearly';
        }
        
        // 檢查標題中是否包含醫療廣告法規關鍵字 - 改進中文處理
        const title = typeof post.title === 'string' ? post.title.toLowerCase() : '';
        const isMedicalAdComplianceRelated = (
          title.includes('醫療廣告') || 
          title.includes('法規') ||
          title.includes('合規') ||
          title.includes('衛福部') ||
          title.includes('醫療法') ||
          (post.tags && Array.isArray(post.tags) && post.tags.some(tag => 
            tag.includes('法規') || tag.includes('合規') || tag.includes('醫療廣告')
          ))
        );
        
        // 醫療廣告法規相關文章提高優先級
        const priorityValue = isMedicalAdComplianceRelated ? 0.92 : 
                             (post.tags && Array.isArray(post.tags) && post.tags.some(tag => [
                                '醫療專業知識', '牙醫臨床案例', '醫療行銷策略', 'EEAT', '醫學研究'
                             ].includes(tag)) ? 0.9 : 0.7);
        
        // 確保有效的 slug
        const slug = post.slug || post.id || `post-${publishDate.getTime()}`;
        
        return {
          url: `${baseUrl}/blog/${slug}`,
          lastModified: post.updatedAt 
            ? new Date(post.updatedAt) 
            : publishDate,
          changeFrequency: changeFrequency,
          // 根據標籤和標題關鍵字決定優先級
          priority: priorityValue,
        }
      });
      
      // 記錄成功獲取的部落格文章數量
      console.log(`Successfully added ${blogRoutes.length} blog posts to sitemap`);
    } else {
      console.warn('No blog posts found or returned array is empty');
    }
  } catch (error) {
    console.error('Error fetching blog data for sitemap:', error);
    // 繼續處理已有的資料，不因部落格獲取失敗而中斷整個 sitemap 生成
  }
  
  // 實際已實現的知識庫頁面
  const knowledgeBaseRoutes: MetadataRoute.Sitemap = [
    // 已確認存在的頁面
    {
      url: `${baseUrl}/knowledge/medical-advertising-regulations`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    }
    // 註: 其他知識庫頁面待實際建立後再添加到 sitemap
  ]
  
  // 醫療廣告法規相關子頁面 - 註記計劃建立的頁面
  // 這些頁面將在未來實現，但暫時從 sitemap 中移除
  // const medicalAdComplianceSubRoutes: MetadataRoute.Sitemap = [
  //   {
  //     url: `${baseUrl}/service/medical-ad-compliance/case-studies`,
  //     lastModified: currentDate,
  //     changeFrequency: 'weekly',
  //     priority: 0.85,
  //   },
  //   {
  //     url: `${baseUrl}/service/medical-ad-compliance/resources`,
  //     lastModified: currentDate,
  //     changeFrequency: 'weekly',
  //     priority: 0.85,
  //   },
  //   {
  //     url: `${baseUrl}/service/medical-ad-compliance/faq`,
  //     lastModified: currentDate,
  //     changeFrequency: 'weekly',
  //     priority: 0.80,
  //   }
  // ]
  
  // 備註: 未來網站擴展計劃
  // 1. 建立其他服務詳情頁面 (brand-strategy, digital-marketing 等)
  // 2. 完善團隊成員頁面
  // 3. 擴充知識庫內容
  // 4. 添加醫療廣告法規子頁面
  // 當這些頁面實際開發完成後，再將它們添加到 sitemap
  
  // 組合所有實際存在的路由
  return [
    ...staticRoutes, 
    ...serviceDetailRoutes, 
    ...teamDetailRoutes, 
    ...caseRoutes, 
    ...blogRoutes,
    ...knowledgeBaseRoutes,
    // 移除不存在的子頁面
    // ...medicalAdComplianceSubRoutes
  ]
} 