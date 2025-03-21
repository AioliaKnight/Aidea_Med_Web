'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * 回到頂部按鈕組件
 * 具有自動顯示/隱藏功能，只有當頁面滾動到一定距離時才會顯示
 */
export default function BackToTopButton({
  threshold = 300, // 滾動閾值，超過此值才顯示按鈕
  position = 'bottom-8 right-8', // 按鈕位置，可通過props自定義
  size = 'w-10 h-10', // 按鈕大小
  iconSize = 'h-5 w-5', // 圖標大小
  rounded = true, // 是否使用圓形按鈕
}: {
  threshold?: number
  position?: string
  size?: string
  iconSize?: string
  rounded?: boolean
}): React.ReactElement | null {
  // 檢查是否顯示按鈕
  const [isVisible, setIsVisible] = useState(false)

  // 監聽滾動事件
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // 初始檢查
    toggleVisibility()

    // 添加滾動事件監聽
    window.addEventListener('scroll', toggleVisibility)

    // 清理函數
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [threshold])

  // 回到頂部的處理函數
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // 使用AnimatePresence來處理按鈕的顯示/隱藏動畫
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className={`fixed ${position} bg-primary text-white ${size} flex items-center justify-center shadow-md hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${rounded ? 'rounded-full' : 'rounded'}`}
          aria-label="回到頂部"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
} 