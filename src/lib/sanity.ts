import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { apiVersion, dataset, projectId, useCdn } from '@/sanity/env'

// 確保 projectId 存在，否則拋出錯誤
if (!projectId) {
  throw new Error('Sanity Project ID is not set. Please check your environment variables.');
}

/**
 * 標準 Sanity 客戶端，適用於獲取已發布的內容
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  // 添加更多選項用於診斷
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
})

/**
 * 用於預覽草稿內容的客戶端
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts',
  // 添加更多選項用於診斷
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
})

/**
 * 根據是否在預覽模式選擇適當的客戶端
 */
export const getClient = (preview = false) => (preview ? previewClient : client)

// 圖片 URL 建構器
const builder = imageUrlBuilder(client)

/**
 * 將 Sanity 圖片引用轉換為可用的 URL 字串
 */
export function urlForImage(source: SanityImageSource | null | undefined) {
  // 如果來源無效則返回默認圖片
  if (!source) {
    return builder.image('image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg')
  }
  
  return builder.image(source)
}

/**
 * 處理 Sanity 查詢錯誤的輔助函數
 */
export function handleSanityError(error: unknown): string {
  console.error('Sanity API Error:', error);
  
  // 檢查是否為特定 Sanity 錯誤
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('CORS') || errorMessage.includes('Cross-Origin')) {
    return '跨域請求錯誤 (CORS)。請確認您已在 Sanity 管理介面中正確設置 CORS Origins。';
  }
  
  if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('getaddrinfo')) {
    return '無法連接到 Sanity API。請檢查您的網路連接或確認 Sanity 專案 ID 是否正確。';
  }
  
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('authorization')) {
    return '授權錯誤。請確認您的 API Token 權限設置是否正確。';
  }
  
  return '連接 Sanity API 時發生錯誤。請檢查控制台以獲取更多資訊。';
}