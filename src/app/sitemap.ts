import { MetadataRoute } from 'next'
import { caseStudies } from '@/data/cases'
import { getAllBlogPosts } from '@/lib/blog-server'

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
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    }
  ]
  
  // 服務詳情頁面
  const serviceDetailRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/service/brand-strategy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/digital-marketing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/social-media`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/seo-optimization`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/practice-design`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/ai-solutions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/content-marketing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service/medical-ad-compliance`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }
  ]
  
  // 團隊成員詳情頁面
  const teamDetailRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/team/medical-marketing-director`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/team/dental-marketing-specialist`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/team/healthcare-seo-expert`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/team/medical-content-strategist`,
      lastModified: new Date(),
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
          : new Date(caseStudy.publishedDate || new Date()),
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
      const currentDate = new Date();
      const monthsOld = (currentDate.getFullYear() - publishDate.getFullYear()) * 12 + 
                        (currentDate.getMonth() - publishDate.getMonth());
      
      // 較新的內容更頻繁更新
      let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
      if (monthsOld < 1) {
        changeFrequency = 'weekly';
      } else if (monthsOld > 12) {
        changeFrequency = 'yearly';
      }
      
      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt 
          ? new Date(post.updatedAt) 
          : new Date(post.publishedAt || new Date()),
        changeFrequency: changeFrequency,
        // 根據標籤決定優先級 - 醫療專業內容優先
        priority: post.tags.some(tag => [
          '醫療專業知識', '牙醫臨床案例', '醫療行銷策略', 'EEAT', '醫學研究'
        ].includes(tag)) ? 0.9 : 0.7,
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
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/knowledge/medical-seo-best-practices`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/knowledge/healthcare-social-media-compliance`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/knowledge/patient-experience-optimization`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  ]
  
  // 組合所有路由
  return [
    ...staticRoutes, 
    ...serviceDetailRoutes, 
    ...teamDetailRoutes, 
    ...caseRoutes, 
    ...blogRoutes,
    ...knowledgeBaseRoutes
  ]
} 