'use client'

import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import Link from 'next/link'
import Image from 'next/image'

// 動畫配置
const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// 服務特色數據
const features = [
  {
    title: 'AI 驅動分析',
    description: '運用人工智慧技術，提供精準的市場分析與行銷策略建議',
    icon: '🤖'
  },
  {
    title: '專業團隊',
    description: '擁有豐富醫療行銷經驗的跨領域專家團隊',
    icon: '👥'
  },
  {
    title: '數據導向',
    description: '以實際數據成果為導向，持續優化行銷策略',
    icon: '📊'
  },
  {
    title: '全方位服務',
    description: '從品牌定位到數位行銷，提供完整的解決方案',
    icon: '🎯'
  }
]

// 動畫區塊組件
interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

const AnimatedSection = ({ children, className = '', delay = 0 }: AnimatedSectionProps) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      controls.start('animate')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* 背景 */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary to-accent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* 背景線條 */}
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ opacity: 80 }}
          animate={{ opacity: 100 }}
          transition={{ duration: 1.2 }}
        >
          <Image
            src="/images/bgline-w.png"
            alt="背景線條"
            fill
            className="object-cover mix-blend-soft-light"
            quality={100}
            sizes="100vw"
          />
        </motion.div>
        
        {/* 內容 */}
        <div className="container-custom relative z-20 text-center text-white">
          <AnimatedSection>
            <motion.div
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.8
                  }
                }
              }}
              className="space-y-8"
            >
              <h1 className="text-7xl md:text-8xl font-black tracking-tight leading-none max-w-5xl mx-auto">
                讓您的診所
                <br />
                <span className="text-white">脫穎而出</span>
              </h1>

              <p className="text-2xl md:text-3xl font-medium text-white/90 max-w-3xl mx-auto leading-relaxed">
                專注於牙醫診所的數位行銷夥伴，
                <br className="hidden sm:block" />
                為您打造最適合的品牌成長策略
              </p>
            </motion.div>
          </AnimatedSection>
          
          {/* 按鈕群組 */}
          <AnimatedSection delay={0.4}>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
              variants={staggerChildren}
            >
              <Link
                href="/contact"
                className="btn-primary text-lg px-10 py-4 hover:bg-white hover:text-primary transition-all duration-300"
              >
                免費諮詢
              </Link>
              <Link
                href="/service"
                className="btn-outline text-lg px-10 py-4 hover:bg-white/10 transition-all duration-300"
              >
                了解服務
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

  
      {/* 數據展示區 */}
      <section className="relative py-32 bg-white overflow-hidden">
        {/* 背景線條 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/bgline-r.png"
            alt="背景線條"
            fill
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
        </motion.div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <h2 className="text-5xl font-black mb-6 text-primary">
                實際成效數據
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                透過專業的數位行銷策略，協助診所建立品牌形象、提升營收表現
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-2 gap-8">
              <AnimatedSection delay={0.2}>
                <div className="text-center">
                  <div className="text-6xl font-black text-primary mb-4">
                    <CountUp end={500} suffix="+" duration={2.5} />
                  </div>
                  <div className="text-xl text-gray-600">服務醫療院所</div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <div className="text-center">
                  <div className="text-6xl font-black text-primary mb-4">
                    <CountUp end={150} suffix="%" duration={2.5} />
                  </div>
                  <div className="text-xl text-gray-600">平均業績成長</div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Partner Section */}
      <section className="relative py-32 bg-primary text-white overflow-hidden">
        {/* 背景線條 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.12 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/bgline-w.png"
            alt="背景線條"
            fill
            className="object-cover mix-blend-soft-light"
            quality={90}
            sizes="100vw"
          />
        </motion.div>

        <div className="container-custom relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <h2 className="text-6xl md:text-7xl font-black tracking-tight leading-none">
                THE MARKETING PARTNER
                <br />
                FOR HEALTHCARE
              </h2>
              <p className="text-2xl text-white/90 leading-relaxed">
                COMPREHENSIVE BRAND INTEGRATION
                <br />
                START THE CONVERSATION
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    {/* 服務特色 */}
    <section className="relative py-32 bg-gray-50 overflow-hidden">
        {/* 背景線條 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.08 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/bgline-r.png"
            alt="背景線條"
            fill
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
        </motion.div>

        <div className="container-custom relative z-10">
          <AnimatedSection className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6 text-primary">
              我們的特色
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              結合 AI 技術與專業經驗，為您的診所打造最適合的數位行銷策略
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.2}>
                <motion.div 
                  className="bg-white p-8 hover:bg-gray-50 transition-colors duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-5xl mb-6 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 區塊 */}
      <section className="relative py-32 bg-gray-50 overflow-hidden">
        {/* 背景線條 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.08 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/bgline-r.png"
            alt="背景線條"
            fill
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
        </motion.div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-5xl font-black mb-8 text-primary leading-tight">
                準備好提升您的診所競爭力了嗎？
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                立即與我們聯繫，讓我們為您的診所打造專屬的數位行銷策略
              </p>
              <Link
                href="/contact"
                className="btn-primary text-lg px-10 py-4 hover:bg-primary/90 transition-all duration-300"
              >
                立即預約諮詢
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
} 