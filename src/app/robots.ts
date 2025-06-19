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
 * - 基於實際專案結構的路徑驗證
 */
export default function robots(): MetadataRoute.Robots {
  // 從環境變數讀取基礎URL，如果不存在則使用預設值
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com';
  
  // 實際存在的路由路徑 - 基於專案結構驗證
  const existingRoutes = [
    '/',              // 首頁 (src/app/page.tsx)
    '/blog/',         // 部落格列表 (src/app/blog/page.tsx)
    '/blog/*',        // 部落格詳情 (src/app/blog/[slug]/page.tsx)
    '/case/',         // 案例列表 (src/app/case/page.tsx)
    '/case/*',        // 案例詳情 (src/app/case/[id]/page.tsx)
    '/service/',      // 服務介紹 (src/app/service/page.tsx)
    '/service/medical-ad-compliance/', // 醫療廣告法規 (src/app/service/medical-ad-compliance/page.tsx)
    '/team/',         // 團隊介紹 (src/app/team/page.tsx)
    '/contact/',      // 聯絡我們 (src/app/contact/page.tsx)
    '/privacy/',      // 隱私政策 (src/app/privacy/page.tsx)
  ];
  
  // 需要禁止爬蟲的系統路徑
  const systemDisallow = [
    '/api/*',         // API 路由 (src/app/api/*)
    '/_next/*',       // Next.js 系統文件
    '/sw.js',         // Service Worker (public/sw.js)
    '/workbox-*',     // Workbox 文件 (public/workbox-*.js)
    '/.well-known/*', // 系統配置 (public/.well-known/*)
  ];
  
  // 預防性禁止路徑（可能未來會添加的功能）
  const preventiveDisallow = [
    '/admin/*',       // 管理介面
    '/login/*',       // 登入頁面
    '/register/*',    // 註冊頁面
    '/account/*',     // 帳戶頁面
    '/dashboard/*',   // 儀表板
    '/preview/*',     // 預覽功能
    '/draft/*',       // 草稿內容
    '/temp/*',        // 臨時頁面
    '/test/*',        // 測試頁面
    '/maintenance/*', // 維護頁面
  ];
  
  // 通用爬蟲禁止路徑
  const commonDisallow = [
    ...systemDisallow,
    ...preventiveDisallow,
  ];
  
  // 搜索引擎特定禁止路徑（較寬鬆）
  const searchEngineDisallow = [
    ...systemDisallow,
    '/admin/*',
    '/preview/*',
    '/draft/*',
    '/temp/*',
    '/test/*',
  ];
  
  // 醫療行銷專業內容路徑 - 高優先級索引
  const medicalContentPaths = [
    '/',
    '/blog/',
    '/blog/*',
    '/service/',
    '/service/medical-ad-compliance/',
    '/case/',
    '/case/*',
    '/team/',
  ];
  
  // AI 爬蟲允許的內容路徑（較嚴格控制）
  const aiAllowedPaths = [
    '/',
    '/blog/*',        // 允許AI學習醫療行銷知識
    '/service/*',     // 允許AI了解服務內容
  ];
  
  // AI 爬蟲禁止路徑（保護敏感內容）
  const aiDisallowPaths = [
    ...searchEngineDisallow,
    '/contact/*',     // 保護聯絡資訊
    '/team/*',        // 保護團隊資訊
    '/case/*',        // 保護客戶案例
    '/privacy/*',     // 保護隱私政策
  ];
  
  // 圖片和媒體內容路徑 - 基於實際目錄結構
  const mediaContentPaths = [
    '/images/',       // 主要圖片目錄 (public/images/)
    '/icons/',        // 圖標目錄 (public/icons/)
    '/favicon*',      // Favicon 文件
    '/logo*',         // Logo 文件
    '/android-chrome*', // Android 圖標
    '/apple-touch*',  // Apple 圖標
    '/manifest.json', // PWA 配置
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          ...existingRoutes,
          ...mediaContentPaths,
        ],
        disallow: commonDisallow,
        crawlDelay: 1, // 通用爬蟲延遲1秒
      },
      
      // Google 搜尋引擎優化
      {
        userAgent: 'Googlebot',
        allow: [
          ...medicalContentPaths,
          ...mediaContentPaths,
          '/contact/', // Google 可以索引聯絡頁面
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 0.5, // Google 可以更頻繁爬取
      },
      
      // Google 圖片搜尋優化
      {
        userAgent: 'Googlebot-Image',
        allow: [
          ...mediaContentPaths,
          '/blog/',     // 部落格圖片
          '/case/',     // 案例圖片
          '/team/',     // 團隊照片
          '/service/',  // 服務相關圖片
        ],
        disallow: [
          '/images/private/*',
          '/images/temp/*',
          '/images/.DS_Store',
        ],
        crawlDelay: 0.5,
      },
      
      // Google 行動搜尋優化
      {
        userAgent: 'Googlebot-Mobile',
        allow: [
          ...medicalContentPaths,
          ...mediaContentPaths,
          '/contact/',
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 0.5,
      },
      
      // Google 新聞爬蟲（僅限部落格內容）
      {
        userAgent: 'Googlebot-News',
        allow: [
          '/blog/',
          '/blog/*',
        ],
        disallow: [
          ...searchEngineDisallow,
          '/service/',
          '/team/',
          '/case/',
          '/contact/',
          '/privacy/',
        ],
        crawlDelay: 0.2, // 新聞內容需要快速索引
      },
      
      // Bing 搜尋引擎
      {
        userAgent: 'Bingbot',
        allow: [
          ...medicalContentPaths,
          ...mediaContentPaths,
          '/contact/',
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 1,
      },
      
      // 百度搜尋引擎
      {
        userAgent: 'Baiduspider',
        allow: [
          ...medicalContentPaths,
          ...mediaContentPaths,
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 2, // 百度爬蟲較慢的網路環境
      },
      
      // Yandex 搜尋引擎
      {
        userAgent: 'YandexBot',
        allow: [
          ...medicalContentPaths,
          ...mediaContentPaths,
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 1,
      },
      
      // Apple 搜尋
      {
        userAgent: 'Applebot',
        allow: [
          ...medicalContentPaths,
          ...mediaContentPaths,
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 1,
      },
      
      // DuckDuckGo 搜尋
      {
        userAgent: 'DuckDuckBot',
        allow: [
          ...medicalContentPaths,
          ...mediaContentPaths,
        ],
        disallow: searchEngineDisallow,
        crawlDelay: 1,
      },
      
      // 社交媒體爬蟲優化
      {
        userAgent: 'facebookexternalhit',
        allow: [
          '/',
          '/blog/*',
          '/case/*',
          '/service/*',
          '/team/',
          ...mediaContentPaths,
        ],
        disallow: systemDisallow,
        crawlDelay: 1,
      },
      
      {
        userAgent: 'LinkedInBot',
        allow: [
          '/',
          '/blog/*',
          '/case/*',
          '/service/*',
          '/team/',
          ...mediaContentPaths,
        ],
        disallow: systemDisallow,
        crawlDelay: 1,
      },
      
      {
        userAgent: 'Twitterbot',
        allow: [
          '/',
          '/blog/*',
          '/service/*', // Twitter 主要分享服務內容
          ...mediaContentPaths,
        ],
        disallow: [
          ...systemDisallow,
          '/case/*',   // Twitter 不分享案例
          '/team/*',   // Twitter 不分享團隊資訊
          '/contact/*',
          '/privacy/*',
        ],
        crawlDelay: 1,
      },
      
      // AI 訓練爬蟲管理（嚴格控制）
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        allow: aiAllowedPaths,
        disallow: aiDisallowPaths,
        crawlDelay: 5, // AI 爬蟲較慢的爬取速度
      },
      
      // 學術研究爬蟲（有限開放）
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
        crawlDelay: 10, // 檔案館爬蟲低優先級
      },
      
      // SEO 工具爬蟲（有限制的允許）
      {
        userAgent: 'ScreamingFrogSEOSpider',
        allow: [
          '/',
          '/blog/',
          '/service/',
          ...mediaContentPaths,
        ],
        disallow: [
          ...commonDisallow,
          '/case/*',
          '/team/*',
          '/contact/*',
        ],
        crawlDelay: 10,
      },
      
      // 惡意爬蟲完全封鎖
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot', 
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'DataForSeoBot',
          'SiteAuditBot',
          'MegaIndex',
          'BUbiNG',
          'linkdexbot',
          'Mail.RU_Bot',
          'PetalBot',
          'YisouSpider',
        ],
        disallow: ['/'],
      },
    ],
    
    // Sitemap 配置
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
    
    // 主機配置
    host: baseUrl,
  };
} 