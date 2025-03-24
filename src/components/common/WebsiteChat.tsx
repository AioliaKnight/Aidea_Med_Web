'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Website Chat 組件
 * 集成 respond.io 客服聊天功能
 * 針對React 19和Next.js 15優化的版本
 * 減少CLS(內容布局偏移)和性能優化
 */
export default function WebsiteChat(): React.ReactElement {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  
  // 使用useLayoutEffect避免布局偏移
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
  
  useIsomorphicLayoutEffect(() => {
    // 確保script只在瀏覽器環境中執行
    if (typeof window !== 'undefined') {
      // 檢查是否已存在相同ID的腳本，避免重複加載
      if (!document.getElementById('respondio__widget')) {
        // 預先創建並應用樣式，防止後續布局偏移
        applyCustomStyles();
        
        const script = document.createElement('script')
        script.id = 'respondio__widget'
        script.src = 'https://cdn.respond.io/webchat/widget/widget.js?cId=8a6609bcba76374da57d57fb66ffcf0'
        script.async = true
        script.defer = true // 使用defer屬性
        
        // 使用onload回調註冊事件處理
        script.onload = () => {
          setIsScriptLoaded(true);
          // 添加組件載入觀察器
          setupMutationObserver()
          // 設置滾動優化
          setupScrollBehavior()
        }
        
        document.body.appendChild(script)
      }
    }

    // 設置DOM觀察器 - 使用React 19兼容的方式
    function setupMutationObserver() {
      if (typeof window === 'undefined') return;
      
      // 兼容React 19的非阻塞方式處理DOM觀察
      const observer = new MutationObserver((mutations) => {
        const chatLauncher = document.querySelector('.respondio-launcher')
        if (chatLauncher) {
          // 找到元素後停止觀察
          observer.disconnect()
          
          // 確保樣式已應用
          updateCustomStyles()
        }
      })

      // 開始觀察DOM變化 - 使用更精確的觀察配置
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributeFilter: ['class', 'id'],
      })
    }

    // 設置滾動行為優化 - 使用更高效的方式
    function setupScrollBehavior() {
      if (typeof window === 'undefined') return;
      
      let lastScrollTop = 0
      let scrollTimer: ReturnType<typeof setTimeout> | null = null
      let isScrolling = false
      let isChatVisible = true
      let isScrollingDown = false
      let lastInteractionTime = Date.now()
      const autoHideDelay = 3000 // 停止互動後自動隱藏延遲（毫秒）
      
      // 使用更高效的滾動處理 - 使用requestAnimationFrame減少重繪
      const handleScroll = () => {
        window.requestAnimationFrame(() => {
          // 標記正在滾動
          isScrolling = true
          // 更新最後互動時間
          lastInteractionTime = Date.now()
          
          const currentScrollTop = window.scrollY
          isScrollingDown = currentScrollTop > lastScrollTop
          
          // 儲存當前滾動位置
          lastScrollTop = currentScrollTop
          
          // 重置滾動計時器
          if (scrollTimer !== null) {
            clearTimeout(scrollTimer)
          }
          
          // 根據滾動方向控制聊天按鈕可見性
          const chatLauncher = document.querySelector('.respondio-launcher') as HTMLElement
          const chatWindow = document.querySelector('.respondio-webchat') as HTMLElement
          
          if (chatLauncher && !chatWindow) { // 只在聊天窗口未打開時處理
            if (isScrollingDown && currentScrollTop > 300) {
              if (isChatVisible) {
                chatLauncher.style.transform = 'translateY(150%)'
                chatLauncher.style.opacity = '0'
                isChatVisible = false
              }
            } 
            else if (!isScrollingDown || currentScrollTop < 300) {
              if (!isChatVisible) {
                chatLauncher.style.transform = 'translateY(0)'
                chatLauncher.style.opacity = '1'
                isChatVisible = true
              }
            }
          }
          
          // 設置延遲，在滾動停止後的處理
          scrollTimer = setTimeout(() => {
            isScrolling = false
            
            // 滾動停止時顯示聊天按鈕
            if (chatLauncher && !chatWindow && !isChatVisible) {
              chatLauncher.style.transform = 'translateY(0)'
              chatLauncher.style.opacity = '1'
              isChatVisible = true
              
              // 設置自動隱藏計時器
              setupAutoHideTimer()
            }
          }, 800)
        });
      }
      
      // 設置自動隱藏計時器 - 優化
      function setupAutoHideTimer() {
        // 使用requestIdleCallback或setTimeout，優先使用前者
        if ('requestIdleCallback' in window) {
          // @ts-ignore
          window.requestIdleCallback(() => {
            checkAndHideChatLauncher();
          }, { timeout: autoHideDelay });
        } else {
          setTimeout(checkAndHideChatLauncher, autoHideDelay);
        }
        
        // 共用的隱藏邏輯
        function checkAndHideChatLauncher() {
          const now = Date.now();
          if (now - lastInteractionTime >= autoHideDelay && !isScrolling) {
            const chatLauncher = document.querySelector('.respondio-launcher') as HTMLElement;
            const chatWindow = document.querySelector('.respondio-webchat') as HTMLElement;
            
            if (chatLauncher && !chatWindow && isChatVisible) {
              chatLauncher.style.transform = 'translateY(150%)';
              chatLauncher.style.opacity = '0';
              isChatVisible = false;
            }
          }
        }
      }
      
      // 優化鼠標移動事件 - 使用節流
      let ticking = false;
      const handleMouseMove = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            lastInteractionTime = Date.now();
            
            // 避免不必要的DOM操作
            const chatLauncher = document.querySelector('.respondio-launcher') as HTMLElement;
            const chatWindow = document.querySelector('.respondio-webchat') as HTMLElement;
            
            if (chatLauncher && !chatWindow && !isChatVisible) {
              chatLauncher.style.transform = 'translateY(0)';
              chatLauncher.style.opacity = '1';
              isChatVisible = true;
            }
            
            ticking = false;
          });
          ticking = true;
        }
      }
      
      // 使用事件委托減少事件監聽器數量
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // 初始設置自動隱藏計時器
      setupAutoHideTimer();
      
      // 返回清理函數 - 確保完全清理
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
        if (scrollTimer !== null) {
          clearTimeout(scrollTimer);
        }
      }
    }

    // 應用自定義樣式 - 預先應用樣式避免布局偏移
    function applyCustomStyles() {
      // 檢查是否已存在自定義樣式
      if (document.getElementById('respondio-custom-style')) {
        return;
      }

      // 創建樣式元素
      const style = document.createElement('style');
      style.id = 'respondio-custom-style';
      style.textContent = `
        /* 預先保留聊天組件空間，減少CLS */
        #chat-container {
          position: fixed;
          right: 24px;
          bottom: 24px;
          width: 60px;
          height: 60px;
          z-index: 49;
          pointer-events: none;
          will-change: transform, opacity;
        }
        
        /* 調整客服聊天按鈕的位置，確保不與回到頂部按鈕重疊 */
        .respondio-launcher {
          right: 24px !important;
          bottom: 24px !important;
          z-index: 49 !important; /* 確保在其他元素上面，但低於回到頂部按鈕 */
          transition: transform 0.3s ease, opacity 0.3s ease !important;
          transform-origin: bottom right;
          will-change: transform, opacity;
        }
        
        /* 聊天窗口位置調整 */
        .respondio-webchat {
          bottom: 100px !important;
          right: 24px !important;
          z-index: 49 !important;
          transition: transform 0.3s ease, opacity 0.3s ease !important;
          will-change: transform, opacity;
          contain: layout size;
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
          #chat-container {
            right: 12px;
            bottom: 12px;
          }
          .respondio-launcher {
            transform: scale(0.9);
            right: 12px !important;
            bottom: 12px !important;
          }
        }

        /* 移動設備優化 */
        @media (max-width: 640px) {
          #chat-container {
            right: 8px;
            bottom: 8px;
          }
          .respondio-launcher {
            transform: scale(0.85);
            right: 8px !important;
            bottom: 8px !important;
          }
          .respondio-webchat {
            bottom: 70px !important;
            right: 8px !important;
            max-height: 80vh !important;
            width: calc(100% - 16px) !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // 更新樣式（當需要後續調整時）
    function updateCustomStyles() {
      // 實作可能需要的額外樣式調整
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
        
        // 清理其他可能的殘留
        const chatLauncher = document.querySelector('.respondio-launcher')
        if (chatLauncher) {
          (chatLauncher.parentNode as HTMLElement).removeChild(chatLauncher)
        }
      }
    }
  }, []) // 空依賴數組確保只運行一次

  // 返回占位容器，確保聊天組件有一個預定位置
  return <div id="chat-container" ref={chatRef} aria-hidden="true" />;
} 