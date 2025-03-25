'use client'

import { useState, useEffect, memo, useMemo, Suspense, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Metadata } from 'next'
import { animations, fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/utils/animations'
import { CaseCard } from '@/components/case/CaseCard'
import { PageHeader } from '@/components/common'

// 定義案例資料類型
export interface CaseMetric {
  value: string;
  label: string;
}

export interface Solution {
  title: string;
  description: string;
}

export interface CaseStudy {
  id: string;
  name: string;
  category: string;
  description: string;
  metrics: { value: string; label: string }[];
  solutions: Solution[] | string[];
  color?: string;
  image: string;
  featured?: boolean;
  publishedDate?: string;
  updatedDate?: string;
  testimonial?: {
    content: string;
    author: string;
    title: string;
  };
}

// Schema.org 結構化資料類型定義
export interface ArticleStructuredData {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  about: {
    '@type': string;
    name: string;
    description: string;
  };
  articleSection: string;
  keywords: string[];
}

// 案例資料模型
export const caseStudies: CaseStudy[] = [
  {
    id: 'north-district-dental',
    name: '北區牙醫診所A',
    category: '品牌重塑',
    description: '從傳統診所到數位化品牌的成功轉型，透過整合性行銷策略，在短短 6 個月內實現顯著成長：',
    metrics: [
      { value: '200%', label: '新患預約成長' },
      { value: '5萬+', label: '社群追蹤者' },
      { value: '300%', label: '品牌知名度提升' },
      { value: '50%', label: '每月穩定回診率成長' }
    ],
    solutions: [
      {
        title: '品牌識別系統重塑',
        description: '建立清晰的品牌定位和一致的視覺識別系統，從診所空間設計到線上形象，創造專業且現代化的品牌體驗。'
      },
      {
        title: '數位行銷策略規劃',
        description: '制定完整的數位行銷策略，包含社群媒體、內容行銷、SEO 優化等多元管道，提升線上能見度與病患互動。'
      },
      {
        title: '社群媒體經營優化',
        description: '針對目標客群偏好，優化社群媒體策略，持續創建高品質的專業口腔衛教內容，增強診所專業形象與患者信任感。'
      },
      {
        title: '顧客體驗流程改造',
        description: '導入數位化管理系統，提升診所運營效率，優化從預約到回診的全流程體驗，建立長期忠誠度與口碑推薦系統。'
      }
    ],
    color: '#4A6CF7',
    image: '/images/case-placeholder.jpg',
    featured: true,
    publishedDate: '2023-08-15T00:00:00Z',
    updatedDate: '2023-11-20T00:00:00Z',
    testimonial: {
      content: '透過專業的品牌重塑服務，不僅提升了診所形象，更帶來實質的營收成長。團隊的執行力和專業度令人印象深刻。',
      author: '王醫師',
      title: '診所院長'
    }
  },
  {
    id: 'east-district-dental',
    name: '東區牙醫診所B',
    category: '空間規劃',
    description: '建立全新的診所空間設計，結合專業醫療環境與舒適療癒氛圍，提升診所差異化競爭力與病患體驗。',
    metrics: [
      { value: '35%', label: '初診患者滿意度提升' },
      { value: '60%', label: '轉診推薦率增長' },
      { value: '23%', label: '平均診次營收成長' },
      { value: '40%', label: '回診率提升' }
    ],
    solutions: [
      {
        title: '空間規劃重塑',
        description: '依照診所特性與目標客群，重新規劃診療空間、候診區與服務櫃檯，建立療癒系專業風格，減輕患者就醫焦慮。'
      },
      {
        title: '視覺形象優化',
        description: '配合空間設計，整合品牌色彩、素材與視覺傳達系統，建立一致性的品牌體驗，增強品牌識別度。'
      },
      {
        title: '服務流程最佳化',
        description: '根據新空間配置，優化就診流程與動線，提升醫師診療效率與患者體驗，縮短等候時間。'
      },
      {
        title: '員工訓練計劃',
        description: '為診所團隊提供專業服務訓練，確保軟硬體品質一致，打造從進門到離開的完美診所體驗。'
      }
    ],
    color: '#8D72E1',
    image: '/images/case-placeholder.jpg',
    featured: true,
    publishedDate: '2023-06-10T00:00:00Z',
    updatedDate: '2023-09-15T00:00:00Z',
    testimonial: {
      content: '全新的診所空間不只讓患者感到舒適，也讓我們的工作效率提高。專業團隊從設計到執行都給予最佳支援。',
      author: '林醫師',
      title: '東區診所負責人'
    }
  },
  {
    id: 'central-district-dental',
    name: '中區牙醫診所C',
    category: '社群經營',
    description: '針對都會區年輕族群特性，打造科技感與人性化並存的診所形象，運用社群媒體分享專業口腔保健知識，建立專業且親切的品牌定位',
    metrics: [
      { value: '200%', label: '年輕客群成長' },
      { value: '35%', label: '社群互動率' },
      { value: '10K+', label: '知識文章分享數' },
      { value: '45%', label: '有機流量增長' }
    ],
    solutions: [
      {
        title: '社群內容策略',
        description: '根據目標客群興趣與需求，規劃系列實用衛教內容，透過生動插圖與淺顯解說，提升互動與分享，建立診所專業形象。'
      },
      {
        title: '品牌聲音建立',
        description: '建立統一的品牌語調與溝通風格，在各平台保持一致的專業親切形象，增強品牌識別與記憶點。'
      },
      {
        title: '多平台經營優化',
        description: '全面分析 Instagram、Facebook、LINE 等平台效益，針對不同族群調整內容策略，提升觸及與轉換率。'
      },
      {
        title: '員工參與計畫',
        description: '培訓診所人員共同參與社群經營，分享真實診所日常與專業知識，增加品牌真實性與親近感。'
      }
    ],
    color: '#FF6C6C',
    image: '/images/case-placeholder.jpg',
    featured: false,
    publishedDate: '2023-05-20T00:00:00Z',
    updatedDate: '2023-08-10T00:00:00Z',
    testimonial: {
      content: '社群經營策略徹底改變了我們與患者的互動方式，年輕族群大幅增加，也提升了診所整體形象。',
      author: '張醫師',
      title: '中區診所創辦人'
    }
  },
  {
    id: 'south-district-dental',
    name: '南區牙醫診所D',
    category: '數位轉型',
    description: '30年老字號診所導入數位化管理系統，優化看診流程，同時保留溫暖的個人化服務，實現傳統價值與現代效率的完美結合',
    metrics: [
      { value: '60%', label: '行政工作時間減少' },
      { value: '95%', label: '老患者回診率' },
      { value: '75%', label: '新患者成長率' },
      { value: '30%', label: '營運成本降低' }
    ],
    solutions: [
      {
        title: '數位管理系統導入',
        description: '客製化整合預約、病歷、收費、庫存等管理系統，提升診所營運效率，減少人為錯誤。'
      },
      {
        title: '員工數位培訓',
        description: '為診所團隊提供全面數位工具培訓，確保系統順利導入，並維持優質服務品質。'
      },
      {
        title: '患者溝通系統建立',
        description: '導入智慧化提醒與回饋系統，增強醫患溝通，提升診療過程透明度與患者滿意度。'
      },
      {
        title: '傳統價值數位化',
        description: '將診所長期累積的專業經驗與價值觀融入數位系統，確保轉型過程中不失原有的人情味與專業態度。'
      }
    ],
    color: '#3498DB',
    image: '/images/cases/south-district-dental.jpg',
    featured: true,
    publishedDate: '2023-07-05T00:00:00Z',
    updatedDate: '2023-10-18T00:00:00Z',
    testimonial: {
      content: '數位轉型讓我們從繁瑣的行政工作中解放，能更專注於病患照護。新系統不僅提升效率，老病患也感受到服務品質的提升。',
      author: '陳醫師',
      title: '南區診所第二代負責人'
    }
  },
  {
    id: 'smile-dental',
    name: 'Smile牙醫診所',
    category: '數位行銷',
    description: '專注於美容牙科的專業診所，透過精準的數位行銷策略，提升品牌知名度與高價值客戶轉換率',
    metrics: [
      { value: '150%', label: '美容牙科療程成長' },
      { value: '45%', label: '廣告投資報酬率提升' },
      { value: '70%', label: '目標族群轉換率' },
      { value: '65%', label: '品牌搜尋量增長' }
    ],
    solutions: [
      '精準目標族群分析與定位',
      '多管道整合數位行銷策略',
      '專業內容創作與衛教資訊分享',
      '數據導向的行銷效益優化'
    ],
    color: '#2ECC71',
    image: '/images/cases/smile-dental.jpg',
    featured: false,
    publishedDate: '2023-09-12T00:00:00Z',
    updatedDate: '2023-12-05T00:00:00Z',
    testimonial: {
      content: '數位行銷策略精準觸及我們的目標客群，大幅提升了高價值療程的詢問度與轉換率，投資報酬率遠超預期。',
      author: '黃醫師',
      title: 'Smile牙醫診所創辦人'
    }
  }
]

// 優化後的Loading State
export const LoadingState = memo((): React.ReactElement => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
        ))}
      </div>
    </div>
  )
})
LoadingState.displayName = 'LoadingState';

