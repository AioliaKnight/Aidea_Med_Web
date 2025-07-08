/**
 * 統一的 SEO 配置文件
 * 為 sitemap.ts、robots.ts 和其他 SEO 功能提供統一配置
 * 最後更新: 2024-12-19
 */

export interface SiteConfig {
  siteUrl: string
  siteName: string
  siteDescription: string
  defaultLanguage: string
  supportedLanguages: string[]
}

export interface SitemapConfig {
  changeFrequency: {
    homepage: 'daily' | 'weekly' | 'monthly' | 'yearly'
    blog: 'daily' | 'weekly' | 'monthly' | 'yearly'
    services: 'daily' | 'weekly' | 'monthly' | 'yearly'
    pages: 'daily' | 'weekly' | 'monthly' | 'yearly'
  }
  priority: {
    homepage: number
    blog: number
    blogPost: number
    services: number
    serviceDetail: number
    pages: number
    privacy: number
  }
  excludePaths: string[]
  maxEntries: number
}

export interface RobotsConfig {
  crawlDelay: {
    default: number
    google: number
    bing: number
    baidu: number
    yandex: number
  }
  disallowPaths: {
    common: string[]
    searchEngine: string[]
    ai: string[]
  }
  allowPaths: {
    default: string[]
    medical: string[]
    media: string[]
    ai: string[]
  }
}

export interface BlogConfig {
  highValueTags: string[]
  relevanceWeights: {
    tags: number
    title: number
    summary: number
  }
  priorityThresholds: {
    high: number
    medium: number
  }
  freshnessPeriods: {
    fresh: number    // 月數
    outdated: number // 月數
  }
}

// 主要網站配置
export const siteConfig: SiteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com',
  siteName: 'Aidea:Med 醫療行銷顧問',
  siteDescription: '專業醫療行銷顧問，提供牙醫診所行銷、醫療廣告法規諮詢、醫療SEO優化等服務',
  defaultLanguage: 'zh-Hant-TW',
  supportedLanguages: ['zh-Hant-TW', 'zh-TW'],
}

// Sitemap 配置
export const sitemapConfig: SitemapConfig = {
  changeFrequency: {
    homepage: 'weekly',
    blog: 'daily',
    services: 'monthly',
    pages: 'monthly',
  },
  priority: {
    homepage: 1.0,
    blog: 0.9,
    blogPost: 0.8,
    services: 0.9,
    serviceDetail: 0.95,
    pages: 0.7,
    privacy: 0.5,
  },
  excludePaths: [
    '/api/*',
    '/admin/*',
    '/dashboard/*',
    '/404',
    '/500',
    '/_*',
    '/server-sitemap.xml',
    '/sitemap.xml',
  ],
  maxEntries: 50000,
}

// Robots 配置
export const robotsConfig: RobotsConfig = {
  crawlDelay: {
    default: 1,
    google: 0.5,
    bing: 1,
    baidu: 2,
    yandex: 1.5,
  },
  disallowPaths: {
    common: [
      '/api/*',
      '/_next/*',
      '/sw.js',
      '/workbox-*',
      '/.well-known/*',
      '/admin/*',
      '/login/*',
      '/register/*',
      '/account/*',
      '/dashboard/*',
      '/preview/*',
      '/draft/*',
      '/temp/*',
      '/test/*',
      '/maintenance/*',
    ],
    searchEngine: [
      '/api/*',
      '/_next/*',
      '/sw.js',
      '/workbox-*',
      '/.well-known/*',
      '/admin/*',
      '/preview/*',
      '/draft/*',
      '/temp/*',
      '/test/*',
    ],
    ai: [
      '/api/*',
      '/_next/*',
      '/sw.js',
      '/workbox-*',
      '/.well-known/*',
      '/admin/*',
      '/preview/*',
      '/draft/*',
      '/temp/*',
      '/test/*',
      '/contact/*',
      '/team/*',
      '/privacy/*',
    ],
  },
  allowPaths: {
    default: [
      '/',
      '/blog/',
      '/blog/*',
      '/service/',
      '/service/*',
      '/team/',
      '/contact/',
      '/privacy/',
      '/images/',
      '/icons/',
      '/favicon*',
      '/logo*',
      '/android-chrome*',
      '/apple-touch*',
      '/manifest.json',
    ],
    medical: [
      '/',
      '/blog/',
      '/blog/*',
      '/service/',
      '/service/medical-ad-compliance/',
      '/team/',
    ],
    media: [
      '/images/',
      '/icons/',
      '/favicon*',
      '/logo*',
      '/android-chrome*',
      '/apple-touch*',
      '/manifest.json',
    ],
    ai: [
      '/',
      '/blog/*',
      '/service/*',
    ],
  },
}

