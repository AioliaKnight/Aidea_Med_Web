/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // 由於是中小型網站，不需要索引地圖
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  
  // 排除不需要的路徑
  exclude: [
    '/api/*',
    '/admin/*',
    '/dashboard/*',
    '/404',
    '/500',
    '/_*',
    '/server-sitemap.xml',
    '/sitemap.xml'
  ],
  
  // 針對不同類型頁面的優先級設定
  additionalPaths: async (config) => {
    const paths = [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/service',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/team',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/contact',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/blog',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
    ]
    
    return paths.map((path) => ({
      ...path,
      alternateRefs: [
        {
          href: `${config.siteUrl}${path.loc}`,
          hreflang: 'zh-Hant-TW',
        },
        {
          href: `${config.siteUrl}${path.loc}`,
          hreflang: 'zh-TW',
        },
      ]
    }))
  },
  
  // 自定義轉換函數
  transform: async (config, path) => {
    // 為 blog 文章設定特殊規則
    if (path.startsWith('/blog/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
        alternateRefs: [
          {
            href: `${config.siteUrl}${path}`,
            hreflang: 'zh-Hant-TW',
          },
        ]
      }
    }
    
    // 為服務頁面設定規則
    if (path.startsWith('/service')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }
    
    // 預設設定
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: `${config.siteUrl}${path}`,
          hreflang: 'zh-Hant-TW',
        },
      ]
    }
  },
  
  // robots.txt 配置
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/404',
          '/500'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
        ],
      }
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'}/server-sitemap.xml`,
    ],
    // 添加爬取延遲，避免過度負載
    crawlDelay: 1,
    host: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com',
  },
} 