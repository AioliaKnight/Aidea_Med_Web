'use client'

import React, { useEffect, useState, Suspense, useRef, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { 
  Stethoscope, 
  BarChart2, 
  Handshake,
  Award,
  TrendingUp,
  Users,
  Lightbulb,
  Target,
  Database,
  Brain,
  LineChart,
  ShoppingCart,
  Zap,
  Shield,
  Heart,
  Briefcase,
  CheckCircle,
  Star
} from 'lucide-react'
import { CTASection } from '@/components/common'
import { 
  heroTitleVariants
} from '@/utils/animations'

// 將常量移到文件頂部，避免重新創建
const TAGS = [
  { id: 'ai', name: '#AI' },
  { id: 'creativity', name: '#Creativity' },
  { id: 'design', name: '#Design Thinking' },
  { id: 'insight', name: '#Insight' }
];

const FEATURES = [
  {
    title: '專注醫療行銷交給專家',
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
];

// 動態載入組件，降低初始載入時間

// 這些組件目前未使用，但保留供未來功能使用
// const ContactForm = dynamic(() => import('@/components/contact/ContactForm'), {
//   loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" aria-hidden="true" />,
//   ssr: true
// })

// const ContactInfo = dynamic(() => import('@/components/contact/ContactInfo'), {
//   loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg" aria-hidden="true" />,
//   ssr: true
// })

// 將CountUp改為單獨的動態導入
const CountUp = dynamic(() => import('react-countup'), {
  loading: () => <div className="text-2xl sm:text-3xl font-bold">99%</div>,
  ssr: false
})

// 使用通用的 FAQ 組件
import { FAQSection } from '@/components/common'

// FAQ數據 - 基於EEAT原則重新設計，最關心問題置頂
const homeFAQs = [
  // 第一優先：成本與投資回報（最關心的問題）
  {
    question: '診所沒有大量預算，有適合的行銷方案嗎？',
    answer: '我們相信優質的醫療行銷不應該只是大型診所的專利，每一位認真執業的醫師都值得被更多患者看見。\n\n我們針對不同規模的診所設計了彈性的成長方案：\n\n1. 階段式成長模型\n- 從核心基礎建設開始，逐步擴展行銷範疇\n- 優先投資高回報管道，確保資源最大化運用\n\n2. 精準小預算策略\n- 聚焦區域性目標患者，不浪費預算在無效觸及\n- 善用免費或低成本管道，如Google商家檔案優化、社群自然成長策略\n\n3. 合作共贏模式\n- 彈性付費機制，部分報酬與實際成效連結\n- 成長顧問角色，教導診所團隊逐步建立自主行銷能力\n\n我們深信：重要的不是行銷預算的大小，而是策略的精準度。許多我們最成功的案例，都是從小規模合作開始，隨著初期成效顯現，再逐步擴大投資範圍。',
    category: '成本效益'
  },
  {
    question: '如何評估行銷投資的實際回報？',
    answer: '醫療行銷不應是模糊的開支，而是能清楚衡量成效的策略性投資。\n\n我們建立全方位的ROI追蹤系統，讓每一分投資都能量化評估：\n\n1. 診所關鍵績效指標\n- 新患成長率：追蹤不同管道帶來的新患數量與品質\n- 預約轉換率：評估從諮詢到實際就診的轉換效率\n- 患者生命週期價值：分析長期患者價值而非單次就診\n- 診所營收成長：透明追蹤月營收與季度成長指標\n\n2. 即時監控儀表板\n- 專屬數據中心，隨時查看行銷成效\n- 自動化報表，每週更新關鍵指標\n- 競爭對手分析與市場機會追蹤\n\n3. 投資報酬計算\n- 透明的成本效益分析\n- 不同行銷管道的投資回報比較\n- 季度績效檢討與策略調整建議\n\n我們的合作不是基於空泛的承諾，而是建立在實際績效上。平均而言，我們的客戶在6個月後能看到3-5倍的行銷投資回報，更重要的是，這些成長是可持續的，為診所建立長期競爭優勢。',
    category: '成效評估'
  },

  // 第二優先：專業能力與信任建立（EEAT核心）
  {
    question: 'Aidea:Med的專業背景和實戰經驗如何？',
    answer: '我們是台灣少數結合「電商級數據分析」與「醫療實務經驗」的行銷顧問團隊。\n\n創辦人團隊背景：\n- 電商產業深耕15年，操盤過億級營收專案\n- 實際投資經營連鎖牙醫診所，深度了解診所營運痛點\n- 服務超過50家醫療院所，涵蓋牙科、醫美、泌尿科等專科\n\n核心專業能力：\n1. 數據科學應用\n- Google Analytics認證專家\n- Facebook Blueprint行銷認證\n- 自主開發診所專用數據分析系統\n\n2. 醫療法規深度理解\n- 與醫事法律顧問長期合作\n- 熟悉衛福部醫療廣告相關法規\n- 協助診所建立合規的行銷SOP\n\n3. 實戰成功案例\n- 雅德思牙醫：12個月內新患成長280%\n- 雲天牙醫診所：數位轉型後營收提升350%\n- 好幸福泌尿科：品牌重塑後預約率提升200%\n\n我們不只是行銷公司，更是真正理解醫療生態的成長夥伴。',
    category: '團隊專業'
  },
  {
    question: '為什麼專科診所需要專業的行銷顧問？',
    answer: '在充滿競爭的醫療環境中，專業與信任是吸引患者的關鍵。\n\n許多優秀的醫師專注於提供卓越的診療服務，卻往往忽略了如何有效地傳達自身的專業價值。我們理解，您的時間應該專注在為患者提供最好的照護，而非鑽研數位行銷的複雜策略。\n\n專業醫療行銷顧問能彌補這個落差，我們不只是行銷團隊，更是您診所成長的合作夥伴。透過深入了解您的診療理念和特色，我們幫助您的專業被更多需要的患者看見，建立長遠的診所品牌價值，讓優質的醫療服務能觸及更廣泛的社群。\n\n專業行銷顧問的核心價值：\n- 節省您的寶貴時間，專注於醫療專業\n- 避免試錯成本，運用經驗與數據精準投放\n- 建立系統化流程，讓行銷效果可預測、可複製\n- 符合醫療法規，避免不必要的法律風險',
    category: '行銷基礎'
  },

  // 第三優先：合作流程與個人化服務
  {
    question: '您們如何理解我診所的特殊需求和市場定位？',
    answer: '每一間診所都有獨特的靈魂和故事，我們的首要任務就是傾聽和理解這個故事。\n\n我們的合作始於深度診斷階段，包含：\n\n1. 院長願景訪談（2-3小時深度對談）\n- 透過一對一深度對談，了解您對診所的願景、醫療理念與價值觀\n- 挖掘您最想幫助的患者類型及其需求\n- 分析您的競爭優勢與核心差異化\n\n2. 診所實地評估\n- 實地參訪您的診所環境與工作流程\n- 與醫療團隊互動，了解內部文化與專長\n- 患者動線分析與服務體驗評估\n\n3. 360度市場研究\n- 分析地區競爭環境與機會缺口\n- 確認目標患者群體的真實需求與痛點\n- 線上聲譽與品牌現狀全面檢視\n\n4. 客製化策略制定\n- 基於診斷結果制定專屬成長藍圖\n- 階段性目標設定與執行計畫\n- 團隊教育訓練與實作指導\n\n這個過程不只是資料收集，而是真正融入您的診所文化，感受您對醫療的熱忱與理念。唯有真正理解，才能打造出真實反映診所靈魂的行銷策略。',
    category: '合作流程'
  },
  {
    question: '合作開始後，多久可以看到具體成效？',
    answer: '醫療行銷是長期品牌建構的過程，但我們也理解診所需要看到階段性成果來建立信心。\n\n成效時程規劃：\n\n第1-2個月：基礎建設期\n- 完成診所品牌重塑與數位基礎建設\n- 網站優化、Google商家檔案完善\n- 初期SEO佈局，開始累積搜尋可見度\n- 預期效果：線上曝光度提升20-30%\n\n第3-4個月：成長啟動期\n- 精準廣告投放策略啟動\n- 內容行銷開始產生自然流量\n- 口碑管理系統全面運作\n- 預期效果：新患諮詢量增加40-60%\n\n第5-6個月：加速成長期\n- 數據回饋優化，策略持續精進\n- 多管道協同效應顯現\n- 患者推薦系統開始發揮作用\n- 預期效果：整體新患成長80-120%\n\n第7-12個月：穩定擴張期\n- 建立可持續的成長循環\n- 品牌價值顯著提升\n- 診所在區域市場建立領導地位\n- 預期效果：年營收成長150-300%\n\n我們承諾在第3個月提供完整成效報告，如果未達到預期成果，我們將免費延長服務期直到達標為止。',
    category: '合作流程'
  },

  // 第四優先：技術與創新
  {
    question: 'AI技術如何應用在診所的數位行銷中？',
    answer: 'AI不只是流行詞彙，而是能為診所帶來實際價值的強大工具。我們運用最新AI技術，讓醫療行銷更精準、更有效。\n\n我們整合前沿AI技術與醫療行銷專業，為您的診所創造智慧化的成長策略：\n\n1. 智能患者洞察分析\n- AI驅動的大數據分析，精準了解患者行為模式\n- 預測性分析協助識別潛在高價值患者群體\n- 患者生命週期價值預測與優化策略\n\n2. 個人化內容自動生成\n- 智能內容系統根據不同患者需求自動調整訊息\n- AI輔助創作系統產生引人共鳴的專業內容\n- 多平台內容自動化排程與優化\n\n3. 智慧投放與轉換優化\n- 實時廣告效益分析與自動調整\n- 多管道歸因分析，找出最有效的觸點組合\n- AI驅動的預算配置優化\n\n4. 診所營運智能化\n- 智能預約系統改善患者體驗\n- 自動化跟進機制提升回診率\n- 客服機器人24/7回應患者詢問\n\n5. 競爭情報與趨勢預測\n- AI監控競爭對手動態與市場變化\n- 預測醫療趨勢，提前佈局行銷策略\n\n我們的AI技術不是為了取代人性化服務，而是讓您能更專注於與患者建立真誠連結。透過數據洞察和流程優化，您將能提供更貼心、更個人化的醫療體驗。',
    category: '技術創新'
  },

  // 第五優先：法規合規
  {
    question: '醫療行銷有什麼特殊的法規限制需要注意？',
    answer: '醫療行銷需要在專業、真實與合規之間取得平衡，我們深知這道平衡的重要性。\n\n醫療廣告受《醫療法》第85條與《醫療廣告管理辦法》嚴格規範，我們的專業團隊會確保所有行銷內容完全合規：\n\n1. 法規合規審核機制\n- 由具醫療背景的專業審稿團隊把關\n- 每項內容皆遵循醫療廣告法規標準審核\n- 與醫事法律顧問定期檢視合規性\n\n2. 避免常見法律陷阱\n- 不使用明確療效保證或誇大宣傳\n- 不進行不當價格比較或促銷手法\n- 患者見證遵循合規處理方式\n- 避免使用禁用詞彙與不當比較\n\n3. 專業表達技巧\n- 運用合規的敘事方式傳達專業價值\n- 以衛教資訊取代直接療效宣傳\n- 建立專業權威而非商業推銷的品牌形象\n\n4. 持續法規更新\n- 密切關注衛福部最新規範變化\n- 定期更新行銷內容符合最新法規\n- 提供診所團隊法規教育訓練\n\n我們的行銷策略不僅是合規的，更是能有效傳達您專業價值的。在我們的合作過程中，您也將了解如何在法規框架內，最大化地展現診所的專業與特色。',
    category: '法規合規'
  },

  // 新增EEAT原則相關問答
  {
    question: '如何證明Aidea:Med的服務品質和可信度？',
    answer: '透明度和可驗證的成果是我們建立信任的基石。\n\n我們的可信度證明：\n\n1. 真實案例與數據\n- 雅德思牙醫：合作18個月，新患成長280%，可提供詳細數據報告\n- 雲天牙醫連鎖：數位轉型專案，營收從單月200萬提升至700萬\n- 好幸福泌尿科：品牌重塑後，線上預約率從15%提升至65%\n\n2. 第三方認證與合作\n- Google Partner認證代理商\n- Facebook Business Partner\n- 台灣醫事法律學會合作夥伴\n- 多家醫療器材廠商指定行銷顧問\n\n3. 客戶推薦與續約率\n- 95%客戶續約率，平均合作期間超過24個月\n- 60%新客戶來自現有客戶推薦\n- 可安排與現有客戶進行經驗分享對談\n\n4. 透明的工作流程\n- 每月提供詳細成效報告\n- 所有廣告帳戶完全透明，客戶可隨時查看\n- 定期策略檢討會議，確保方向正確\n\n5. 風險保障機制\n- 簽約前提供免費健檢報告\n- 不滿意可在首月無條件退費\n- 成效不達標提供免費延長服務\n\n我們相信，真正的專業經得起檢驗。歡迎您與我們的現有客戶直接對談，了解真實的合作體驗。',
    category: '信任保證'
  },
  {
    question: '相比其他行銷公司，Aidea:Med的差異化優勢是什麼？',
    answer: '我們不只是行銷公司，而是真正懂醫療、懂經營、懂數據的成長夥伴。\n\n核心差異化優勢：\n\n1. 醫療實務經驗\n- 實際投資經營診所，深度理解醫療生態\n- 熟悉診所日常營運痛點與成長瓶頸\n- 從經營者角度思考策略，而非單純執行者\n\n2. 電商級數據能力\n- 15年電商產業深耕，操盤過億級專案\n- 自主開發醫療專用數據分析系統\n- 精準的ROI追蹤與預測模型\n\n3. 全方位整合服務\n- 從品牌策略到執行落地，一條龍服務\n- 涵蓋線上線下各個接觸點優化\n- 診所營運流程數位化升級\n\n4. 法規深度理解\n- 與醫事法律專家深度合作\n- 所有策略完全符合醫療法規\n- 協助建立診所內部合規機制\n\n5. 成長夥伴關係\n- 不只是服務提供者，更是投資夥伴\n- 部分報酬與診所成長績效連結\n- 長期陪伴診所建立自主成長能力\n\n6. 創新技術應用\n- 整合AI技術提升行銷效率\n- 持續導入最新的行銷工具與方法\n- 客製化開發符合診所需求的系統\n\n我們的目標不是成為最大的行銷公司，而是成為醫療行業最專業、最值得信賴的成長夥伴。',
    category: '競爭優勢'
  }
];

// 統一的輪播按鈕元件
const CarouselButton = memo(({ 
  direction, 
  onClick, 
  className = '',
  size = 'medium',
  ariaLabel
}: { 
  direction: 'prev' | 'next', 
  onClick: () => void,
  className?: string,
  size?: 'small' | 'medium' | 'large',
  ariaLabel?: string
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };
  
  const Arrow = direction === 'prev' 
    ? ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || 'w-5 h-5'}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      )
    : ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || 'w-5 h-5'}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      );

  const label = ariaLabel || `${direction === 'prev' ? '上一個' : '下一個'}`;

    return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex items-center justify-center rounded-full bg-white shadow-md text-gray-800 hover:text-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${sizeClasses[size]} ${className}`}
    >
      <Arrow />
    </button>
  );
});

CarouselButton.displayName = 'CarouselButton';

// 輪播指示器元件
const CarouselIndicator = memo(({ 
  total, 
  current, 
  onChange,
  className = '' 
}: { 
  total: number, 
  current: number,
  onChange: (index: number) => void,
  className?: string
}) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          aria-label={`切換到第 ${index + 1} 個項目`}
          aria-current={index === current ? 'true' : 'false'}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            index === current
              ? 'bg-primary scale-110'
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
        />
      ))}
      </div>
  );
});

CarouselIndicator.displayName = 'CarouselIndicator';

// 主要Hero區域
const HeroSection = memo(function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { ref: heroInViewRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      heroRef.current = node;
      heroInViewRef(node);
    },
    [heroInViewRef]
  );
  
  // 標題數據
  const titles = useMemo(() => [
    {
      main: "數位精準驅動",
      sub: "專為真實醫療服務",
      target: "醫療團隊",
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
  ], []);

  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const titleInterval = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      titleInterval.current = setInterval(() => {
      setCurrentTitleIndex(prevIndex => (prevIndex + 1) % titles.length);
    }, 4000);
    }
    
    return () => {
      if (titleInterval.current) {
        clearInterval(titleInterval.current);
      }
    };
  }, [titles.length]);
  
  useEffect(() => {
    if (heroInView && window.performance && window.performance.mark) {
      window.performance.mark('hero-section-visible');
    }
  }, [heroInView]);
  
  return (
    <section 
      ref={setRefs}
      className="relative flex flex-col bg-primary overflow-hidden pt-12 pb-10 md:pt-16 md:pb-14"
      role="banner"
      aria-label="網站主要橫幅"
      id="hero"
    >
      {/* 優化背景 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-dark"></div>
        
          <Image 
          src="/images/bgline-w-small.webp"
            alt=""
            fill
            priority={true}
          sizes="(max-width: 768px) 100vw, 100vw"
          quality={30}
          fetchPriority="high"
          className="object-cover opacity-30"
          style={{ objectPosition: 'center' }}
          onLoad={() => {
            if (window.performance && window.performance.mark) {
              window.performance.mark('hero-bg-loaded');
            }
          }}
        />
      </div>
      
      {/* 主要標題內容區 */}
      <div className="container-custom relative z-20 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="px-4 sm:px-6 flex flex-col items-center"
          >
            {/* 標題結構 */}
            <div className="w-full max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTitleIndex}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={heroTitleVariants}
                  className="font-bold text-white text-left"
                >
                  {/* 中文主副標題 */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl leading-tight">
                    {titles[currentTitleIndex].main}
                    <span className="block mt-1 mb-4 font-extrabold text-white">
                      {titles[currentTitleIndex].sub}
                    </span>
                  </h1>
                  
                  {/* 英文主副標題 */}
                  <div className="mt-3 mb-3 text-lg sm:text-xl md:text-2xl lg:text-3xl text-white leading-tight tracking-wide">
                    {titles[currentTitleIndex].enMain},
                    <div className="font-extrabold text-white mt-2">
                      {titles[currentTitleIndex].enSub}.
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* 單行白框線條標籤設計 */}
            <div className="w-full max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[750px] mx-auto overflow-hidden min-h-[70px]">
              <div className="flex justify-between items-center border-t border-b border-white/40 py-3 px-1 my-6 text-center">
                {TAGS.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs sm:text-sm md:text-base text-white font-medium tracking-wide whitespace-nowrap"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
        
            {/* 預約按鈕 */}
            <div className="mt-4 mb-5 flex justify-center w-full min-h-[60px]">
              <Link href="/contact" prefetch={false}>
                <span className="inline-flex items-center bg-black text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium border border-white/10 hover:bg-black/80 transition-colors">
                  <span className="mr-1.5 sm:mr-2 text-xl sm:text-2xl font-bold text-white">
                    A:
                  </span>
                  <span className="font-medium">免費30分鐘專業顧問</span>
                </span>
              </Link>
            </div>
            
            {/* 向下滾動指示器 */}
            <div className="mt-16 sm:mt-20 flex justify-center w-full">
              <div
                className="text-white p-2 cursor-pointer hover:bg-white/10 transition-colors animate-pulse"
                onClick={() => document.getElementById('marketing-content')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

// 階梯式行銷區域
const MarketingSection = memo(function MarketingSection() {
  // 使用interface定義數據結構
  interface MarketingContent {
    en: string;
    zh: string;
  }

  const marketingRef = useRef<HTMLElement | null>(null);
  const { ref: marketingInViewRef, inView: marketingInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '0px 0px -10% 0px',
  });
  
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      marketingRef.current = node;
      marketingInViewRef(node);
    },
    [marketingInViewRef]
  );

  // 中英文交叉內容
  const contentBlocks = useMemo<MarketingContent[]>(() => [
    {
      en: "THE MARKETING PARTNER THAT UNDERSTANDS HEALTHCARE BEST.",
      zh: "專業醫療行銷夥伴，最了解醫療產業的最佳選擇"
    },
    {
      en: "COMPREHENSIVE BRAND INTEGRATION START THE CONVERSATION",
      zh: "全方位品牌整合策略，啟動專業對話"
    },
    {
      en: "WITH YOUR POTENTIAL PATIENTS.",
      zh: "與您的潛在患者創造連結，打造醫療品牌價值"
    }
  ], []);

  useEffect(() => {
    if (marketingInView && window.performance && window.performance.mark) {
      window.performance.mark('marketing-section-visible');
    }
  }, [marketingInView]);
  
  return (
    <section 
      ref={setRefs}
      className="relative bg-primary overflow-hidden py-20 md:py-24"
      id="marketing-content"
    >
      {/* 背景設計 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-dark"></div>
        <Image 
          src="/images/bgline-w-small.webp"
          alt=""
          fill
          sizes="100vw"
          quality={30}
          loading="lazy"
          className="object-cover opacity-30"
          style={{ objectPosition: 'center' }}
          aria-hidden="true"
        />
              </div>

      <div className="container-custom relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {contentBlocks.map((block, index) => (
            <div 
              key={index}
              className={`mb-16 md:mb-20 ${index % 2 === 0 ? '' : ''}`}
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}>
                {/* 英文部分 */}
                <div className="w-full md:w-1/2">
                  <div className="p-8 md:p-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                      {block.en}
                    </h2>
                    </div>
                </div>
                
                {/* 中文部分 */}
                <div className="w-full md:w-1/2">
                  <div className="p-8 md:p-10 border-l-4 border-white">
                    <p className="text-xl md:text-2xl text-white font-medium leading-tight">
                      {block.zh}
                    </p>
              </div>
                </div>
            </div>
          </div>
          ))}
        </div>
            </div>
            
      {/* 向下滾動指示器 */}
      <div className="relative z-10 flex justify-center mt-4">
        <div
          className="text-white p-2 cursor-pointer hover:bg-white/10 transition-colors hover:translate-y-1"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </div>
      </div>
    </section>
  );
});

// 更新服務特色區塊
const FeatureSection = memo(function FeatureSection() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // 檢測裝置以優化體驗
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 處理手動控制輪播
  const handlePrev = useCallback(() => {
    if (isMobile) {
      setCurrentFeature(prev => 
        prev === 0 ? FEATURES.length - 1 : prev - 1
      );
    }
  }, [isMobile]);
  
  const handleNext = useCallback(() => {
    if (isMobile) {
      setCurrentFeature(prev => 
        prev === FEATURES.length - 1 ? 0 : prev + 1
      );
    }
  }, [isMobile]);
  
  const handleIndicatorChange = useCallback((index: number) => {
    setCurrentFeature(index);
  }, []);

  return (
    <section 
      id="features" 
      className="py-16 md:py-24 bg-white"
      aria-labelledby="feature-section-heading"
    >
      <div className="container-custom px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 
            id="feature-section-heading" 
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 text-center mb-4"
          >
            我們的<span className="text-primary">核心</span>特色
          </h2>
          
          {/* AI優化：結構化描述區塊 */}
          <div className="text-center mb-8">
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              結合醫療專業與數位行銷專長，我們提供獨特的服務讓您的醫療團隊脫穎而出
            </p>
            <div className="bg-gray-50 p-6 rounded-lg max-w-4xl mx-auto border border-gray-100">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">醫療行銷專家能為您的診所提供什麼？</h3>
              <ul className="text-left text-gray-700 space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span> 
                  <span>專業醫療行銷策略，符合衛福部法規且提升診所形象</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span> 
                  <span>AI驅動的精準數據分析，將診所營運數據轉化為實用洞察</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span> 
                  <span>醫療專業品牌打造，建立難以複製的診所差異化優勢</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span> 
                  <span>長期成長策略規劃，而非短期的行銷活動</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* 移動端輪播版本 */}
          <div 
            ref={carouselRef}
            className="md:hidden relative px-4"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full text-white mb-4 mx-auto">
                  {React.createElement(FEATURES[currentFeature].icon, { size: 24 })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                  {FEATURES[currentFeature].title}
                </h3>
                <p className="text-gray-600 text-center">
                  {FEATURES[currentFeature].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* 輪播控制 */}
            <div className="flex justify-between items-center mt-6">
              <CarouselButton direction="prev" onClick={handlePrev} size="small" />
              <CarouselIndicator 
                total={FEATURES.length} 
                current={currentFeature} 
                onChange={handleIndicatorChange} 
              />
              <CarouselButton direction="next" onClick={handleNext} size="small" />
            </div>
          </div>
          
          {/* 桌面網格版本 */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" aria-label="醫療行銷核心服務">
            {FEATURES.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full text-white mb-4 mx-auto">
                  {React.createElement(feature.icon, { size: 24 })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
                
                {/* AI優化：增加結構化細節 */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <ul className="text-sm text-gray-600 space-y-1">
                    {index === 0 && (
                      <>
                        <li className="flex items-start">
                          <span className="text-primary text-xs mr-1">•</span> 
                          <span>深入了解醫療產業法規限制</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary text-xs mr-1">•</span> 
                          <span>十年專業經驗轉化患者信任</span>
                        </li>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <li className="flex items-start">
                          <span className="text-primary text-xs mr-1">•</span> 
                          <span>AI分析患者行為與需求模式</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary text-xs mr-1">•</span> 
                          <span>智能優化行銷預算分配</span>
                        </li>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <li className="flex items-start">
                          <span className="text-primary text-xs mr-1">•</span> 
                          <span>精準捕捉診所獨特價值定位</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary text-xs mr-1">•</span> 
                          <span>建立難以複製的品牌形象</span>
                        </li>
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <li className="flex items-start">
                          <span className="text-primary text-xs mr-1">•</span> 
                          <span>提供診所成長全階段支持</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary text-xs mr-1">•</span> 
                          <span>建立持續發展品牌生態系統</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

// 三重優勢區塊組件
const TripleAdvantageSection = memo(function TripleAdvantageSection() {
  const { ref: sectionRef, inView: sectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const advantages = [
    {
      title: '電商思維',
      subtitle: 'E-commerce Mindset',
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      items: [
        {
          icon: LineChart,
          title: '數據驅動決策',
          description: '運用電商級數據分析，追蹤每一分行銷預算的 ROI，讓投資效益清晰可見'
        },
        {
          icon: Target,
          title: '精準投放策略',
          description: '借鑑電商漏斗優化經驗，建立診所專屬的患者獲取與轉換系統'
        },
        {
          icon: Zap,
          title: '市場敏感度',
          description: '電商圈的快速反應能力，即時捕捉醫療市場變化與患者需求趨勢'
        }
      ]
    },
    {
      title: '醫療專業',
      subtitle: 'Medical Expertise',
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-600',
      bgPattern: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      items: [
        {
          icon: Shield,
          title: '法規合規專精',
          description: '深度理解醫療廣告法規，確保所有行銷活動完全合規，避免法律風險'
        },
        {
          icon: Heart,
          title: '患者心理洞察',
          description: '掌握醫療消費者的決策心理，設計符合就醫行為的行銷策略'
        },
        {
          icon: Lightbulb,
          title: '醫療創新應用',
          description: '將 AI 技術與醫療行銷結合，提升診所營運效率與患者體驗'
        }
      ]
    },
    {
      title: '實戰經驗',
      subtitle: 'Proven Experience',
      icon: Briefcase,
      color: 'from-red-500 to-pink-600',
      bgPattern: 'bg-gradient-to-br from-red-50 to-pink-50',
      items: [
        {
          icon: Award,
          title: '診所營運實戰',
          description: '實際營運診所的第一手經驗，深度理解診所經營的痛點與需求'
        },
        {
          icon: Star,
          title: '成功案例驗證',
          description: '雅德思牙醫、雲天牙醫、好幸福泌尿科等成功案例，證明策略有效性'
        },
        {
          icon: CheckCircle,
          title: '一條龍整合服務',
          description: '從品牌策略到執行落地，提供完整的醫療行銷解決方案'
        }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container-custom">
        {/* 標題區域 - 手機優化 */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 px-4 sm:px-0"
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            三重優勢
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary mt-1 sm:mt-2">
              造就不可複製的競爭力
            </span>
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-primary mx-auto my-4 sm:my-6"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            結合電商思維的數據驅動、醫療專業的合規深度、實戰經驗的務實落地
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>為您的診所打造真正有效的行銷策略
          </p>
        </motion.div>

        {/* 三重優勢展示 - 響應式優化 */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
        >
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              {/* 卡片主體 - 手機優化 */}
              <div className={`${advantage.bgPattern} border border-gray-100 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 h-full overflow-hidden relative`}>
                
                {/* 背景裝飾元素 */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${advantage.color} transform rotate-45 translate-x-8 -translate-y-8`}></div>
                </div>
                
                {/* 圖標與標題 - 手機優化 */}
                <div className="text-center mb-6 sm:mb-8 relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${advantage.color} text-white mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <advantage.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium">
                    {advantage.subtitle}
                  </p>
                </div>

                {/* 優勢項目 - 手機優化 */}
                <div className="space-y-4 sm:space-y-6 relative z-10">
                  {advantage.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      className="flex items-start space-x-3 sm:space-x-4 group/item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={sectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.3 + (index * 0.1) + (itemIndex * 0.1),
                        ease: "easeOut"
                      }}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover/item:bg-white transition-colors duration-300">
                          {React.createElement(item.icon, { size: 14, className: "text-primary" })}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base group-hover/item:text-primary transition-colors duration-300">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 連接線效果（僅在大螢幕顯示）- 保持原有設計 */}
              {index < advantages.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                  <motion.div
                    className="w-12 h-0.5 bg-gradient-to-r from-primary to-gray-300"
                    initial={{ scaleX: 0 }}
                    animate={sectionInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + (index * 0.2) }}
                  />
                  <motion.div
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"
                    initial={{ scale: 0 }}
                    animate={sectionInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: 1 + (index * 0.2) }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* 底部統計數據 - 手機優化 */}
        <motion.div 
          className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <div className="text-center mb-6 sm:mb-8 px-4 sm:px-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              用數據說話的成果展現
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              三重優勢結合，為合作診所創造可量化的實際效益
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { value: 10, suffix: '+', label: '年深度實戰經驗', delay: 0.8 },
              { value: 50, suffix: '+', label: '成功合作診所', delay: 1.0 },
              { value: 300, suffix: '%', label: '平均營收成長', delay: 1.2 },
              { value: 95, suffix: '%', label: '客戶續約率', delay: 1.4 }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-xl p-4 sm:p-6 hover:bg-gray-100 transition-colors duration-300">
                <motion.div 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2"
                  initial={{ scale: 0 }}
                  animate={sectionInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.6, delay: stat.delay, type: "spring", stiffness: 200 }}
                >
                  <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
                </motion.div>
                <p className="text-gray-600 font-medium text-xs sm:text-sm leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

// 主要頁面組件
const HomePage = () => {
  return (
    <>
        <HeroSection />
          <MarketingSection />
          <FeatureSection />
        
        {/* 新增的三重優勢區塊 */}
        <TripleAdvantageSection />
        
      {/* 從這裡開始的組件拆分到單獨的文件中 */}
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse"></div>}>
        <FAQSection 
          title="常見問題"
          subtitle="我們整理了關於數位行銷的常見問題，協助您更了解如何透過專業行銷策略提升診所業績"
          faqs={homeFAQs}
          showCategoryFilter={true}
          maxWidth="lg"
          backgroundColor="gray"
        />
          </Suspense>
          

        
      <CTASection 
        title="準備好提升您的醫療專業形象了嗎？"
        description="與我們的專業顧問安排免費諮詢，探討如何為您的診所打造最適合的行銷策略"
        primaryButton={{
          href: "/contact",
          text: "預約免費諮詢",
          variant: "white"
        }}
        secondaryButton={{
          href: "/service",
          text: "了解服務內容",
          variant: "black"
        }}
      />
    </>
  );
};

export default HomePage; 