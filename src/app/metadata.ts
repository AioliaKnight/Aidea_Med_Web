import type { Metadata } from 'next'

// 網站基本配置
const siteConfig = {
  name: 'Aidea:Med 牙醫診所行銷專家',
  description: '專注於牙醫診所的數位行銷與品牌顧問，提供植牙、隱形矯正、美白等專業牙醫療程的整合行銷方案。運用 AI 技術，為您的診所打造量身訂製的行銷策略，提升品牌知名度與病患信任。',
  url: 'https://www.aidea-med.com',
  ogImage: 'https://www.aidea-med.com/og-image.jpg',
  keywords: [
    // 診所類型相關
    '牙醫診所行銷',
    '植牙診所行銷',
    '牙醫品牌顧問',
    '牙醫數位行銷',
    '牙醫診所品牌',
    '連鎖牙醫診所',
    '家庭牙醫診所',
    
    // 牙醫服務相關
    '植牙行銷',
    '隱形矯正行銷',
    '牙齒美白行銷',
    '牙周治療行銷',
    '兒童牙科行銷',
    '人工植牙推廣',
    '全瓷冠行銷',
    
    // 行銷服務相關
    '牙醫社群經營',
    '診所品牌設計',
    '牙醫網站製作',
    '牙醫 SEO 優化',
    '診所 Google 廣告',
    '牙醫 Facebook 行銷',
    '診所 Instagram 行銷',
    
    // 地區相關
    '台北牙醫行銷',
    '新北牙醫行銷',
    '桃園牙醫行銷',
    '台中牙醫行銷',
    '高雄牙醫行銷',
    
    // 其他相關
    'AI行銷',
    '醫療行銷',
    '數位行銷',
    '品牌策略',
  ],
  authors: [
    {
      name: 'Aidea:Med 牙醫行銷團隊',
      url: 'https://www.aidea-med.com/team',
    }
  ]
}

// 共用的 Open Graph 配置
const sharedOgConfig = {
  siteName: siteConfig.name,
  images: [
    {
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: '牙醫診所行銷專家 - Aidea:Med',
    }
  ],
}

// 共用的 Twitter 配置
const sharedTwitterConfig = {
  card: 'summary_large_image',
  images: [siteConfig.ogImage],
  site: '@aideamed',
  creator: '@aideamed',
}

// 共用的 Metadata 配置
export const sharedMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    ...sharedOgConfig,
    type: 'website',
    locale: 'zh_TW',
  },
  twitter: sharedTwitterConfig,
  alternates: {
    canonical: siteConfig.url,
  },
  category: '醫療行銷',
}

// 首頁 Metadata
export const homeMetadata: Metadata = {
  ...sharedMetadata,
  title: '牙醫診所行銷專家 | AI驅動的植牙與隱形矯正行銷方案',
  description: '專業的牙醫診所行銷團隊，協助您打造診所品牌，提供植牙、隱形矯正、美白等牙科服務的整合行銷方案。運用 AI 技術，為診所制定精準的數位行銷策略，提升知名度與病患信任。',
  openGraph: {
    ...sharedOgConfig,
    title: '牙醫診所行銷專家 | AI驅動的植牙與隱形矯正行銷方案',
    description: '專業的牙醫診所行銷團隊，協助您打造診所品牌，提供植牙、隱形矯正、美白等牙科服務的整合行銷方案。運用 AI 技術，為診所制定精準的數位行銷策略，提升知名度與病患信任。',
  }
}

// 團隊頁面 Metadata
export const teamMetadata: Metadata = {
  ...sharedMetadata,
  title: '專業團隊 | 牙醫行銷專家與數位人才',
  description: '由資深牙醫顧問、數位行銷專家與技術團隊組成，擁有豐富的植牙推廣、隱形矯正行銷經驗，為診所打造最專業的行銷服務。',
  openGraph: {
    ...sharedOgConfig,
    title: '專業團隊 | 牙醫行銷專家與數位人才',
    description: '由資深牙醫顧問、數位行銷專家與技術團隊組成，擁有豐富的植牙推廣、隱形矯正行銷經驗，為診所打造最專業的行銷服務。',
  }
}

