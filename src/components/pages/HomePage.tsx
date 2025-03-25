'use client'

import React, { useEffect, useState, Suspense, useRef, useCallback, useReducer, useMemo, memo } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { 
  Stethoscope, 
  BarChart2, 
  Users, 
  Handshake,
  ClipboardEdit,
  MonitorSmartphone,
  UserCog,
  Building2 as BuildingIcon,
  Globe as GlobeIcon,
  BarChart as ChartIcon,
  Clock,
  TrendingUp,
  Building,
  Star,
  Mail,
  Globe,
  ChevronDown, 
  PlusCircle,
  CalendarClock,
  CheckCircle,
  ArrowRight,
  Award,
  Zap,
  Lightbulb,
  Headset,
  FileText
} from 'lucide-react'
import { Logo, CTASection, AnimatedSection } from '@/components/common'
import { caseStudies as casesData } from '@/components/pages/CasePage'
import { animations, homePageAnimations } from '@/utils/animations'
import { 
  heroTitleVariants, 
  heroSubtitleVariants,
  marketingStatementVariants,
  tagAnimationVariants
} from '@/utils/animations'

// 動態載入非核心組件
const CaseCard = dynamic(() => import('@/components/case/CaseCard').then(mod => mod.CaseCard), {
  loading: () => <div className="h-full bg-gray-100 animate-pulse rounded-lg"></div>,
  ssr: false
})

const ContactForm = dynamic(() => import('@/components/contact/ContactForm'), {
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>,
  ssr: false
})

const ContactInfo = dynamic(() => import('@/components/contact/ContactInfo'), {
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg"></div>,
  ssr: false
})

// 服務特色數據 - 替換 emoji 為圖標組件
const features = [
  {
    title: '專注醫療，了解您的專業',
    description: '作為醫療行銷專家，我們深入理解醫療產業的獨特性與法規限制。十年以上的專業經驗，讓我們能精準把握醫師的核心價值，將您的專業轉化為患者能理解的信任',
    icon: Stethoscope
  },
  {
    title: 'AI驅動的精準成長',
    description: '結合前沿AI技術與醫療行銷專業，我們不只分析數據，而是解讀背後的患者需求。透過智能化工具優化每個接觸點，實現更高效的患者轉化與更精準的預算配置',
    icon: BarChart2
  },
  {
    title: '創造品牌差異化',
    description: 'Aidea:Med 團隊由醫療背景與行銷專家組成，能精準捕捉您診所的獨特價值。我們協助您脫穎而出，建立難以複製的品牌聲譽，吸引真正適合的目標患者',
    icon: Award
  },
  {
    title: '長期成長夥伴',
    description: '我們不是短期顧問，而是您診所成長路上的長期夥伴。從品牌策略、數位轉型到團隊培訓，提供全面支持，與您一同建立持續成長的醫療品牌生態系統',
    icon: Handshake
  }
]

