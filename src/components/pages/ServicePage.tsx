'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { memo } from 'react'
import Image from 'next/image'
import PageHeader from '@/components/common/PageHeader'

// 從配置文件導入
import { animations } from '@/utils/animations'

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
    title: '品牌故事打造',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    items: [
      '診所品牌故事梳理與定位',
      '醫師專業形象建立與傳達',
      '獨特診療理念視覺化呈現',
      '溫暖空間規劃與體驗設計',
      '病患信任關係建立策略',
      '品牌視覺與溝通系統設計',
      '差異化競爭優勢打造'
    ],
    description: '每間診所都有獨特的故事與價值。我們深入挖掘您的專業理念與熱忱，打造能真實傳達醫療溫度的品牌形象，讓病患第一眼就能感受到您的用心與專業。'
  },
  {
    id: 'digital',
    title: '數位轉型優化',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    items: [
      '智慧預約系統優化與導入',
      '診所數位體驗流程設計',
      '線上問診前諮詢系統建置',
      '重複回診提醒自動化',
      '病患數位互動關係維護',
      '診後關懷數位化流程',
      '醫病溝通數位工具導入'
    ],
    description: '在這個數位時代，我們協助您的診所進行無縫轉型。從預約系統到病患溝通，打造既高效又不失溫度的數位化診所體驗，讓您的專業更容易觸及需要的人。'
  },
  {
    id: 'content',
    title: '內容行銷策略',
    icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
    items: [
      '醫療專業知識淺顯解說',
      '病患常見疑問圖文解析',
      '診療過程溫馨記錄影片',
      '醫師專業背景故事分享',
      '真實病例經驗分享(匿名)',
      '診所日常溫馨故事呈現',
      '衛教知識創意圖文設計'
    ],
    description: '每位醫師都是自己領域的專家，但專業知識往往需要透過故事才能觸動人心。我們協助您將深奧的醫療知識轉化為淺顯易懂的內容，與病患建立更深層的連結與信任。'
  },
  {
    id: 'operation',
    title: '全方位行銷推廣',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    items: [
      'Google/Meta 精準廣告投放',
      '在地搜尋引擎優化(SEO)',
      '社群媒體精準內容策略',
      '線上評價與口碑管理',
      '特色療程主題行銷活動',
      '醫療專業媒體曝光規劃',
      '自費診療項目轉換策略'
    ],
    description: '讓專業的醫療行銷團隊為您打理一切。從內容創作到媒體投放，從社群經營到口碑管理，我們用專業的行銷策略，讓更多有需要的病患看見您的專業，真正實現醫療價值。'
  }
]

// 服務流程數據
const serviceProcess: ProcessItem[] = [
  {
    step: 1,
    title: '傾聽您的故事',
    description: '深入了解您的診所現況、專業理念與診療特色，聆聽您的願景與挑戰'
  },
  {
    step: 2,
    title: '全面健檢評估',
    description: '專業團隊從市場定位、病患體驗到營運效能，進行全方位的診所健檢分析'
  },
  {
    step: 3,
    title: '客製成長方案',
    description: '根據您的獨特需求與目標，量身打造專屬的診所成長策略與執行計畫'
  },
  {
    step: 4,
    title: '實踐與陪伴',
    description: '專業團隊全程執行並持續追蹤，確保每一步都朝著目標前進，並即時調整優化'
  },
  {
    step: 5,
    title: '持續共同成長',
    description: '不只是短期成效，我們建立長期夥伴關係，持續為您的診所帶來穩定成長'
  }
]

