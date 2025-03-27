import type { Metadata } from 'next'

// 網站基本配置
const siteConfig = {
  name: 'Aidea:Med 醫療行銷與牙醫診所行銷顧問服務',
  description: 'Aidea:Med是專業的牙醫診所與醫療診所行銷顧問公司，我們提供全方位的數位行銷解決方案，幫助醫療機構提升品牌形象與增加病患數量。',
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
    // 主要關鍵字（優先顯示）
    '牙醫診所行銷',
    '醫療行銷顧問',
    'AI醫療行銷',
    '醫師品牌顧問',
    '診所數位行銷',
    '醫療品牌策略',
    
    // 診所與專業類型相關
    '植牙診所行銷',
    '矯正牙科行銷',
    '牙醫品牌顧問',
    '醫療診所行銷',
    '醫師行銷',
    '醫生行銷',
    '家醫科診所行銷',
    '小兒科診所行銷',
    '泌尿科診所行銷',
    '眼科診所行銷',
    '皮膚科診所行銷',
    '皮膚醫美診所行銷',
    '婦產科診所行銷',
    '耳鼻喉科診所行銷',
    '骨科診所行銷',
    '復健科診所行銷',
    '整形外科診所行銷',
    '中醫診所行銷',
    '神經內科診所行銷',
    '心臟內科診所行銷',
    '腸胃科診所行銷',
    '減重診所行銷',
    '醫學美容診所行銷',
    '雷射醫美診所行銷',

    // 顧問服務相關
    '醫療行銷顧問',
    '醫療品牌顧問',
    '診所行銷顧問',
    '醫療數位顧問',
    '醫療創業顧問',
    '診所創業顧問',
    '醫療經營顧問',
    '牙醫開業顧問',
    '診所轉型顧問',
    '醫療內容顧問',
    '診所空間設計顧問',
    '醫療公關顧問',
    
    // 醫療服務與品牌相關
    '自費診療行銷',
    '健檢中心行銷',
    '醫療品質提升',
    '醫師品牌經營',
    '醫師個人品牌',
    '醫生形象塑造',
    '診所升級轉型',
    '診所品牌重塑',
    '醫療服務設計',
    '病患服務優化',
    '病患體驗設計',
    '醫病關係經營',
    '醫療口碑行銷',
    '診所數位轉型',
    '醫療專業形象塑造',
    '醫師個人品牌建立',
    '患者忠誠度提升',
    '診所差異化策略',
    '醫療服務體驗設計',
    '醫療環境設計',
    '診所品牌識別',
    '醫療品牌策略',
    
    // 數位行銷策略相關
    '診所社群經營',
    '醫療品牌設計',
    '診所網站製作',
    '醫療網站開發',
    '診所網頁設計',
    '醫療APP開發',
    '診所SEO優化',
    '醫療 SEO 優化',
    '醫療內容行銷',
    '診所 Google 廣告',
    '醫療 Google 關鍵字',
    '醫療 SEM 行銷',
    '醫療 Facebook 行銷',
    '診所 Instagram 行銷',
    '醫療社群媒體經營',
    '診所 LINE 行銷',
    '診所進客策略',
    '醫療導入客戶',
    '診所病患轉介紹計畫',
    '醫療影片行銷',
    '診所 YouTube 頻道經營',
    '診所電子郵件行銷',
    '醫療搜尋引擎最佳化',
    '診所線上預約系統',
    '醫療用戶體驗設計',
    '醫療廣告投放',
    '診所廣告文案',
    '醫療內容創作',
    '診所故事行銷',
    '醫療直播行銷',
    '診所網紅合作',
    '醫療部落客行銷',
    
    // 地區相關
    '台北醫療行銷',
    '台北診所行銷',
    '台北牙醫行銷',
    '新北診所行銷',
    '桃園診所行銷',
    '新竹診所行銷',
    '台中醫療行銷',
    '台中診所行銷',
    '彰化診所行銷',
    '嘉義診所行銷',
    '台南診所行銷',
    '高雄醫療行銷',
    '高雄診所行銷',
    '宜蘭診所行銷',
    '花蓮診所行銷',
    '台東診所行銷',
    '南部醫療行銷',
    '北部診所行銷',
    '中部醫療行銷',
    '東部診所行銷',
    
    // 效果與成果相關
    '診所客戶增長',
    '醫療品牌提升',
    '診所業績成長',
    '醫療患者增加',
    '診所轉換率提升',
    '醫療回診率優化',
    '診所自費項目推廣',
    '醫療專科定位',
    '診所知名度提升',
    '醫療競爭力強化',
    '診所市場擴張',
    
    // 新興技術與趨勢相關
    'AI醫療行銷',
    '智能醫療行銷',
    '數位醫療轉型',
    '醫療元宇宙',
    '虛擬診所體驗',
    '遠距醫療行銷',
    '數據驅動醫療行銷',
    '醫療大數據分析',
    '醫療區塊鏈應用',
    
    // 商業與策略相關
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
    '診所危機公關',
    '醫療品牌監測',
    '診所經營管理',
    '醫療商業模式創新',
    '診所投資報酬率優化',
    '醫療定價策略',
    '診所客戶關係管理',
    '醫療忠誠度計畫',
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
    url: `${siteConfig.url}/`,
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
    url: `${siteConfig.url}/team`,
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
    url: `${siteConfig.url}/case`,
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
    url: `${siteConfig.url}/service`,
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
    url: `${siteConfig.url}/contact`,
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
          name: '醫療品牌策略',
          description: '打造溫暖而專業的診所品牌形象，分析市場定位、傳達醫療價值與理念'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '醫師個人品牌塑造',
          description: '建立醫師個人品牌與專業形象，提升專業公信力與知名度'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '數位轉型優化',
          description: '協助診所數位化轉型，提升營運效率與病患體驗，導入智能預約與管理系統'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '診所行銷策略執行',
          description: '為診所量身打造全方位行銷策略，提升進客量與自費項目轉換率'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '醫療數位廣告投放',
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
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '醫療社群媒體經營',
          description: '專業醫療社群經營與內容創作，提高診所曝光度，培養忠實追蹤者'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '醫療網站SEO優化',
          description: '醫療專業網站搜尋引擎優化，提升關鍵字排名與自然流量'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI醫療行銷解決方案',
          description: '運用人工智能技術優化醫療行銷流程，提供數據驅動的精準行銷建議'
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
    '新竹縣',
    '苗栗縣',
    '台中市',
    '彰化縣',
    '南投縣',
    '雲林縣',
    '嘉義市',
    '嘉義縣',
    '台南市',
    '高雄市',
    '屏東縣',
    '宜蘭縣',
    '花蓮縣',
    '台東縣',
    '金門縣',
    '澎湖縣'
  ],
  // 服務專業領域
  serviceOutput: {
    '@type': 'Service',
    serviceType: [
      '牙醫診所行銷',
      '整形外科診所行銷',
      '皮膚科診所行銷',
      '眼科診所行銷',
      '中醫診所行銷',
      '婦產科診所行銷',
      '小兒科診所行銷',
      '骨科診所行銷',
      '復健科診所行銷',
      '耳鼻喉科診所行銷',
      '醫學美容診所行銷',
      '家醫科診所行銷'
    ],
    provider: {
      '@type': 'Organization',
      name: siteConfig.name
    }
  },
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
    answer: '是的，現代醫療環境競爭激烈，專業的行銷策略能協助診所更有效地傳達專業價值，吸引適合的患者，並建立良好的醫療品牌形象與差異化定位。'
  },
  {
    question: 'Aidea:Med 提供哪些醫療行銷服務？',
    answer: '我們提供全方位的醫療診所行銷服務，包括品牌形象建立、診所定位規劃、數位策略執行、社群媒體管理、網站優化與設計、搜尋引擎行銷(SEM)、內容行銷、病患關係管理等專業服務，為各類型診所量身打造行銷方案。'
  },
  {
    question: '醫師個人品牌與診所品牌有何差別？如何協同發展？',
    answer: '醫師個人品牌聚焦在醫師的專業、經歷與特質，而診所品牌則著重於整體服務體驗與醫療理念。Aidea:Med協助建立互補的雙品牌策略，讓醫師個人專業強化診所品牌信任度，同時診所品牌也能提升醫師的專業形象與曝光度，創造最大綜效。'
  },
  {
    question: '人工智能如何幫助醫師建立個人品牌？',
    answer: '人工智能正在革新醫師個人品牌的建立方式，為專業醫師提供前所未有的優勢。我們融合AI與醫療行銷專業，協助醫師：1) 透過AI輔助內容創作，將專業知識轉化為優質文章和影片；2) 運用智能數據分析，找出最能突顯醫師獨特專業的差異化定位；3) 建立AI驅動的患者互動系統，即使在繁忙診療中也能維持線上社群活躍度；4) 進行自動化聲譽監測與分析，及時了解並改善患者觀感。AI不只提高建立個人品牌的效率，更提供戰略指引，讓醫師的專業價值獲得最大程度的認可。'
  },
  {
    question: '如何評估醫療行銷的成效？',
    answer: '我們使用多項指標評估行銷成效，包括網站流量與轉換率、預約量增長、自費診療轉換率、社群參與度、患者回訪率與口碑評價等，並提供透明的數據報告，協助診所掌握投資報酬率。'
  },
  {
    question: '行銷活動是否符合醫療廣告法規？',
    answer: '是的，我們的團隊熟悉台灣醫療廣告相關法規，所有行銷方案都嚴格遵守衛福部規範，確保合法合規，同時維護醫療專業形象，避免誇大不實的宣傳。'
  },
  {
    question: '多久能看到行銷成效？',
    answer: '行銷成效視策略而定，通常SEO優化需3-6個月見效，而廣告投放與社群經營可較快看到流量提升。我們會設定明確的時程與階段性目標，定期評估與調整策略，確保資源有效運用。'
  },
  {
    question: '牙醫診所的行銷有什麼特殊考量？',
    answer: '牙醫診所行銷需特別注重視覺呈現、案例展示與自費項目價值溝通。我們會強調診所環境舒適度、醫師專業技術、先進設備與治療成果，同時透過專業內容教育潛在患者，提升高價值自費項目的認知與接受度。'
  },
  {
    question: '如何透過數位行銷增加診所的新患數量？',
    answer: '增加新患數量的策略包括：優化診所Google商家檔案、提升搜尋引擎排名、精準的關鍵字廣告投放、建立吸引人的社群內容、設計高轉換率的官網、運用病患見證與案例分享、發展線上預約系統，並透過數據分析持續優化轉換漏斗。'
  },
  {
    question: '診所如何運用社群媒體提升品牌形象？',
    answer: '診所可透過規劃專業醫療知識分享、展示治療前後對比、分享患者見證、介紹醫療團隊與設備、提供健康生活建議等內容策略，建立權威形象。我們協助診所選擇適合的平台(如Instagram、Facebook、LINE、YouTube)，制定內容行事曆，並進行社群互動管理，提升品牌親近感與專業度。'
  },
  {
    question: '小型診所的行銷預算應如何有效分配？',
    answer: '小型診所應優先建立完善的基礎數位資產(如官網、Google商家檔案)，接著根據目標患者族群特性選擇1-2個主要社群平台深耕，再搭配精準的關鍵字廣告。我們會根據診所特色制定最具成本效益的預算分配方案，確保每分錢都能產生最大效益。'
  },
  {
    question: '如何讓診所在眾多競爭者中脫穎而出？',
    answer: '關鍵在於找出診所的獨特價值主張(UVP)與差異化定位。我們會協助診所進行市場分析與競爭者評估，找出診所獨特優勢(如醫師專長、獨特服務、先進設備或服務體驗)，再透過品牌故事與視覺識別系統強化這些特色，在營銷內容中一致性地傳達這些價值。'
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
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5'
      },
      author: {
        '@type': 'Person',
        name: '林醫師'
      },
      reviewBody: '醫師品牌規劃非常到位，協助我建立個人專業形象，讓診所自費療程轉換率提高了25%。'
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4.8',
        bestRating: '5'
      },
      author: {
        '@type': 'Person',
        name: '陳醫師'
      },
      reviewBody: '社群經營策略有效提升了診所知名度，新病患透過Instagram認識我們的比例大幅增加。'
    }
  ],
  // 醫療服務特點
  hasFeature: [
    {
      '@type': 'PropertyValue',
      name: '醫療法規合規',
      value: '所有行銷內容嚴格遵守衛福部醫療廣告規範'
    },
    {
      '@type': 'PropertyValue',
      name: '專業醫療行銷團隊',
      value: '結合醫療背景與行銷專業人員組成的專業團隊'
    },
    {
      '@type': 'PropertyValue',
      name: '客製化診所定位',
      value: '根據診所特色與市場分析制定差異化定位策略'
    },
    {
      '@type': 'PropertyValue',
      name: '數據驅動行銷',
      value: '透過數據分析不斷優化行銷策略與投資報酬率'
    },
    {
      '@type': 'PropertyValue',
      name: 'AI行銷技術',
      value: '運用最新AI技術提升行銷效率與精準度'
    }
  ]
} 