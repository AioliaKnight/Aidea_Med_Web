'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import { cn } from '@/lib/utils'

// 動畫配置常量
const ANIMATION_CONFIG = {
  LOGO: {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  },
  RING: {
    duration: 1.2,
    repeat: Infinity,
    ease: "linear"
  },
  FADE: {
    duration: 0.3,
    ease: "easeOut"
  }
} as const

// 容器尺寸預設值
const CONTAINER_SIZES = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32'
} as const

// Logo 尺寸預設值
const LOGO_SIZES = {
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

// 動畫變體
const containerVariants = {
  initial: { 
    opacity: 0,
  },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
}

const logoVariants = {
  initial: { 
    scale: 0.95,
    opacity: 0.8
  },
  animate: { 
    scale: 1,
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.LOGO.duration,
      repeat: ANIMATION_CONFIG.LOGO.repeat,
      repeatType: ANIMATION_CONFIG.LOGO.repeatType,
      ease: ANIMATION_CONFIG.LOGO.ease
    }
  }
}

const ringVariants = {
  initial: { 
    rotate: 0,
    opacity: 0
  },
  animate: { 
    rotate: 360,
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.RING.duration,
      ease: ANIMATION_CONFIG.RING.ease,
      repeat: ANIMATION_CONFIG.RING.repeat
    }
  }
}

const textVariants = {
  initial: { 
    opacity: 0,
    y: 4
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}

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
  type?: 'ring' | 'spinner' | 'dots' | 'logo';
  /**
   * 自定義類名
   */
  className?: string;
  /**
   * 背景顏色
   */
  background?: string;
}

export default function Loading({
  fullscreen = false,
  text,
  blur = false,
  className,
  size = 'md',
  theme = 'slate',
  background = 'bg-background/80'
}: LoadingProps) {
  const colors = COLOR_THEMES[theme]

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
        variants={containerVariants}
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
            variants={ringVariants}
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
          
          {/* Logo */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            variants={logoVariants}
            initial="initial"
            animate="animate"
          >
            <Logo 
              size={LOGO_SIZES[size]}
              variant="black"
            />
          </motion.div>
        </div>

        {/* 載入文字 */}
        {text && (
          <motion.div
            className="flex flex-col items-center gap-3"
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            <p className={cn(
              "text-sm font-medium tracking-wide",
              colors.text
            )}>
              {text}
            </p>
            <div className="flex gap-1.5">
              {[0, 0.15, 0.3].map((delay, index) => (
                <motion.span
                  key={index}
                  className={cn(
                    "w-1 h-1 rounded-full",
                    colors.dots
                  )}
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}