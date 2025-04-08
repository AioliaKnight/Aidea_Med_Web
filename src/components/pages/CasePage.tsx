'use client'

import { useState, useEffect, memo, useMemo, Suspense, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Metadata } from 'next'
import { animations, fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/utils/animations'
import { CaseCard } from '@/components/case/CaseCard'
import { PageHeader } from '@/components/common'
import Image from 'next/image'
import { CaseStudy, CaseMetric, Solution, ArticleStructuredData } from '@/types/case'
import { generateCaseStudyMetadata, sortCasesByPriority } from '@/utils/case'
import { caseStudies } from '@/data/cases'

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
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="mb-20 bg-gray-50 py-16"
    >
      <div className="container mx-auto px-4">
        {/* 區塊標題 */}
        <div className="text-center mb-16">
          <motion.div 
            variants={fadeInUp}
            className="w-16 h-1 bg-primary mx-auto mb-6"
          />
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            特色案例
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            探索我們如何幫助牙醫診所提升品牌價值與患者轉換率
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            variants={fadeInLeft}
            className="order-2 md:order-1"
          >
            <div className="bg-white p-8 border-t-4 border-primary">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary/10 text-primary text-sm px-3 py-1">
                  {caseStudy.category}
                </span>
                {caseStudy.featured && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1">
                    精選案例
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {caseStudy.name}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {caseStudy.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {caseStudy.metrics.slice(0, 4).map((metric, index) => (
                  <div key={index} className="border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-primary mb-1">
                      <AnimatedNumber value={metric.value} />
                    </div>
                    <div className="text-sm text-gray-500">{metric.label}</div>
                  </div>
                ))}
              </div>
              
              <Link 
                href={`/case/${caseStudy.id}`}
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
              >
                查看詳細案例
                <svg 
                  className="w-4 h-4 ml-2" 
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
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeInRight}
            className="order-1 md:order-2"
          >
            <Link href={`/case/${caseStudy.id}`} className="block relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                {!imgError ? (
                  <Image 
                    src={caseStudy.image} 
                    alt={caseStudy.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    onError={() => setImgError(true)}
                    priority
                    quality={90}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* 扁平化覆蓋層 */}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-primary text-white px-4 py-2 font-medium">
                    查看案例詳情
                  </div>
                </div>
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
    <section className="bg-primary py-24 text-white">
      {/* 上部裝飾線 */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto relative"
        >
          {/* 上方裝飾線 */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 120 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-white w-0 mx-auto mb-10"
          ></motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            準備好開始您的診所行銷升級了嗎？
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl mb-10 max-w-2xl mx-auto"
          >
            我們的專業團隊擁有豐富的牙醫診所行銷經驗，能為您打造專屬的行銷策略，提升品牌價值與病患轉換率。
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            <Link 
              href="/contact"
              className="inline-block text-center min-w-[160px] px-8 py-4 bg-white text-primary font-medium hover:bg-gray-100 transition-all duration-300"
            >
              免費諮詢
            </Link>
            <Link 
              href="/service"
              className="inline-block text-center min-w-[160px] px-8 py-4 bg-black text-white font-medium hover:bg-black/90 transition-all duration-300"
            >
              探索服務方案
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center gap-8 text-sm"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              專業診斷分析
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              量身定制方案
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              持續支援服務
            </div>
          </motion.div>
          
          {/* 下方裝飾線 */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="h-1 bg-white w-0 mx-auto mt-10"
          ></motion.div>
        </motion.div>
      </div>
    </section>
  )
})
CTASection.displayName = 'CTASection';

// 生成頁面metadata (Server Component可使用)
export const generateCasePageMetadata = (): Metadata => {
  // 引用主要metadata中的基礎設定
  try {
    // 動態引入主metadata配置
    const { caseMetadata } = require('@/app/metadata');
    
    // 返回擴展後的設定，保留特定頁面的自定義內容
    return {
      ...caseMetadata,
      // 此處覆寫特定設定
      title: '成功案例 | Aidea:Med 牙醫行銷專家',
      description: '探索我們協助牙醫診所提升品牌價值與病患轉換率的成功案例，包含品牌重塑、數位行銷、空間規劃等多元服務。',
      openGraph: {
        ...caseMetadata.openGraph,
        title: '成功案例 | Aidea:Med 牙醫行銷專家',
        description: '探索我們協助牙醫診所提升品牌價值與病患轉換率的成功案例，包含品牌重塑、數位行銷、空間規劃等多元服務。',
        url: 'https://www.aideamed.com/case',
        siteName: 'Aidea:Med 牙醫行銷專家',
        locale: 'zh_TW',
        type: 'website',
      }
    };
  } catch (e) {
    // 若引入失敗則使用原始設定
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
    };
  }
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
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [displayLimit, setDisplayLimit] = useState(9) // 控制顯示的案例數量
  
  // 優化：使用useMemo計算類別列表
  const categories = useMemo(() => {
    return Array.from(new Set(caseStudies.map(item => item.category)))
  }, [])
  
  // 優化：使用useMemo過濾和排序案例
  const filteredCases = useMemo(() => {
    const filtered = caseStudies.filter(caseStudy => {
      return activeCategory === '全部案例' || caseStudy.category === activeCategory
    });
    return sortCasesByPriority(filtered);
  }, [activeCategory])
  
  // 限制顯示的案例數量
  const displayedCases = useMemo(() => {
    return filteredCases.slice(0, displayLimit)
  }, [filteredCases, displayLimit])
  
  // 是否還有更多案例可以加載
  const hasMoreCases = useMemo(() => {
    return displayedCases.length < filteredCases.length
  }, [displayedCases.length, filteredCases.length])
  
  // 優化：使用useMemo緩存精選案例
  const featuredCases = useMemo(() => {
    const featured = caseStudies.filter(item => item.featured);
    return sortCasesByPriority(featured).slice(0, 2);
  }, [])
  
  // 添加 useEffect 處理初始載入
  useEffect(() => {
    // 在組件掛載後，設置一個短暫的延遲，使頁面流暢過渡
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    
    // 清理定時器
    return () => clearTimeout(timer);
  }, []); // 空依賴數組確保只在掛載時執行一次
  
  // 優化：使用useCallback包裝類別切換處理函數
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category)
    setIsLoading(true)
    setIsInitialLoad(false)
    setDisplayLimit(9) // 重置顯示限制
    setTimeout(() => setIsLoading(false), 300)
  }, [])
  
  // 處理加載更多案例
  const handleLoadMore = useCallback(() => {
    setDisplayLimit(prev => prev + 6) // 每次多加載6個案例
  }, [])
  
  return (
    <>
      {/* 統一的頁面容器 */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 pb-16">
          {/* 頁面標題區塊 */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center mb-10 sm:mb-16"
          >
            <motion.div 
              variants={fadeInUp}
              className="w-12 sm:w-16 h-1 bg-primary mx-auto mb-4 sm:mb-6"
            />
            <motion.h1 
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
            >
              成功案例
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto"
            >
              了解我們如何幫助診所提升品牌價值與轉換率
            </motion.p>
          </motion.div>
          
          {/* 類別過濾器 */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <button
                onClick={() => handleCategoryChange('全部案例')}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors rounded-md ${
                  activeCategory === '全部案例'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                全部案例
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors rounded-md ${
                    activeCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* 案例列表 */}
          {isLoading ? (
            <LoadingState />
          ) : displayedCases.length > 0 ? (
            <Suspense fallback={<LoadingState />}>
              {/* 移動設備水平滾動視圖 */}
              <div className="md:hidden overflow-x-auto pb-6 -mx-4 px-4">
                <div className="flex space-x-4 min-w-max px-1 py-2">
                  {displayedCases.map((caseStudy, index) => (
                    <div 
                      key={caseStudy.id} 
                      className="w-[250px] sm:w-[280px] flex-shrink-0"
                    >
                      <CaseCard 
                        caseStudy={caseStudy} 
                        index={index} 
                        variant="standard"
                        showMetrics={false}
                        priority={index < 3}
                        aspectRatio="16/9"
                        isCircular={true}
                      />
                    </div>
                  ))}
                </div>
                
                {/* 滾動指示器 */}
                <div className="mt-4 flex justify-center">
                  <div className="flex space-x-1">
                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                    <span className="w-2 h-1 bg-gray-300 rounded-full"></span>
                    <span className="w-2 h-1 bg-gray-300 rounded-full"></span>
                  </div>
                </div>
              </div>
              
              {/* 桌面網格視圖 */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {displayedCases.map((caseStudy, index) => (
                  <motion.div
                    key={caseStudy.id}
                    variants={fadeInUp}
                    custom={index}
                    className="group h-full"
                  >
                    <CaseCard 
                      caseStudy={caseStudy} 
                      index={index} 
                      variant={index < 2 ? 'featured' : 'standard'}
                      showMetrics={true}
                      priority={index < 3}
                      aspectRatio="16/9"
                      isCircular={true}
                    />
                  </motion.div>
                ))}
              </div>
              
              {/* 查看更多案例按鈕 */}
              {hasMoreCases && (
                <div className="flex justify-center mt-10 md:mt-16">
                  <button
                    onClick={handleLoadMore}
                    className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors"
                  >
                    <span>載入更多案例</span>
                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </Suspense>
          ) : (
            <EmptyState 
              category={activeCategory} 
              message="目前尚無此類別的案例，請嘗試其他類別或聯繫我們了解更多資訊。" 
            />
          )}
        </div>
      </div>
      
      <CTASection />
    </>
  )
})
MainContent.displayName = 'MainContent';

// 使用React.memo優化主頁面組件
export default memo(function CasePage(): React.ReactElement {
  return (
    <Suspense fallback={<LoadingState />}>
      <MainContent />
    </Suspense>
  )
}) 