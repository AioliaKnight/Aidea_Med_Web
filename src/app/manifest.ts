import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aidea:Med 醫療行銷顧問 - 專業診所數位行銷與品牌策略',
    short_name: 'Aidea:Med',
    description: '專注醫療行銷的顧問公司，提供診所品牌策略、數位行銷優化、社群媒體經營、SEO搜尋優化等一條龍服務。擁有實際診所營運經驗，協助醫療院所合規行銷與業績成長。',
    
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#e62733',
    
    orientation: 'portrait-primary',
    scope: '/',
    
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      }
    ],
    
    categories: [
      'medical',
      'marketing',
      'business',
      'consulting',
      'healthcare'
    ],
    
    lang: 'zh-TW',
    dir: 'ltr',
    
    // PWA 功能配置
    prefer_related_applications: false,
    related_applications: [],
    
    // 快捷方式
    shortcuts: [
      {
        name: '服務項目',
        short_name: '服務',
        description: '瀏覽我們的專業醫療行銷服務',
        url: '/service',
        icons: [
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: '聯絡我們',
        short_name: '聯絡',
        description: '立即聯絡專業顧問',
        url: '/contact',
        icons: [
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: '行銷新知',
        short_name: '新知',
        description: '最新醫療行銷趨勢與知識',
        url: '/blog',
        icons: [
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: '團隊介紹',
        short_name: '團隊',
        description: '認識Aidea:Med專業團隊',
        url: '/team',
        icons: [
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ],
    
    // 分享目標 (簡化版)
    share_target: {
      action: '/contact',
      method: 'GET',
      params: {
        title: 'title',
        text: 'text',
        url: 'url'
      }
    }
  }
} 