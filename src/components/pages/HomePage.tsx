'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import Link from 'next/link'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'
import { caseStudies as casesData } from '@/components/pages/CasePage'
import { CaseCard } from '@/components/case/CaseCard'
import { animations } from '@/utils/animations'
// 引入 Lucide React 圖標
import { 
  Stethoscope, 
  BarChart2, 
  Users, 
  Handshake,
  ClipboardEdit,
  MonitorSmartphone,
  UserCog
} from 'lucide-react'
import Image from 'next/image'
import Logo from '@/components/common/Logo'

// 服務特色數據 - 替換 emoji 為圖標組件
const features = [
  {
    title: '專注醫療，行銷交給我們',
    description: '深知每位醫師的堅持與熱忱，我們用十年以上的醫療行銷經驗，讓您能安心專注於診療品質，為病患提供最好的照護',
    icon: Stethoscope
  },
  {
    title: '數據驅動成長',
    description: '不只是數字，而是每位病患的信任。我們運用智慧分析工具，從預約率到回診率，協助您更了解病患需求，提供更貼心的服務',
    icon: BarChart2
  },
  {
    title: '用心經營口碑',
    description: '好的口碑來自於真誠。我們協助您建立診所獨特價值，透過真實故事與在地連結，讓更多人認識您的專業與用心',
    icon: Users
  },
  {
    title: '全方位夥伴',
    description: '從線上到線下，我們不只是服務提供者，更是您的成長夥伴。整合數位行銷、空間設計到人員培訓，一起打造溫暖而專業的診所環境',
    icon: Handshake
  }
]

// 服務流程數據
const serviceProcess = [
  {
    step: '01',
    title: '深入了解',
    description: '傾聽您的故事與願景，了解診所的特色和困境，共同規劃最適合的成長方向',
    emoji: '👂'
  },
  {
    step: '02',
    title: '策略規劃',
    description: '結合數據分析與在地特色，為您量身打造專屬的品牌策略與行銷計畫',
    emoji: '📋'
  },
  {
    step: '03',
    title: '執行優化',
    description: '專業團隊全程陪伴，持續追蹤成效並即時調整，確保每一步都朝著目標前進',
    emoji: '🚀'
  },
  {
    step: '04',
    title: '成長茁壯',
    description: '不只是短期成效，更要建立長期競爭力，讓診所能持續穩定成長',
    emoji: '📈'
  }
]

// 動畫區塊組件
interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  suppressHydrationWarning?: boolean
}

// 動畫Section組件
const AnimatedSection = ({ className = '', delay = 0, children, suppressHydrationWarning }: AnimatedSectionProps) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  useEffect(() => {
    if (inView) {
      controls.start({ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, delay: delay * 0.2 }
      })
    }
  }, [controls, inView, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      className={className}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      {children}
    </motion.div>
  )
}

// 客戶評價介面定義
interface Testimonial {
  name: string;
  title: string;
  content: string;
  image: string;
  rating: number;
}

