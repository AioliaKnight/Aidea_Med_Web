import { MetadataRoute } from 'next'
import { caseStudies } from '@/data/cases'
import { getAllBlogPosts } from '@/lib/blog-server'

/**
 * 提供給搜尋引擎的網站地圖
 * 包含所有重要的頁面與動態路由
 * 使用 Next.js 內建的 MetadataRoute.Sitemap 功能
 * 最後更新: 2024-07-04
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
  
  // 隱私權政策相關頁面 - 為主要頁面的子頁
  const privacyRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy/medical-compliance`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.6, // 稍微提高隱私權合規頁面的優先級
    },
    {
      url: `${baseUrl}/privacy/cookies`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    }
  ]
  
  // 動態案例頁面 - 使用實際案例資料
  const caseRoutes: MetadataRoute.Sitemap = Array.isArray(caseStudies) 
    ? caseStudies.map(caseStudy => {
        // 檢查案例是否與醫療廣告法規相關
        // 安全地檢查 caseStudy 是否有 tags 屬性
        const caseHasTags = caseStudy && 
                           typeof caseStudy === 'object' && 
                           'tags' in caseStudy && 
                           Array.isArray(caseStudy.tags);
        
        const isMedicalAdCase = caseHasTags && 
          (caseStudy.tags as Array<string>).some((tag: string) => 
            tag.includes('醫療廣告') || 
            tag.includes('法規') || 
            tag.includes('合規')
          );
      
        return {
          url: `${baseUrl}/case/${caseStudy.id}`,
          lastModified: caseStudy.updatedDate 
            ? new Date(caseStudy.updatedDate) 
            : new Date(caseStudy.publishedDate || currentDate),
          changeFrequency: 'monthly',
          // 提高醫療廣告相關案例的優先級
          priority: isMedicalAdCase ? 0.85 : (caseStudy.featured ? 0.8 : 0.7),
        };
      })
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
        
        // 檢查標題和內容中是否包含醫療廣告法規關鍵字
        const title = typeof post.title === 'string' ? post.title.toLowerCase() : '';
        
        // 安全地檢查 post 是否有 excerpt 屬性
        const excerpt = post && 
                      typeof post === 'object' && 
                      'excerpt' in post && 
                      typeof post.excerpt === 'string' 
                        ? post.excerpt.toLowerCase() 
                        : '';
        
        // 安全地檢查 post 是否有 content 屬性
        const content = post && 
                       typeof post === 'object' && 
                       'content' in post && 
                       typeof post.content === 'string' 
                         ? post.content.toLowerCase() 
                         : '';
        
        // 更全面檢查醫療廣告法規相關內容
        const keywordsToCheck = [
          '醫療廣告', '法規', '合規', '衛福部', '醫療法', 
          '醫療行銷', '廣告違規', '醫師公會', '醫事法規',
          '牙醫', '美容醫學', '醫療', '診所', '醫美'
        ];
        
        const isMedicalAdComplianceRelated = (
          keywordsToCheck.some(keyword => title.includes(keyword)) ||
          keywordsToCheck.some(keyword => excerpt.includes(keyword)) ||
          (post.tags && Array.isArray(post.tags) && post.tags.some(tag => 
            keywordsToCheck.some(keyword => tag.includes(keyword))
          ))
        );
        
        // 針對特定重要的文章提供更高優先級
        const isDentalAdRegulations = post.slug === 'dental-advertising-regulations';
        
        // 醫療廣告法規相關文章提高優先級
        let priorityValue = 0.7; // 預設優先級
        
        if (isDentalAdRegulations) {
          // 特定重要文章的最高優先級
          priorityValue = 0.95;
        } else if (isMedicalAdComplianceRelated) {
          // 一般醫療廣告相關內容
          priorityValue = 0.92;
        } else if (post.tags && Array.isArray(post.tags) && post.tags.some(tag => [
          '醫療專業知識', '牙醫臨床案例', '醫療行銷策略', 'EEAT', '醫學研究'
        ].includes(tag))) {
          // 其他醫療相關的高價值內容
          priorityValue = 0.9;
        }
        
        // 確保有效的 slug
        const slug = post.slug || post.id || `post-${publishDate.getTime()}`;
        
        return {
          url: `${baseUrl}/blog/${slug}`,
          lastModified: post.updatedAt 
            ? new Date(post.updatedAt) 
            : publishDate,
          changeFrequency: changeFrequency,
          // 根據內容重要性決定優先級
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
  
  // 組合所有實際存在的路由
  return [
    ...staticRoutes, 
    ...serviceDetailRoutes, 
    ...teamDetailRoutes,
    ...privacyRoutes, 
    ...caseRoutes, 
    ...blogRoutes
  ]
} 