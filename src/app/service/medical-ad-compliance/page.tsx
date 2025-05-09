import { Metadata } from 'next'
import { sharedMetadata } from '@/app/metadata'
import MedicalAdCompliancePage from '@/components/pages/MedicalAdCompliancePage'

// 定義頁面的 metadata
export const metadata: Metadata = {
  ...sharedMetadata,
  title: '醫療廣告與醫療法規遵循服務 | 合法醫療行銷指南',
  description: '幫助醫療機構與診所合法進行廣告宣傳，避免違反醫療法第84條、第85條與第86條規定，醫師行銷必讀的法規遵循攻略，降低違規風險最高達25萬的罰款。',
  keywords: [
    '醫療廣告法規', '醫療法85條', '醫療法86條', '醫療法規遵循', 
    '診所行銷', '醫師行銷', '合法醫療廣告', '醫療網路行銷', 
    '醫療社群媒體行銷', '醫美行銷規範', '牙醫診所廣告', 
    '醫療廣告罰則', '醫師個人品牌行銷', '醫療機構網路宣傳',
    '醫療廣告違規案例', '醫療廣告合規指南', '診所社群媒體經營', 
    '醫療法規顧問', '醫師部落格規範', '醫療廣告內容限制',
    '牙醫行銷策略', '醫美診所宣傳', '診所廣告審核', '醫療服務推廣',
    '衛福部醫療廣告規定', '醫療機構廣告罰款', '醫師網路經營',
    '衛福部容許登載事項', '醫療法第八十五條容許事項', '醫療廣告費用刊登規範',
    '非醫療機構違法醫療廣告', '醫療法第84條', '國際醫療服務廣告',
    '醫療診所合法廣告方式', '醫療廣告內容限制', '醫療機構網路宣傳規範',
    '醫療廣告法規2025', '醫療機構網際網路資訊管理辦法', '醫療廣告合法方式',
    '醫療機構社群媒體管理', '醫師個人品牌經營', '醫療案例分享規範',
    
    // 牙醫廣告特定關鍵字
    '牙醫診所合法行銷', '牙醫網路行銷規範', '牙醫廣告注意事項',
    '植牙廣告合法方式', '牙醫美白療程宣傳', '牙醫矯正廣告規範',
    '牙醫診所案例照片規定', '牙科價格刊登規範', '牙醫診所促銷限制',
    '牙醫療程效果宣傳', '牙科治療前後照片規範', '牙醫師個人社群經營',
    '牙醫免費諮詢合法性', '牙醫診所限時優惠規範', '牙科收費標準刊登',
    '牙醫隱形矯正廣告', '牙醫全瓷冠廣告規範', '牙醫假牙廣告限制',
    '牙醫診所Google評論管理', '牙醫FB粉絲專頁合規', '牙醫Line官方帳號規範',
    
    // 長尾關鍵字
    '牙醫診所如何合法分享治療案例', '牙科植牙廣告違規案例分析',
    '牙醫診所推廣植牙的合法方式', '牙醫診所網站療程介紹規範',
    '如何避免牙醫診所廣告違規罰款', '牙醫診所社群媒體貼文規範',
    '牙科美白療程合法宣傳指南', '牙醫案例照片去識別化處理',
    '牙醫矯正治療前後對比合法展示', '牙醫診所折扣優惠合規策略',
    '牙醫診所網紅合作法規注意事項', '牙醫名醫品牌經營合法方式',
    '小型牙醫診所如何合法行銷', '牙科價格透明化合法刊登', 
    '牙醫療程保固廣告規範', '牙醫診所兒童牙科行銷方式',
    '牙醫客製化療程廣告合規指南', '牙科新技術宣傳法規限制'
  ],
  openGraph: {
    title: '醫療廣告與醫療法規遵循服務 | 合法醫療行銷指南',
    description: '幫助醫療機構與診所合法進行廣告宣傳，避免違反醫療法規與廣告限制，打造安全有效的醫療行銷策略，提供台灣最新醫療法規資訊與案例分析。',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com'}/service/medical-ad-compliance`,
    type: 'website',
    locale: 'zh_TW',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com'}/images/og/medical-ad-compliance.jpg`,
        width: 1200,
        height: 630,
        alt: '醫療廣告法規遵循服務'
      }
    ]
  },
  twitter: {
    title: '醫療廣告與醫療法規遵循服務',
    description: '幫助醫療機構與診所合法進行廣告宣傳，避免違反醫療法規與廣告限制，打造安全有效的醫療行銷策略。',
    card: 'summary_large_image'
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com'}/service/medical-ad-compliance`
  }
}

// 定義整合型結構化數據
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com';
const SERVICE_URL = `${BASE_URL}/service/medical-ad-compliance`;

