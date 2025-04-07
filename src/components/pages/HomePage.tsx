'use client'

import React, { useEffect, useState, Suspense, useRef, useCallback, useReducer, useMemo, memo, lazy, useTransition } from 'react'
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
  // 根據尺寸設定按鈕大小
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };
  
  // 根據方向設定箭頭
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

// 動態載入非核心組件 - 使用優化的Next.js 15+ dynamic import
const CaseCard = dynamic(() => import('@/components/case/CaseCard').then(mod => mod.CaseCard), {
  loading: () => <div className="h-full bg-gray-100 animate-pulse rounded-lg" aria-hidden="true"></div>,
  ssr: true // 啟用SSR以改善SEO
})

const ContactForm = dynamic(() => import('@/components/contact/ContactForm'), {
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" aria-hidden="true"></div>,
  ssr: true
})

const ContactInfo = dynamic(() => import('@/components/contact/ContactInfo'), {
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg" aria-hidden="true"></div>,
  ssr: true
})

// 使用普通常量定義而非useMemo，因為這是頂層作用域
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
];

// 常見問題數據 - 使用useMemo避免重複渲染
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
    category: '行銷基礎'
  },
  {
    question: '人工智能如何幫助醫師建立個人品牌？',
    answer: '人工智能正在革新醫師個人品牌的建立方式，為專業醫師提供前所未有的優勢。\n\n我們融合AI與個人品牌建立的專業知識，為醫師打造獨特的數位形象：\n\n1. 專業內容自動化生產\n- AI輔助撰寫專業醫療文章，讓您的專業知識輕鬆轉化為有價值的內容\n- 智能影片腳本生成，協助製作教育性且引人入勝的視頻內容\n\n2. 個人化患者互動\n- AI驅動的社群回應系統，即使在忙碌的診療時間也能維持線上互動\n- 智能分析患者問題模式，協助您提供最常見疑問的專業解答\n\n3. 聲譽分析與管理\n- 自動監測網路上關於您的討論與評價\n- AI情感分析幫助了解患者對您的真實觀感\n\n4. 個性化品牌定位\n- 數據驅動的專業定位分析，找出您最獨特的專業優勢\n- 智能競爭者分析，確認您的差異化價值\n\n人工智能不僅提高了醫師建立個人品牌的效率，更能透過數據分析提供戰略性指引，讓您的專業價值得到最大程度的傳播與認可。在AI輔助下，即使是最繁忙的醫師也能持續建立和強化其專業形象。',
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
  },
  {
    question: '為什麼牙醫診所特別需要專業的數位行銷？',
    answer: '牙醫診所面臨著獨特的行銷挑戰，需要專業的數位策略來突破競爭：\n\n1. 高度地域化競爭\n- 大多數牙醫診所的目標患者來自5-10公里範圍內\n- 同一區域可能有多家診所競爭有限的患者資源\n\n2. 患者選擇的特殊考量\n- 患者選擇牙醫的標準結合專業信任與便利性\n- 需要建立專業形象同時突顯可親性和服務便利性\n\n3. 長期患者關係的價值\n- 牙醫患者的終身價值遠高於單次治療費用\n- 需要策略性的溝通和追蹤機制鼓勵定期回診\n\n專業的牙醫行銷不只是增加曝光度，而是建立能夠吸引並長期留住優質患者的完整系統。我們的行銷策略專為牙醫特性設計，從本地SEO優化、精準的地域性廣告投放到患者回診提醒系統，全面提升診所的競爭優勢與患者轉化率。',
    category: '牙醫行銷'
  },
  {
    question: '如何評估我們牙醫診所目前行銷的有效性？',
    answer: '評估牙醫診所行銷效能需要看對的數據，而非僅關注表面流量：\n\n1. 關鍵績效指標\n- 新患獲取成本 (CAC)：每位新患者的行銷投資成本\n- 患者終身價值 (LTV)：平均患者帶來的長期收益\n- 回診率：現有患者的定期回診比例\n- 轉介率：通過患者推薦獲得的新患者百分比\n\n2. 數位足跡評估\n- 本地搜尋排名：在「附近牙醫」等關鍵詞的搜尋結果位置\n- Google商家檔案互動：評論數量、星級和回覆情況\n- 網站轉化率：訪客預約諮詢或來電的比例\n\n3. 診所營運連結\n- 新患來源追蹤：了解各行銷管道帶來的新患者數量\n- 預約填充率：有效行銷應減少診所空檔時間\n- 治療接受率：患者對推薦治療計畫的接受程度\n\n我們提供免費的診所行銷健診服務，透過系統性的分析，找出目前策略的優勢和改進空間。這不是空泛的評估，而是有具體數據支持的診斷，幫助您掌握診所行銷的真實情況，做出更明智的投資決策。',
    category: '成效評估'
  },
  {
    question: '牙醫診所如何處理負面評論帶來的聲譽挑戰？',
    answer: '負面評論是每間診所可能面臨的挑戰，但正確處理反而能成為展現專業的機會：\n\n1. 系統性監控與快速回應\n- 建立全面的線上聲譽監控系統，即時捕捉任何評論\n- 在24小時內專業回應，展現積極處理問題的態度\n\n2. 策略性回應框架\n- 表達理解與同理心，不爭辯或辯護\n- 簡要說明診所的服務標準與價值觀\n- 提供離線溝通管道深入了解並解決問題\n\n3. 負評轉化策略\n- 將負評視為改進服務的寶貴反饋\n- 在回覆中適當說明已採取的改善措施\n- 邀請患者重新體驗改善後的服務\n\n4. 主動聲譽管理\n- 鼓勵滿意患者分享正面體驗，稀釋負面評論影響\n- 定期進行患者滿意度調查，提前發現並解決潛在問題\n\n我們協助診所建立完整的聲譽管理系統，不只是被動應對問題，而是主動塑造正面形象。透過專業的負評處理策略，將挑戰轉變為建立信任的機會，讓潛在患者看到您診所認真對待每位患者體驗的專業態度。',
    category: '數位策略'
  },
  {
    question: '如何讓診所的社群媒體內容既專業又吸引人？',
    answer: '牙醫診所的社群媒體需要平衡專業醫療資訊與患者友善的內容風格：\n\n1. 內容支柱策略\n- 專業教育：簡化複雜的牙科知識，提供實用衛教資訊\n- 診所故事：展現團隊人性化一面，增加信任感\n- 病例分享：在合規前提下展示治療成果與專業技術\n- 患者關懷：分享與患者互動的真實時刻，展現診所文化\n\n2. 視覺內容優化\n- 高質量的診所環境與設備照片，減少患者陌生感\n- 真實自然的團隊照片，而非千篇一律的制式形象\n- 簡明易懂的牙科健康資訊圖表，增加教育價值\n\n3. 互動策略\n- 設計適合牙科主題的小型問答或測驗活動\n- 回覆留言時加入個人化元素，展現診所關懷\n- 邀請患者分享體驗，建立真實社群連結\n\n4. 內容規劃與執行\n- 建立內容行事曆，結合牙科健康節日與時事\n- 設計內容模板，確保視覺一致性和發布效率\n- 內容審核流程，平衡專業準確性與溝通親和力\n\n我們協助診所建立能夠真正反映診所特色與專業的社群形象，而非複製其他診所的模式。透過策略性的內容規劃和專業執行，將您的社群媒體轉化為建立患者信任和教育的有效管道。',
    category: '社群經營'
  },
  {
    question: '如何透過數位工具提升牙醫診所的預約轉化率？',
    answer: '現代牙醫診所需要優化整個數位預約流程，從吸引注意到實際到診：\n\n1. 無縫預約系統\n- 整合網站、Google商家檔案和社群媒體的線上預約功能\n- 簡化預約流程，減少必要步驟和資料欄位\n- 自動化確認和提醒系統，減少預約未到率\n\n2. 預約前的信任建立\n- 提供新患者專屬資訊頁面，解答常見疑慮\n- 分享診療流程和價格透明度，減少未知恐懼\n- 展示真實患者評價和治療前後對比，建立期望值\n\n3. 數位初診優化\n- 預約前發送個性化歡迎訊息和診所指引\n- 提供線上初步問診表格，提高首次就診效率\n- 診所環境虛擬導覽，降低初診患者焦慮\n\n4. 數據驅動的優化\n- 追蹤並分析預約流程中的轉化率和流失點\n- A/B測試不同預約流程和溝通訊息的效果\n- 基於患者反饋持續優化預約體驗\n\n我們幫助診所建立以患者體驗為中心的數位預約生態系統，平均能提升30-50%的預約轉化率，同時減少前台人員25%的行政負擔。這不僅是技術工具的導入，更是整體患者體驗的策略性設計。',
    category: '數位策略'
  },
  {
    question: '如何設計特別適合牙醫診所的行銷活動和優惠？',
    answer: '牙醫診所的行銷活動需要特別設計，才能既吸引患者又符合專業形象：\n\n1. 專業導向的活動設計\n- 口腔健康檢查活動：強調預防性護理的重要性\n- 專業諮詢時段：針對特定治療提供免費專業評估\n- 教育講座系列：提升患者對口腔健康的認識和重視\n\n2. 合規有效的優惠策略\n- 新患體驗套組：結合基礎檢查與諮詢的專業導向方案\n- 家庭護理計畫：鼓勵全家共同維護口腔健康的長期方案\n- 預防性護理方案：強調定期維護的價值和成本效益\n\n3. 患者忠誠度計劃\n- 設計合規的患者回診獎勵機制\n- 建立分級會員制度，提供差異化增值服務\n- 轉介感謝計劃，重視患者口碑的價值\n\n4. 活動執行與追蹤\n- 精準的目標患者族群定位和溝通管道選擇\n- 完整的前中後期執行計劃和團隊培訓\n- 系統性的成效追蹤和投資報酬分析\n\n我們協助診所設計符合醫療專業形象、法規要求並具有實際成效的行銷活動。我們的方案不以折扣競爭，而是聚焦於突顯診所的專業價值和差異化優勢，吸引真正重視口腔健康的理想患者群體。',
    category: '牙醫行銷'
  },
  {
    question: '醫師個人品牌和診所品牌應該如何平衡發展？',
    answer: '在醫療領域，醫師個人品牌與診所品牌的協同發展是成功的關鍵：\n\n1. 策略性品牌架構\n- 評估診所模式與發展目標，確定適合的品牌關係模型\n- 牽引式結構：以主治醫師品牌帶動診所發展\n- 支持式結構：診所品牌作為平台支持醫師專業展現\n- 平行式結構：醫師與診所品牌相輔相成，各有側重\n\n2. 個人品牌與診所品牌的協同點\n- 專業定位：個人專長如何融入診所整體服務特色\n- 價值主張：個人理念如何體現在診所的患者承諾中\n- 視覺系統：個人形象與診所識別系統的和諧統一\n\n3. 內容與溝通策略\n- 主治醫師專業內容如何強化診所權威定位\n- 診所案例如何展現醫師個人技術與理念\n- 跨平台內容分享機制，最大化雙重品牌效應\n\n4. 長期發展規劃\n- 根據診所成長階段調整品牌重點\n- 醫師團隊擴展時的品牌整合策略\n- 應對醫師流動或診所所有權變更的品牌延續性\n\n我們協助醫師和診所找到最有利的品牌發展平衡點，打造既突顯個人專業特色，又強化整體診所形象的雙贏策略。這不是單一模式的套用，而是基於您的具體情況和目標，量身設計的品牌生態系統。',
    category: '品牌策略'
  },
  {
    question: '如何透過內容行銷建立牙醫診所的專業權威？',
    answer: '優質的內容行銷是牙醫診所建立專業權威和患者信任的基石：\n\n1. 多層次內容生態系統\n- 核心內容：深入探討牙科專業知識的權威文章\n- 教育內容：患者友善的口腔健康知識和護理指南\n- 品牌故事：展現診所理念和團隊專業背景的敘事\n- 案例分享：在患者隱私保護前提下的專業成果展示\n\n2. 專業定位與差異化\n- 確立診所特有的專業聲音和立場\n- 發展代表性專業領域的深度內容系列\n- 將診所獨特優勢融入各類內容主題\n\n3. 多平台內容策略\n- 診所網站：建立結構化的知識中心和專業部落格\n- 社群媒體：將專業知識轉化為互動式短內容\n- 第三方平台：在專業醫療網站和媒體上的投稿與專欄\n- 視頻內容：製作醫療教育短片和專業解說\n\n4. 患者導向的專業表達\n- 將複雜的專業知識轉化為患者易懂的說明\n- 解答真實患者常見問題和疑慮\n- 結合專業知識與同理心的平衡表達\n\n我們協助診所建立持續產出優質專業內容的系統，而非零散的行銷文章。這個系統不僅提升您的搜尋引擎排名和線上曝光，更重要的是建立診所在患者心中的專業權威形象，成為他們尋求牙科信息和服務的首選來源。',
    category: '內容策略'
  },
  {
    question: '牙醫診所如何有效利用Google商家檔案和本地SEO？',
    answer: '對牙醫診所而言，本地搜尋優化和Google商家檔案是吸引新患者的核心管道：\n\n1. Google商家檔案全面優化\n- 完整且引人注目的基本信息填寫策略\n- 專業診所照片和虛擬導覽的策略性安排\n- 服務項目和特色的精準描述和關鍵字優化\n- 評論管理和回覆的最佳實踐\n\n2. 本地SEO專項策略\n- 牙科特定的關鍵字研究和定位\n- 診所網站的本地SEO結構優化\n- 本地引用和目錄列表的一致性建立\n- 區域性內容策略和本地反向連結建立\n\n3. 患者評論生態系統\n- 系統化的正面評論收集機制\n- 專業且個性化的評論回覆策略\n- 評論內容分析和服務改進整合\n\n4. 數據驅動的持續優化\n- Google商家洞察分析和競爭對手監測\n- 搜尋表現與實際預約轉化的關聯分析\n- 季節性和趨勢性調整策略\n\n我們的牙醫診所客戶通過系統性的本地SEO優化，平均在3-6個月內實現了本地搜尋排名前三的目標，新患諮詢量增長40-70%。這不是短期技巧，而是建立在深入理解Google算法和牙科患者搜尋行為基礎上的長期策略。',
    category: '數位策略'
  },
  {
    question: '在醫療行銷中如何有效運用數據分析？',
    answer: '醫療行銷中的數據分析需要特殊的專業視角，才能真正轉化為有價值的洞察：\n\n1. 醫療特定的數據架構\n- 患者旅程地圖與關鍵轉化點的數據追蹤設計\n- 合規且有效的患者數據收集與分析框架\n- 整合線上行為與診所實際就診數據的系統\n\n2. 關鍵醫療行銷指標分析\n- 患者獲取成本(CAC)與生命週期價值(LTV)的關係\n- 各治療類型的行銷轉化率與投資回報\n- 首次就診到長期患者的轉化路徑分析\n\n3. 預測性分析應用\n- 患者行為模式識別和預測模型建立\n- 季節性需求波動和市場趨勢預測\n- 個性化行銷策略的數據支持系統\n\n4. 數據可視化與行動導向報告\n- 醫療團隊易懂的數據展示模式\n- 自動化數據儀表板與定期見解報告\n- 數據驅動的行銷策略調整建議\n\n我們的數據分析不僅告訴您「發生了什麼」，更重要的是解釋「為什麼」以及「下一步該做什麼」。我們結合醫療專業知識和行銷分析專長，提供超越表面數字的深度洞察，幫助您做出更明智的行銷投資決策。',
    category: '成效評估'
  },
  {
    question: '為何牙醫診所需要定期更新網站和社群媒體內容？',
    answer: '定期更新內容是牙醫診所數位行銷的關鍵成功因素：\n\n1. 搜尋引擎優化效益\n- Google演算法青睞持續更新的網站，提升搜尋排名\n- 新內容持續擴大可索引關鍵字範圍，增加被發現機會\n- 降低跳出率和提高網站停留時間，間接提升SEO表現\n\n2. 建立專業權威形象\n- 分享最新牙科技術和治療方式，展現診所與時俱進\n- 回應季節性口腔健康議題，展現專業關注\n- 持續教育患者，建立診所作為知識來源的地位\n\n3. 維持患者互動和關注\n- 提供持續性的關注理由，增加回診可能性\n- 透過有價值的內容保持品牌知名度\n- 創造社群互動機會，增強患者社群歸屬感\n\n4. 數據驅動的內容優化\n- 分析哪些內容獲得最佳回應，持續優化主題和形式\n- 追蹤不同內容類型的轉化率表現\n- 調整內容策略以配合患者興趣變化\n\n我們協助診所建立可持續的內容更新系統，包括年度內容規劃、自動化發佈機制和效果追蹤分析。這確保診所能以最少的時間投入，獲得持續更新的最大效益。',
    category: '內容策略'
  },
  {
    question: '數位行銷如何幫助牙醫診所吸引特定類型的理想患者？',
    answer: '精準的數位行銷能幫助您的診所從「量」的競爭轉向「質」的差異化：\n\n1. 策略性患者畫像建構\n- 診所發展的核心在於吸引與診所專業和價值觀相契合的患者群體\n- 運用數據分析識別現有高價值患者的共同特徵：醫療需求複雜度、治療計畫接受度、轉介潛力\n- 建立多層次患者分類模型，依照生命週期階段、價值觀與治療需求進行精確分組\n\n2. 精準定位的多維度策略\n- 地理信息系統(GIS)分析：識別目標患者群的生活、工作與活動區域\n- 行為觸發定位：捕捉特定搜尋行為背後的治療意圖與緊急程度\n- 內容情境匹配：根據患者資訊搜尋階段提供對應深度的專業內容\n\n3. 全渠道引流與轉化系統\n- 建立診所獨特的「內容權威領域」，成為特定治療或健康議題的首選信息來源\n- 設計漸進式的「微轉化」路徑，從低承諾互動到高價值諮詢\n- 實施跨平台用戶識別與追蹤，創建連貫的品牌體驗\n\n4. 基於終身價值的投資優化\n- 建立各患者群體的價值預測模型，實現資源精準配置\n- 構建閉環ROI追蹤系統，從曝光到首診再到復診的完整歸因\n- 應用機器學習持續優化目標患者的判定標準與獲取策略\n\n台中某植牙專科診所採用我們的精準行銷系統後，新患平均首次治療方案從4.2萬元提升至7.8萬元，接受全口重建方案的患者比例增加了340%。關鍵不在於行銷手法的創新，而是對「誰是理想患者」的深刻理解與精準觸達。',
    category: '數位策略'
  },
  {
    question: '如何利用視頻內容提升牙醫診所的患者轉化率？',
    answer: '視頻內容已成為牙醫診所行銷中最具轉化力的媒介之一：\n\n1. 策略性視頻規劃\n- 首次就診前的診所導覽影片，減少患者陌生恐懼\n- 牙科治療過程展示，建立適當期望和減少焦慮\n- 醫師團隊專業背景介紹，建立信任和人性化連結\n- 真實患者見證，提供社會認同和結果證明\n\n2. 各平台視頻優化\n- 診所網站：嵌入關鍵頁面的深度解說視頻\n- YouTube：建立完整的教育性內容庫和診所品牌頻道\n- 社群媒體：創建平台專屬短視頻格式，提高互動率\n- Google商家檔案：上傳核心服務說明和診所環境視頻\n\n3. 視頻製作最佳實踐\n- 專業但不呆板的呈現風格，平衡權威感和親和力\n- 首5秒的關鍵信息呈現，抓住注意力\n- 清晰的行動號召，引導下一步互動\n- 字幕和文字重點，照顧無聲觀看的用戶\n\n4. 視頻內容衡量與優化\n- 追蹤觀看時長和互動指標，識別最有效內容\n- A/B測試不同視頻格式和呼籲行動的效果\n- 分析視頻帶來的實際預約轉化率\n\n我們的牙醫診所客戶透過策略性的視頻內容實施，平均提升了初診轉化率45%，治療計畫接受率增加了32%。視頻內容不需過於複雜或高成本，關鍵在於策略性規劃和一致性執行。',
    category: '內容策略'
  },
  {
    question: '牙醫診所投資數位行銷的合理預算比例是多少？',
    answer: '數位行銷預算分配需根據診所發展階段和目標而調整：\n\n1. 診所發展階段預算指南\n- 新開診所：營收的8-12%投入行銷，著重建立知名度和患者基礎\n- 成長期診所：營收的5-8%，平衡獲取新患與維護現有患者關係\n- 成熟診所：營收的3-5%，專注於維持品牌地位和特定服務推廣\n\n2. 數位行銷預算配置模型\n- 基礎數位存在：網站維護、Google商家檔案管理等（15-20%）\n- 內容創建：部落格、社群媒體內容、視頻製作等（25-30%）\n- 付費廣告：搜尋引擎廣告、社群媒體廣告等（30-35%）\n- 技術與工具：CRM、自動化工具、分析平台等（10-15%）\n- 測試與創新：新平台、新格式實驗（5-10%）\n\n3. 階段性預算調整因素\n- 季節性需求變化（如開學前、年底保險用完前等）\n- 新服務或技術推出期間\n- 應對競爭環境變化或特定市場機會\n\n4. 投資回報率評估框架\n- 短期ROI指標：點擊成本、諮詢轉化成本等\n- 中期ROI指標：新患獲取成本、首次治療價值等\n- 長期ROI指標：患者終身價值、轉介率增長等\n\n我們協助診所制定符合其特定發展階段和目標的行銷預算規劃，並建立清晰的ROI追蹤系統。我們的目標是確保每一分投入都能產生可衡量的回報，平均而言，我們的診所客戶獲得3-5倍的行銷投資回報。',
    category: '成本效益'
  },
  {
    question: '如何衡量牙醫診所社群媒體行銷的實際效果？',
    answer: '社群媒體效果評估需超越表面的參與度指標，連結到實際業務目標：\n\n1. 多層次衡量框架\n- 接觸層面：粉絲成長率、內容觸及人數、受眾人口統計變化\n- 互動層面：互動率、視頻觀看完成率、內容分享率\n- 轉化層面：點擊網站率、預約請求數、訪問診所前的接觸次數\n- 忠誠層面：現有患者互動比例、社群提及度、正面評論增長\n\n2. 社群與業務連結指標\n- 社群引導流量的轉化率與其他管道比較\n- 從社群渠道獲得的新患者價值評估\n- 社群互動患者的回診率和推薦率\n- 社群活動對特定治療服務需求的提升效果\n\n3. 內容效能分析\n- 不同內容主題和形式的表現比較\n- 最佳發布時間和頻率的數據支持\n- 競爭對手內容策略比較和洞察\n\n4. 整合報告與決策支援\n- 自動化數據收集和整合系統設置\n- 定期績效報告與行動建議\n- 基於數據的內容策略優化\n\n我們幫助診所建立完整的社群媒體分析體系，從表面數據延伸到實際業務影響。這種方法不只衡量「喜歡」的數量，更關注這些互動如何轉化為診所的實際收益和患者關係強化。我們的診所客戶透過精準分析，平均將社群媒體投資回報提升了40%。',
    category: '成效評估'
  },
  {
    question: '牙醫診所網站需要具備哪些關鍵功能才能有效轉化患者？',
    answer: '您的診所網站不僅是數位門面，更是24小時不停歇的專業顧問與預約中心：\n\n1. 策略性的第一印象設計\n- 首屏加載時間優化至1.8秒以內（Google研究顯示：2秒後每增加1秒，跳出率增加20%）\n- 核心價值主張的即時可見性，確保訪客3秒內理解「為何選擇您」\n- 行動導向元素的熱區分析與持續優化，提高點擊轉化率\n\n2. 建立專業公信力的信任元素\n- 導入結構化的「成功案例敘事」模式，從患者痛點到解決方案再到成果展示\n- 醫師專業背景與人文特質的平衡呈現，建立能力與親和力兼具的形象\n- 整合第三方認證與專業協會會員資格，強化權威性背書\n\n3. 台灣本地使用習慣的精準適配\n- 行動裝置體驗優先設計（台灣83%的初診查詢來自手機）\n- LINE、健保卡整合與台灣常見支付方式的無縫銜接\n- 診所實景導覽與鄰近交通資訊的動態顯示\n\n4. 數據驅動的持續優化系統\n- 熱力圖與用戶行為錄製分析，找出轉化障礙\n- A/B測試系統，針對關鍵頁面元素進行精準比較\n- 轉化漏斗分析，識別並修復用戶流失點\n\n我們為台南某齒顎矯正專科診所優化網站後，不只將預約轉化率從3.1%提升至11.2%，更重要的是提高了初診患者的診療計畫接受率達42%。關鍵在於網站不再只是被動的資訊展示，而是主動引導潛在患者經歷從認知、考慮到決策的完整心理旅程。',
    category: '數位策略'
  },
  {
    question: '如何建立有效的院內行銷系統來增加現有患者的回診率？',
    answer: '將您現有的患者視為診所最珍貴的資產，有系統的院內行銷是建立長期穩健成長的基石：\n\n1. 打造記憶點的卓越診療體驗\n- 每位患者都是潛在的品牌大使，他們如何描述您的診所將成為最具說服力的行銷\n- 繪製完整的「患者體驗地圖」，從預約到術後追蹤的每個觸點都精心設計\n- 導入「感官記憶點」策略：從空間規劃、視覺設計到環境香氛，創造多層次感官印象\n\n2. 數據驅動的智能追蹤系統\n- 建立治療類型與最佳回診週期的關聯模型\n- 針對不同患者群體客製化的健康提醒內容與頻率\n- 結合臨床數據和行為模式，預測患者流失風險並提前干預\n\n3. 完整的跨團隊溝通機制\n- 所有診所成員共同理解「病患終身價值」的概念和重要性\n- 建立前台、助理和醫師間的無縫協作流程，確保一致的溝通與服務\n- 定期病例研討與經驗分享，提升整體團隊對患者需求的敏感度\n\n4. 健康夥伴計畫\n- 轉變傳統的「醫患關係」為長期「健康夥伴關係」\n- 引入「預防性口腔健康管理」概念，從治療導向轉為健康維護導向\n- 家庭式診療模式，強化整個家庭對診所的信任與依賴\n\n新竹一家導入我們系統的牙醫診所實現了53%的患者回診率提升，更重要的是，長期管理型患者比例從17%增加到46%，大幅降低新患獲取成本，同時提高了診所的收入穩定性和可預測性。真正成功的院內行銷不是關於短期交易，而是建立持久且互利的關係。',
    category: '牙醫行銷'
  },
  {
    question: '如何透過網站SEO提升牙醫診所在特定治療項目的搜尋排名？',
    answer: '針對性的SEO策略可以幫助牙醫診所在高價值治療項目上獲得更好的搜尋可見度：\n\n1. 專業服務頁面優化\n- 為每項主要治療服務建立獨立的深度內容頁面\n- 使用結構化數據標記特定治療的關鍵信息\n- 創建服務特定的FAQ區塊，針對患者常見問題\n- 整合相關案例研究和患者見證增強可信度\n\n2. 關鍵字研究與內容策略\n- 識別特定治療的高意圖搜尋詞和長尾關鍵字\n- 分析搜尋意圖，區分信息型vs.交易型查詢\n- 建立關鍵字主題群與內容地圖\n- 季節性和趨勢性關鍵字監測與調整\n\n3. 技術SEO專項優化\n- 頁面加載速度優化，特別是首次內容顯示時間\n- 移動優先索引準備和用戶體驗\n- 內部連結架構強化核心服務頁面權重\n- 局部結構化數據標記增強相關性\n\n4. 本地SEO增強策略\n- 地理特定關鍵字的內容本地化\n- 城市/區域特定登陸頁面開發\n- Google商家檔案服務項目優化\n- 本地引用和目錄一致性建立\n\n我們的牙醫診所客戶通過專項SEO策略，在目標治療關鍵字上平均提升了15個搜尋排名位置。這種針對性方法不僅提高了總體流量，更重要的是提高了轉化率和每位新患者的平均價值。透過將SEO努力集中在高回報治療項目上，診所通常能在3-6個月內看到投資回報。',
    category: '數位策略'
  },
  {
    question: '如何有效管理和回應牙醫診所的線上評論？',
    answer: '在當代醫療環境中，您診所的線上聲譽已成為塑造品牌認知的決定性因素：\n\n1. 系統化的評論徵集策略\n- 多達87%的台灣患者在選擇新診所前會查看線上評論，但僅10%會主動留下評價\n- 建立「評論獲取渠道」，識別診療過程中的最佳時機點\n- 利用NPS(淨推薦值)問卷先行篩選，確保引導高滿意度患者分享體驗\n- 針對不同世代患者採取差異化的評論邀請策略\n\n2. 專業的評論回應框架\n- 建立診所聲音的一致性，確保所有回應反映核心價值觀與專業標準\n- 正面評論深化：超越簡單感謝，加入個性化內容與後續健康建議\n- 負面評論轉機：48小時內的專業回應，將焦點從問題轉向解決方案\n- 評論回應SEO優化：策略性納入關鍵治療名稱與地理位置\n\n3. 評論數據的深度分析與應用\n- 情感分析工具應用，量化患者反饋中的隱含情緒\n- 主題聚類技術，發現評論中反覆出現的服務缺口\n- 季度評論趨勢報告，追蹤服務改進的實際成效\n\n4. 評論危機的預防與管理\n- 建立早期預警系統，監測可能擴大的負面輿情\n- 準備應對腳本與溝通模板，確保危機時刻的一致回應\n- 制定內部評論事件處理流程，明確責任分工與上報機制\n\n台北某連鎖牙科診所實施我們的評論管理系統後，Google商家頁面評分從4.3提升至4.9，更重要的是，經由分析評論中患者最在意的因素，重新調整了診所的服務流程，進而提高了新患轉化率23%，實現評論管理從被動防禦到主動業務成長的轉變。',
    category: '數位策略'
  },
  {
    question: '診所如何有效追蹤數位行銷活動帶來的實際新患者數量？',
    answer: '精確追蹤數位行銷與實際患者轉化的關聯是優化行銷投資的基礎：\n\n1. 多渠道追蹤系統設置\n- 獨特的追蹤電話號碼設置給不同行銷渠道\n- 特定來源的線上預約表單和確認頁面\n- UTM參數結構設計和實施規範\n- 跨裝置用戶追蹤和數據整合\n\n2. 線下轉化捕捉方法\n- 前台「如何得知我們」詢問流程和記錄系統\n- 新患者調查表設計和數據收集\n- 電話諮詢來源識別話術指南\n- 線下轉化資料與線上數據整合\n\n3. CRM與實踐管理系統整合\n- 行銷渠道資料與患者管理系統對接\n- 患者旅程全流程數據追蹤\n- 初診到復診全程轉化率分析\n- 不同來源患者的終身價值比較\n\n4. 歸因模型和報告系統\n- 多點接觸歸因模型實施\n- 自動化報告設置和關鍵指標儀表板\n- ROI計算框架和投資調整建議\n- 預測性分析和趨勢識別\n\n我們為診所建立從線上接觸到實際就診的完整追蹤系統，消除行銷效果評估的盲點。這種方法不僅準確測量不同渠道的實際表現，還能評估它們帶來的患者質量。我們的診所客戶透過數據驅動的預算分配，平均提高了42%的行銷投資回報，同時清晰識別出哪些渠道帶來最有價值的長期患者。',
    category: '成效評估'
  }
];

