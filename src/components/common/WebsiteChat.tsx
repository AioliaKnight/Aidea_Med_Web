'use client'

import { useEffect } from 'react'

/**
 * Website Chat 組件
 * 集成 respond.io 客服聊天功能
 */
export default function WebsiteChat(): React.ReactElement | null {
  useEffect(() => {
    // 確保script只在瀏覽器環境中執行
    if (typeof window !== 'undefined') {
      // 檢查是否已存在相同ID的腳本，避免重複加載
      if (!document.getElementById('respondio__widget')) {
        const script = document.createElement('script')
        script.id = 'respondio__widget'
        script.src = 'https://cdn.respond.io/webchat/widget/widget.js?cId=8a6609bcba76374da57d57fb66ffcf0'
        script.async = true
        document.body.appendChild(script)
      }
    }

    // 清理函數 - 組件卸載時移除腳本
    return () => {
      if (typeof window !== 'undefined') {
        const script = document.getElementById('respondio__widget')
        if (script) {
          document.body.removeChild(script)
        }
      }
    }
  }, [])

  // 該組件不渲染任何UI元素，僅在客戶端執行腳本
  return null
} 