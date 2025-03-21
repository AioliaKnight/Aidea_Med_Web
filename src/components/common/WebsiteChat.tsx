'use client'

import { useEffect } from 'react'

/**
 * Website Chat 組件
 * 集成 respond.io 客服聊天功能
 * 滾動優化版本 - 在滾動時自動隱藏/顯示聊天按鈕
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

        // 監聽聊天組件加載完成，並添加自定義樣式與滾動行為
        script.onload = () => {
          // 添加組件載入觀察器
          setupMutationObserver()
          // 額外的安全措施：即使沒有檢測到元素，也在一段時間後嘗試應用樣式
          setTimeout(applyCustomStyles, 2000)
          // 添加滾動事件優化
          setupScrollBehavior()
        }
      }
    }

    // 設置DOM觀察器
    function setupMutationObserver() {
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
    }

    // 設置滾動行為優化
    function setupScrollBehavior() {
      let lastScrollTop = 0
      let scrollTimer: number | null = null
      let isScrolling = false
      let isChatVisible = true
      let isScrollingDown = false
      
      // 滾動處理函數
      const handleScroll = () => {
        // 標記正在滾動
        isScrolling = true
        
        const currentScrollTop = window.scrollY
        isScrollingDown = currentScrollTop > lastScrollTop
        
        // 儲存當前滾動位置作為下次比較基準
        lastScrollTop = currentScrollTop
        
        // 重置滾動計時器
        if (scrollTimer !== null) {
          window.clearTimeout(scrollTimer)
        }
        
        // 根據滾動方向控制聊天按鈕可見性
        const chatLauncher = document.querySelector('.respondio-launcher') as HTMLElement
        const chatWindow = document.querySelector('.respondio-webchat') as HTMLElement
        
        if (chatLauncher && !chatWindow) { // 只在聊天窗口未打開時處理按鈕
          // 向下滾動超過600px時隱藏聊天按鈕
          if (isScrollingDown && currentScrollTop > 600) {
            if (isChatVisible) {
              chatLauncher.style.transform = 'translateY(150%)'
              chatLauncher.style.opacity = '0'
              isChatVisible = false
            }
          } 
          // 向上滾動或頂部區域時顯示聊天按鈕
          else if (!isScrollingDown || currentScrollTop < 300) {
            if (!isChatVisible) {
              chatLauncher.style.transform = 'translateY(0)'
              chatLauncher.style.opacity = '1'
              isChatVisible = true
            }
          }
        }
        
        // 設置延遲，在滾動停止後恢復按鈕
        scrollTimer = window.setTimeout(() => {
          isScrolling = false
          
          // 滾動停止時始終顯示聊天按鈕
          if (chatLauncher && !chatWindow && !isChatVisible) {
            chatLauncher.style.transform = 'translateY(0)'
            chatLauncher.style.opacity = '1'
            isChatVisible = true
          }
        }, 800) // 滾動停止後800ms顯示按鈕
      }
      
      // 添加滾動事件監聽
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      // 返回清理函數
      return () => {
        window.removeEventListener('scroll', handleScroll)
        if (scrollTimer !== null) {
          window.clearTimeout(scrollTimer)
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
          transition: transform 0.3s ease, opacity 0.3s ease !important;
        }
        
        /* 聊天窗口位置調整 */
        .respondio-webchat {
          bottom: 100px !important;
          right: 24px !important;
          z-index: 49 !important;
          transition: all 0.3s ease !important;
        }
        
        /* 修復可能的覆蓋問題 */
        .respondio-launcher-badge {
          z-index: 48 !important;
        }

        /* 滾動時隱藏聊天窗口 */
        body.is-scrolling .respondio-webchat:not(.respondio-webchat--expanded) {
          transform: translateY(20px);
          opacity: 0.8;
        }

        /* 平板尺寸優化 */
        @media (max-width: 1024px) {
          .respondio-launcher {
            transform: scale(0.9);
            right: 12px !important;
            bottom: 12px !important;
          }
        }

        /* 移動設備優化 */
        @media (max-width: 640px) {
          .respondio-launcher {
            transform: scale(0.85);
            right: 8px !important;
            bottom: 8px !important;
          }
          .respondio-webchat {
            bottom: 70px !important;
            right: 8px !important;
            max-height: 80vh !important;
          }
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