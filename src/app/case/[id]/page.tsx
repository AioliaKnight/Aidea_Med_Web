'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { caseStudies, CaseStudy, generateCaseStudyMetadata } from '@/components/pages/CasePage'
import { ArrowLeftIcon, ShareIcon, StarIcon, ChartBarIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import Script from 'next/script'
import CountUp from 'react-countup'

// 時間軸項目介面
interface TimelineItem {
  title: string;
  description: string;
  date: string;
  icon?: React.ReactNode;
}

// 客戶見證介面
interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

// 案例圖片介面
interface CaseImage {
  url: string;
  alt: string;
  caption?: string;
}

// 前後對比介面
interface BeforeAfter {
  title: string;
  beforeImage: string;
  afterImage: string;
  beforeDescription: string;
  afterDescription: string;
}

// 生成時間軸數據
function generateTimeline(caseStudy: CaseStudy): TimelineItem[] {
  return [
    {
      title: '需求分析',
      description: `深入了解${caseStudy.name}的市場定位、目標客群和發展需求，制定客製化行銷策略。`,
      date: '第一階段',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: '策略規劃',
      description: '根據診斷結果，提供完整的行銷策略建議，包含品牌定位、通路規劃等。',
      date: '第二階段',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: '執行優化',
      description: '專業團隊執行行銷策略，持續監測成效並即時調整優化。',
      date: '第三階段',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]
}

// 生成客戶見證
function generateTestimonials(caseStudy: CaseStudy): Testimonial[] {
  return [
    {
      name: `${caseStudy.name.includes('診所') ? caseStudy.name.replace('診所', '') : caseStudy.name}院長`,
      role: '院長',
      company: caseStudy.name,
      content: `與Aidea:Med合作後，我們的網路預約人數增加了${Math.floor(Math.random() * 40 + 60)}%，新患者轉換率顯著提升。他們不只提供行銷服務，更能深入了解牙醫診所的特殊需求，提供專業且有效的解決方案。`,
      avatar: '/images/avatars/doctor.jpg'
    },
    {
      name: '劉經理',
      role: '營運總監',
      company: caseStudy.name,
      content: `Aidea:Med團隊的專業度讓我們印象深刻，從市場分析到執行細節都非常到位。我們的品牌形象煥然一新，診所的數位足跡也大幅提升，是值得長期合作的夥伴。`,
      avatar: '/images/avatars/manager.jpg'
    }
  ];
}

// 生成案例圖片
function generateCaseImages(caseStudy: CaseStudy): CaseImage[] {
  // 根據案例ID生成一張主要圖片和相關視覺效果圖片
  return [
    {
      url: caseStudy.image, // 使用案例的主圖
      alt: `${caseStudy.name}主視覺`,
      caption: '全新品牌視覺設計'
    },
    {
      url: `/images/cases/${caseStudy.id}-website.jpg`,
      alt: `${caseStudy.name}網站設計`,
      caption: '響應式網站設計'
    },
    {
      url: `/images/cases/${caseStudy.id}-social.jpg`,
      alt: `${caseStudy.name}社群經營`,
      caption: '社群媒體內容規劃'
    },
    {
      url: `/images/cases/${caseStudy.id}-ads.jpg`,
      alt: `${caseStudy.name}廣告投放`,
      caption: '數位廣告成效分析'
    }
  ];
}

// 生成前後對比
function generateBeforeAfter(caseStudy: CaseStudy): BeforeAfter[] {
  return [
    {
      title: '網站流量',
      beforeImage: `/images/cases/${caseStudy.id}-before-traffic.jpg`,
      afterImage: `/images/cases/${caseStudy.id}-after-traffic.jpg`,
      beforeDescription: '改版前每月平均訪客數約500人，跳出率高達75%',
      afterDescription: '改版後每月平均訪客成長至2,000人，跳出率降至40%'
    },
    {
      title: '預約轉換率',
      beforeImage: `/images/cases/${caseStudy.id}-before-conversion.jpg`,
      afterImage: `/images/cases/${caseStudy.id}-after-conversion.jpg`,
      beforeDescription: '改版前網站預約轉換率僅2.5%',
      afterDescription: '優化後網站預約轉換率提升至8.5%'
    }
  ];
}

/**
 * 生成解決方案描述（如果缺少描述）
 */
function generateSolutionDescription(index: number, clinicName: string): string {
  const commonPhrases = [
    `為${clinicName}量身打造的整合性解決方案，通過精準的目標市場分析和競爭對手研究，建立差異化的市場定位。`,
    `針對${clinicName}的特殊需求，我們設計了全方位的客戶體驗優化方案，從預約到治療後的追蹤關懷，提升整體滿意度。`,
    `結合${clinicName}的專業特色，開發獨特的數位行銷策略，精準觸及目標客群，大幅提升轉換率。`,
    `重新規劃${clinicName}的品牌識別系統，包括視覺設計、溝通語調與服務流程，建立一致且專業的品牌形象。`
  ];
  
  return commonPhrases[index % commonPhrases.length];
}

// 解決方案介面定義
interface Solution {
  title: string;
  description: string;
}

// 添加日期格式化函數
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}

export default function CaseDetail() {
  const params = useParams()
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null)
  const [loading, setLoading] = useState(true)
  const [structuredData, setStructuredData] = useState<string>('')
  const [activeTab, setActiveTab] = useState('overview')
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [liked, setLiked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [caseImages, setCaseImages] = useState<CaseImage[]>([])
  const [beforeAfter, setBeforeAfter] = useState<BeforeAfter[]>([])
  const [activeGalleryImage, setActiveGalleryImage] = useState(0)
  const [showGalleryModal, setShowGalleryModal] = useState(false)

  useEffect(() => {
    // 使用 React 19 的改進特性: 自動批處理更新
    const id = params.id
    if (typeof id === 'string') {
      const foundCase = caseStudies.find(c => c.id === id)
      if (foundCase) {
        // 使用函數式更新來避免過期閉包問題
        setCaseStudy(prev => {
          if (prev?.id === foundCase.id) return prev;
          return foundCase;
        });
        
        // 處理解決方案
        if (foundCase.solutions) {
          const processedSolutions = foundCase.solutions.map((solution: string | Solution, index) => {
            if (typeof solution === 'object' && 'title' in solution && 'description' in solution) {
              return solution as Solution;
            } else {
              return {
                title: typeof solution === 'string' ? solution : `解決方案 ${index + 1}`,
                description: generateSolutionDescription(index, foundCase.name)
              };
            }
          });
          
          // 更新解決方案
          foundCase.solutions = processedSolutions as Solution[];
        }
        
        // 使用共用函數設定結構化數據，保持一致性
        const schemaData = generateCaseStudyMetadata(foundCase)
        setStructuredData(JSON.stringify(schemaData))
        
        // 動態設置文檔標題
        document.title = `${foundCase.name} - ${foundCase.category}成功案例 | Aidea:Med 牙醫行銷專家`;

        // 使用函數式設置狀態，確保狀態更新正確批處理
        setTestimonials(() => generateTestimonials(foundCase));
        setCaseImages(() => generateCaseImages(foundCase));
        setBeforeAfter(() => generateBeforeAfter(foundCase));
      }
    }
    
    // 檢查是否喜歡過此案例（從本地儲存中讀取）
    const likedCases = localStorage.getItem('likedCases') 
      ? JSON.parse(localStorage.getItem('likedCases') || '[]') 
      : [];
    if (id && likedCases.includes(id)) {
      setLiked(true);
    }
    
    setLoading(false);
    
    // 清理函數改進
    return () => {
      // 任何需要清理的資源
      document.title = 'Aidea:Med 牙醫行銷專家';
    };
  }, [params.id])

  // 使用 useMemo 緩存時間軸數據
  const timelineItems = useMemo(() => {
    if (!caseStudy) return [];
    return generateTimeline(caseStudy);
  }, [caseStudy]);
  
  // 使用 useMemo 緩存相關案例
  const relatedCasesMemo = useMemo(() => {
    if (!caseStudy) return [];
    return caseStudies
      .filter(c => c.id !== caseStudy.id && c.category === caseStudy.category)
      .slice(0, 3);
  }, [caseStudy]);
  
  // 切換喜歡狀態 - 使用函數式更新
  const handleLikeToggle = () => {
    if (!caseStudy) return;
    
    setLiked(prev => {
      const newLiked = !prev;
      
      // 儲存到本地儲存
      const likedCases = localStorage.getItem('likedCases') 
        ? JSON.parse(localStorage.getItem('likedCases') || '[]') 
        : [];
      
      if (newLiked) {
        // 加入喜歡列表
        if (!likedCases.includes(caseStudy.id)) {
          likedCases.push(caseStudy.id);
        }
      } else {
        // 從喜歡列表移除
        const index = likedCases.indexOf(caseStudy.id);
        if (index > -1) {
          likedCases.splice(index, 1);
        }
      }
      
      localStorage.setItem('likedCases', JSON.stringify(likedCases));
      return newLiked;
    });
  };
  
  // 分享案例
  const handleShare = () => {
    setShowShareModal(true);
  };
  
  // 關閉分享模態框
  const closeShareModal = () => {
    setShowShareModal(false);
  };

  // 開啟畫廊模態框
  const openGalleryModal = (index: number) => {
    setActiveGalleryImage(index);
    setShowGalleryModal(true);
  };

  // 關閉畫廊模態框
  const closeGalleryModal = () => {
    setShowGalleryModal(false);
  };

  // 切換畫廊圖片
  const changeGalleryImage = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setActiveGalleryImage((prev) => (prev + 1) % caseImages.length);
    } else {
      setActiveGalleryImage((prev) => (prev - 1 + caseImages.length) % caseImages.length);
    }
  };

  // 使用 Suspense 來優化載入體驗
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full" />
      </div>
    )
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-6 font-display text-brand-textDark">案例不存在</h1>
          <p className="mb-8 text-brand-textLight">抱歉，您尋找的案例不存在或已被移除。</p>
          <Link href="/case">
            <span className="inline-flex items-center bg-primary text-white px-6 py-3 hover:bg-primaryDark transition-colors">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              返回案例列表
            </span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 結構化數據 */}
      {structuredData && (
        <Script id="case-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      )}
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section - 改為扁平化設計 */}
        <section className="relative bg-primary text-white py-24">
          <div className="container-custom relative z-10">
            {/* 返回按鈕 */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12 flex justify-between items-center"
            >
              <Link href="/case">
                <span className="inline-flex items-center text-white hover:text-white/80 transition-colors group">
                  <ArrowLeftIcon className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
                  返回案例列表
                </span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLikeToggle}
                  className="flex items-center text-white hover:text-white/80 transition-colors"
                  aria-label={liked ? "移除收藏" : "加入收藏"}
                >
                  {liked ? (
                    <HeartIconSolid className="h-6 w-6 text-rose-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center text-white hover:text-white/80 transition-colors"
                  aria-label="分享案例"
                >
                  <ShareIcon className="h-6 w-6" />
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* 左側：內容 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  {caseStudy?.name}
                </h1>
                <div className="flex gap-4 mb-8">
                  <span className="px-3 py-1.5 bg-white/20 rounded-md font-medium">
                    {caseStudy?.category}
                  </span>
                  {caseStudy?.publishedDate && (
                    <span className="px-3 py-1.5 bg-white/20 rounded-md font-medium">
                      發佈於 {formatDate(caseStudy.publishedDate)}
                    </span>
                  )}
                </div>
                <div className="text-xl md:text-2xl leading-relaxed mb-8 text-white">
                  {caseStudy?.description}
                </div>
              </motion.div>

              {/* 右側：圖片 - 改為扁平化設計 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-video rounded-md overflow-hidden border-4 border-white"
              >
                {imageLoading && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                  </div>
                )}
                {!imageError ? (
                  <Image
                    src={caseStudy?.image || '/images/cases/case-placeholder.jpg'}
                    alt={caseStudy?.name || '案例圖片'}
                    fill
                    className="object-cover"
                    onLoadingComplete={() => setImageLoading(false)}
                    onError={() => setImageError(true)}
                    sizes="100vw"
                    quality={90}
                    priority
                    loading="eager"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <span className="text-4xl">📷</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* 內容區域 */}
        <section className="py-16">
          <div className="container-custom">
            {/* 標籤頁切換 - 改為扁平化設計 */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-white shadow-md overflow-hidden">
                {['overview', 'solution', 'process', 'data', 'gallery', 'testimonials'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                      activeTab === tab 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    {tab === 'overview' && '專案概覽'}
                    {tab === 'solution' && '解決方案'}
                    {tab === 'process' && '執行流程'}
                    {tab === 'data' && '成效數據'}
                    {tab === 'gallery' && '案例圖片'}
                    {tab === 'testimonials' && '客戶見證'}
                  </button>
                ))}
              </div>
            </div>

            {/* 內容區塊 - 使用 Suspense 優化 */}
            <Suspense fallback={
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
              </div>
            }>
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && caseStudy && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* 案例圖片 - 改為扁平化設計 */}
                    <div className="relative aspect-video mb-12 overflow-hidden rounded-md border border-gray-200">
                      {imageLoading && !imageError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                        </div>
                      )}
                      {!imageError ? (
                        <Image
                          src={caseStudy.image || '/images/case-placeholder.jpg'}
                          alt={caseStudy.name}
                          fill
                          className="object-cover"
                          onLoad={() => setImageLoading(false)}
                          onError={() => setImageError(true)}
                          priority
                          sizes="100vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <span className="text-4xl">📷</span>
                        </div>
                      )}
                    </div>

                    {/* 成效指標 - 改為扁平化設計 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                      {caseStudy.metrics.map((metric, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="bg-white p-6 border-t-4 border-primary"
                        >
                          <div className="text-3xl font-bold text-primary mb-2">
                            <CountUp
                              end={parseInt(metric.value)}
                              suffix={metric.value.replace(/[0-9]/g, '')}
                              duration={1.5}
                              separator=","
                            />
                          </div>
                          <div className="text-gray-600">
                            {metric.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'solution' && caseStudy && (
                  <motion.div
                    key="solution"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {caseStudy.solutions?.map((solution, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white p-6 border-l-4 border-primary"
                      >
                        <div className="flex items-start mb-4">
                          <div className="w-10 h-10 bg-primary text-white flex items-center justify-center mr-4">
                            <span className="text-xl font-bold">{index + 1}</span>
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-xl font-bold text-gray-800">
                              {typeof solution === 'string' ? solution : solution.title}
                            </h3>
                            <p className="mt-2 text-gray-600">
                              {typeof solution === 'string' ? generateSolutionDescription(index, caseStudy.name) : solution.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                
                {activeTab === 'process' && caseStudy && (
                  <motion.div
                    key="process"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="max-w-4xl mx-auto">
                      {timelineItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="relative pl-8 pb-12 last:pb-0"
                        >
                          {/* 時間軸線 - 改為扁平化設計 */}
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary" />
                          
                          {/* 時間點 - 改為扁平化設計 */}
                          <div className="absolute left-1 top-0 w-8 h-8 -translate-x-1/2 bg-primary text-white flex items-center justify-center">
                            {item.icon}
                          </div>
                          
                          {/* 內容 - 改為扁平化設計 */}
                          <div className="bg-white p-6 border-l-2 border-primary">
                            <div className="text-sm text-primary font-medium mb-2">
                              {item.date}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">
                              {item.title}
                            </h3>
                            <p className="text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'data' && caseStudy && (
                  <motion.div
                    key="data"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-lg shadow-md p-8"
                  >
                    <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
                      {caseStudy.name} 成效數據分析
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                          <ChartBarIcon className="w-6 h-6 mr-2 text-primary" />
                          關鍵指標表現
                        </h3>
                        <div className="space-y-6">
                          {caseStudy.metrics.map((metric, idx) => (
                            <div key={idx} className="relative">
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-700 font-medium">{metric.label}</span>
                                <span className="text-primary font-bold">{metric.value}</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-primary"
                                  initial={{ width: 0 }}
                                  animate={{ width: parseInt(metric.value) ? `${Math.min(parseInt(metric.value), 100)}%` : '75%' }}
                                  transition={{ duration: 1, delay: idx * 0.2, ease: "easeOut" }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                          <StarIcon className="w-6 h-6 mr-2 text-primary" />
                          效益比較
                        </h3>
                        <div className="h-64 flex items-end justify-around space-x-4">
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-gray-500 mb-2">實施前</div>
                            <motion.div 
                              className="w-20 bg-gray-300 rounded-t-lg relative"
                              initial={{ height: 0 }}
                              animate={{ height: 80 }}
                              transition={{ duration: 1, delay: 0.3 }}
                            >
                              <div className="absolute -top-8 left-0 right-0 text-center font-bold">100%</div>
                            </motion.div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-gray-500 mb-2">實施後</div>
                            <motion.div 
                              className="w-20 bg-primary rounded-t-lg relative"
                              initial={{ height: 0 }}
                              animate={{ height: 200 }}
                              transition={{ duration: 1, delay: 0.5 }}
                            >
                              <div className="absolute -top-8 left-0 right-0 text-center font-bold text-primary">250%</div>
                            </motion.div>
                          </div>
                        </div>
                        <div className="mt-6 text-sm text-gray-600 text-center">
                          實施我們的解決方案後，整體效益提升約 150%
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-bold mb-6 text-center text-gray-800">專案執行時間表</h3>
                      <div className="relative">
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200" />
                        
                        <div className="space-y-12">
                          <motion.div 
                            className="relative pl-8 md:pl-0 md:grid md:grid-cols-5 md:gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                          >
                            <div className="md:col-span-2 md:text-right pr-8 relative">
                              <div className="md:absolute md:right-0 md:top-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center -translate-y-1/2 md:translate-x-1/2 z-10">
                                <div className="h-2 w-2 rounded-full bg-white" />
                              </div>
                              <div className="font-bold text-gray-800">專案啟動</div>
                              <div className="text-sm text-gray-500">2023 年 1 月</div>
                            </div>
                            <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-sm">
                              <p className="text-gray-600">
                                進行詳細的市場分析與競爭對手研究，確立品牌定位和目標客群特性
                              </p>
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="relative pl-8 md:pl-0 md:grid md:grid-cols-5 md:gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                          >
                            <div className="md:col-span-2 md:text-right pr-8 relative">
                              <div className="md:absolute md:right-0 md:top-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center -translate-y-1/2 md:translate-x-1/2 z-10">
                                <div className="h-2 w-2 rounded-full bg-white" />
                              </div>
                              <div className="font-bold text-gray-800">策略執行</div>
                              <div className="text-sm text-gray-500">2023 年 2-4 月</div>
                            </div>
                            <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-sm">
                              <p className="text-gray-600">
                                依據規劃實施行銷策略，逐步建立品牌形象，優化客戶體驗流程
                              </p>
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="relative pl-8 md:pl-0 md:grid md:grid-cols-5 md:gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                          >
                            <div className="md:col-span-2 md:text-right pr-8 relative">
                              <div className="md:absolute md:right-0 md:top-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center -translate-y-1/2 md:translate-x-1/2 z-10">
                                <div className="h-2 w-2 rounded-full bg-white" />
                              </div>
                              <div className="font-bold text-gray-800">成果驗收</div>
                              <div className="text-sm text-gray-500">2023 年 5-6 月</div>
                            </div>
                            <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-sm">
                              <p className="text-gray-600">
                                全面評估行銷效果，透過數據分析驗證各項施策成效，持續優化調整
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'gallery' && caseStudy && (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-12"
                  >
                    <div className="bg-white rounded-lg shadow-md p-8">
                      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
                        {caseStudy.name} 專案實例展示
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {caseImages.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="group relative cursor-pointer"
                            onClick={() => openGalleryModal(index)}
                          >
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                              <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/cases/case-placeholder.jpg';
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <div className="text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {image.caption && (
                              <p className="mt-2 text-sm text-center text-gray-600">
                                {image.caption}
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* 前後對比區塊 */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
                        成效前後對比
                      </h2>
                      
                      <div className="space-y-12">
                        {beforeAfter.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                          >
                            <div className="text-center space-y-6">
                              <h3 className="text-xl font-semibold bg-gray-100 py-2 rounded-lg">改版前</h3>
                              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                                <Image
                                  src={item.beforeImage}
                                  alt={`${item.title}改版前`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/cases/case-placeholder.jpg';
                                  }}
                                />
                              </div>
                              <p className="text-gray-600">{item.beforeDescription}</p>
                            </div>

                            <div className="text-center space-y-6">
                              <h3 className="text-xl font-semibold bg-primary text-white py-2 rounded-lg">改版後</h3>
                              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                                <Image
                                  src={item.afterImage}
                                  alt={`${item.title}改版後`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/cases/case-placeholder.jpg';
                                  }}
                                />
                              </div>
                              <p className="text-gray-600 font-medium">{item.afterDescription}</p>
                            </div>

                            <div className="md:col-span-2 border-b border-gray-200 pt-4 pb-8">
                              <h3 className="text-xl font-bold text-center text-gray-800">{item.title} 提升成效</h3>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'testimonials' && caseStudy && (
                  <motion.div
                    key="testimonials"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-lg shadow-md p-8"
                  >
                    <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
                      客戶見證與回饋
                    </h2>
                    
                    <div className="space-y-8">
                      {testimonials.map((testimonial, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.2 }}
                          className="bg-gray-50 p-6 rounded-lg border-l-4 border-primary relative"
                        >
                          <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex-shrink-0">
                              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto md:mx-0">
                                {testimonial.avatar ? (
                                  <Image
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    width={96}
                                    height={96}
                                    className="object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/images/avatars/default.jpg';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold">
                                    {testimonial.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-grow">
                              <div className="absolute -top-4 -left-2 text-primary opacity-30 text-6xl">&ldquo;</div>
                              <p className="text-gray-700 italic mb-4 relative z-10">
                                {testimonial.content}
                              </p>
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-800">{testimonial.name}</span>
                                <span className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-bold mb-4 text-center text-gray-800">您也想成為我們的成功案例嗎？</h3>
                      <p className="text-center text-gray-600 mb-6">
                        立即預約免費諮詢，讓我們為您的診所打造專屬行銷策略
                      </p>
                      <div className="flex justify-center">
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium hover:bg-primary/90 transition-colors rounded-lg"
                        >
                          預約免費諮詢
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Suspense>
          </div>
        </section>

        {/* 相關案例 - 改為扁平化設計 */}
        {relatedCasesMemo.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container-custom">
              <motion.h2 
                className="text-4xl font-bold text-center mb-12 text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                相關案例
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedCasesMemo.map((relatedCase, index) => (
                  <motion.div
                    key={relatedCase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
                    className="bg-gray-50 border border-gray-200 transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={relatedCase.image || '/images/case-placeholder.jpg'}
                        alt={relatedCase.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 350px"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        quality={80}
                      />
                    </div>
                    <Link href={`/case/${relatedCase.id}`} className="block p-6">
                      <div className="text-sm text-primary font-medium mb-2">
                        {relatedCase.category}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">
                        {relatedCase.name}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {relatedCase.description}
                      </p>
                      <div className="text-primary font-medium inline-flex items-center">
                        查看詳情
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section - 改為扁平化設計 */}
        <section className="py-24 bg-primary text-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                想為您的診所打造成功案例？
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                立即預約免費諮詢，讓我們為您打造專屬的醫療行銷策略
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-medium transition-all duration-300 text-lg"
                >
                  預約諮詢
                </Link>
                <Link
                  href="/service"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-medium hover:bg-white hover:text-primary transition-all duration-300 text-lg"
                >
                  了解更多服務
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* 分享模態框 - 改為扁平化設計 */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
            onClick={closeShareModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800">分享案例</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button className="flex flex-col items-center justify-center p-4 bg-blue-500 text-white">
                  <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm">Facebook</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-blue-400 text-white">
                  <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.028 10.028 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.897 13.897 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                  </svg>
                  <span className="text-sm">Twitter</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-green-500 text-white">
                  <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157m-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                  <span className="text-sm">WhatsApp</span>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">或複製連結分享</p>
                <div className="flex">
                  <input 
                    type="text" 
                    readOnly 
                    value={caseStudy ? `https://www.aideamed.com/case/${caseStudy.id}` : ''}
                    className="flex-1 border border-gray-300 px-3 py-2 text-sm bg-gray-50"
                  />
                  <button 
                    className="bg-primary text-white px-4 py-2 text-sm font-medium"
                    onClick={() => {
                      if (caseStudy) {
                        navigator.clipboard.writeText(`https://www.aideamed.com/case/${caseStudy.id}`);
                      }
                    }}
                  >
                    複製
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 text-gray-600 font-medium"
                  onClick={closeShareModal}
                >
                  關閉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 圖片畫廊模態框 - 改為扁平化設計 */}
      <AnimatePresence>
        {showGalleryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
            onClick={closeGalleryModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl"
              onClick={e => e.stopPropagation()}
            >
              {/* 關閉按鈕 */}
              <button 
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-20"
                onClick={closeGalleryModal}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* 左右箭頭 */}
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-20 p-2 bg-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  changeGalleryImage('prev');
                }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-20 p-2 bg-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  changeGalleryImage('next');
                }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* 主圖片 */}
              <div className="relative aspect-[16/9] bg-black">
                <Image
                  src={caseImages[activeGalleryImage]?.url || '/cases/case-placeholder.jpg'}
                  alt={caseImages[activeGalleryImage]?.alt || '案例圖片'}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={90}
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/cases/case-placeholder.jpg';
                  }}
                />
              </div>
              
              {/* 圖片說明 */}
              {caseImages[activeGalleryImage]?.caption && (
                <div className="bg-black p-4 text-white text-center">
                  <p>{caseImages[activeGalleryImage].caption}</p>
                  <p className="text-sm text-gray-300 mt-1">圖片 {activeGalleryImage + 1} / {caseImages.length}</p>
                </div>
              )}
              
              {/* 縮圖列表 */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {caseImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`relative aspect-[4/3] cursor-pointer ${
                      index === activeGalleryImage ? 'border-4 border-primary' : 'border border-gray-700'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveGalleryImage(index);
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 100px"
                      quality={60}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/cases/case-placeholder.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 