// 部落格配置
export const blogConfig: BlogConfig = {
  highValueTags: [
    '醫療廣告', '法規', '合規', '衛福部', '醫療法', 
    '醫療行銷', '廣告違規', '醫師公會', '醫事法規',
    '牙醫', '診所經營', 'EEAT', '專業性', '權威性',
    'SEO', '數位行銷', '社群媒體', '內容行銷',
    '品牌建立', '客戶關係', '醫療傳播', '病患教育'
  ],
  relevanceWeights: {
    tags: 2,
    title: 3,
    summary: 1,
  },
  priorityThresholds: {
    high: 7,
    medium: 4,
  },
  freshnessPeriods: {
    fresh: 3,
    outdated: 12,
  },
}

// 實際存在的路由 - 基於專案結構
export const existingRoutes = [
  '/',
  '/blog',
  '/service',
  '/service/medical-ad-compliance',
  '/team',
  '/contact',
  '/privacy',
] as const

// 媒體內容路徑
export const mediaContentPaths = [
  '/images',
  '/icons',
  '/favicon*',
  '/logo*',
  '/android-chrome*',
  '/apple-touch*',
  '/manifest.json',
] as const

// 支援的圖片格式
export const supportedImageFormats = [
  '.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'
] as const

/**
 * 獲取部落格文章的優先級
 */
export function calculateBlogPriority(
  post: {
    title: string
    summary?: string
    tags?: string[]
    publishedAt?: string
    updatedAt?: string
    slug: string
  }
): { priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' } {
  const currentDate = new Date()
  const publishDate = post.publishedAt ? new Date(post.publishedAt) : currentDate
  const monthsOld = (currentDate.getFullYear() - publishDate.getFullYear()) * 12 + 
                   (currentDate.getMonth() - publishDate.getMonth())

  // 計算相關性分數
  const titleLower = post.title.toLowerCase()
  const summaryLower = post.summary?.toLowerCase() || ''
  
  const tagRelevance = (post.tags || [])
    .filter(tag => blogConfig.highValueTags.some(keyword => tag.includes(keyword)))
    .length * blogConfig.relevanceWeights.tags

  const titleRelevance = blogConfig.highValueTags
    .filter(keyword => titleLower.includes(keyword))
    .length * blogConfig.relevanceWeights.title

  const summaryRelevance = blogConfig.highValueTags
    .filter(keyword => summaryLower.includes(keyword))
    .length * blogConfig.relevanceWeights.summary

  const relevanceScore = Math.min(10, tagRelevance + titleRelevance + summaryRelevance)

  // 特定重要文章
  if (post.slug === 'dental-advertising-regulations') {
    return { priority: 0.95, changeFrequency: 'weekly' }
  }

  // 高相關性內容
  if (relevanceScore >= blogConfig.priorityThresholds.high) {
    return { priority: 0.92, changeFrequency: 'weekly' }
  }

  // 中相關性內容
  if (relevanceScore >= blogConfig.priorityThresholds.medium) {
    return { priority: 0.85, changeFrequency: 'monthly' }
  }

  // 新鮮內容
  if (monthsOld < blogConfig.freshnessPeriods.fresh) {
    return { priority: 0.8, changeFrequency: 'weekly' }
  }

  // 過時內容
  if (monthsOld > blogConfig.freshnessPeriods.outdated) {
    return { priority: 0.7, changeFrequency: 'yearly' }
  }

  // 預設
  return { priority: 0.75, changeFrequency: 'monthly' }
}

/**
 * 獲取頁面的更新頻率
 */
export function getChangeFrequency(path: string): 'daily' | 'weekly' | 'monthly' | 'yearly' {
  if (path === '/') return sitemapConfig.changeFrequency.homepage
  if (path.startsWith('/blog')) return sitemapConfig.changeFrequency.blog
  if (path.startsWith('/service')) return sitemapConfig.changeFrequency.services
  return sitemapConfig.changeFrequency.pages
}

/**
 * 獲取頁面的優先級
 */
export function getPriority(path: string): number {
  if (path === '/') return sitemapConfig.priority.homepage
  if (path === '/blog') return sitemapConfig.priority.blog
  if (path.startsWith('/blog/')) return sitemapConfig.priority.blogPost
  if (path === '/service') return sitemapConfig.priority.services
  if (path.startsWith('/service/')) return sitemapConfig.priority.serviceDetail
  if (path === '/privacy') return sitemapConfig.priority.privacy
  return sitemapConfig.priority.pages
} 