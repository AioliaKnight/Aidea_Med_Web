'use client'

import React, { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type BaseCardProps = {
  variant?: 'default' | 'primary' | 'dark' | 'flat' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  hover?: boolean
  animate?: boolean
  as?: 'div' | 'article' | 'section'
}

export interface CardProps extends BaseCardProps, Omit<ComponentPropsWithoutRef<'div'>, keyof BaseCardProps> {}

/**
 * 通用卡片組件
 * 支援多種變體、尺寸和動畫效果
 */
const Card = forwardRef<HTMLDivElement, CardProps>(({
      variant = 'default',
  padding = 'md',
  shadow = 'sm',
  rounded = 'md',
  hover = false,
      animate = false,
      as: Component = 'div',
  className = '',
      children,
      ...props
}, ref) => {
  // 基礎樣式
  const baseClasses = cn(
    'transition-all duration-300',
  )
    
    // 變體樣式
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white'
      case 'dark':
        return 'bg-[#111111] text-white'
      case 'flat':
        return 'bg-white border-none'
      case 'bordered':
        return 'bg-white border-2 border-gray-200'
      case 'default':
      default:
        return 'bg-white border border-gray-100'
    }
  }

  // 內距樣式
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return 'p-0'
      case 'sm':
        return 'p-4'
      case 'md':
        return 'p-6'
      case 'lg':
        return 'p-8'
      case 'xl':
        return 'p-10'
      default:
        return 'p-6'
    }
  }

  // 陰影樣式
  const getShadowClasses = () => {
    switch (shadow) {
      case 'none':
        return 'shadow-none'
      case 'sm':
        return 'shadow-sm'
      case 'md':
        return 'shadow-md'
      case 'lg':
        return 'shadow-lg'
      default:
        return 'shadow-sm'
    }
  }

  // 圓角樣式
  const getRoundedClasses = () => {
    switch (rounded) {
      case 'none':
        return 'rounded-none'
      case 'sm':
        return 'rounded-sm'
      case 'md':
        return 'rounded-md'
      case 'lg':
        return 'rounded-lg'
      case 'full':
        return 'rounded-full'
      default:
        return 'rounded-md'
    }
    }
    
  // 懸停效果
  const getHoverClasses = () => {
    if (!hover) return ''
    
    switch (variant) {
      case 'primary':
        return 'hover:bg-primary-dark hover:shadow-lg'
      case 'dark':
        return 'hover:bg-[#333333] hover:shadow-lg'
      case 'default':
      case 'flat':
      case 'bordered':
      default:
        return 'hover:shadow-md hover:border-primary/20'
    }
  }

  const finalClasses = cn(
      baseClasses,
    getVariantClasses(),
    getPaddingClasses(),
    getShadowClasses(),
    getRoundedClasses(),
    getHoverClasses(),
      className
    )
    
  if (animate) {
    // 創建一個新的 motion.div，不使用擴展的 props 避免類型衝突
    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={hover ? { scale: 1.02 } : undefined}
        style={props.style}
        id={props.id}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        {children}
        </motion.div>
      )
    }
    
  const ElementComponent = Component as any

  return (
    <ElementComponent
      ref={ref}
      className={finalClasses}
      {...props}
    >
      {children}
    </ElementComponent>
  )
})

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