// 常見問題數據
const faqs = [
  {
    question: '為什麼專科診所需要專業的行銷顧問？',
    answer: '在充滿競爭的醫療環境中，專業與信任是吸引患者的關鍵。\n\n許多優秀的醫師專注於提供卓越的診療服務，卻往往忽略了如何有效地傳達自身的專業價值。我們理解，您的時間應該專注在為患者提供最好的照護，而非鑽研數位行銷的複雜策略。\n\n專業醫療行銷顧問能彌補這個落差，我們不只是行銷團隊，更是您診所成長的合作夥伴。透過深入了解您的診療理念和特色，我們幫助您的專業被更多需要的患者看見，建立長遠的診所品牌價值，讓優質的醫療服務能觸及更廣泛的社群。',
    category: '行銷基礎'
  },
  {
    question: '您們如何理解我診所的特殊需求和市場定位？',
    answer: '每一間診所都有獨特的靈魂和故事，我們的首要任務就是傾聽和理解這個故事。\n\n我們的合作始於深度診斷階段，包含：\n\n1. 院長願景訪談\n- 透過一對一深度對談，了解您對診所的願景、醫療理念與價值觀\n- 挖掘您最想幫助的患者類型及其需求\n\n2. 診所差異化分析\n- 實地參訪您的診所環境與工作流程\n- 與醫療團隊互動，了解內部文化與專長\n\n3. 市場定位研究\n- 分析地區競爭環境與機會\n- 確認目標患者群體的真實需求與痛點\n\n這個過程不只是資料收集，而是真正融入您的診所文化，感受您對醫療的熱忱與理念。唯有真正理解，才能打造出真實反映診所靈魂的行銷策略。',
    category: '合作流程'
  },
  {
    question: '醫療行銷有什麼特殊的法規限制需要注意？',
    answer: '醫療行銷需要在專業、真實與合規之間取得平衡，我們深知這道平衡的重要性。\n\n醫療廣告受《醫療法》第85條與《醫療廣告管理辦法》嚴格規範，我們的專業團隊會確保所有行銷內容完全合規：\n\n1. 內容審核機制\n- 由具醫療背景的專業審稿團隊把關\n- 每項內容皆遵循醫療廣告法規標準審核\n\n2. 避免常見法律陷阱\n- 不使用明確療效保證或誇大宣傳\n- 不進行不當價格比較或促銷手法\n- 患者見證遵循合規處理方式\n\n3. 專業表達技巧\n- 運用合規的敘事方式傳達專業價值\n- 以衛教資訊取代直接療效宣傳\n\n我們的行銷策略不僅是合規的，更是能有效傳達您專業價值的。在我們的合作過程中，您也將了解如何在法規框架內，最大化地展現診所的專業與特色。',
    category: '行銷基礎'
  },
  {
    question: 'AI技術如何應用在診所的數位行銷中？',
    answer: 'AI不只是流行詞彙，而是能為診所帶來實際價值的強大工具。\n\n我們整合前沿AI技術與醫療行銷專業，為您的診所創造智慧化的成長策略：\n\n1. 患者洞察與分析\n- AI驅動的數據分析，精準了解患者行為模式\n- 預測性分析協助識別潛在高價值患者群體\n\n2. 個人化內容策略\n- 智能內容系統根據不同患者需求自動調整訊息\n- AI輔助創作系統產生引人共鳴的專業內容\n\n3. 智慧化行銷優化\n- 實時投放效益分析與自動調整\n- 多管道協同最佳化，提升整體轉換率\n\n4. 診所運營智能化\n- 智能預約系統改善患者體驗\n- 自動化跟進機制提升回診率\n\n我們的AI技術不是為了取代人性化服務，而是讓您能更專注於與患者建立真誠連結。透過數據洞察和流程優化，您將能提供更貼心、更個人化的醫療體驗。',
    category: 'AI應用'
  },
  {
    question: '如何評估行銷投資的實際回報？',
    answer: '醫療行銷不應是模糊的開支，而是能清楚衡量成效的策略性投資。\n\n我們建立全方位的ROI追蹤系統，讓每一分投資都能量化評估：\n\n1. 診所關鍵績效指標\n- 新患成長率：追蹤不同管道帶來的新患數量與品質\n- 預約轉換率：評估從諮詢到實際就診的轉換效率\n- 患者生命週期價值：分析長期患者價值而非單次就診\n\n2. 即時監控儀表板\n- 專屬數據中心，隨時查看行銷成效\n- 自動化報表，每週更新關鍵指標\n\n3. 投資報酬計算\n- 透明的成本效益分析\n- 不同行銷管道的投資回報比較\n\n我們的合作不是基於空泛的承諾，而是建立在實際績效上。平均而言，我們的客戶在6個月後能看到3-5倍的行銷投資回報，更重要的是，這些成長是可持續的，為診所建立長期競爭優勢。',
    category: '成效評估'
  },
  {
    question: '診所沒有大量預算，有適合的行銷方案嗎？',
    answer: '我們相信優質的醫療行銷不應該只是大型診所的專利，每一位認真執業的醫師都值得被更多患者看見。\n\n我們針對不同規模的診所設計了彈性的成長方案：\n\n1. 階段式成長模型\n- 從核心基礎建設開始，逐步擴展行銷範疇\n- 優先投資高回報管道，確保資源最大化運用\n\n2. 精準小預算策略\n- 聚焦區域性目標患者，不浪費預算在無效觸及\n- 善用免費或低成本管道，如Google商家檔案優化、社群自然成長策略\n\n3. 合作共贏模式\n- 彈性付費機制，部分報酬與實際成效連結\n- 成長顧問角色，教導診所團隊逐步建立自主行銷能力\n\n我們深信：重要的不是行銷預算的大小，而是策略的精準度。許多我們最成功的案例，都是從小規模合作開始，隨著初期成效顯現，再逐步擴大投資範圍。',
    category: '成本效益'
  },
  {
    question: '如何確保行銷內容同時專業又具吸引力？',
    answer: '醫療內容的挑戰在於：如何在保持專業的同時，創造具有溫度且易於理解的訊息。\n\n我們的醫療內容創作流程特別設計來平衡這兩個面向：\n\n1. 醫療知識轉譯\n- 與診所專業團隊深度訪談，掌握核心醫療知識\n- 將複雜醫療概念轉化為患者易懂的說明，不失真也不過度簡化\n\n2. 故事性內容架構\n- 透過真實案例與敘事手法，增加內容的共鳴性\n- 運用視覺化圖解，幫助患者理解專業概念\n\n3. 多層次內容策略\n- 針對不同知識需求的患者，提供深淺不同的內容\n- 從基礎衛教到專業解析，滿足不同患者的資訊需求\n\n4. 專業審核機制\n- 所有內容經過醫療專業人員審核，確保準確性\n- 同時經過行銷專家評估，確保傳播效果\n\n我們創作的內容不只是訊息的傳遞，更是建立您與患者之間的信任橋樑。當患者能真正理解您提供的專業價值，信任與選擇就自然形成了。',
    category: '內容策略'
  },
  {
    question: '需要多久才能看到行銷成效？',
    answer: '醫療行銷是建立長期信任的過程，而非速效方案。但這不代表您需要等待很久才能看到成果。\n\n我們的行銷策略設計結合短期成效與長期建設：\n\n1. 階段性成效時程\n- 初期(1-2個月)：完成基礎建設，數據追蹤系統上線\n- 中期(3-4個月)：開始看到預約諮詢增加，品牌聲量提升\n- 成熟期(6個月後)：穩定的新患成長，回診率提升，品牌影響力擴大\n\n2. 策略性資源分配\n- 短期：優化已有管道效能，提升即時轉換\n- 中期：拓展內容資產，增加自然流量\n- 長期：建立品牌權威，發展忠誠患者社群\n\n每間診所的起點不同，成效展現的時程也會有所差異。我們會在合作初期，根據您的具體情況設定合理的期望值，並透過定期進度檢視，確保策略持續朝目標前進。\n\n重要的是，一旦正向循環建立，成效會呈指數型成長 - 這是我們所有成功案例的共同特點。',
    category: '成效評估'
  },
  {
    question: '如何讓我的診所在眾多競爭中脫穎而出？',
    answer: '在競爭激烈的醫療市場中，真正的差異化來自於診所獨特價值的精準傳達，而非單純的促銷或價格戰。\n\n我們協助診所建立真實而獨特的品牌定位：\n\n1. 價值主張梳理\n- 挖掘您診所的獨特優勢與專業特色\n- 定義最能幫助的理想患者群體\n- 明確表達為何患者應選擇您而非其他診所\n\n2. 真實差異化策略\n- 強調專業醫療團隊的獨特背景與專長\n- 突顯診所獨有的診療方法或設備優勢\n- 展現您對患者關懷的獨特方式\n\n3. 一致性品牌體驗\n- 從線上到線下，建立統一的品牌感受\n- 患者旅程中每個接觸點都傳達核心價值\n- 培訓團隊成員成為品牌理念的實踐者\n\n我們相信，每間認真經營的診所都有其獨特的靈魂與價值。我們的使命，就是幫助這份價值被真正需要的患者看見並感受到。在這個過程中，您不需要做最大的診所，只需要成為最適合您目標患者的那一個。',
    category: '品牌策略'
  },
  {
    question: '如何整合線上行銷與診所實際營運？',
    answer: '最有效的醫療行銷不是獨立運作的，而是與診所日常營運緊密結合的有機整體。\n\n我們的整合式行銷方案確保線上策略能無縫連接到實際診所體驗：\n\n1. 全流程患者體驗設計\n- 從線上初次接觸到診所實際就診的完整旅程規劃\n- 確保患者在每個階段都能感受一致的專業與關懷\n\n2. 數位工具與診所系統整合\n- 線上預約系統與診所排程無縫對接\n- 患者溝通平台與CRM系統整合，確保訊息一致\n\n3. 診所團隊參與\n- 提供前台人員溝通技巧培訓，延續線上建立的關係\n- 與醫療團隊協作，確保行銷承諾與實際服務一致\n\n4. 雙向回饋機制\n- 收集患者就診體驗回饋，持續優化服務流程\n- 從實際診所情況調整行銷策略，確保真實可執行\n\n我們不只是您的行銷團隊，更是診所運營的策略夥伴。透過整合線上策略與實際營運，創造從吸引患者到留住患者的完整生態系統，實現診所的永續成長。',
    category: '綜合策略'
  }
];

// 動態引入CountUp以減少首屏加載大小
const CountUp = dynamic(() => import('react-countup'), {
  loading: () => <div className="text-2xl sm:text-3xl font-bold">99%</div>,
  ssr: false
})

