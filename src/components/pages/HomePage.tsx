'use client'

import { useEffect, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import Link from 'next/link'
import Image from 'next/image'

// SVG圖標組件
interface IconProps {
  className?: string;
}

const AIIcon = ({ className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v-1a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7H2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
    <path d="M10 17a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
    <path d="M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    <path d="M16 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);

const TeamIcon = ({ className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const DataIcon = ({ className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6" y2="6"></line>
    <line x1="6" y1="18" x2="6" y2="18"></line>
    <line x1="10" y1="6" x2="20" y2="6"></line>
    <line x1="10" y1="18" x2="20" y2="18"></line>
  </svg>
);

const ServiceIcon = ({ className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7"></path>
    <path d="M15 7h6v6"></path>
  </svg>
);

// 動畫配置
const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// 服務特色數據
const features = [
  {
    title: 'AI 驅動分析',
    description: '運用人工智慧技術，提供精準的市場分析與行銷策略建議，為診所找出最佳發展方向',
    icon: AIIcon
  },
  {
    title: '專業團隊',
    description: '擁有豐富醫療行銷經驗的跨領域專家團隊，了解診所特殊需求與挑戰',
    icon: TeamIcon
  },
  {
    title: '數據導向',
    description: '以實際數據成果為導向，持續優化行銷策略，確保每一分投資都能帶來最大回報',
    icon: DataIcon
  },
  {
    title: '全方位服務',
    description: '從品牌定位到數位行銷，提供完整的解決方案，一站式滿足診所所有行銷需求',
    icon: ServiceIcon
  }
]

// 案例數據的類型定義
interface CaseStudy {
  id: string;
  title: string;
  description: string;
  image: string;
  imageWebp?: string;
  imagePlaceholder?: string;
  imageSizes?: {
    sm: string;
    md: string;
    lg: string;
  };
  category: string;
  highlight: string;
  highlightLabel: string;
  results: string[];
  color: string;
}

// 案例數據
const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    title: '雅德思牙醫診所',
    description: '透過社群媒體與SEO優化，幫助診所月均新客數增加150%，並建立專業品牌形象',
    image: '/Case_1.jpg',
    imageWebp: '/Case_1.webp',
    imagePlaceholder: '/Case_1_placeholder.jpg',
    imageSizes: {
      sm: '/Case_1_sm.jpg',
      md: '/Case_1_md.jpg',
      lg: '/Case_1.jpg',
    },
    category: '品牌重塑',
    highlight: '150%',
    highlightLabel: '新客數成長',
    results: ['社群互動增加87%', '品牌認知度提升65%', '預約轉化率提高34%'],
    color: 'from-white-600 to-primary'
  },
  {
    id: 'case-2',
    title: '台中皓皓牙醫診所',
    description: '建立品牌識別系統與網站改版，使線上預約率提升85%，大幅降低行政成本',
    image: '/Case_2.jpg',
    imageWebp: '/Case_2.webp',
    imagePlaceholder: '/Case_2_placeholder.jpg',
    imageSizes: {
      sm: '/Case_2_sm.jpg',
      md: '/Case_2_md.jpg',
      lg: '/Case_2.jpg',
    },
    category: '數位轉型',
    highlight: '85%',
    highlightLabel: '線上預約率',
    results: ['營運效率提升56%', '客戶滿意度增加42%', '回診率提高23%'],
    color: 'from-white-600 to-primary'
  },
  {
    id: 'case-3',
    title: '雲天牙醫診所',
    description: '導入整合行銷策略，將診所IG粉絲從500成長到1萬，有效觸及年輕客群',
    image: '/Case_3.png',
    imageWebp: '/Case_3.webp',
    imagePlaceholder: '/Case_3_placeholder.png',
    imageSizes: {
      sm: '/Case_3_sm.png',
      md: '/Case_3_md.png',
      lg: '/Case_3.png',
    },
    category: '社群經營',
    highlight: '20x',
    highlightLabel: '粉絲成長',
    results: ['年輕客群增加72%', '美學療程預約增加93%', '品牌曝光提升128%'],
    color: 'from-white-600 to-primary'
  }
]

// 動畫區塊組件
interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

const AnimatedSection = ({ children, className = '', delay = 0 }: AnimatedSectionProps) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      controls.start('animate')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // 圖片加載狀態管理
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})
  const [imageErrorStates, setImageErrorStates] = useState<Record<string, boolean>>({})
  
  // 當組件掛載時初始化所有案例圖片的加載狀態
  useEffect(() => {
    const initialLoadingState: Record<string, boolean> = {};
    const initialErrorState: Record<string, boolean> = {};
    
    caseStudies.forEach(cs => {
      initialLoadingState[cs.id] = true;
      initialErrorState[cs.id] = false;
    });
    
    setImageLoadingStates(initialLoadingState);
    setImageErrorStates(initialErrorState);
  }, []);

  // 監控滾動位置以顯示/隱藏固定導航
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 處理圖片加載完成
  const handleImageLoad = (id: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [id]: false
    }));
  };
  
  // 處理圖片加載錯誤
  const handleImageError = (id: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [id]: false
    }));
    setImageErrorStates(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  // 根據設備寬度獲取適當尺寸的圖片
  const getResponsiveImageSrc = (caseStudy: CaseStudy) => {
    if (!caseStudy.imageSizes) return caseStudy.image;
    
    // 根據當前窗口寬度選擇適當的圖片尺寸
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      
      if (width < 640) {
        return caseStudy.imageSizes.sm;
      } else if (width < 1024) {
        return caseStudy.imageSizes.md;
      }
    }
    
    return caseStudy.imageSizes.lg || caseStudy.image;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 改進版 */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* 背景 */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary to-accent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* 背景圖形 */}
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 1.2 }}
        >
          <Image
            src="/images/bgline-w.png"
            alt="背景線條"
            fill
            className="object-cover mix-blend-soft-light"
            quality={100}
            sizes="100vw"
            priority
          />
        </motion.div>
        
        {/* 浮動裝飾元素 */}
        <motion.div 
          className="absolute top-1/4 right-[15%] w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 left-[15%] w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 2, delay: 0.7 }}
        />
        
        {/* 內容 */}
        <div className="container-custom relative z-20 text-center text-white">
          <AnimatedSection>
            <motion.div
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.8
                  }
                }
              }}
              className="space-y-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none max-w-5xl mx-auto font-display">
                讓診所
                <br />
                <span className="text-white text-shadow-lg">專注醫療</span>
                <br />
                <span className="text-white/90 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-4 block">
                  把行銷交給專家
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-white/95 max-w-3xl mx-auto leading-relaxed px-4">
                專業的醫療行銷團隊，
                <br className="hidden sm:block" />
                為您的診所打造最適合的品牌成長策略
              </p>
            </motion.div>
          </AnimatedSection>
          
          {/* 按鈕群組 - 改進版 */}
          <AnimatedSection delay={0.4}>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
              variants={staggerChildren}
            >
              <Link
                href="/contact"
                className="btn-primary text-lg px-10 py-4 hover:bg-white hover:text-primary transition-all duration-300 shadow-md"
              >
                免費諮詢
              </Link>
              <Link
                href="/service"
                className="btn-outline text-lg px-10 py-4 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                了解服務
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* 案例輪播 - 全新設計 */}
      <section className="relative py-32 bg-gray-50 overflow-hidden">
        {/* 背景圖形 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.06 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/bgline-r.png"
            alt="背景線條"
            fill
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
        </motion.div>
        
        {/* 左側裝飾元素 */}
        <div className="absolute left-0 top-1/4 w-32 h-64 bg-primary/5 -translate-x-1/2"></div>
        
        {/* 右側裝飾元素 */}
        <div className="absolute right-0 bottom-1/4 w-32 h-64 bg-primary/5 translate-x-1/2"></div>
        
        <div className="container-custom relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-primary font-display">
              診所行銷專家團隊
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              專業的醫療行銷團隊，讓您專注於提供優質的醫療服務
            </p>
          </AnimatedSection>
          
          {/* 案例輪播控制器 */}
          <div className="flex justify-center mb-8 sm:mb-12 overflow-x-auto px-4">
            <div className="inline-flex bg-white rounded-full shadow-md p-1.5">
              {caseStudies.map((caseStudy, index) => (
                <button
                  key={caseStudy.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    index === currentSlide 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {caseStudy.category}
                </button>
              ))}
            </div>
          </div>
          
          {/* 案例輪播卡片 */}
          <div className="relative overflow-hidden">
            <div className="relative h-[600px] sm:h-[500px] md:h-[450px]">
              <AnimatePresence mode="wait">
                {caseStudies.map((caseStudy, index) => (
                  index === currentSlide && (
                    <motion.div
                      key={caseStudy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        {/* 左側：視覺展示 - 優化圖片顯示 */}
                        <div className="lg:col-span-5 relative overflow-hidden rounded-sm shadow-lg h-full">
                          {/* 背景漸層 */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${caseStudy.color} opacity-90`}></div>
                          
                          {/* 裝飾元素 */}
                          <div className="absolute top-4 left-4 w-12 h-12 border border-white/20 rounded-sm"></div>
                          <div className="absolute bottom-16 right-4 w-20 h-6 bg-white/10 rounded-sm"></div>
                          <div className="absolute top-1/4 right-8 w-6 h-24 bg-white/5"></div>
                          
                          {/* 案例圖片 - 改進載入和顯示方式 */}
                          <div className="relative z-10 h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5 }}
                              viewport={{ once: true }}
                              className="relative w-full h-[180px] sm:h-[220px] md:h-[260px]"
                            >
                              {/* 顯示加載動畫，僅在加載中且沒有錯誤時 */}
                              {imageLoadingStates[caseStudy.id] && !imageErrorStates[caseStudy.id] && (
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                  <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                                </div>
                              )}
                              
                              {/* 圖片容器 */}
                              <div 
                                className={`relative h-full w-full transition-opacity duration-500 ease-in-out ${
                                  imageLoadingStates[caseStudy.id] ? 'opacity-0' : 'opacity-100'
                                }`}
                              >
                                <picture>
                                  {caseStudy.imageWebp && (
                                    <source 
                                      srcSet={caseStudy.imageWebp} 
                                      type="image/webp" 
                                    />
                                  )}
                                  <Image
                                    src={getResponsiveImageSrc(caseStudy)}
                                    alt={caseStudy.title}
                                    fill
                                    className="object-contain object-center z-10 shadow-lg transition-transform duration-300 hover:scale-105"
                                    priority={index === 0} 
                                    quality={90}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    onLoad={() => handleImageLoad(caseStudy.id)}
                                    onError={() => handleImageError(caseStudy.id)}
                                  />
                                </picture>
                              </div>
                              
                              {/* 圖片加載錯誤時的備用內容 */}
                              {imageErrorStates[caseStudy.id] && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/10 backdrop-blur-sm rounded-md z-20">
                                  <svg 
                                    className="w-12 h-12 mb-2" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={1.5} 
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                                    />
                                  </svg>
                                  <p className="text-sm font-medium">圖片載入失敗</p>
                                </div>
                              )}
                            </motion.div>
                          </div>
                          
                          {/* 強調數字 */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-3 sm:p-4 md:p-5 text-white border-t border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs uppercase tracking-wider opacity-75 mb-1">成效重點</div>
                                <div className="text-sm sm:text-base md:text-xl font-bold">{caseStudy.highlightLabel}</div>
                              </div>
                              <div className="text-xl sm:text-2xl md:text-4xl font-black font-gothic">{caseStudy.highlight}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* 右側：案例詳情 */}
                        <div className="lg:col-span-7 bg-white p-8 shadow-sm rounded-sm flex flex-col">
                          {/* 案例編號和分類 */}
                          <div className="flex justify-between items-center mb-4">
                            <div className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                              {caseStudy.category}
                            </div>
                            <div className="text-4xl font-black text-gray-200">0{index + 1}</div>
                          </div>
                          
                          {/* 標題與描述 */}
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-gothic">{caseStudy.title}</h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">{caseStudy.description}</p>
                          </div>
                          
                          {/* 成效指標 */}
                          <div className="mt-auto">
                            <div className="text-sm font-medium text-primary mb-3 sm:mb-4">實際成效</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                              {caseStudy.results.map((result, idx) => (
                                <div 
                                  key={idx} 
                                  className="bg-gray-50 p-2 sm:p-3 rounded border-l-2 border-primary text-sm sm:text-base"
                                >
                                  <div className="text-gray-800">{result}</div>
                                </div>
                              ))}
                            </div>
                            
                            {/* 按鈕 */}
                            <div className="mt-6 flex justify-between items-center">
                              <Link
                                href={`/case/${caseStudy.id}`}
                                className="inline-flex items-center text-primary font-bold hover:underline"
                              >
                                查看完整案例
                                <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </Link>
                              
                              {/* 分頁導航 */}
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setCurrentSlide(prev => (prev - 1 + caseStudies.length) % caseStudies.length)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                                  aria-label="上一個案例"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setCurrentSlide(prev => (prev + 1) % caseStudies.length)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                                  aria-label="下一個案例"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* 查看更多案例按鈕 */}
          <div className="text-center mt-12">
            <Link 
              href="/case" 
              className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-sm shadow-md hover:bg-primary/90 transition-colors"
            >
              查看更多成功案例
              <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 數據展示區 - 改進版 */}
      <section className="relative py-32 bg-white overflow-hidden">
        {/* 背景線條 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/bgline-r.png"
            alt="背景線條"
            fill
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
        </motion.div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center">
            <AnimatedSection>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 text-primary font-display">
                專業醫療行銷團隊
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8">
                擁有豐富的醫療產業經驗，深入了解診所需求，
                讓您專注於提供優質的醫療服務，我們負責打造您的品牌形象。
              </p>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>專業醫療產業背景</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>客製化行銷策略規劃</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>數據導向成效追蹤</span>
                </div>
              </div>
              <Link
                href="/case"
                className="inline-flex items-center text-primary font-bold hover:underline mt-6"
              >
                了解更多服務內容
                <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <AnimatedSection delay={0.2}>
                <div className="text-center bg-gray-50 p-6 sm:p-8 rounded-sm shadow-sm border-t-4 border-primary">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black text-primary mb-3 sm:mb-4">
                    <CountUp end={500} suffix="+" duration={2.5} />
                  </div>
                  <div className="text-lg sm:text-xl text-gray-600">服務醫療院所</div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <div className="text-center bg-gray-50 p-6 sm:p-8 rounded-sm shadow-sm border-t-4 border-primary">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black text-primary mb-3 sm:mb-4">
                    <CountUp end={150} suffix="%" duration={2.5} />
                  </div>
                  <div className="text-lg sm:text-xl text-gray-600">平均業績成長</div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Partner Section - 改進版 */}
      <section className="relative py-32 bg-primary text-white overflow-hidden">
        {/* 背景線條 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.12 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/bgline-w.png"
            alt="背景線條"
            fill
            className="object-cover mix-blend-soft-light"
            quality={90}
            sizes="100vw"
          />
        </motion.div>

        {/* 裝飾元素 */}
        <motion.div 
          className="absolute top-[20%] left-[10%] w-32 h-32 bg-white/5 rounded-full backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />
        
        <motion.div 
          className="absolute bottom-[20%] right-[10%] w-40 h-40 bg-white/5 rounded-full backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />

        <div className="container-custom relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none font-display">
                THE MARKETING PARTNER
                <br />
                FOR HEALTHCARE
              </h2>
              <p className="text-xl sm:text-2xl text-white/90 leading-relaxed font-gothic">
                COMPREHENSIVE BRAND INTEGRATION
                <br />
                START THE CONVERSATION
              </p>
              
              {/* 新增視覺元素 */}
              <motion.div 
                className="flex justify-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <svg className="w-24 h-24 text-white/25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2,12c0,5.5,4.5,10,10,10s10-4.5,10-10S17.5,2,12,2S2,6.5,2,12z"/>
                  <path d="M16,12l-4,4l-4-4"/>
                  <path d="M12,8v8"/>
                </svg>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 服務特色 - 改進版 */}
    <section className="relative py-32 bg-gray-50 overflow-hidden">
        {/* 背景線條 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.08 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/bgline-r.png"
            alt="背景線條"
            fill
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
        </motion.div>

        <div className="container-custom relative z-10">
          <AnimatedSection className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-primary font-display">
              全方位診所行銷服務
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              從品牌定位到數位行銷，我們提供完整的解決方案，
              讓您專注於提供優質的醫療服務，我們負責打造您的品牌形象
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.2}>
                <motion.div 
                  className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border-l-4 border-primary hover:bg-gray-50 transition-all duration-300"
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.1)' }}
                >
                  <div className="mb-4 sm:mb-6 text-primary">
                    <feature.icon className="w-12 h-12 sm:w-16 sm:h-16" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-primary font-gothic">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 區塊 - 改進版 */}
      <section className="relative py-32 bg-white overflow-hidden">
        {/* 背景漸層 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto bg-primary text-white p-12 rounded-sm shadow-lg relative overflow-hidden">
            {/* 裝飾元素 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 text-center">
              <AnimatedSection>
                <h2 className="text-4xl sm:text-5xl font-black mb-6 sm:mb-8 leading-tight font-display">
                  準備好讓您的診所更上一層樓了嗎？
                </h2>
                <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto">
                  立即與我們聯繫，讓我們為您的診所打造專屬的行銷策略，
                  讓您專注於提供優質的醫療服務
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center bg-white text-primary text-lg px-8 sm:px-10 py-3 sm:py-4 hover:bg-white/90 transition-all duration-300 shadow-md"
                  >
                    立即預約諮詢
                    <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <Link
                    href="/service"
                    className="inline-flex items-center justify-center bg-transparent text-white text-lg px-8 sm:px-10 py-3 sm:py-4 border-2 border-white hover:bg-white/10 transition-all duration-300"
                  >
                    了解更多服務
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 