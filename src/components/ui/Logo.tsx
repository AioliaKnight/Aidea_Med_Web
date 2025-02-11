'use client'

import Image from 'next/image'
import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Logo 變體類型
type LogoVariant = 'black' | 'red' | 'white'

// Logo 尺寸類型
type LogoSize = 'sm' | 'md' | 'lg' | 'custom'

// Logo Props 介面
interface LogoProps {
  variant?: LogoVariant
  size?: LogoSize
  width?: number
  height?: number
  className?: string
  href?: string
  showLoadingState?: boolean
  alt?: string
  priority?: boolean
}

// Logo 來源路徑
const LOGO_SOURCES: Record<LogoVariant, string> = {
  black: '/logo-b.png',
  red: '/logo-r.png',
  white: '/logo-w.png',
}

// Logo 預設尺寸
const LOGO_SIZES: Record<Exclude<LogoSize, 'custom'>, { width: number; height: number }> = {
  sm: { width: 120, height: 30 },
  md: { width: 180, height: 40 },
  lg: { width: 240, height: 50 },
}

// Logo 動畫變體
const logoVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: -10
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.98
  }
}

// Logo 樣式
const logoStyles = {
  wrapper: 'relative inline-block transition-transform duration-300',
  image: 'object-contain transition-all duration-300',
  loading: 'absolute inset-0 bg-gray-200 rounded animate-pulse',
  link: 'inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red rounded'
}

function Logo({
  variant = 'black',
  size = 'md',
  width,
  height,
  className,
  href,
  showLoadingState = true,
  alt = 'Aidea:Med Logo',
  priority = true,
}: LogoProps) {
  const [isLoading, setIsLoading] = useState(showLoadingState)
  const [hasError, setHasError] = useState(false)

  // 根據 size 決定尺寸
  const dimensions = size === 'custom' 
    ? { width: width || 180, height: height || 40 }
    : LOGO_SIZES[size]

  // Logo 圖片元件
  const LogoImage = (
    <motion.div
      variants={logoVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        logoStyles.wrapper,
        isLoading && 'animate-pulse',
        className
      )}
    >
      <Image
        src={hasError ? '/logo-fallback.png' : LOGO_SOURCES[variant]}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        className={cn(
          logoStyles.image,
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        aria-hidden={isLoading}
      />
      
      {/* 載入中狀態 */}
      {isLoading && (
        <div 
          className={logoStyles.loading}
          aria-label="Loading logo"
        />
      )}
    </motion.div>
  )

  // 如果有提供 href，包裝成連結
  if (href) {
    return (
      <motion.a
        href={href}
        className={logoStyles.link}
        aria-label="回到首頁"
        whileHover="hover"
        whileTap="tap"
      >
        {LogoImage}
      </motion.a>
    )
  }

  return LogoImage
}

export default memo(Logo) 