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
    line: 'https://lin.ee/ZPdkmHh'
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
    '牙醫行銷團隊', 
    '口腔診所品牌顧問', 
    '牙科診所數位行銷', 
    '植牙診所行銷策略',
    '牙醫SEO優化專家',
    '牙醫社群媒體經營',
    '牙醫網站設計團隊',
    '牙醫Google廣告投放',
    '牙科診所病患轉介系統',
    '牙醫美容行銷',
    '隱形矯正行銷方案',
    '牙醫診所品牌塑造',
    '牙科診所口碑管理',
    '醫療數位轉型顧問',
    '牙醫診所競爭分析',
    '雅德思牙醫診所',
    '雅德思行銷顧問',
    '雲天牙醫診所',
    '中華牙醫診所',
    '品誠牙醫診所',
    '春生牙醫診所',
    '家源牙醫診所',
    '海蒂牙醫診所',
    '皓皓牙醫診所',
    '勤美民生牙醫診所',
    '經典聯合牙醫診所',

    // 數位行銷相關
    '診所網站設計',
    '診所形象網站',
    '醫療網站優化',
    '醫療診所SEO',
    '牙醫診所網站建置',
    '診所關鍵字行銷',
    '醫療零點行銷',
    '診所搜尋引擎行銷',
    '牙醫網路行銷',
    '醫療內容策略',
    '診所品牌內容',
    '醫療社群行銷',
    '醫師KOL行銷',
    '牙醫數位廣告',
    '醫療Facebook廣告',
    '診所Google Ads',
    '醫療影音行銷',
    '診所YouTube頻道',
    '醫美TikTok行銷',
    '診所Instagram貼文',
    '醫療電子報行銷',
    '醫師部落格經營',
    '療程轉換率優化',
    '醫療行動網頁優化',
    '診所用戶體驗設計',
    '醫療網站流量分析',
    '診所數位品牌監測',
    '牙醫本地搜尋優化',
    '醫療再行銷策略',
    '診所CRM系統',
    '醫療顧客旅程優化',
    '醫美數位媒體投放',
    '診所口碑營銷',
    '牙醫Google我的商家',
    '醫療精準投放',
    '診所數位轉型策略',
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
  title: '牙醫診所行銷顧問團隊 | 專精醫療行銷策略與數位轉型的專家',
  description: '我們團隊由專業牙醫行銷顧問、數位醫療行銷專家與診所品牌策略師組成，擁有豐富的牙醫診所網路行銷經驗。我們深入理解牙醫市場與患者需求，協助各類牙科診所如植牙、美白、矯正、一般牙科等提升品牌知名度、增加患者轉介率與提高自費診療項目轉換率。',
  keywords: [
    ...(Array.isArray(sharedMetadata.keywords) ? sharedMetadata.keywords : []),
    '牙醫行銷團隊', 
    '口腔診所品牌顧問', 
    '牙科診所數位行銷', 
    '植牙診所行銷策略',
    '牙醫SEO優化專家',
    '牙醫社群媒體經營',
    '牙醫網站設計團隊',
    '牙醫Google廣告投放',
    '牙科診所病患轉介系統',
    '牙醫美容行銷',
    '隱形矯正行銷方案',
    '牙醫診所品牌塑造',
    '牙科診所口碑管理',
    '醫療數位轉型顧問',
    '牙醫診所競爭分析',
    '雅德思牙醫診所',
    '雅德思行銷顧問',
    '雲天牙醫診所',
    '中華牙醫診所',
    '品誠牙醫診所',
    '春生牙醫診所',
    '家源牙醫診所',
    '海蒂牙醫診所',
    '皓皓牙醫診所',
    '勤美民生牙醫診所',
    '經典聯合牙醫診所',

    // 數位行銷相關
    '診所網站設計',
    '診所形象網站',
    '醫療網站優化',
    '醫療診所SEO',
    '牙醫診所網站建置',
    '診所關鍵字行銷',
    '醫療零點行銷',
    '診所搜尋引擎行銷',
    '牙醫網路行銷',
    '醫療內容策略',
    '診所品牌內容',
    '醫療社群行銷',
    '醫師KOL行銷',
    '牙醫數位廣告',
    '醫療Facebook廣告',
    '診所Google Ads',
    '醫療影音行銷',
    '診所YouTube頻道',
    '醫美TikTok行銷',
    '診所Instagram貼文',
    '醫療電子報行銷',
    '醫師部落格經營',
    '療程轉換率優化',
    '醫療行動網頁優化',
    '診所用戶體驗設計',
    '醫療網站流量分析',
    '診所數位品牌監測',
    '牙醫本地搜尋優化',
    '醫療再行銷策略',
    '診所CRM系統',
    '醫療顧客旅程優化',
    '醫美數位媒體投放',
    '診所口碑營銷',
    '牙醫Google我的商家',
    '醫療精準投放',
    '診所數位轉型策略',
  ],
  openGraph: {
    ...sharedOgConfig,
    title: '牙醫診所行銷顧問團隊 | 專精醫療行銷策略與數位轉型的專家',
    description: '我們團隊由專業牙醫行銷顧問、數位醫療行銷專家與診所品牌策略師組成，擁有豐富的牙醫診所網路行銷經驗。我們深入理解牙醫市場與患者需求，協助各類牙科診所提升品牌知名度、增加患者轉介率與提高自費診療項目轉換率。',
    url: `${siteConfig.url}/team`,
  },
  twitter: {
    ...sharedTwitterConfig,
    title: '牙醫診所行銷顧問團隊 | 專精醫療行銷策略與數位轉型的專家',
    description: '我們團隊由專業牙醫行銷顧問、數位醫療行銷專家與診所品牌策略師組成，擁有豐富的牙醫診所網路行銷經驗。我們深入理解牙醫市場與患者需求，協助各類牙科診所提升品牌知名度、增加患者轉介率與提高自費診療項目轉換率。',
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
  '@id': 'https://www.aideamed.com#organization',
  name: siteConfig.name,
  alternateName: 'Aidea Med 醫療行銷顧問',
  description: siteConfig.description,
  url: siteConfig.url,
  logo: {
    '@type': 'ImageObject',
    '@id': 'https://www.aideamed.com#logo',
    url: `${siteConfig.url}/logo.png`,
    contentUrl: `${siteConfig.url}/logo.png`,
    width: 600,
    height: 60
  },
  image: [
    {
      '@type': 'ImageObject',
      url: siteConfig.ogImage,
      width: 1200,
      height: 630
    }
  ],
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.instagram,
    siteConfig.social.linkedin,
    siteConfig.social.line
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'customer service',
      email: siteConfig.contact.email,
      availableLanguage: ['中文', '英文'],
      contactOption: 'TollFree',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    },
    {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'sales',
      email: siteConfig.contact.email,
      availableLanguage: ['中文', '英文']
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
  location: {
    '@type': 'Place',
    name: 'Aidea:Med 醫療行銷顧問辦公室',
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
    }
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: '醫療診所行銷服務目錄',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '醫療品牌策略規劃',
          description: '為診所建立專業形象與差異化品牌定位，樹立市場領導地位'
        },
        itemListElement: [
          {
            '@type': 'Offer',
            name: '診所品牌識別與定位',
            description: '診所專屬品牌與視覺識別系統設計'
          },
          {
            '@type': 'Offer',
            name: '醫師個人品牌建立',
            description: '專業醫師個人品牌塑造與市場定位'
          }
        ]
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
    },
    {
      '@type': 'ViewAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${siteConfig.url}/blog`
      },
      'name': '醫療行銷知識中心'
    },
    {
      '@type': 'ViewAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${siteConfig.url}/case`
      },
      'name': '醫療行銷成功案例'
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
  },
  award: [
    '2022年台灣醫療行銷創新獎',
    '2023年數位轉型優質顧問機構'
  ],
  slogan: siteConfig.slogan,
  knowsLanguage: ['zh-TW', 'zh-CN', 'en'],
  employee: [
    {
      '@type': 'Person',
      name: '林醫療總監',
      jobTitle: '資深醫療行銷總監',
      description: '擁有十年以上醫療行銷經驗，專精牙科與皮膚科診所行銷策略',
      sameAs: `${siteConfig.url}/team#director`
    },
    {
      '@type': 'Person',
      name: '王數據分析師',
      jobTitle: '醫療數據分析專家',
      description: '專精診所行銷數據分析與AI驅動的精準行銷策略',
      sameAs: `${siteConfig.url}/team#analyst`
    }
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Google認證數位行銷專家',
      educationalLevel: '專業級',
      validFor: 'P1Y'
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Meta認證社群媒體行銷專家',
      educationalLevel: '專業級',
      validFor: 'P1Y'
    }
  ],
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${siteConfig.url}/#organization`
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
  ],
  // 增加評價與排名資訊
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '156',
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

