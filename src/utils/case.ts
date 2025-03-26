import { CaseStudy, ArticleStructuredData } from '@/types/case'

// 常數定義
const CONSTANTS = {
  BASE_URL: 'https://www.aideamed.com',
  DEFAULT_FALLBACK_IMAGE: '/images/testimonials/default-avatar.jpg',
  STORAGE_KEYS: {
    LIKED_CASES: 'likedCases'
  },
  IMAGE_PATHS: {
    CASES: '/images/cases',
    THUMBNAILS: '/images/cases/thumbnails',
    PLACEHOLDER: '/images/case-placeholder.jpg'
  }
} as const

// SEO 相關工具函數
export const generateCaseStudyMetadata = (caseStudy: CaseStudy): ArticleStructuredData => {
  const baseUrl = CONSTANTS.BASE_URL
  const currentDate = new Date().toISOString()
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${caseStudy.name} - ${caseStudy.category}成功案例`,
    description: caseStudy.description,
    image: caseStudy.image,
    datePublished: caseStudy.publishedDate || currentDate,
    dateModified: caseStudy.updatedDate || caseStudy.publishedDate || currentDate,
    author: {
      '@type': 'Organization',
      name: 'Aidea:Med 牙醫行銷專家',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aidea:Med 牙醫行銷專家',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/case/${caseStudy.id}`
    },
    about: {
      '@type': 'Thing',
      name: '牙醫診所行銷',
      description: '專業牙醫診所品牌建立與數位行銷服務'
    },
    articleSection: caseStudy.category,
    keywords: ['牙醫行銷', '診所品牌', caseStudy.category, '醫療行銷', '成功案例']
  }
}

// 圖片處理相關工具函數
export const generateCaseImageUrl = (caseId: string, index: number): string => {
  // 確保 caseId 和 index 都是有效的
  if (!caseId || index < 1) {
    return CONSTANTS.IMAGE_PATHS.PLACEHOLDER;
  }
  return `${CONSTANTS.IMAGE_PATHS.CASES}/${caseId}/${index}.jpg`;
}

export const generateCaseThumbnailUrl = (caseId: string): string => {
  // 確保 caseId 是有效的
  if (!caseId) {
    return CONSTANTS.IMAGE_PATHS.PLACEHOLDER;
  }
  return `${CONSTANTS.IMAGE_PATHS.THUMBNAILS}/${caseId}.jpg`;
}

export const handleCaseImageError = (url: string, fallbackUrl: string = CONSTANTS.DEFAULT_FALLBACK_IMAGE): string => {
  // 檢查 URL 是否為有效的圖片路徑
  if (!url || !url.startsWith('/images/')) {
    return fallbackUrl;
  }
  
  // 如果是案例圖片或縮圖，嘗試使用備用圖片
  if (url.includes('/cases/')) {
    return CONSTANTS.IMAGE_PATHS.PLACEHOLDER;
  }
  
  return fallbackUrl;
}

// 日期格式化工具函數
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 分享功能相關工具函數
export const generateShareLinks = (caseStudy: CaseStudy) => {
  const baseUrl = CONSTANTS.BASE_URL
  const url = encodeURIComponent(`${baseUrl}/case/${caseStudy.id}`)
  const title = encodeURIComponent(`${caseStudy.name} - ${caseStudy.category}成功案例`)
  const text = encodeURIComponent(caseStudy.description)

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    line: `https://line.me/R/msg/text/?${title}%20${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    whatsapp: `https://wa.me/?text=${title}%20${url}`
  }
}

// 本地存儲相關工具函數
const getLikedCases = (): string[] => {
  if (typeof window === 'undefined') return []
  
  try {
    return JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEYS.LIKED_CASES) || '[]')
  } catch (e) {
    console.error('Error getting liked cases:', e)
    return []
  }
}

const setLikedCases = (cases: string[]): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(CONSTANTS.STORAGE_KEYS.LIKED_CASES, JSON.stringify(cases))
  } catch (e) {
    console.error('Error setting liked cases:', e)
  }
}

export const isCaseLiked = (caseId: string): boolean => {
  return getLikedCases().includes(caseId)
}

export const updateCaseLikeStatus = (caseId: string, isLiked: boolean): void => {
  const likedCases = getLikedCases()
  const updatedCases = isLiked
    ? [...likedCases, caseId]
    : likedCases.filter((id: string) => id !== caseId)
  
  setLikedCases(updatedCases)
} 