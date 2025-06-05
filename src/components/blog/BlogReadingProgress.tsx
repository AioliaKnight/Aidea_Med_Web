'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BlogReadingProgressProps {
  className?: string
}

const BlogReadingProgress: React.FC<BlogReadingProgressProps> = ({ className }) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = Math.min((scrollTop / docHeight) * 100, 100)
      
      setProgress(scrollProgress)
      
      // 當滾動超過 100px 時顯示進度條
      setIsVisible(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "h-1 bg-gray-200/80 backdrop-blur-sm",
        className
      )}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-primary/70"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
      
      {/* 進度百分比顯示 - 僅在桌面版顯示 */}
      <div className="hidden lg:block absolute top-2 right-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1 shadow-sm"
        >
          <span className="text-xs font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default BlogReadingProgress 