// 麵包屑結構化資料
export const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '首頁',
      item: siteConfig.url
    }
  ]
}

// 團隊頁面麵包屑
export const teamBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '首頁',
      item: siteConfig.url
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '團隊',
      item: `${siteConfig.url}/team`
    }
  ]
}

// 服務頁面麵包屑
export const serviceBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '首頁',
      item: siteConfig.url
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '服務',
      item: `${siteConfig.url}/service`
    }
  ]
}

// 案例頁面麵包屑
export const caseBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '首頁',
      item: siteConfig.url
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '案例',
      item: `${siteConfig.url}/case`
    }
  ]
}

// 聯絡頁面麵包屑
export const contactBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '首頁',
      item: siteConfig.url
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '聯絡我們',
      item: `${siteConfig.url}/contact`
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

// 醫療服務FAQ
export const medicalServicesFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '醫療行銷與一般行銷有何不同？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '醫療行銷需要兼顧專業性與法規遵循，同時考慮醫病關係的特殊性。與一般行銷不同，醫療行銷更強調建立信任、專業權威與長期關係，而非短期轉換。我們的策略著重在以教育為基礎的內容行銷、專業形象塑造與符合醫療法規的溝通方式，確保行銷內容既能吸引患者，又能維護醫療專業形象。'
      }
    },
    {
      '@type': 'Question',
      name: '如何衡量醫療行銷的投資報酬率？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '我們使用多維指標評估醫療行銷投資報酬率：首先是量化指標，包括網站流量成長、諮詢轉換率、新患者數量增加、預約數成長與自費項目銷售增長；其次是質化指標，包括品牌知名度提升、患者信任度增強、醫師專業形象改善與患者回饋評價。我們會根據您診所的具體目標，設定適合的KPI指標，並提供定期報告，讓您清楚掌握行銷活動的實際成效。'
      }
    },
    {
      '@type': 'Question',
      name: '小型診所的行銷預算應如何分配？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '小型診所的行銷預算應集中在最能觸及目標患者的渠道。我們建議：30-40%投入數位媒體廣告(Google、社群平台)；20-25%用於診所網站優化與SEO；15-20%發展有價值的醫療內容；10%投入電子郵件行銷系統建立患者關係；5-10%用於線下推廣活動。對於初創診所，建議先投入於品牌建立與本地SEO；成熟診所則可更多著重於患者關係管理與口碑行銷。我們會根據診所的發展階段與目標人群，調整最適合的預算分配比例。'
      }
    },
    {
      '@type': 'Question',
      name: '如何在遵守醫療法規的前提下做有效的行銷？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '合規行銷是我們的首要原則。我們策略包括：嚴格遵守衛福部醫療廣告相關規範；使用教育性內容而非誇大宣傳；展示真實案例與患者評價(經適當授權)；明確標示療程風險與恢復期資訊；避免價格戰與低價促銷；強調醫師專業背景與診所設備的實際優勢。我們的行銷團隊定期接受醫療法規培訓，並與法規顧問合作，確保所有行銷內容在創意與合規之間取得最佳平衡。'
      }
    }
  ]
}

