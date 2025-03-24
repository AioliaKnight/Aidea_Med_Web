'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Script from 'next/script'
import { CaseImage } from '@/components/case/CaseImage'
import { CaseCard } from '@/components/case/CaseCard'
import { getCaseById, getRelatedCases, generateTimeline } from '@/content/cases'
import { CaseStudy } from '@/content/cases/types'

// 格式化日期函數
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('zh-TW', options);
}

// 生成結構化數據函數
function generateStructuredData(caseStudy: CaseStudy): any {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aidea-med.com';
  const imageUrl = caseStudy.image || `${baseUrl}/images/og-case.jpg`;
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${caseStudy.name} - ${caseStudy.category} 成功案例`,
    "description": caseStudy.description,
    "image": imageUrl,
    "datePublished": caseStudy.publishedDate || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Aidea:Med"
    }
  };
}

export default function CaseDetail() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [structuredData, setStructuredData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // 獲取案例數據
  useEffect(() => {
    if (params?.id) {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const foundCase = getCaseById(id);
        
        if (foundCase) {
          setCaseStudy(foundCase);
          setStructuredData(generateStructuredData(foundCase));
          
          // 更新頁面標題
          document.title = `${foundCase.name} - ${foundCase.category} 案例 | Aidea:Med`;
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching case study:', error);
        setLoading(false);
      }
    }
  }, [params]);
  
  // 生成相關案例
  const relatedCases = useMemo(() => {
    if (!caseStudy) return [];
    return getRelatedCases(caseStudy, 3);
  }, [caseStudy]);
  
  // 生成時間軸項目
  const timelineItems = useMemo(() => {
    if (!caseStudy) return [];
    return generateTimeline(caseStudy);
  }, [caseStudy]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!caseStudy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">案例不存在</h1>
        <p className="text-gray-600 mb-8">找不到您請求的案例資料</p>
        <Link href="/case" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
          返回案例列表
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* 結構化數據 */}
      {structuredData && (
        <Script id="case-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
      
      {/* 英雄區塊 */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-blue-900">
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                {caseStudy.name}
              </h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1.5 bg-white/20 rounded-full font-medium text-white">
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

            {/* 右側：圖片 - 使用優化後的圖片組件 */}
            <CaseImage 
              caseStudy={caseStudy}
              priority={true}
              aspectRatio="aspect-video"
              containerClassName="shadow-xl rounded-lg"
              animate={true}
            />
          </div>
        </div>
      </section>

      {/* 內容區域 */}
      <section className="py-20">
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
                  whileTap={{ scale: 0.97 }}
                >
                  {tab === 'overview' && '概覽'}
                  {tab === 'solution' && '解決方案'}
                  {tab === 'process' && '專案流程'}
                </motion.button>
              ))}
            </div>
          </div>

          {/* 標籤頁內容 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 概覽標籤 */}
              {activeTab === 'overview' && (
                <div className="grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-8">
                    <h2 className="text-2xl font-bold mb-6">案例概覽</h2>
                    <div className="prose prose-lg max-w-none">
                      <p>
                        {caseStudy.name}是一家位於{caseStudy.category}地區的專業牙醫診所，
                        面臨品牌形象老舊、市場競爭激烈等挑戰。診所尋求突破，希望能夠吸引更多新患、
                        提升服務品質，並建立現代化的品牌形象。
                      </p>
                      <p>
                        我們為{caseStudy.name}設計了全方位的品牌重塑與數位行銷策略，
                        從品牌識別、診所環境到線上形象，進行全面優化，創造一致且專業的品牌體驗。
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-4">
                    <h3 className="text-xl font-bold mb-6">成效指標</h3>
                    <div className="grid gap-4">
                      {caseStudy.metrics.map((metric, index) => (
                        <div key={index} className="bg-gray-50 p-5 rounded-lg">
                          <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                          <div className="text-gray-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 解決方案標籤 */}
              {activeTab === 'solution' && (
                <div>
                  <h2 className="text-2xl font-bold mb-8">我們的解決方案</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {caseStudy.solutions && caseStudy.solutions.map((solution, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white shadow-md p-6 rounded-lg"
                      >
                        <h3 className="text-xl font-bold mb-4">{solution.title}</h3>
                        <p className="text-gray-600">{solution.description}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  {caseStudy.testimonial && (
                    <div className="mt-12 p-8 bg-gray-50 rounded-lg">
                      <div className="flex flex-col md:flex-row items-start md:items-center">
                        <div className="flex-grow">
                          <div className="text-lg italic text-gray-600 mb-4">
                            "{caseStudy.testimonial.content}"
                          </div>
                          <div>
                            <div className="font-bold">{caseStudy.testimonial.author}</div>
                            <div className="text-sm text-gray-500">{caseStudy.testimonial.title}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 專案流程標籤 */}
              {activeTab === 'process' && (
                <div>
                  <h2 className="text-2xl font-bold mb-8">專案執行流程</h2>
                  
                  <div className="space-y-16">
                    {timelineItems.map((item, index) => (
                      <div key={index} className="relative">
                        <div className="flex">
                          <div className="flex flex-col items-center mr-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-2xl">
                              {item.icon}
                            </div>
                            {index < timelineItems.length - 1 && (
                              <div className="w-px h-16 bg-gray-200 mt-4"></div>
                            )}
                          </div>
                          
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="text-xl font-bold">{item.title}</h3>
                              <span className="ml-4 px-3 py-1 bg-gray-100 text-sm rounded-full">
                                {item.date}
                              </span>
                            </div>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 相關案例 */}
      {relatedCases.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-8">相關案例</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedCases.map((relatedCase, index) => (
                <CaseCard key={relatedCase.id} caseStudy={relatedCase} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 