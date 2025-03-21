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
  },
  spin: {
    logoVariants: {
      initial: { opacity: 0.8, scale: 0.9 },
      animate: { 
        opacity: [0.8, 1, 0.8] as number[],
        scale: [0.9, 1, 0.9] as number[],
        transition: {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  },
  wave: {
    logoVariants: {
      initial: { opacity: 0.8 },
      animate: { 
        filter: [
          'brightness(1) blur(0px)',
          'brightness(1.2) blur(0.5px)',
          'brightness(1) blur(0px)'
        ] as string[],
        opacity: [0.8, 1, 0.8] as number[],
        transition: {
          duration: 2,
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
    overlay: 'bg-slate-50/80',
    gradient: 'from-slate-50/90 to-slate-100/70'
  },
  zinc: {
    ring: 'border-zinc-200',
    spinner: 'border-zinc-950',
    dots: 'bg-zinc-950',
    text: 'text-zinc-600',
    smallSpinner: 'text-zinc-700',
    overlay: 'bg-zinc-50/80',
    gradient: 'from-zinc-50/90 to-zinc-100/70'
  },
  neutral: {
    ring: 'border-neutral-200',
    spinner: 'border-neutral-950',
    dots: 'bg-neutral-950',
    text: 'text-neutral-600',
    smallSpinner: 'text-neutral-700',
    overlay: 'bg-neutral-50/80',
    gradient: 'from-neutral-50/90 to-neutral-100/70'
  },
  primary: {
    ring: 'border-primary/20',
    spinner: 'border-primary',
    dots: 'bg-primary',
    text: 'text-primary',
    smallSpinner: 'text-primary',
    overlay: 'bg-white/80',
    gradient: 'from-white/90 to-white/70'
  }
} as const

// 新增：環形光暈效果選項
const GLOW_EFFECTS = {
  none: '',
  soft: 'drop-shadow(0 0 3px var(--color-primary-glow))',
  medium: 'drop-shadow(0 0 5px var(--color-primary-glow))',
  strong: 'drop-shadow(0 0 8px var(--color-primary-glow))'
} as const

// 新增：Logo Spinner元素類型
const LOGOSPIN_ELEMENTS = {
  dots: {
    count: 8,
    radius: {
      xs: 14,
      sm: 24,
      md: 32,
      lg: 40,
      xl: 50
    },
    size: {
      xs: 2,
      sm: 3,
      md: 4,
      lg: 5,
      xl: 6
    }
  },
  circles: {
    count: 3,
    radiusOffset: {
      xs: [4, 8, 12],
      sm: [6, 12, 18],
      md: [8, 16, 24],
      lg: [10, 20, 30],
      xl: [12, 24, 36]
    },
    thickness: {
      xs: 1,
      sm: 1.5,
      md: 2,
      lg: 2.5,
      xl: 3
    },
    rotation: {
      speed: [12, 15, 18]
    }
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
  type?: 'ring' | 'spinner' | 'logo' | 'simple' | 'minimal' | 'overlay' | 'logoSpin';
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
  /**
   * logoSpin類型的元素風格
   */
  spinElements?: 'dots' | 'circles';
  /**
   * 是否使用漸變背景
   */
  gradient?: boolean;
  /**
   * 光暈效果強度
   */
  glow?: keyof typeof GLOW_EFFECTS;
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
 * 
 * // Logo旋轉式載入
 * <Loading type="logoSpin" size="md" animation="spin" />
 * 
 * // 光暈效果
 * <Loading glow="medium" animation="wave" />
 * 
 * // 使用漸變背景
 * <Loading fullscreen gradient text="載入資料中..." />
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
  ariaLabel = '載入中...',
  spinElements = 'dots',
  gradient = false,
  glow = 'none'
}: LoadingProps) {
  // 使用 useMemo 減少重複計算
  const themeColors = useMemo(() => COLOR_THEMES[theme], [theme]);
  const animationVariation = useMemo(() => ANIMATION_VARIATIONS[animation], [animation]);
  const defaultBackground = useMemo(
    () => {
      if (!gradient) return fullscreen ? themeColors.overlay : 'bg-transparent';
      return fullscreen ? `bg-gradient-to-br ${themeColors.gradient}` : 'bg-transparent';
    }, 
    [fullscreen, themeColors.overlay, themeColors.gradient, gradient]
  );
  const bgColor = background || defaultBackground;
  
  // 簡易Spinner模式 - 適合內聯使用
  if (type === 'simple') {
    const spinnerConfig = SVG_SPINNER_SIZES[size];
    const spinnerSize = `h-${spinnerConfig.height} w-${spinnerConfig.width}`;
                        
    return (
      <div className={cn("relative", className)} role="status" aria-label={ariaLabel}>
        <svg
          className={cn(`animate-spin ${spinnerSize}`, themeColors.smallSpinner, "transform-gpu")}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label={ariaLabel}
          role="status"
          width={spinnerConfig.size}
          height={spinnerConfig.size}
        >
          <circle
            className="opacity-15"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="32" 
            strokeDashoffset="12"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }
  
  // 極簡小型spinner - 適合按鈕等小元素
  if (type === 'minimal') {
    const dotSize = size === 'xs' ? 0.5 : 1;
    const gapSize = size === 'xs' ? 1 : 1.5;
    
    return (
      <div 
        className={cn("relative inline-flex gap-[0.25rem]", className)}
        role="status"
        aria-label={ariaLabel}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div 
            key={`dot-${index}`}
            className={cn(
              "rounded-full",
              themeColors.dots
            )}
            style={{
              width: `${dotSize}rem`,
              height: `${dotSize}rem`
            }}
            animate={{
              y: [0, -3, 0],
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1
            }}
          />
        ))}
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
              gradient ? `bg-gradient-to-br ${themeColors.gradient}` : bgColor
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: delay / 1000 }}
            role="status"
            aria-label={ariaLabel}
          >
            <div className="flex flex-col items-center gap-3">
              {/* Logo與動畫容器 */}
              <div className="relative">
                {/* 旋轉環效果 */}
                <motion.div 
                  className="absolute -inset-3"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className={cn(
                    "w-full h-full rounded-full border-2 border-dashed",
                    themeColors.spinner,
                    "opacity-30"
                  )} />
                </motion.div>
                
                {/* 主Logo */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ 
                    scale: [0.9, 1.05, 0.9],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Logo 
                    size="sm"
                    variant={logoVariant}
                    priority={logoPriority}
                    className="relative z-10"
                  />
                </motion.div>
              </div>
              
              {/* 動畫點點 */}
              <div className="flex gap-1.5 mt-2 mb-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <motion.div 
                    key={`dot-${index}`}
                    className={cn(
                      "rounded-full w-1.5 h-1.5",
                      themeColors.dots
                    )}
                    animate={{
                      y: [0, -2, 0],
                      opacity: [0.5, 1, 0.5],
                      scale: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1
                    }}
                  />
                ))}
              </div>
              
              {/* 文字 */}
              {text && (
                <motion.p
                  className={cn("text-sm font-medium", themeColors.text)}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {text}
                </motion.p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // Logo旋轉式載入 - 新增樣式
  if (type === 'logoSpin') {
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
            {/* Logo中心 */}
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
                className="transform-gpu z-10"
              />
            </motion.div>
            
            {/* 旋轉元素 - 點點版本 */}
            {spinElements === 'dots' && (
              <div className="absolute inset-0">
                {Array.from({ length: LOGOSPIN_ELEMENTS.dots.count }).map((_, index) => {
                  const angle = (index / LOGOSPIN_ELEMENTS.dots.count) * 360;
                  const radius = LOGOSPIN_ELEMENTS.dots.radius[size];
                  const dotSize = LOGOSPIN_ELEMENTS.dots.size[size];
                  
                  // 計算點的位置
                  const x = Math.cos(angle * (Math.PI / 180)) * radius;
                  const y = Math.sin(angle * (Math.PI / 180)) * radius;
                  
                  return (
                    <motion.div
                      key={`dot-${index}`}
                      className={cn(
                        'absolute rounded-full',
                        themeColors.dots
                      )}
                      style={{
                        width: `${dotSize}px`,
                        height: `${dotSize}px`,
                        left: `calc(50% + ${x}px - ${dotSize/2}px)`,
                        top: `calc(50% + ${y}px - ${dotSize/2}px)`,
                      }}
                      animate={{
                        opacity: [0.4, 1, 0.4],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: index * 0.1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  );
                })}
              </div>
            )}
            
            {/* 旋轉元素 - 同心圓版本 */}
            {spinElements === 'circles' && (
              <div className="absolute inset-0">
                {LOGOSPIN_ELEMENTS.circles.radiusOffset[size].map((offset, index) => {
                  const thickness = LOGOSPIN_ELEMENTS.circles.thickness[size];
                  const rotationSpeed = LOGOSPIN_ELEMENTS.circles.rotation.speed[index % 3];
                  
                  return (
                    <motion.div
                      key={`circle-${index}`}
                      className="absolute rounded-full border-dashed"
                      style={{
                        width: `calc(100% - ${offset*2}px)`,
                        height: `calc(100% - ${offset*2}px)`,
                        left: `${offset}px`,
                        top: `${offset}px`,
                        borderWidth: `${thickness}px`,
                        borderColor: `var(--color-primary)`,
                        opacity: 0.7 - index * 0.15,
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: rotationSpeed,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  );
                })}
              </div>
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
    );
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
            style={{ 
              filter: GLOW_EFFECTS[glow],
              WebkitFilter: GLOW_EFFECTS[glow]
            }}
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
            
            {/* 環形光暈效果 (當glow不為none時顯示) */}
            {glow !== 'none' && (
              <motion.div 
                className={cn(
                  'absolute -inset-1 rounded-full opacity-20',
                  'border border-primary/40'
                )}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
          
          {/* Logo (在logo類型或spinner類型時顯示) */}
          {(type === 'logo' || type === 'spinner') && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              variants={animationVariation.logoVariants}
              initial="initial"
              animate="animate"
              style={{ 
                filter: glow !== 'none' ? GLOW_EFFECTS[glow] : undefined,
                WebkitFilter: glow !== 'none' ? GLOW_EFFECTS[glow] : undefined
              }}
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
            <motion.p 
              className={cn(
                "text-sm font-medium tracking-wide",
                themeColors.text
              )}
              animate={glow !== 'none' ? {
                textShadow: ['0 0 0px var(--color-primary-glow)', '0 0 2px var(--color-primary-glow)', '0 0 0px var(--color-primary-glow)']
              } : undefined}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {text}
            </motion.p>
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