export interface EmptyStateProps {
  category?: string;
  message?: string;
}

function EmptyState({ category, message }: EmptyStateProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-8 text-center max-w-2xl mx-auto my-12">
      <svg
        className="mx-auto h-16 w-16 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">沒有找到{category ? `「${category}」`: ''}相關案例</h3>
      <p className="mt-2 text-sm text-gray-500">
        {message || '請嘗試選擇其他類別或聯繫我們了解更多資訊。'}
      </p>
      <div className="mt-6">
        <Link href="/contact" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          <span>聯繫我們</span>
        </Link>
      </div>
    </div>
  )
}

export interface CaseFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
}

// 使用React.memo優化不必要的重新渲染
export const CaseFilter = memo(({ activeCategory, setActiveCategory, categories }: CaseFilterProps): React.ReactElement => {
  return (
    <div className="mb-8 md:mb-12 overflow-x-auto pb-2 -mx-4 px-4">
      <div className="flex gap-2 md:gap-3 md:flex-wrap md:justify-center min-w-max">
        <button
          onClick={() => setActiveCategory('全部案例')}
          className={`whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 rounded-md text-sm font-medium transition-colors ${
            activeCategory === '全部案例'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          全部案例
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 rounded-md text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
})
CaseFilter.displayName = 'CaseFilter';

export interface AnimatedNumberProps {
  value: string;
  className?: string;
}

// 使用React.memo優化數字動畫組件
export const AnimatedNumber = memo(({ value, className }: AnimatedNumberProps): React.ReactElement => {
  const numericPart = value.replace(/[^0-9]/g, '');
  const suffix = value.replace(/[0-9]/g, '');
  
  return (
    <span className={className}>
      {numericPart}
      {suffix}
    </span>
  )
})
AnimatedNumber.displayName = 'AnimatedNumber';

export interface FeaturedCaseProps {
  caseStudy: CaseStudy;
}

// 使用React.memo優化特色案例組件
export const FeaturedCase = memo(({ caseStudy }: FeaturedCaseProps): React.ReactElement => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="mb-20"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl md:text-3xl font-bold"
          >
            特色案例
          </motion.h2>
          <motion.div variants={fadeInUp}>
            <Link 
              href={`/case/${caseStudy.id}`}
              className="text-primary font-medium hover:underline transition-all flex items-center"
            >
              查看所有案例
              <svg 
                className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </Link>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div 
            variants={fadeInLeft}
            className="order-2 md:order-1"
          >
            <div className="flex items-center mb-4">
              <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                {caseStudy.category}
              </span>
              {caseStudy.featured && (
                <span className="ml-3 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                  精選案例
                </span>
              )}
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              {caseStudy.name}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {caseStudy.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {caseStudy.metrics.slice(0, 4).map((metric, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    <AnimatedNumber value={metric.value} />
                  </div>
                  <div className="text-sm text-gray-500">{metric.label}</div>
                </div>
              ))}
            </div>
            
            <Link 
              href={`/case/${caseStudy.id}`}
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primaryDark transition-colors group"
            >
              查看詳細案例
              <svg 
                className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7-7 7" 
                />
              </svg>
            </Link>
          </motion.div>
          
          <motion.div 
            variants={fadeInRight}
            className="order-1 md:order-2"
          >
            <Link href={`/case/${caseStudy.id}`} className="block relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 relative">
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10"
                ></div>
                <img 
                  src={caseStudy.image} 
                  alt={caseStudy.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
})
FeaturedCase.displayName = 'FeaturedCase';

// 使用React.memo優化CTA部分
export const CTASection = memo((): React.ReactElement => {
  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            準備好開始您的診所行銷升級了嗎？
          </h2>
          <p className="text-white/90 text-lg mb-8">
            我們的專業團隊擁有豐富的牙醫診所行銷經驗，能為您打造專屬的行銷策略，提升品牌價值與病患轉換率。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact"
              className="px-8 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              免費諮詢
            </Link>
            <Link 
              href="/service"
              className="px-8 py-3 bg-transparent text-white border border-white font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              探索服務方案
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
})
CTASection.displayName = 'CTASection';

// 生成頁面metadata (Server Component可使用)
export const generateCasePageMetadata = (): Metadata => {
  return {
    title: '成功案例 | Aidea:Med 牙醫行銷專家',
    description: '探索我們協助牙醫診所提升品牌價值與病患轉換率的成功案例，包含品牌重塑、數位行銷、空間規劃等多元服務。',
    openGraph: {
      title: '成功案例 | Aidea:Med 牙醫行銷專家',
      description: '探索我們協助牙醫診所提升品牌價值與病患轉換率的成功案例，包含品牌重塑、數位行銷、空間規劃等多元服務。',
      url: 'https://www.aideamed.com/case',
      siteName: 'Aidea:Med 牙醫行銷專家',
      locale: 'zh_TW',
      type: 'website',
    }
  }
}

// 生成案例結構化數據 (Server Component可使用)
export const generateCaseStudyMetadata = (caseStudy: CaseStudy): ArticleStructuredData => {
  const schemaData: ArticleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${caseStudy.name} - ${caseStudy.category}成功案例`,
    description: caseStudy.description,
    image: caseStudy.image,
    datePublished: caseStudy.publishedDate || new Date().toISOString(),
    dateModified: caseStudy.updatedDate || caseStudy.publishedDate || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Aidea:Med 牙醫行銷專家',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.aideamed.com/images/logo.png'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aidea:Med 牙醫行銷專家',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.aideamed.com/images/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.aideamed.com/case/${caseStudy.id}`
    },
    about: {
      '@type': 'Thing',
      name: '牙醫診所行銷',
      description: '專業牙醫診所品牌建立與數位行銷服務'
    },
    articleSection: caseStudy.category,
    keywords: ['牙醫行銷', '診所品牌', caseStudy.category, '醫療行銷', '成功案例']
  }
  
  return schemaData
}

// 生成案例metadata (Server Component可使用)
export const generateCaseMetadata = (caseStudy: CaseStudy): Metadata => {
  return {
    title: `${caseStudy.name} - ${caseStudy.category}成功案例 | Aidea:Med 牙醫行銷專家`,
    description: caseStudy.description,
    openGraph: {
      title: `${caseStudy.name} - ${caseStudy.category}成功案例`,
      description: caseStudy.description,
      images: [
        {
          url: caseStudy.image,
          width: 1200,
          height: 630,
          alt: caseStudy.name
        }
      ],
      locale: 'zh_TW',
      type: 'article',
      publishedTime: caseStudy.publishedDate,
      modifiedTime: caseStudy.updatedDate,
      tags: ['牙醫行銷', '診所品牌', caseStudy.category, '醫療行銷', '成功案例']
    },
    twitter: {
      card: 'summary_large_image',
      title: `${caseStudy.name} - ${caseStudy.category}成功案例`,
      description: caseStudy.description,
      images: [caseStudy.image],
    },
    alternates: {
      canonical: `https://www.aideamed.com/case/${caseStudy.id}`,
    }
  }
}

// 優化主內容組件
const MainContent = memo(function MainContent() {
  const [activeCategory, setActiveCategory] = useState('全部案例')
  const [isLoading, setIsLoading] = useState(true)
  // 新增視圖模式狀態
  const [viewMode, setViewMode] = useState<'standard' | 'compact'>('standard')
  
  // 判斷是否為手機尺寸
  const [isMobileView, setIsMobileView] = useState(false)
  
  // 監聽視窗尺寸變化
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    // 初始檢查
    checkMobileView()
    
    // 監聽變化
    window.addEventListener('resize', checkMobileView)
    
    // 如果是手機自動切換到緊湊模式
    if (window.innerWidth < 640) {
      setViewMode('compact')
    }
    
    return () => {
      window.removeEventListener('resize', checkMobileView)
    }
  }, [])
  
  // 優化：使用useMemo計算類別列表並排序，避免重複計算
  const categories = useMemo(() => {
    const allCategories = Array.from(new Set(caseStudies.map(item => item.category)))
    return allCategories
  }, [])
  
  // 優化：使用useMemo過濾案例
  const filteredCases = useMemo(() => {
    // 如果是全部案例直接返回全部
    if (activeCategory === '全部案例') {
      return caseStudies;
    }
    
    // 過濾出指定類別的案例
    return caseStudies.filter(caseStudy => caseStudy.category === activeCategory);
  }, [activeCategory])
  
  // 使用useMemo緩存精選案例
  const featuredCase = useMemo(() => {
    const featured = caseStudies.find(item => item.featured)
    return featured || caseStudies[0]
  }, [])
  
  // 使用useEffect處理初始加載狀態
  useEffect(() => {
    // 模擬載入延遲
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 500)
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    }
  }, [])
  
  // 優化：使用useCallback包裝類別切換處理函數
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    // 類別切換時顯示短暫的加載狀態，提升用戶體驗
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  }, []);
  
  // 切換視圖模式
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'standard' ? 'compact' : 'standard')
  }, [])
  
  // 根據視圖模式設置網格佈局
  const gridLayoutClass = useMemo(() => {
    if (viewMode === 'compact') {
      return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'
  }, [viewMode])
  
  return (
    <>
      {featuredCase && !isMobileView && <FeaturedCase caseStudy={featuredCase} />}
      
      <div className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-10">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">成功案例</h1>
            <p className="text-gray-600 text-sm">了解我們如何幫助客戶達成業務目標</p>
          </div>
          
          {/* 視圖切換按鈕 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleViewMode}
              className="flex items-center justify-center p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              aria-label={viewMode === 'standard' ? '切換到緊湊視圖' : '切換到標準視圖'}
            >
              {viewMode === 'standard' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        <CaseFilter 
          activeCategory={activeCategory} 
          setActiveCategory={handleCategoryChange} 
          categories={categories} 
        />
        
        {isLoading ? (
          <LoadingState />
        ) : filteredCases.length > 0 ? (
          <Suspense fallback={<LoadingState />}>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className={gridLayoutClass}
            >
              {filteredCases.map((caseStudy, index) => (
                <motion.div
                  key={caseStudy.id}
                  variants={fadeInUp}
                  custom={index}
                >
                  <CaseCard 
                    caseStudy={caseStudy} 
                    index={index} 
                    isCompact={viewMode === 'compact'}
                  />
                </motion.div>
              ))}
            </motion.div>
          </Suspense>
        ) : (
          <EmptyState 
            category={activeCategory} 
            message="目前尚無此類別的案例，請嘗試其他類別或聯繫我們了解更多資訊。" 
          />
        )}
      </div>
      
      <CTASection />
    </>
  )
})
MainContent.displayName = 'MainContent';

// 使用React.memo優化主頁面組件
export default memo(function CasePage(): React.ReactElement {
  return (
    <>
      <PageHeader
        title="客戶成功案例"
        description="見證醫療診所的數位行銷轉型與品牌成長"
        alignment="center"
        backgroundImage="/images/bgline-r.png"
        variant="black"
        size="md"
        withBottomBorder={false}
      />
      
      <Suspense fallback={<LoadingState />}>
        <MainContent />
      </Suspense>
    </>
  )
}) 