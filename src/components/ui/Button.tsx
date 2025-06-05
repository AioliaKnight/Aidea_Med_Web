'use client'

import React, { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'white' | 'black' | 'outline-white' | 'outline-red' | 'outline-black' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  animate?: boolean
}

/**
 * 統一按鈕組件
 * 支援多種變體、尺寸和狀態
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  animate = false,
  className = '',
  children,
  disabled,
  ...props
}, ref) => {
  // 基礎樣式
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-opacity-50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth && 'w-full'
  )

  // 變體樣式
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary-dark focus:ring-primary'
      case 'white':
        return 'bg-white text-primary hover:bg-gray-50 focus:ring-primary border border-gray-200'
      case 'black':
        return 'bg-[#111111] text-white hover:bg-[#333333] focus:ring-gray-500'
      case 'outline-white':
        return 'border-2 border-white text-white hover:bg-white hover:text-primary focus:ring-white bg-transparent'
      case 'outline-red':
        return 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary bg-transparent'
      case 'outline-black':
        return 'border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white focus:ring-gray-500 bg-transparent'
      case 'link':
        return 'text-primary hover:text-primary-dark underline-offset-4 hover:underline focus:ring-primary bg-transparent p-0 h-auto'
      default:
        return 'bg-primary text-white hover:bg-primary-dark focus:ring-primary'
    }
  }

  // 尺寸樣式
  const getSizeClasses = () => {
    if (variant === 'link') return ''
    
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm'
      case 'md':
        return 'px-6 py-3 text-base'
      case 'lg':
        return 'px-8 py-4 text-lg'
      case 'xl':
        return 'px-10 py-5 text-xl'
      default:
        return 'px-6 py-3 text-base'
    }
  }

  const finalClasses = cn(
    baseClasses,
    getVariantClasses(),
    getSizeClasses(),
    className
  )

  const buttonContent = (
    <>
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        icon && iconPosition === 'left' && (
          <span className="mr-2 -ml-1">{icon}</span>
        )
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2 -mr-1">{icon}</span>
      )}
    </>
  )

  if (animate) {
    return (
      <motion.button
        ref={ref}
        className={finalClasses}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {buttonContent}
      </motion.button>
    )
  }

  return (
    <button
      ref={ref}
      className={finalClasses}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </button>
  )
})

Button.displayName = 'Button'

export { Button } 