// 新增客戶評價數據
const testimonials: Testimonial[] = [
  {
    name: '張文瑞醫師',
    title: '長榮牙醫診所 院長',
    content: '從沒想過牙醫也需要行銷，一開始還有點疑慮，但事實證明這個時代需要，而且有效。Aidea團隊提供的行銷策略讓我們的新客量在三個月內成長超過50%。',
    image: '/testimonials/doctor1.jpg',
    rating: 5
  },
  {
    name: '林佳欣醫師',
    title: '微笑牙醫診所 負責人',
    content: '提升了診所的曝光度，並且增加了患者的到診率，成果顯著。合作半年來，我們的Google搜尋排名提高了，社群互動也增加了3倍，實質帶來了業績成長。',
    image: '/testimonials/doctor2.jpg',
    rating: 5
  },
  {
    name: '吳建志醫師',
    title: '仁心齒科 創辦人',
    content: '診所經營遇到的瓶頸得到有效解決，整體合作過程中沒有疏漏，令人放心。團隊專業度高，能夠針對牙醫特性提供客製化的行銷方案。',
    image: '/testimonials/doctor3.jpg',
    rating: 5
  },
  {
    name: '陳雅婷醫師',
    title: '雅典娜美學牙醫 院長',
    content: '不僅有行銷專業，還獲得很多清晰的診所流程建議，值得推薦。與Aidea合作後，不只是客戶增加，整個診所的運作效率和服務品質都提升了。',
    image: '/testimonials/doctor4.jpg',
    rating: 5
  },
  {
    name: '黃明德醫師',
    title: '德仁齒科 總院長',
    content: '報告和建議方案都很細緻，團隊真的很用心。每月提供的數據分析讓我們能清楚掌握行銷效果，看到投資回報，非常專業的團隊。',
    image: '/testimonials/doctor5.jpg',
    rating: 5
  },
  {
    name: '王思穎醫師',
    title: '康德牙醫聯合診所 執行長',
    content: '與其他行銷公司合作過，Aidea: Med 是裡面最懂醫療產業的，溝通順暢會繼續合作下去。他們了解醫療倫理的界線，行銷手法專業又不失專業形象。',
    image: '/testimonials/doctor6.jpg',
    rating: 5
  }
];

// 更新常見問題數據
const faqs = [
  {
    question: '如何評估診所的行銷需求？',
    answer: '我們提供完整的專業評估流程：\n\n1. 診所現況分析\n- 營運數據評估（包含預約率、轉換率等）\n- 目標客群分析與定位\n- 競爭環境與市場機會評估\n\n2. 數位資產診斷\n- 官網與社群媒體表現\n- 搜尋引擎排名分析\n- 廣告投放效益評估\n\n3. 品牌定位分析\n- 診所特色與優勢盤點\n- 服務項目與價格策略\n- 目標市場區隔定位\n\n完整評估後，我們會提供詳細的分析報告與建議方案。',
    category: '前期評估'
  },
  {
    question: '專業品牌行銷方案包含哪些服務？',
    answer: '我們提供全方位的品牌行銷解決方案：\n\n1. 品牌策略規劃\n- 品牌識別系統設計\n- 診所空間視覺規劃\n- 醫療團隊形象包裝\n\n2. 數位行銷服務\n- 官網設計與開發\n- SEO 優化與關鍵字排名\n- 社群媒體經營管理\n- 精準廣告投放策略\n\n3. 內容行銷製作\n- 專業影片拍攝製作\n- 圖文內容企劃設計\n- 衛教文章撰寫\n\n4. 系統化管理工具\n- 客戶關係管理系統\n- 線上預約系統\n- 數據分析儀表板',
    category: '服務內容'
  },
  {
    question: '專業品牌行銷方案的投資成本與預期效益？',
    answer: '我們的專業品牌行銷方案起始投資為每月 10 萬起：\n\n1. 預期效益\n- 新客數提升：平均成長 150-200%\n- 諮詢轉換率：提升至 60-80%\n- 品牌知名度：提升 3-5 倍\n- 營業額：年成長 100-200%\n\n2. 投資報酬分析\n- 平均投資報酬率(ROI)：300-500%\n- 客戶回收成本降低：40-60%\n- 複診率提升：30-50%\n\n3. 服務保證\n- 提供明確的 KPI 目標\n- 每月績效檢討與調整\n- 未達標準提供免費優化',
    category: '成本效益'
  },
  {
    question: '如何確保行銷方案的執行成效？',
    answer: '我們採用數據導向的專業管理方式：\n\n1. 即時監控系統\n- 24小時數據監測\n- 即時成效分析\n- 自動異常警示\n\n2. 定期績效報告\n- 每週成效報表\n- 每月策略會議\n- 季度成長分析\n\n3. 持續優化機制\n- A/B測試最佳化\n- 競品分析比較\n- 客戶回饋追蹤\n\n4. 專業顧問團隊\n- 專屬客戶經理\n- 技術支援團隊\n- 緊急處理機制',
    category: '成效管理'
  },
  {
    question: '開始合作前需要準備哪些資料？',
    answer: '為確保專案順利啟動，建議準備以下資料：\n\n1. 基本資料\n- 診所營業資訊\n- 醫療團隊簡介\n- 重點服務項目\n\n2. 現有行銷素材\n- 診所環境照片\n- 過往行銷文案\n- 案例照片與資料\n\n3. 營運相關資訊\n- 目標客群定義\n- 價格策略說明\n- 競爭對手資訊\n\n4. 發展規劃\n- 短期營運目標\n- 中長期發展規劃\n- 預期投資預算',
    category: '合作準備'
  },
  {
    question: '合作流程與時程規劃為何？',
    answer: '標準合作流程與時程如下：\n\n1. 前期評估（1-2週）\n- 首次免費諮詢\n- 需求訪談與分析\n- 提案簡報與討論\n\n2. 策略規劃（2-3週）\n- 品牌定位規劃\n- 行銷策略制定\n- 執行方案確認\n\n3. 系統建置（2-4週）\n- 官網與系統開發\n- 追蹤工具設置\n- 帳號權限設定\n\n4. 正式執行（3-6個月）\n- 內容持續產出\n- 成效即時優化\n- 定期檢討調整',
    category: '合作流程'
  },
  {
    question: '如何確保診所的品牌特色？',
    answer: '我們透過系統化的品牌建立流程：\n\n1. 品牌定位研究\n- 深度訪談診所團隊\n- 競爭市場分析\n- 目標客群研究\n\n2. 特色發展策略\n- 醫療專業特色規劃\n- 服務體驗設計\n- 差異化優勢建立\n\n3. 視覺識別系統\n- 品牌識別設計\n- 空間視覺規劃\n- 行銷物料設計\n\n4. 品牌故事建立\n- 核心理念發展\n- 品牌故事架構\n- 溝通主軸設定',
    category: '品牌策略'
  },
  {
    question: '如何評估行銷方案的投資報酬率？',
    answer: '我們採用全方位的 ROI 評估系統：\n\n1. 收入面向\n- 新增病患收益\n- 複診率提升效益\n- 客單價成長分析\n\n2. 成本面向\n- 行銷投資成本\n- 客戶取得成本\n- 營運優化效益\n\n3. 品牌價值\n- 品牌知名度提升\n- 市場口碑建立\n- 長期競爭優勢\n\n4. 營運效率\n- 預約率提升\n- 諮詢轉換率\n- 人力運用效率',
    category: '成本效益'
  }
];

