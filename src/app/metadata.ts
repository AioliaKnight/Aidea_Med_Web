import type { Metadata } from 'next'

// 網站基本配置
const siteConfig = {
  name: 'Aidea:Med 醫療行銷顧問',
  description: '讓專業的醫師專注於醫療品質，行銷交給我們。Aidea:Med 運用創新科技與人性化服務，協助診所打造溫暖而專業的品牌形象，建立長期且穩固的病患信任。',
  url: 'https://www.aideamed.com',
  ogImage: 'https://www.aideamed.com/og-image.jpg',
  keywords: [
    // 診所類型相關
    '牙醫診所行銷',
    '植牙診所行銷',
    '牙醫品牌顧問',
    '醫療診所行銷',
    '泌尿科診所行銷',
    '眼科診所行銷',
    '皮膚科診所行銷',
    
    // 醫療服務相關
    '自費診療行銷',
    '醫療品質提升',
    '醫師品牌經營',
    '病患服務優化',
    '醫病關係經營',
    '醫療口碑行銷',
    '診所數位轉型',
    
    // 行銷服務相關
    '診所社群經營',
    '醫療品牌設計',
    '診所網站製作',
    '醫療 SEO 優化',
    '診所 Google 廣告',
    '醫療 Facebook 行銷',
    '診所進客策略',
    
    // 地區相關
    '台北診所行銷',
    '新北診所行銷',
    '桃園診所行銷',
    '台中診所行銷',
    '高雄診所行銷',
    
    // 其他相關
    'AI醫療行銷',
    '醫療行銷顧問',
    '診所營運規劃',
    '醫療品牌策略',
  ],
  authors: [
    {
      name: 'Aidea:Med 醫療行銷團隊',
      url: 'https://www.aideamed.com/team',
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

// 初始頁面的 Metadata 配置
export const homeMetadata: Metadata = {
  ...sharedMetadata,
  title: `${siteConfig.name} | ${siteConfig.description}`,
  openGraph: {
    ...sharedOgConfig,
    title: siteConfig.name,
    description: siteConfig.description,
    url: '/',
  },
  twitter: {
    ...sharedTwitterConfig,
    title: siteConfig.name,
    description: siteConfig.description,
  },
}

// 團隊頁面 Metadata
export const teamMetadata: Metadata = {
  ...sharedMetadata,
  title: '用心的夥伴 | 醫療行銷專家與創新人才',
  description: '我們不只是顧問，更是您診所成長的夥伴。結合醫療顧問、數位行銷專家與創新技術團隊，以同理心理解您的需求，用專業協助您實現理想。',
  openGraph: {
    ...sharedOgConfig,
    title: '用心的夥伴 | 醫療行銷專家與創新人才',
    description: '我們不只是顧問，更是您診所成長的夥伴。結合醫療顧問、數位行銷專家與創新技術團隊，以同理心理解您的需求，用專業協助您實現理想。',
  }
}

// 案例頁面的 Metadata 配置
export const caseMetadata: Metadata = {
  ...sharedMetadata,
  title: '醫療診所行銷案例集 | 實際成功案例與成果展示',
  description: '精選醫療與牙醫診所的成功行銷案例，展示我們如何幫助客戶提升品牌形象、增加患者數量與自費項目轉換率。',
  openGraph: {
    ...sharedOgConfig,
    title: '醫療診所行銷案例集',
    description: '精選醫療與牙醫診所的成功行銷案例，展示我們如何幫助客戶提升品牌形象、增加患者數量與自費項目轉換率。',
    url: '/case',
  },
}

// 服務頁面的 Metadata 配置
export const serviceMetadata: Metadata = {
  ...sharedMetadata,
  title: '醫療行銷與牙醫診所行銷顧問服務 | 完整解決方案',
  description: '為醫療機構與牙醫診所提供專業的整合行銷顧問服務，品牌建立、數位優化與轉型，提升自費項目轉換率。',
  openGraph: {
    ...sharedOgConfig,
    title: '醫療行銷與牙醫診所行銷顧問服務',
    description: '為醫療機構與牙醫診所提供專業的整合行銷顧問服務，品牌建立、數位優化與轉型，提升自費項目轉換率。',
    url: '/service',
  },
}

// 聯絡頁面 Metadata
export const contactMetadata: Metadata = {
  ...sharedMetadata,
  title: '與我們對話 | 預約免費諮詢',
  description: '讓我們傾聽您的故事，了解您的願景與困境。我們將為您量身打造最適合的品牌策略與行銷方案，一起為台灣的醫療環境創造更多溫暖與專業。',
  openGraph: {
    ...sharedOgConfig,
    title: '與我們對話 | 預約免費諮詢',
    description: '讓我們傾聽您的故事，了解您的願景與困境。我們將為您量身打造最適合的品牌策略與行銷方案，一起為台灣的醫療環境創造更多溫暖與專業。',
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
    telephone: '+886-2-27488919',
    contactType: 'customer service',
    areaServed: ['TW']
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '敦化南路二段99號13樓',
    addressLocality: '台北市',
    addressRegion: '大安區',
    postalCode: '106',
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
    name: '醫療診所行銷服務',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '品牌形象建立',
          description: '打造溫暖而專業的診所品牌形象，傳達醫療價值與理念'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '數位轉型優化',
          description: '協助診所數位化轉型，提升營運效率與病患體驗'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '行銷策略執行',
          description: '為診所量身打造全方位行銷策略，提升進客量與自費項目轉換率'
        }
      }
    ]
  }
}

// 本地商家結構化資料
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.aideamed.com',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  image: [siteConfig.ogImage],
  telephone: '+886-2-27488919',
  email: 'contact@aidea-med.com',
  priceRange: '$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '敦化南路二段99號13樓',
    addressLocality: '台北市',
    addressRegion: '大安區',
    postalCode: '106',
    addressCountry: 'TW'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '25.0338',
    longitude: '121.5466'
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    }
  ],
  sameAs: [
    'https://www.facebook.com/aideamed',
    'https://www.instagram.com/aideamed',
    'https://www.linkedin.com/company/aideamed',
  ]
} 