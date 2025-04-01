import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // 從環境變數讀取基礎URL，如果不存在則使用預設值
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',         // API 路徑
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
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/preview/',
          '*/draft',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/preview/',
          '*/draft',
        ],
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
        disallow: [
          '/api/',
          '/preview/',
          '*/draft',
        ],
      },
      {
        userAgent: 'YandexBot',
        allow: '/',
        disallow: [
          '/api/',
          '/preview/',
          '*/draft',
        ],
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: [
          '/api/',
          '/preview/',
          '*/draft',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace(/^https?:\/\//, ''),
  };
} 