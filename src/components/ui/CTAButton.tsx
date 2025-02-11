'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CTAButtonProps {
  className?: string
  onClick?: () => void
  disabled?: boolean
  text?: string
}

export default function CTAButton({
  className,
  onClick,
  disabled = false,
  text = '預約線上諮詢',
}: CTAButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    if (!disabled) {
      setIsClicked(!isClicked)
      onClick?.()
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative h-[40px] flex items-center',
        'focus:outline-none focus-visible:ring-2',
        'focus-visible:ring-brand-red focus-visible:ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={text}
    >
      {/* A: 標誌 */}
      <div className="relative w-[40px] h-[40px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={isClicked ? 'red' : 'white'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={isClicked ? '/cta-r.png' : '/cta-w.png'}
              alt="A:"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 展開的文字區塊 */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isHovered ? 'auto' : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut'
        }}
        className="overflow-hidden"
      >
        <div className="whitespace-nowrap bg-black text-white px-4 h-[40px] flex items-center rounded-r-md">
          <span className="text-sm font-medium">{text}</span>
        </div>
      </motion.div>
    </motion.button>
  )
} 