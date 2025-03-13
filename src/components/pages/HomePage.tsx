'use client'

import { useEffect, useState, useCallback, useMemo, memo } from 'react'
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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0" className={className} aria-label="AI 圖標">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v-1a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7H2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
    <path d="M10 17a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
    <path d="M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    <path d="M16 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);

const TeamIcon = ({ className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0" className={className} aria-label="團隊圖標">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const DataIcon = ({ className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0" className={className}>
    <path d="M21 4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4zM21 16a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4z" />
    <circle cx="6" cy="6" r="1" />
    <circle cx="6" cy="18" r="1" />
  </svg>
);

const ServiceIcon = ({ className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0" className={className}>
    <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7"></path>
    <path d="M15 7h6v6"></path>
  </svg>
);

const BrandIcon = ({ className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0" className={className}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const MarketingIcon = ({ className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0" className={className}>
    <path d="M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
  </svg>
);

const PatientIcon = ({ className = "" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0" className={className}>
    <path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
  </svg>
);

// 更新動畫配置，使用統一的動畫系統
const animations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
};

// 服務特色數據
const features = [
  {
    title: '專注牙醫行銷',
    description: '深耕牙醫診所領域超過10年，了解診所經營痛點，提供最適合的行銷策略與解決方案',
    icon: AIIcon
  },
  {
    title: '完整數據分析',
    description: '運用進階分析工具，追蹤診所關鍵績效指標，從預約率到回診率，協助診所做出精準決策',
    icon: DataIcon
  },
  {
    title: '品牌口碑經營',
    description: '建立診所專業形象與特色，透過社群媒體與在地行銷，打造深植人心的牙醫品牌',
    icon: TeamIcon
  },
  {
    title: '全方位整合',
    description: '從線上到線下，整合數位行銷、空間設計、人員訓練等服務，提供診所一站式成長方案',
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

// 更新案例數據
const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    title: '雅德思牙醫診所',
    description: '透過品牌重塑與數位轉型，打造專業美學牙醫品牌形象，整合線上預約與社群經營，大幅提升診所效益',
    image: '/Case_1.jpg',
    imageWebp: '/Case_1.webp',
    imagePlaceholder: '/Case_1_placeholder.jpg',
    imageSizes: {
      sm: '/Case_1_sm.jpg',
      md: '/Case_1_md.jpg',
      lg: '/Case_1.jpg',
    },
    category: '品牌升級',
    highlight: '200%',
    highlightLabel: '諮詢轉化率',
    results: [
      '隱形矯正諮詢量增加156%',
      '每月新客數提升85%',
      '品牌知名度提升120%',
      '線上預約率達65%'
    ],
    color: 'from-white-600 to-primary'
  },
  {
    id: 'case-2',
    title: '皓皓牙醫診所',
    description: '導入完整的數位化系統與行銷策略，優化病患服務流程，建立口碑行銷體系，實現持續性成長',
    image: '/Case_2.jpg',
    imageWebp: '/Case_2.webp',
    imagePlaceholder: '/Case_2_placeholder.jpg',
    imageSizes: {
      sm: '/Case_2_sm.jpg',
      md: '/Case_2_md.jpg',
      lg: '/Case_2.jpg',
    },
    category: '數位轉型',
    highlight: '95%',
    highlightLabel: '病患滿意度',
    results: [
      '植牙諮詢量成長180%',
      '回診率提升45%',
      '營運效率提升75%',
      'Google評分達4.9顆星'
    ],
    color: 'from-white-600 to-primary'
  },
  {
    id: 'case-3',
    title: '雲天牙醫診所',
    description: '針對年輕族群打造現代化牙醫品牌，透過社群媒體與影音行銷，成功建立差異化市場定位',
    image: '/Case_3.png',
    imageWebp: '/Case_3.webp',
    imagePlaceholder: '/Case_3_placeholder.png',
    imageSizes: {
      sm: '/Case_3_sm.png',
      md: '/Case_3_md.png',
      lg: '/Case_3.png',
    },
    category: '社群經營',
    highlight: '300%',
    highlightLabel: '社群互動率',
    results: [
      '美白療程預約增加215%',
      '25-35歲客群成長125%',
      '社群追蹤者突破2萬',
      '品牌影片觀看破百萬'
    ],
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

const AnimatedSection = memo(function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0 
}: AnimatedSectionProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (inView) {
      controls.start('animate');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={{
        initial: { opacity: 0, y: 10 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

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

// 優化圖片加載組件
const ImageWithFallback = memo(function ImageWithFallback({ 
  src, 
  alt, 
  className = "",
  priority = false,
  sizes = "100vw",
  quality = 75,
  onLoad,
  onError
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}) {
  return (
    <div className="relative w-full h-full bg-gray-100">
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-300 ${className}`}
        priority={priority}
        quality={quality}
        sizes={sizes}
        onLoad={onLoad}
        onError={onError}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
});

// 新增區塊類型定義
interface ProcessStep {
  step: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

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

// 新增背景圖片組件
interface BackgroundImageProps {
  variant: 'white' | 'primary';
  className?: string;
}

const BackgroundImage = memo(function BackgroundImage({ variant, className = '' }: BackgroundImageProps) {
  const baseUrl = variant === 'primary' ? '/images/bgline-w' : '/images/bgline-r';
  
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <picture>
        <source
          media="(min-width: 1024px)"
          srcSet={`${baseUrl}.webp`}
          type="image/webp"
        />
        <source
          media="(min-width: 768px)"
          srcSet={`${baseUrl}_md.webp`}
          type="image/webp"
        />
        <source
          srcSet={`${baseUrl}_sm.webp`}
          type="image/webp"
        />
        <Image
          src={`${baseUrl}_sm.png`}
          alt=""
          fill
          className="object-cover opacity-100"
          priority={variant === 'primary'}
          sizes="100vw"
        />
      </picture>
    </div>
  );
});

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

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
  
  return (
    <section 
      ref={heroRef}
      className="relative min-h-[85vh] flex items-center bg-primary overflow-hidden"
      role="banner"
      aria-label="網站主要橫幅"
    >
      {/* 簡化的背景，使用漸變而非圖片 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark z-0"/>
      
      <div className="container-custom relative z-20">
        <div className="max-w-4xl">
          {/* 使用普通 h1 而非 motion.h1，避免首屏水合延遲 */}
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight"
            data-animate="false"
            data-priority="high" // 使用 data 屬性標記高優先級
          >
            專業醫療行銷團隊<br/>
            為診所帶來<span className="underline decoration-4 decoration-white/30">突破性成長</span>
          </h1>
          
          {/* 直接渲染 LCP 內容，不使用動畫，確保快速顯示 */}
          <p 
            className="text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed mt-6"
            data-animate="false"
          >
            深耕牙醫行銷領域十年，以數據分析為基礎，為您打造完整的診所成長方案。從品牌定位、數位行銷到客戶經營，提供一站式解決方案。
          </p>
          
          {/* 次要內容使用動畫效果，在 LCP 後加載 */}
          <motion.div 
            className="mt-10 space-x-4 flex flex-wrap gap-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }} // 延遲次要內容的動畫
          >
            <a 
              href="#contact" 
              className="btn-primary py-3 px-8 rounded-md text-white hover:bg-primary-dark transition-colors"
            >
              諮詢服務
            </a>
            <button 
              onClick={handleScroll}
              className="btn-secondary bg-white/10 backdrop-blur-sm py-3 px-8 rounded-md text-white hover:bg-white/20 transition-colors"
            >
              了解更多
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// 更新服務特色區塊
function FeatureSection() {
  return (
    <section id="features" className="relative py-24 bg-white overflow-hidden" role="region" aria-label="服務特色">
      {/* 使用簡化的背景裝飾 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
      
      {/* 移除裝飾元素 */}
      
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10 rounded-full">我們的優勢</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            為什麼選擇<span className="text-primary">專業團隊</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            深耕牙醫診所領域超過十年，以專業經驗與創新技術，協助診所突破成長瓶頸
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
              className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
            >
              <div className="mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                  <feature.icon 
                    className="w-8 h-8 text-white" 
                    aria-hidden="true"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
              
              {/* 新增微互動元素 */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="w-8 h-0.5 bg-primary scale-0 group-hover:scale-100 transition-transform duration-500 origin-left"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// 更新服務內容區塊
const services = [
  {
    title: '診所品牌規劃',
    description: '打造專業且溫暖的牙醫品牌形象，建立市場差異化優勢',
    features: [
      '診所品牌定位與特色規劃',
      '診所空間與視覺設計',
      '醫療團隊形象包裝',
      '在地口碑行銷策略'
    ],
    icon: BrandIcon
  },
  {
    title: '數位行銷優化',
    description: '全方位數位行銷策略，提升診所能見度與預約轉化率',
    features: [
      'Google SEO 排名優化',
      '社群媒體經營與互動',
      '精準廣告投放策略',
      '診所官網設計與優化'
    ],
    icon: MarketingIcon
  },
  {
    title: '病患服務提升',
    description: '優化病患體驗，提高回診率與推薦率',
    features: [
      '病患關係管理系統',
      '自動預約提醒服務',
      '回診追蹤與關懷',
      '病患滿意度調查'
    ],
    icon: PatientIcon
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
            全方位<span className="text-primary">診所成長</span>方案
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            提供完整的牙醫診所行銷解決方案，協助您的診所突破現有業績
          </p>
        </AnimatedSection>
          
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={animations.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={service.title} 
              variants={animations.slideUp}
              className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
            >
              <div className="mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-8">
                {service.description}
              </p>
              
              <ul className="space-y-4 flex-grow mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 border-t border-gray-100">
                <Link
                  href={`/service#${service.title}`}
                  className="inline-flex items-center text-primary font-medium group"
                >
                  了解更多
                  <motion.svg 
                    className="w-4 h-4 ml-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
            { value: 300, suffix: "+", label: "合作牙醫診所" },
            { value: 98, suffix: "%", label: "客戶續約率" },
            { value: 180, suffix: "%", label: "平均預約成長" },
            { value: 85, suffix: "%", label: "行銷投資回報率" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={animations.slideUp}
              className="text-center"
            >
              <div className="bg-white/10 p-6 rounded-lg hover:bg-white/15 transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-dark/20 transition-all duration-500">
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
function CaseCarousel({
  imageLoadingStates,
  imageErrorStates,
  handleImageLoad,
  handleImageError,
  getResponsiveImageSrc
}: {
  imageLoadingStates: Record<string, boolean>;
  imageErrorStates: Record<string, boolean>;
  handleImageLoad: (id: string) => void;
  handleImageError: (id: string) => void;
  getResponsiveImageSrc: (caseStudy: CaseStudy) => string;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setCurrentSlide(prev => (prev + 1) % caseStudies.length);
    }

    if (touchStart - touchEnd < -75) {
      setCurrentSlide(prev => (prev - 1 + caseStudies.length) % caseStudies.length);
    }
  };

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* 簡化的背景 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 via-white to-white"></div>
      
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10 rounded-full">成功案例</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            診所<span className="text-primary">成功案例</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            透過專業的品牌策略與數位行銷，協助牙醫診所突破經營瓶頸，實現持續成長
          </p>
        </motion.div>

        <div className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 導航按鈕 */}
          <div className="absolute top-1/2 -left-4 sm:-left-12 -translate-y-1/2 z-20">
            <button
              onClick={() => setCurrentSlide(prev => (prev - 1 + caseStudies.length) % caseStudies.length)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="上一個案例"
            >
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <div className="absolute top-1/2 -right-4 sm:-right-12 -translate-y-1/2 z-20">
            <button
              onClick={() => setCurrentSlide(prev => (prev + 1) % caseStudies.length)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="下一個案例"
            >
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {caseStudies.map((caseStudy, index) => (
              index === currentSlide && (
                <motion.div
                  key={caseStudy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-50 rounded-2xl overflow-hidden shadow-md"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    {/* 左側：案例圖片 */}
                    <div className="relative aspect-[4/3] bg-white rounded-lg overflow-hidden shadow-sm">
                      {imageLoadingStates[caseStudy.id] && !imageErrorStates[caseStudy.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      
                      <Image
                        src={getResponsiveImageSrc(caseStudy)}
                        alt={caseStudy.title}
                        fill
                        className={`object-cover transition-transform duration-700 hover:scale-105 ${
                          imageLoadingStates[caseStudy.id] ? 'opacity-0' : 'opacity-100'
                        }`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onLoad={() => handleImageLoad(caseStudy.id)}
                        onError={() => handleImageError(caseStudy.id)}
                        priority={index === 0}
                      />
                    </div>
                    
                    {/* 右側：案例內容 */}
                    <div className="flex flex-col justify-center">
                      <div className="mb-8">
                        <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium mb-4">
                          {caseStudy.category}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                          {caseStudy.title}
                        </h3>
                        <p className="text-gray-600 text-lg">
                          {caseStudy.description}
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-gray-600 font-medium">關鍵成效</span>
                          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                            <span className="text-3xl font-bold text-primary">{caseStudy.highlight}</span>
                            <span className="text-sm text-gray-500 ml-2">{caseStudy.highlightLabel}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {caseStudy.results.map((result, idx) => (
                            <div key={idx} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                              <span className="text-gray-700">{result}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Link
                          href={`/case/${caseStudy.id}`}
                          className="inline-flex items-center text-primary font-medium group"
                        >
                          查看完整案例
                          <motion.svg 
                            className="w-5 h-5 ml-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            initial={{ x: 0 }}
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </motion.svg>
                        </Link>
                        
                        <div className="flex gap-2">
                          {caseStudies.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlide(idx)}
                              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                idx === currentSlide 
                                  ? 'bg-primary scale-125' 
                                  : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                              aria-label={`切換到第${idx+1}個案例`}
                            />
                          ))}
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
  }, [currentPage, currentItems, testimonials]);

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* 移除背景裝飾和引號裝飾 */}
      
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10 rounded-full">客戶評價</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            合作夥伴<span className="text-primary">真實心聲</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            聽聽專業牙醫如何評價我們的服務
          </p>
        </motion.div>

        <div className="relative">
          {/* 在小螢幕顯示導航控制 */}
          {isClient && isMobile && testimonials.length > itemsPerPage.mobile && (
            <div className="flex justify-center items-center gap-2 mb-8 md:hidden">
              <button 
                onClick={handlePrevPage}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all duration-300"
                aria-label="上一頁推薦"
              >
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === currentPage ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`切換到第${i+1}頁推薦`}
                  />
                ))}
              </div>
              <button 
                onClick={handleNextPage}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all duration-300"
                aria-label="下一頁推薦"
              >
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* 證言卡片網格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {/* 大螢幕顯示左側導航控制 */}
            {isClient && !isMobile && testimonials.length > itemsPerPage.tablet && (
              <button 
                onClick={handlePrevPage}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 justify-center items-center z-20 lg:translate-x-0 lg:-left-16 transition-all duration-300 hover:scale-110"
                aria-label="上一頁推薦"
              >
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {/* 顯示評價卡片，使用 AnimatePresence 做轉場 */}
            <AnimatePresence>
              {displayTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 h-full flex flex-col border border-gray-100 hover:-translate-y-1">
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden relative mr-4 border-2 border-primary/10">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.title}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 italic relative">
                        <span className="text-primary text-4xl absolute -top-4 -left-2 opacity-20">&ldquo;</span>
                        {testimonial.content}
                        <span className="text-primary text-4xl absolute -bottom-8 -right-2 opacity-20">&rdquo;</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* 大螢幕顯示右側導航控制 */}
            {isClient && !isMobile && testimonials.length > itemsPerPage.tablet && (
              <button 
                onClick={handleNextPage}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 justify-center items-center z-20 lg:translate-x-0 lg:-right-16 transition-all duration-300 hover:scale-110"
                aria-label="下一頁推薦"
              >
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          
          {/* 下方導航指示器 - 在平板及以上顯示 */}
          {isClient && !isMobile && testimonials.length > itemsPerPage.tablet && (
            <div className="hidden md:flex justify-center items-center mt-10 gap-3">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === currentPage 
                      ? 'bg-primary scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`切換到第${i+1}頁推薦`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* 聯絡我們的CTA區塊 */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">想了解更多合作案例？</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              我們有更多成功案例分享，歡迎聯繫我們獲取專屬於您診所的行銷策略建議
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              預約免費諮詢
              <motion.svg 
                className="w-5 h-5 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                animate={{ x: [0, 3, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
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
            {categories.map((category, index) => (
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
            {filteredFaqs.map((faq, index) => (
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

// 新增聯絡我們區塊
function ContactSection() {
  return (
    <section className="relative py-24 bg-primary overflow-hidden">
      {/* 簡化的背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark z-0"></div>
      
      {/* 移除裝飾元素 */}
      
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            準備好開始提升您的<span className="relative inline-block mx-2">
              診所營運
              <motion.span 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded-full"
              ></motion.span>
            </span>了嗎？
          </h2>
          <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
            立即預約免費諮詢，讓我們為您打造專屬的成長方案
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <span>立即預約</span>
              <motion.svg 
                className="w-5 h-5 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                animate={{ x: [0, 3, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </Link>
            <Link
              href="/case"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
            >
              瀏覽成功案例
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 優化首頁組件
export default function HomePage() {
  const imageStates = useMemo(() => ({
    loading: caseStudies.reduce((acc, study) => ({ ...acc, [study.id]: true }), {}),
    error: caseStudies.reduce((acc, study) => ({ ...acc, [study.id]: false }), {})
  }), []);

  const [imageLoadingStates, setImageLoadingStates] = useState(imageStates.loading);
  const [imageErrorStates, setImageErrorStates] = useState(imageStates.error);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // 使用 useEffect 處理窗口寬度
  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageLoad = useCallback((id: string) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: false }));
  }, []);

  const handleImageError = useCallback((id: string) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: false }));
    setImageErrorStates(prev => ({ ...prev, [id]: true }));
  }, []);

  const getResponsiveImageSrc = useCallback((caseStudy: CaseStudy) => {
    if (!isClient) return caseStudy.image;
    
    if (windowWidth < 640 && caseStudy.imageSizes?.sm) return caseStudy.imageSizes.sm;
    if (windowWidth < 1024 && caseStudy.imageSizes?.md) return caseStudy.imageSizes.md;
    return caseStudy.image;
  }, [isClient, windowWidth]);

  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
  }

  const handleDotClick = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="min-h-screen bg-white">
      <section id="hero" className="min-h-[85vh]">
        <HeroSection />
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
        <CaseCarousel
          imageLoadingStates={imageLoadingStates}
          imageErrorStates={imageErrorStates}
          handleImageLoad={handleImageLoad}
          handleImageError={handleImageError}
          getResponsiveImageSrc={getResponsiveImageSrc}
        />
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
    </div>
  );
} 