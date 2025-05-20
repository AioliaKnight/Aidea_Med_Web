import { MetadataRoute } from 'next';

/**
 * 提供給搜尋引擎的爬蟲規則
 * 使用 Next.js 內建的 MetadataRoute.Robots 功能
 * 控制搜尋引擎如何爬取和索引網站內容
 * 最後更新: 2024-07-20
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
    '/draft/*',      // 草稿內容
    '/preview/*',    // 預覽內容
    '/login/*',      // 登入頁面
    '/register/*',   // 註冊頁面
    '/account/*',    // 帳戶頁面
    '/temp/*',       // 臨時頁面
    '/test/*',       // 測試頁面
  ];
  
  // 搜索引擎特定的禁止路徑，可以比通用爬蟲獲得更多訪問權限
  const searchEngineDisallow = [
    '/api/*',
    '/_next/*',
    '/admin/*',
    '/draft/*',
    '/preview/*',
    '/temp/*',
    '/test/*',
  ];
  
  // 主要醫療行銷內容路徑 - 只包含實際存在的頁面
  const medicalMarketingContentPaths = [
    '/blog/',
    '/case/',
    '/service/',
    '/team/',
    '/service/medical-ad-compliance/', // 醫療廣告法規遵循頁面
    '/blog/dental-advertising-regulations/', // 牙醫廣告法規專文
  ];
  
  // AI 爬蟲可訪問的路徑
  const aiAllowedPaths = [
    '/',
    '/blog/*',
    '/service/*',
  ];
  
  // AI 爬蟲禁止訪問的路徑（比一般搜索引擎更嚴格）
  const aiDisallowPaths = [
    ...searchEngineDisallow,
    '/contact/*',
    '/team/*',
    '/case/*',
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
          '/service/medical-ad-compliance/', // 特別允許醫療廣告法規遵循頁面
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
          '/service/', // 允許Google圖片機器人爬取服務頁面
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
      // 特別優化 Google 行動裝置支援
      {
        userAgent: 'Googlebot-Mobile',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      // 特別優化 Google 新聞機器人
      {
        userAgent: 'Googlebot-News',
        allow: [
          '/blog/'
        ],
        disallow: [
          ...searchEngineDisallow,
          '/service/',
          '/team/',
          '/case/',
          '/contact/'
        ],
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
      // 新增 Twitter/X 爬蟲
      {
        userAgent: 'Twitterbot',
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
      // 新增 Google商業資訊爬蟲
      {
        userAgent: 'Google-Business-Information',
        allow: [
          '/',
          '/service/*', 
          '/contact/*',
          '/about/*',
        ],
        disallow: searchEngineDisallow,
      },
      // AI 爬蟲規則 - OpenAI
      {
        userAgent: 'GPTBot',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
      },
      // AI 爬蟲規則 - Anthropic
      {
        userAgent: 'Anthropic-AI',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
      },
      // AI 爬蟲規則 - Common Crawl
      {
        userAgent: 'CCBot',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
      },
      // AI 爬蟲規則 - Claude
      {
        userAgent: 'Claude',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
      },
      // AI 爬蟲規則 - Cohere
      {
        userAgent: 'Cohere-AI',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
      },
      // AI 爬蟲規則 - Perplexity
      {
        userAgent: 'PerplexityBot',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
      },
      // AI 爬蟲規則 - Google Bard/Gemini
      {
        userAgent: 'Google-Extended',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
} 