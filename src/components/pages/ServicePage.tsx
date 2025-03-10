'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { memo } from 'react'

// 從配置文件導入
import { colors } from '@/config/theme'
import { animations } from '@/config/animations'

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

// 服務數據
const coreServices: ServiceItem[] = [
  {
    id: 'brand',
    title: '品牌策略規劃',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    items: [
      '品牌定位與識別系統設計',
      '診所市場調查與分析',
      '目標客群精準定位',
      '競爭優勢分析與策略',
      '診所空間規劃與設計',
      '服務流程優化與標準化',
      '品牌故事與價值傳達'
    ],
    description: '透過專業的品牌策略規劃，建立診所獨特的市場定位與競爭優勢，打造令人印象深刻的品牌形象。'
  },
  {
    id: 'digital',
    title: '數位行銷整合',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    items: [
      'Google/Meta 精準廣告投放',
      'SEO 搜尋引擎優化策略',
      '社群媒體經營與互動',
      '內容行銷企劃與執行',
      '影音行銷策略規劃',
      '數據分析與成效優化',
      '轉換率優化與追蹤'
    ],
    description: '運用最新的數位行銷技術與策略，全方位提升診所的線上曝光度與病患轉換率。'
  },
  {
    id: 'content',
    title: '專業內容製作',
    icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
    items: [
      '診所環境專業攝影',
      '醫療團隊形象拍攝',
      '診療過程紀錄影片',
      '衛教內容影片製作',
      '社群圖文設計製作',
      '3D 虛擬診所導覽',
      '專業醫療插畫設計'
    ],
    description: '製作高品質的視覺內容，透過專業的影像呈現，展現診所的專業形象與服務特色。'
  },
  {
    id: 'operation',
    title: '營運管理優化',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    items: [
      '預約系統優化建議',
      '客戶關係管理系統',
      '員工培訓計畫制定',
      '服務流程標準化',
      '顧客回饋系統建置',
      '營運數據分析報告',
      '持續改善計畫制定'
    ],
    description: '協助診所優化營運流程，提升服務品質與效率，建立長期的競爭優勢。'
  }
]

// 服務流程數據
const serviceProcess: ProcessItem[] = [
  {
    step: 1,
    title: '免費諮詢',
    description: '了解診所現況、目標與需求，提供初步建議與規劃方向'
  },
  {
    step: 2,
    title: '深度診斷',
    description: '專業團隊進行市場分析、競爭評估與機會點發掘'
  },
  {
    step: 3,
    title: '方案規劃',
    description: '根據診斷結果，提供客製化的行銷策略與執行方案'
  },
  {
    step: 4,
    title: '執行優化',
    description: '專業團隊執行並持續監測，即時調整優化策略'
  },
  {
    step: 5,
    title: '成效追蹤',
    description: '定期提供詳細的數據分析報告，確保行銷效益最大化'
  }
]

// 價格方案數據
const pricingPlans: PricingPlan[] = [
  {
    title: '基礎方案',
    price: '$ 25,000',
    period: '/月',
    features: [
      '社群媒體經營管理',
      '每月 8 篇優質貼文',
      '基礎數據分析報告',
      '每週互動維護服務',
      '基礎 SEO 優化',
      '每月諮詢會議'
    ],
    btnText: '了解方案',
    isPopular: false
  },
  {
    title: '進階方案',
    price: '$ 45,000',
    period: '/月',
    features: [
      '社群媒體全面管理',
      '每月 15 篇精選貼文',
      'Google/Meta 廣告投放',
      '每週成效分析報告',
      '進階 SEO 優化服務',
      '24/7 專人即時服務',
      '品牌形象拍攝方案'
    ],
    btnText: '熱門推薦',
    isPopular: true
  },
  {
    title: '頂級方案',
    price: '$ 85,000',
    period: '/月',
    features: [
      '品牌策略完整規劃',
      '全方位數位行銷服務',
      '專業影音內容製作',
      '完整的數據分析系統',
      '一對一專屬顧問服務',
      '優先預約諮詢服務',
      '額外加值服務優惠'
    ],
    btnText: '聯繫我們',
    isPopular: false
  }
]

// 服務卡片組件
interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

// 使用 memo 優化子組件
const ServiceCard = memo(function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      variants={animations.fadeIn}
      initial="initial"
      animate="animate"
      whileHover={{ y: -5 }}
      className="bg-white p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300"
      role="article"
      aria-labelledby={`service-title-${service.id}`}
    >
      <div 
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center mb-4 sm:mb-6 text-white"
        style={{ background: colors.primary }}
        role="img"
        aria-label={`${service.title} 圖標`}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
        </svg>
      </div>
      <h3 
        id={`service-title-${service.id}`}
        className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4" 
        style={{ color: colors.textDark }}
      >
        {service.title}
      </h3>
      <motion.ul 
        variants={animations.stagger}
        initial="initial"
        animate="animate"
        className="space-y-2 sm:space-y-3 mb-4 sm:mb-6"
        role="list"
      >
        {service.items.map((item, idx) => (
          <motion.li 
            key={idx}
            variants={animations.slideIn}
            className="flex items-start text-sm sm:text-base text-gray-600"
          >
            <span className="mr-2 text-primary" role="presentation">•</span>
            {item}
          </motion.li>
        ))}
      </motion.ul>
      <p className="text-sm sm:text-base text-gray-600">{service.description}</p>
    </motion.div>
  )
})

