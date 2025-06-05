/**
 * SEO 輔助函數 (服務器端)
 * 用於生成結構化數據的純函數，可在服務器端使用
 */

/**
 * 生成文章結構化數據
 */
export function generateArticleStructuredData(article: {
  title: string
  description: string
  author: string
  publishedAt: string
  updatedAt?: string
  image?: string
  url: string
  category?: string
  tags?: string[]
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image ? `${baseUrl}${article.image}` : `${baseUrl}/images/default-og.jpg`,
    author: {
      '@type': 'Person',
      name: article.author,
      url: `${baseUrl}/team`,
      jobTitle: '醫療行銷顧問',
      worksFor: {
        '@type': 'Organization',
        name: 'Aidea:Med 醫療行銷顧問',
        url: baseUrl
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aidea:Med 醫療行銷顧問',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
        width: 200,
        height: 60
      },
      url: baseUrl,
      sameAs: [
        'https://www.facebook.com/aideamed',
        'https://www.instagram.com/aideamed'
      ]
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    },
    url: article.url,
    
    // 醫療內容特定標記
    about: {
      '@type': 'MedicalBusiness',
      name: '醫療行銷',
      description: '專業醫療機構行銷策略與數位轉型服務'
    },
    
    // 專業性和權威性標記 (EEAT)
    expertise: '醫療行銷專業知識',
    authoritativeness: '醫療行銷領域權威',
    trustworthiness: '值得信賴的醫療行銷建議',
    
    // 文章分類和標籤
    ...(article.category && {
      articleSection: article.category
    }),
    ...(article.tags && article.tags.length > 0 && {
      keywords: article.tags.join(', ')
    }),
    
    // 醫療相關性提升
    audience: {
      '@type': 'MedicalAudience',
      audienceType: '醫療機構管理者、醫師、診所經營者'
    },
    
    // 內容品質指標
    contentRating: 'professional',
    educationalLevel: 'professional',
    
    // 地理相關性
    spatialCoverage: {
      '@type': 'Country',
      name: '台灣'
    }
  }
}

/**
 * 生成服務結構化數據
 */
export function generateServiceStructuredData(service: {
  name: string
  description: string
  url: string
  price?: string
  category?: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    
    provider: {
      '@type': 'Organization',
      name: 'Aidea:Med 醫療行銷顧問',
      url: baseUrl,
      logo: `${baseUrl}/images/logo.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+886-2-1234-5678',
        contactType: 'customer service',
        availableLanguage: 'zh-TW'
      }
    },
    
    // 服務類別
    ...(service.category && {
      category: service.category
    }),
    
    // 價格資訊
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: 'TWD',
        availability: 'https://schema.org/InStock'
      }
    }),
    
    // 服務區域
    areaServed: {
      '@type': 'Country',
      name: '台灣'
    },
    
    // 服務特色
    serviceType: '醫療行銷顧問服務',
    audience: {
      '@type': 'BusinessAudience',
      audienceType: '醫療機構'
    }
  }
}

/**
 * 生成 FAQ 結構化數據
 */
export function generateFAQStructuredData(faqs: Array<{
  question: string
  answer: string
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

/**
 * 生成 breadcrumb 結構化數據
 */
export function generateBreadcrumbData(pathname: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
  const pathSegments = pathname.split('/').filter(segment => segment)
  
  if (pathSegments.length === 0) return null

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: '首頁',
      item: baseUrl
    }
  ]

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const position = index + 2
    
    let name = segment
    // 轉換路徑名稱為中文
    switch (segment) {
      case 'blog':
        name = '行銷新知'
        break
      case 'service':
        name = '服務項目'
        break
      case 'case':
        name = '成功案例'
        break
      case 'team':
        name = '專業團隊'
        break
      case 'contact':
        name = '聯絡我們'
        break
      case 'medical-ad-compliance':
        name = '醫療廣告法規遵循'
        break
      default:
        // 保持原始名稱或進行其他轉換
        name = decodeURIComponent(segment)
    }

    breadcrumbItems.push({
      '@type': 'ListItem',
      position,
      name,
      item: `${baseUrl}${currentPath}`
    })
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems
  }
} 