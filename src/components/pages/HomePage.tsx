'use client'

import { useEffect, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import Link from 'next/link'
import Image from 'next/image'
import { Spinner } from '@/components/common/Spinner'

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

// 服務流程數據
const serviceProcess = [
  {
    step: '01',
    title: '需求診斷',
    description: '深入了解診所現況、目標客群和發展方向，制定客製化行銷策略',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  {
    step: '02',
    title: '策略規劃',
    description: '根據診斷結果，提供完整的行銷策略建議，包含品牌定位、通路規劃等',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    step: '03',
    title: '執行優化',
    description: '專業團隊執行行銷策略，持續監測成效並即時調整優化',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    step: '04',
    title: '成效追蹤',
    description: '定期提供詳細成效報告，分析關鍵指標並提出改善建議',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
]

// 團隊成員資料
const teamMembers = [
  {
    name: '陳維鈞',
    nameEn: 'Wilson Chen',
    title: '創辦人暨執行長',
    titleEn: 'Founder & CEO',
    expertise: ['醫療品牌策略', '診所數位轉型', '整合行銷規劃'],
    description: '擁有超過15年醫療行銷經驗，協助百家診所成功打造品牌。專精於整合數位策略與品牌發展，為診所制定精準的成長方案。曾獲選台灣醫療創新百大。',
    image: '/images/team/member-1.png',
    linkedin: 'https://www.linkedin.com/in/wilson-chen/'
  },
  {
    name: '張方剛',
    nameEn: 'Mike Chang',
    title: '行銷總監',
    titleEn: 'Marketing Director', 
    expertise: ['診所社群經營', '醫療SEO優化', '影音內容策略'],
    description: '數位行銷專家，專注於牙醫診所品牌經營與SEO優化。曾帶領團隊獲得多項數位行銷獎項，協助診所每月諮詢量成長300%以上。',
    image: '/images/team/member-2.jpg',
    linkedin: 'https://www.linkedin.com/in/mike-chang/'
  },
  {
    name: '李品憲',
    nameEn: 'Leo Lee',
    title: '技術長',
    titleEn: 'CTO',
    expertise: ['AI行銷系統', '數據分析', '自動化工具'],
    description: '資深技術專家，擅長運用AI技術優化醫療行銷流程。開發多項專利技術，協助診所建立數據導向的精準行銷系統。',
    image: '/images/team/member-3.jpg',
    linkedin: 'https://www.linkedin.com/in/leo-lee/'
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

// 團隊成員卡片組件
interface TeamMemberCardProps {
  member: typeof teamMembers[0]
  delay: number
}

const TeamMemberCard = ({ member, delay }: TeamMemberCardProps) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  return (
    <AnimatedSection delay={delay}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Spinner />
            </div>
          )}
          {!imageError ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className={`object-cover transform group-hover:scale-105 transition-transform duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-4xl">👤</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {member.nameEn}
                </p>
              </div>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                  aria-label={`${member.name}的LinkedIn個人檔案`}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
            </div>
            <p className="text-primary/80 font-medium">
              {member.title}
            </p>
            <p className="text-sm text-gray-500">
              {member.titleEn}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {member.expertise.map((skill) => (
              <span
                key={skill}
                className="px-2 sm:px-3 py-1 bg-primary/5 text-primary rounded-full text-xs sm:text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
            {member.description}
          </p>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
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
        <motion.div 
          className="absolute left-0 top-1/4 w-32 h-64 bg-primary/5"
          initial={{ x: "-100%" }}
          whileInView={{ x: "-50%" }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />
        
        {/* 右側裝飾元素 */}
        <motion.div 
          className="absolute right-0 bottom-1/4 w-32 h-64 bg-primary/5"
          initial={{ x: "100%" }}
          whileInView={{ x: "50%" }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />
        
        <div className="container-custom relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-primary font-display">
              成功案例展示
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              實際案例展示我們如何幫助診所提升品牌價值、增加營業額
            </p>
          </AnimatedSection>
          
          {/* 案例輪播控制器 */}
          <div className="flex justify-center mb-8 sm:mb-12 overflow-x-auto px-4">
            <div className="inline-flex bg-white rounded-full shadow-md p-1.5">
              {caseStudies.map((caseStudy, index) => (
                <motion.button
                  key={caseStudy.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary text-white scale-105' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {caseStudy.category}
                </motion.button>
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
                        {/* 左側：視覺展示 */}
                        <div className="lg:col-span-5 relative overflow-hidden rounded-sm shadow-lg h-full group">
                          {/* 背景漸層 */}
                          <motion.div 
                            className={`absolute inset-0 bg-gradient-to-br ${caseStudy.color} opacity-90`}
                            initial={{ opacity: 0.7 }}
                            whileHover={{ opacity: 0.9 }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          {/* 裝飾元素 */}
                          <motion.div 
                            className="absolute top-4 left-4 w-12 h-12 border border-white/20 rounded-sm"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          />
                          <motion.div 
                            className="absolute bottom-16 right-4 w-20 h-6 bg-white/10 rounded-sm"
                            animate={{ x: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                          />
                          <motion.div 
                            className="absolute top-1/4 right-8 w-6 h-24 bg-white/5"
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                          />
                          
                          {/* 案例圖片 */}
                          <div className="relative z-10 h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5 }}
                              className="relative w-full h-[180px] sm:h-[220px] md:h-[260px]"
                            >
                              {/* 加載動畫 */}
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
                                    className="object-contain object-center z-10 shadow-lg transition-transform duration-300 group-hover:scale-105"
                                    priority={index === 0} 
                                    quality={90}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    onLoad={() => handleImageLoad(caseStudy.id)}
                                    onError={() => handleImageError(caseStudy.id)}
                                  />
                                </picture>
                              </div>
                              
                              {/* 錯誤狀態 */}
                              {imageErrorStates[caseStudy.id] && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/10 backdrop-blur-sm rounded-md z-20">
                                  <svg 
                                    className="w-12 h-12 mb-2" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
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
                          <motion.div 
                            className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-3 sm:p-4 md:p-5 text-white border-t border-white/10"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs uppercase tracking-wider opacity-75 mb-1">成效重點</div>
                                <div className="text-sm sm:text-base md:text-xl font-bold">{caseStudy.highlightLabel}</div>
                              </div>
                              <div className="text-xl sm:text-2xl md:text-4xl font-black font-gothic">
                                <CountUp 
                                  end={parseInt(caseStudy.highlight)} 
                                  suffix="%" 
                                  duration={2} 
                                />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                        
                        {/* 右側：案例詳情 */}
                        <div className="lg:col-span-7 bg-white p-8 shadow-sm rounded-sm flex flex-col">
                          {/* 案例編號和分類 */}
                          <div className="flex justify-between items-center mb-4">
                            <motion.div 
                              className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full"
                              whileHover={{ scale: 1.05 }}
                            >
                              {caseStudy.category}
                            </motion.div>
                            <div className="text-4xl font-black text-gray-200">0{index + 1}</div>
                          </div>
                          
                          {/* 標題與描述 */}
                          <div>
                            <motion.h3 
                              className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-gothic"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {caseStudy.title}
                            </motion.h3>
                            <motion.p 
                              className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              {caseStudy.description}
                            </motion.p>
                          </div>
                          
                          {/* 成效指標 */}
                          <div className="mt-auto">
                            <div className="text-sm font-medium text-primary mb-3 sm:mb-4">實際成效</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                              {caseStudy.results.map((result, idx) => (
                                <motion.div 
                                  key={idx} 
                                  className="bg-gray-50 p-2 sm:p-3 rounded border-l-2 border-primary text-sm sm:text-base"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 + idx * 0.1 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <div className="text-gray-800">{result}</div>
                                </motion.div>
                              ))}
                            </div>
                            
                            {/* 按鈕和導航 */}
                            <div className="mt-6 flex justify-between items-center">
                              <motion.div
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <Link
                                  href={`/case/${caseStudy.id}`}
                                  className="inline-flex items-center text-primary font-bold hover:underline"
                                >
                                  查看完整案例
                                  <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </Link>
                              </motion.div>
                              
                              {/* 分頁導航 */}
                              <div className="flex space-x-2">
                                <motion.button
                                  onClick={() => setCurrentSlide(prev => (prev - 1 + caseStudies.length) % caseStudies.length)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  aria-label="上一個案例"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </motion.button>
                                <motion.button
                                  onClick={() => setCurrentSlide(prev => (prev + 1) % caseStudies.length)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  aria-label="下一個案例"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </motion.button>
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/case" 
                className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-sm shadow-md hover:bg-primary/90 transition-colors"
              >
                查看更多成功案例
                <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
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

        {/* 裝飾元素 */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />
        
        <motion.div
          className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />

        <div className="container-custom relative z-10">
          <AnimatedSection className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-primary font-display">
              全方位診所行銷服務
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              從品牌定位到數位行銷，我們提供完整的解決方案，
              讓您專注於提供優質的醫療服務
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.2}>
                <motion.div 
                  className="group relative bg-white p-6 sm:p-8 rounded-sm shadow-sm hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  {/* 背景裝飾 */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative">
                    {/* 圖標 */}
                    <motion.div 
                      className="mb-4 sm:mb-6 text-primary"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <feature.icon className="w-12 h-12 sm:w-16 sm:h-16" />
                    </motion.div>

                    {/* 標題 */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-primary font-gothic">
                      {feature.title}
                    </h3>

                    {/* 描述 */}
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* 互動指示器 */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 mt-4">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          {/* 服務連結 */}
          <div className="text-center mt-12">
            <Link
              href="/service"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors"
            >
              <span>探索更多服務內容</span>
              <motion.svg
                className="w-4 h-4"
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </motion.svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 服務流程區塊 */}
      <section className="py-32 bg-gray-50">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-primary font-display">
              專業服務流程
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              系統化的服務流程，確保每個環節都能達到最佳效果
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceProcess.map((process, index) => (
              <AnimatedSection key={process.step} delay={index * 0.1}>
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  {/* 背景數字 */}
                  <div className="absolute -right-4 -top-4 text-8xl font-black text-gray-50 transition-transform duration-300 group-hover:scale-110">
                    {process.step}
                  </div>
                  
                  {/* 內容 */}
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                      {process.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{process.title}</h3>
                    <p className="text-gray-600">{process.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 團隊介紹區塊 */}
      <section className="py-32 bg-white">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-primary font-display">
              專業團隊陣容
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              擁有豐富醫療行銷經驗的跨領域專家團隊，為您的診所打造最適合的品牌成長策略
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} delay={index * 0.1} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/team"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors"
            >
              認識更多團隊成員
              <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 諮詢預約區塊 */}
      <section className="py-32 bg-primary text-white relative overflow-hidden">
        {/* 背景裝飾 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
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

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-4xl sm:text-5xl font-black mb-6 font-display">
                開始您的品牌成長之旅
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                立即預約免費諮詢，讓我們為您打造專屬的醫療行銷策略
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="btn-white text-primary text-lg px-8 py-4 rounded-sm hover:bg-white/90 transition-colors"
                >
                  預約諮詢
                </Link>
                <Link
                  href="/service"
                  className="btn-outline-white text-lg px-8 py-4 rounded-sm hover:bg-white/10 transition-colors"
                >
                  了解更多
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
} 