'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { caseStudies, CaseStudy, generateCaseStudyMetadata, generateCaseMetadata } from '@/components/pages/CasePage'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import Script from 'next/script'
import CountUp from 'react-countup'
import { Metadata, ResolvingMetadata } from 'next'
import { siteConfig } from '@/config/site'
import CasePage from '@/components/pages/CasePage'

// 主要品牌色系
const colors = {
  primary: '#E61E25', // 品牌紅色
  primaryDark: '#CC1A20', // 深紅色
  secondary: '#1A1A1A', // 深黑色
  light: '#FFFFFF', // 白色
  gray: '#F5F5F5', // 淺灰色背景
  grayDark: '#E0E0E0', // 深灰色
  textDark: '#2A2A2A', // 深色文字
  textLight: '#666666', // 淺色文字
  accent: '#FFD700', // 強調色（金色）
}

// 時間軸項目介面
interface TimelineItem {
  title: string;
  description: string;
  date: string;
  icon?: React.ReactNode;
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
  const [relatedCases, setRelatedCases] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [structuredData, setStructuredData] = useState<string>('')
  const [activeTab, setActiveTab] = useState('overview')
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const id = params.id
    if (typeof id === 'string') {
      const foundCase = caseStudies.find(c => c.id === id)
      if (foundCase) {
        setCaseStudy(foundCase)
        
        // 處理解決方案
        if (foundCase.solutions) {
          foundCase.solutions = foundCase.solutions.map((solution: any, index) => {
            if (typeof solution === 'object' && solution.title && solution.description) {
              return solution as Solution;
            } else {
              return {
                title: typeof solution === 'string' ? solution : `解決方案 ${index + 1}`,
                description: generateSolutionDescription(index, foundCase.name)
              };
            }
          });
        }
        
        // 尋找相同類別的其他案例
        const related = caseStudies
          .filter(c => c.id !== id && c.category === foundCase.category)
          .slice(0, 3)
        setRelatedCases(related)
        
        // 使用共用函數設定結構化數據，保持一致性
        const schemaData = generateCaseStudyMetadata(foundCase)
        setStructuredData(JSON.stringify(schemaData))
        
        // 動態設置文檔標題
        document.title = `${foundCase.name} - ${foundCase.category}成功案例 | Aidea:Med 牙醫行銷專家`;
      }
    }
    setLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-6 font-display" style={{ color: colors.textDark }}>案例不存在</h1>
          <p className="mb-8" style={{ color: colors.textLight }}>抱歉，您尋找的案例不存在或已被移除。</p>
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
        {/* Hero Section */}
        <section className="relative bg-primary text-white py-32">
          <div className="container-custom relative z-10">
            {/* 返回按鈕 */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.6, 0.05, 0.01, 0.9] }}
              className="mb-12"
            >
              <Link href="/case">
                <span className="inline-flex items-center text-white hover:text-white/80 transition-colors group">
                  <ArrowLeftIcon className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
                  返回案例列表
                </span>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* 左側：內容 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }}
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  {caseStudy.name}
                </h1>
                <div className="flex gap-4 mb-8">
                  <span className="px-3 py-1.5 bg-white/10 rounded-full font-medium">
                    {caseStudy.category}
                  </span>
                  {caseStudy.publishedDate && (
                    <span className="px-3 py-1.5 bg-white/10 rounded-full font-medium">
                      發佈於 {formatDate(caseStudy.publishedDate)}
                    </span>
                  )}
                </div>
                <div className="text-xl md:text-2xl leading-relaxed mb-8 text-white/90">
                  {caseStudy.description}
                </div>
              </motion.div>

              {/* 右側：圖片 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.6, 0.05, 0.01, 0.9] }}
                className="relative aspect-video rounded-lg overflow-hidden shadow-xl"
              >
                {imageLoading && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                )}
                {!imageError ? (
                  <Image
                    src={caseStudy.image || '/images/case-placeholder.jpg'}
                    alt={caseStudy.name}
                    fill
                    className={`object-cover transition-opacity duration-500 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageError(true)}
                    priority
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
        <section className="py-32">
          <div className="container-custom">
            {/* 標籤頁切換 */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-white shadow-md">
                {['overview', 'solution', 'process'].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3 text-sm font-medium transition-all duration-300 ${
                      activeTab === tab 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    {tab === 'overview' && '專案概覽'}
                    {tab === 'solution' && '解決方案'}
                    {tab === 'process' && '執行流程'}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 內容區塊 */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* 案例圖片 */}
                  <div className="relative aspect-video mb-12 overflow-hidden shadow-lg">
                    {imageLoading && !imageError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin"></div>
                      </div>
                    )}
                    {!imageError ? (
                      <Image
                        src={caseStudy.image || '/images/case-placeholder.jpg'}
                        alt={caseStudy.name}
                        fill
                        className={`object-cover transition-opacity duration-500 ${
                          imageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageError(true)}
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-4xl">📷</span>
                      </div>
                    )}
                  </div>

                  {/* 成效指標 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {caseStudy.metrics.map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white p-6 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="text-3xl font-bold text-primary mb-2">
                          <CountUp
                            end={parseInt(metric.value)}
                            suffix={metric.value.replace(/[0-9]/g, '')}
                            duration={2}
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

              {activeTab === 'solution' && (
                <motion.div
                  key="solution"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {caseStudy.solutions?.map((solution, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white p-6 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start mb-4">
                        <div className="w-10 h-10 bg-primary text-white flex items-center justify-center mr-4">
                          <span className="text-xl font-bold">{index + 1}</span>
                        </div>
                        <h3 className="text-xl font-bold" style={{ color: colors.textDark }}>{solution.title}</h3>
                      </div>
                      <p className="text-gray-600 ml-14">
                        {solution.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'process' && (
                <motion.div
                  key="process"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="max-w-4xl mx-auto">
                    {timelineItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative pl-8 pb-12 last:pb-0"
                      >
                        {/* 時間軸線 */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-primary"></div>
                        
                        {/* 時間點 */}
                        <div className="absolute left-0 top-0 w-8 h-8 -translate-x-1/2 bg-primary text-white flex items-center justify-center">
                          {item.icon}
                        </div>
                        
                        {/* 內容 */}
                        <div className="bg-white p-6 shadow-md hover:shadow-lg transition-all duration-300">
                          <div className="text-sm text-primary font-medium mb-2">
                            {item.date}
                          </div>
                          <h3 className="text-xl font-bold mb-2" style={{ color: colors.textDark }}>
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
            </AnimatePresence>
          </div>
        </section>

        {/* 相關案例 */}
        {relatedCasesMemo.length > 0 && (
          <section className="py-32 bg-white">
            <div className="container-custom">
              <motion.h2 
                className="text-4xl font-bold text-center mb-12 font-display"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ color: colors.textDark }}
              >
                相關案例
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedCasesMemo.map((relatedCase, index) => (
                  <motion.div
                    key={relatedCase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Link href={`/case/${relatedCase.id}`} className="block p-6">
                      <div className="text-sm text-primary font-medium mb-2">
                        {relatedCase.category}
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: colors.textDark }}>
                        {relatedCase.name}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">
                        {relatedCase.description}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-32 bg-primary text-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
                想為您的診所打造成功案例？
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                立即預約免費諮詢，讓我們為您打造專屬的醫療行銷策略
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-medium hover:bg-gray-100 transition-all duration-300 text-lg"
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
    </>
  )
} 