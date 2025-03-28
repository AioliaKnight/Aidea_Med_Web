'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { memo, useState, useEffect, useRef } from 'react'
import { trackImageLoad } from '@/lib/analytics'

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
   * 是否為最大內容繪製 (LCP) 元素
   * @default false
   */
  isLCP?: boolean
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

// 使用環境變數獲取絕對URL基礎路徑
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
const isDevelopment = process.env.NODE_ENV === 'development'

// 根據環境智能地處理圖片路徑
const getImagePath = (path: string): string => {
  // 在開發環境中使用相對路徑，在生產環境中使用絕對路徑
  return isDevelopment ? path : `${baseUrl}${path}`
}

// Logo變體對應的圖片路徑
const logoVariants = {
  white: {
    webp: getImagePath('/logo-w.webp'),
    png: getImagePath('/logo-w.png'),
    placeholder: getImagePath('/logo-w_placeholder.webp')
  },
  black: {
    webp: getImagePath('/logo-b.webp'),
    png: getImagePath('/logo-b.png'),
    placeholder: getImagePath('/logo-b_placeholder.webp')
  },
  primary: {
    webp: getImagePath('/logo-r.webp'),
    png: getImagePath('/logo-r.png'),
    placeholder: getImagePath('/logo-r_placeholder.webp')
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
  isLCP = false,
}: LogoProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const loadStartTimeRef = useRef<number>(0)
  
  // 記錄載入開始時間
  useEffect(() => {
    loadStartTimeRef.current = performance.now()
  }, [variant]) // 變更 variant 時重置計時器
  
  // 從預設值或自訂值取得尺寸
  const dimensions = width && height 
    ? { width, height }
    : size === 'responsive'
    ? logoSizes.responsive
    : logoSizes[size]

  // 根據變體取得logo來源
  const logoSrc = logoVariants[variant]

  // 圖片載入完成處理函數
  const handleImageLoad = () => {
    setImageLoaded(true)
    // 計算載入時間（四捨五入到整數毫秒）
    const loadTime = Math.round(performance.now() - loadStartTimeRef.current)
    // 追蹤圖片載入
    trackImageLoad('logo', variant, imageError ? 'png' : 'webp', loadTime)
  }

  // 處理圖片載入錯誤
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true)
      console.warn(`Logo webp 格式載入失敗，降級使用 png 格式: ${logoSrc.webp}`)
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
        className={cn(
          responsiveStyles.image,
          !imageLoaded && 'opacity-0',
          imageLoaded && 'opacity-100'
        )}
        priority={priority || isLCP}
        quality={90}
        placeholder="blur"
        blurDataURL={logoSrc.placeholder}
        aria-label="Aidea:Med - 醫療行銷顧問公司"
        onError={handleImageError}
        onLoad={handleImageLoad}
        fetchPriority={isLCP ? 'high' : priority ? 'high' : 'auto'}
        loading={isLCP || priority ? 'eager' : 'lazy'}
        sizes={size === 'responsive' ? "(max-width: 640px) 120px, (max-width: 1024px) 160px, 200px" : undefined}
        decoding={isLCP || priority ? 'sync' : 'async'}
        style={{ 
          // 使用 Next.js 15 的樣式特性提升效能
          objectFit: 'contain',
          transition: 'opacity 200ms ease-in-out'
        }}
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
        prefetch={false}
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