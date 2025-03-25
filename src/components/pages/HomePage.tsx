'use client'

import React, { useEffect, useState, useCallback, useMemo, useRef, Suspense, use } from 'react'
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
  UserCog,
  Building2 as BuildingIcon,
  Globe as GlobeIcon,
  BarChart as ChartIcon
} from 'lucide-react'
import Image from 'next/image'
import { Logo, CTASection } from '@/components/common'

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

// 優化後的動畫Section組件 - 使用React 19更好的記憶體模型
const AnimatedSection = React.memo(({ className = '', delay = 0, children, suppressHydrationWarning }: AnimatedSectionProps) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  // 使用useCallback優化效能
  const handleAnimation = useCallback(() => {
    if (inView) {
      controls.start({ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, delay: delay * 0.2 }
      })
    }
  }, [controls, inView, delay])

  useEffect(() => {
    handleAnimation()
  }, [handleAnimation])

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
})
AnimatedSection.displayName = 'AnimatedSection'

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
      className="relative min-h-[90vh] md:min-h-[85vh] flex items-center justify-center bg-primary overflow-hidden"
      role="banner"
      aria-label="網站主要橫幅"
    >
      {/* 背景層 - 優化扁平化設計 */}
      <div className="absolute inset-0 z-0">
        {/* 純色背景基底 */}
        <div className="absolute inset-0 bg-primary"></div>
        
        {/* 紋理圖樣疊加 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
        
        {/* 背景圖片 */}
        <Image
          src="/images/bgline-w.webp"
          alt="背景紋理"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover mix-blend-soft-light opacity-40"
          loading="eager"
          fetchPriority="high"
        />
        
        {/* 漸層覆蓋 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/50 to-primary"></div>
      </div>
      
      <div className="container-custom relative z-20 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-center px-4 sm:px-6"
          >
            <h1 
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6"
              suppressHydrationWarning
            >
              數位精準驅動<br/>
              <span className="font-bold text-white">專為真實醫療服務</span>
            </h1>
            
            <p 
              className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mt-4 mb-8"
              suppressHydrationWarning
            >
              Digital precision-driven,<br/>
              tailored for authentic healthcare services.
            </p>
            
            {/* 扁平化標籤設計 - 簡化邊框並提高對比 */}
            <div className="flex flex-nowrap justify-center overflow-x-auto scrollbar-hide gap-3 sm:gap-4 my-10 px-2 py-1 max-w-full mx-auto">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-max mx-auto">
                {tags.map((tag, index) => (
                  <motion.div
                    key={tag.id}
                    className="border border-white/70 text-white text-xs sm:text-sm md:text-base whitespace-nowrap px-3 sm:px-4 py-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    whileHover={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {tag.name}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* 預約按鈕 - 純黑底白字扁平化設計 */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link href="/contact">
              <motion.span 
                className="inline-flex items-center bg-black text-white px-8 py-4 text-lg font-medium border-0"
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
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
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
      className="relative py-16 md:py-24 bg-primary overflow-hidden"
      ref={ref}
    >
      {/* 背景設計 - 扁平化並增加視覺層次 */}
      <div className="absolute inset-0">
        {/* 純色背景 */}
        <div className="absolute inset-0 bg-primary"></div>
        
        {/* 網格圖案覆蓋 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        
        {/* 背景圖片覆蓋 */}
        <Image
          src="/images/bgline-w.webp"
          alt="背景紋理"
          fill
          className="object-cover mix-blend-overlay opacity-30"
          quality={90}
          sizes="100vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAADNJREFUCJmNzrENACAMA0E/eyjYfwQqKDINj5IsnO7FIklFbMUUupnTNdKp7kOzBf+KCw1oBBzpaAHVAAAAAElFTkSuQmCC"
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                <motion.div 
                  className="w-full md:w-5/12"
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: block.delay + 0.1
                  }}
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight font-accent text-pretty">
                    {block.en.title}
                  </h2>
                  {block.en.subtitle && (
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mt-1 md:mt-2 leading-tight tracking-tight text-pretty">
                      {block.en.subtitle}
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
                  <div className="border-l-4 border-white pl-4 md:pl-6">
                    <motion.p 
                      className="text-xl md:text-2xl lg:text-3xl text-white font-medium leading-tight"
                      initial={{ opacity: 0, y: 10 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ 
                        duration: 0.4, 
                        delay: block.delay + 0.3
                      }}
                    >
                      {block.zh.title}
                    </motion.p>
                    {block.zh.subtitle && (
                      <motion.p 
                        className="text-lg md:text-xl text-white/90 mt-1 md:mt-2 font-medium leading-tight"
                        initial={{ opacity: 0, y: 10 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ 
                          duration: 0.4, 
                          delay: block.delay + 0.4
                        }}
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
                  className="w-full h-px bg-white/30 mt-6 md:mt-12"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={inView ? { scaleX: 1, opacity: 0.3 } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: block.delay + 0.5
                  }}
                />
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
    <section id="features" className="py-16 sm:py-20 bg-gray-50 overflow-hidden" suppressHydrationWarning>
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <AnimatedSection className="text-center mb-10 sm:mb-16" suppressHydrationWarning>
          <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10">我們的優勢</span>
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
          variants={animations.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title} 
              variants={animations.slideUp}
              className="group bg-white p-4 sm:p-6 lg:p-8 border border-gray-100 hover:border-primary transition-all duration-300"
            >
              <div className="mb-4 sm:mb-6">
                <div 
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 flex items-center justify-center group-hover:bg-primary transition-colors duration-300"
                >
                  <feature.icon 
                    size={24} 
                    strokeWidth={1.5} 
                    className="text-primary group-hover:text-white transition-colors duration-300" 
                  />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-4 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 line-clamp-3 sm:line-clamp-none">
                {feature.description}
              </p>
              
              <div className="mt-4 pt-2 border-t border-gray-100">
                <div 
                  className="w-6 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
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
    title: '品牌策略與視覺識別',
    description: '建立強大的牙醫診所品牌識別，從院所精神到視覺設計，創造一致性的品牌體驗',
    features: ['品牌策略規劃', '視覺識別設計', '診所空間規劃', '品牌故事建立'],
    icon: BuildingIcon,
    href: '/service#brand'
  },
  {
    title: '數位行銷與媒體整合',
    description: '透過精準的數位行銷策略，提升診所線上能見度，吸引目標客群，轉化為實際到診',
    features: ['網站設計開發', 'SEO優化', '社群媒體策略', '內容行銷規劃'],
    icon: GlobeIcon,
    href: '/service#digital'
  },
  {
    title: '整合行銷服務',
    description: '結合線上線下資源，建立完整行銷漏斗，提升品牌知名度、患者轉換率與回診率',
    features: ['整合行銷策略', '患者體驗優化', '回診系統建立', '績效分析報告'],
    icon: ChartIcon,
    href: '/service#marketing'
  },
]

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
              <motion.div
                className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden"
                initial={{ scale: 1, rotate: 0 }}
                whileInView={{ 
                  rotate: [0, 10, 0],
                  transition: { 
                    duration: 0.8, 
                    delay: index * 0.1 + 0.2,
                    ease: "easeInOut" 
                  }
                }}
                whileHover={{
                  scale: 1.08,
                  boxShadow: "0 0 0 4px rgba(230, 39, 51, 0.15)"
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                {/* 背景動畫效果 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-primary to-primary-light opacity-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* 圖標容器 */}
                <motion.div
                  className="relative z-10"
                  whileHover={{ 
                    scale: [1, 1.2, 1],
                    transition: { 
                      duration: 0.6,
                      repeat: 0
                    }
                  }}
                >
                  <div className="flex items-center justify-center w-20 h-20 bg-primary/5 rounded-lg mb-6">
                    {React.createElement(service.icon, { className: "w-10 h-10 text-primary" })}
                  </div>
                </motion.div>
              </motion.div>
              
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
                <Link 
                  href={service.href as any} 
                  className="inline-flex items-center text-primary font-medium group"
                >
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
function StatsSection({ className = '' }: StatsSectionProps) {
  // 精簡的統計數據
  const stats: StatItem[] = [
    {
      value: 50,
      suffix: "+",
      label: "合作診所",
      description: "全台醫療網絡覆蓋",
      icon: <Stethoscope className="w-10 h-10 text-white" strokeWidth={1.5} />
    },
    {
      value: 700,
      suffix: "萬+",
      label: "月廣告投放",
      description: "精準投放策略",
      icon: <ChartIcon className="w-10 h-10 text-white" strokeWidth={1.5} />
    },
    {
      value: 12000,
      suffix: "萬+",
      label: "年廣告投放",
      description: "持續成長動能",
      icon: <GlobeIcon className="w-10 h-10 text-white" strokeWidth={1.5} />
    },
    {
      value: 98,
      suffix: "%",
      label: "客戶滿意度",
      description: "專業團隊品質保證",
      icon: <Handshake className="w-10 h-10 text-white" strokeWidth={1.5} />
    }
  ];

  return (
    <section className={`bg-primary py-20 ${className}`}>
      <div className="container-custom">
        {/* 標題區塊 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block text-white font-medium mb-4 px-5 py-1.5 border-l-2 border-white">
            <BarChart2 className="w-5 h-5 inline-block mr-2 -mt-0.5" /> 實證數據
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 heading-medical">
            顯著成效數據
          </h2>
          <div className="w-16 h-1 bg-white/30 mx-auto mb-5"></div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            多年實證數據驅動診所業務增長，提供可量化的成功案例與投資回報
          </p>
        </motion.div>

        {/* 統計數據網格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card bg-white/10 border-l-2 border-white/30 p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-6">
                {stat.icon}
              </div>
              
              <div className="stat-number text-white mb-3">
                <CountUp
                  start={0}
                  end={stat.value}
                  duration={2}
                  separator=","
                  decimals={0}
                  suffix={stat.suffix}
                  className="tabular-nums"
                />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                {stat.label}
              </h3>
              
              <p className="text-white/80">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* 註釋 */}
        <div className="text-center mt-16 text-white/50 text-sm border-t border-white/10 pt-6 max-w-xl mx-auto">
          *數據基於過去三年合作診所的實際統計 | 2021-2023年度報告
        </div>
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
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="grid grid-cols-12 gap-6 md:gap-8 mb-16"
                >
                  <div className="p-1 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                      <span className="block w-4 h-px bg-primary mr-3"></span>
                      精選案例
                    </h3>
                  </div>
                  
                  {/* 包裝在Link中並添加prefetch */}
                  <div className="col-span-12 lg:col-span-8">
                    <Link href={`/case/${featuredCase.id}`} prefetch={true} className="block">
                      <CaseCard
                        caseStudy={featuredCase}
                        index={0}
                        hasParentLink={true}
                      />
                    </Link>
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
                    <Link href="/case" prefetch={true} className="text-primary text-sm font-medium hover:underline">
                      查看全部
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {regularCases.map((caseStudy, index) => (
                      // 包裝在Link中並添加prefetch
                      <Link 
                        key={caseStudy.id}
                        href={`/case/${caseStudy.id}`}
                        prefetch={true}
                        className="block h-full"
                      >
                        <CaseCard
                          caseStudy={caseStudy}
                          index={index + 1}
                          hasParentLink={true}
                        />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* 查看更多案例按鈕 */}
              <div className="text-center mb-20">
                <Link
                  href="/case"
                  prefetch={true}
                  className="inline-flex items-center px-8 py-3 bg-primary text-white font-medium group transition-all duration-200 hover:bg-primary/90"
                >
                  查看更多案例
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
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
function TestimonialsSection({ activeIndex, handleChange }: { activeIndex: number; handleChange: (index: number) => void }) {
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setViewportSize('mobile');
      } else if (window.innerWidth < 1024) {
        setViewportSize('tablet');
      } else {
        setViewportSize('desktop');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simple fade animation variants
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <section className="relative py-20 md:py-28 bg-gray-50">
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-primary text-white py-1 px-4 mb-4">評價回饋</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            合作診所真實評價
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            聽聽我們的合作夥伴怎麼說。這些是來自實際使用我們平台的診所和醫療專業人員的真實評價。
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border-t border-b border-gray-100 p-8 md:p-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* 左側內容區 */}
                <div className="md:col-span-8 order-2 md:order-1">
                  <div className="flex mb-6">
                    {[...Array(testimonials[activeIndex].rating || 5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-6 h-1 bg-primary mr-1" 
                      />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-800 text-xl md:text-2xl font-light leading-relaxed mb-6">
                    "{testimonials[activeIndex].content}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <div className="mr-4">
                      <h3 className="font-semibold text-gray-900">{testimonials[activeIndex].name}</h3>
                      <p className="text-gray-500">{testimonials[activeIndex].title}</p>
                    </div>
                  </div>
                </div>
                
                {/* 右側圖片區 */}
                <div className="md:col-span-4 order-1 md:order-2 relative h-[200px] md:h-[300px]">
                  <div className="absolute inset-0 bg-gray-100 overflow-hidden">
                    {/* 使用條件渲染代替動態路徑以避免 Next.js 圖片優化問題 */}
                    {activeIndex === 0 && (
                      <Image
                        src="/testimonials/doctor1.jpg" 
                        alt={testimonials[activeIndex].name}
                        fill
                        style={{ 
                          objectFit: 'cover',
                          objectPosition: 'center 25%' // 更精確聚焦於臉部
                        }}
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="transition-transform duration-500"
                        priority
                      />
                    )}
                    {activeIndex === 1 && (
                      <Image
                        src="/testimonials/doctor2.jpg" 
                        alt={testimonials[activeIndex].name}
                        fill
                        style={{ 
                          objectFit: 'cover',
                          objectPosition: 'center 30%' // 更精確聚焦於臉部
                        }}
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="transition-transform duration-500"
                        priority
                      />
                    )}
                    {/* 對於空檔案的情況使用備用圖片 */}
                    {(activeIndex > 1) && (
                      <div className="w-full h-full flex items-center justify-center bg-primary-light">
                        <div className="text-5xl text-white font-bold">
                          {testimonials[activeIndex].name.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
               </div>
             </motion.div>
           </AnimatePresence>
           
          <div className="flex items-center justify-center mt-10">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => handleChange((activeIndex - 1 + testimonials.length) % testimonials.length)}
                className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center hover:border-primary transition-colors"
                aria-label="上一個評價"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="butt" strokeLinejoin="miter" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleChange(index)}
                  className={`w-3 h-3 ${activeIndex === index ? 'bg-primary' : 'bg-gray-300'} rounded-none transition-all duration-200 hover:bg-primary-light`}
                  aria-label={`轉到評價 ${index + 1}`}
                />
              ))}
              
              <button 
                onClick={() => handleChange((activeIndex + 1) % testimonials.length)}
                className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center hover:border-primary transition-colors"
                aria-label="下一個評價"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="butt" strokeLinejoin="miter" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 更新 FAQ Section 樣式
function FAQSection({ activeIndex, toggleFaq }: { activeIndex: number | null, toggleFaq: (index: number) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  
  // 從FAQ資料中提取所有類別
  const categories = ['全部', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  // 根據選定的類別過濾FAQ
  const filteredFaqs = selectedCategory === '全部' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">常見問題</h2>
          <div className="h-1 w-16 bg-red-600 mx-auto mb-6"></div>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            專業的醫療行銷顧問，解答您最關心的問題，協助您的診所在數位時代脫穎而出
          </p>
        </div>
        
        {/* 分類標籤列 */}
        <div className="flex flex-wrap justify-center mb-10 gap-2 md:gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* FAQ列表 */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => (
              <FaqItem key={faq.question} faq={faq} index={index} isOpen={activeIndex === index} toggle={() => toggleFaq(index)} />
            ))}
          </AnimatePresence>
          
          {filteredFaqs.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 bg-white rounded-md shadow-sm"
            >
              <p className="text-gray-500">此分類下暫無常見問題</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

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

const FaqItem = ({ faq, index, isOpen, toggle }: FaqItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: index * 0.05 } }}
      exit={{ opacity: 0 }}
      className="mb-4"
    >
      <div 
        className={`bg-white rounded-md shadow-sm border-l-4 ${
          isOpen ? 'border-red-600' : 'border-gray-200'
        } transition-colors duration-200`}
      >
        <button
          onClick={toggle}
          className="w-full px-5 py-4 text-left flex items-center justify-between focus:outline-none"
        >
          <div className="flex flex-col sm:flex-row sm:items-center">
            <h3 className="font-medium text-base md:text-lg">{faq.question}</h3>
            <span className="text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full mt-2 sm:mt-0 sm:ml-3 inline-block w-fit">
              {faq.category}
            </span>
          </div>
          <div className={`text-gray-400 transition-transform duration-200 transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
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
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 pt-0 text-gray-600">
                {faq.answer.split('\n\n').map((paragraph, i) => (
                  <p key={i} className={`${i > 0 ? 'mt-3' : ''} text-sm md:text-base`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

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

// 特性卡片組件 - 抽離並優化以減少重複渲染
const FeatureCard = React.memo(({ feature, index }: { feature: any, index: number }) => {
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
  )
})
FeatureCard.displayName = 'FeatureCard'

// 優化的統計數字組件
const StatItem = React.memo(({ value, title, symbol, delay }: { 
  value: number, 
  title: string, 
  symbol?: string,
  delay: number 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

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
  )
})
StatItem.displayName = 'StatItem'

// HomePage組件 - 優化渲染
const HomePage = () => {
  // 使用useState並確保初始值合理避免水合不匹配問題
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0)
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null)
  
  // 使用useMemo減少不必要的重複計算
  const filteredCases = useMemo(() => 
    casesData.slice(0, 3),
    []
  )
  
  // 使用useCallback優化事件處理函數
  const handleTestimonialChange = useCallback((index: number) => {
    setActiveTestimonialIndex(index)
  }, [])
  
  const toggleFaq = useCallback((index: number) => {
    setActiveFaqIndex(prevIndex => prevIndex === index ? null : index)
  }, [])

  // 優化渲染 - 使用React 19的更好記憶體模型
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <MarketingStatement />
      <StatsSection />
      <FeatureSection />
      <ServiceSection />
      <TestimonialsSection 
        activeIndex={activeTestimonialIndex}
        handleChange={handleTestimonialChange}
      />
      <FAQSection 
        activeIndex={activeFaqIndex}
        toggleFaq={toggleFaq}
      />
      <ContactSection />
    </div>
  )
}

export default React.memo(HomePage) 