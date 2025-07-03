'use client'

import { useState, useEffect } from 'react'

// Instagram 貼文資料型別
export interface InstagramPost {
  id: string
  caption: string
  media_url: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  permalink: string
  timestamp: string
  like_count?: number
  comments_count?: number
  thumbnail_url?: string
}

// Hook 回傳型別
interface UseInstagramReturn {
  posts: InstagramPost[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Instagram Basic Display API 相關設定
const INSTAGRAM_CONFIG = {
  // 這些值應該從環境變數中讀取
  accessToken: process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN,
  appId: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || '1399943624619996',
  appSecret: process.env.INSTAGRAM_APP_SECRET, // 僅用於伺服器端
  fields: 'id,caption,media_url,media_type,permalink,timestamp,thumbnail_url',
  limit: 12
}

/**
 * Instagram API Hook
 * 
 * 此 hook 提供以下功能：
 * 1. 從 Instagram Basic Display API 獲取貼文
 * 2. 處理載入狀態和錯誤
 * 3. 提供手動重新獲取功能
 * 4. 備用策展內容
 * 
 * 使用方式：
 * const { posts, loading, error, refetch } = useInstagram()
 */
export const useInstagram = (): UseInstagramReturn => {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 手動策展的備用內容
  const fallbackPosts: InstagramPost[] = [
    {
      id: '1',
      caption: '🏥 醫療行銷不只是廣告，更是建立患者信任的橋樑。在 Aidea:Med，我們用心理解每位醫師的專業價值，將其轉化為患者能感受到的溫暖與專業。\n\n#醫療行銷 #患者信任 #專業價值 #AideaMed',
      media_url: '/images/blog/default_lg.jpg',
      media_type: 'IMAGE',
      permalink: 'https://www.instagram.com/aidea.med/',
      timestamp: '2024-01-15T10:00:00Z',
      like_count: 156,
      comments_count: 23
    },
    {
      id: '2', 
      caption: '📊 AI 驅動的精準行銷：透過數據洞察，我們幫助診所找到真正需要服務的患者群體。每一次投放都經過精密計算，確保您的專業被正確的人看見。\n\n#AI行銷 #數據分析 #精準投放 #醫療科技',
      media_url: '/images/blog/default_md.jpg',
      media_type: 'IMAGE',
      permalink: 'https://www.instagram.com/aidea.med/',
      timestamp: '2024-01-12T14:30:00Z',
      like_count: 234,
      comments_count: 18
    },
    {
      id: '3',
      caption: '🌟 成功案例分享：T醫療集團透過我們的數位轉型方案，在12個月內新患成長280%。真正的成功不只是數字，而是更多需要幫助的患者能找到優質的醫療服務。\n\n#成功案例 #數位轉型 #患者成長 #醫療品質',
      media_url: '/images/blog/clinic-brand-revival-guide.jpg',
      media_type: 'IMAGE',
      permalink: 'https://www.instagram.com/aidea.med/',
      timestamp: '2024-01-10T09:15:00Z',
      like_count: 198,
      comments_count: 31
    },
    {
      id: '4',
      caption: '💡 醫療行銷合規指南：在法規框架內，如何有效傳達專業價值？我們的專業團隊深度理解醫療法規，確保每一個行銷策略都能在合規的前提下發揮最大效果。\n\n#醫療法規 #合規行銷 #專業服務 #醫療廣告',
      media_url: '/images/blog/medical-social-media-compliance-guide.jpg',
      media_type: 'IMAGE',
      permalink: 'https://www.instagram.com/aidea.med/',
      timestamp: '2024-01-08T16:45:00Z',
      like_count: 167,
      comments_count: 26
    },
    {
      id: '5',
      caption: '🤝 長期夥伴關係：我們不只是服務提供者，更是您診所成長路上的夥伴。從品牌策略到執行落地，從數據分析到團隊培訓，全程陪伴您建立可持續的成長模式。\n\n#夥伴關係 #成長策略 #品牌建設 #長期合作',
      media_url: '/images/blog/medical-plain-language-guide.jpg',
      media_type: 'IMAGE',
      permalink: 'https://www.instagram.com/aidea.med/',
      timestamp: '2024-01-05T11:20:00Z',
      like_count: 189,
      comments_count: 22
    },
    {
      id: '6',
      caption: '📱 社群媒體行銷策略：在數位時代，醫療品牌需要更貼近患者的溝通方式。我們幫助診所建立有溫度的社群內容，讓專業知識變得親近可及。\n\n#社群行銷 #數位時代 #患者溝通 #醫療品牌',
      media_url: '/images/blog/3-second-patient-attention-grabber.jpg',
      media_type: 'IMAGE',
      permalink: 'https://www.instagram.com/aidea.med/',
      timestamp: '2024-01-03T13:10:00Z',
      like_count: 145,
      comments_count: 19
    }
  ]

  // 從 Instagram API 獲取貼文
  const fetchInstagramPosts = async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      // 檢查是否有 access token
      if (!INSTAGRAM_CONFIG.accessToken) {
        console.warn('Instagram access token not found, using fallback content')
        setPosts(fallbackPosts)
        return
      }

      // 構建 API URL
      const apiUrl = `https://graph.instagram.com/me/media?fields=${INSTAGRAM_CONFIG.fields}&limit=${INSTAGRAM_CONFIG.limit}&access_token=${INSTAGRAM_CONFIG.accessToken}`

      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      // 過濾掉影片內容（因為醫療行銷通常以圖片為主）
      const imagePosts = data.data?.filter((post: any) => 
        post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM'
      ) || []

      setPosts(imagePosts.slice(0, 6)) // 只取前6個貼文
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Instagram posts'
      console.error('Instagram API Error:', errorMessage)
      setError(errorMessage)
      
      // 發生錯誤時使用備用內容
      setPosts(fallbackPosts)
    } finally {
      setLoading(false)
    }
  }

  // 手動重新獲取
  const refetch = async (): Promise<void> => {
    await fetchInstagramPosts()
  }

  // 初始載入
  useEffect(() => {
    fetchInstagramPosts()
  }, [])

  return {
    posts,
    loading,
    error,
    refetch
  }
}

// 導出 hook 和型別
export default useInstagram

/**
 * Instagram Basic Display API 設定指南：
 * 
 * 1. 前往 Facebook Developers (https://developers.facebook.com/)
 * 2. 創建新的 Instagram Basic Display 應用程式
 * 3. 配置 OAuth 重定向 URI
 * 4. 獲取 Access Token
 * 5. 將 token 添加到環境變數：
 *    NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=your_token_here
 * 
 * 注意事項：
 * - Access Token 有效期為 60 天，需要定期更新
 * - 建議使用 Long-lived Access Token
 * - 每小時最多 200 次 API 呼叫
 * - 需要通過 Instagram 應用程式審核才能獲取其他用戶數據
 */ 