// 更新 Hero Section 樣式
const HeroSection = memo(function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  // 標題數據 - 針對不同目標對象
  const titles = [
    {
      main: "數位精準驅動",
      sub: "專為真實醫療服務",
      target: "醫療診所",
      enMain: "Digital precision-driven",
      enSub: "tailored for authentic healthcare services"
    },
    {
      main: "打造專業形象",
      sub: "提升牙醫診所競爭力",
      target: "牙醫診所",
      enMain: "Building professional image",
      enSub: "enhancing dental clinic competitiveness"
    },
    {
      main: "連結病患信任",
      sub: "成就醫師專業品牌",
      target: "專業醫師",
      enMain: "Connecting patient trust",
      enSub: "establishing your professional brand"
    }
  ];

  // 追蹤當前顯示的標題
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  
  // 定期切換標題
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex(prevIndex => (prevIndex + 1) % titles.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  // 動畫變體
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
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
      className="relative min-h-[90vh] md:min-h-[85vh] flex items-center justify-center bg-primary overflow-hidden pt-16"
      role="banner"
      aria-label="網站主要橫幅"
    >
      {/* 背景層 - 簡潔扁平化設計 */}
      <div 
        className="absolute inset-0 z-0"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/95 z-10"></div>
        <motion.div 
          className="absolute inset-0 w-full h-full select-none pointer-events-none"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration: 0.8,
              ease: "easeOut"
            }
          }}
          style={{ willChange: 'transform' }}
        >
          <Image
            src="/images/medical-bg.jpg"
            alt="醫療背景"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-50"
          />
        </motion.div>
      </div>
      
      <div className="container-custom relative z-20 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* 標題和英文標語靠左對齊 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="px-4 sm:px-6 md:pl-8 lg:pl-12 transform-gpu"
          >
            <div className="flex flex-col">
              <div className="h-[160px] sm:h-[200px] md:h-[240px] lg:h-[280px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTitleIndex}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={heroTitleVariants}
                    className="font-bold text-white leading-tight md:leading-tight"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl">
                      {titles[currentTitleIndex].main}
                      <span className="block mt-2 font-extrabold text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:h-[3px] after:w-full after:bg-white/50">
                        {titles[currentTitleIndex].sub}
                      </span>
                    </h1>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            <div 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white max-w-3xl mt-3 mb-6 font-bold tracking-wide"
              suppressHydrationWarning
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTitleIndex}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={heroSubtitleVariants}
                  className="flex flex-col"
                >
                  <div className="inline-block text-white/90 mb-0.5 leading-tight">{titles[currentTitleIndex].enMain},</div>
                  <div className="inline-block font-extrabold bg-clip-text text-white leading-tight break-words hyphens-auto">{titles[currentTitleIndex].enSub}.</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* 下面的元素置中對齊 */}
          <div className="flex flex-col items-center px-4 sm:px-6">
            {/* 扁平化標籤設計 - 簡化邊框並提高對比 */}
            <div className="flex flex-wrap gap-3 mt-8 md:mt-12" style={{ willChange: 'transform' }}>
              {tags.map((tag, index) => (
                <motion.span
                  key={tag.id}
                  variants={tagAnimationVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  custom={index}
                  className="rounded-full text-xs sm:text-sm px-4 py-1.5 
                             bg-white/10 border border-white/20 
                             cursor-pointer hover:bg-white/15 transition-colors"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {tag.name}
                </motion.span>
              ))}
            </div>
            
            {/* 信任指標和簡短數據統計 */}
            <motion.div
              className="mt-6 mb-8 w-full transform-gpu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 md:mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: 0.5, 
                    duration: 0.4,
                    ease: "easeOut" 
                  }
                }}
                style={{ willChange: 'transform' }}
              >
                <div className="flex flex-col items-center">
                  <motion.div 
                    className="text-white text-2xl sm:text-3xl font-bold flex items-center"
                    variants={homePageAnimations.hero.stats}
                    initial="initial"
                    animate="animate"
                    transition={{ 
                      ...homePageAnimations.hero.stats.transition,
                      delay: 0.7 
                    }}
                  >
                    <CountUp
                      {...homePageAnimations.hero.countUp.satisfaction}
                      separator=","
                      enableScrollSpy={false}
                    />
                  </motion.div>
                  <span className="text-white/80 text-xs sm:text-sm mt-1 font-medium">客戶滿意度</span>
                </div>
                <div className="flex flex-col items-center">
                  <motion.div 
                    className="text-white text-2xl sm:text-3xl font-bold flex items-center"
                    variants={homePageAnimations.hero.stats}
                    initial="initial"
                    animate="animate"
                    transition={{ 
                      ...homePageAnimations.hero.stats.transition,
                      delay: 0.8 
                    }}
                  >
                    <CountUp
                      {...homePageAnimations.hero.countUp.cases}
                      separator=","
                      enableScrollSpy={false}
                    />
                  </motion.div>
                  <span className="text-white/80 text-xs sm:text-sm mt-1 font-medium">成功案例</span>
                </div>
                <div className="flex flex-col items-center">
                  <motion.div 
                    className="text-white text-2xl sm:text-3xl font-bold flex items-center"
                    variants={homePageAnimations.hero.stats}
                    initial="initial"
                    animate="animate"
                    transition={{ 
                      ...homePageAnimations.hero.stats.transition, 
                      delay: 0.9 
                    }}
                  >
                    <CountUp
                      {...homePageAnimations.hero.countUp.response}
                      separator=","
                      enableScrollSpy={false}
                    />
                  </motion.div>
                  <span className="text-white/80 text-xs sm:text-sm mt-1 font-medium">專業響應</span>
                </div>
              </motion.div>
          </motion.div>
          
          {/* 預約按鈕 - 純黑底白字扁平化設計 */}
          <motion.div
              className="mt-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
              <Link href="/contact" prefetch={true}>
              <motion.span 
                className="inline-flex items-center bg-red-600 text-white px-8 py-4 text-lg font-medium border-0"
                initial={{ y: 0 }}
                whileHover={{ 
                  y: -3,
                  boxShadow: '0 3px 0 rgba(255,255,255,0.3)',
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  y: 0,
                  boxShadow: '0 0px 0 rgba(255,255,255,0)',
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
                  免費30分鐘專業顧問
                <motion.span
                  className="ml-2"
                  initial={{ x: 0 }}
                    animate={{ 
                      x: [0, 5, 0],
                    transition: { 
                      repeat: Infinity, 
                      repeatType: "reverse", 
                        duration: 1.5 
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
      </div>

      {/* 向下滾動指示器 - 簡化設計 */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => document.getElementById('marketing-statement')?.scrollIntoView({ behavior: 'smooth' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white text-sm mb-2 font-medium">探索更多</span>
          <motion.div
            animate={homePageAnimations.hero.scrollIndicator.animate}
            className="w-8 h-8 flex items-center justify-center text-white bg-white/10"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
})

// 新增階梯式行銷文案區塊 - 優化渲染和圖片載入
const MarketingStatement = memo(function MarketingStatement() {
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
      className="relative py-16 md:py-24 bg-primary overflow-hidden"
      ref={ref}
    >
      {/* 背景設計 - 與 HeroSection 統一風格 */}
      <div className="absolute inset-0">
        {/* 純色背景 */}
        <div className="absolute inset-0 bg-primary"></div>
        
        {/* 使用不透明的白色線條背景圖片 */}
        <div className="absolute inset-0 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: 'url(/images/bgline-w.webp)' }}></div>
        
        {/* 背景覆蓋 - 調整透明度與 HeroSection 一致 */}
        <div className="absolute inset-0 bg-primary/20"></div>
      </div>
      
      <div className="container-custom relative z-10 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          {contentBlocks.map((block, index) => (
            <motion.div
              key={index}
              className={`mb-8 ${block.className}`}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? 
                { 
                  opacity: 1, 
                  x: 0,
                  transition: {
                    delay: block.delay,
                    duration: 0.4,
                    ease: "easeOut"
                  }
                } : 
                { opacity: 0, x: -20 }
              }
              style={{ willChange: 'transform' }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                <motion.div 
                  className="w-full md:w-5/12"
                  initial={{ opacity: 0, x: -15 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.3, 
                    delay: Math.min(block.delay + 0.1, 0.4)
                  }}
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight font-accent text-pretty relative group">
                    {block.en.title}
                    <div className="absolute left-0 bottom-[-5px] h-[3px] w-0 bg-white/30 transition-all duration-300 group-hover:w-full"></div>
                  </h2>
                  {block.en.subtitle && (
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mt-1 md:mt-2 leading-tight tracking-tight text-pretty relative group">
                      {block.en.subtitle}
                      <div className="absolute left-0 bottom-[-5px] h-[3px] w-0 bg-white/30 transition-all duration-300 group-hover:w-full"></div>
                    </h3>
                  )}
                </motion.div>
                
                <motion.div 
                  className="mt-3 md:mt-0 w-full md:w-6/12"
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: block.delay + 0.2
                  }}
                >
                  <div className="border-l-4 border-white/70 pl-4 md:pl-6">
                    <motion.p 
                      className="text-xl md:text-2xl lg:text-3xl text-white font-medium leading-tight relative will-change-transform"
                      initial={{ opacity: 0, y: 5 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ 
                        duration: 0.3, 
                        delay: Math.min(block.delay + 0.2, 0.5)
                      }}
                      whileHover={{ x: 3 }}
                    >
                      {block.zh.title}
                    </motion.p>
                    {block.zh.subtitle && (
                      <motion.p 
                        className="text-lg md:text-xl text-white/80 mt-1 md:mt-2 font-medium leading-tight relative will-change-transform"
                        initial={{ opacity: 0, y: 5 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ 
                          duration: 0.3, 
                          delay: Math.min(block.delay + 0.3, 0.6)
                        }}
                        whileHover={{ x: 3 }}
                      >
                        {block.zh.subtitle}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              </div>
              
              {/* 分隔線 - 提高對比度 */}
              {index < contentBlocks.length - 1 && (
                <motion.div 
                  className="w-full h-px bg-white/30 mt-6 md:mt-12 relative overflow-hidden"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={inView ? { scaleX: 1, opacity: 0.3 } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: block.delay + 0.5
                  }}
                >
                  <motion.div 
                    className="absolute top-0 left-0 h-full w-[30%] bg-white/50"
                    initial={{ x: "-100%" }}
                    animate={inView ? { x: "400%" } : {}}
                    transition={{
                      duration: 2,
                      delay: block.delay + 1,
                      repeat: Infinity,
                      repeatDelay: 4
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* 底部箭頭指示 - 扁平化設計 */}
        <motion.div 
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <motion.div
            className="text-white p-2 cursor-pointer hover:bg-white/10 transition-all"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
})

// 更新服務特色區塊
const FeatureSection = memo(function FeatureSection() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // 監控視窗大小，判斷是否為行動裝置
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 處理輪播控制
  const handleNext = useCallback(() => {
    setCurrentFeature(prev => (prev + 1) % features.length);
  }, []);
  
  const handlePrev = useCallback(() => {
    setCurrentFeature(prev => (prev - 1 + features.length) % features.length);
  }, []);
  
  // 自動輪播
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isMobile, handleNext]);
  
  return (
    <section id="features" className="py-16 sm:py-20 bg-gray-50 overflow-hidden" suppressHydrationWarning>
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <AnimatedSection className="text-center mb-12 sm:mb-20" suppressHydrationWarning>
          <h2 className="inline-flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 relative" suppressHydrationWarning>
              <Logo 
                variant="primary" 
                size="responsive" 
              className="mr-3 transform scale-90 sm:scale-100" 
                priority={true}
              />
            <span className="relative">
              專業團隊
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary"></div>
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            作為專注於<span className="text-primary font-medium">醫療產業</span>的數位行銷團隊，我們融合了臨床經驗、數位專業與創新技術，
            致力於幫助診所建立<span className="text-primary font-medium">品牌價值</span>，吸引理想患者，實現穩健成長
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            團隊由醫療背景與行銷專家組成，深入理解產業挑戰與機會，提供真正適合醫療環境的整合解決方案
          </p>
          

        </AnimatedSection>

        {/* 桌面版網格排列 */}
        <div className="hidden md:block">
        <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8"
          variants={animations.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title} 
              variants={animations.slideUp}
                className="group bg-white p-6 sm:p-7 lg:p-8 border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full hover:border-primary relative overflow-hidden"
              >
                {/* 頂部裝飾線 - 刪除 */}
                
                <div className="mb-5 sm:mb-6">
                  {React.createElement(feature.icon, { 
                    size: 32, 
                    strokeWidth: 1.5, 
                    className: "text-primary" 
                  })}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 flex-grow">
                  {feature.description}
                </p>
                
                <div className="mt-5 pt-2 border-t border-gray-100">
                  <div 
                    className="w-16 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
              </div>

        {/* 行動裝置輪播版本 */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div 
              ref={carouselRef}
              className="transition-transform duration-300 ease-out"
              style={{
                display: 'flex',
                transform: `translateX(-${currentFeature * 100}%)`
              }}
            >
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="min-w-full px-2"
                >
                  <motion.div 
                    className="group bg-white p-6 border border-gray-100 shadow-sm flex flex-col h-full hover:border-primary relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* 行動版頂部裝飾線 - 刪除 */}
                    
                    <div className="mb-5 flex justify-center">
                      {React.createElement(feature.icon, { 
                        size: 36, 
                        strokeWidth: 1.5, 
                        className: "text-primary" 
                      })}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {feature.title}
              </h3>
                    <p className="text-gray-600 text-center">
                {feature.description}
              </p>
              
                    <div className="mt-5 pt-2 border-t border-gray-100 flex justify-center">
                      <div className="w-16 h-0.5 bg-primary" />
              </div>
            </motion.div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 輪播控制 */}
          <div className="flex justify-between items-center mt-8">
            <button 
              onClick={handlePrev}
              className="bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:shadow-md transition-shadow hover:border-primary"
              aria-label="上一個特色"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="flex space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    currentFeature === index ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`查看特色 ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:shadow-md transition-shadow hover:border-primary"
              aria-label="下一個特色"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 新增團隊簡介區塊 */}
        <AnimatedSection className="mt-20 text-center" delay={0.3}>
          <div className="bg-white border border-gray-100 p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto relative">
            {/* 左側裝飾線 - 保留但調整透明度 */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary/30"></div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"><span className="text-primary">核心優勢</span>與多元背景</h3>
            <p className="text-gray-600 mb-6">
              Aidea:Med 匯集了醫療背景專家、數位行銷策略師、UI/UX 設計師、數據分析師及內容創作者，
              建立一個能夠真正理解醫療產業需求的多元團隊。我們不僅了解數據與行銷，
              更理解醫病關係的細微之處與醫療產業的獨特挑戰。
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 my-2 py-1">
              {[
                { id: 'medical', name: '#醫療專業背景' },
                { id: 'marketing', name: '#數位行銷策略' },
                { id: 'ai', name: '#AI技術應用' },
                { id: 'brand', name: '#品牌設計' },
                { id: 'uiux', name: '#UI/UX設計' },
                { id: 'data', name: '#數據分析' }
              ].map((tag, index) => (
                <motion.div
                  key={tag.id}
                  className="border border-primary/70 text-primary text-xs sm:text-sm md:text-base whitespace-nowrap px-3 sm:px-4 py-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                  whileHover={{
                    backgroundColor: "rgba(var(--color-primary-rgb), 0.05)",
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                >
                  {tag.name}
        </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
})

// 更新服務內容區塊 - 使用 Lucide 圖標
const services = [
  {
    title: '品牌蛻變',
    description: '讓您的診所從同質化競爭中脫穎而出。我們深入挖掘您的獨特價值，打造令人難忘的品牌識別，讓每位患者在踏入診所的那一刻，就能感受到您與眾不同的專業與溫度。',
    features: ['品牌故事梳理', '視覺形象重塑', '空間體驗設計', '診所文化建立', '差異化定位', '品牌語言系統'],
    icon: BuildingIcon,
    href: '/service#brand'
  },
  {
    title: '數位突圍',
    description: '在無數牙醫診所的網路戰場中脫穎而出。精準的數位行銷不只帶來流量，更能觸及真正需要您服務的患者。我們讓您的專業被看見，讓等待已久的患者找到您。',
    features: ['精準廣告投放', 'SEO關鍵詞優化', '社群互動經營', '口碑行銷策略', '內容創作規劃', '轉換率提升'],
    icon: GlobeIcon,
    href: '/service#digital'
  },
  {
    title: '全通路整合',
    description: '線上吸引、線下感動，打造完整患者旅程。我們深知，真正的成功不只來自新客引流，更在於建立長期患者關係。整合式行銷讓您的每一分投入都能產生最大價值。',
    features: ['線上線下整合', '患者旅程設計', '轉診系統建立', '複診召回機制', '忠誠度計畫', '口碑擴散策略'],
    icon: ChartIcon,
    href: '/service#marketing'
  },
  {
    title: '守護式客服',
    description: '您專注於治療，我們守護您的每一位患者。專業醫療背景的24小時真人客服團隊，不只是接聽諮詢，更能理解患者需求，化解疑慮，將每次互動轉化為信任與預約。',
    features: ['即時線上預約', '專業諮詢回覆', '全天候服務', '無縫轉接系統', '患者關係維護', '預約提醒服務'],
    icon: Headset,
    href: '/service#customer-service'
  },
  {
    title: '數據智慧',
    description: '讓數據說話，讓決策更明智。我們不只提供報表，更幫助您看見數字背後的洞察。透過先進分析工具，解讀患者行為模式，讓每一個營銷決策都建立在堅實的數據基礎上。',
    features: ['行為數據分析', '患者偏好洞察', '競爭格局解析', '投資回報追蹤', '關鍵指標監控', '成長預測模型'],
    icon: BarChart2,
    href: '/service#data-strategy'
  },
  {
    title: '醫療內容力',
    description: '將複雜的醫療專業，轉化為引人共鳴的內容。我們的團隊結合醫療專業與內容創作才能，讓您的專業知識不只精準，更能觸動人心，建立權威形象的同時擴大影響力。',
    features: ['醫療知識轉譯', '專業形象打造', '衛教內容設計', '影音腳本創作', '專家觀點系列', '受眾導向表達'],
    icon: FileText,
    href: '/service#content'
  }
]

// 更新服務內容區塊 - 使用扁平化現代設計
const ServiceSection = memo(function ServiceSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // 檢測視窗大小以決定是否為行動裝置
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 手動控制輪播 - 使用useCallback優化
  const handleNext = useCallback(() => {
    if (isMobile) {
      setCurrentSlide(prev => (prev + 1) % services.length);
    }
  }, [isMobile]);
  
  const handlePrev = useCallback(() => {
    if (isMobile) {
      setCurrentSlide(prev => (prev - 1 + services.length) % services.length);
    }
  }, [isMobile]);
  
  // 使用useCallback優化轉換輪播
  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);
  
  // 自動輪播設定
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % services.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isMobile]);
  
  return (
    <section className="relative py-20 bg-white overflow-hidden border-t border-gray-100" role="region" aria-label="服務內容">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            全方位<span className="text-red-600">診所成長</span>解決方案
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6 relative">
            <div className="absolute -left-2 top-0 w-2 h-1 bg-red-600 animate-pulse"></div>
            <div className="absolute -right-2 top-0 w-2 h-1 bg-red-600 animate-pulse"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            結合十年以上醫療產業經驗，為診所打造專屬成長策略，從品牌建立到數位行銷全面支援
          </p>
        </AnimatedSection>
        
        {/* 行動裝置輪播 */}
        {isMobile ? (
          <div className="relative px-6 md:px-0">
            <AnimatedSection className="overflow-visible">
            <motion.div 
                className="bg-white shadow-sm p-6 rounded-lg flex flex-col"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              >
                <div className="flex items-start mb-6">
                  <div className="mr-4">
                    <div className="w-12 h-12 flex items-center justify-center text-red-600">
                      {React.createElement(services[currentSlide].icon, { 
                        size: 24, 
                        strokeWidth: 1.5
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                      {services[currentSlide].title}
                    </h3>
                    <div className="w-12 h-0.5 bg-red-600 mt-2 mb-2 transform origin-left transition-all duration-300 group-hover:w-16"></div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  {services[currentSlide].description}
                </p>
                
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {services[currentSlide].features.map((feature, i) => (
                      <motion.span
                        key={i}
                        className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-md border border-red-100"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1, duration: 0.3 }}
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              {/* 輪播控制 */}
              <div className="flex justify-center items-center mt-8 gap-2">
                <button 
                  onClick={handlePrev}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 border border-red-600 text-white hover:bg-red-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex gap-2">
                  {services.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index ? 'bg-red-600 w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'
                      }`}
                      aria-label={`前往服務 ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={handleNext}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 border border-red-600 text-white hover:bg-red-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </AnimatedSection>
          </div>
        ) : (
          // 桌面版網格顯示
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <AnimatedSection 
                key={service.title} 
                delay={index * 0.15} 
                className="flex flex-col h-full"
              >
                <motion.div
                  className="bg-white shadow-sm rounded-lg p-6 flex flex-col h-full group"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="flex items-start mb-6">
                    <div className="mr-4">
                      <div className="w-12 h-12 flex items-center justify-center text-red-600">
                        {React.createElement(service.icon, { 
                          size: 24, 
                          strokeWidth: 1.5
                        })}
                  </div>
                    </div>
              
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                {service.title}
              </h3>
                      <div className="w-12 h-0.5 bg-red-600 mt-2 mb-2 transform origin-left transition-all duration-300 group-hover:w-16"></div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-4 flex-grow">
                {service.description}
              </p>
              
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.features.map((feature, i) => (
                        <motion.span
                          key={i}
                          className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-md border border-red-100"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.1, duration: 0.3 }}
                        >
                          {feature}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        )}
        
        <div className="mt-16 text-center">
          <AnimatedSection delay={0.6}>
            <Link 
              href="/service" 
              prefetch={true} 
              className="service-cta-button px-8 py-3 text-base font-medium rounded-md transition-all duration-200"
            >
              查看完整服務內容
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
})

type StatItem = {
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

type StatsSectionProps = {
  className?: string;
}

// 更新數據統計區塊
const StatsSection = memo(function StatsSection({ className = '' }: StatsSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [isMounted, setIsMounted] = useState(false);
  
  // 客戶端掛載處理
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 精選核心數據
  const stats: StatItem[] = [
    {
      value: 50,
      suffix: "+",
      label: "合作診所",
      description: "全台醫療網絡覆蓋",
      icon: <Stethoscope className="w-8 h-8 text-white" strokeWidth={1.5} />
    },
    {
      value: 700,
      suffix: "萬+",
      label: "月廣告投放",
      description: "精準投放策略",
      icon: <ChartIcon className="w-8 h-8 text-white" strokeWidth={1.5} />
    },
    {
      value: 98,
      suffix: "%",
      label: "客戶滿意度",
      description: "專業團隊品質保證",
      icon: <Handshake className="w-8 h-8 text-white" strokeWidth={1.5} />
    }
  ];

  return (
    <section 
      ref={ref} 
      className={`bg-red-600 py-16 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* 標題區塊 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            顯著成效數據
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto text-base sm:text-lg">
            多年實證數據驅動診所業務增長，提供可量化的成功案例與投資回報
          </p>
        </motion.div>

        {/* 統計數據卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div className="p-6 rounded-lg h-full flex flex-col border border-white/20">
                {/* 圖標 */}
                <div className="mb-4">
                        {stat.icon}
                    </div>
                    
                {/* 數據值 */}
                <div className="flex items-baseline mb-3">
                  <span className="text-4xl font-bold text-white tabular-nums">
                    {inView && isMounted ? (
                      <CountUp
                        start={0}
                        end={stat.value}
                        duration={2}
                        separator=","
                        decimals={0}
                        enableScrollSpy={false}
                      />
                    ) : (
                      stat.value
                    )}
                  </span>
                  <span className="text-xl font-bold text-white ml-1">{stat.suffix}</span>
                    </div>
                    
                {/* 標題與描述 */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {stat.label}
                    </h3>
                    
                <p className="text-white/90 text-sm">
                      {stat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
})

// 更新案例展示區塊 - 整合CaseStudiesSection和CaseShowcaseSection
const CaseStudiesSection = memo(function CaseStudiesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // 使用useReducer統一管理相關狀態
  type CaseState = {
    activeCategory: string;
    currentSlide: number;
    isMobile: boolean;
  };

  type CaseAction = 
    | { type: 'SET_CATEGORY'; payload: string }
    | { type: 'SET_SLIDE'; payload: number }
    | { type: 'SET_MOBILE'; payload: boolean }
    | { type: 'NEXT_SLIDE' }
    | { type: 'PREV_SLIDE'; totalLength: number };

  const initialState: CaseState = {
    activeCategory: 'all',
    currentSlide: 0,
    isMobile: false
  };

  const caseReducer = (state: CaseState, action: CaseAction): CaseState => {
    switch (action.type) {
      case 'SET_CATEGORY':
        return { ...state, activeCategory: action.payload, currentSlide: 0 };
      case 'SET_SLIDE':
        return { ...state, currentSlide: action.payload };
      case 'SET_MOBILE':
        return { ...state, isMobile: action.payload };
      case 'NEXT_SLIDE': {
        // 需要計算當前過濾後的案例長度
        const currentCases = casesData.filter(cs => 
          state.activeCategory === 'all' || cs.category === state.activeCategory
        );
        return { 
          ...state, 
          currentSlide: state.isMobile ? (state.currentSlide + 1) % currentCases.length : state.currentSlide 
        };
      }
      case 'PREV_SLIDE': {
        // 使用傳入的總長度參數
        return { 
          ...state, 
          currentSlide: state.isMobile ? (state.currentSlide - 1 + action.totalLength) % action.totalLength : state.currentSlide 
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(caseReducer, initialState);
  const { activeCategory, currentSlide, isMobile } = state;
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 使用useMemo記憶過濾後的案例數據，避免重複計算
  const filteredCases = useMemo(() => 
    activeCategory === 'all' 
      ? casesData 
      : casesData.filter(cs => cs.category === activeCategory),
    [activeCategory]
  );
  
  // 使用useMemo記憶類別列表，避免重複計算
  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(casesData.map(cs => cs.category)))],
    [casesData]
  );
  
  // 檢測視窗大小以決定是否為行動裝置，使用防抖處理
  useEffect(() => {
    const handleResize = () => {
      // 清除之前的計時器
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      
      // 設置新的計時器，實現防抖
      resizeTimerRef.current = setTimeout(() => {
        dispatch({ type: 'SET_MOBILE', payload: window.innerWidth < 768 });
      }, 150);
    };
    
    // 初始檢查
    handleResize();
    
    // 添加事件監聽
    window.addEventListener('resize', handleResize);
    
    // 清理函數
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, []);
  
  // 手動控制輪播 - 使用useCallback記憶函數
  const handleNext = useCallback(() => {
    dispatch({ type: 'NEXT_SLIDE' });
  }, [filteredCases.length]);
  
  const handlePrev = useCallback(() => {
    dispatch({ type: 'PREV_SLIDE', totalLength: filteredCases.length });
  }, [filteredCases.length]);
  
  // 自動輪播設定
  useEffect(() => {
    if (!isMobile || filteredCases.length <= 1) return;
    
    const interval = setInterval(() => {
      dispatch({ type: 'NEXT_SLIDE' });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isMobile, filteredCases.length]);
  
  // 切換分類 - 使用useCallback記憶函數
  const handleCategoryChange = useCallback((category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  }, []);

  // 切換輪播項 - 使用useCallback記憶函數
  const handleSlideChange = useCallback((index: number) => {
    dispatch({ type: 'SET_SLIDE', payload: index });
  }, []);

  return (
    <section ref={ref} className="relative py-16 md:py-24 bg-white overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            令人印象深刻的<span className="text-primary">成功案例</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
            探索我們如何協助醫療診所提升數位形象、打造專屬行銷策略，並獲得顯著的營運成果
          </p>
          
          {/* 分類標籤 - 扁平簡約設計 */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部案例
            </button>
            
            {categories.filter(cat => cat !== 'all').map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
                  </div>
                </motion.div>
              
        <AnimatePresence mode="wait">
          {inView && (
                <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {filteredCases.length > 0 ? (
                <>
                  {/* 桌面版網格顯示 */}
                  {!isMobile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                      {filteredCases.slice(0, 6).map((caseStudy, index) => (
                        <motion.div
                          key={caseStudy.id}
                          initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className={`${caseStudy.featured ? 'md:col-span-2 lg:col-span-1' : ''} group`}
                        >
                      <Link 
                        href={`/case/${caseStudy.id}`}
                        prefetch={true}
                        className="block h-full"
                      >
                            <div className="bg-white h-full p-6 hover:shadow-lg transition-all duration-300 rounded-lg flex flex-col items-center text-center">
                              {/* 圓形圖片，作為視覺焦點 */}
                              <div className="relative mb-5 transform group-hover:scale-105 transition-transform duration-300">
                                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mx-auto relative">
                                  <Image
                                    src={caseStudy.image || `/images/case-placeholder.jpg`}
                                    alt={caseStudy.name}
                                    fill
                                    sizes="(max-width: 768px) 160px, 192px"
                                    className="object-cover"
                                  />
                  </div>
                                
                                {/* 精選案例標籤，放在圖片上方 */}
                                {caseStudy.featured && (
                                  <span className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full transform translate-x-1/4">
                                    精選案例
                                  </span>
                                )}
      </div>
                              
                              {/* 類別標籤，獨立於圖片 */}
                              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
                                {caseStudy.category}
                              </span>
                              
                              <h3 className="font-bold text-gray-900 text-xl mb-3">{caseStudy.name}</h3>
                              
                              {/* 績效指標，突出顯示 */}
                              {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                                <div className="mb-5 flex justify-center space-x-6">
                                  {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
                                    <div key={idx} className="text-center">
                                      <span className="block font-bold text-primary text-xl">{metric.value}</span>
                                      <span className="text-xs text-gray-500">{metric.label}</span>
        </div>
                    ))}
                  </div>
                              )}
                              
                              {/* 僅顯示摘要文字 */}
                              <p className="text-gray-600 text-sm mb-5 line-clamp-2 flex-grow">
                                {caseStudy.description}
                              </p>
                              
                              {/* 查看案例按鈕 */}
                              <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                                <span className="inline-flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                                  查看案例
                                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="ml-1">
                                    <path d="M4.16666 10H15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10 4.16669L15.8333 10L10 15.8334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </span>
                    </div>
                  </div>
                          </Link>
                        </motion.div>
                      ))}
                </div>
                  ) : (
                    /* 行動版輪播顯示 - 所有案例使用同一輪播 */
                    <div className="mb-12">
                      {/* 當前案例卡片 */}
                      <div ref={carouselRef} className="mb-6">
                        <Link 
                          href={`/case/${filteredCases[currentSlide].id}`}
                          prefetch={true}
                          className="block"
                        >
                          <div className="bg-white border border-gray-200">
                            <div className="relative aspect-[4/3]">
                      <Image
                                src={filteredCases[currentSlide].image || `/images/case-placeholder.jpg`}
                                alt={filteredCases[currentSlide].name}
                                fill
                                sizes="100vw"
                                className="object-cover"
                                loading="lazy"
                      />
                              <div className="absolute top-0 left-0 right-0 flex justify-between p-2">
                                {filteredCases[currentSlide].featured && (
                                  <span className="bg-primary text-white text-xs font-medium px-2 py-1">
                                    精選案例
                                  </span>
                                )}
                                <span className="bg-black text-white text-xs font-medium px-2 py-1 ml-auto">
                                  {filteredCases[currentSlide].category}
                                </span>
                        </div>
                            </div>
                            
                            <div className="p-4">
                              <h3 className="font-bold text-gray-900 text-lg mb-2">
                                {filteredCases[currentSlide].name}
                              </h3>
                              
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {filteredCases[currentSlide].description}
                              </p>
                              
                              {/* 績效指標 */}
                              {filteredCases[currentSlide].metrics && filteredCases[currentSlide].metrics.length > 0 && (
                                <div className="mb-3 grid grid-cols-2 gap-2">
                                  {filteredCases[currentSlide].metrics.slice(0, 2).map((metric, idx) => (
                                    <div key={idx} className="flex items-center border-l-2 border-primary pl-2">
                                      <span className="font-bold text-primary text-sm">{metric.value}</span>
                                      <span className="text-xs text-gray-500 ml-1">{metric.label}</span>
                                    </div>
                                  ))}
                      </div>
                    )}
                              
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                <span className="text-xs text-gray-500">
                                  {filteredCases[currentSlide].solutions?.length || 0} 項解決方案
                                </span>
                                <span className="text-primary text-sm font-medium">查看案例</span>
                  </div>
                </div>
               </div>
                        </Link>
                      </div>
           
                      {/* 輪播控制 */}
                      <div className="flex items-center justify-between">
              <button 
                          onClick={handlePrev}
                          className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                          aria-label="上一個案例"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
                        <div className="flex items-center gap-1">
                          {filteredCases.map((_, index) => (
                <button
                  key={index}
                              onClick={() => handleSlideChange(index)}
                              className={`w-2 h-2 transition-all duration-300 ${
                                currentSlide === index ? 'bg-primary w-6' : 'bg-gray-300'
                              }`}
                              aria-label={`前往案例 ${index + 1}`}
                />
              ))}
                        </div>
              
              <button 
                          onClick={handleNext}
                          className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                          aria-label="下一個案例"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
                  )}
                </>
              ) : (
                <div className="text-center p-10 bg-white border border-gray-200 mb-12">
                  <p className="text-gray-500">目前沒有符合此類別的案例</p>
        </div>
              )}
              
              {/* 查看更多按鈕 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-center"
              >
                <Link 
                  href="/case" 
                  prefetch={true} 
                  className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 font-medium hover:bg-primary-dark transition-colors duration-300"
                >
                  查看全部案例
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ml-2">
                    <path d="M4.16666 10H15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 4.16669L15.8333 10L10 15.8334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
})

// 更新 FAQ 區塊 - 優化渲染和狀態管理
const FAQSection = memo(function FAQSection() {
  // 使用 useReducer 統一管理 FAQ 狀態
  type FaqState = {
    activeIndex: number | null;
    activeCategory: string;
  }

  type FaqAction = 
    | { type: 'SET_CATEGORY'; payload: string }
    | { type: 'TOGGLE_FAQ'; payload: number };

  const initialState: FaqState = {
    activeIndex: null,
    activeCategory: 'all'
  };

  const faqReducer = (state: FaqState, action: FaqAction): FaqState => {
    switch (action.type) {
      case 'SET_CATEGORY':
        return { activeCategory: action.payload, activeIndex: null };
      case 'TOGGLE_FAQ':
        return { 
          ...state, 
          activeIndex: state.activeIndex === action.payload ? null : action.payload 
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(faqReducer, initialState);
  const { activeIndex, activeCategory } = state;
  
  // 使用 useMemo 記憶類別列表，避免重複計算
  const categories = useMemo(() => 
    Array.from(new Set(faqs.map(faq => faq.category))),
    [faqs]
  );
  
  // 使用 useMemo 記憶過濾後的 FAQ 列表，避免重複計算
  const filteredFaqs = useMemo(() => 
    activeCategory === 'all' 
    ? faqs 
      : faqs.filter(faq => faq.category === activeCategory),
    [activeCategory, faqs]
  );

  // 使用 useCallback 記憶函數，減少不必要的重新渲染
  const handleTabChange = useCallback((category: string) => {
    React.startTransition(() => {
      dispatch({ type: 'SET_CATEGORY', payload: category });
    });
  }, []);
  
  const toggleFaq = useCallback((index: number) => {
    dispatch({ type: 'TOGGLE_FAQ', payload: index });
  }, []);

  // 使用 useRef 追蹤元素
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section ref={sectionRef} className="py-20 bg-white overflow-hidden border-t border-gray-100">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            常見<span className="text-primary">問答集</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
            以下是診所院長常問的問題，如果您有其他疑問，歡迎隨時與我們聯繫
          </p>
        </motion.div>
        
        {/* 分類標籤 - 扁平簡約設計，與案例區保持一致 */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部問題
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleTabChange(category)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* FAQ列表 - 優化載入 */}
        <div className="max-w-3xl mx-auto">
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {filteredFaqs.length > 0 ? (
                  <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
                      <FaqItem 
                        key={`${activeCategory}-${faq.question}`} 
                        faq={faq} 
                        index={index} 
                        isOpen={activeIndex === index} 
                        toggle={() => toggleFaq(index)} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-10 bg-white border border-gray-200 mb-12">
                    <p className="text-gray-500">此分類下暫無常見問題</p>
                  </div>
                )}
              </motion.div>
          </AnimatePresence>
          </Suspense>
          
          {/* 聯絡我們按鈕 */}
            <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center mt-10"
          >
            <Link 
              href="/contact" 
              prefetch={true} 
              className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 font-medium hover:bg-primary-dark transition-colors duration-300"
            >
              更多問題諮詢
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ml-2">
                <path d="M4.16666 10H15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 4.16669L15.8333 10L10 15.8334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            </motion.div>
        </div>
      </div>
    </section>
  );
})

interface FaqItemProps {
  faq: {
    question: string;
    answer: string;
    category: string;
  };
  index: number;
  isOpen: boolean;
  toggle: () => void;
}

// 優化 FAQ 項目以減少不必要的渲染
const FaqItem = memo(({ faq, index, isOpen, toggle }: FaqItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200"
      layout
      >
        <button
          onClick={toggle}
          className="w-full px-5 py-4 text-left flex items-center justify-between focus:outline-none"
        aria-expanded={isOpen}
      >
        <h3 className="font-medium text-base md:text-lg text-gray-900">{faq.question}</h3>
        <div className={`text-primary transition-transform duration-200 transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              className="overflow-hidden"
            >
            <div className="px-5 pb-5 pt-0">
              <div className="pt-3 border-t border-gray-100">
                <div className="prose prose-sm max-w-none text-gray-600">
                {faq.answer.split('\n\n').map((paragraph, i) => (
                    <p key={i} className={`${i > 0 ? 'mt-3' : ''}`}>
                    {paragraph}
                  </p>
                ))}
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    {faq.category}
                  </span>
                </div>
              </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.div>
  );
});

// 聯絡區塊 - 使用 Suspense 優化載入
const ContactSection = memo(function ContactSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="contact" className="py-20 bg-white overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            立即獲得<span className="text-primary">專屬診所</span>行銷解決方案
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
            填寫下方表單，我們將為您提供免費診所行銷策略諮詢，為您的診所找到最合適的解決方案
          </p>
        </motion.div>
        
        <div ref={ref} className="max-w-6xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            <motion.div 
              className="lg:col-span-3 bg-white rounded-lg shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-1.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20">
                <div className="bg-white p-6 md:p-8">
                  <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>}>
              <ContactForm animation={true} />
                  </Suspense>
            </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white p-8 rounded-lg flex flex-col h-full relative border border-gray-100 shadow-sm">
                {/* 移除圓形裝飾元素 */}
                
                <div className="relative z-10">
                  <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>}>
              <ContactInfo animation={true} />
                  </Suspense>
            </div>
          </div>
            </motion.div>
          </motion.div>
          
          {/* 簡化信任徽章區域 */}
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="text-center">
              <span className="block text-gray-400 text-sm mb-6">我們值得您的信任</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
              {['安全支付', '專業團隊', '免費諮詢', '滿意保證'].map((text, index) => (
                <motion.div 
                  key={text}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index }}
                >
                  <div className="text-primary text-2xl mb-3">
                    {index === 0 && <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /><line x1="7" x2="7" y1="15" y2="15" /></svg>}
                    {index === 1 && <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                    {index === 2 && <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                    {index === 3 && <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>}
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
})

// 特性卡片組件 - 優化並移除不必要的 memo
const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  return (
    <AnimatedSection delay={index} className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 h-full flex flex-col">
      <div className="mb-4 text-primary">
        {React.createElement(feature.icon, { 
          size: 28,
          strokeWidth: 2,
          className: "text-primary" 
        })}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
    </AnimatedSection>
  );
};

// 優化的統計數字組件
const StatItem = ({ value, title, symbol, delay }: { 
  value: number, 
  title: string, 
  symbol?: string,
  delay: number 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {inView && (
          <CountUp
            start={0}
            end={value}
            duration={2.5}
            separator=","
            decimals={0}
            decimal="."
            suffix={symbol}
            delay={delay * 0.3}
          />
        )}
      </div>
      <p className="text-gray-600">{title}</p>
    </div>
  );
};

// 錯誤邊界組件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-xl text-red-600 mb-2">發生錯誤</h2>
          <p className="text-gray-700">載入內容時發生問題，請重新整理頁面</p>
        </div>
      );
    }

    return this.props.children;
  }
}


// 客戶見證資料定義
interface ClientTestimonial {
  id: string;
  content: string;
  author: string;
  role: string;
  imageUrl: string;
}

// 客戶見證數據
const clientTestimonials: ClientTestimonial[] = [
  {
    id: 'testimonial1',
    content: 'Aidea:Med 團隊對醫療產業的理解讓我們感到非常驚喜，他們不僅提供數位行銷服務，更理解診所經營者的真正需求，為我們打造真正符合專業形象又能吸引患者的品牌。',
    author: '張醫師',
    role: '微笑牙醫診所 院長',
    imageUrl: '/images/testimonial-1.jpg'
  },
  {
    id: 'testimonial2',
    content: '與 Aidea:Med 合作讓我們診所的數位轉型過程非常順利，他們提供的 24 小時客服代營運服務，讓我們能夠專注於臨床治療，同時不錯過任何潛在客戶的諮詢。',
    author: '李醫師',
    role: '康橋植牙中心 創辦人',
    imageUrl: '/images/testimonial-2.jpg'
  },
  {
    id: 'testimonial3',
    content: '從品牌重塑到數位行銷策略的執行，Aidea:Med 都展現了極高的專業度。他們的團隊真正理解醫療產業的獨特挑戰，並提供了定制化的解決方案，幫助我們在競爭激烈的市場中脫穎而出。',
    author: '王醫師',
    role: '美學牙醫診所 負責人',
    imageUrl: '/images/testimonial-3.jpg'
  }
];

// 客戶見證區塊 - 使用與案例區相同的設計語言
const TestimonialSection = memo(function TestimonialSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // 輪播狀態管理
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);
  
  // 處理輪播控制
  const handleNext = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % clientTestimonials.length);
  }, []);
  
  const handlePrev = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + clientTestimonials.length) % clientTestimonials.length);
  }, []);
  
  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);
  
  // 自動輪播
  useEffect(() => {
    if (!inView) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [inView, handleNext]);

  return (
    <section ref={ref} className="py-20 bg-white overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-3 px-4 py-1.5 bg-primary/10 rounded-md text-sm">真實心聲</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            來自診所<span className="text-primary">客戶的評價</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
            我們引以為傲的不只是我們的專業，更是每位客戶的成功與肯定
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* 輪播區域 */}
          <div ref={testimonialRef} className="mb-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`testimonial-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-8 sm:p-10 rounded-lg flex flex-col items-center text-center relative shadow-sm border border-gray-100"
              >
                {/* 引號裝飾 */}
                <div className="absolute top-4 left-4 text-gray-100 text-5xl sm:text-6xl font-serif">"</div>
                <div className="absolute bottom-4 right-4 text-gray-100 text-5xl sm:text-6xl font-serif rotate-180">"</div>
                
                {/* 圓形圖片 */}
                <div className="relative mb-6 z-10">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mx-auto relative">
                    <Image
                      src={clientTestimonials[currentSlide].imageUrl}
                      alt={clientTestimonials[currentSlide].author}
                      fill
                      sizes="(max-width: 768px) 96px, 128px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                
                {/* 內容 */}
                <p className="text-gray-600 text-base md:text-lg mb-8 relative z-10 max-w-2xl mx-auto">
                  {clientTestimonials[currentSlide].content}
                </p>
                
                {/* 作者 */}
                <div className="mt-auto">
                  <h4 className="font-bold text-gray-900 text-lg md:text-xl">{clientTestimonials[currentSlide].author}</h4>
                  <p className="text-sm md:text-base text-gray-500">{clientTestimonials[currentSlide].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* 輪播控制區 */}
          <div className="flex items-center justify-between max-w-md mx-auto">
            <button
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-primary hover:text-white rounded-full transition-colors"
              aria-label="上一個見證"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* 輪播指示器 */}
            <div className="flex space-x-2">
              {clientTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlide === index 
                      ? 'bg-primary w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`切換到第 ${index + 1} 個見證`}
                  aria-current={currentSlide === index ? 'true' : 'false'}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-primary hover:text-white rounded-full transition-colors"
              aria-label="下一個見證"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
})

// HomePage組件 - 使用 React.lazy 進行代碼分割與 Suspense 優化整體渲染
const HomePage = () => {
  // 使用useState進行狀態管理 - 使用最小需要的狀態
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  
  // 使用useCallback優化處理函數
  const handleTestimonialChange = useCallback((index: number) => {
    React.startTransition(() => {
      setActiveTestimonialIndex(index);
    });
  }, []);
  
  const toggleFaq = useCallback((index: number) => {
    setActiveFaqIndex(prev => prev === index ? null : index);
  }, []);

  // 使用useMemo來提供狀態值，避免不必要的重新渲染
  const testimonialProps = useMemo(() => ({
    activeIndex: activeTestimonialIndex,
    onChange: handleTestimonialChange
  }), [activeTestimonialIndex, handleTestimonialChange]);

  const faqProps = useMemo(() => ({
    activeIndex: activeFaqIndex,
    onToggle: toggleFaq
  }), [activeFaqIndex, toggleFaq]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        {/* 核心區塊 - 不使用懶加載以加速首屏渲染 */}
        <HeroSection />
        <MarketingStatement />
        
        {/* 將非首屏必要組件延遲加載 */}
        <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <FeatureSection />
        </Suspense>
        
        <StatsSection />
        
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <ServiceSection />
        </Suspense>
        
        {/* 次要區塊 - 使用Suspense進行懶加載 */}
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <CaseStudiesSection />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <TestimonialSection />
        </Suspense>
        
        <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <FAQSection />
        </Suspense>
        
        <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <ContactSection />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default HomePage; 