// 案例頁面 Metadata
export const caseMetadata: Metadata = {
  ...sharedMetadata,
  title: '成功案例 | 牙醫診所品牌與行銷案例分享',
  description: '探索我們如何協助牙醫診所提升品牌形象、增加植牙諮詢量、提高隱形矯正預約數，並建立長期的病患信任關係。包含品牌策略、社群經營、廣告投放等實際成功案例。',
  openGraph: {
    ...sharedOgConfig,
    title: '成功案例 | 牙醫診所品牌與行銷案例分享',
    description: '探索我們如何協助牙醫診所提升品牌形象、增加植牙諮詢量、提高隱形矯正預約數，並建立長期的病患信任關係。包含品牌策略、社群經營、廣告投放等實際成功案例。',
  }
}

// 服務頁面 Metadata
export const serviceMetadata: Metadata = {
  ...sharedMetadata,
  title: '服務項目 | 牙醫診所整合行銷方案',
  description: '提供牙醫診所完整的行銷服務，包含：品牌定位、社群經營、網站建置、SEO優化、廣告投放等。專注於植牙、隱形矯正、美白等牙科服務的推廣，協助診所在數位時代脫穎而出。',
  openGraph: {
    ...sharedOgConfig,
    title: '服務項目 | 牙醫診所整合行銷方案',
    description: '提供牙醫診所完整的行銷服務，包含：品牌定位、社群經營、網站建置、SEO優化、廣告投放等。專注於植牙、隱形矯正、美白等牙科服務的推廣，協助診所在數位時代脫穎而出。',
  }
}

// 部落格頁面 Metadata
export const blogMetadata: Metadata = {
  ...sharedMetadata,
  title: '專業知識庫 | 牙醫診所經營與行銷趨勢',
  description: '分享牙醫診所數位行銷、品牌經營、病患服務等專業知識。包含植牙推廣、隱形矯正行銷、診所經營管理、社群媒體經營等實用資訊，協助診所掌握產業趨勢。',
  openGraph: {
    ...sharedOgConfig,
    title: '專業知識庫 | 牙醫診所經營與行銷趨勢',
    description: '分享牙醫診所數位行銷、品牌經營、病患服務等專業知識。包含植牙推廣、隱形矯正行銷、診所經營管理、社群媒體經營等實用資訊，協助診所掌握產業趨勢。',
  }
}

// 聯絡頁面 Metadata
export const contactMetadata: Metadata = {
  ...sharedMetadata,
  title: '聯絡我們 | 預約免費行銷諮詢',
  description: '立即與我們聯繫，了解如何為您的牙醫診所打造最適合的數位行銷策略。提供植牙、隱形矯正、美白等牙科服務的推廣建議，協助您提升診所競爭力。',
  openGraph: {
    ...sharedOgConfig,
    title: '聯絡我們 | 預約免費行銷諮詢',
    description: '立即與我們聯繫，了解如何為您的牙醫診所打造最適合的數位行銷策略。提供植牙、隱形矯正、美白等牙科服務的推廣建議，協助您提升診所競爭力。',
  }
}

// 結構化資料
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  image: [siteConfig.ogImage],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+886-2-2345-6789',
    contactType: 'customer service',
    areaServed: ['TW'],
    availableLanguage: ['zh-TW', 'en'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '信義路五段7號',
    addressLocality: '台北市',
    addressRegion: '信義區',
    postalCode: '110',
    addressCountry: 'TW'
  },
  sameAs: [
    'https://www.facebook.com/aideamed',
    'https://www.instagram.com/aideamed',
    'https://www.linkedin.com/company/aideamed',
  ],
  // 服務項目
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: '牙醫診所行銷服務',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '品牌策略服務',
          description: '牙醫診所品牌定位與視覺設計'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '數位行銷服務',
          description: '植牙、隱形矯正等牙科服務推廣'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '社群媒體經營',
          description: '診所 Facebook、Instagram 內容經營'
        }
      }
    ]
  }
} 