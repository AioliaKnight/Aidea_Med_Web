export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-25'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0xftlo5k'
export const useCdn = process.env.NODE_ENV === 'production'

/**
 * 確保已經在 Sanity 管理介面中添加了以下 CORS 設定：
 * 1. 開發環境: http://localhost:3000
 * 2. 生產環境: https://www.aideamed.com, https://aideamed.com
 * 3. 部署環境: https://aidea-web.vercel.app
 * 路徑: https://www.sanity.io/manage/project/0xftlo5k/api -> CORS Origins
 */
