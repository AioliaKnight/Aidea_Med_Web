'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import CTAButton from '../ui/CTAButton'

const tags = [
  'AI',
  'Creativity',
  'Design Thinking',
  'Insight'
]

const stats = [
  {
    value: '500',
    label: '間',
    sublabel: '累積服務醫療院所'
  },
  {
    value: '150',
    label: '位',
    sublabel: '為診所提升自費病患'
  }
]

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen bg-brand-red overflow-hidden">
      {/* 背景動畫 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          {/* 曲線背景 */}
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[1px] w-[200%] bg-white/[0.02]"
              style={{
                top: `${i * 2.5}%`,
                left: '-50%',
                transform: 'rotate(12deg)',
              }}
              animate={{
                translateX: ['-30%', '0%']
              }}
              transition={{
                duration: 25 + (i % 7) * 2,
                repeat: Infinity,
                ease: 'linear',
                delay: -i * 0.1,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* 主要內容 */}
      <div className="relative container mx-auto px-4 h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-7xl mx-auto w-full">
          {/* 左側內容 */}
          <div className="space-y-12">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heavy text-white leading-[1.15] tracking-tight">
                數位精準驅動
                <br />
                專為真實醫療服務
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-white/60 font-medium leading-relaxed tracking-wide">
                Digital precision-driven,
                <br />
                tailored for authentic
                <br />
                healthcare services.
              </p>
            </motion.div>

            {/* 標籤雲 */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  className={cn(
                    'px-6 py-2 rounded-full text-base tracking-wide',
                    'bg-white/[0.05] text-white/80'
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.8 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + index * 0.1
                  }}
                >
                  #{tag}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA 按鈕 */}
            <motion.div
              className="pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <CTAButton text="預約線上諮詢" />
            </motion.div>
          </div>

          {/* 右側數據 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-white text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{
                  duration: 0.8,
                  delay: 0.8 + index * 0.2
                }}
              >
                <div className="mb-2 flex items-baseline justify-center">
                  <span className="text-6xl lg:text-7xl font-heavy tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-3xl lg:text-4xl font-medium ml-2">
                    {stat.label}
                  </span>
                </div>
                <div className="text-sm text-white/50">
                  {stat.sublabel}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 