// 更新 Hero Section 樣式
function HeroSection() {
  // 改進動畫效果
  const controls = useAnimation();
  const [heroRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // 使用 useCallback 處理滾動
  const handleScroll = useCallback(() => {
    if (!isClient) return;
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }, [isClient]);

  // 簡化元素動畫變體
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  };
  
  // 標籤數據
  const tags = [
    { id: 'ai', name: '#AI' },
    { id: 'creativity', name: '#Creativity' },
    { id: 'design', name: '#Design Thinking' },
    { id: 'insight', name: '#Insight' }
  ];
  
  return (
    <section 
      ref={heroRef}
      className="relative min-h-[90vh] md:min-h-[85vh] flex items-center bg-primary overflow-hidden"
      role="banner"
      aria-label="網站主要橫幅"
    >
      {/* 波浪背景 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-primary opacity-100"></div>
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/bgline-w.png"
            alt="背景波浪線條"
            fill
            className="object-cover mix-blend-soft-light"
            quality={90}
            sizes="100vw"
            priority
          />
        </div>
      </div>
      
      <div className="container-custom relative z-20 py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 heading-hero animate-slide-up"
              suppressHydrationWarning
            >
              數位精準驅動<br/>
              <span className="font-bold text-white">專為真實醫療服務</span>
            </h1>
            
            <p 
              className="text-lg sm:text-xl md:text-2xl text-white max-w-2xl mx-auto mt-4 mb-8 animate-slide-up delay-200"
              suppressHydrationWarning
            >
              Digital precision-driven,<br/>
              tailored for authentic healthcare services.
            </p>
            
            {/* 扁平化標籤設計 - 透明背景線條裝飾 */}
            <div className="flex flex-wrap justify-center gap-3 my-10">
              {tags.map((tag, index) => (
                <motion.div
                  key={tag.id}
                  className="tag-outline tag-outline-white text-sm md:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  whileHover={{
                    scale: 1.05,
                    borderWidth: '2px',
                    transition: { duration: 0.2 }
                  }}
                >
                  {tag.name}
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* 預約按鈕 - 黑底白字扁平化設計 */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link href="/contact">
              <motion.span 
                className="inline-flex items-center bg-black text-white px-8 py-4 text-lg font-medium border border-transparent"
                initial={{ y: 0 }}
                whileHover={{ 
                  y: -3,
                  boxShadow: '0 3px 0 rgba(255,255,255,0.2)',
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  y: 0,
                  boxShadow: '0 0px 0 rgba(255,255,255,0.2)',
                  transition: { duration: 0.1 }
                }}
              >
                <motion.span 
                  className="mr-2 text-2xl font-bold"
                  animate={{ 
                    opacity: [0.7, 1, 0.7],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  A:
                </motion.span>
                預約線上諮詢
                <motion.span
                  className="ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ 
                    x: 5,
                    transition: { 
                      repeat: Infinity, 
                      repeatType: "reverse", 
                      duration: 0.3 
                    }
                  }}
                >
                  →
                </motion.span>
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 向下滾動指示器 */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => document.getElementById('marketing-statement')?.scrollIntoView({ behavior: 'smooth' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white text-sm mb-2">探索更多</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 flex items-center justify-center text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// 新增階梯式行銷文案區塊
function MarketingStatement() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // 重新組織文案，按照語義分段
  const contentBlocks = [
    {
      en: {
        title: "THE MARKETING PARTNER",
        subtitle: "THAT UNDERSTANDS HEALTHCARE BEST."
      },
      zh: {
        title: "專業醫療行銷夥伴",
        subtitle: "最了解醫療產業的最佳選擇"
      },
      delay: 0.1,
      className: "ml-0"
    },
    {
      en: {
        title: "COMPREHENSIVE BRAND INTEGRATION",
        subtitle: "START THE CONVERSATION"
      },
      zh: {
        title: "全方位品牌整合策略",
        subtitle: "啟動專業對話"
      },
      delay: 0.5,
      className: "ml-[5%]"
    },
    {
      en: {
        title: "WITH YOUR POTENTIAL PATIENTS.",
        subtitle: ""
      },
      zh: {
        title: "與您的潛在患者創造連結",
        subtitle: "打造醫療品牌價值"
      },
      delay: 0.9,
      className: "ml-[10%]"
    }
  ];

  return (
    <section 
      id="marketing-statement" 
      className="relative py-16 md:py-20 bg-primary overflow-hidden"
      ref={ref}
    >
      {/* 背景線條裝飾 */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/bgline-w.png"
          alt="背景線條"
          fill
          className="object-cover mix-blend-soft-light"
          quality={90}
          sizes="100vw"
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {contentBlocks.map((block, index) => (
            <motion.div
              key={index}
              className={`${block.className} mb-10 md:mb-16 text-selection-inverted`}
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ 
                duration: 0.7, 
                delay: block.delay,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <motion.div 
                  className="w-full md:w-5/12"
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: block.delay + 0.1
                  }}
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight">
                    {block.en.title}
                  </h2>
                  {block.en.subtitle && (
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mt-2 md:mt-3 leading-tight tracking-tight">
                      {block.en.subtitle}
                    </h3>
                  )}
                </motion.div>
                
                <motion.div 
                  className="mt-4 md:mt-0 w-full md:w-6/12"
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: block.delay + 0.2
                  }}
                >
                  <div className="border-l-4 md:border-l-4 border-white/40 pl-4 md:pl-6">
                    <p className="text-xl md:text-2xl lg:text-3xl text-white font-medium leading-tight">
                      {block.zh.title}
                    </p>
                    {block.zh.subtitle && (
                      <p className="text-lg md:text-xl text-white/80 mt-2 font-medium leading-tight">
                        {block.zh.subtitle}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
              
              {/* 分隔線 - 只在區塊之間顯示 */}
              {index < contentBlocks.length - 1 && (
                <motion.div 
                  className="w-full h-px bg-white/20 mt-10 md:mt-16"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={inView ? { scaleX: 1, opacity: 0.2 } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: block.delay + 0.3
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
        
        {/* 底部箭頭指示 */}
        <motion.div 
          className="mt-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <motion.div
            className="text-white"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// 更新服務特色區塊
function FeatureSection() {
  return (
    <section id="features" className="py-20 bg-gray-50 overflow-hidden" suppressHydrationWarning>
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16" suppressHydrationWarning>
          <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10 rounded-full">我們的優勢</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center flex-wrap" suppressHydrationWarning>
            為什麼選擇
            <span className="inline-flex items-center mx-2 transform scale-75 sm:scale-90 md:scale-100">
              <Logo 
                variant="primary" 
                size="responsive" 
                className="ml-1 sm:ml-2" 
                priority={true}
              />
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            深耕醫療行銷領域超過十年，以專業經驗與創新技術，協助診所突破成長瓶頸
          </p>
        </AnimatedSection>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={animations.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title} 
              variants={animations.slideUp}
              className="group bg-white p-8 rounded-lg border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-500"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center transform group-hover:bg-primary group-hover:scale-105 transition-all duration-500">
                  {/* 使用 Lucide 圖標替代 emoji */}
                  <feature.icon size={28} strokeWidth={1.5} className="text-primary group-hover:text-white transition-colors duration-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
              
              {/* 改進的微互動元素 */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <motion.div 
                  className="w-8 h-0.5 bg-primary scale-0 group-hover:scale-100 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// 更新服務內容區塊 - 使用 Lucide 圖標
const services = [
  {
    title: '品牌策略規劃',
    description: '從市場分析到競爭者研究，協助您建立診所獨特的品牌定位與價值主張',
    features: [
      '品牌定位與價值主張',
      '目標患者族群分析',
      '品牌視覺與聲音規劃',
      '差異化競爭策略'
    ],
    icon: ClipboardEdit,
    link: '/service#brand'
  },
  {
    title: '數位行銷整合',
    description: '結合搜尋引擎優化、社群經營與線上廣告，提升診所數位能見度與患者轉化率',
    features: [
      '搜尋引擎優化 (SEO)',
      '社群媒體策略與經營',
      '精準投放網路廣告',
      '患者轉化率優化'
    ],
    icon: MonitorSmartphone,
    link: '/service#digital'
  },
  {
    title: '患者體驗優化',
    description: '全面審視並改善患者與診所的每一個接觸點，提升整體滿意度與回診率',
    features: [
      '患者旅程地圖分析',
      '前台服務流程優化',
      '空間與視覺設計',
      '患者關係管理系統'
    ],
    icon: UserCog,
    link: '/service#marketing'
  }
];

// 更新服務內容區塊
function ServiceSection() {
  return (
    <section className="relative py-24 bg-gray-50 overflow-hidden" role="region" aria-label="服務內容">
      {/* 簡化的背景 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 via-gray-50 to-white"></div>
      
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10 rounded-full">專業服務</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            為您提供的<span className="text-primary">整合服務</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            從品牌策略到數位行銷，我們提供全方位診所成長方案，系統性解決經營痛點
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1 
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-lg border border-gray-100 hover:border-primary/20 p-8 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                {/* 使用 Lucide 圖標替代 emoji */}
                <service.icon size={28} strokeWidth={1.5} className="text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-8">
                {service.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary mr-2 text-lg">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-4 mt-auto">
                <Link href={service.link} className="inline-flex items-center text-primary font-medium group">
                  了解更多服務細節
                  <motion.svg 
                    className="w-5 h-5 ml-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 更新數據統計區塊
function StatsSection() {
  return (
    <section className="relative py-24 bg-primary overflow-hidden">
      {/* 簡化的背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark z-0"></div>
      
      {/* 移除裝飾元素 */}
      
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-white font-medium mb-4 px-4 py-1.5 bg-white/10 rounded-full">成效數據</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            實際<span className="relative inline-block mx-2">
              成效
              <motion.span 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded-full"
              ></motion.span>
            </span>數據
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            以數據說明我們的專業與實力，為您的診所帶來實質的成長
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={animations.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {[
            { value: 300, suffix: "+", label: "合作醫療診所" },
            { value: 98, suffix: "%", label: "客戶續約率" },
            { value: 180, suffix: "%", label: "平均預約成長" },
            { value: 85, suffix: "%", label: "行銷投資回報率" }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={animations.slideUp}
              className="text-center"
            >
              <div className="bg-white/10 p-6 rounded-lg hover:bg-white/15 transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-dark/20">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                </div>
                <p className="text-lg text-white/90">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// 更新案例展示區塊
function CaseStudiesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // 只使用具有完整數據且確認存在的案例，明確列出已知有效的ID
  const validCases = useMemo(() => {
    // 明確定義我們知道存在的有效ID列表
    const validCaseIds = ['north-district-dental', 'east-district-dental', 'central-district-dental', 'south-district-dental'];
    
    // 只使用我們明確知道有效的案例ID
    return casesData.filter(cs => 
      // 檢查ID是否在我們的有效列表中 或 檢查案例是否有明確的圖片路徑
      (validCaseIds.includes(cs.id) || cs.image) &&
      // 確保有必要的基本數據
      cs.name && 
      cs.description && 
      Array.isArray(cs.metrics) && 
      cs.metrics.length > 0
    );
  }, []);
  
  // 選擇一個精選案例
  const featuredCase = useMemo(() => {
    const featured = validCases.find(cs => cs.featured);
    return featured || validCases[0]; // 如果沒有標記為精選的，使用第一個
  }, [validCases]);
  
  // 選擇非精選的其他案例
  const regularCases = useMemo(() => {
    if (!featuredCase) return [];
    return validCases
      .filter(cs => cs.id !== featuredCase.id)
      .slice(0, 3); // 只顯示最多3個案例
  }, [validCases, featuredCase]);

  // 建立從路由到案例詳情頁的函數
  const getValidCaseUrl = useCallback((caseId: string) => {
    return `/case/${caseId}`;
  }, []);

  return (
    <section ref={ref} className="relative py-20 md:py-28 bg-white">
      {/* 裝飾元素 */}
      <div className="absolute left-0 top-0 h-40 w-px bg-gray-100"></div>
      <div className="absolute right-0 bottom-0 h-40 w-px bg-gray-100"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10 rounded-full">成功案例</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            診所<span className="text-primary">成功案例</span>
          </h2>
          <div className="w-12 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            探索我們如何幫助診所提升品牌價值、增加營業額，打造專屬數位行銷策略
          </p>
        </motion.div>

        <AnimatePresence>
          {inView && (
            <>
              {/* 精選案例 */}
              {featuredCase && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                  <div className="p-1 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                      <span className="block w-4 h-px bg-primary mr-3"></span>
                      精選案例
                    </h3>
                  </div>
                  
                  {/* 移除外層的 Link 包裹，由 FeaturedCase 組件內部處理連結 */}
                  <div className="col-span-12 lg:col-span-8">
                    <CaseCard
                      caseStudy={featuredCase}
                      index={0}
                    />
                  </div>
                </motion.div>
              )}
              
              {/* 一般案例 */}
              {regularCases.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-16"
                >
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="block w-4 h-px bg-primary mr-3"></span>
                      更多成功案例
                    </h3>
                    <Link href="/case" className="text-primary text-sm font-medium hover:underline">
                      查看全部
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {regularCases.map((caseStudy, index) => (
                      // 移除外層 Link，改用 div，讓 CaseCard 內部處理導航
                      <div 
                        key={caseStudy.id} 
                        className="block h-full"
                      >
                        <CaseCard
                          caseStudy={caseStudy}
                          index={index}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* CTA 區塊 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center"
              >
                <div className="border-t border-gray-100 pt-12 pb-4">
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    我們擁有豐富的成功案例，展示如何協助不同類型的診所提升營運績效
                  </p>
                  <Link 
                    href="/case"
                    className="inline-flex items-center px-6 py-2 border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    探索所有成功案例
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// 新增客戶評價區塊
function TestimonialsSection() {
  // 添加滑動功能
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const itemsPerPage = {
    mobile: 1,  // 手機顯示1張
    tablet: 2,  // 平板顯示2張
    desktop: 3  // 桌面顯示3張
  };
  
  // 使用 useEffect 處理客戶端邏輯
  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 計算當前項目數和總頁數
  const currentItems = isClient
    ? (isMobile ? itemsPerPage.mobile : (isTablet ? itemsPerPage.tablet : itemsPerPage.desktop))
    : itemsPerPage.desktop;
    
  const totalPages = Math.ceil(testimonials.length / currentItems);
  
  // 自動播放功能
  useEffect(() => {
    if (totalPages <= 1) return;
    
    const autoplayInterval = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % totalPages);
    }, 5000);
    
    return () => clearInterval(autoplayInterval);
  }, [totalPages]);
  
  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  }, [totalPages]);
  
  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // 計算要顯示的評價
  const displayTestimonials = useMemo(() => {
    const start = currentPage * currentItems;
    // 如果不夠一頁，則顯示全部
    return testimonials.length <= currentItems
      ? testimonials
      : testimonials.slice(start, start + currentItems);
  }, [currentPage, currentItems]);

  // 動畫變體
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* 簡約背景元素 */}
      <div className="absolute top-0 left-0 w-1/3 h-px bg-primary/20"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-px bg-primary/20"></div>
      
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-4 text-sm tracking-wide">客戶評價</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            合作夥伴<span className="text-primary">真實心聲</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            聽聽專業牙醫如何評價我們的服務
          </p>
        </motion.div>

        <div className="relative py-8">
          {/* 輪播指示器 - 頂部置中 */}
          {isClient && testimonials.length > currentItems && (
            <div className="flex justify-center items-center gap-2 mb-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-8 h-1 transition-all duration-300 ${
                    i === currentPage ? 'bg-primary' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`切換到第${i+1}頁推薦`}
                />
              ))}
            </div>
          )}

          {/* 評價卡片容器 */}
          <div className="relative overflow-hidden">
            {/* 導航按鈕 - 絕對定位在兩側 */}
            {isClient && !isMobile && testimonials.length > currentItems && (
              <>
                <button 
                  onClick={handlePrevPage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex justify-center items-center bg-white border border-gray-100 text-primary hover:bg-gray-50 transition-colors"
                  aria-label="上一頁推薦"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={handleNextPage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex justify-center items-center bg-white border border-gray-100 text-primary hover:bg-gray-50 transition-colors"
                  aria-label="下一頁推薦"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* 評價卡片 */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6"
            >
              <AnimatePresence mode="wait">
                {displayTestimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.name}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <div className="bg-white border border-gray-100 p-6 h-full flex flex-col">
                      {/* 評價頂部 - 引號裝飾 */}
                      <div className="text-primary text-4xl font-serif mb-4">&ldquo;</div>
                      
                      {/* 評價內容 */}
                      <div className="flex-1 mb-6">
                        <p className="text-gray-700 leading-relaxed">
                          {testimonial.content}
                        </p>
                      </div>
                      
                      {/* 評價底部 - 作者資訊 */}
                      <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                        <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center font-bold rounded-sm mr-4">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                          <p className="text-sm text-gray-500">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
        
        {/* 聯絡我們CTA區塊 */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="border border-primary/10 bg-white p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">想了解更多合作案例？</h3>
            <div className="w-12 h-1 bg-primary/30 mx-auto mb-6"></div>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
              我們有更多成功案例分享，歡迎聯繫我們獲取專屬於您診所的行銷策略建議
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-primary text-white hover:bg-primary/90 transition-colors duration-300"
            >
              預約免費諮詢
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 更新 FAQ Section 樣式
function FAQSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  
  const categories = ['全部', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  const filteredFaqs = useMemo(() => {
    if (selectedCategory === '全部') return faqs;
    return faqs.filter(faq => faq.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* 簡化的背景 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white to-gray-50"></div>
      
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10 rounded-full">常見問題</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            專業<span className="text-primary">服務說明</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            了解我們如何協助診所突破成長瓶頸，實現持續發展
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* 分類標籤 */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            variants={animations.staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                variants={animations.slideUp}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:scale-105'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* FAQ 列表 */}
          <motion.div
            variants={animations.staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-6"
          >
            {filteredFaqs.map((faq) => (
              <motion.div
                key={faq.question}
                variants={animations.slideUp}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-medium text-gray-900 group-open:text-primary transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <span className="relative flex-shrink-0 ml-1.5 w-5 h-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute inset-0 w-5 h-5 opacity-100 group-open:opacity-0 transition-opacity duration-300 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute inset-0 w-5 h-5 opacity-0 group-open:opacity-100 transition-opacity duration-300 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18 12H6"
                        />
                      </svg>
                    </span>
                  </summary>

                  <div className="px-6 pb-6 pt-0">
                    <div className="prose prose-sm max-w-none text-gray-600">
                      {faq.answer.split('\n\n').map((paragraph, i) => (
                        <div key={i} className="mb-4">
                          {paragraph.startsWith('- ') ? (
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              {paragraph.split('\n- ').map((item, j) => (
                                <li key={j} className={j === 0 ? 'list-none -ml-4' : ''}>
                                  {item.replace('- ', '')}
                                </li>
                              ))}
                            </ul>
                          ) : paragraph.match(/^\d+\.\s/) ? (
                            <ol className="list-decimal list-inside space-y-1 ml-4">
                              {paragraph.split('\n').map((item, j) => (
                                <li key={j} className={!item.match(/^\d+\.\s/) ? 'list-none -ml-4' : ''}>
                                  {item.replace(/^\d+\.\s/, '')}
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <p>{paragraph}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// 聯絡區塊
const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">立即獲得專屬診所行銷解決方案</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            填寫下方表單，我們將為您提供免費診所行銷策略諮詢，為您的診所找到最合適的解決方案
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <ContactForm animation={true} />
            </div>
            
            <div className="lg:col-span-2">
              <ContactInfo animation={true} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 優化首頁組件
export default function HomePage() {
  useEffect(() => {
    // ... existing code ...
  }, [])
  
  return (
    <div className="min-h-screen bg-white">
      <section id="hero" className="min-h-[85vh]">
        <HeroSection />
      </section>

      {/* 新增行銷文案區塊 */}
      <section id="marketing-statement" className="min-h-[600px]">
        <MarketingStatement />
      </section>

      <section id="features" className="min-h-[600px]">
        <FeatureSection />
      </section>

      <section id="services" className="min-h-[600px]">
        <ServiceSection />
      </section>

      <section id="stats" className="min-h-[300px]">
        <StatsSection />
      </section>

      <section id="cases" className="min-h-[800px]">
        <CaseStudiesSection />
      </section>

      <section id="testimonials" className="min-h-[600px]">
        <TestimonialsSection />
      </section>

      <section id="faq" className="min-h-[400px]">
        <FAQSection />
      </section>

      <section id="contact" className="min-h-[400px]">
        <ContactSection />
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-primary text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto px-4 sm:px-6"
          >
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 heading-accent"
            >
              開始您的品牌成長之旅
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto text-shadow-light">
              立即預約免費諮詢，讓我們為您打造專屬的醫療行銷策略
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary font-medium hover:bg-gray-100 transition-colors duration-300 text-sm sm:text-base"
              >
                預約諮詢
              </Link>
              <Link
                href="/case"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-medium hover:bg-white/10 transition-colors duration-300 text-sm sm:text-base"
              >
                查看案例
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 