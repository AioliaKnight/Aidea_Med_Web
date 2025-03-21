'use client'

import Image from 'next/image'
import { memo } from 'react'
import { cn } from '@/lib/utils'

// Logo尺寸配置
const LOGO_SIZES = {
  xs: { width: 32, height: 32 },
  sm: { width: 40, height: 40 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 96, height: 96 },
  '2xl': { width: 128, height: 128 }
} as const

// Logo變體配置
const LOGO_VARIANTS = {
  primary: '/images/logo/logo-primary.svg',
  white: '/images/logo/logo-white.svg',
  black: '/images/logo/logo-black.svg'
} as const

export interface LogoProps {
  /**
   * 尺寸變體
   */
  size?: keyof typeof LOGO_SIZES;
  /**
   * 顏色變體
   */
  variant?: keyof typeof LOGO_VARIANTS;
  /**
   * 自定義類名
   */
  className?: string;
  /**
   * 是否預載入圖片 (用於優先顯示元素)
   */
  priority?: boolean;
  /**
   * 加載時的占位顏色
   */
  placeholder?: 'empty' | 'blur' | 'data:image/...';
  /**
   * 圖片品質 (1-100)
   */
  quality?: number;
  /**
   * hover時是否顯示放大效果
   */
  hover?: boolean;
  /**
   * 自定義寬度 (覆蓋預設尺寸)
   */
  width?: number;
  /**
   * 自定義高度 (覆蓋預設尺寸)
   */
  height?: number;
  /**
   * 點擊事件處理函數
   */
  onClick?: () => void;
}

/**
 * Logo 組件
 * 
 * 用法:
 * ```tsx
 * // 基本用法
 * <Logo />
 * 
 * // 自定義尺寸和變體
 * <Logo size="lg" variant="white" />
 * 
 * // 優先加載 (用於頁面頂部)
 * <Logo priority />
 * ```
 */
function Logo({
  size = 'md',
  variant = 'primary',
  className,
  priority = false,
  placeholder = 'empty',
  quality = 90,
  hover = false,
  width,
  height,
  onClick
}: LogoProps) {
  const logoSize = LOGO_SIZES[size];
  const logoSrc = LOGO_VARIANTS[variant];
  
  // 使用自定義尺寸或預設尺寸
  const logoWidth = width || logoSize.width;
  const logoHeight = height || logoSize.height;
  
  return (
    <div 
      className={cn(
        "relative inline-block", 
        hover && "transition-transform duration-200 hover:scale-105",
        className
      )}
      style={{ width: logoWidth, height: logoHeight }}
      onClick={onClick}
    >
      <Image
        src={logoSrc}
        alt="AIDEA Logo"
        width={logoWidth}
        height={logoHeight}
        className="object-contain"
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        draggable={false}
      />
    </div>
  )
}

export default memo(Logo) 