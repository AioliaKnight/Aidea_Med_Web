'use client'

import React, { useEffect, useState, Suspense, useRef, useCallback, useMemo, memo, lazy } from 'react'
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
  Award,
  ArrowRight,
} from 'lucide-react'
import { Logo, CTASection, AnimatedSection } from '@/components/common'
import { 
  heroTitleVariants, 
  heroSubtitleVariants,
  marketingStatementVariants,
  tagAnimationVariants
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
const CaseCard = dynamic(() => import('@/components/case/CaseCard').then(mod => mod.CaseCard), {
  loading: () => <div className="h-full bg-gray-100 animate-pulse rounded-lg" aria-hidden="true"></div>,
  ssr: true
})

const ContactForm = dynamic(() => import('@/components/contact/ContactForm'), {
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" aria-hidden="true"></div>,
  ssr: true
})

const ContactInfo = dynamic(() => import('@/components/contact/ContactInfo'), {
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg" aria-hidden="true"></div>,
  ssr: true
})

// 將CountUp改為單獨的動態導入
const CountUp = dynamic(() => import('react-countup'), {
  loading: () => <div className="text-2xl sm:text-3xl font-bold">99%</div>,
  ssr: false
})

// 常見問題分離為單獨的組件文件，這裡只保留引用
import { HomeFAQSection } from '@/components/pages/sections/HomeFAQSection'

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

  // 階梯式行銷文案數據
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
      delay: 0.2,
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
      delay: 0.3,
      className: "ml-[10%]"
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
      className="relative bg-primary overflow-hidden py-16 md:py-20"
      id="marketing-content"
    >
      {/* 背景設計 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-primary"></div>
        <Image 
          src="/images/bgline-w-small.webp"
          alt=""
          fill
          sizes="100vw"
          quality={30}
          loading="lazy"
          className="object-cover opacity-100"
          style={{ objectPosition: 'center' }}
          aria-hidden="true"
        />
                </div>
                
      {/* 階梯式行銷文案內容 */}
      <div className="container-custom relative z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {contentBlocks.map((block, index) => (
                <motion.div
              key={index}
              className={`mb-16 md:mb-20 ${block.className}`}
              initial={{ opacity: 0, y: 20 }}
              animate={marketingInView ? 
                { opacity: 1, y: 0, transition: { delay: block.delay, duration: 0.3, ease: "easeOut" }} : 
                { opacity: 0, y: 20 }
              }
            >
              {/* 內容區塊 */}
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                {/* 英文標題部分 */}
                <div className="w-full md:w-1/2 md:pr-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight">
                    {block.en.title}
                  </h2>
                  {block.en.subtitle && (
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mt-2 leading-tight tracking-tight">
                      {block.en.subtitle}
              </h3>
                  )}
                  </div>
                  
                {/* 中文內容部分 */}
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
      
      {/* 向下滾動指示器 */}
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
    >
      <div className="container-custom px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 text-center mb-4">
            我們的<span className="text-primary">核心</span>特色
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            結合醫療專業與數位行銷專長，我們提供獨特的服務讓您的醫療團隊脫穎而出
          </p>
          
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
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                </div>
              ))}
            </div>
        </div>
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
        
      {/* 從這裡開始的組件拆分到單獨的文件中 */}
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse"></div>}>
        <HomeFAQSection />
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
          href: "/services",
          text: "了解服務內容",
          variant: "black"
        }}
      />
    </>
  );
};

export default HomePage; 