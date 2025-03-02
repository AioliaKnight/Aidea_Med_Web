'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// 定義資料類型
interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  items: string[];
  description: string;
}

interface ProcessItem {
  step: number;
  title: string;
  description: string;
}

interface PricingPlan {
  title: string;
  price: string;
  period: string;
  features: string[];
  btnText: string;
  isPopular: boolean;
}

// 主要品牌色系
const colors = {
  primary: '#E61E25', // 品牌紅色
  secondary: '#111111', // 深黑色
  light: '#FFFFFF', // 白色
  gray: '#F2F2F2', // 淺灰色背景
  textDark: '#333333', // 深色文字
  textLight: '#666666', // 淺色文字
}

// 服務數據
const coreServices: ServiceItem[] = [
  {
    id: 'brand',
    title: '品牌策略規劃',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    items: [
      '品牌定位與識別',
      '目標客群分析',
      '競爭優勢分析',
      '診所環境空間規劃',
      '服務流程優化建議'
    ],
    description: '建立獨特的診所品牌形象，提升市場競爭力'
  },
  {
    id: 'digital',
    title: '數位行銷整合',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    items: [
      'Google/Meta 廣告投放',
      'SEO 搜尋引擎優化',
      '社群媒體行銷策略',
      '內容行銷規劃',
      '成效追蹤與優化'
    ],
    description: '全方位數位行銷策略，提升診所線上能見度'
  },
  {
    id: 'content',
    title: '專業內容製作',
    icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
    items: [
      '診所環境攝影',
      '醫療團隊形象照',
      '衛教影片製作',
      '社群內容設計',
      '3D 診所環境建模'
    ],
    description: '高質量的視覺內容，展現診所專業形象'
  }
]

// 服務流程數據
const serviceProcess: ProcessItem[] = [
  {
    step: 1,
    title: '需求訪談',
    description: '深入了解診所現況與目標'
  },
  {
    step: 2,
    title: '方案規劃',
    description: '客製化行銷策略提案'
  },
  {
    step: 3,
    title: '執行優化',
    description: '專業團隊執行並持續監測調整'
  },
  {
    step: 4,
    title: '成效報告',
    description: '定期提供詳細數據分析報告'
  }
]

// 價格方案數據
const pricingPlans: PricingPlan[] = [
  {
    title: '基礎方案',
    price: '$150,000',
    period: '/月',
    features: [
      '社群媒體經營',
      '每月 4 篇貼文',
      '基礎成效報告',
      '每週互動維護'
    ],
    btnText: '選擇方案',
    isPopular: false
  },
  {
    title: '進階方案',
    price: '$250,000',
    period: '/月',
    features: [
      '社群媒體全管理',
      '每月 10 篇貼文',
      '廣告投放服務',
      '每週成效報告',
      '24/7 專人服務'
    ],
    btnText: '選擇方案',
    isPopular: true
  },
  {
    title: '客製方案',
    price: '聯繫洽詢',
    period: '',
    features: [
      '品牌策略規劃',
      '全方位行銷服務',
      '客製化執行方案',
      '一對一專屬服務'
    ],
    btnText: '預約諮詢',
    isPopular: false
  }
]

// 服務卡片組件
interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-md p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
    >
      <div 
        className="w-14 h-14 rounded-md flex items-center justify-center mb-6 text-white"
        style={{ background: colors.primary }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-4" style={{ color: colors.secondary }}>{service.title}</h3>
      <ul className="space-y-3 mb-6">
        {service.items.map((item, idx) => (
          <li key={idx} className="flex items-start text-gray-600">
            <span 
              className="w-2 h-2 rounded-sm flex-shrink-0 mt-2 mr-3"
              style={{ background: colors.primary }}
            ></span>
            <span style={{ color: colors.textLight }}>{item}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm mb-5" style={{ color: colors.textLight }}>
        {service.description}
      </p>
      <motion.div 
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <button
          className="text-base font-medium inline-flex items-center group transition-colors duration-300"
          style={{ color: colors.primary }}
        >
          了解更多 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

// 流程步驟組件
interface ProcessStepProps {
  step: ProcessItem;
  index: number;
}

function ProcessStep({ step, index }: ProcessStepProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      className="relative px-6"
    >
      <div className="text-center bg-white p-6 rounded-md border border-gray-100 shadow-sm">
        <div 
          className="w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white"
          style={{ background: colors.primary }}
        >
          {step.step}
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: colors.secondary }}>{step.title}</h3>
        <p style={{ color: colors.textLight }}>
          {step.description}
        </p>
      </div>
      {index < serviceProcess.length - 1 && (
        <div className="hidden md:block absolute top-1/2 right-0 w-8 h-1 -translate-y-1/2" style={{ background: colors.gray }}>
          <div className="absolute right-0 top-1/2 w-2 h-2 rounded-sm -translate-y-1/2" style={{ background: colors.primary }}></div>
        </div>
      )}
    </motion.div>
  )
}

// 價格方案組件
interface PricingPlanProps {
  plan: PricingPlan;
  index: number;
}

function PricingPlan({ plan, index }: PricingPlanProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`rounded-md p-8 transition-all duration-300 ${
        plan.isPopular 
          ? 'bg-white border-2 border-gray-200 transform scale-105 shadow-md' 
          : 'bg-white border border-gray-100'
      }`}
    >
      {plan.isPopular && (
        <div 
          className="inline-block px-4 py-1 rounded-sm text-sm font-semibold mb-4 text-white"
          style={{ background: colors.primary }}
        >
          最受歡迎
        </div>
      )}
      <h3 className="text-xl font-bold mb-4" style={{ color: colors.secondary }}>{plan.title}</h3>
      <div className="text-3xl font-bold mb-6">
        <span style={{ color: colors.primary }}>{plan.price}</span>
        <span className="text-sm font-normal ml-1" style={{ color: colors.textLight }}>{plan.period}</span>
      </div>
      <div className="w-full h-px mb-6" style={{ background: colors.gray }}></div>
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <svg className="w-5 h-5 flex-shrink-0 mr-2" style={{ color: colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span style={{ color: colors.textLight }}>{feature}</span>
          </li>
        ))}
      </ul>
      <motion.button 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-md font-medium transition-all duration-300 ${
          plan.isPopular
            ? 'text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
        style={plan.isPopular ? { background: colors.primary } : { color: colors.secondary }}
      >
        {plan.btnText}
      </motion.button>
    </motion.div>
  )
}

