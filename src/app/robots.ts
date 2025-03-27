import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.aideamed.com';
  
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
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace(/^https?:\/\//, ''),
  };
} 