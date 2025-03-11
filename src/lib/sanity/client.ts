import { createClient, ClientPerspective } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImage } from '@/types/blog'

// 確保必要的環境變數存在
const requiredEnvVars = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
}

// 檢查所有必要的環境變數
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})

// 定義有效的 perspective 值
const PUBLISHED: ClientPerspective = 'published'
const PREVIEW_DRAFTS: ClientPerspective = 'previewDrafts'

const config = {
  projectId: requiredEnvVars.projectId,
  dataset: requiredEnvVars.dataset,
  apiVersion: requiredEnvVars.apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: PUBLISHED,
  token: process.env.SANITY_API_TOKEN,
  // 明確指定 API 主機，解決 URL 錯誤
  apiHost: 'https://apicdn.sanity.io',
  // CORS 配置
  cors: {
    allowOrigins: [
      'http://localhost:3000',
      'https://www.aideamed.com',
      'https://aideamed.com',
      'https://aidea-web.vercel.app'
    ]
  },
  // 添加更多選項用於診斷
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
}

// 建立 Sanity 客戶端
export const client = createClient(config)

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
  ...config,
  useCdn: false,
  perspective: PREVIEW_DRAFTS,
  token: process.env.SANITY_API_TOKEN,
  // 預覽模式使用標準 API 端點而非 CDN
  apiHost: 'https://api.sanity.io',
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
  if (!error) return '連接時發生未知錯誤'
  
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  // CORS 錯誤檢測
  if (
    errorMessage.includes('CORS') || 
    errorMessage.includes('cross-origin') || 
    errorMessage.includes('Access-Control-Allow-Origin')
  ) {
    return `CORS 錯誤: 請確保在 Sanity 管理界面 (https://www.sanity.io/manage/project/${config.projectId}) 中已設置允許以下網域訪問：
    - ${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com'}
    - http://localhost:3000 (開發環境)
    - https://aidea-web.vercel.app (部署預覽環境)`
  }
  
  // 連接錯誤檢測
  if (
    errorMessage.includes('network') || 
    errorMessage.includes('failed to fetch') || 
    errorMessage.includes('timeout') ||
    errorMessage.includes('abort')
  ) {
    return `連接錯誤: 無法連接到 Sanity API。請檢查您的網絡連接，或 Sanity 服務是否運行正常。詳細錯誤: ${errorMessage}`
  }
  
  // 認證錯誤檢測
  if (
    errorMessage.includes('authentication') || 
    errorMessage.includes('auth') || 
    errorMessage.includes('unauthorized') || 
    errorMessage.includes('401') ||
    errorMessage.includes('403')
  ) {
    return `認證錯誤: Sanity API 金鑰或項目 ID 可能無效。請檢查您的環境變量設置。詳細錯誤: ${errorMessage}`
  }
  
  // 數據集錯誤檢測
  if (
    errorMessage.includes('dataset') || 
    errorMessage.includes('not found')
  ) {
    return `數據集錯誤: "${config.dataset}" 數據集可能不存在或無法訪問。請確認數據集名稱是否正確，以及是否有訪問權限。`
  }
  
  // 速率限制錯誤
  if (
    errorMessage.includes('rate limit') || 
    errorMessage.includes('too many requests') ||
    errorMessage.includes('429')
  ) {
    return `速率限制錯誤: 您的請求頻率過高。請稍後再試，或考慮升級您的 Sanity 計劃。`
  }
  
  // 查詢語法錯誤
  if (
    errorMessage.includes('syntax') || 
    errorMessage.includes('query')
  ) {
    return `查詢錯誤: Sanity GROQ 查詢語法可能有誤。詳細錯誤: ${errorMessage}`
  }
  
  // 默認錯誤消息
  return `連接 Sanity API 時發生錯誤。請檢查控制台以獲取更多資訊。錯誤詳情: ${errorMessage}`
} 