import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImage } from '@/types/blog'

// 確保 projectId 存在，否則拋出錯誤
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Sanity Project ID is not set. Please check your environment variables.')
}

// 建立 Sanity 客戶端
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-06',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
  // 添加更多選項用於診斷
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
})

// 建立圖片 URL 建構器
const builder = imageUrlBuilder(client)

// 圖片 URL 生成函數
export const urlForImage = (source: SanityImage | null | undefined) => {
  // 如果來源無效則返回默認圖片
  if (!source) {
    return builder.image('image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg')
  }
  
  return builder.image(source)
}

// 預覽客戶端
export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-06',
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN,
  // 添加更多選項用於診斷
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
})

// 獲取預覽客戶端
export const getClient = (preview = false) => (preview ? previewClient : client)

// 預覽模式檢查
export const isPreviewMode = () => {
  return process.env.NEXT_PUBLIC_SANITY_PREVIEW_MODE === 'true'
}

// 預覽令牌檢查
export const isValidPreviewToken = (token: string) => {
  return token === process.env.SANITY_PREVIEW_TOKEN
}

// 預覽 URL 生成
export const getPreviewUrl = (slug: string) => {
  return `/api/preview?slug=${slug}&secret=${process.env.SANITY_PREVIEW_TOKEN}`
}

// 處理 Sanity 查詢錯誤的輔助函數
export function handleSanityError(error: unknown): string {
  console.error('Sanity API Error:', error)
  
  // 檢查是否為特定 Sanity 錯誤
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  if (errorMessage.includes('CORS') || errorMessage.includes('Cross-Origin')) {
    return '跨域請求錯誤 (CORS)。請確認您已在 Sanity 管理介面中正確設置 CORS Origins。'
  }
  
  if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('getaddrinfo')) {
    return '無法連接到 Sanity API。請檢查您的網路連接或確認 Sanity 專案 ID 是否正確。'
  }
  
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('authorization')) {
    return '授權錯誤。請確認您的 API Token 權限設置是否正確。'
  }
  
  return '連接 Sanity API 時發生錯誤。請檢查控制台以獲取更多資訊。'
} 