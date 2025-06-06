'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { memo } from 'react'
import Image from 'next/image'
import { PageHeader, CTASection } from '@/components/common'
import { Heading, Button } from '@/components/ui'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { ContactFormData, FormResponse } from '@/types/form'

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
    price: '$ 108,000',
    period: '/月',
    features: [
      '診所品牌定位與故事梳理',
      '每月4篇專業內容創作',
      '社群媒體經營與互動',
      '基礎在地SEO優化',
      '每週診所數據健檢報告',
      '醫師個人品牌經營指導',
      '專屬客戶經理每月追蹤'
    ],
    btnText: '了解方案',
    isPopular: false
  },
  {
    title: '全面成長方案',
    price: '$ 198,000',
    period: '/月',
    features: [
      '全方位品牌戰略規劃執行',
      '每月8篇深度專業內容創作',
      'Google/Meta精準廣告投放',
      '專業診所環境攝影與影片',
      '每週成效分析與策略調整',
      '自費項目轉換率優化',
      '專屬顧問團隊即時服務',
      '數位客戶體驗全面升級'
    ],
    btnText: '熱門推薦',
    isPopular: true
  },
  {
    title: '卓越突破方案',
    price: '$ 398,000',
    period: '/月',
    features: [
      '頂級品牌戰略全面規劃',
      '專業社群代操與內容創作',
      '多平台整合行銷策略',
      '專業影音團隊拍攝製作',
      '產業實戰級顧問一對一服務',
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
        className="text-sm xs:text-base sm:text-lg md:text-xl font-bold mb-3 md:mb-4 text-brand-textDark whitespace-nowrap overflow-hidden text-ellipsis"
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
      variants={{
        hidden: { opacity: 0, x: -10 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0.5, delay: index * 0.1 }
        }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative z-10"
      role="listitem"
    >
      <div className="bg-white flex h-full rounded-lg border-l-4 border-primary pl-4 py-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="w-10 h-10 bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0 rounded-full">
          {step.step}
        </div>
        <div className="ml-4">
          <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">
            {step.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
        </div>
        
        {/* 手機版流程指示器 */}
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full sm:hidden"></div>
      </div>
      
      {/* 連接線 - 手機版 */}
      {index < serviceProcess.length - 1 && (
        <motion.div
          className="absolute top-full left-0 h-6 w-1 bg-gradient-to-b from-primary to-primary/30 sm:hidden rounded-full"
          initial={{ height: 0 }}
          whileInView={{ height: 24 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.3 }}
          role="presentation"
          aria-hidden="true"
        />
      )}
      
      {/* 連接線 - 桌面版 */}
      {index < serviceProcess.length - 1 && (
        <div
          className="absolute bottom-0 left-5 h-[calc(100%-40px)] w-1 bg-gray-100 z-0 hidden sm:block"
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
      variants={{
        initial: { opacity: 0, y: 30, scale: 0.95 },
        animate: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { duration: 0.5, delay: index * 0.1 }
        }
      }}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className={`relative p-6 sm:p-8 border rounded-md ${
        plan.isPopular 
          ? 'bg-primary text-white border-primary shadow-md' 
          : 'bg-white text-gray-900 border-gray-100 shadow-sm'
      } transition-all duration-300`}
      role="article"
      aria-labelledby={`plan-title-${index}`}
    >
      {plan.isPopular && (
        <div 
          className="absolute -top-3 right-6 bg-black text-white px-3 py-1 text-xs font-semibold"
          role="note"
          aria-label="熱門方案"
        >
          熱門推薦
        </div>
      )}
      <h3 
        id={`plan-title-${index}`}
        className={`text-xl sm:text-2xl font-bold mb-4 ${plan.isPopular ? 'text-white' : 'text-gray-900'}`}
      >
        {plan.title}
      </h3>
      <div className="mb-6">
        <span className={`text-3xl sm:text-4xl font-bold ${plan.isPopular ? 'text-white' : ''}`}>{plan.price}</span>
        <span className={`text-base ${plan.isPopular ? 'text-white' : 'text-gray-500'}`}>{plan.period}</span>
      </div>
      <div className={`h-px w-full mb-6 ${plan.isPopular ? 'bg-white/30' : 'bg-gray-100'}`}></div>
      <ul className="space-y-4 mb-8" role="list">
        {plan.features.map((feature, idx) => (
          <li 
            key={idx}
            className={`flex items-start text-sm ${idx < 3 ? 'font-medium' : ''} ${plan.isPopular ? 'text-white' : ''}`}
            role="listitem"
          >
            <svg
              className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                plan.isPopular ? 'text-white' : 'text-primary'
              }`}
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
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        href={`/contact?plan=${encodeURIComponent(plan.title)}&source=pricing`}
        variant={plan.isPopular ? 'white' : 'primary'}
        size="md"
        fullWidth={true}
        animate={true}
        className={`font-medium transition-all duration-300 ${
          plan.isPopular 
            ? 'hover:bg-gray-50 hover:text-primary shadow-md hover:shadow-lg' 
            : 'hover:bg-primary/90 shadow-md hover:shadow-lg'
        }`}
        aria-label={`選擇${plan.title}方案`}
        icon={
        <svg 
            className="w-4 h-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        }
        iconPosition="right"
      >
        {plan.btnText}
      </Button>
    </motion.div>
  )
})

// 服務特色部分
function ServiceFeature() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full">
            我們的優勢
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
            專注於<span className="text-primary">醫療行銷</span>的專業團隊
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            我們深知醫療行業的獨特性與挑戰。十年以上的醫療行銷經驗，讓我們能精準理解診所與病患的需求，提供真正有效的解決方案。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">深刻理解醫療產業</h3>
            <p className="text-gray-600">
              我們不只是行銷團隊，更是醫療產業的深度觀察者與參與者。我們了解各類診所的運作邏輯、醫病關係的建立、診療項目的特色，能從醫師與病患雙方視角提供最適切的建議。
            </p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <Heading level="h3" size="xs" className="mb-4">兼顧專業與溫度</Heading>
            <p className="text-gray-600">
              醫療行銷最大的挑戰是如何在傳達專業的同時保持溫度。我們精通如何將艱澀的醫療知識轉化為溫暖易懂的內容，既能展現醫師專業，又能拉近與病患的距離，建立信任關係。
            </p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <Heading level="h3" size="xs" className="mb-4">數據驅動成效</Heading>
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
  // 表單狀態管理
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    title: '',
    phone: '',
    email: '',
    clinic: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 處理輸入變化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 驗證表單
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('請填寫所有必填欄位')
      setIsSubmitting(false)
      return
    }

    try {
      // 發送表單數據到API端點
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data: FormResponse = await response.json()

      if (response.ok) {
        // 清空表單
        setFormData({
          name: '',
          title: '',
          phone: '',
          email: '',
          clinic: '',
          service: '',
          message: ''
        })
        
        // 顯示成功訊息
        toast.success(data.message || '感謝您的訊息！我們的醫療行銷顧問將於一個工作日內與您聯繫。')
      } else {
        // 顯示錯誤訊息
        toast.error(data.message || '提交失敗，請稍後再試。')
      }
    } catch (error) {
      console.error('表單提交錯誤：', error)
      toast.error('提交失敗，請稍後再試。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 平面化扁平現代簡約設計 */}
      <div className="relative bg-black overflow-hidden">
        {/* 背景組件 */}
        <div className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/bgline-w-small.webp"
              alt="背景圖案"
              fill
              priority
              quality={30}
              sizes="100vw"
              className="object-cover opacity-30"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoQAAYABUB8JZwAAp3OPvwA/v7u/wD+/u7/AP7+7v8A/v7u/wD+/u7/AA=="
            />
          </div>
          <PageHeader
            title="專業服務項目"
            description="為醫療診所打造全方位的數位行銷解決方案，從品牌故事到數位轉型，助您實現業務成長"
            variant="red"
            size="md"
            alignment="center"
            backgroundImage="/images/bgline-w.webp"
            className="border-b border-primary relative z-10"
          />
        </div>
        
        {/* Hero Content - 扁平化現代設計 */}
        <div className="container-custom relative z-10 pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-20 md:pb-28">
          <div className="max-w-2xl text-white">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 rounded-full"
            >
              專業醫療行銷服務
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tight"
            >
              <div className="flex items-center mb-0.5">
                <span className="text-white">打造</span>
                <span className="text-primary bg-white px-2 mx-1 rounded-sm">診所品牌</span>
              </div>
              <div className="flex items-center">
                <span className="text-white">贏得</span>
                <span className="text-primary bg-white px-2 mx-1 rounded-sm">患者信任</span>
              </div>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-white/90 mb-8 leading-relaxed max-w-xl"
            >
              全方位醫療行銷專家團隊，從品牌建立到數位轉型，為您的診所打造專屬成長策略，提升市場競爭力。
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-300 text-base shadow-md shadow-primary/30 rounded-md group"
              >
                <span>免費品牌診斷</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 bg-black/20 backdrop-blur-sm text-white font-medium hover:bg-white/10 transition-all duration-300 text-base rounded-md"
              >
                查看服務方案
              </Link>
            </motion.div>
            
            {/* Hero Stats - 扁平化統計區塊 */}
            <motion.div 
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <div className="bg-gradient-to-br from-gray-900 to-black p-4 text-center border-t-4 border-primary rounded-md shadow-md">
                <Heading level="h4" variant="primary" className="text-3xl md:text-4xl mb-2" onDark={true}>10+</Heading>
                <div className="text-sm font-medium text-gray-100">年產業經驗</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-4 text-center border-t-4 border-primary rounded-md shadow-md">
                <Heading level="h4" variant="primary" className="text-3xl md:text-4xl mb-2" onDark={true}>200+</Heading>
                <div className="text-sm font-medium text-gray-100">成功案例</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-4 text-center border-t-4 border-primary rounded-md shadow-md">
                <Heading level="h4" variant="primary" className="text-3xl md:text-4xl mb-2" onDark={true}>98%</Heading>
                <div className="text-sm font-medium text-gray-100">客戶滿意度</div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Side Floating Element - 扁平化數據面板 */}
          {/* 數據面板 - 響應式優化設計 */}
          {/* 桌面版面板 */}
          <motion.div
            className="hidden lg:block absolute right-4 xl:right-16 top-40 bg-gradient-to-br from-gray-800 to-black p-6 w-80 z-10 border-l-4 border-primary shadow-lg rounded-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ x: -5 }}
          >
            <Heading level="h3" size="xs" className="mb-5 text-primary border-b border-gray-700 pb-2 font-bold">讓數據說話</Heading>
            <div className="mb-6">
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-gray-100 font-medium">診所知名度提升</span>
                <div className="flex items-center">
                  <span className="font-bold text-lg text-primary mr-1">76%</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 text-primary"
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="h-2 bg-gray-700 w-full overflow-hidden rounded-full">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: '76%' }}
                  transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-gray-100 font-medium">新患者轉換率</span>
                <div className="flex items-center">
                  <span className="font-bold text-lg text-primary mr-1">64%</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 text-primary"
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="h-2 bg-gray-700 w-full overflow-hidden rounded-full">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: '64%' }}
                  transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-gray-100 font-medium">患者回診率提升</span>
                <div className="flex items-center">
                  <span className="font-bold text-lg text-primary mr-1">89%</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 text-primary"
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="h-2 bg-gray-700 w-full overflow-hidden rounded-full">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: '89%' }}
                  transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
          
          {/* 平板/手機版數據面板 - 扁平化設計 */}
          <motion.div
            className="lg:hidden relative w-full bg-gradient-to-r from-gray-900 to-black p-6 my-8 z-10 border-l-4 border-primary rounded-r-md shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Heading level="h3" size="xs" className="mb-5 text-primary text-center border-b border-gray-700 pb-2 font-bold">診所數位行銷成效</Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-black p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-100 font-medium text-sm">診所知名度提升</span>
                  <span className="font-bold text-lg text-primary flex items-center">
                    76%
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div className="h-2 bg-gray-700 w-full overflow-hidden rounded-full">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: '76%' }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800 to-black p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-100 font-medium text-sm">新患者轉換率</span>
                  <span className="font-bold text-lg text-primary flex items-center">
                    64%
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div className="h-2 bg-gray-700 w-full overflow-hidden rounded-full">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: '64%' }}
                    transition={{ duration: 1, delay: 0.9 }}
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800 to-black p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-100 font-medium text-sm">患者回診率提升</span>
                  <span className="font-bold text-lg text-primary flex items-center">
                    89%
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div className="h-2 bg-gray-700 w-full overflow-hidden rounded-full">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: '89%' }}
                    transition={{ duration: 1, delay: 1.1 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* 醫療市場統計數據區 */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom max-w-5xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Heading 
              level="h2" 
              size="lg" 
              variant="primary" 
              className="mb-4"
              animate
            >
              面對醫療市場的更迭速度
            </Heading>
            <Heading 
              level="h2" 
              size="lg" 
              variant="primary" 
              className="mb-8"
              animate
            >
              你準備好了嗎？
            </Heading>
            <motion.div
              className="w-24 h-1 bg-primary mx-auto mb-10"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            ></motion.div>
            <Heading 
              level="h3" 
              size="md" 
              className="mb-8 text-gray-800"
            >
              市場競爭加劇 - 供給持續增長 - 診所差異減少
            </Heading>
            <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
              根據衛生福利部統計調查，近年來台灣牙醫診所與牙醫師數量呈現<span className="font-bold">快速增長</span>趨勢，
              而高達<span className="font-bold text-primary">80.81%</span>的牙醫師集中在六都地區，市場競爭日趨白熱化。
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* 診所數量統計卡片 */}
            <motion.div 
              className="bg-white p-5 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-base font-bold mb-4 text-primary border-b pb-2">台灣牙醫診所數量</h3>
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <div className="bg-black text-white py-1 px-3 text-sm">2021年</div>
                  <div className="text-2xl font-bold">6,922<span className="text-base ml-1">間</span></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="bg-black text-white py-1 px-3 text-sm">2022年</div>
                  <div className="text-2xl font-bold">6,969<span className="text-base ml-1">間</span></div>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2">
                  <div className="font-medium text-sm">年度增長率</div>
                  <div className="text-xl font-bold text-primary">0.68%</div>
                </div>
              </div>
            </motion.div>

            {/* 牙醫師數量統計卡片 */}
            <motion.div 
              className="bg-white p-5 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-base font-bold mb-4 text-primary border-b pb-2">台灣牙醫師人數</h3>
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <div className="bg-black text-white py-1 px-3 text-sm">2020年</div>
                  <div className="text-2xl font-bold">15,429<span className="text-base ml-1">位</span></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="bg-black text-white py-1 px-3 text-sm">2022年</div>
                  <div className="text-2xl font-bold">16,668<span className="text-base ml-1">位</span></div>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2">
                  <div className="font-medium text-sm">年度增長率</div>
                  <div className="text-xl font-bold text-primary">5.11%</div>
                </div>
              </div>
            </motion.div>

            {/* 牙醫師分布統計卡片 */}
            <motion.div 
              className="bg-white p-5 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold mb-5 text-primary border-b pb-2 whitespace-nowrap overflow-hidden text-ellipsis">牙醫師分布情況</h3>
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
              <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold mb-5 text-primary border-b pb-2 whitespace-nowrap overflow-hidden text-ellipsis">市場趨勢分析</h3>
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
            <Heading 
              level="h3" 
              size="md" 
              variant="white"
              className="mb-4"
            >
              患者沒變、牙醫卻越來越多！
            </Heading>
            <Heading 
              level="h4" 
              size="sm" 
              variant="white"
              className="mb-6 font-medium"
            >
              為什麼患者要選擇你的診所？
            </Heading>
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
          
          {/* 數位醫療搜尋行為統計 */}
          <motion.div 
            className="mt-16 bg-gray-50 p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* 背景紋理 */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0 L100,100 M20,0 L100,80 M0,20 L80,100 M40,0 L100,60 M0,40 L60,100 M60,0 L100,40 M0,60 L40,100 M80,0 L100,20 M0,80 L20,100" stroke="var(--color-primary)" strokeWidth="0.5" fill="none" />
              </svg>
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <Heading 
                level="h2" 
                size="lg" 
                className="mb-8 text-center"
                animate
                noWrap={false}
              >
                沒被看見的診所等同<span className="text-primary">不存在</span><br/>
                你的專業還能被患者找到嗎？
              </Heading>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="flex flex-col items-center">
                  <p className="text-xl mb-6 font-semibold">in Taiwan</p>
                  <div className="relative">
                    <div className="bg-black text-white p-4 md:p-6 mb-4">
                      <span className="text-5xl md:text-6xl font-bold">94.9%</span>
                      <span className="text-lg ml-2">的台灣人</span>
                    </div>
                    <div className="border-2 border-black p-4 md:p-6 text-center">
                      <p className="text-xl font-medium mb-2">每天平均花</p>
                      <p className="text-4xl md:text-5xl font-bold text-primary mb-2">7小時13分</p>
                      <p className="text-xl font-medium">在網路世界</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-black text-white p-4 md:p-6 mb-4">
                    <span className="text-5xl md:text-6xl font-bold">53.8%</span>
                    <span className="text-lg ml-2">的台灣人</span>
                  </div>
                  
                  <div className="text-center mb-6">
                    <p className="text-xl">尋找醫療服務前會</p>
                    <p className="text-2xl font-bold text-primary">網路研究診所評價</p>
                    <p className="text-xl">前三管道為：</p>
                  </div>
                  
                  {/* 優化視覺化比例展示 */}
                  <div className="w-full">
                    <div className="flex flex-col space-y-6">
                      {/* 搜尋引擎 - 數值最高，顯示最突出 */}
                      <motion.div 
                        className="relative"
                        initial={{ width: 0, opacity: 0 }}
                        whileInView={{ width: "100%", opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <div className="bg-primary text-white p-4 flex justify-between items-center">
                          <div>
                            <p className="text-lg font-medium">搜尋引擎</p>
                          </div>
                          <p className="text-3xl font-bold">62.3%</p>
                        </div>
                        <div className="absolute left-0 top-0 h-full bg-white opacity-20 w-full" style={{ width: "62.3%" }}></div>
                      </motion.div>

                      {/* 社群網路 - 數值中等 */}
                      <motion.div 
                        className="relative"
                        initial={{ width: 0, opacity: 0 }}
                        whileInView={{ width: "65%", opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        <div className="bg-primary text-white p-4 flex justify-between items-center">
                          <div>
                            <p className="text-lg font-medium">社群網路</p>
                          </div>
                          <p className="text-3xl font-bold">40.6%</p>
                        </div>
                        <div className="absolute left-0 top-0 h-full bg-white opacity-20 w-full" style={{ width: "40.6%" }}></div>
                      </motion.div>

                      {/* 醫療平台評論 - 數值最低 */}
                      <motion.div 
                        className="relative"
                        initial={{ width: 0, opacity: 0 }}
                        whileInView={{ width: "63%", opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      >
                        <div className="bg-primary text-white p-4 flex justify-between items-center">
                          <div>
                            <p className="text-lg font-medium">醫療平台評論</p>
                          </div>
                          <p className="text-3xl font-bold">39.1%</p>
                        </div>
                        <div className="absolute left-0 top-0 h-full bg-white opacity-20 w-full" style={{ width: "39.1%" }}></div>
                      </motion.div>

                      {/* 視覺比例尺示意 */}
                      <div className="flex justify-between items-center px-2 text-xs text-gray-500 mt-2">
                        <span>0%</span>
                        <span>20%</span>
                        <span>40%</span>
                        <span>60%</span>
                        <span>80%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm font-medium">
                <p>資料來源：2024台灣數位報告 / 醫療消費行為分析</p>
                <p className="mt-4 max-w-3xl mx-auto">
                  2024年台灣醫療相關數位廣告花費成長9.7%，醫療關鍵字搜尋量年增18.4%，顯示各大診所對數位行銷的重視程度與日俱增，網路已成為患者尋找醫療服務的首要管道。
                </p>
              </div>
            </div>
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
            <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-primary/10 text-primary">
              服務方案
            </span>
            <h2 
              id="pricing-title"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 text-gray-900 leading-tight"
            >
              選擇<span className="text-primary">適合</span>的方案
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-6 text-gray-600">
              根據診所不同階段的需求，我們提供彈性的行銷服務方案，協助您達成業務目標
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <PricingPlan key={plan.title} plan={plan} index={index} />
            ))}
          </div>
          
          <motion.div
            className="mt-12 text-center bg-gray-50 py-8 px-4 sm:px-8 rounded-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-lg font-bold mb-3 text-gray-800">需要更客製化的方案?</h3>
            <p className="text-gray-600 mb-6">
              我們提供專屬診所需求的客製服務，無論您處於哪個階段，都能依照實際需求進行調整
            </p>
            <Link 
              href="/contact?source=custom_pricing" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white border border-primary text-primary font-medium transition-all duration-300 rounded-md shadow-sm"
            >
              <span>聯繫我們討論客製方案</span>
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* 數位醫療廣告策略區塊 */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* 背景紋理 */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 C50,0 50,100 100,100 M0,100 C50,100 50,0 100,0" stroke="var(--color-primary)" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* 頂部標題區塊 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <div className="inline-block text-primary text-4xl md:text-5xl font-bold mb-4">
                Aidea<span className="text-black">:Med</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
                為醫療產業打造獨家廣告
              </h2>
              
              {/* 下箭頭 */}
              <motion.div
                className="flex justify-center my-10"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-2">
                深度洞察的投放策略
              </h3>
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-16">
                助你搶先拿下網路市場
              </h3>
            </motion.div>
            
            {/* 三大特點 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="border-l-4 border-primary pl-6 md:pl-8"
              >
                <h4 className="text-xl md:text-2xl font-bold text-primary mb-2">
                  數位行銷
                </h4>
                <p className="text-4xl md:text-5xl font-black text-black mb-4">15年經驗</p>
                <p className="text-gray-600">深耕業界<br/>全盤視角分析</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="border-l-4 border-primary pl-6 md:pl-8"
              >
                <h4 className="text-xl md:text-2xl font-bold text-primary mb-2">
                  單年投放費
                </h4>
                <p className="text-4xl md:text-5xl font-black text-black mb-4">達1億</p>
                <p className="text-gray-600">可靠的硬實力<br/>用數字說話</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="border-l-4 border-primary pl-6 md:pl-8"
              >
                <h4 className="text-xl md:text-2xl font-bold text-primary mb-2">
                  專業團隊
                </h4>
                <p className="text-4xl md:text-5xl font-black text-black mb-4">整合分工</p>
                <p className="text-gray-600">企劃部・數據部・客服部<br/>一條龍服務</p>
              </motion.div>
            </div>
            
            {/* 流程標題 */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">
                完整的線上開發 <span className="inline-flex items-center text-primary">
                  <svg className="w-8 h-8 mx-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span> 線下轉單流程
              </h3>
            </motion.div>
            
            {/* 四步流程 */}
            <div className="relative">
              {/* 背景漸變連接線 */}
              <div className="absolute left-16 md:left-24 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20 z-0"></div>
              
              <div className="relative z-10">
                {/* 步驟 1 */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="flex mb-16"
                >
                  <div className="w-32 md:w-48 flex-shrink-0">
                    <div className="bg-primary text-white text-5xl md:text-6xl font-black flex items-center justify-center h-24 w-24 md:h-32 md:w-32">
                      01
                    </div>
                  </div>
                  <div className="bg-primary text-white p-6 md:p-8 flex-grow">
                    <h4 className="text-2xl md:text-3xl font-bold mb-4">網路曝光</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>全方位的網路佈局</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>讓你的診所在各個管道都能被看見</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
                
                {/* 步驟 2 */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="flex mb-16 justify-end"
                >
                  <div className="bg-primary text-white p-6 md:p-8 flex-grow text-right">
                    <h4 className="text-2xl md:text-3xl font-bold mb-4">主動聯繫</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start justify-end">
                        <span>需求患者透過LINE@</span>
                        <span className="ml-2">•</span>
                      </li>
                      <li className="flex items-start justify-end">
                        <span>主動發訊聯繫</span>
                        <span className="ml-2">•</span>
                      </li>
                    </ul>
                  </div>
                  <div className="w-32 md:w-48 flex-shrink-0 flex justify-end">
                    <div className="bg-primary text-white text-5xl md:text-6xl font-black flex items-center justify-center h-24 w-24 md:h-32 md:w-32">
                      02
                    </div>
                  </div>
                </motion.div>
                
                {/* 步驟 3 */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="flex mb-16"
                >
                  <div className="w-32 md:w-48 flex-shrink-0">
                    <div className="bg-primary text-white text-5xl md:text-6xl font-black flex items-center justify-center h-24 w-24 md:h-32 md:w-32">
                      03
                    </div>
                  </div>
                  <div className="bg-primary text-white p-6 md:p-8 flex-grow">
                    <h4 className="text-2xl md:text-3xl font-bold mb-4">持續深化</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>潛在患者加入LINE@</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>內容行銷持續互動</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
                
                {/* 步驟 4 */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                  className="flex justify-end"
                >
                  <div className="bg-primary text-white p-6 md:p-8 flex-grow text-right">
                    <h4 className="text-2xl md:text-3xl font-bold mb-4">客服約診</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start justify-end">
                        <span>由專業的客服業務承接對話</span>
                        <span className="ml-2">•</span>
                      </li>
                      <li className="flex items-start justify-end">
                        <span>推動患者完成約診</span>
                        <span className="ml-2">•</span>
                      </li>
                    </ul>
                  </div>
                  <div className="w-32 md:w-48 flex-shrink-0 flex justify-end">
                    <div className="bg-primary text-white text-5xl md:text-6xl font-black flex items-center justify-center h-24 w-24 md:h-32 md:w-32">
                      04
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 服務流程 */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full">
              專業行銷流程
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              透明高效的<span className="text-primary">合作流程</span>
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-6 text-gray-600 leading-relaxed">
              從需求確認到執行監測，我們建立系統化流程，確保每個診所的行銷計畫都能有效實施
            </p>
          </motion.div>

          <div className="px-4 sm:px-8 relative">
            <motion.div 
              className="absolute top-0 bottom-0 left-5 sm:left-9 w-1 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20 rounded-full hidden sm:block" 
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <div className="space-y-6 sm:space-y-8">
              {serviceProcess.map((step, index) => (
                <ProcessStep key={step.step} step={step} index={index} />
              ))}
            </div>
          </div>
          
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Link 
              href="/contact" 
              className="btn-flat btn-flat-primary flex items-center group"
            >
              <span className="text-white">立即諮詢</span>
              <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
          
          <div className="mt-6 text-center">
            <motion.p 
              className="text-xs text-caption italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              每個流程由專業團隊全程參與，確保最佳效果
            </motion.p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="開始您的品牌成長之旅"
        description="立即預約免費諮詢，讓我們為您打造專屬的醫療行銷策略"
        sectionId="cta-title"
        primaryButton={{
          href: "/contact",
          text: "預約諮詢",
          variant: "white"
        }}
        secondaryButton={{
          href: "/case",
          text: "查看案例",
          variant: "dark-overlay"
        }}
      />

      {/* Service Feature Section */}
      <ServiceFeature />
      


      {/* 快速預約CTA和表單 */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* 背景紋理 */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 L100,100 M20,0 L100,80 M0,20 L80,100 M40,0 L100,60 M0,40 L60,100 M60,0 L100,40 M0,60 L40,100 M80,0 L100,20 M0,80 L20,100" stroke="var(--color-primary)" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Heading 
              level="h2" 
              size="lg" 
              variant="black" 
              className="mb-4"
              animate
              noWrap={false}
            >
              立即開始醫療行銷轉型
            </Heading>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              填寫諮詢表單，我們的專業顧問將於24小時內與您聯繫，<br/>
              為您的診所量身打造最適合的數位行銷策略
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            {/* Left Side - Form */}
            <div className="lg:col-span-3">
              <motion.div 
                className="bg-white border border-gray-100 p-8 md:p-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 heading-underline">預約專業諮詢</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="animate-slide-up">
                      <label 
                        htmlFor="name" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                        placeholder="您的姓名"
                      />
                    </div>
                    <div className="animate-slide-up delay-100">
                      <label 
                        htmlFor="title" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        職稱
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                        placeholder="您的職稱"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="animate-slide-up delay-200">
                      <label 
                        htmlFor="phone" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        電話 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                        placeholder="聯絡電話"
                      />
                    </div>
                    <div className="animate-slide-up delay-300">
                      <label 
                        htmlFor="email" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                        placeholder="電子郵件"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6 animate-slide-up delay-300">
                    <label 
                      htmlFor="clinic" 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      診所名稱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="clinic"
                      name="clinic"
                      value={formData.clinic}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                      placeholder="您的診所名稱"
                    />
                  </div>
                  
                  <div className="mb-6 animate-slide-up delay-300">
                    <label 
                      htmlFor="service" 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      需求服務
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                    >
                      <option value="">請選擇服務項目</option>
                      <option value="brand">品牌故事打造</option>
                      <option value="marketing">整合行銷服務</option>
                      <option value="digital">數位轉型優化</option>
                      <option value="content">內容創作服務</option>
                      <option value="other">其他服務</option>
                    </select>
                  </div>
                  
                  <div className="mb-6 animate-slide-up delay-400">
                    <label 
                      htmlFor="message" 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      諮詢內容
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                      placeholder="請簡述您的需求或問題"
                    ></textarea>
                  </div>
                  
                  <div className="animate-slide-up delay-500">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      variant="primary"
                      size="lg"
                      fullWidth={true}
                      animate={true}
                      className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? '提交中...' : '送出諮詢表單'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
            
            {/* Right Side - Contact Information */}
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-white border border-gray-100 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6 heading-underline">聯絡資訊</h2>
                
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-start" 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">專線諮詢</h4>
                      <p className="text-gray-600">(02) 2748-8919</p>
                      <p className="text-gray-500 text-sm">醫療行銷顧問直接服務</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">業務合作信箱</h4>
                      <p className="text-gray-600">contact@aideamed.com</p>
                      <p className="text-gray-500 text-sm">24小時內專人回覆</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">顧問團隊總部</h4>
                      <p className="text-gray-600">台北市大安區敦化南路二段99號13樓</p>
                      <p className="text-gray-500 text-sm">歡迎預約參訪討論</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">顧問服務時間</h4>
                      <p className="text-gray-600">週一至週五：09:00 - 18:00</p>
                      <p className="text-gray-500 text-sm">週六：預約制 / 週日：休息</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-black text-white p-6 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <h4 className="text-lg font-bold mb-3">為什麼現在就該行動？</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>醫療競爭日益激烈，先搶佔數位管道者先贏</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>62.3%的患者透過搜尋引擎尋找醫療服務</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>專業團隊協助，省時省力創造最大效益</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <CTASection
        title="讓我們一同打造您的診所品牌"
        description="專業醫療行銷團隊，為您量身打造數位成長方案，建立品牌差異化，搶佔醫療市場先機"
        sectionId="service-cta"
        primaryButton={{
          href: "/contact",
          text: "立即預約諮詢",
          variant: "white"
        }}
        secondaryButton={{
          href: "/case",
          text: "查看成功案例",
          variant: "dark-overlay"
        }}
      />
    </div>
  )
} 