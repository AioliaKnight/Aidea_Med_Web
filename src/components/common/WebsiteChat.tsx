'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Website Chat 組件 - 優化版本
 * 集成 respond.io 客服聊天功能
 * 針對React 19和Next.js 15優化的版本
 * 減少CLS(內容布局偏移)和性能優化
 */
export default function WebsiteChat(): React.ReactElement {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // 使用useLayoutEffect避免布局偏移
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
  
  // 主要效果 - 延遲載入聊天小工具
  useEffect(() => {
    // 確保DOM已經完全載入後才開始加載聊天小工具
    if (typeof window !== 'undefined') {
      // 使用intersection observer確定頁面已經可見
      const observer = new IntersectionObserver((entries) => {
        // 只有在頁面可見且滾動到一定距離後才載入聊天小工具
        if (entries[0].isIntersecting) {
          // 延遲3秒載入聊天小工具，讓主要內容先渲染完成
          timerRef.current = setTimeout(() => {
            loadChatWidget();
            setIsChatVisible(true);
          }, 3000);
          
          // 停止觀察
          observer.disconnect();
        }
      });
      
      // 開始觀察body
      observer.observe(document.body);
      
      // 清理函數
      return () => {
        observer.disconnect();
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, []);
  
  // 載入聊天小工具
  const loadChatWidget = () => {
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
        // 設置滾動優化
        setupScrollBehavior()
      }
      
      document.body.appendChild(script)
    }
  };

  // 設置滾動行為優化 - 使用更高效的方式
  function setupScrollBehavior() {
    if (typeof window === 'undefined') return;
    
    // 使用單一變數追蹤狀態
    let state = {
      lastScrollTop: 0,
      isScrolling: false,
      isChatVisible: true,
      lastInteractionTime: Date.now()
    };
    
    // 針對不同滾動方向的回調
    const handleScroll = () => {
      // 使用requestAnimationFrame批量處理視覺更新
      window.requestAnimationFrame(() => {
        state.isScrolling = true;
        state.lastInteractionTime = Date.now();
        
        const currentScrollTop = window.scrollY;
        const isScrollingDown = currentScrollTop > state.lastScrollTop;
        
        // 儲存當前滾動位置
        state.lastScrollTop = currentScrollTop;
        
        // 根據滾動方向控制聊天按鈕可見性
        const chatLauncher = document.querySelector('.respondio-launcher') as HTMLElement;
        const chatWindow = document.querySelector('.respondio-webchat') as HTMLElement;
        
        if (chatLauncher && !chatWindow) {
          // 只在向下滾動超過閾值時隱藏
          if (isScrollingDown && currentScrollTop > 300) {
            if (state.isChatVisible) {
              chatLauncher.style.transform = 'translateY(150%)';
              chatLauncher.style.opacity = '0';
              state.isChatVisible = false;
            }
          } 
          // 向上滾動或回到頂部附近時顯示
          else if (!isScrollingDown || currentScrollTop < 300) {
            if (!state.isChatVisible) {
              chatLauncher.style.transform = 'translateY(0)';
              chatLauncher.style.opacity = '1';
              state.isChatVisible = true;
            }
          }
        }
        
        // 在滾動停止後600ms恢復聊天按鈕
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        
        timerRef.current = setTimeout(() => {
          state.isScrolling = false;
          
          // 滾動停止後顯示聊天按鈕
          if (chatLauncher && !chatWindow && !state.isChatVisible) {
            chatLauncher.style.transform = 'translateY(0)';
            chatLauncher.style.opacity = '1';
            state.isChatVisible = true;
          }
        }, 600);
      });
    };
    
    // 使用被動事件監聽，提高滾動性能
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 返回清理函數
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
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
        contain: layout size;
      }
      
      /* 調整客服聊天按鈕的位置，確保不與回到頂部按鈕重疊 */
      .respondio-launcher {
        right: 24px !important;
        bottom: 24px !important;
        z-index: 49 !important; /* 確保在其他元素上面，但低於回到頂部按鈕 */
        transition: transform 0.3s ease, opacity 0.3s ease !important;
        transform-origin: bottom right;
        will-change: transform, opacity;
        background: transparent !important;
      }
      
      /* 聊天窗口位置調整 */
      .respondio-webchat {
        bottom: 84px !important;
        right: 24px !important;
        z-index: 49 !important;
        transition: transform 0.3s ease, opacity 0.3s ease !important;
        max-height: 600px !important;
        max-width: 360px !important;
        contain: content;
        background-color: rgba(255, 255, 255, 0.95) !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        pointer-events: auto !important;
      }
      
      /* 確保聊天視窗內容不被遮蓋 */
      .respondio-webchat * {
        visibility: visible !important;
        display: inherit !important;
      }
      
      /* 修正在文章詳情頁的樣式衝突 */
      article .prose div.respondio-webchat,
      article .prose div.respondio-launcher {
        position: fixed !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }
      
      /* 針對深色模式調整背景 */
      @media (prefers-color-scheme: dark) {
        .respondio-webchat {
          background-color: rgba(30, 41, 59, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
      }
      
      /* 手機版樣式調整 */
      @media (max-width: 767px) {
        .respondio-webchat {
          bottom: 0 !important;
          right: 0 !important;
          left: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          max-height: 80vh !important;
          border-radius: 12px 12px 0 0 !important;
          box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* 確保聊天按鈕在手機上位置適當 */
        .respondio-launcher {
          bottom: 16px !important;
          right: 16px !important;
          background: transparent !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // 返回具有固定尺寸的容器，防止CLS
  return (
    <div id="chat-container" ref={chatRef} className="print:hidden">
      {!isScriptLoaded && isChatVisible && (
        <div className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary/90 shadow-lg flex items-center justify-center animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </div>
      )}
    </div>
  );
} 