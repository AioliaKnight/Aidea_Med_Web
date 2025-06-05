'use client'

import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, List, Eye, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBlogTableOfContents } from './hooks'
import { BlogTableOfContentsProps, BLOG_ANIMATIONS } from './types'

const BlogTableOfContents: React.FC<BlogTableOfContentsProps> = ({ 
  content, 
  className 
}) => {
  const tocRef = useRef<HTMLDivElement>(null)
  
  const {
    tocItems,
    activeId,
    isVisible,
    readingProgress,
    estimatedReadTime,
    scrollToHeading
  } = useBlogTableOfContents({ content })

  // 如果沒有目錄項目，不渲染組件
  if (tocItems.length === 0) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tocRef}
          initial={BLOG_ANIMATIONS.SLIDE_IN_RIGHT.initial}
          animate={BLOG_ANIMATIONS.SLIDE_IN_RIGHT.animate}
          exit={BLOG_ANIMATIONS.SLIDE_IN_RIGHT.exit}
          transition={BLOG_ANIMATIONS.SLIDE_IN_RIGHT.transition}
          className={cn(
            "fixed right-4 top-1/2 -translate-y-1/2 z-40",
            "hidden xl:block",
            "w-80 max-h-[70vh] overflow-hidden",
            "bg-white/95 backdrop-blur-sm",
            "border border-gray-200 rounded-2xl shadow-lg",
            className
          )}
        >
          {/* 標題欄 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <List className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-900">文章目錄</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{estimatedReadTime} 分鐘</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{Math.round(readingProgress)}%</span>
              </div>
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
          <div className="p-4 max-h-[calc(70vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <nav className="space-y-1">
              {tocItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => scrollToHeading(item.id)}
                  className={cn(
                    "group flex items-start w-full text-left p-2 rounded-lg transition-all duration-200",
                    "hover:bg-gray-50 hover:shadow-sm",
                    activeId === item.id 
                      ? "bg-primary/10 text-primary border-l-2 border-primary" 
                      : "text-gray-600 hover:text-gray-900"
                  )}
                  style={{ 
                    paddingLeft: `${(item.level - 1) * 12 + 8}px` 
                  }}
                >
                  <ChevronRight 
                    className={cn(
                      "w-3 h-3 mt-0.5 mr-2 transition-transform flex-shrink-0",
                      activeId === item.id ? "text-primary" : "text-gray-400",
                      "group-hover:translate-x-0.5"
                    )} 
                  />
                  <span className={cn(
                    "text-sm leading-relaxed line-clamp-2",
                    activeId === item.id ? "font-medium" : "font-normal"
                  )}>
                    {item.title}
                  </span>
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BlogTableOfContents 