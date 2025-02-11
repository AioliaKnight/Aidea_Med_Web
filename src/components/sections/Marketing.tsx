'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const textVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

// 服務內容資料
const services = [
  {
    title: '醫療傳播的頂尖轉譯者',
    subtitle: 'Medical Translator Communication',
    description: '專業醫療知識與行銷傳播的完美結合，讓複雜的醫療資訊轉化為大眾易懂的語言。',
    keywords: ['專業知識轉譯', '醫療溝通', '內容策略']
  },
  {
    title: '數據分析後的行動策略',
    subtitle: 'Data Analysis Action Strategies',
    description: '透過深度數據分析，制定精準的行銷策略，為您的診所帶來實質的成長。',
    keywords: ['數據驅動', '策略規劃', '成效追蹤']
  },
  {
    title: '品牌永續的長效價值',
    subtitle: 'Brand Sustainability Value',
    description: '建立持久的品牌價值，創造長期競爭優勢，實現永續經營的目標。',
    keywords: ['品牌建立', '價值創造', '永續發展']
  }
]

// 服務項目資料
const serviceItems = [
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2zM5 7h14v10H5V7z" />
        <path d="M15 11l-3 3-3-3" />
      </svg>
    ),
    title: '數位廣告投放',
    description: '精準投放、效益最大化'
  },
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 5l7 7-7 7M5 12h14" />
      </svg>
    ),
    title: '廣告企劃製作',
    description: '創意策略、品牌傳播'
  },
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 21v-7m0 0V7a2 2 0 012-2h12a2 2 0 012 2v7m-16 0h16" />
        <path d="M12 7v14" />
      </svg>
    ),
    title: '品牌識別重塑',
    description: '視覺設計、品牌定位'
  },
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    title: '社群內容經營',
    description: '互動經營、口碑建立'
  },
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 8a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: '數位真人客服',
    description: '即時回應、專業諮詢'
  },
  {
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: '網站SEO行銷',
    description: '搜尋優化、流量提升'
  }
]

export default function Marketing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-white overflow-hidden font-genyogothic"
    >
      {/* 背景線條 */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-[200%] bg-brand-red"
            style={{
              top: `${i * 3.5}%`,
              left: '-50%',
              rotate: '15deg',
              opacity: 0.03 - (i * 0.001),
            }}
            animate={{
              translateX: ['-50%', '0%']
            }}
            transition={{
              duration: 20 + (i % 5) * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: -i * 0.2,
            }}
          />
        ))}
      </div>

      {/* 主要內容 */}
      <div className="relative z-10 container mx-auto px-4">
        {/* 上半部標題區塊 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="min-h-[60vh] flex flex-col justify-center"
        >
          <div className="max-w-5xl">
            <motion.h2
              variants={textVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heavy text-brand-red mb-12 tracking-tight leading-tight"
            >
              COMPREHENSIVE
              <br />
              BRAND
              <br />
              INTEGRATION
            </motion.h2>

            <motion.h3
              variants={textVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-brand-red/80 mt-16 tracking-tight leading-tight"
            >
              START
              <br />
              THE CONVERSATION
              <br />
              WITH YOUR POTENTIAL
              <br />
              PATIENTS.
            </motion.h3>
          </div>
        </motion.div>

        {/* 服務卡片區塊 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="py-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="relative bg-black p-8 rounded-lg transform hover:-translate-y-2 transition-transform duration-300"
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                {/* 卡片內容 */}
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                      {service.title}
                    </h4>
                    <p className="text-white/60 text-sm mb-6">
                      {service.subtitle}
                    </p>
                    <p className="text-white/80 mb-8">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* 關鍵字標籤 */}
                  <div className="flex flex-wrap gap-2">
                    {service.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/10 text-white/90 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 裝飾線條 */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-brand-red"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ALL WE CAN DO 服務項目區塊 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="py-32"
        >
          {/* 標題 */}
          <motion.div
            variants={textVariants}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-brand-red mb-4">
              ALL WE CAN DO
            </h2>
            <p className="text-xl md:text-2xl text-gray-600">
              [ 服務項目 ]
            </p>
          </motion.div>

          {/* 服務項目網格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {serviceItems.map((item, index) => (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="group"
              >
                {/* 圖標 */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="text-brand-red transition-transform duration-300 group-hover:scale-110"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    {item.icon}
                  </motion.div>
                </div>

                {/* 標題和描述 */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>

                {/* 底部裝飾線 */}
                <motion.div
                  className="mt-4 h-0.5 bg-brand-red/20 mx-auto"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 向下箭頭指示 */}
      <motion.div
        className="absolute bottom-8 right-8 text-brand-red/40"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      </motion.div>
    </section>
  )
} 