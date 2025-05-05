import { MetadataRoute } from 'next';

/**
 * 提供給搜尋引擎的爬蟲規則
 * 使用 Next.js 內建的 MetadataRoute.Robots 功能
 * 控制搜尋引擎如何爬取和索引網站內容
 */
export default function robots(): MetadataRoute.Robots {
  // 從環境變數讀取基礎URL，如果不存在則使用預設值
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com';
  
  // 常見需要禁止爬蟲的路徑
  const commonDisallow = [
    '/api/*',
    '/admin/*',
    '/_next/*',
    '/*/api/*',
    '*/maintenance*',
    '/privacy/internal/*',
  ];
  
  // 搜索引擎特定的禁止路徑，可以比通用爬蟲獲得更多訪問權限
  const searchEngineDisallow = [
    '/api/*',
    '/_next/*',
    '/admin/*',
  ];
  
  // 主要醫療行銷內容路徑 - 明確允許爬取
  const medicalMarketingContentPaths = [
    '/blog/',
    '/case/',
    '/service/',
    '/team/',
    '/service/brand-strategy',
    '/service/digital-marketing',
    '/service/social-media',
    '/service/seo-optimization',
    '/service/practice-design',
    '/service/ai-solutions',
  ];
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/images/', // 允許爬取圖片目錄
          '/blog/',   // 明確允許爬取部落格目錄
          '/case/',   // 明確允許爬取案例目錄
          '/service/', // 明確允許爬取服務目錄
          '/team/',   // 明確允許爬取團隊目錄
          '/contact/', // 允許爬取聯絡頁面
        ],
        disallow: commonDisallow,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/images/',
          '/blog/',
          '/case/',
          '/team/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      {
        userAgent: 'Baiduspider',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      {
        userAgent: 'YandexBot',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      {
        userAgent: 'Applebot',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      {
        userAgent: 'DuckDuckBot',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      {
        userAgent: 'facebookexternalhit',
        allow: [
          '/',
          '/blog/*',
          '/case/*',
          '/service/*', 
          '/team/*',
        ],
        disallow: [
          '/api/*', 
          '/_next/*',
          '/admin/*',
        ],
      },
      {
        userAgent: 'LinkedInBot',
        allow: [
          '/',
          '/blog/*',
          '/case/*',
          '/service/*', 
          '/team/*',
        ],
        disallow: [
          '/api/*', 
          '/_next/*',
          '/admin/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace(/^https?:\/\//, ''),
  };
} 