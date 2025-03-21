import type { Metadata } from 'next'

// 網站基本配置
const siteConfig = {
  name: 'Aidea:Med 醫療行銷顧問',
  description: '讓專業的醫師專注於醫療品質，行銷交給我們。Aidea:Med 運用創新科技與人性化服務，協助診所打造溫暖而專業的品牌形象，建立長期且穩固的病患信任。',
  slogan: '為醫療診所注入數位活力，專業行銷解決方案',
  url: 'https://www.aideamed.com',
  ogImage: 'https://www.aideamed.com/og-image.jpg',
  alternateImage: 'https://www.aideamed.com/og-image-alt.jpg',
  contact: {
    email: 'contact@aideamed.com',
    phone: '+886-2-27488919',
    address: '台北市大安區敦化南路二段99號13樓',
    googleMap: 'https://maps.app.goo.gl/MvLCyJKu2eZ9XLFB6'
  },
  social: {
    facebook: 'https://www.facebook.com/www.aideamed',
    instagram: 'https://www.instagram.com/aidea_med',
    linkedin: 'https://www.linkedin.com/company/aideamed',
    line: 'https://line.me/ti/p/@aideamed'
  },
  keywords: [
    // 診所類型相關
    '牙醫診所行銷',
    '植牙診所行銷',
    '牙醫品牌顧問',
    '醫療診所行銷',
    '泌尿科診所行銷',
    '眼科診所行銷',
    '皮膚科診所行銷',
    '婦產科診所行銷',
    '耳鼻喉科診所行銷',
    '骨科診所行銷',
    '復健科診所行銷',
    '整形外科診所行銷',
    '中醫診所行銷',
    
    // 醫療服務相關
    '自費診療行銷',
    '醫療品質提升',
    '醫師品牌經營',
    '病患服務優化',
    '醫病關係經營',
    '醫療口碑行銷',
    '診所數位轉型',
    '醫療專業形象塑造',
    '醫師個人品牌建立',
    '患者忠誠度提升',
    '診所差異化策略',
    '醫療服務體驗設計',
    
    // 行銷服務相關
    '診所社群經營',
    '醫療品牌設計',
    '診所網站製作',
    '醫療 SEO 優化',
    '診所 Google 廣告',
    '醫療 Facebook 行銷',
    '診所進客策略',
    '醫療內容行銷',
    '診所病患轉介紹計畫',
    '醫療影片行銷',
    '診所電子郵件行銷',
    '醫療搜尋引擎最佳化',
    '診所線上預約系統',
    '醫療用戶體驗設計',
    
    // 地區相關
    '台北診所行銷',
    '新北診所行銷',
    '桃園診所行銷',
    '台中診所行銷',
    '高雄診所行銷',
    '台南診所行銷',
    '新竹診所行銷',
    '彰化診所行銷',
    '嘉義診所行銷',
    '宜蘭診所行銷',
    
    // 其他相關
    'AI醫療行銷',
    '醫療行銷顧問',
    '診所營運規劃',
    '醫療品牌策略',
    '診所成長策略',
    '醫療顧客體驗',
    '醫療競爭分析',
    '診所市場調研',
    '醫療創新行銷',
    '診所數據分析',
    '醫療轉介紹系統',
    '診所聲譽管理',
    '醫療趨勢分析',
  ],
  authors: [
    {
      name: 'Aidea:Med 醫療行銷團隊',
      url: 'https://www.aideamed.com/team',
    }
  ],
  availableLangs: ['zh-TW'],
  locale: 'zh-TW',
  language: 'zh-Hant-TW'
}

// 共用的 Open Graph 配置
const sharedOgConfig = {
  siteName: siteConfig.name,
  locale: siteConfig.locale,
  type: 'website',
  images: [
    {
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: '牙醫診所行銷專家 - Aidea:Med',
    },
    {
      url: siteConfig.alternateImage,
      width: 1200,
      height: 630,
      alt: '醫療診所行銷解決方案 - Aidea:Med',
    }
  ],
}

