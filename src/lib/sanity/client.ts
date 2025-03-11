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
  // CORS 配置 - 擴展允許更多域名
  cors: {
    allowOrigins: [
      'http://localhost:3000',
      'https://www.aideamed.com',
      'https://aideamed.com',
      'https://aidea-web.vercel.app',
      'https://aidea-web-aioliaknight.vercel.app',
      // 允許所有子域名，解決跨域問題
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*\.aideamed\.com$/
    ],
    credentials: true,
  },
  // 添加更多選項用於診斷
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
  // 添加重試機制
  retry: {
    retries: 5, // 增加重試次數
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 20000 // 增加最大超時時間
  },
  // 添加超時設置
  timeout: 60000, // 增加到60秒
}

// 建立 Sanity 客戶端
export const client = createClient(config)

// 建立圖片 URL 建構器
const builder = imageUrlBuilder(client)

// 圖片 URL 生成函數
export const urlForImage = (source: SanityImage | null | undefined) => {
  try {
    // 如果來源無效則返回默認圖片構建器
    if (!source || !source.asset) {
      return builder.image('image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg')
    }
    
    // 返回圖片構建器，不包含任何轉換
    return builder.image(source)
  } catch (error) {
    console.error('Sanity 圖片處理錯誤:', error);
    // 發生錯誤時返回默認圖片構建器
    return builder.image('image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg')
  }
}

// 預覽客戶端
export const previewClient = createClient({
  ...config,
  useCdn: false,
  perspective: PREVIEW_DRAFTS,
  token: process.env.SANITY_API_TOKEN,
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
  console.error('Sanity Error:', error)
  
  // CSP 錯誤檢測
  if (
    errorMessage.includes('Content-Security-Policy') ||
    errorMessage.includes('CSP')
  ) {
    return `內容安全策略(CSP)錯誤: 網站的安全策略可能阻止了對Sanity API的訪問。請確認CSP配置中包含了 'connect-src' 允許 *.sanity.io 和 *.apicdn.sanity.io 域名。`
  }
  
  // CORS 錯誤檢測
  if (
    errorMessage.includes('CORS') || 
    errorMessage.includes('cross-origin') || 
    errorMessage.includes('Access-Control-Allow-Origin')
  ) {
    return `CORS 錯誤: 請確保在 Sanity 管理界面中已設置允許以下網域訪問：
    - ${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com'}
    - http://localhost:3000 (開發環境)
    - https://aidea-web.vercel.app (部署預覽環境)
    - https://aidea-web-aioliaknight.vercel.app (Vercel 預覽環境)`
  }
  
  // 連接錯誤檢測
  if (
    errorMessage.includes('network') || 
    errorMessage.includes('failed to fetch') || 
    errorMessage.includes('timeout') ||
    errorMessage.includes('abort')
  ) {
    return `連接錯誤: 無法連接到 Sanity API。請檢查您的網絡連接，或 Sanity 服務是否運行正常。如果問題持續存在，請稍後再試。`
  }
  
  // 認證錯誤檢測
  if (
    errorMessage.includes('authentication') || 
    errorMessage.includes('auth') || 
    errorMessage.includes('unauthorized') || 
    errorMessage.includes('401') ||
    errorMessage.includes('403')
  ) {
    return `認證錯誤: 請確認 Sanity API Token 是否有效，以及是否具有適當的權限。`
  }
  
  // 數據集錯誤檢測
  if (
    errorMessage.includes('dataset') || 
    errorMessage.includes('not found')
  ) {
    return `數據集錯誤: "${config.dataset}" 數據集可能不存在或無法訪問。請確認數據集設置是否正確。`
  }
  
  // 速率限制錯誤
  if (
    errorMessage.includes('rate limit') || 
    errorMessage.includes('too many requests') ||
    errorMessage.includes('429')
  ) {
    return `速率限制錯誤: 請求頻率過高，系統已自動限制。請稍後再試。`
  }
  
  // 查詢語法錯誤
  if (
    errorMessage.includes('syntax') || 
    errorMessage.includes('query')
  ) {
    return `查詢錯誤: 請檢查 GROQ 查詢語法是否正確。`
  }
  
  // 默認錯誤消息
  return `發生錯誤：${errorMessage}`
} 