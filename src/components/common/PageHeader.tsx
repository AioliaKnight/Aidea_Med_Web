'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
  variant?: 'red' | 'white' | 'black' 
  alignment?: 'center' | 'left'
  size?: 'sm' | 'md' | 'lg'
  withBottomBorder?: boolean
  backgroundImage?: string
  overlayOpacity?: number
}

/**
 * 頁面標題組件 - 在每個主要頁面頂部顯示標題和描述
 * 應用平面化設計風格，使用紅白黑三色
 */
const PageHeader = memo(function PageHeader({ 
  title, 
  description, 
  className = '',
  variant = 'red',
  alignment = 'center',
  size = 'md',
  withBottomBorder = false,
  backgroundImage,
  overlayOpacity = 0.7
}: PageHeaderProps) {
  // 根據不同 variant 設定背景與文字顏色
  const getVariantClasses = () => {
    switch (variant) {
      case 'white':
        return 'bg-white text-black'
      case 'black':
        return 'bg-black text-white'
      case 'red':
      default:
        return 'bg-red text-white'
    }
  }

  // 根據不同 size 設定 padding
  const getPaddingClass = () => {
    switch (size) {
      case 'sm':
        return 'py-10 md:py-12'
      case 'lg':
        return 'py-16 md:py-20'
      case 'md':
      default:
        return 'py-12 md:py-16'
    }
  }

  // 根據不同 alignment 設定文字對齊
  const getAlignmentClass = () => {
    return alignment === 'center' ? 'text-center mx-auto' : 'text-left ml-0'
  }

  // 設定標題大小 - 使用自適應標題樣式
  const getTitleClass = () => {
    switch (size) {
      case 'sm':
        return 'text-adaptive-heading-sm'
      case 'lg':
        return 'text-adaptive-heading-lg'
      case 'md':
      default:
        return 'text-adaptive-heading'
    }
  }

  return (
    <div className={`relative ${getVariantClasses()} ${getPaddingClass()} ${className}`}>
      {backgroundImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image 
            src={backgroundImage}
            alt="背景"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundColor: variant === 'red' ? '#e62733' : 
                              variant === 'black' ? '#111111' : '#ffffff',
              opacity: overlayOpacity
            }}
          />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`max-w-4xl ${getAlignmentClass()}`}
        >
          <motion.h1 
            className={`${getTitleClass()} font-bold mb-4 whitespace-nowrap overflow-hidden text-ellipsis`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          
          {description && (
            <motion.p 
              className={`text-lg md:text-xl max-w-2xl ${alignment === 'center' ? 'mx-auto' : 'ml-0'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {description}
            </motion.p>
          )}
        </motion.div>
      </div>
      
      {withBottomBorder && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
      )}
    </div>
  )
});

PageHeader.displayName = 'PageHeader';

export default PageHeader; 