// 共用的 Twitter 配置
const sharedTwitterConfig = {
  card: 'summary_large_image',
  images: [siteConfig.ogImage],
  site: '@aideamed',
  creator: '@aideamed',
  title: siteConfig.name,
  description: siteConfig.description
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
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon-16x16.png',
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    ...sharedOgConfig,
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: sharedTwitterConfig,
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'zh-TW': `${siteConfig.url}/zh-TW`,
    },
  },
  appLinks: {
    web: {
      url: siteConfig.url,
      should_fallback: true
    }
  },
  category: '醫療行銷',
  other: {
    'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE',
    'baidu-site-verification': 'YOUR_BAIDU_VERIFICATION_CODE'
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
    yahoo: 'YOUR_YAHOO_VERIFICATION_CODE',
  },
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
    url: '/team',
  },
  twitter: {
    ...sharedTwitterConfig,
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
    title: '醫療診所行銷案例集 | 實際成功案例與成果展示',
    description: '精選醫療與牙醫診所的成功行銷案例，展示我們如何幫助客戶提升品牌形象、增加患者數量與自費項目轉換率。',
    url: '/case',
  },
  twitter: {
    ...sharedTwitterConfig,
    title: '醫療診所行銷案例集',
    description: '精選醫療與牙醫診所的成功行銷案例，展示我們如何幫助客戶提升品牌形象、增加患者數量與自費項目轉換率。',
  }
}

// 服務頁面的 Metadata 配置
export const serviceMetadata: Metadata = {
  ...sharedMetadata,
  title: '醫療行銷與牙醫診所行銷顧問服務 | 完整解決方案',
  description: '為醫療機構與牙醫診所提供專業的整合行銷顧問服務，品牌建立、數位優化與轉型，提升自費項目轉換率。',
  openGraph: {
    ...sharedOgConfig,
    title: '醫療行銷與牙醫診所行銷顧問服務 | 完整解決方案',
    description: '為醫療機構與牙醫診所提供專業的整合行銷顧問服務，品牌建立、數位優化與轉型，提升自費項目轉換率。',
    url: '/service',
  },
  twitter: {
    ...sharedTwitterConfig,
    title: '醫療行銷與牙醫診所行銷顧問服務',
    description: '為醫療機構與牙醫診所提供專業的整合行銷顧問服務，品牌建立、數位優化與轉型，提升自費項目轉換率。',
  }
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
    url: '/contact',
  },
  twitter: {
    ...sharedTwitterConfig,
    title: '與我們對話 | 預約免費諮詢',
    description: '讓我們傾聽您的故事，了解您的願景與困境。我們將為您量身打造最適合的品牌策略與行銷方案，一起為台灣的醫療環境創造更多溫暖與專業。',
  }
}

// 結構化資料 - 組織
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteConfig.url}#organization`,
  name: siteConfig.name,
  description: siteConfig.description,
  slogan: siteConfig.slogan,
  url: siteConfig.url,
  logo: {
    '@type': 'ImageObject',
    url: `${siteConfig.url}/logo.png`,
    width: 512,
    height: 512
  },
  image: [siteConfig.ogImage],
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phone,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'customer service',
      areaServed: ['TW'],
      availableLanguage: ['Chinese', 'English']
    },
    {
      '@type': 'ContactPoint',
      email: siteConfig.contact.email,
      contactType: 'sales',
      areaServed: ['TW']
    }
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '敦化南路二段99號13樓',
    addressLocality: '台北市',
    addressRegion: '大安區',
    postalCode: '106',
    addressCountry: 'TW'
  },
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.instagram,
    siteConfig.social.linkedin,
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
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '數位醫療廣告',
          description: '專業醫療廣告投放，精準觸及潛在患者，最大化行銷預算效益'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '診所口碑管理',
          description: '建立優質的診所線上評價與口碑，處理危機公關，提升病患信任'
        }
      }
    ]
  },
  // 附加結構化資料
  potentialAction: [
    {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${siteConfig.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    {
      '@type': 'CommunicateAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${siteConfig.url}/contact`
      },
      'actionStatus': 'PotentialActionStatus',
      'name': '聯絡我們'
    }
  ],
  areaServed: [
    {
      '@type': 'GeoCircle',
      'geoMidpoint': {
        '@type': 'GeoCoordinates',
        'latitude': 25.0338,
        'longitude': 121.5466
      },
      'geoRadius': 50000
    },
    {
      '@type': 'Country',
      'name': '台灣'
    }
  ],
  // 增加更多組織屬性
  foundingDate: '2020-01-01',
  foundingLocation: {
    '@type': 'Place',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': '台北市',
      'addressRegion': '大安區',
      'addressCountry': 'TW'
    }
  },
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    'value': '10-20',
    'unitText': '人'
  }
}