// 醫療服務業增強FAQ示例
export const enhancedMedicalServicesFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '您們如何評估醫療行銷的成效？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '我們使用綜合性指標評估行銷成效，包括網站流量與轉換率分析、預約數量增長比較、自費項目轉換率追蹤、社群媒體參與度監測、患者回訪率計算與線上口碑評價分析等。我們提供透明的定期數據報告，協助診所清楚掌握每個行銷渠道的投資報酬率，以持續優化資源分配。'
      }
    },
    {
      '@type': 'Question',
      name: '您們的行銷活動是否符合台灣醫療廣告法規？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '是的，我們的團隊專精於台灣醫療廣告相關法規，所有行銷方案在執行前都會經過嚴格的法規合規性審核，確保完全符合衛福部的醫療廣告規範。我們不僅確保合法合規，同時致力於維護醫療專業形象，避免任何可能被視為誇大不實的宣傳內容，保護診所與醫師的專業聲譽。'
      }
    },
    {
      '@type': 'Question',
      name: '如何針對特定醫療專科客製化行銷策略？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '我們為每一個醫療專科建立獨特的行銷模型，考量各專科的患者決策旅程、競爭環境與專業特性。例如，牙醫診所策略著重於視覺呈現與自費項目價值溝通；皮膚科診所則強調持續護理與療程效果；家醫科則著重在建立社區信任與健康管理價值。每個行銷計畫都從深入的專科市場分析開始，確保策略精準匹配目標患者群體的需求與行為模式。'
      }
    }
  ]
}

