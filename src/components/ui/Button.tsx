'use client'

import React, { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FormStatus } from '@/types/form'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'white' | 'black' | 'outline-white' | 'outline-red' | 'outline-black' | 'dark-overlay' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  animate?: boolean
  href?: string
  formStatus?: FormStatus
  idleText?: string
  submittingText?: string
  successText?: string
  errorText?: string
}

/**
 * 統一按鈕組件
 * 支援多種變體、尺寸和狀態
 * 當提供href時，會渲染為Link組件
 * 支援表單狀態管理（整合SubmitButton功能）
 */
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  animate = false,
  className = '',
  children,
  disabled,
  href,
  formStatus,
  idleText,
  submittingText,
  successText,
  errorText,
  ...props
}, ref) => {
  // 排除自定義props，避免傳遞到DOM元素
  const {
    variant: _variant,
    size: _size,
    fullWidth: _fullWidth,
    loading: _loading,
    loadingText: _loadingText,
    icon: _icon,
    iconPosition: _iconPosition,
    animate: _animate,
    href: _href,
    formStatus: _formStatus,
    idleText: _idleText,
    submittingText: _submittingText,
    successText: _successText,
    errorText: _errorText,
    // 也排除可能的錯誤props
    isLoading: _isLoading,
    ...domProps
  } = props as any

  // 表單狀態邏輯（整合自SubmitButton）
  const getFormStatusText = () => {
    if (!formStatus) return children
    
    switch (formStatus) {
      case FormStatus.SUBMITTING:
        return submittingText || '提交中...'
      case FormStatus.SUCCESS:
        return successText || '提交成功'
      case FormStatus.ERROR:
        return errorText || '請重試'
      default:
        return idleText || children
    }
  }

  const getFormStatusVariant = () => {
    if (!formStatus) return variant
    
    switch (formStatus) {
      case FormStatus.SUCCESS:
        return 'outline-black'
      case FormStatus.ERROR:
        return 'outline-red'
      default:
        return variant
    }
  }

  const isFormLoading = formStatus === FormStatus.SUBMITTING
  const isFormDisabled = formStatus === FormStatus.SUBMITTING

  // 基礎樣式
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-opacity-50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth && 'w-full'
  )

  // 變體樣式
  const getVariantClasses = () => {
    const currentVariant = getFormStatusVariant()
    
    switch (currentVariant) {
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
      case 'dark-overlay':
        return 'bg-black/80 hover:bg-black border-2 border-white/30 hover:border-white text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
      case 'link':
        return 'text-primary hover:text-primary-dark underline-offset-4 hover:underline focus:ring-primary bg-transparent p-0 h-auto'
      default:
        return 'bg-primary text-white hover:bg-primary-dark focus:ring-primary'
    }
  }

  // 尺寸樣式
  const getSizeClasses = () => {
    if (getFormStatusVariant() === 'link') return ''
    
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
      {(loading || isFormLoading) ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText || getFormStatusText()}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2 -ml-1">{icon}</span>
          )}
          {getFormStatusText()}
          {icon && iconPosition === 'right' && (
            <span className="ml-2 -mr-1">{icon}</span>
          )}
        </>
      )}
    </>
  )

  // 如果有href，渲染為Link組件
  if (href) {
    if (animate) {
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href={href}
            className={finalClasses}
            ref={ref as React.Ref<HTMLAnchorElement>}
            {...domProps}
          >
            {buttonContent}
          </Link>
        </motion.div>
      )
    }

    return (
      <Link
        href={href}
        className={finalClasses}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...domProps}
      >
        {buttonContent}
      </Link>
    )
  }

  // 否則渲染為button元素
  if (animate) {
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={finalClasses}
        disabled={disabled || loading || isFormDisabled}
        whileHover={{ scale: formStatus !== FormStatus.SUBMITTING ? 1.02 : 1 }}
        whileTap={{ scale: formStatus !== FormStatus.SUBMITTING ? 0.98 : 1 }}
        transition={{ duration: 0.2 }}
        {...domProps}
      >
        {buttonContent}
      </motion.button>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={finalClasses}
      disabled={disabled || loading || isFormDisabled}
      {...domProps}
    >
      {buttonContent}
    </button>
  )
})

Button.displayName = 'Button'

export { Button } 