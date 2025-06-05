import { MetadataRoute } from 'next';

/**
 * 提供給搜尋引擎的爬蟲規則
 * 使用 Next.js 內建的 MetadataRoute.Robots 功能
 * 控制搜尋引擎如何爬取和索引網站內容
 * 最後更新: 2024-12-19
 * 
 * SEO 優化重點：
 * - 針對不同搜尋引擎的個別優化
 * - 醫療內容的專業權威性保護
 * - AI 爬蟲的智能管理
 * - 圖片和媒體內容的優化索引
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
    '/.well-known/*', // 系統配置文件
    '/sw.js',        // Service Worker
    '/workbox-*',    // Workbox 文件
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
    '/.well-known/*',
    '/sw.js',
    '/workbox-*',
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
  
  // AI 爬蟲可訪問的路徑 - 只包含實際存在的內容
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

  // 圖片和媒體內容路徑
  const mediaContentPaths = [
    '/images/',
    '/videos/',
    '/documents/',
    '/downloads/',
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
        crawlDelay: 1, // 設定爬取延遲，減輕伺服器負擔
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 0.5, // Google 可以更頻繁爬取
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
        disallow: [
          '/images/private/*',
          '/images/temp/*',
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
        crawlDelay: 1,
      },
      {
        userAgent: 'Baiduspider',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 2, // 百度爬蟲較慢
      },
      {
        userAgent: 'YandexBot',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 1,
      },
      {
        userAgent: 'Applebot',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 1,
      },
      {
        userAgent: 'DuckDuckBot',
        allow: [
          '/', 
          '/images/',
          ...medicalMarketingContentPaths,
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 1,
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
        crawlDelay: 0.5,
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
        crawlDelay: 0.2, // 新聞內容需要快速索引
      },
      // 社交媒體爬蟲
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
        crawlDelay: 1,
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
        crawlDelay: 1,
      },
      // 新增 Twitter/X 爬蟲
      {
        userAgent: 'Twitterbot',
        allow: [
          '/',
          '/blog/*',
          '/case/*',
          '/service/*',
        ],
        disallow: [
          '/api/*',
          '/_next/*',
          '/admin/*',
          '/team/*', // Twitter 不需要團隊頁面
        ],
        crawlDelay: 1,
      },
      // AI 訓練爬蟲管理
      {
        userAgent: 'GPTBot',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
        crawlDelay: 5, // AI 爬蟲較慢的爬取速度
      },
      {
        userAgent: 'ChatGPT-User',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
        crawlDelay: 5,
      },
      {
        userAgent: 'CCBot',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
        crawlDelay: 5,
      },
      {
        userAgent: 'anthropic-ai',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
        crawlDelay: 5,
      },
      {
        userAgent: 'Claude-Web',
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
        crawlDelay: 5,
      },
      // 學術研究爬蟲
      {
        userAgent: 'ia_archiver',
        allow: [
          '/blog/*',
          '/service/medical-ad-compliance/*',
        ],
        disallow: [
          ...commonDisallow,
          '/case/*',
          '/team/*',
          '/contact/*',
        ],
        crawlDelay: 10, // 檔案館爬蟲較慢
      },
      // 惡意爬蟲封鎖
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'DataForSeoBot',
        ],
        disallow: ['/'],
      },
      // SEO 工具爬蟲（有限制的允許）
      {
        userAgent: 'ScreamingFrogSEOSpider',
        allow: [
          '/',
          '/blog/',
          '/service/',
        ],
        disallow: [
          ...commonDisallow,
          '/case/*',
          '/team/*',
          '/contact/*',
        ],
        crawlDelay: 10,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-0.xml`, // 如果有分割的 sitemap
    ],
    host: baseUrl,
  };
} 