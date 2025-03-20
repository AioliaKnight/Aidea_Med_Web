'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { memo, useState, useEffect } from 'react'

// 支援的Logo變體
type LogoVariant = 'white' | 'black' | 'primary'
type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'responsive'

interface LogoProps {
  /**
   * Logo顏色變體
   * @default 'black'
   */
  variant?: LogoVariant
  /**
   * Logo尺寸預設
   * @default 'md'
   */
  size?: LogoSize
  /**
   * 連結目的地，若未提供則不會產生連結
   */
  href?: string
  /**
   * 額外CSS類別
   */
  className?: string
  /**
   * 是否優先載入
   * @default false
   */
  priority?: boolean
  /**
   * 自訂寬度 (覆蓋尺寸預設)
   */
  width?: number
  /**
   * 自訂高度 (覆蓋尺寸預設)
   */
  height?: number
}

// 尺寸預設，使用完美的寬高比
const logoSizes = {
  xs: { width: 80, height: 27 },
  sm: { width: 120, height: 40 },
  md: { width: 160, height: 53 },
  lg: { width: 200, height: 67 },
  xl: { width: 240, height: 80 },
  responsive: { width: 160, height: 53 } // 響應式的基本尺寸
} as const

// Logo變體對應的圖片路徑
const logoVariants = {
  white: {
    webp: '/logo-w.webp',
    png: '/logo-w.png',
    placeholder: '/logo-w_placeholder.webp'
  },
  black: {
    webp: '/logo-b.webp',
    png: '/logo-b.png',
    placeholder: '/logo-b_placeholder.webp'
  },
  primary: {
    webp: '/logo-r.webp',
    png: '/logo-r.png',
    placeholder: '/logo-r_placeholder.webp'
  }
} as const

// 響應式尺寸樣式
const responsiveStyles = {
  base: 'w-[120px] sm:w-[160px] lg:w-[200px] h-auto',
  container: 'inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm',
  image: 'object-contain transition-opacity duration-200 hover:opacity-90'
} as const

function Logo({ 
  variant = 'black',
  size = 'md',
  href,
  className,
  priority = false,
  width,
  height,
}: LogoProps) {
  const [imageError, setImageError] = useState(false)

  // 從預設值或自訂值取得尺寸
  const dimensions = width && height 
    ? { width, height }
    : size === 'responsive'
    ? logoSizes.responsive
    : logoSizes[size]

  // 根據變體取得logo來源
  const logoSrc = logoVariants[variant]

  // 處理圖片載入錯誤
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true)
    }
  }

  // 基本圖片組件
  const logoImage = (
    <div className={cn(responsiveStyles.image, className)}>
      <Image
        src={imageError ? logoSrc.png : logoSrc.webp}
        alt="Aidea:Med Logo"
        width={dimensions.width}
        height={dimensions.height}
        className={responsiveStyles.image}
        priority={priority}
        quality={90}
        placeholder="blur"
        blurDataURL={logoSrc.placeholder}
        aria-label="Aidea:Med - 醫療行銷顧問公司"
        onError={handleImageError}
      />
    </div>
  )

  // 根據是否有href返回帶連結或不帶連結的版本
  if (href) {
    return (
      <Link 
        href={href} 
        className={cn(responsiveStyles.container, size === 'responsive' && responsiveStyles.base)}
        aria-label="回到首頁"
      >
        {logoImage}
      </Link>
    )
  }

  return (
    <div className={size === 'responsive' ? responsiveStyles.base : ''}>
      {logoImage}
    </div>
  )
}

// 使用memo避免不必要的重渲染
export default memo(Logo) 