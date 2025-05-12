import { MetadataRoute } from 'next';

/**
 * 提供給搜尋引擎的爬蟲規則
 * 使用 Next.js 內建的 MetadataRoute.Robots 功能
 * 控制搜尋引擎如何爬取和索引網站內容
 * 採用分級權限設計，針對不同搜尋引擎提供差異化的存取權限
 * 最後更新: 2024-07-04
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
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
    '/privacy/medical-compliance/', // 醫療合規隱私政策
  ];
  
  // 社群媒體機器人允許的路徑
  const socialMediaAllowPaths = [
    '/',
    '/blog/*',
    '/case/*',
    '/service/*', 
    '/team/*',
  ];
  
  // 社群媒體機器人禁止的路徑
  const socialMediaDisallowPaths = [
    '/api/*', 
    '/_next/*',
    '/admin/*',
  ];
  
  // AI爬蟲允許的路徑
  const aiAllowPaths = [
    '/',
    '/blog/*',
    '/service/*',
  ];
  
  // AI爬蟲禁止的路徑
  const aiDisallowPaths = [
    '/api/*',
    '/admin/*',
    '/contact/*',
    '/team/*',
    '/case/*',
  ];
  
  return {
    rules: [
      // 所有爬蟲的通用規則
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
      // Google 主爬蟲
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      // Google 圖片爬蟲
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
      // Bing 爬蟲
      {
        userAgent: 'Bingbot',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      // 百度爬蟲
      {
        userAgent: 'Baiduspider',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      // Yandex 爬蟲
      {
        userAgent: 'YandexBot',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      // Apple 爬蟲
      {
        userAgent: 'Applebot',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      // DuckDuckGo 爬蟲
      {
        userAgent: 'DuckDuckBot',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
      },
      // Facebook 爬蟲
      {
        userAgent: 'facebookexternalhit',
        allow: socialMediaAllowPaths,
        disallow: socialMediaDisallowPaths,
      },
      // LinkedIn 爬蟲
      {
        userAgent: 'LinkedInBot',
        allow: socialMediaAllowPaths,
        disallow: socialMediaDisallowPaths,
      },
      // Twitter/X 爬蟲
      {
        userAgent: 'Twitterbot',
        allow: socialMediaAllowPaths,
        disallow: socialMediaDisallowPaths,
      },
      // Google商業資訊爬蟲
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
      // OpenAI GPT 爬蟲
      {
        userAgent: 'GPTBot',
        allow: aiAllowPaths,
        disallow: aiDisallowPaths,
      },
      // Anthropic 爬蟲
      {
        userAgent: 'Anthropic-AI',
        allow: aiAllowPaths,
        disallow: aiDisallowPaths,
      },
      // Common Crawl 爬蟲
      {
        userAgent: 'CCBot',
        allow: aiAllowPaths,
        disallow: aiDisallowPaths,
      },
      // Omgili 爬蟲
      {
        userAgent: 'Omgilibot',
        allow: aiAllowPaths,
        disallow: aiDisallowPaths,
      },
    ],
    // 明確指定 sitemap 位置
    sitemap: `${baseUrl}/sitemap.xml`,
    // 明確指定主機名稱
    host: baseUrl,
  };
} 