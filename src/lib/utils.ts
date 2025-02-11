import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BlogSearchParams } from '@/types/blog'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 根據背景顏色自動選擇LOGO變體
export function getLogoVariant(bgColor: string): 'black' | 'white' | 'red' {
  // 這裡可以根據實際需求調整判斷邏輯
  if (bgColor.includes('bg-white') || bgColor.includes('bg-gray-50')) {
    return 'black'
  }
  if (bgColor.includes('bg-black') || bgColor.includes('bg-gray-900')) {
    return 'white'
  }
  return 'red'
}

// 構建部落格 URL
export function buildBlogUrl(params: Partial<BlogSearchParams>): string {
  const searchParams = new URLSearchParams()

  if (params.page && params.page !== '1') {
    searchParams.set('page', params.page)
  }
  if (params.category) {
    searchParams.set('category', params.category)
  }
  if (params.search) {
    searchParams.set('search', params.search)
  }
  if (params.sort && params.sort !== 'latest') {
    searchParams.set('sort', params.sort)
  }

  const queryString = searchParams.toString()
  return `/blog${queryString ? `?${queryString}` : ''}`
}

// 格式化日期
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 計算閱讀時間
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// 截斷文字
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// 生成 SEO 標題
export function generateSeoTitle(title: string, siteName: string): string {
  return `${title} | ${siteName}`
}

// 驗證 URL 參數
export function validateSearchParams(params: BlogSearchParams): BlogSearchParams {
  return {
    page: params.page && /^\d+$/.test(params.page) ? params.page : '1',
    category: params.category || '',
    search: params.search || '',
    sort: params.sort === 'popular' ? 'popular' : 'latest',
  }
}

// 解析分頁參數
export function parsePaginationParams(page?: string, limit = 9): {
  skip: number
  take: number
  page: number
} {
  const currentPage = page && /^\d+$/.test(page) ? parseInt(page) : 1
  return {
    skip: (currentPage - 1) * limit,
    take: limit,
    page: currentPage,
  }
}

// 生成分頁範圍
export function generatePaginationRange(
  currentPage: number,
  totalPages: number,
  maxVisible = 5
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const half = Math.floor(maxVisible / 2)
  let start = currentPage - half
  let end = currentPage + half

  if (start < 1) {
    start = 1
    end = maxVisible
  }

  if (end > totalPages) {
    end = totalPages
    start = totalPages - maxVisible + 1
  }

  return Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  )
}

// 處理圖片 URL
interface ImageUrlOptions {
  width?: number
  height?: number
  quality?: number
}

export function getImageUrl(url: string, options: ImageUrlOptions = {}): string {
  const { width, height, quality = 75 } = options
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', quality.toString())
  params.set('fit', 'crop')
  params.set('auto', 'format')

  return `${url}?${params.toString()}`
}

// 生成分享連結
export function generateShareLinks(url: string, title: string) {
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
  }
}

// 處理錯誤訊息
export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return '發生未知錯誤'
} 