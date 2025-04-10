'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * 回到頂部按鈕組件
 * 具有自動顯示/隱藏功能，只有當頁面滾動到一定距離時才會顯示
 * 優化版本 - 添加方向感知與平滑消失效果，停止滾動後自動隱藏
 */
export default function BackToTopButton({
  threshold = 300, // 滾動閾值，超過此值才顯示按鈕
  position = 'bottom-8 right-8', // 按鈕位置，可通過props自定義
  size = 'w-10 h-10', // 按鈕大小
  iconSize = 'h-5 w-5', // 圖標大小
  rounded = true, // 是否使用圓形按鈕
  autoHideDelay = 3000, // 停止滾動後自動隱藏延遲（毫秒）
}: {
  threshold?: number
  position?: string
  size?: string
  iconSize?: string
  rounded?: boolean
  autoHideDelay?: number
}): React.ReactElement | null {
  // 檢查是否滾動超過閾值
  const [isVisible, setIsVisible] = useState(false)
  // 追蹤滾動方向
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  // 是否在快速滾動
  const [isRapidScrolling, setIsRapidScrolling] = useState(false)
  // 上一次滾動位置
  const [lastScrollY, setLastScrollY] = useState(0)
  // 是否顯示按鈕 (控制渲染)
  const [shouldDisplay, setShouldDisplay] = useState(false)
  // 上次互動時間戳
  const [lastInteractionTime, setLastInteractionTime] = useState(0)

  // 回到頂部的處理函數
  const scrollToTop = useCallback(() => {
    // 使用平滑滾動
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    
    // 添加滾動反饋效果
    const scrollFeedback = document.createElement('div')
    scrollFeedback.className = 'fixed inset-0 bg-primary/5 pointer-events-none z-0'
    scrollFeedback.style.animation = 'fadeOut 0.8s ease-out'
    document.body.appendChild(scrollFeedback)
    
    // 創建淡出動畫
    const fadeOutKeyframes = document.createElement('style')
    fadeOutKeyframes.textContent = `
      @keyframes fadeOut {
        0% { opacity: 0.1; }
        50% { opacity: 0.05; }
        100% { opacity: 0; }
      }
    `
    document.head.appendChild(fadeOutKeyframes)
    
    // 移除元素
    setTimeout(() => {
      document.body.removeChild(scrollFeedback)
      document.head.removeChild(fadeOutKeyframes)
    }, 800)
  }, [])

  // 處理自動隱藏
  useEffect(() => {
    // 只有當按鈕可見時才設置自動隱藏計時器
    if (!isVisible) return;

    let hideTimer: NodeJS.Timeout | null = null;
    
    // 更新交互時間並清除舊計時器
    const updateInteraction = () => {
      setLastInteractionTime(Date.now());
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      
      // 如果應該顯示但當前沒有顯示，則顯示按鈕
      if (isVisible && !shouldDisplay) {
        setShouldDisplay(true);
      }
    };

    // 設置隱藏計時器
    const setupHideTimer = () => {
      if (hideTimer) clearTimeout(hideTimer);
      
      hideTimer = setTimeout(() => {
        // 如果最後交互時間至今已經超過autoHideDelay，則隱藏按鈕
        const now = Date.now();
        if (now - lastInteractionTime >= autoHideDelay) {
          setShouldDisplay(false);
        }
      }, autoHideDelay + 100); // 增加100ms延遲確保計時正確
    };

    // 初始設置
    updateInteraction();
    setupHideTimer();

    // 事件監聽
    window.addEventListener('scroll', updateInteraction);
    window.addEventListener('mousemove', updateInteraction);
    
    // 定時檢查是否應該隱藏按鈕
    const intervalId = setInterval(setupHideTimer, 1000);

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      clearInterval(intervalId);
      window.removeEventListener('scroll', updateInteraction);
      window.removeEventListener('mousemove', updateInteraction);
    };
  }, [isVisible, shouldDisplay, lastInteractionTime, autoHideDelay]);

  // 監聽滾動事件
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // 檢測滾動方向
      const isDown = scrollY > lastScrollY;
      setIsScrollingDown(isDown);
      setLastScrollY(scrollY);
      
      // 顯示/隱藏邏輯
      if (scrollY > threshold) {
        setIsVisible(true);
        setShouldDisplay(true);
        
        // 快速滾動檢測
        const scrollDelta = Math.abs(scrollY - lastScrollY);
        if (scrollDelta > 30) { // 如果快速滾動
          setIsRapidScrolling(true);
          
          // 重設快速滾動計時器
          if (scrollTimer) clearTimeout(scrollTimer);
          scrollTimer = setTimeout(() => {
            setIsRapidScrolling(false);
          }, 300);
        }
      } else {
        setIsVisible(false);
        setShouldDisplay(false);
        setIsRapidScrolling(false);
      }
      
      // 更新交互時間
      setLastInteractionTime(Date.now());
    };

    // 添加滾動事件監聽
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 初始檢查
    handleScroll();

    // 清理函數
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [threshold, lastScrollY]);

  // 處理滑鼠移入
  const handleMouseEnter = useCallback(() => {
    setShouldDisplay(true);
    setLastInteractionTime(Date.now());
  }, []);

  // 根據滾動狀態計算按鈕的視覺狀態
  const getButtonStyles = () => {
    if (isRapidScrolling) {
      return {
        scale: 0.9,
        opacity: isScrollingDown ? 0.7 : 0.8,
      };
    }
    
    return {
      scale: 1,
      opacity: 1,
    };
  };

  // 使用AnimatePresence來處理按鈕的顯示/隱藏動畫
  return (
    <AnimatePresence mode="sync">
      {isVisible && shouldDisplay && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ 
            opacity: getButtonStyles().opacity, 
            scale: getButtonStyles().scale, 
            y: 0 
          }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            duration: isRapidScrolling ? 0.2 : 0.3,
            ease: "easeOut"
          }}
          onClick={scrollToTop}
          className={`fixed ${position} bg-primary text-white ${size} flex items-center justify-center shadow-md hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${rounded ? 'rounded-full' : 'rounded'} z-50`}
          aria-label="回到頂部"
          title="回到頂部"
          onMouseEnter={handleMouseEnter}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
} 