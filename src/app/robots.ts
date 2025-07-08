import { MetadataRoute } from 'next';
import { 
  siteConfig, 
  robotsConfig, 
  existingRoutes,
  mediaContentPaths 
} from '@/config/seo';

/**
 * 優化的搜尋引擎爬蟲規則
 * 使用統一的 SEO 配置文件
 * 最後更新: 2024-12-19
 * 
 * SEO 優化重點：
 * - 統一配置管理提升維護性
 * - 針對不同搜尋引擎的個別優化
 * - 醫療內容的專業權威性保護
 * - AI 爬蟲的智能管理
 * - 圖片和媒體內容的優化索引
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 通用爬蟲規則
      {
        userAgent: '*',
        allow: robotsConfig.allowPaths.default,
        disallow: robotsConfig.disallowPaths.common,
        crawlDelay: robotsConfig.crawlDelay.default,
      },
      
      // Google 搜尋引擎優化
      {
        userAgent: 'Googlebot',
        allow: [
          ...robotsConfig.allowPaths.medical,
          ...robotsConfig.allowPaths.media,
          '/contact/', // Google 可以索引聯絡頁面
        ],
        disallow: robotsConfig.disallowPaths.searchEngine,
        crawlDelay: robotsConfig.crawlDelay.google,
      },
      
      // Google 圖片搜尋優化
      {
        userAgent: 'Googlebot-Image',
        allow: [
          ...robotsConfig.allowPaths.media,
          '/blog/',     // 部落格圖片
          '/team/',     // 團隊照片
          '/service/',  // 服務相關圖片
        ],
        disallow: [
          '/images/private/*',
          '/images/temp/*',
          '/images/.DS_Store',
        ],
        crawlDelay: robotsConfig.crawlDelay.google,
      },
      
      // Google 行動搜尋優化
      {
        userAgent: 'Googlebot-Mobile',
        allow: [
          ...robotsConfig.allowPaths.medical,
          ...robotsConfig.allowPaths.media,
          '/contact/',
        ],
        disallow: robotsConfig.disallowPaths.searchEngine,
        crawlDelay: robotsConfig.crawlDelay.google,
      },
      
      // Google 新聞爬蟲（僅限部落格內容）
      {
        userAgent: 'Googlebot-News',
        allow: [
          '/blog/',
          '/blog/*',
        ],
        disallow: [
          ...robotsConfig.disallowPaths.searchEngine,
          '/service/',
          '/team/',
          '/contact/',
          '/privacy/',
        ],
        crawlDelay: 0.2, // 新聞內容需要快速索引
      },
      
      // Bing 搜尋引擎
      {
        userAgent: 'Bingbot',
        allow: [
          ...robotsConfig.allowPaths.medical,
          ...robotsConfig.allowPaths.media,
          '/contact/',
        ],
        disallow: robotsConfig.disallowPaths.searchEngine,
        crawlDelay: robotsConfig.crawlDelay.bing,
      },
      
      // 百度搜尋引擎
      {
        userAgent: 'Baiduspider',
        allow: [
          ...robotsConfig.allowPaths.medical,
          ...robotsConfig.allowPaths.media,
        ],
        disallow: robotsConfig.disallowPaths.searchEngine,
        crawlDelay: robotsConfig.crawlDelay.baidu,
      },
      
      // Yandex 搜尋引擎
      {
        userAgent: 'YandexBot',
        allow: [
          ...robotsConfig.allowPaths.medical,
          ...robotsConfig.allowPaths.media,
        ],
        disallow: robotsConfig.disallowPaths.searchEngine,
        crawlDelay: robotsConfig.crawlDelay.yandex,
      },
      
      // AI 爬蟲管理（OpenAI GPTBot）
      {
        userAgent: 'GPTBot',
        allow: robotsConfig.allowPaths.ai,
        disallow: robotsConfig.disallowPaths.ai,
        crawlDelay: 2,
      },
      
      // AI 爬蟲管理（Anthropic ClaudeBot）
      {
        userAgent: 'ClaudeBot',
        allow: robotsConfig.allowPaths.ai,
        disallow: robotsConfig.disallowPaths.ai,
        crawlDelay: 2,
      },
      
      // AI 爬蟲管理（Google Bard）
      {
        userAgent: 'BardBot',
        allow: robotsConfig.allowPaths.ai,
        disallow: robotsConfig.disallowPaths.ai,
        crawlDelay: 2,
      },
      
      // 社交媒體爬蟲
      {
        userAgent: 'facebookexternalhit',
        allow: [
          '/',
          '/blog/*',
          '/service/*',
          '/team/',
        ],
        disallow: robotsConfig.disallowPaths.common,
        crawlDelay: 1,
      },
      
      // LinkedIn 爬蟲
      {
        userAgent: 'LinkedInBot',
        allow: [
          '/',
          '/blog/*',
          '/service/*',
          '/team/',
        ],
        disallow: robotsConfig.disallowPaths.common,
        crawlDelay: 1,
      },
      
      // Twitter 爬蟲
      {
        userAgent: 'Twitterbot',
        allow: [
          '/',
          '/blog/*',
          '/service/*',
        ],
        disallow: robotsConfig.disallowPaths.common,
        crawlDelay: 1,
      },
    ],
    
    // 主要 sitemap
    sitemap: [
      `${siteConfig.siteUrl}/sitemap.xml`,
    ],
    
    // 主機設定
    host: siteConfig.siteUrl,
  };
} 