// 本地商家結構化資料
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.aideamed.com#localbusiness',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: {
    '@type': 'ImageObject',
    url: `${siteConfig.url}/logo.png`,
    width: 512,
    height: 512
  },
  image: [siteConfig.ogImage],
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
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
    siteConfig.social.facebook,
    siteConfig.social.instagram,
    siteConfig.social.linkedin,
    siteConfig.social.line
  ],
  hasMap: siteConfig.contact.googleMap,
  currenciesAccepted: 'TWD',
  paymentAccepted: '現金, 信用卡, 轉帳',
  // 增加更多服務提供區域
  areaServed: [
    '台北市',
    '新北市',
    '桃園市',
    '新竹市',
    '台中市',
    '高雄市',
    '台南市'
  ],
  // 服務與產品提供
  makesOffer: [
    {
      '@type': 'Offer',
      name: '醫療品牌咨詢服務',
      description: '為醫療診所打造專業品牌形象，提升市場競爭力',
      price: '依服務範圍而定',
      priceCurrency: 'TWD'
    },
    {
      '@type': 'Offer',
      name: '診所數位行銷服務',
      description: '透過數位行銷策略提升診所能見度，吸引更多潛在患者',
      price: '依服務範圍而定',
      priceCurrency: 'TWD'
    }
  ]
}

// 創建各頁面的FAQ結構化資料
export const createFaqSchema = (questions: {question: string, answer: string}[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  }
}

// 醫療服務FAQ示例
export const medicalServicesFaq = createFaqSchema([
  {
    question: '醫療診所需要行銷嗎？',
    answer: '是的，現代醫療環境競爭激烈，專業的行銷策略能協助診所更有效地傳達專業價值，吸引適合的患者，並建立良好的醫療品牌形象。'
  },
  {
    question: 'Aidea:Med 提供哪些醫療行銷服務？',
    answer: '我們提供全方位的醫療診所行銷服務，包括品牌形象建立、數位策略規劃、社群媒體管理、網站優化與設計、搜尋引擎行銷(SEM)、內容行銷、病患關係管理等。'
  },
  {
    question: '如何評估醫療行銷的成效？',
    answer: '我們使用多項指標評估行銷成效，包括網站流量與轉換率、預約量增長、自費診療轉換率、社群參與度、患者回訪率與口碑評價等，並提供透明的數據報告。'
  },
  {
    question: '行銷活動是否符合醫療廣告法規？',
    answer: '是的，我們的團隊熟悉台灣醫療廣告相關法規，所有行銷方案都嚴格遵守衛福部規範，確保合法合規，同時維護醫療專業形象。'
  },
  {
    question: '多久能看到行銷成效？',
    answer: '行銷成效視策略而定，通常SEO優化需3-6個月見效，而廣告投放與社群經營可較快看到流量提升。我們會設定明確的時程與階段性目標，定期評估與調整策略。'
  }
])

// 品牌建立與網站建置結構化資料
export const brandingWebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: '醫療診所品牌與網站建置服務',
  description: '為醫療診所打造專業品牌形象與高轉換率網站，提升患者信任與自費項目轉換',
  category: '醫療行銷服務',
  offers: {
    '@type': 'Offer',
    price: '依需求客製',
    priceCurrency: 'TWD',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: siteConfig.name
    }
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '87',
    bestRating: '5',
    worstRating: '1'
  },
  review: [
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5'
      },
      author: {
        '@type': 'Person',
        name: '王醫師'
      },
      reviewBody: '網站改版後預約量增加30%，非常專業的服務團隊！'
    }
  ]
} 