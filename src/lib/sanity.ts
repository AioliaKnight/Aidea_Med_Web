import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-25'

/**
 * 標準 Sanity 客戶端，適用於獲取已發布的內容
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
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
  // 如果來源無效則返回空字串或默認圖片
  if (!source) {
    return builder.image('image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg')
  }
  
  return builder.image(source)
}