// 服務頁面統一結構化數據
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    // 網頁資訊
    {
      "@type": "WebPage",
      "@id": `${SERVICE_URL}#webpage`,
      "url": SERVICE_URL,
      "name": "醫療廣告與醫療法規遵循服務",
      "description": "幫助醫療機構與診所合法進行廣告宣傳，避免違反醫療法第84條、第85條與第86條規定，提供全方位醫療法規遵循解決方案。",
      "isPartOf": {
        "@id": `${BASE_URL}#website`
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/images/og/medical-ad-compliance.jpg`,
        "width": 1200,
        "height": 630
      },
      "inLanguage": "zh-TW",
      "potentialAction": [
        {
          "@type": "ReadAction",
          "target": [SERVICE_URL]
        },
        {
          "@type": "ContactAction",
          "target": `${BASE_URL}/contact`,
          "name": "預約免費法規諮詢"
        }
      ],
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h2", ".hero-content"]
      },
      "mainEntity": {
        "@id": `${SERVICE_URL}#service`
      },
      "breadcrumb": {
        "@id": `${SERVICE_URL}#breadcrumb`
      },
      "about": [
        {
          "@type": "Thing",
          "name": "醫療法規遵循",
          "description": "確保醫療機構行銷活動符合台灣醫療法規要求",
          "sameAs": "https://dep.mohw.gov.tw/DOCMAP/cp-1016-47906-201.html"
        },
        {
          "@type": "Thing",
          "name": "醫療廣告管理",
          "description": "衛福部醫療廣告管理專區",
          "sameAs": "https://www.mohw.gov.tw/cp-15-251-1.html"
        }
      ]
    },
    
    // 服務詳情
    {
      "@type": "Service",
      "@id": `${SERVICE_URL}#service`,
      "name": "醫療廣告法規遵循服務",
      "description": "專業醫療法規顧問服務，協助醫療機構與診所在合法範圍內進行有效行銷，降低違規風險，提升品牌形象。",
      "url": SERVICE_URL,
      "provider": {
        "@type": "Organization",
        "name": "雅德思行銷顧問",
        "url": BASE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/images/logo.png`
        }
      },
      "serviceType": "醫療法規顧問服務",
      "category": "醫療行銷法規諮詢",
      "audience": {
        "@type": "Audience",
        "audienceType": "醫療機構、診所、醫師"
      },
      "areaServed": {
        "@type": "Country",
        "name": "台灣"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "醫療廣告法規遵循服務項目",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "診所廣告法規評估",
              "description": "全面審查現有廣告內容合規性，找出潛在風險，提供專業改善建議"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "合規廣告策略規劃",
              "description": "打造診所專屬廣告合規指南，提供合法效果展示策略"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "員工廣告法規培訓",
              "description": "針對診所團隊提供專業醫療廣告法規培訓，避免無意違規風險"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "持續性合規監測",
              "description": "定期廣告內容合規審查，追蹤法規變化，及時調整策略"
            }
          }
        ]
      },
      "offers": {
        "@type": "Offer",
        "price": "請來電洽詢",
        "priceCurrency": "TWD",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        "offeredBy": {
          "@type": "Organization",
          "name": "雅德思行銷顧問",
          "url": BASE_URL
        }
      },
      "termsOfService": `${BASE_URL}/terms`,
      "knowsAbout": [
        "醫療法第84條",
        "醫療法第85條",
        "醫療法第86條",
        "醫療廣告合規",
        "醫療機構網際網路資訊管理辦法"
      ],
      "potentialAction": {
        "@type": "ContactAction",
        "name": "預約諮詢",
        "target": `${BASE_URL}/contact`
      },
      "review": [
        {
          "@type": "Review",
          "itemReviewed": {
            "@id": `${SERVICE_URL}#service`
          },
          "author": {
            "@type": "Person",
            "name": "陳醫師"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "專業的醫療法規顧問服務，幫助我們診所避免了許多潛在違規風險，同時提升了行銷效果。",
          "datePublished": "2023-10-15"
        },
        {
          "@type": "Review",
          "itemReviewed": {
            "@id": `${SERVICE_URL}#service`
          },
          "author": {
            "@type": "Person",
            "name": "林診所長"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "服務非常全面，從診所網站到社群媒體都有專業的法規審核與建議，讓我們能安心行銷。",
          "datePublished": "2023-11-20"
        }
      ]
    },
    
    // 麵包屑導航
    {
      "@type": "BreadcrumbList",
      "@id": `${SERVICE_URL}#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "首頁",
          "item": BASE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "服務項目",
          "item": `${BASE_URL}/service`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "醫療廣告法規遵循",
          "item": SERVICE_URL
        }
      ]
    },
    
    // 評價數據
    {
      "@type": "AggregateRating",
      "@id": `${SERVICE_URL}#aggregateRating`,
      "itemReviewed": {
        "@id": `${SERVICE_URL}#service`
      },
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "68",
      "reviewCount": "42"
    },
    
    // 常見問題提示
    {
      "@type": "WebPageElement",
      "@id": `${SERVICE_URL}#faq-section`,
      "isPartOf": {
        "@id": `${SERVICE_URL}#webpage`
      },
      "name": "醫療廣告法規常見問題",
      "description": "關於醫療廣告法規遵循的常見問題與專業解答",
      "mainEntity": {
        "@type": "FAQPage",
        "@id": `${SERVICE_URL}#faq-data`,
        "about": {
          "@id": `${SERVICE_URL}#service`
        }
      }
    }
  ]
};

// 新增結構化數據輸出
export default function Page() {
  return (
    <>
      {/* 結構化數據標記 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <MedicalAdCompliancePage />
    </>
  )
} 