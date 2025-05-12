/** @type {import('next-sitemap').IConfig} */

// next-sitemap 配置檔案
// 用於控制網站地圖生成的詳細設定
// 最後更新: 2024-07-04
// @see https://github.com/iamvishnusankar/next-sitemap

module.exports = {
  // 網站根域名，從環境變數讀取或使用預設值
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com',
  
  // 生成頻率 - 每次建置時生成
  generateRobotsTxt: false, // 我們使用 Next.js App Router 的 robots.ts
  
  // 變更頻率設定
  changefreq: 'weekly',
  
  // 預設優先級
  priority: 0.7,
  
  // 排除路徑
  exclude: [
    '/api/*',
    '/admin/*',
    '/_next/*',
    '/*/api/*',
    '/maintenance*',
    '/404',
    '/500',
    '/draft/*',
    '/preview/*',
    '/login/*',
    '/register/*',
    '/account/*',
    '/temp/*',
    '/test/*',
  ],
  
  // 額外屬性
  additionalPaths: async (config) => {
    // 特殊頁面自定義設定
    return [
      {
        loc: '/',
        priority: 1.0,
        changefreq: 'weekly',
      },
      {
        loc: '/blog/dental-advertising-regulations',
        priority: 0.95,
        changefreq: 'monthly',
      },
      {
        loc: '/service/medical-ad-compliance',
        priority: 0.95,
        changefreq: 'monthly',
      }
    ]
  },
  
  // 轉換功能 - 處理每個URL項目
  transform: async (config, path) => {
    // 基本路徑項目
    const url = new URL(path, config.siteUrl).href;
    const defaultItem = {
      loc: url,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
    
    // 按路徑類型自定義設定
    if (path === '/') {
      return {
        ...defaultItem,
        priority: 1.0,
        changefreq: 'weekly',
      }
    }
    
    // 部落格文章 - 較高優先級
    if (path.startsWith('/blog/')) {
      return {
        ...defaultItem,
        priority: 0.8,
        changefreq: 'monthly',
      }
    }
    
    // 服務頁面 - 較高優先級 
    if (path.startsWith('/service/')) {
      return {
        ...defaultItem,
        priority: 0.9,
        changefreq: 'monthly',
      }
    }
    
    // 案例頁面
    if (path.startsWith('/case/')) {
      return {
        ...defaultItem,
        priority: 0.8,
        changefreq: 'monthly',
      }
    }
    
    // 預設返回原配置
    return defaultItem;
  },
} 