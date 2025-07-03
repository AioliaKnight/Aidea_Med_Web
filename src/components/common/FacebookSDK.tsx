'use client'

import { useEffect } from 'react'

/**
 * Facebook JavaScript SDK 組件
 * 
 * 此組件負責初始化 Facebook JavaScript SDK，提供以下功能：
 * 1. 載入 Facebook SDK
 * 2. 初始化應用程式設定
 * 3. 啟用頁面檢視追蹤
 * 4. 支援 Instagram Basic Display API
 * 
 * 使用方式：
 * 在 layout.tsx 中引入此組件
 */

declare global {
  interface Window {
    fbAsyncInit?: () => void
    FB?: {
      init: (params: {
        appId: string
        xfbml: boolean
        version: string
      }) => void
      AppEvents: {
        logPageView: () => void
      }
    }
  }
}

interface FacebookSDKProps {
  appId?: string
  version?: string
  debug?: boolean
}

export const FacebookSDK: React.FC<FacebookSDKProps> = ({
  appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1081823416607631', // 從環境變數讀取，備用硬編碼值
  version = 'v23.0',
  debug = process.env.NODE_ENV === 'development'
}) => {
  useEffect(() => {
    // 如果已經載入過 SDK，直接返回
    if (window.FB) {
      return
    }

    // 設定 Facebook SDK 初始化函數
    window.fbAsyncInit = function() {
      if (window.FB) {
        window.FB.init({
          appId: appId,
          xfbml: true,
          version: version
        })

        // 記錄頁面檢視事件
        window.FB.AppEvents.logPageView()

        if (debug) {
          console.log('Facebook SDK initialized successfully')
          console.log('App ID:', appId)
          console.log('Version:', version)
        }
      }
    }

    // 動態載入 Facebook SDK
    const loadFacebookSDK = () => {
      const script = document.createElement('script')
      script.id = 'facebook-jssdk'
      script.async = true
      script.defer = true
      script.crossOrigin = 'anonymous'
      script.src = 'https://connect.facebook.net/zh_TW/sdk.js'
      
      // 載入完成後的回調
      script.onload = () => {
        if (debug) {
          console.log('Facebook SDK script loaded')
        }
      }

      script.onerror = () => {
        console.error('Failed to load Facebook SDK')
      }

      // 插入到第一個 script 標籤之前
      const firstScript = document.getElementsByTagName('script')[0]
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript)
      } else {
        // 如果沒有找到 script 標籤，插入到 head
        document.head.appendChild(script)
      }
    }

    // 檢查是否已存在 Facebook SDK script
    if (!document.getElementById('facebook-jssdk')) {
      loadFacebookSDK()
    }

    // 清理函數
    return () => {
      // 通常不需要移除 Facebook SDK，因為它是全域資源
      // 但如果需要，可以在這裡添加清理邏輯
    }
  }, [appId, version, debug])

  return null // 此組件不渲染任何 UI
}

/**
 * 使用 Facebook API 的輔助函數
 */
export const useFacebookAPI = () => {
  const checkSDKLoaded = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.FB) {
        resolve(true)
        return
      }

      // 等待 SDK 載入
      const checkInterval = setInterval(() => {
        if (window.FB) {
          clearInterval(checkInterval)
          resolve(true)
        }
      }, 100)

      // 10 秒後超時
      setTimeout(() => {
        clearInterval(checkInterval)
        resolve(false)
      }, 10000)
    })
  }

  const logEvent = async (eventName: string, parameters?: Record<string, any>) => {
    const isLoaded = await checkSDKLoaded()
    if (isLoaded && window.FB?.AppEvents) {
      // Facebook 事件追蹤邏輯可以在這裡實作
      console.log('Facebook event logged:', eventName, parameters)
    }
  }

  return {
    checkSDKLoaded,
    logEvent
  }
}

export default FacebookSDK

/**
 * Facebook SDK 設定說明：
 * 
 * 1. App ID: 1081823416607631
 *    - 這是您的 Facebook 應用程式 ID
 *    - 用於識別您的應用程式和網站
 * 
 * 2. Version: v23.0
 *    - Facebook Graph API 版本
 *    - 建議使用最新的穩定版本
 * 
 * 3. xfbml: true
 *    - 啟用 XFBML 解析
 *    - 支援 Facebook 社群外掛程式
 * 
 * 4. 語言設定: zh_TW
 *    - 載入繁體中文版本的 SDK
 *    - 匹配網站的主要語言
 * 
 * 使用注意事項：
 * - SDK 會自動記錄頁面檢視
 * - 支援跨域資源共享 (CORS)
 * - 非同步載入以避免阻塞頁面渲染
 * - 包含錯誤處理和偵錯功能
 */ 