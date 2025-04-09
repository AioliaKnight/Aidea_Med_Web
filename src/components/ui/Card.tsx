'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type CardVariant =
  | 'default'
  | 'flat'
  | 'modern'
  | 'accent'
  | 'primary'
  | 'dark'
  | 'stat'
  | 'stat-primary'
  | 'stat-dark'
  | 'stat-light'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  hoverEffect?: 'lift' | 'border' | 'shadow' | 'none'
  isClickable?: boolean
  animate?: boolean
  motionProps?: any
  as?: React.ElementType
}

/**
 * 統一卡片元件
 * 整合了各種卡片樣式和效果
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hoverEffect = 'none',
      isClickable = false,
      animate = false,
      motionProps,
      as: Component = 'div',
      className,
      children,
      ...props
    },
    ref
  ) => {
    // 基本卡片樣式
    const baseClasses = 'relative'
    
    // 變體樣式
    const variantClasses = {
      'default': 'bg-white border border-gray-100 p-6',
      'flat': 'bg-white p-6',
      'modern': 'bg-white border border-gray-200 p-4 sm:p-6',
      'accent': 'border-l-4 border-primary p-4 sm:p-6 bg-white',
      'primary': 'bg-primary text-white p-6',
      'dark': 'bg-black text-white p-6',
      'stat': 'p-6 flex flex-col items-start',
      'stat-primary': 'bg-primary text-white p-6 flex flex-col items-start',
      'stat-dark': 'bg-black text-white p-6 flex flex-col items-start',
      'stat-light': 'bg-white text-black border border-gray-100 p-6 flex flex-col items-start'
    }
    
    // 懸停效果樣式
    const hoverClasses = {
      'lift': 'transition-transform duration-300 hover:-translate-y-1',
      'border': 'transition-colors duration-300 hover:border-primary',
      'shadow': 'transition-shadow duration-300 hover:shadow-md',
      'none': ''
    }
    
    // 可點擊狀態
    const clickableClasses = isClickable
      ? 'cursor-pointer transition-all duration-300'
      : ''
    
    // 合併所有樣式
    const cardClasses = cn(
      baseClasses,
      variantClasses[variant],
      hoverClasses[hoverEffect],
      clickableClasses,
      className
    )
    
    // 靜態卡片
    const staticCard = (
      <Component
        ref={ref}
        className={cardClasses}
        {...props}
      >
        {children}
      </Component>
    )
    
    // 動畫卡片
    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          {...motionProps}
        >
          {staticCard}
        </motion.div>
      )
    }
    
    return staticCard
  }
)

Card.displayName = 'Card'

// 卡片標題元件
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Tag = 'h3', className, children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn('font-semibold text-xl mb-3', className)}
        {...props}
      >
        {children}
      </Tag>
    )
  }
)

CardTitle.displayName = 'CardTitle'

// 卡片內容元件
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// 卡片頁腳元件
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-6 pt-4 border-t border-gray-100', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

// 數據卡片中用於顯示數字的元件
export interface CardStatProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number
  label: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string | number
}

const CardStat = forwardRef<HTMLDivElement, CardStatProps>(
  ({ value, label, trend, trendValue, className, ...props }, ref) => {
    const trendColors = {
      up: 'text-green-500',
      down: 'text-red-500',
      neutral: 'text-gray-500'
    }
    
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      >
        <div className="text-4xl sm:text-5xl font-bold leading-none mb-2">
          {value}
        </div>
        <div className="text-sm text-gray-500">{label}</div>
        
        {trend && trendValue && (
          <div className={cn('text-sm mt-2 flex items-center', trendColors[trend])}>
            {trend === 'up' && <span className="mr-1">↑</span>}
            {trend === 'down' && <span className="mr-1">↓</span>}
            {trendValue}
          </div>
        )}
      </div>
    )
  }
)

CardStat.displayName = 'CardStat'

export { Card, CardTitle, CardContent, CardFooter, CardStat } 