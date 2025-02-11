'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// 標籤列表
const tags = ['#AI', '#Creativity', '#Design Thinking', '#Insight']

// 數據統計
const stats = [
  {
    title: '累積服務醫療院所',
    value: '500',
    unit: '間',
    direction: '↑'
  },
  {
    title: '為診所提升自費患者',
    value: '150',
    unit: '位',
    direction: '↑'
  }
]

// 動畫變體
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
}

const curveVariants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: {
      duration: 2,
      ease: 'easeInOut'
    }
  }
}

// 樣式系統
const styles = {
  section: 'relative min-h-screen bg-brand-red overflow-hidden',
  container: 'relative container mx-auto px-4 h-screen flex items-center',
  content: {
    wrapper: 'grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-7xl mx-auto w-full',
    left: 'space-y-12',
    right: 'grid grid-cols-2 gap-8'
  },
  heading: {
    wrapper: 'space-y-6',
    main: {
      zh: 'text-5xl md:text-6xl lg:text-7xl font-heavy text-white leading-[1.15] tracking-tight mb-4',
      en: 'text-3xl md:text-4xl lg:text-5xl text-white/80 font-medium leading-tight tracking-wide'
    }
  },
  tags: {
    wrapper: 'flex flex-wrap gap-4',
    item: 'px-6 py-2 rounded-full text-base tracking-wide bg-white/[0.05] text-white/80'
  },
  stats: {
    wrapper: 'text-center flex flex-col items-center',
    value: {
      wrapper: 'flex items-baseline mb-3',
      number: 'text-[80px] md:text-[96px] font-heavy tracking-tight text-white leading-none',
      unit: 'text-[32px] md:text-[40px] font-medium ml-2 text-white leading-none',
      direction: 'text-[32px] md:text-[40px] font-medium text-white leading-none ml-1'
    },
    label: 'text-base text-white/60 font-normal whitespace-nowrap'
  },
  background: {
    wrapper: 'absolute inset-0 overflow-hidden',
    curves: 'absolute inset-0'
  }
}

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className={styles.section}>
      {/* 背景動畫 */}
      <div className={styles.background.wrapper}>
        <motion.div
          className={styles.background.curves}
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
      <div className={styles.container}>
        <div className={styles.content.wrapper}>
          {/* 左側內容 */}
          <div className={styles.content.left}>
            <motion.div
              className={styles.heading.wrapper}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.8 }}
            >
              <h1>
                <div className={styles.heading.main.zh}>
                  數位精準驅動
                  <br />
                  專為真實醫療服務
                </div>
                <div className={styles.heading.main.en}>
                  Digital precision-driven,
                  <br />
                  tailored for authentic
                  <br />
                  healthcare services.
                </div>
              </h1>
            </motion.div>

            {/* 標籤雲 */}
            <motion.div
              className={styles.tags.wrapper}
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  className={styles.tags.item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.8 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + index * 0.1
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* 右側數據 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 mt-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                className={styles.stats.wrapper}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{
                  duration: 0.8,
                  delay: 0.8 + index * 0.2
                }}
              >
                <div className={styles.stats.value.wrapper}>
                  <span className={styles.stats.value.number}>
                    {stat.value}
                  </span>
                  <span className={styles.stats.value.unit}>
                    {stat.unit}
                  </span>
                  {stat.direction && (
                    <span className={styles.stats.value.direction}>
                      {stat.direction}
                    </span>
                  )}
                </div>
                <div className={styles.stats.label}>
                  {stat.title}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 