'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { memo } from 'react'

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
  /**
   * 是否顯示載入動畫
   * @default true
   */
  showAnimation?: boolean
}

// 尺寸預設，使用完美的寬高比
const logoSizes = {
  xs: { width: 80, height: 27 },
  sm: { width: 120, height: 40 },
  md: { width: 160, height: 53 },
  lg: { width: 200, height: 67 },
  xl: { width: 240, height: 80 },
  responsive: { width: 160, height: 53 } // 響應式的基本尺寸
}

// Logo變體對應的圖片路徑
const logoVariants: Record<LogoVariant, string> = {
  white: '/logo-w.webp',
  black: '/logo-b.webp',
  primary: '/logo-r.webp'
}

// 備選PNG格式的Logo圖片路徑
const logoPngVariants: Record<LogoVariant, string> = {
  white: '/logo-w.png',
  black: '/logo-b.png',
  primary: '/logo-r.png'
}

// 動畫變體 - 只用於hover效果
const logoAnimation = {
  hover: { scale: 1.02, transition: { duration: 0.2 } }
}

function Logo({ 
  variant = 'black',
  size = 'md',
  href,
  className,
  priority = false,
  width,
  height,
  showAnimation = true
}: LogoProps) {
  // 從預設值或自訂值取得尺寸
  const dimensions = width && height 
    ? { width, height }
    : size === 'responsive'
    ? logoSizes.responsive
    : logoSizes[size]

  // 根據變體取得logo來源
  const logoSrc = logoVariants[variant]
  const fallbackSrc = logoPngVariants[variant]

  // 基本圖片組件，加上動畫效果
  const logoImage = (
    <motion.div
      whileHover={logoAnimation.hover}
      className={cn(
        'relative transition-opacity duration-200',
        'hover:opacity-90',
        showAnimation ? 'animate-fadeIn' : '',
        className
      )}
    >
      <Image
        src={logoSrc}
        alt="Aidea:Med Logo"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain"
        priority={priority}
        quality={90}
        aria-label="Aidea:Med - 醫療行銷顧問公司"
        onError={(e) => {
          // 如果webp載入失敗，嘗試載入PNG格式
          const imgElement = e.currentTarget as HTMLImageElement;
          if (imgElement.src !== fallbackSrc) {
            imgElement.src = fallbackSrc;
          }
        }}
      />
    </motion.div>
  )

  // 響應式樣式，適應不同屏幕尺寸
  const responsiveStyles = size === 'responsive' 
    ? 'w-[120px] sm:w-[160px] lg:w-[200px] h-auto' 
    : ''

  // 根據是否有href返回帶連結或不帶連結的版本
  if (href) {
    return (
      <Link 
        href={href} 
        className={cn("inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm", responsiveStyles)}
        aria-label="回到首頁"
      >
        {logoImage}
      </Link>
    )
  }

  return (
    <div className={responsiveStyles}>
      {logoImage}
    </div>
  )
}

// 使用memo避免不必要的重渲染
export default memo(Logo) 