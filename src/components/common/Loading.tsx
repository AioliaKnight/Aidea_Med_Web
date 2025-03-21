'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { memo, useMemo } from 'react'
import Logo from './Logo'
import { cn } from '@/lib/utils'
import { 
  LOADING_ANIMATION_CONFIG, 
  loadingContainerVariants, 
  loadingLogoVariants, 
  loadingRingVariants, 
  loadingTextVariants 
} from '@/utils/animations'

// 容器尺寸預設值 - 使用Tailwind類
const CONTAINER_SIZES = {
  xs: 'w-6 h-6',
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40'
} as const

// SVG Spinner尺寸 - 使用數值以便於計算
const SVG_SPINNER_SIZES = {
  xs: { size: 24, width: 6, height: 6 },
  sm: { size: 32, width: 8, height: 8 },
  md: { size: 40, width: 10, height: 10 },
  lg: { size: 48, width: 12, height: 12 },
  xl: { size: 64, width: 16, height: 16 }
} as const

// Logo 尺寸對應
const LOGO_SIZES = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg'
} as const

// 動畫變體對應 - 為Logo提供不同視覺效果
const ANIMATION_VARIATIONS = {
  pulse: {
    logoVariants: {
      initial: { scale: 0.9, opacity: 0.7 },
      animate: { 
        scale: 1.05,
        opacity: 1,
        transition: {
          duration: 1.2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }
    }
  },
  bounce: {
    logoVariants: {
      initial: { y: 0, opacity: 0.8 },
      animate: { 
        y: [-2, 2, -2] as number[],
        opacity: [0.8, 1, 0.8] as number[],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  },
  breathe: {
    logoVariants: {
      initial: { scale: 0.95, opacity: 0.8 },
      animate: { 
        scale: [0.95, 1.02, 0.95] as number[],
        opacity: [0.8, 1, 0.8] as number[],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  },
  rotate: {
    logoVariants: {
      initial: { rotate: 0, opacity: 0.8 },
      animate: { 
        rotate: [0, 5, 0, -5, 0] as number[],
        opacity: [0.8, 1, 0.9, 1, 0.8] as number[],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  }
} as const

// 顏色主題 - 使用Tailwind類定義各部分顏色
const COLOR_THEMES = {
  slate: {
    ring: 'border-slate-200',
    spinner: 'border-slate-950',
    dots: 'bg-slate-950',
    text: 'text-slate-600',
    smallSpinner: 'text-slate-700',
    overlay: 'bg-slate-50/80'
  },
  zinc: {
    ring: 'border-zinc-200',
    spinner: 'border-zinc-950',
    dots: 'bg-zinc-950',
    text: 'text-zinc-600',
    smallSpinner: 'text-zinc-700',
    overlay: 'bg-zinc-50/80'
  },
  neutral: {
    ring: 'border-neutral-200',
    spinner: 'border-neutral-950',
    dots: 'bg-neutral-950',
    text: 'text-neutral-600',
    smallSpinner: 'text-neutral-700',
    overlay: 'bg-neutral-50/80'
  },
  primary: {
    ring: 'border-primary/20',
    spinner: 'border-primary',
    dots: 'bg-primary',
    text: 'text-primary',
    smallSpinner: 'text-primary',
    overlay: 'bg-white/80'
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
  type?: 'ring' | 'spinner' | 'logo' | 'simple' | 'minimal' | 'overlay';
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
  /**
   * Logo動畫風格
   */
  animation?: keyof typeof ANIMATION_VARIATIONS;
  /**
   * 子元素，用於overlay模式
   */
  children?: React.ReactNode;
  /**
   * 延遲顯示毫秒數 (防抖動)
   */
  delay?: number;
  /**
   * 自訂提示文本 (用於a11y)
   */
  ariaLabel?: string;
}

/**
 * 加載指示器組件
 * 
 * 用法:
 * ```tsx
 * // 基本用法
 * <Loading />
 * 
 * // 全屏加載
 * <Loading fullscreen text="載入中..." />
 * 
 * // 簡易內聯使用
 * <Button disabled={loading}>
 *   {loading ? <Loading type="minimal" /> : "提交"}
 * </Button>
 * 
 * // 覆蓋模式
 * <Loading type="overlay">
 *   <div className="h-64 w-full">內容區域</div>
 * </Loading>
 * ```
 * 
 * @param props LoadingProps 配置選項
 */
function Loading({
  fullscreen = false,
  text,
  blur = false,
  className,
  size = 'md',
  theme = 'primary',
  type = 'logo',
  background,
  logoVariant = 'primary',
  logoPriority = true,
  animation = 'breathe',
  children,
  delay = 0,
  ariaLabel = '載入中...'
}: LoadingProps) {
  // 使用 useMemo 減少重複計算
  const themeColors = useMemo(() => COLOR_THEMES[theme], [theme]);
  const animationVariation = useMemo(() => ANIMATION_VARIATIONS[animation], [animation]);
  const defaultBackground = useMemo(
    () => fullscreen ? themeColors.overlay : 'bg-transparent', 
    [fullscreen, themeColors.overlay]
  );
  const bgColor = background || defaultBackground;
  
  // 簡易Spinner模式 - 適合內聯使用
  if (type === 'simple') {
    const spinnerConfig = SVG_SPINNER_SIZES[size];
    const spinnerSize = `h-${spinnerConfig.height} w-${spinnerConfig.width}`;
                        
    return (
      <svg
        className={cn(`animate-spin ${spinnerSize}`, themeColors.smallSpinner, className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label={ariaLabel}
        role="status"
        width={spinnerConfig.size}
        height={spinnerConfig.size}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }
  
  // 極簡小型spinner - 適合按鈕等小元素
  if (type === 'minimal') {
    return (
      <div 
        className={cn("relative inline-block", className)}
        role="status"
        aria-label={ariaLabel}
      >
        <div className={cn(
          "w-4 h-4 rounded-full border-2 border-t-transparent animate-spin",
          themeColors.spinner
        )} />
      </div>
    )
  }

  // 覆蓋式加載層 - 包裹內容
  if (type === 'overlay' && children) {
    return (
      <div className={cn("relative", className)}>
        {children}
        
        <AnimatePresence>
          <motion.div
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              blur && 'backdrop-blur-[1px]',
              bgColor
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: delay / 1000 }}
            role="status"
            aria-label={ariaLabel}
          >
            <div className="flex flex-col items-center gap-3">
              <Logo 
                size="sm"
                variant={logoVariant}
                priority={logoPriority}
                className="mb-2"
              />
              <div className="w-8 h-8 relative">
                <div className={cn(
                  "absolute inset-0 rounded-full border-2 border-t-transparent animate-spin",
                  themeColors.spinner
                )} />
              </div>
              {text && (
                <p className={cn("text-sm font-medium", themeColors.text)}>
                  {text}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // 標準加載模式 (環形 + 選擇性Logo)
  return (
    <AnimatePresence>
      <motion.div
        role="status"
        aria-label={ariaLabel}
        aria-live="polite"
        aria-busy="true"
        className={cn(
          'flex flex-col items-center justify-center gap-4',
          fullscreen && 'fixed inset-0 z-50',
          blur && 'backdrop-blur-[2px]',
          bgColor,
          className
        )}
        variants={loadingContainerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay: delay / 1000 }}
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
              themeColors.ring
            )} />
            <div className={cn(
              'absolute inset-0 rounded-full border-2',
              themeColors.spinner,
              'border-t-transparent border-r-transparent',
              'transform origin-center will-change-transform'
            )} />
          </motion.div>
          
          {/* Logo (在logo類型或spinner類型時顯示) */}
          {(type === 'logo' || type === 'spinner') && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              variants={animationVariation.logoVariants}
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
              themeColors.text
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

// 使用memo避免不必要的重新渲染
export default memo(Loading);