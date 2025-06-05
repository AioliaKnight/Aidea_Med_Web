/**
 * Blog 組件系統統一類型定義
 * 集中管理所有 blog 相關的 TypeScript 類型
 */

// 基礎介面
export interface BlogImage {
  url: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export interface TocItem {
  id: string
  title: string
  level: number
  element?: HTMLElement
}

// 組件 Props 介面
export interface BlogContentProps {
  content: string
  className?: string
}

export interface BlogTableOfContentsProps {
  content: string
  className?: string
}

export interface BlogMobileTableOfContentsProps {
  content: string
  className?: string
}

export interface BlogReadingProgressProps {
  className?: string
}

export interface BlogGalleryProps {
  images: BlogImage[]
  layout?: 'grid' | 'carousel' | 'masonry'
  aspectRatio?: string
  className?: string
}

// 共用樣式常數
export const BLOG_STYLES = {
  BUTTON_BASE: "flex items-center space-x-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-colors",
  BUTTON_LIKED: "bg-red-50 text-red-500",
  BUTTON_DEFAULT: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  SHARE_BUTTON: "flex items-center w-full px-4 py-3 sm:py-2 text-sm text-gray-700 hover:bg-gray-100",
  CARD_BASE: "bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
  CONTENT_PROSE: "prose prose-lg max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-gray-900"
} as const

// 動畫配置
export const BLOG_ANIMATIONS = {
  FADE_IN: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  SLIDE_IN_RIGHT: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.3 }
  },
  SLIDE_UP: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  }
} as const

// 配置常數
export const BLOG_CONFIG = {
  READING_SPEED_WPM: 600, // 中文每分鐘閱讀字數
  TOC_DELAY: 500, // 目錄解析延遲時間
  SCROLL_MARGIN_TOP: '100px', // 標題滾動偏移
  MIN_HEADING_LENGTH: 3, // 最小標題長度
  MAX_ID_LENGTH: 50 // 最大 ID 長度
} as const 