// 營銷網站結構化資料
export const brandingWebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.aideamed.com#website',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: {
    '@type': 'Organization',
    '@id': 'https://www.aideamed.com#organization',
    name: siteConfig.name,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/logo.png`,
      width: 600,
      height: 60
    }
  },
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    {
      '@type': 'ReadAction',
      target: [
        `${siteConfig.url}/blog`,
        `${siteConfig.url}/services`,
        `${siteConfig.url}/contact`
      ]
    }
  ],
  inLanguage: siteConfig.language,
  copyrightYear: new Date().getFullYear(),
  isAccessibleForFree: true,
  creator: {
    '@type': 'Organization',
    name: siteConfig.name
  },
  copyrightHolder: {
    '@type': 'Organization',
    name: siteConfig.name
  }
}

// 本地商家結構化資料優化
export const enhancedLocalBusinessSchema = {
  ...localBusinessSchema,
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
  specialty: [
    '醫療行銷',
    '牙醫診所行銷',
    '醫師個人品牌',
    '診所數位轉型',
    '醫療內容策略',
    '健康照護行銷'
  ]
}

// 專業服務結構化資料 - 新增
export const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://www.aideamed.com#professionalservice',
  name: siteConfig.name,
  image: siteConfig.ogImage,
  description: siteConfig.description,
  url: siteConfig.url,
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
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: '醫療行銷服務',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '醫療品牌策略',
          description: '打造醫療診所獨特品牌定位與形象'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '診所數位行銷',
          description: '透過AI技術優化診所的線上曝光與患者轉換率'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '醫師個人品牌',
          description: '建立醫師個人專業形象，提升專業權威性'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '診所網站設計',
          description: '高轉換率的診所網站設計與開發'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '醫療內容策略',
          description: '專業醫療知識內容策略與製作'
        }
      }
    ]
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
    }
  ],
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 25.0338,
      longitude: 121.5466
    },
    geoRadius: '50000'
  },
  serviceArea: ['台灣全島', '線上服務不受地域限制'],
  paymentAccepted: ['現金', '信用卡', 'LINE Pay', '轉帳'],
  memberOf: [
    {
      '@type': 'Organization',
      name: '台灣醫療行銷協會'
    },
    {
      '@type': 'Organization',
      name: '台灣數位媒體應用協會'
    }
  ]
} 