// 服務特色部分
function ServiceFeature() {
  const features = [
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: '專業團隊',
      description: '擁有多年牙醫行銷經驗的專業團隊，了解產業特性與需求'
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: '高效執行',
      description: '迅速部署行銷策略，讓您的診所立即提升競爭力'
    },
    {
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      title: '數據驅動',
      description: '透過數據分析，持續優化行銷策略，提升投資報酬率'
    }
  ]
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="rounded-md mb-24 px-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="bg-white p-8 rounded-md border border-gray-100 shadow-sm"
          >
            <div 
              className="w-12 h-12 rounded-md flex items-center justify-center mb-4 text-white"
              style={{ background: colors.primary }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: colors.secondary }}>{feature.title}</h3>
            <p style={{ color: colors.textLight }}>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function ServicePage() {
  return (
    <main className="min-h-screen py-20" style={{ background: colors.light }}>
      <div className="container mx-auto px-4">
        {/* 頁面標題 */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-6 font-display"
          style={{ color: colors.secondary }}
        >
          專業服務項目
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-center max-w-2xl mx-auto mb-10 font-tw"
          style={{ color: colors.textLight }}
        >
          我們提供全方位的牙醫診所行銷解決方案，從品牌策略到數位行銷，協助您的診所在競爭市場中脫穎而出。
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-16 h-1 mx-auto mb-16" 
          style={{ background: colors.primary }}
        ></motion.div>

        {/* 服務特色 */}
        <ServiceFeature />

        {/* 服務卡片區域 */}
        <div className="mb-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6 font-display"
            style={{ color: colors.secondary }}
          >
            核心服務
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-16 h-1 mx-auto mb-12" 
            style={{ background: colors.primary }}
          ></motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {coreServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* 服務流程 */}
        <div className="mb-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6 font-display"
            style={{ color: colors.secondary }}
          >
            服務流程
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-16 h-1 mx-auto mb-12" 
            style={{ background: colors.primary }}
          ></motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
          {serviceProcess.map((step, index) => (
            <ProcessStep key={step.step} step={step} index={index} />
          ))}
        </div>

        {/* 服務方案 */}
        <div className="mb-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6 font-display"
            style={{ color: colors.secondary }}
          >
            服務方案
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-16 h-1 mx-auto mb-12" 
            style={{ background: colors.primary }}
          ></motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {pricingPlans.map((plan, index) => (
            <PricingPlan key={plan.title} plan={plan} index={index} />
          ))}
        </div>

        {/* CTA 區域 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-white rounded-md p-12 text-center shadow-sm border border-gray-100"
        >
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8 }}
            className="h-1 mx-auto mb-10" 
            style={{ background: colors.primary }}
          ></motion.div>
          
          <h2 className="text-3xl font-bold mb-6 font-display" style={{ color: colors.secondary }}>
            開始您的診所數位轉型之旅
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-tw" style={{ color: colors.textLight }}>
            立即與我們聯繫，了解如何為您的診所打造最適合的行銷策略
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/contact">
                <span className="inline-block text-white px-8 py-3 rounded-md text-lg font-medium hover:opacity-90 transition-opacity shadow-sm" style={{ background: colors.primary }}>
                  預約免費諮詢
                </span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/case">
                <span className="inline-block border text-gray-700 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors" style={{ borderColor: colors.gray }}>
                  查看成功案例
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  )
} 