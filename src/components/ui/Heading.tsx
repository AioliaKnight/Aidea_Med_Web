'use client'

import React, { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { motion } from 'framer-motion'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type HeadingVariant = 'default' | 'primary' | 'white' | 'black'

interface HeadingProps extends ComponentPropsWithoutRef<'h1'> {
  level?: HeadingLevel
  size?: HeadingSize
  variant?: HeadingVariant
  children: ReactNode
  className?: string
  withDivider?: boolean
  dividerPosition?: 'left' | 'center' | 'right'
  noWrap?: boolean
  animate?: boolean
  onDark?: boolean
}

/**
 * 通用標題元件 - 提供一致的標題樣式與響應式文字大小
 * 支援不同標題級別、大小、顏色變體和動畫效果
 */
export const Heading = ({
  level = 'h2',
  size = 'md',
  variant = 'default',
  children,
  className = '',
  withDivider = false,
  dividerPosition = 'left',
  noWrap = true,
  animate = false,
  onDark = false,
  ...props
}: HeadingProps) => {
  const Tag = level as ElementType
  
  // 獲取尺寸類別
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'text-sm xs:text-base sm:text-lg md:text-xl'
      case 'sm':
        return 'text-adaptive-subtitle'
      case 'md':
        return 'text-adaptive-heading'
      case 'lg':
        return 'text-adaptive-heading-lg'
      case 'xl':
        return 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
      default:
        return 'text-adaptive-heading'
    }
  }
  
  // 獲取顏色變體類別
  const getVariantClasses = () => {
    // 在深色背景上優先使用白色文字，確保可見性
    if (onDark) {
      // 在深色背景上，只有primary變體保持原色，其他都是白色
      return variant === 'primary' ? 'text-primary' : 'text-white';
    }
    
    // 非深色背景的正常情況
    switch (variant) {
      case 'primary':
        return 'text-primary'
      case 'white':
        return 'text-white'
      case 'black':
        return 'text-black'
      default:
        return ''
    }
  }
  
  // 獲取分隔線位置類別
  const getDividerPositionClasses = () => {
    switch (dividerPosition) {
      case 'center':
        return 'mx-auto'
      case 'right':
        return 'ml-auto'
      case 'left':
      default:
        return ''
    }
  }
  
  // 基本類別 - 增加行高與內距以避免文字被切
  const baseClasses = `font-bold leading-relaxed py-1 ${getVariantClasses()} ${getSizeClasses()} ${noWrap ? 'whitespace-nowrap overflow-hidden text-ellipsis' : 'whitespace-normal'} ${className}`
  
  // 如果啟用動畫，使用 motion 元件
  if (animate) {
    return (
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-1" // 增加頂部空間
        >
          <Tag className={baseClasses} {...props}>
            {children}
          </Tag>
          
          {withDivider && (
            <motion.div
              className={`h-1 bg-primary w-16 mt-3 mb-6 ${getDividerPositionClasses()}`}
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          )}
        </motion.div>
      </div>
    )
  }
  
  // 無動畫版本
  return (
    <div className="relative pt-1"> {/* 增加頂部空間 */}
      <Tag className={baseClasses} {...props}>
        {children}
      </Tag>
      
      {withDivider && (
        <div className={`h-1 bg-primary w-16 mt-3 mb-6 ${getDividerPositionClasses()}`} />
      )}
    </div>
  )
} 