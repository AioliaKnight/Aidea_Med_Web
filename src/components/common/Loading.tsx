'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import { cn } from '@/lib/utils'

// 動畫配置常量
const getAnimationConfig = (duration: number) => ({
  SPINNER: {
    duration,
    ease: 'linear',
    repeat: Infinity
  },
  PULSE: {
    duration,
    ease: 'easeInOut',
    repeat: Infinity
  },
  FADE: {
    duration: 0.3,
    ease: 'easeInOut'
  }
}) as const

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

// 動畫變體
const getSpinnerVariants = (duration: number) => ({
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: getAnimationConfig(duration).SPINNER
  }
})

const getPulseVariants = (duration: number) => ({
  initial: { opacity: 0.7 },
  animate: {
    opacity: 1,
    transition: getAnimationConfig(duration).PULSE
  }
})

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: getAnimationConfig(0.3).FADE
}

const textVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: getAnimationConfig(0.3).FADE
}

interface LoadingProps {
  /** 是否全螢幕顯示 */
  fullscreen?: boolean
  /** 載入文字 */
  text?: string
  /** 是否模糊背景 */
  blur?: boolean
  /** 自定義類名 */
  className?: string
  /** 動畫持續時間 (秒) */
  duration?: number
  /** 尺寸 */
  size?: keyof typeof CONTAINER_SIZES
  /** 顏色 */
  color?: string
  /** 是否顯示脈衝動畫 */
  pulse?: boolean
}

export default function Loading({
  fullscreen = false,
  text,
  blur = false,
  className,
  duration = 1.5,
  size = 'md',
  color = 'currentColor',
  pulse = true
}: LoadingProps) {
  const spinnerVariants = getSpinnerVariants(duration)
  const pulseVariants = getPulseVariants(duration)

  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        aria-live="assertive"
        aria-busy="true"
        className={cn(
          'flex flex-col items-center justify-center gap-4',
          fullscreen && 'fixed inset-0 z-50',
          blur && 'backdrop-blur-sm',
          className
        )}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className={cn(
            'relative flex items-center justify-center',
            CONTAINER_SIZES[size]
          )}
          variants={spinnerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full border-2 border-current/40',
              pulse && 'animate-pulse'
            )}
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            style={{ borderColor: color }}
          />
          <Logo size={LOGO_SIZES[size]} showAnimation={false} />
        </motion.div>

        {text && (
          <motion.p
            className="text-sm font-medium"
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {text}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}