'use client'

import Image from 'next/image'
import Link from 'next/link'
import { memo, useMemo } from 'react'
import { cn } from '@/lib/utils'

// Logo尺寸配置
const LOGO_SIZES = {
  xs: { width: 32, height: 32 },
  sm: { width: 40, height: 40 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 96, height: 96 },
  '2xl': { width: 128, height: 128 },
  // 響應式尺寸 - 根據不同屏幕大小自動調整
  'responsive': { 
    width: 160, 
    height: 53,
    className: 'w-[120px] sm:w-[160px] lg:w-[200px] h-auto'
  }
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
  /**
   * 連結目的地，若提供則渲染為Link組件
   */
  href?: string;
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
 * // 響應式尺寸 (在不同屏幕尺寸自動調整)
 * <Logo size="responsive" />
 * 
 * // 作為連結使用
 * <Logo href="/" size="md" />
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
  onClick,
  href
}: LogoProps) {
  // 使用 useMemo 緩存計算結果
  const logoSize = useMemo(() => LOGO_SIZES[size], [size]);
  const logoSrc = useMemo(() => LOGO_VARIANTS[variant], [variant]);
  
  // 使用自定義尺寸或預設尺寸
  const logoWidth = width || logoSize.width;
  const logoHeight = height || logoSize.height;
  
  // 是否為響應式尺寸
  const isResponsive = size === 'responsive';
  
  // Logo圖片組件
  const logoImage = (
    <div 
      className={cn(
        "relative inline-block", 
        hover && "transition-transform duration-200 hover:scale-105",
        isResponsive && logoSize.className,
        className
      )}
      style={!isResponsive ? { width: logoWidth, height: logoHeight } : undefined}
      onClick={onClick}
    >
      <Image
        src={logoSrc}
        alt="AIDEA Logo"
        width={logoWidth}
        height={logoHeight}
        className={cn("object-contain", isResponsive && "w-full h-auto")}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        draggable={false}
      />
    </div>
  );
  
  // 如果提供了href，則渲染為Link組件
  if (href) {
    return (
      <Link 
        href={href} 
        className={cn("focus:outline-none focus-visible:ring-2 focus-visible:ring-primary")}
        aria-label="回到首頁"
      >
        {logoImage}
      </Link>
    );
  }
  
  return logoImage;
}

export default memo(Logo) 