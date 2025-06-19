import { MetadataRoute } from 'next'
import { caseStudies } from '@/data/cases'
import { getAllBlogPosts } from '@/lib/blog-server'

/**
 * 提供給搜尋引擎的網站地圖
 * 包含所有重要的頁面與動態路由
 * 使用 Next.js 內建的 MetadataRoute.Sitemap 功能
 * 最後更新: 2024-12-19
 * 
 * SEO 優化重點：
 * - 智能優先級分配基於內容相關性
 * - 動態更新頻率基於內容新鮮度
 * - 醫療專業內容優先級提升
 * - 結構化數據整合
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 從環境變數讀取基礎URL，如果不存在則使用預設值
  // 確保在開發環境中也使用正確的生產環境 URL
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com')
    : 'https://www.aideamed.com'
  
  // 取得目前日期作為最後更新時間
  const currentDate = new Date()
  
  // 基本靜態路由 - 只包含實際存在的頁面
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
  
  // 實際已實現的服務詳情頁面 - 只包含確實存在的頁面
  const serviceDetailRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/service/medical-ad-compliance`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95, // 保持高優先級，這是重要的專業服務頁面
    }
  ]
  
  // 動態案例頁面 - 使用實際案例資料
  const caseRoutes: MetadataRoute.Sitemap = Array.isArray(caseStudies) 
    ? caseStudies.map(caseStudy => {
        // 檢查案例是否與醫療廣告法規相關
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
        
        // 計算最後修改日期
        let lastModified = currentDate;
        if (caseStudy.updatedDate) {
          lastModified = new Date(caseStudy.updatedDate);
        } else if (caseStudy.publishedDate) {
          lastModified = new Date(caseStudy.publishedDate);
        }
        
        // 計算變更頻率
        let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
        const monthsOld = (currentDate.getFullYear() - lastModified.getFullYear()) * 12 + 
                        (currentDate.getMonth() - lastModified.getMonth());
                        
        if (monthsOld < 1) {
          changeFrequency = 'weekly';
        } else if (monthsOld > 12) {
          changeFrequency = 'yearly';
        }
      
        return {
          url: `${baseUrl}/case/${caseStudy.id}`,
          lastModified,
          changeFrequency,
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
        
        // 依據文章新鮮度設定更新頻率
        let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
        if (monthsOld < 1) {
          changeFrequency = 'weekly';
        } else if (monthsOld > 12) {
          changeFrequency = 'yearly';
        }
        
        // 更高級的相關性檢查 - 針對內容與標籤
        const highValueTags = [
          '醫療廣告', '法規', '合規', '衛福部', '醫療法', 
          '醫療行銷', '廣告違規', '醫師公會', '醫事法規',
          '牙醫', '診所經營', 'EEAT', '專業性', '權威性'
        ];
        
        const titleLower = post.title.toLowerCase();
        const hasSummary = typeof post.summary === 'string';
        const summaryLower = hasSummary ? post.summary.toLowerCase() : '';
        
        const tagRelevance = (post.tags && Array.isArray(post.tags))
          ? post.tags.filter(tag => highValueTags.some(keyword => tag.includes(keyword))).length
          : 0;
          
        const titleRelevance = highValueTags.filter(keyword => titleLower.includes(keyword)).length;
        const summaryRelevance = hasSummary 
          ? highValueTags.filter(keyword => summaryLower.includes(keyword)).length
          : 0;
          
        // 計算綜合相關性分數 (0-10)
        const relevanceScore = Math.min(10, (tagRelevance * 2) + (titleRelevance * 3) + summaryRelevance);
        
        // 優先度依據相關性分數與新鮮度設定 (0.5-0.95)
        let priority = 0.7; // 基礎優先度
        
        // 特定重要文章的最高優先級
        if (post.slug === 'dental-advertising-regulations') {
          priority = 0.95;
        } 
        // 高相關性內容
        else if (relevanceScore >= 7) {
          priority = 0.92;
        } 
        // 中相關性內容
        else if (relevanceScore >= 4) {
          priority = 0.85;
        } 
        // 新鮮內容加權
        else if (monthsOld < 3) {
          priority = 0.8;
        }
        
        return {
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : publishDate,
          changeFrequency,
          priority
        };
      });
      
      // Successfully added blog posts to sitemap
    }
  } catch (error) {
    console.error('Error fetching blog data for sitemap:', error);
    // 繼續處理已有的資料，不因部落格獲取失敗而中斷整個 sitemap 生成
  }

  // ✅ 改善：移除不必要的圖片 sitemap 路由
  // 圖片 sitemap 應該作為獨立的 XML 處理，不應與主要 sitemap 混合
  
  // ✅ 改善：移除目前不需要的多語言和API路由
  // 未來擴展時可重新啟用

  // 組合所有實際存在的路由
  const allRoutes = [
    ...staticRoutes, 
    ...serviceDetailRoutes, 
    ...caseRoutes, 
    ...blogRoutes
  ].filter(route => route.url) // 過濾掉空的 URL

  // 排序：優先級高的在前，相同優先級按最後修改時間排序
  allRoutes.sort((a, b) => {
    if (a.priority !== b.priority) {
      return (b.priority || 0) - (a.priority || 0)
    }
    return new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime()
  })

  // 確保 sitemap 項目總數不超過 Google 建議的 50,000 條限制
  if (allRoutes.length > 50000) {
    console.warn(`Sitemap has ${allRoutes.length} items, consider using sitemap index`);
    return allRoutes.slice(0, 50000);
  }

  // ✅ 新增：記錄 sitemap 生成統計
  console.log(`✅ Sitemap generated successfully with ${allRoutes.length} routes:
    - Static routes: ${staticRoutes.length}
    - Service detail routes: ${serviceDetailRoutes.length}
    - Case routes: ${caseRoutes.length}
    - Blog routes: ${blogRoutes.length}`);
  
  return allRoutes
} 