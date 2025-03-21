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

        // 監聽聊天組件加載完成，並添加自定義樣式調整按鈕位置
        script.onload = () => {
          // 添加配置觀察器以確保樣式能夠真正應用
          const observer = new MutationObserver((mutations, obs) => {
            const chatLauncher = document.querySelector('.respondio-launcher')
            if (chatLauncher) {
              applyCustomStyles()
              obs.disconnect() // 找到元素後停止觀察
            }
          })

          // 開始觀察DOM變化
          observer.observe(document.body, {
            childList: true,
            subtree: true
          })

          // 額外的安全措施：即使沒有檢測到元素，也在一段時間後嘗試應用樣式
          setTimeout(applyCustomStyles, 2000)
        }
      }
    }

    // 應用自定義樣式
    function applyCustomStyles() {
      // 檢查是否已存在自定義樣式
      if (document.getElementById('respondio-custom-style')) {
        return
      }

      // 創建樣式元素
      const style = document.createElement('style')
      style.id = 'respondio-custom-style'
      style.textContent = `
        /* 調整客服聊天按鈕的位置，確保不與回到頂部按鈕重疊 */
        .respondio-launcher {
          right: 24px !important;
          bottom: 24px !important;
          z-index: 49 !important; /* 確保在其他元素上面，但低於回到頂部按鈕 */
        }
        
        /* 聊天窗口位置調整 */
        .respondio-webchat {
          bottom: 100px !important;
          right: 24px !important;
          z-index: 49 !important;
        }
        
        /* 修復可能的覆蓋問題 */
        .respondio-launcher-badge {
          z-index: 48 !important;
        }
      `
      document.head.appendChild(style)
    }

    // 清理函數 - 組件卸載時移除腳本和樣式
    return () => {
      if (typeof window !== 'undefined') {
        const script = document.getElementById('respondio__widget')
        if (script) {
          document.body.removeChild(script)
        }
        
        // 移除自定義樣式
        const style = document.getElementById('respondio-custom-style')
        if (style) {
          document.head.removeChild(style)
        }
      }
    }
  }, [])

  // 該組件不渲染任何UI元素，僅在客戶端執行腳本
  return null
} 