// 價格方案數據
const pricingPlans: PricingPlan[] = [
  {
    title: '品牌啟航方案',
    price: '$ 88,000',
    period: '/月',
    features: [
      '診所品牌定位與故事梳理',
      '每月12篇專業內容創作',
      '社群媒體經營與互動',
      '基礎在地SEO優化',
      '每週診所數據健檢報告',
      '醫師個人品牌經營指導',
      '專屬客戶經理每週追蹤'
    ],
    btnText: '了解方案',
    isPopular: false
  },
  {
    title: '全面成長方案',
    price: '$ 168,000',
    period: '/月',
    features: [
      '全方位品牌策略與執行',
      '每月20篇深度專業內容',
      'Google/Meta精準廣告投放',
      '專業診所環境攝影',
      '每週成效報告與策略調整',
      '自費項目轉換率優化',
      '專屬顧問團隊即時服務',
      '診所數位體驗全面升級'
    ],
    btnText: '熱門推薦',
    isPopular: true
  },
  {
    title: '卓越突破方案',
    price: '$ 258,000',
    period: '/月',
    features: [
      '頂級品牌戰略全面規劃',
      '無限量專業內容創作',
      '多平台整合行銷策略',
      '專業影音團隊駐點拍攝',
      '創始人級顧問一對一服務',
      '獨家AI病患分析系統',
      '策略長季度診所發展規劃',
      '醫療產業資源整合對接'
    ],
    btnText: '預約洽談',
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
      className="bg-white p-6 md:p-8 border-0 shadow-none hover:shadow-sm transition-all duration-300"
      role="article"
      aria-labelledby={`service-title-${service.id}`}
    >
      <div 
        className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-6 text-white rounded-none bg-brand-primary"
        role="img"
        aria-label={`${service.title} 圖標`}
      >
        <svg
          className="w-5 h-5 md:w-7 md:h-7"
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
        className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-brand-textDark"
      >
        {service.title}
      </h3>
      <motion.ul 
        variants={animations.stagger}
        initial="initial"
        animate="animate"
        className="space-y-2 md:space-y-3 mb-4 md:mb-6"
        role="list"
      >
        {service.items.map((item, idx) => (
          <motion.li 
            key={idx}
            variants={animations.slideIn}
            className="flex items-start text-sm md:text-base text-gray-600"
          >
            <span className="mr-2 text-primary" role="presentation">•</span>
            {item}
          </motion.li>
        ))}
      </motion.ul>
      <p className="text-sm md:text-base text-gray-600">{service.description}</p>
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
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl md:text-2xl font-bold mb-3 md:mb-4"
          role="presentation"
        >
          {step.step}
        </div>
        <h3 className="text-base md:text-lg font-bold mb-2 text-brand-textDark">
          {step.title}
        </h3>
        <p className="text-sm md:text-base text-gray-600">{step.description}</p>
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
      className={`relative p-6 md:p-8 rounded-none ${
        plan.isPopular 
          ? 'bg-primary text-white transform scale-100 shadow-none' 
          : 'bg-white text-gray-900'
      }`}
      role="article"
      aria-labelledby={`plan-title-${index}`}
    >
      {plan.isPopular && (
        <div 
          className="absolute -top-4 right-4 bg-accent text-white px-4 py-1 text-sm font-medium rounded-none"
          role="note"
          aria-label="熱門方案"
        >
          熱門方案
        </div>
      )}
      <h3 
        id={`plan-title-${index}`}
        className="text-xl md:text-2xl font-bold mb-3 md:mb-4"
      >
        {plan.title}
      </h3>
      <div className="mb-4 md:mb-6">
        <span className="text-2xl md:text-3xl font-bold">{plan.price}</span>
        <span className="text-base md:text-lg">{plan.period}</span>
      </div>
      <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8" role="list">
        {plan.features.map((feature, idx) => (
          <li 
            key={idx}
            className="flex items-center text-sm md:text-base"
            role="listitem"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0"
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
        className={`block w-full py-2 md:py-3 px-4 md:px-6 text-center font-medium transition-all duration-300 rounded-lg text-sm md:text-base ${
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
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
            我們的優勢
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            專注於醫療行銷的<span className="text-primary">專業團隊</span>
          </h2>
          <p className="text-lg text-gray-600">
            我們深知醫療行業的獨特性與挑戰。十年以上的醫療行銷經驗，讓我們能精準理解診所與病患的需求，提供真正有效的解決方案。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">深刻理解醫療產業</h3>
            <p className="text-gray-600">
              我們不只是行銷團隊，更是醫療產業的深度觀察者與參與者。我們了解各類診所的運作邏輯、醫病關係的建立、診療項目的特色，能從醫師與病患雙方視角提供最適切的建議。
            </p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">兼顧專業與溫度</h3>
            <p className="text-gray-600">
              醫療行銷最大的挑戰是如何在傳達專業的同時保持溫度。我們精通如何將艱澀的醫療知識轉化為溫暖易懂的內容，既能展現醫師專業，又能拉近與病患的距離，建立信任關係。
            </p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">數據驅動成效</h3>
            <p className="text-gray-600">
              我們不只是執行行銷活動，更重視實際成效與投資回報。透過專業的數據分析工具與方法，持續追蹤並優化每個行銷環節，確保每一分行銷預算都能發揮最大效益，為診所帶來實質成長。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// 列表項渲染函數，添加圓形
function renderListItem(text: string, _idx: number) {
  return (
    <li key={_idx} className="flex items-center mb-2">
      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3">
        <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-gray-800">{text}</span>
    </li>
  );
}

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHeader
        title="專業的醫療行銷服務"
        description="為您的診所打造最適合的品牌成長策略，提供全方位的行銷解決方案"
        variant="red"
        size="lg"
        alignment="center"
        backgroundImage="/images/bgline-r.png"
        overlayOpacity={0.8}
      />
      
      <div className="bg-gradient-to-r from-primary to-primary/70 py-6">
        <div className="container-custom">
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
              查看服務方案
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* 醫療市場統計數據區 */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-5xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              面對醫療市場的更迭速度
            </h2>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
              你準備好了嗎？
            </h2>
            <motion.div
              className="w-24 h-1 bg-primary mx-auto mb-10"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            ></motion.div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
              市場競爭加劇 - 供給持續增長 - 診所差異減少
            </h3>
            <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
              根據衛生福利部統計調查，近年來台灣牙醫診所與牙醫師數量呈現<span className="font-bold">快速增長</span>趨勢，
              而高達<span className="font-bold text-primary">80.81%</span>的牙醫師集中在六都地區，市場競爭日趨白熱化。
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* 診所數量統計卡片 */}
            <motion.div 
              className="bg-white p-6 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-5 text-primary border-b pb-2">台灣牙醫診所數量</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <div className="bg-black text-white py-2 px-3 text-sm">2021年</div>
                  <div className="text-3xl font-bold">6,922<span className="text-lg ml-1">間</span></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="bg-black text-white py-2 px-3 text-sm">2022年</div>
                  <div className="text-3xl font-bold">6,969<span className="text-lg ml-1">間</span></div>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2">
                  <div className="font-medium text-sm">年度增長率</div>
                  <div className="text-xl font-bold text-primary">0.68%</div>
                </div>
              </div>
            </motion.div>

            {/* 牙醫師數量統計卡片 */}
            <motion.div 
              className="bg-white p-6 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-5 text-primary border-b pb-2">台灣牙醫師人數</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <div className="bg-black text-white py-2 px-3 text-sm">2020年</div>
                  <div className="text-3xl font-bold">15,429<span className="text-lg ml-1">位</span></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="bg-black text-white py-2 px-3 text-sm">2022年</div>
                  <div className="text-3xl font-bold">16,668<span className="text-lg ml-1">位</span></div>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2">
                  <div className="font-medium text-sm">年度增長率</div>
                  <div className="text-xl font-bold text-primary">5.11%</div>
                </div>
              </div>
            </motion.div>

            {/* 牙醫師分布統計卡片 */}
            <motion.div 
              className="bg-white p-6 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-5 text-primary border-b pb-2">牙醫師分布情況</h3>
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg">六都地區</div>
                <div className="text-4xl font-bold text-primary">80.81%</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-lg">每十萬人口牙醫師數</div>
                <div className="text-4xl font-bold">71.1<span className="text-lg ml-1">位</span></div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>地區分布嚴重不均，都會區牙醫資源過剩，競爭激烈</p>
              </div>
            </motion.div>

            {/* 市場趨勢分析卡片 */}
            <motion.div 
              className="bg-white p-6 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-5 text-primary border-b pb-2">市場趨勢分析</h3>
              <ul className="space-y-3 text-sm md:text-base">
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-2">→</span>
                  <span>牙醫師成長率遠高於診所成長率</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-2">→</span>
                  <span>預計2030年牙醫師供給將超過需求</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-2">→</span>
                  <span>診所經營成本上升，利潤空間受擠壓</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-2">→</span>
                  <span>品牌差異化將成為關鍵競爭因素</span>
                </li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            className="bg-primary text-white p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">患者沒變、牙醫卻越來越多！</h3>
            <h4 className="text-xl md:text-2xl font-medium mb-6">為什麼患者要選擇你的診所？</h4>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              在供過於求的市場中，如何建立獨特品牌定位，提升診所競爭力，成為患者的首選，是每家診所必須面對的挑戰。
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-primary font-bold hover:bg-gray-100 transition-all duration-300 text-lg"
            >
              立即預約免費診所競爭力評估
            </Link>
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
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 font-display text-brand-textDark"
            >
              我們的核心服務
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 sm:px-6 text-brand-textLight">
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
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 font-display text-brand-textDark"
            >
              專業服務流程
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 sm:px-6 text-brand-textLight">
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
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 font-display text-brand-textDark"
            >
              選擇適合的方案
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 sm:px-6 text-brand-textLight">
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

      {/* Service Feature Section */}
      <ServiceFeature />
    </div>
  )
} 