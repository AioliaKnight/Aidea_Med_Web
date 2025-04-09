'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  helperText?: string
  animate?: boolean
  containerClassName?: string
  labelClassName?: string
  inputClassName?: string
  errorClassName?: string
  helperClassName?: string
}

/**
 * 統一輸入元件
 * 整合了標籤、錯誤信息、幫助文本和圖標
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      iconPosition = 'left',
      helperText,
      animate = false,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      helperClassName,
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    // 生成唯一ID
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`
    
    // 基本樣式
    const baseInputClasses = 'w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-primary focus:ring-0 transition-colors'
    
    // 具有圖標的輸入框樣式
    const inputWithIconClasses = icon 
      ? iconPosition === 'left' 
        ? 'pl-10' 
        : 'pr-10'
      : ''
    
    // 錯誤狀態樣式
    const errorStateClasses = error 
      ? 'border-red-500 focus:border-red-500' 
      : ''
    
    // 禁用狀態樣式
    const disabledClasses = disabled 
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
      : ''
    
    // 組合輸入框樣式
    const inputClasses = cn(
      baseInputClasses,
      inputWithIconClasses,
      errorStateClasses,
      disabledClasses,
      inputClassName
    )
    
    // 標籤樣式
    const labelClasses = cn(
      'block text-sm font-medium text-gray-800 mb-2',
      error && 'text-red-500',
      labelClassName
    )
    
    // 錯誤信息樣式
    const errorClasses = cn(
      'text-red-500 text-sm mt-1',
      errorClassName
    )
    
    // 幫助文本樣式
    const helperClasses = cn(
      'text-gray-500 text-sm mt-1',
      helperClassName
    )
    
    // 圖標容器樣式
    const iconContainerClasses = cn(
      'absolute inset-y-0 flex items-center pointer-events-none',
      iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'
    )
    
    // 完整輸入框容器樣式
    const containerClasses = cn(
      'w-full',
      containerClassName
    )
    
    // 基本輸入框
    const inputElement = (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className={iconContainerClasses}>
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(inputClasses, className)}
            {...props}
          />
        </div>
        
        {error && <p className={errorClasses}>{error}</p>}
        {helperText && !error && <p className={helperClasses}>{helperText}</p>}
      </div>
    )
    
    // 如果有啟用動畫，使用motion.div包裝
    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {inputElement}
        </motion.div>
      )
    }
    
    return inputElement
  }
)

Input.displayName = 'Input'

export { Input } 