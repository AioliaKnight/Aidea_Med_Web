'use client'

import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useScroll as useScrollContext } from '@/contexts/ScrollContext'
import { useEffect } from 'react'

export default function ScrollPrompt() {
  const { scrollProgress } = useScrollContext()
  const scrollProgressMotion = useMotionValue(0)
  
  useEffect(() => {
    scrollProgressMotion.set(scrollProgress)
  }, [scrollProgress, scrollProgressMotion])

  const opacity = useTransform(scrollProgressMotion, [0, 10], [1, 0])

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
    >
      <motion.div
        className="flex flex-col items-center gap-2 text-white/60 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          const nextSection = document.getElementById('services')
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      >
        <span className="text-sm">Scroll</span>
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ↓
        </motion.div>
      </motion.div>
    </motion.div>
  )
} 