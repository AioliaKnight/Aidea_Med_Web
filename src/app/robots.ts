import { MetadataRoute } from 'next';

/**
 * 提供給搜尋引擎的爬蟲規則
 * 使用 Next.js 內建的 MetadataRoute.Robots 功能
 * 控制搜尋引擎如何爬取和索引網站內容
 */
export default function robots(): MetadataRoute.Robots {
  // 從環境變數讀取基礎URL，如果不存在則使用預設值
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com';
  
  // 所有爬蟲共用的禁止爬取路徑
  const commonDisallow = [
    '/dev-sw.js',    // 開發者服務工作者
    '/_next/',       // Next.js 內部路徑
    '/.vercel/',     // Vercel 相關路徑
    '/404',          // 錯誤頁面
    '/500',          // 伺服器錯誤頁面
    '/admin',        // 管理頁面
    '/*.json$',      // JSON 檔案
    '/private/',     // 私有內容
    '/preview/',     // 預覽頁面
    '*/draft',       // 草稿頁面
    '*/temp',        // 暫存頁面
    '/unused/',      // 未使用的舊頁面
    '/test/',        // 測試頁面
  ];
  
  // 主要搜尋引擎的專用規則
  const searchEngineDisallow = [
    '/preview/',
    '*/draft',
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
        ],
        disallow: commonDisallow,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/images/',
          '/blog/',
          '/case/',
        ],
        disallow: searchEngineDisallow,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/images/',
          '/blog/',
          '/case/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/images/'],
        disallow: searchEngineDisallow,
      },
      {
        userAgent: 'Baiduspider',
        allow: ['/', '/images/'],
        disallow: searchEngineDisallow,
      },
      {
        userAgent: 'YandexBot',
        allow: ['/', '/images/'],
        disallow: searchEngineDisallow,
      },
      {
        userAgent: 'Applebot',
        allow: ['/', '/images/'],
        disallow: searchEngineDisallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace(/^https?:\/\//, ''),
  };
} 