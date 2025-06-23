import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aidea:Med 醫療行銷顧問 - 專業診所數位行銷與品牌策略',
    short_name: 'Aidea:Med',
    description: '專注醫療行銷的顧問公司，提供診所品牌策略、數位行銷優化、社群媒體經營、SEO搜尋優化等一條龍服務。擁有實際診所營運經驗，協助醫療院所合規行銷與業績成長。',
    
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4A6CF7',
    
    orientation: 'portrait-primary',
    scope: '/',
    
    icons: [
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/icons/favicon-16x16.png',
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
            src: '/icons/service-shortcut.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: '成功案例',
        short_name: '案例',
        description: '查看醫療行銷成功案例',
        url: '/case',
        icons: [
          {
            src: '/icons/case-shortcut.png',
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
            src: '/icons/contact-shortcut.png',
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
            src: '/icons/blog-shortcut.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ],
    
    // 螢幕截圖 (用於 PWA 安裝提示)
    screenshots: [
      {
        src: '/screenshots/homepage-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Aidea:Med 首頁 - 桌面版'
      },
      {
        src: '/screenshots/homepage-mobile.png',
        sizes: '375x667',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Aidea:Med 首頁 - 手機版'
      },
      {
        src: '/screenshots/services-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: '服務項目頁面 - 桌面版'
      },
      {
        src: '/screenshots/services-mobile.png',
        sizes: '375x667',
        type: 'image/png',
        form_factor: 'narrow',
        label: '服務項目頁面 - 手機版'
      }
    ],
    
    // 協議處理
    protocol_handlers: [
      {
        protocol: 'mailto',
        url: '/contact?action=email&email=%s'
      },
      {
        protocol: 'tel',
        url: '/contact?action=call&phone=%s'
      }
    ],
    
    // 檔案處理 (用於分享功能)
    file_handlers: [
      {
        action: '/contact',
        accept: {
          'text/plain': ['.txt'],
          'application/pdf': ['.pdf'],
          'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        }
      }
    ],
    
    // 分享目標
    share_target: {
      action: '/contact',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
        files: [
          {
            name: 'file',
            accept: ['image/*', 'application/pdf']
          }
        ]
      }
    }
  }
} 