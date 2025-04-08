import { CaseStudy, ArticleStructuredData, CaseImage } from '@/types/case'

// 常數定義
const CONSTANTS = {
  BASE_URL: 'https://www.aideamed.com',
  DEFAULT_FALLBACK_IMAGE: '/images/testimonials/default-avatar.jpg',
  STORAGE_KEYS: {
    LIKED_CASES: 'likedCases',
    VIEWED_CASES: 'viewedCases'
  },
  IMAGE_PATHS: {
    CASES: '/images/cases',
    THUMBNAILS: '/images/cases/thumbnails',
    PLACEHOLDER: '/images/case-placeholder.jpg'
  },
  IMAGE_EXTENSIONS: ['jpg', 'webp', 'png'], // 支援的圖片格式
  VARIANTS: {
    PRIMARY_COLOR: '#E53E3E',
    SECONDARY_COLOR: '#1A202C',
    ACCENT_COLOR: '#F6AD55'
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
  
  // 預設使用 jpg 格式
  return `${CONSTANTS.IMAGE_PATHS.CASES}/${caseId}/${index}.jpg`;
}

// 嘗試多種格式的圖片 URL
export const generateCaseImageUrlWithFallbacks = (caseId: string, index: number): string[] => {
  if (!caseId || index < 1) {
    return [CONSTANTS.IMAGE_PATHS.PLACEHOLDER];
  }
  
  // 生成所有可能的格式的 URL
  return CONSTANTS.IMAGE_EXTENSIONS.map(ext => 
    `${CONSTANTS.IMAGE_PATHS.CASES}/${caseId}/${index}.${ext}`
  );
}

export const generateCaseThumbnailUrl = (caseId: string): string => {
  // 確保 caseId 是有效的
  if (!caseId) {
    return CONSTANTS.IMAGE_PATHS.PLACEHOLDER;
  }
  return `${CONSTANTS.IMAGE_PATHS.THUMBNAILS}/${caseId}.jpg`;
}

// 嘗試多種格式的縮圖 URL
export const generateCaseThumbnailUrlWithFallbacks = (caseId: string): string[] => {
  if (!caseId) {
    return [CONSTANTS.IMAGE_PATHS.PLACEHOLDER];
  }
  
  // 生成所有可能的格式的 URL
  return CONSTANTS.IMAGE_EXTENSIONS.map(ext => 
    `${CONSTANTS.IMAGE_PATHS.THUMBNAILS}/${caseId}.${ext}`
  );
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

// 新增：生成案例圖片集
export const generateCaseGallery = (caseId: string, count: number = 6, options?: {
  basePath?: string;
  fileTypes?: string[];
  withPlaceholder?: boolean;
}): CaseImage[] => {
  const images: CaseImage[] = [];
  const basePath = options?.basePath || CONSTANTS.IMAGE_PATHS.CASES;
  const fileTypes = options?.fileTypes || CONSTANTS.IMAGE_EXTENSIONS;
  
  for (let i = 1; i <= count; i++) {
    const mainUrl = `${basePath}/${caseId}/${i}.${fileTypes[0]}`;
    const fallbackUrls = fileTypes.slice(1).map(ext => 
      `${basePath}/${caseId}/${i}.${ext}`
    );
    
    if (options?.withPlaceholder) {
      fallbackUrls.push(CONSTANTS.IMAGE_PATHS.PLACEHOLDER);
    }
    
    images.push({
      url: mainUrl,
      alt: `案例圖片 ${i}`,
      caption: `${caseId} 案例圖片 ${i}`,
      priority: i === 1, // 首張圖優先載入
      fallbackUrls: fallbackUrls, // 添加備用 URL
      width: i === 1 ? 1200 : 800, // 主圖更大
      height: i === 1 ? 800 : 600,
    });
  }
  
  return images;
}

// 新增：優化圖片尺寸
export const getOptimizedImageSize = (viewportWidth: number): {width: number, height: number} => {
  // 根據視窗寬度動態計算最佳圖片尺寸
  if (viewportWidth < 640) {
    return { width: 400, height: 300 }; // 行動裝置
  } else if (viewportWidth < 1024) {
    return { width: 640, height: 480 }; // 平板
  } else {
    return { width: 1280, height: 720 }; // 桌面
  }
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

// 新增：追蹤已瀏覽案例
export const trackViewedCases = (caseId: string): void => {
  if (typeof window === 'undefined') return
  
  try {
    const viewedCases = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEYS.VIEWED_CASES) || '[]')
    
    // 如果已經在瀏覽記錄中，則移除再添加到最前面
    const filteredCases = viewedCases.filter((id: string) => id !== caseId)
    const updatedCases = [caseId, ...filteredCases].slice(0, 10) // 最多保存10筆
    
    localStorage.setItem(CONSTANTS.STORAGE_KEYS.VIEWED_CASES, JSON.stringify(updatedCases))
  } catch (e) {
    console.error('Error tracking viewed cases:', e)
  }
}

// 新增：獲取最近瀏覽的案例ID
export const getRecentlyViewedCases = (): string[] => {
  if (typeof window === 'undefined') return []
  
  try {
    return JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEYS.VIEWED_CASES) || '[]')
  } catch (e) {
    console.error('Error getting viewed cases:', e)
    return []
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

// 新增：篩選和排序輔助函數
export const sortCasesByPriority = (cases: CaseStudy[]): CaseStudy[] => {
  return [...cases].sort((a, b) => {
    // 優先顯示精選案例
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // 接著依照優先級排序
    const priorityA = a.priority || 0;
    const priorityB = b.priority || 0;
    if (priorityA !== priorityB) return priorityB - priorityA;
    
    // 最後依照更新日期排序
    const dateA = a.updatedDate || a.publishedDate || '';
    const dateB = b.updatedDate || b.publishedDate || '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}

// 新增：數值格式化函數
export const formatMetricValue = (value: string, prefix?: string, suffix?: string): string => {
  return `${prefix || ''}${value}${suffix || ''}`;
} 