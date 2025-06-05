'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X, ChevronRight, Clock, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBlogTableOfContents } from './hooks/useBlogTableOfContents'
import { TocItem } from './types'

interface BlogMobileTableOfContentsProps {
  content: string
}

const BlogMobileTableOfContents: React.FC<BlogMobileTableOfContentsProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const {
    tocItems,
    readingProgress,
    estimatedReadTime,
    scrollToHeading: scrollToHeadingFn
  } = useBlogTableOfContents({ content })



  const handleScrollToHeading = useCallback((id: string) => {
    try {
      scrollToHeadingFn(id)
    } catch (error) {
      console.error('滾動到標題時發生錯誤:', error)
    }
  }, [scrollToHeadingFn])

  // 如果沒有內容，不渲染組件
  if (!content) {
    return null
  }

  // 如果沒有目錄項目，不渲染組件
  if (tocItems.length === 0) {
    return null
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleItemClick = (item: TocItem) => {
    handleScrollToHeading(item.id)
    setIsOpen(false)
  }

  return (
    <>
      {/* 觸發按鈕 - 固定在底部 */}
      <motion.button
        onClick={handleToggle}
        className={cn(
          "fixed bottom-6 right-6 z-[60]",
          "xl:hidden", // 只在移動端和平板顯示
          "bg-primary text-white",
          "w-14 h-14 rounded-full shadow-lg",
          "flex items-center justify-center",
          "hover:bg-primary/90 transition-colors",
          "border-2 border-white",
          "className"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="開啟文章目錄"
        style={{ zIndex: 60 }}
      >
        <List className="w-6 h-6" />
        {/* 顯示目錄項目數量的小徽章 */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {tocItems.length}
        </div>
      </motion.button>

      {/* 全屏目錄覆蓋層 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] xl:hidden"
            style={{ zIndex: 70 }}
          >
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleBackdropClick}
            />

            {/* 目錄內容 */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 300,
                opacity: { duration: 0.2 }
              }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden shadow-2xl"
            >
              {/* 拖拽指示器 */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {/* 標題欄 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <List className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    文章目錄 ({tocItems.length})
                  </h3>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{estimatedReadTime} 分鐘</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{Math.round(readingProgress)}%</span>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="關閉目錄"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* 閱讀進度條 */}
              <div className="h-1 bg-gray-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/70"
                  initial={{ width: 0 }}
                  animate={{ width: `${readingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* 目錄列表 */}
              <div className="overflow-y-auto max-h-[calc(80vh-140px)] p-4">
                <nav className="space-y-2">
                  {tocItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => {
                        handleItemClick(item)
                      }}
                      className={cn(
                        "w-full text-left p-3 rounded-xl transition-all duration-200",
                        "flex items-start space-x-3",
                        "hover:bg-gray-50 active:bg-gray-100",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20",
                        "text-gray-700 hover:text-gray-900"
                      )}
                      style={{ 
                        paddingLeft: `${(item.level - 1) * 16 + 12}px` 
                      }}
                    >
                      <ChevronRight 
                        className={cn(
                          "w-4 h-4 mt-0.5 transition-transform flex-shrink-0",
                          "text-gray-400"
                        )} 
                      />
                      <span className={cn(
                        "text-base leading-relaxed line-clamp-2",
                        "font-normal"
                      )}>
                        {item.title}
                      </span>
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* 底部安全區域 */}
              <div className="h-safe-area-inset-bottom bg-white"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default BlogMobileTableOfContents 