// 動態引入CountUp以減少首屏加載大小
const CountUp = dynamic(() => import('react-countup'), {
  loading: () => <div className="text-2xl sm:text-3xl font-bold">99%</div>,
  ssr: false
})

// 1. 定義塊內容類型
interface MarketingBlock {
  en: {
    title: string;
    subtitle: string;
  };
  zh: {
    title: string;
    subtitle: string;
  };
  delay: number;
  className: string;
}

// 主要Hero區域
const HeroSection = memo(function HeroSection() {
  // 引用與視窗可見性偵測
  const heroRef = useRef<HTMLElement | null>(null);
  const { ref: heroInViewRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  // 使用callback ref合併兩個ref
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      heroRef.current = node;
      heroInViewRef(node);
    },
    [heroInViewRef]
  );
  
  // 標題數據 - 使用useMemo避免重新創建
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

  // 使用useTransition提高性能和用戶體驗
  const [isPending, startTransition] = useTransition();
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  
  // 避免標題切換過於頻繁，導致不必要的重繪
  const titleInterval = useRef<NodeJS.Timeout | null>(null);
  
  // 優化定期切換標題 - 使用useRef儲存interval引用，防止效能問題
  useEffect(() => {
    // 確保只有在瀏覽器環境才運行
    if (typeof window !== 'undefined') {
      titleInterval.current = setInterval(() => {
        // 使用useTransition避免阻塞主線程
        startTransition(() => {
          setCurrentTitleIndex(prevIndex => (prevIndex + 1) % titles.length);
        });
      }, 4000);
    }
    
    return () => {
      if (titleInterval.current) {
        clearInterval(titleInterval.current);
      }
    };
  }, [titles.length, startTransition]);
  
  // 標籤數據 - 使用useMemo避免重新創建
  const tags = useMemo(() => [
    { id: 'ai', name: '#AI' },
    { id: 'creativity', name: '#Creativity' },
    { id: 'design', name: '#Design Thinking' },
    { id: 'insight', name: '#Insight' }
  ], []);

  // 優化性能監測
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
      {/* 優化背景 - 使用漸變色作為初始背景，減少CLS */}
      <div className="absolute inset-0">
        {/* 首先顯示純色漸變背景 - 立即顯示提供視覺基礎 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-dark"></div>
        
        {/* 優化LCP，移除緩慢的背景載入轉場效果 */}
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
          {/* 標題區塊 - 標題置左對齊，其他元素保持居中 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="px-4 sm:px-6 flex flex-col items-center"
            style={{ willChange: 'opacity' }} // 提示瀏覽器這個元素將發生動畫變化
          >
            {/* 標題結構 - 中英文標題置左對齊 */}
            <div className="w-full max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTitleIndex}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={heroTitleVariants}
                  className="font-bold text-white text-left"
                  style={{ willChange: 'opacity, transform' }} // 提示瀏覽器這個元素將發生動畫變化
                >
                  {/* 中文主副標題 */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl leading-tight">
                    {titles[currentTitleIndex].main}
                    <span className="block mt-1 mb-4 font-extrabold text-white">
                      {titles[currentTitleIndex].sub}
                    </span>
                  </h1>
                  
                  {/* 英文主副標題 - 視覺上分隔但保持關聯性 */}
                  <div className="mt-3 mb-3 text-lg sm:text-xl md:text-2xl lg:text-3xl text-white leading-tight tracking-wide">
                    {titles[currentTitleIndex].enMain},
                    <div className="font-extrabold text-white mt-2">
                      {titles[currentTitleIndex].enSub}.
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* 單行白框線條標籤設計 - 保持居中，具有適當高度預留 */}
            <div className="w-full max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[750px] mx-auto overflow-hidden min-h-[70px]">
              <div className="flex justify-between items-center border-t border-b border-white/40 py-3 px-1 my-6 text-center">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs sm:text-sm md:text-base text-white font-medium tracking-wide whitespace-nowrap"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
        
            {/* 預約按鈕 - 黑底白字扁平化設計，預留固定高度避免CLS */}
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
            
            {/* 預約按鈕下方的向下滾動指示器 - 保持置中，使用CSS動畫替代framer-motion */}
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
  // 引用與視窗可見性偵測
  const marketingRef = useRef<HTMLElement | null>(null);
  const { ref: marketingInViewRef, inView: marketingInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '0px 0px -10% 0px',
  });
  
  // 使用callback ref合併兩個ref
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      marketingRef.current = node;
      marketingInViewRef(node);
    },
    [marketingInViewRef]
  );

  // 階梯式行銷文案數據 - 使用useMemo避免重新創建
  const contentBlocks = useMemo<MarketingBlock[]>(() => [
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
      delay: 0.2, // 降低延遲時間
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
      delay: 0.3, // 降低延遲時間，減少等待
      className: "ml-[10%]"
    }
  ], []);

  // 優化性能監測
  useEffect(() => {
    if (marketingInView && window.performance && window.performance.mark) {
      window.performance.mark('marketing-section-visible');
    }
  }, [marketingInView]);

  return (
    <section 
      ref={setRefs}
      className="relative bg-primary overflow-hidden py-16 md:py-20"
      id="marketing-content"
    >
      {/* 背景設計 - 使用普通div和CSS背景替代Image組件 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-primary"></div>
        {/* 使用Next.js 15+ Image組件代替CSS背景 */}
        <Image 
          src="/images/bgline-w-small.webp"
          alt=""
          fill
          sizes="100vw"
          quality={30}
          loading="lazy"
          className="object-cover opacity-100"
          style={{ 
            objectPosition: 'center',
          }}
          aria-hidden="true"
        />
      </div>
      
      {/* 階梯式行銷文案內容 - 提高效能的容器 */}
      <div className="container-custom relative z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {contentBlocks.map((block, index) => (
            <motion.div
              key={index}
              className={`mb-16 md:mb-20 ${block.className}`}
              initial={{ opacity: 0, y: 20 }}
              animate={marketingInView ? 
                { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: block.delay,
                    duration: 0.3,
                    ease: "easeOut"
                  }
                } : 
                { opacity: 0, y: 20 }
              }
              style={{ 
                willChange: 'opacity, transform',
                contain: 'content' // 提高效能的CSS屬性
              }}
            >
              {/* 內容區塊 - 左側英文右側中文 */}
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 content-visibility-auto"> {/* 使用content-visibility提高滾動效能 */}
                {/* 英文標題部分 - 固定在左側 */}
                <div className="w-full md:w-1/2 md:pr-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight font-accent">
                    {block.en.title}
                  </h2>
                  {block.en.subtitle && (
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mt-2 leading-tight tracking-tight">
                      {block.en.subtitle}
                    </h3>
                  )}
                </div>
                
                {/* 中文內容部分 - 固定在右側 */}
                <div className="w-full md:w-1/2 mt-6 md:mt-0">
                  <div className="border-l-4 border-white pl-4 md:pl-6">
                    <p className="text-xl md:text-2xl lg:text-3xl text-white font-medium leading-tight">
                      {block.zh.title}
                    </p>
                    {block.zh.subtitle && (
                      <p className="text-lg md:text-xl text-white mt-2 font-medium leading-tight">
                        {block.zh.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* 向下滾動指示器 - 使用CSS動畫替代framer-motion以提高效能 */}
      <div className="relative z-10 pb-8 flex justify-center mt-4">
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

// 更新服務特色區塊 - 使用useTransition優化用戶體驗
const FeatureSection = memo(function FeatureSection() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);
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
  
  // 記憶化特點數據，避免不必要的重新渲染
  const memoizedFeatures = useMemo(() => features, []);
  
  // 處理手動控制輪播
  const handlePrev = useCallback(() => {
    if (isMobile) {
      setCurrentFeature(prev => 
        prev === 0 ? memoizedFeatures.length - 1 : prev - 1
      );
    }
  }, [isMobile, memoizedFeatures.length]);
  
  const handleNext = useCallback(() => {
    if (isMobile) {
      setCurrentFeature(prev => 
        prev === memoizedFeatures.length - 1 ? 0 : prev + 1
      );
    }
  }, [isMobile, memoizedFeatures.length]);
  
  const handleSlideChange = useCallback((index: number) => {
    setCurrentFeature(index);
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
    <section id="features" className="py-16 md:py-20 lg:py-24 bg-gray-50 px-4 sm:px-6">
      <div className="container-custom relative z-10">
        <AnimatedSection className="text-center mb-12 sm:mb-20" suppressHydrationWarning>
          <h2 className="inline-flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 relative" suppressHydrationWarning>
            <span className="relative z-10">專注醫療的數位行銷</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 rounded-full -z-1"></span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto" suppressHydrationWarning>
            我們深入理解醫療產業特性，提供從品牌策略到數位執行的全方位服務，協助診所開發最適合的成長方案
          </p>
        </AnimatedSection>
        
        <div className="hidden md:block">
        <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8"
          variants={animations.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {memoizedFeatures.map((feature, index) => (
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
              className="transition-transform duration-300 ease-out will-change-transform"
              style={{
                display: 'flex',
                transform: `translateX(-${currentFeature * 100}%)`
              }}
            >
              {memoizedFeatures.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="min-w-full px-2"
                >
                  <div 
                    className="group bg-white p-6 border border-gray-100 shadow-sm flex flex-col h-full hover:border-primary relative"
                    style={{
                      transform: index === currentFeature ? 'translateZ(0)' : 'none',
                      backfaceVisibility: 'hidden',
                      contain: 'layout style paint'
                    }}
                  >
                    <div className="mb-5 flex justify-center">
                      {React.createElement(feature.icon, { 
                        size: 32, 
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
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 輪播控制 - 統一樣式 */}
          <div className="mt-8 flex flex-col items-center">
            <CarouselIndicator 
              total={memoizedFeatures.length}
              current={currentFeature}
              onChange={handleSlideChange}
              className="mb-4"
            />
            
            <div className="flex items-center gap-4">
              <CarouselButton 
                direction="prev" 
                onClick={handlePrev}
                size="medium"
                ariaLabel="查看上一個特色"
              />
              <CarouselButton 
                direction="next" 
                onClick={handleNext}
                size="medium"
                ariaLabel="查看下一個特色"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

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
          <p className="text-white max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
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
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 border border-red-600 text-white hover:bg-red-700"
                  aria-label="上一個服務"
                  style={{ touchAction: 'manipulation' }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex gap-3">
                  {services.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        currentSlide === index ? 'bg-red-600 w-7' : 'bg-gray-300 w-3 hover:bg-gray-400'
                      }`}
                      aria-label={`前往服務 ${index + 1}`}
                      style={{ touchAction: 'manipulation' }}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={handleNext}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 border border-red-600 text-white hover:bg-red-700"
                  aria-label="下一個服務"
                  style={{ touchAction: 'manipulation' }}
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
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // 精選核心數據
  const stats: StatItem[] = useMemo(() => [
    {
      value: 50,
      suffix: "+",
      label: "合作診所",
      description: "全台醫療網絡覆蓋",
      icon: <Stethoscope className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
    },
    {
      value: 700,
      suffix: "萬+",
      label: "月廣告投放",
      description: "精準投放策略",
      icon: <ChartIcon className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
    },
    {
      value: 98,
      suffix: "%",
      label: "客戶滿意度",
      description: "專業團隊品質保證",
      icon: <Handshake className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
    }
  ], []);
  
  // 客戶端掛載處理
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 響應式處理
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 自動輪播
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isMobile, stats.length]);
  
  return (
    <section 
      ref={ref} 
      className={`bg-red-600 py-8 md:py-16 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* 標題區塊 */}
        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            顯著成效數據
          </h2>
          <p className="text-white max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            多年實證數據驅動診所業務增長，提供可量化的成功案例與投資回報
          </p>
        </motion.div>

        {/* 統計數據卡片 */}
        <div className="relative">
          {/* 桌面版網格顯示 */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="p-6 rounded-lg h-full flex flex-col border border-white/20">
                  {/* 圖標與數據值並排 */}
                  <div className="flex items-center justify-between mb-3">
                    <div>{stat.icon}</div>
                    <div className="flex items-baseline">
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
                  </div>
                  
                  {/* 標題與描述 */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{stat.label}</h3>
                    <p className="text-white text-sm">{stat.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 移動端輪播顯示 */}
          <div className="md:hidden">
            <div 
              ref={carouselRef}
              className="relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                  style={{ 
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d' 
                  }}
                >
                  <div className="p-6 rounded-lg flex flex-col border border-white/20">
                    {/* 圖標與數據值並排 */}
                    <div className="flex items-center justify-between mb-3">
                      <div>{stats[currentIndex].icon}</div>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-white tabular-nums">
                          {inView && isMounted ? (
                            <CountUp
                              start={0}
                              end={stats[currentIndex].value}
                              duration={2}
                              separator=","
                              decimals={0}
                              enableScrollSpy={false}
                            />
                          ) : (
                            stats[currentIndex].value
                          )}
                        </span>
                        <span className="text-xl font-bold text-white ml-1">{stats[currentIndex].suffix}</span>
                      </div>
                    </div>
                    
                    {/* 標題與描述 */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{stats[currentIndex].label}</h3>
                      <p className="text-white text-sm">{stats[currentIndex].description}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 輪播指示器 */}
              <div className="flex justify-center mt-6 gap-3">
                {stats.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-7 h-7 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? 'bg-white w-10' : 'bg-white/50'
                    }`}
                    aria-label={`切換到第 ${idx + 1} 張統計卡片`}
                    style={{ touchAction: 'manipulation' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

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
                              className={`w-4 h-4 rounded-full transition-all duration-300 ${
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

// 修改FAQSection的定義方式，並導出為React組件
function FAQSection() {
  const [isPending, startTransition] = useTransition();
  const memoizedFaqs = useMemo(() => faqs, []);
  
  // 使用useMemo獲取所有類別
  const categories = useMemo(() => {
    const categorySet = new Set(memoizedFaqs.map(faq => faq.category));
    return Array.from(categorySet);
  }, [memoizedFaqs]);
  
  // 使用useState管理活動的分類和開啟的FAQ
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // 使用useMemo過濾FAQ
  const filteredFaqs = useMemo(() => {
    if (activeCategory === 'all') {
      return memoizedFaqs; // 當選擇「全部問題」時，返回所有FAQ
    }
    return memoizedFaqs.filter(faq => faq.category === activeCategory);
  }, [memoizedFaqs, activeCategory]);
  
  // 處理分類更改
  const handleTabChange = useCallback((category: string) => {
    startTransition(() => {
      setActiveCategory(category);
      setOpenFaq(null);
    });
  }, []);
  
  // 切換FAQ開關狀態
  const toggleFaq = useCallback((id: number) => {
    startTransition(() => {
      setOpenFaq(openFaq === id ? null : id);
    });
  }, [openFaq]);
  
  // 格式化FAQ答案，處理換行
  const formatAnswer = useCallback((answer: string) => {
    // 根據雙換行符分割段落
    const paragraphs = answer.split('\n\n');
    
    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, idx) => {
          // 如果段落包含列表項目（以"- "開頭的行）
          if (paragraph.includes('\n- ')) {
            const [listTitle, ...listItems] = paragraph.split('\n- ');
            return (
              <div key={idx} className="space-y-2">
                <p className="font-medium text-gray-800">{listTitle}</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5">
                  {listItems.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-gray-600 text-sm sm:text-base leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            );
          }
          // 一般段落
          return <p key={idx} className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">{paragraph}</p>;
        })}
      </div>
    );
  }, []);
  
  // Intersection Observer觀察元素
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log("FAQ Section visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef} 
      className="py-16 md:py-24 px-4 bg-gray-50/70"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">常見問題</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我們整理了關於數位行銷的常見問題，協助您更了解如何透過專業行銷策略提升診所業績
          </p>
        </div>
        
        {/* 類別選擇器 - 優化響應式設計 */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            全部問題
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleTabChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* FAQ列表 - 改善排版與間距 */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-gray-50"
              >
                <h3 className="font-semibold text-base sm:text-lg pr-8 text-gray-900">{faq.question}</h3>
                <div className={`transform transition-transform duration-300 ${
                  openFaq === index ? 'rotate-180' : ''
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              
              {/* 答案區塊 - 加強結構化與可讀性 */}
              {openFaq === index && (
                <div 
                  className="px-6 pb-6 pt-2 border-t border-gray-100"
                >
                  {formatAnswer(faq.answer)}
                  <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                    <p>還有其他問題？<a href="/contact" className="text-primary hover:underline">聯絡我們</a>獲取專業建議</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 使用memo包裝FAQSection
const MemoizedFAQSection = memo(FAQSection);

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
                  <h3 className="font-bold text-gray-900 text-lg md:text-xl">{clientTestimonials[currentSlide].author}</h3>
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
                  className={`w-4 h-4 rounded-full transition-all ${
                    currentSlide === index 
                      ? 'bg-primary w-7' 
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

// 最終組合 - 使用Suspense優化首頁效能
const HomePage = () => {
  const [isPending, startTransition] = useTransition();
  
  // 使用useEffect記錄頁面性能
  useEffect(() => {
    // 初始化性能標記
    if (window.performance && window.performance.mark) {
      window.performance.mark('homepage-mounted');
      
      // 註冊性能觀察者 - 使用Next.js 15+優化的方式
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          // 收集重要性能指標
          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint' ||
                entry.entryType === 'layout-shift' ||
                entry.entryType === 'first-input') {
              console.log(`Performance: ${entry.entryType}`, entry);
            }
          });
        });
        
        // 監控Web Vitals核心指標
        observer.observe({
          entryTypes: ['largest-contentful-paint', 'layout-shift', 'first-input']
        });
        
        return () => observer.disconnect();
      }
    }
  }, []);

  return (
    <>
      {/* 使用<ErrorBoundary>+<Suspense>替換isComponentMounted邏輯 */}
      <ErrorBoundary fallback={<div className="min-h-screen flex items-center justify-center">載入中...</div>}>
        <HeroSection />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<div className="py-16 bg-primary">載入中...</div>}>
        <MarketingSection />
      </ErrorBoundary>
      
      {/* 使用<Suspense>進行懶加載 */}
      <ErrorBoundary>
        <Suspense fallback={<div className="py-16 bg-white flex items-center justify-center">
          <div className="animate-pulse h-8 w-8 rounded-full bg-primary/20"></div>
        </div>}>
          <FeatureSection />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Suspense fallback={<div className="py-24 bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse h-8 w-8 rounded-full bg-primary/20"></div>
        </div>}>
          <ServiceSection />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Suspense fallback={<div className="py-20 bg-white flex items-center justify-center">
          <div className="animate-pulse h-8 w-8 rounded-full bg-primary/20"></div>
        </div>}>
          <StatsSection />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Suspense fallback={<div className="py-20 bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse h-8 w-8 rounded-full bg-primary/20"></div>
        </div>}>
          <CaseStudiesSection />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Suspense fallback={<div className="py-16 bg-white flex items-center justify-center">
          <div className="animate-pulse h-8 w-8 rounded-full bg-primary/20"></div>
        </div>}>
          <TestimonialSection />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Suspense fallback={<div className="py-20 bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse h-8 w-8 rounded-full bg-primary/20"></div>
        </div>}>
          <MemoizedFAQSection />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Suspense fallback={<div className="py-16 bg-white flex items-center justify-center">
          <div className="animate-pulse h-8 w-8 rounded-full bg-primary/20"></div>
        </div>}>
          <ContactSection />
        </Suspense>
      </ErrorBoundary>
      
      {/* 使用React 19 useEffect處理性能監測，移除舊的script */}
    </>
  );
}

export default HomePage; 