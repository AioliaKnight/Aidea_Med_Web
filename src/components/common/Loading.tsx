'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { memo } from 'react'
import Logo from './Logo'
import { cn } from '@/lib/utils'
import { 
  LOADING_ANIMATION_CONFIG, 
  loadingContainerVariants, 
  loadingLogoVariants, 
  loadingRingVariants, 
  loadingTextVariants 
} from '@/utils/animations'

// 容器尺寸預設值
const CONTAINER_SIZES = {
  xs: 'w-6 h-6',
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32'
} as const

// Logo 尺寸預設值
const LOGO_SIZES = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md'
} as const

// 顏色主題
const COLOR_THEMES = {
  slate: {
    ring: 'border-slate-200',
    spinner: 'border-slate-950',
    dots: 'bg-slate-950',
    text: 'text-slate-600'
  },
  zinc: {
    ring: 'border-zinc-200',
    spinner: 'border-zinc-950',
    dots: 'bg-zinc-950',
    text: 'text-zinc-600'
  },
  neutral: {
    ring: 'border-neutral-200',
    spinner: 'border-neutral-950',
    dots: 'bg-neutral-950',
    text: 'text-neutral-600'
  },
  primary: {
    ring: 'border-primary/20',
    spinner: 'border-primary',
    dots: 'bg-primary',
    text: 'text-primary'
  }
} as const

export interface LoadingProps {
  /**
   * 顯示加載中文字
   */
  text?: string;
  /**
   * 是否全屏顯示
   */
  fullscreen?: boolean;
  /**
   * 容器尺寸
   */
  size?: keyof typeof CONTAINER_SIZES;
  /**
   * 是否應用背景模糊
   */
  blur?: boolean;
  /**
   * 顏色主題
   */
  theme?: keyof typeof COLOR_THEMES;
  /**
   * 加載器類型
   */
  type?: 'ring' | 'spinner' | 'logo' | 'simple';
  /**
   * 自定義類名
   */
  className?: string;
  /**
   * 背景顏色
   */
  background?: string;
  /**
   * Logo變體
   */
  logoVariant?: 'white' | 'black' | 'primary';
  /**
   * 是否優先載入Logo
   */
  logoPriority?: boolean;
}

/**
 * 加載指示器組件
 * 根據傳入的type參數，可呈現不同的加載視覺效果:
 * - simple: 簡易SVG加載圖標，適合內聯使用
 * - spinner: 環形加載動畫
 * - logo: 帶Logo的加載動畫，適合全頁加載狀態
 * - ring: 僅環形而無Logo
 */
function Loading({
  fullscreen = false,
  text,
  blur = false,
  className,
  size = 'md',
  theme = 'primary',
  type = 'logo',
  background = 'bg-background/80',
  logoVariant = 'primary',
  logoPriority = true
}: LoadingProps) {
  const colors = COLOR_THEMES[theme]
  
  // 簡易Spinner模式
  if (type === 'simple') {
    const spinnerSize = size === 'xs' ? 'h-6 w-6' : 
                        size === 'sm' ? 'h-8 w-8' : 
                        size === 'md' ? 'h-10 w-10' : 'h-12 w-12';
                        
    return (
      <svg
        className={cn(`animate-spin ${spinnerSize} text-primary`, className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="載入中..."
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
  }

  // 標準加載模式 (環形 + 選擇性Logo)
  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        aria-live="assertive"
        aria-busy="true"
        className={cn(
          'flex flex-col items-center justify-center gap-4',
          fullscreen && 'fixed inset-0 z-50',
          blur && 'backdrop-blur-[2px]',
          background,
          className
        )}
        variants={loadingContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className={cn(
          'relative',
          CONTAINER_SIZES[size]
        )}>
          {/* 旋轉環 */}
          <motion.div
            className="absolute inset-0"
            variants={loadingRingVariants}
            initial="initial"
            animate="animate"
          >
            <div className={cn(
              'absolute inset-0 rounded-full border-2',
              colors.ring
            )} />
            <div className={cn(
              'absolute inset-0 rounded-full border-2',
              colors.spinner,
              'border-t-transparent border-r-transparent',
              'transform origin-center'
            )} />
          </motion.div>
          
          {/* Logo (只在logo類型時顯示) */}
          {type === 'logo' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={loadingLogoVariants}
              initial="initial"
              animate="animate"
            >
              <Logo 
                size={LOGO_SIZES[size]}
                variant={logoVariant}
                priority={logoPriority}
                className="transform-gpu"
              />
            </motion.div>
          )}
        </div>

        {/* 載入文字 */}
        {text && (
          <motion.div
            className="flex flex-col items-center gap-3"
            variants={loadingTextVariants}
            initial="initial"
            animate="animate"
          >
            <p className={cn(
              "text-sm font-medium tracking-wide",
              colors.text
            )}>
              {text}
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * 簡易加載指示圖標 (提供向後兼容性)
 */
export const Spinner = memo(function Spinner({ className = 'h-6 w-6 text-primary' }: { className?: string }) {
  return <Loading type="simple" className={className} size="xs" />;
});

Spinner.displayName = 'Spinner';

export default memo(Loading);