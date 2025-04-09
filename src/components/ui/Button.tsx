'use client'

import React, { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buttonAnimations } from '@/utils/animations'

type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'white' 
  | 'black' 
  | 'outline-white' 
  | 'outline-red' 
  | 'outline-black'
  | 'flat-primary'
  | 'flat-white'
  | 'flat-black'

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  loadingText?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  animation?: 'basic' | 'flat' | 'none'
  as?: React.ElementType
  href?: string
  children?: React.ReactNode
}

/**
 * 統一按鈕元件
 * 整合了多種按鈕樣式和狀態，支援動畫效果和圖示
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      animation = 'basic',
      as: Component = 'button',
      href,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // 根據尺寸設定類名
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'
    }

    // 根據變體設定類名
    const variantClasses = {
      'primary': 'bg-primary text-white hover:bg-primary-dark',
      'secondary': 'bg-black text-white hover:bg-black/90',
      'white': 'bg-white text-primary hover:bg-gray-50',
      'black': 'bg-[#111111] text-white hover:bg-[#333333]',
      'outline-white': 'border-2 border-white text-white hover:bg-white hover:text-primary',
      'outline-red': 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      'outline-black': 'border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white',
      'flat-primary': 'bg-primary text-white hover:bg-red-dark',
      'flat-white': 'bg-white text-primary hover:bg-gray-50',
      'flat-black': 'bg-black text-white hover:bg-black/90'
    }

    // 禁用或加載狀態類
    const stateClasses = (disabled || isLoading) 
      ? 'opacity-70 cursor-not-allowed' 
      : 'cursor-pointer'

    // 完整寬度類
    const widthClass = fullWidth ? 'w-full' : ''

    // 合併所有類名
    const buttonClasses = cn(
      'inline-flex items-center justify-center font-medium transition-colors duration-300',
      sizeClasses[size],
      variantClasses[variant],
      stateClasses,
      widthClass,
      className
    )

    // 動畫效果
    const getAnimationProps = () => {
      switch (animation) {
        case 'basic':
          return {
            whileHover: { scale: 1.03 },
            whileTap: { scale: 0.97 },
            transition: { duration: 0.2 }
          }
        case 'flat':
          return {
            whileHover: { y: -2 },
            whileTap: { y: 0 },
            transition: { duration: 0.2 }
          }
        default:
          return {}
      }
    }

    // 處理按鈕文字內容
    const buttonText = isLoading && loadingText ? loadingText : children

    // 渲染按鈕內容
    const renderContent = () => (
      <>
        {isLoading && (
          <span className="inline-block mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {icon && iconPosition === 'left' && <span className={`mr-2 ${isLoading ? 'opacity-0' : ''}`}>{icon}</span>}
        {buttonText}
        {icon && iconPosition === 'right' && <span className={`ml-2 ${isLoading ? 'opacity-0' : ''}`}>{icon}</span>}
      </>
    )

    // 如果是連結按鈕
    if (href && !disabled) {
      return (
        <motion.a
          href={href}
          className={buttonClasses}
          {...getAnimationProps()}
        >
          {renderContent()}
        </motion.a>
      )
    }

    // 標準按鈕
    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...getAnimationProps()}
        {...props}
      >
        {renderContent()}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button } 