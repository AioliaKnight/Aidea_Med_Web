'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'

interface CaseType {
  title: string
  category: string
  description: string
  image: string
  stats: Array<{
    label: string
    value: string
  }>
}

const cases: CaseType[] = [
  {
    title: '植牙中心品牌升級',
    category: '品牌升級',
    description: '協助老字號植牙中心升級品牌形象,打造專業高端的服務體驗',
    image: 'https://placehold.co/600x400/FF0000/FFFFFF/png?text=Case+1',
    stats: [
      { label: '諮詢量', value: '+180%' },
      { label: '植牙案例', value: '+150%' },
      { label: '客單價', value: '+45%' }
    ]
  },
  {
    title: '牙醫診所數位轉型',
    category: '數位行銷',
    description: '導入完整數位行銷策略,建立強大的線上品牌影響力',
    image: 'https://placehold.co/600x400/FF0000/FFFFFF/png?text=Case+2',
    stats: [
      { label: '網路諮詢', value: '+200%' },
      { label: '自費療程', value: '+120%' },
      { label: '品牌聲量', value: '+160%' }
    ]
  },
  {
    title: '連鎖牙醫診所拓展',
    category: '業績成長',
    description: '協助單店牙醫診所發展連鎖體系,實現品牌快速擴張',
    image: 'https://placehold.co/600x400/FF0000/FFFFFF/png?text=Case+3',
    stats: [
      { label: '分店數', value: '+5間' },
      { label: '營業額', value: '+300%' },
      { label: '醫師陣容', value: '+8位' }
    ]
  }
]

const categories = ['全部', '品牌升級', '數位行銷', '業績成長']

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

export default function Cases() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('全部')
  const [selectedCase, setSelectedCase] = useState<CaseType | null>(null)

  const filteredCases = activeCategory === '全部' 
    ? cases 
    : cases.filter(c => c.category === activeCategory)

  return (
    <section className="py-20 bg-gray-50" ref={ref} id="case">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-7xl mx-auto"
        >
          {/* 標題區塊 */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-red to-brand-red/80 bg-clip-text text-transparent">
              牙醫診所成功案例
            </h2>
            <p className="text-xl text-gray-600">
              實證案例分享，展現專業牙醫行銷的實力
            </p>
          </motion.div>

          {/* 分類選單 */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map(category => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeCategory === category
                    ? 'bg-brand-red text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: activeCategory === category ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* 案例卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="sync">
              {filteredCases.map((case_, index) => (
                <motion.div
                  key={case_.title}
                  variants={itemVariants}
                  layout
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedCase(case_)}
                  whileHover={{ y: -5 }}
                >
                  {/* 圖片容器 */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={case_.image}
                      alt={case_.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* 內容區塊 */}
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full mb-2">
                      {case_.category}
                    </span>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-red transition-colors">
                      {case_.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {case_.description}
                    </p>

                    {/* 成效數據 */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      {case_.stats.map((stat, i) => (
                        <div key={i} className="text-center">
                          <p className="text-2xl font-bold text-brand-red">
                            {stat.value}
                          </p>
                          <p className="text-sm text-gray-500">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* CTA 區塊 */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-brand-red text-white rounded-full hover:bg-opacity-90 transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
            >
              查看更多案例
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 