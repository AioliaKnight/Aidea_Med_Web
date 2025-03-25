'use client'

import { memo, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { animatedSectionVariants } from '@/utils/animations'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  suppressHydrationWarning?: boolean
}

/**
 * 共用的AnimatedSection組件
 * 用於在元素進入視窗時觸發淡入上升動畫
 */
const AnimatedSection = memo(({ 
  className = '', 
  delay = 0, 
  children, 
  suppressHydrationWarning = false 
}: AnimatedSectionProps) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  useEffect(() => {
    if (inView) {
      controls.start('animate')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      variants={animatedSectionVariants}
      initial="initial"
      animate={controls}
      custom={delay}
      className={className}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      {children}
    </motion.div>
  )
})

AnimatedSection.displayName = 'AnimatedSection'

export default AnimatedSection 