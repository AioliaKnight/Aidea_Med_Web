'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import { cn } from '@/lib/utils'
import Logo from './Logo'

interface LoadingProps {
  className?: string
  text?: string
  showBackground?: boolean
}

// 動畫變體
const ANIMATION_VARIANTS = {
  container: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  },
  logo: {
    initial: { 
      scale: 0.8,
      opacity: 0,
      y: 20
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  },
  rays: {
    initial: { opacity: 0 },
    animate: {
      opacity: [0.1, 0.3, 0.1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  orbit: {
    animate: (i: number) => ({
      rotate: 360,
      transition: {
        duration: 8 + i * 4,
        repeat: Infinity,
        ease: "linear"
      }
    })
  },
  orbitDot: {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  },
  ring: {
    initial: { scale: 0.8, opacity: 0 },
    animate: (i: number) => ({
      scale: [1, 1.2, 1.4],
      opacity: [0.3, 0.1, 0],
      transition: {
        duration: 2,
        delay: i * 0.3,
        repeat: Infinity,
        ease: "easeOut"
      }
    })
  },
  text: {
    initial: { 
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }
}

function Loading({
  className,
  text = 'Loading...',
  showBackground = true,
}: LoadingProps) {
  return (
    <motion.div
      variants={ANIMATION_VARIANTS.container}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-brand-red overflow-hidden',
        className
      )}
      role="alert"
      aria-label="Loading content"
    >
      <div className="relative flex flex-col items-center">
        {/* 放射狀光線 */}
        {showBackground && (
          <motion.div
            variants={ANIMATION_VARIANTS.rays}
            className="absolute inset-0"
          >
            {[...Array(12)].map((_, i) => (
              <div
                key={`ray-${i}`}
                className="absolute top-1/2 left-1/2 h-[400px] w-px bg-gradient-to-b from-white to-transparent origin-top"
                style={{
                  transform: `rotate(${i * 30}deg) translateX(-50%)`,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* 環繞軌道 */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orbit-${i}`}
            custom={i}
            variants={ANIMATION_VARIANTS.orbit}
            className="absolute rounded-full border border-white/10"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
            }}
          >
            {/* 軌道上的點 */}
            <motion.div
              variants={ANIMATION_VARIANTS.orbitDot}
              className="absolute top-0 left-1/2 w-2 h-2 -ml-1 bg-white rounded-full"
              style={{ opacity: 0.6 - i * 0.15 }}
            />
          </motion.div>
        ))}

        {/* 擴散環 */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            custom={i}
            variants={ANIMATION_VARIANTS.ring}
            className="absolute rounded-full border-2 border-white/30"
            style={{
              width: `${200 + i * 40}px`,
              height: `${200 + i * 40}px`,
            }}
          />
        ))}

        {/* Logo 容器 */}
        <motion.div
          variants={ANIMATION_VARIANTS.logo}
          className="relative transform-gpu"
        >
          {/* Logo */}
          <div className="relative z-10">
            <Logo variant="white" size="lg" showLoadingState={false} />
          </div>
        </motion.div>

        {/* 載入文字 */}
        {text && (
          <motion.p
            variants={ANIMATION_VARIANTS.text}
            className="mt-12 text-center font-bold text-white text-xl tracking-wider"
          >
            {text}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

export default memo(Loading)