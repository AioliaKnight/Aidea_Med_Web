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
  
  // 基本靜態路由
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
  
  // 服務詳情頁面
  const serviceDetailRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/service/brand-strategy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/digital-marketing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/social-media`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/seo-optimization`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/practice-design`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/ai-solutions`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/content-marketing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/medical-ad-compliance`,
      lastModified: currentDate, // 自動使用目前日期
      changeFrequency: 'weekly', // 調整為每週更新
      priority: 0.95, // 提高優先級，表示這是重要頁面
    }
  ]
  
  // 團隊成員詳情頁面
  const teamDetailRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/team/medical-marketing-director`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/team/dental-marketing-specialist`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/team/healthcare-seo-expert`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/team/medical-content-strategist`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    }
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
    
    blogRoutes = allBlogPosts.map((post) => {
      // 根據文章發布時間決定更新頻率
      const publishDate = new Date(post.publishedAt);
      const monthsOld = (currentDate.getFullYear() - publishDate.getFullYear()) * 12 + 
                        (currentDate.getMonth() - publishDate.getMonth());
      
      // 較新的內容更頻繁更新
      let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
      if (monthsOld < 1) {
        changeFrequency = 'weekly';
      } else if (monthsOld > 12) {
        changeFrequency = 'yearly';
      }
      
      // 檢查標題中是否包含醫療廣告法規關鍵字
      const isMedicalAdComplianceRelated = (post.title?.toLowerCase().includes('醫療廣告') || 
                                            post.title?.toLowerCase().includes('法規') ||
                                            post.title?.toLowerCase().includes('合規') ||
                                            post.title?.toLowerCase().includes('衛福部'));
      
      // 醫療廣告法規相關文章提高優先級
      const priorityValue = isMedicalAdComplianceRelated ? 0.92 : 
                           (post.tags.some(tag => [
                              '醫療專業知識', '牙醫臨床案例', '醫療行銷策略', 'EEAT', '醫學研究'
                           ].includes(tag)) ? 0.9 : 0.7);
      
      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt 
          ? new Date(post.updatedAt) 
          : new Date(post.publishedAt || currentDate),
        changeFrequency: changeFrequency,
        // 根據標籤和標題關鍵字決定優先級
        priority: priorityValue,
      }
    })
  } catch (error) {
    console.error('Error fetching blog data for sitemap:', error)
    // 繼續處理已有的資料，不因部落格獲取失敗而中斷整個 sitemap 生成
  }
  
  // 專業知識頁面
  const knowledgeBaseRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/knowledge/dental-marketing-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/knowledge/medical-seo-best-practices`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/knowledge/healthcare-social-media-compliance`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/knowledge/patient-experience-optimization`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // 新增醫療廣告法規知識庫相關頁面
    {
      url: `${baseUrl}/knowledge/medical-advertising-regulations`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/knowledge/medical-marketing-compliance-guide`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    }
  ]
  
  // 醫療廣告法規相關子頁面 - 確保搜尋引擎完整索引所有重要內容
  const medicalAdComplianceSubRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/service/medical-ad-compliance/case-studies`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/service/medical-ad-compliance/resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/service/medical-ad-compliance/faq`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.80,
    }
  ]
  
  // 組合所有路由
  return [
    ...staticRoutes, 
    ...serviceDetailRoutes, 
    ...teamDetailRoutes, 
    ...caseRoutes, 
    ...blogRoutes,
    ...knowledgeBaseRoutes,
    ...medicalAdComplianceSubRoutes
  ]
} 