// 流程步驟組件
interface ProcessStepProps {
  step: ProcessItem;
  index: number;
}

// 使用 memo 優化流程步驟組件
const ProcessStep = memo(function ProcessStep({ step, index }: ProcessStepProps) {
  return (
    <motion.div
      variants={animations.fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="relative"
      role="listitem"
      aria-label={`步驟 ${step.step}: ${step.title}`}
    >
      <div className="flex flex-col items-center text-center">
        <div 
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl sm:text-2xl font-bold mb-3 sm:mb-4"
          role="presentation"
        >
          {step.step}
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2" style={{ color: colors.textDark }}>
          {step.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
      </div>
      {index < serviceProcess.length - 1 && (
        <div 
          className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"
          role="presentation"
          aria-hidden="true"
        />
      )}
    </motion.div>
  )
})

// 價格方案組件
interface PricingPlanProps {
  plan: PricingPlan;
  index: number;
}

// 使用 memo 優化價格方案組件
const PricingPlan = memo(function PricingPlan({ plan, index }: PricingPlanProps) {
  return (
    <motion.div
      variants={animations.scaleIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className={`relative p-4 sm:p-6 md:p-8 ${
        plan.isPopular 
          ? 'bg-primary text-white transform scale-105 shadow-xl' 
          : 'bg-white text-gray-900'
      }`}
      role="article"
      aria-labelledby={`plan-title-${index}`}
    >
      {plan.isPopular && (
        <div 
          className="absolute -top-4 right-4 bg-accent text-primary px-3 py-1 text-sm font-medium rounded-full transform -translate-y-2"
          role="note"
          aria-label="熱門方案"
        >
          熱門方案
        </div>
      )}
      <h3 
        id={`plan-title-${index}`}
        className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4"
      >
        {plan.title}
      </h3>
      <div className="mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{plan.price}</span>
        <span className="text-base sm:text-lg">{plan.period}</span>
      </div>
      <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8" role="list">
        {plan.features.map((feature, idx) => (
          <li 
            key={idx}
            className="flex items-center text-sm sm:text-base"
            role="listitem"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href="/contact"
        className={`block w-full py-2 sm:py-3 px-4 sm:px-6 text-center font-medium transition-all duration-300 rounded-lg text-sm sm:text-base ${
          plan.isPopular
            ? 'bg-white text-primary hover:bg-gray-100'
            : 'bg-primary text-white hover:bg-primary-dark'
        }`}
        aria-label={`選擇 ${plan.title} 方案`}
      >
        {plan.btnText}
      </Link>
    </motion.div>
  )
})

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative bg-primary text-white py-16 sm:py-20 md:py-24 lg:py-32"
        role="banner"
      >
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto px-4 sm:px-6"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 font-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              專業的醫療行銷服務
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              為您的診所打造最適合的品牌成長策略，提供全方位的行銷解決方案
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary font-medium hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base rounded-lg"
              >
                免費諮詢
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-medium hover:bg-white hover:text-primary transition-all duration-300 text-sm sm:text-base rounded-lg"
              >
                查看方案
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 核心服務 */}
      <section 
        className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white"
        role="region"
        aria-labelledby="core-services-title"
      >
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 
              id="core-services-title"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 font-display" 
              style={{ color: colors.textDark }}
            >
              我們的核心服務
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 sm:px-6" style={{ color: colors.textLight }}>
              提供完整的醫療行銷解決方案，幫助診所建立品牌形象、提升市場競爭力
            </p>
          </motion.div>

          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6"
            role="list"
          >
            {coreServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 服務流程 */}
      <section 
        className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gray-50"
        role="region"
        aria-labelledby="service-process-title"
      >
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 
              id="service-process-title"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 font-display" 
              style={{ color: colors.textDark }}
            >
              專業服務流程
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 sm:px-6" style={{ color: colors.textLight }}>
              系統化的服務流程，確保每個環節都能達到最佳效果
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6">
            {serviceProcess.map((step, index) => (
              <ProcessStep key={step.step} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 價格方案 */}
      <section 
        id="pricing" 
        className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white"
        role="region"
        aria-labelledby="pricing-title"
      >
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 
              id="pricing-title"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 font-display" 
              style={{ color: colors.textDark }}
            >
              選擇適合的方案
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 sm:px-6" style={{ color: colors.textLight }}>
              根據診所需求提供彈性的服務方案，協助您達成行銷目標
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto px-4 sm:px-6">
            {pricingPlans.map((plan, index) => (
              <PricingPlan key={plan.title} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-16 sm:py-20 md:py-24 lg:py-32 bg-primary text-white"
        role="region"
        aria-labelledby="cta-title"
      >
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto px-4 sm:px-6"
          >
            <h2 
              id="cta-title"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6"
            >
              開始您的品牌成長之旅
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
              立即預約免費諮詢，讓我們為您打造專屬的醫療行銷策略
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary font-medium hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base rounded-lg"
              >
                預約諮詢
              </Link>
              <Link
                href="/case"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-300 text-sm sm:text-base rounded-lg"
              >
                查看案例
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 