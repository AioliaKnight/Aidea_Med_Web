'use client'

import React, { useEffect, useState, useMemo, Suspense, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { caseStudies, generateCaseStudyMetadata } from '@/components/pages/CasePage'
import type { CaseStudy } from '@/types/case'
import { ArrowLeftIcon, ShareIcon, ChartBarIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import { staggerContainer, fadeInUp } from '@/utils/animations'
import { ErrorBoundary } from '@/components/common'

// 時間軸和案例詳情組件
const CaseTimeline = React.lazy(() => import('@/components/case/CaseTimeline'))
const CaseGallery = React.lazy(() => import('@/components/case/CaseGallery'))
const CaseTestimonials = React.lazy(() => import('@/components/case/CaseTestimonials'))
const CaseRelated = React.lazy(() => import('@/components/case/CaseRelated'))

// 詳情頁骨架屏
function CaseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-32 bg-gray-200 animate-pulse mb-6 rounded" />
          <div className="h-12 w-3/4 bg-gray-200 animate-pulse mb-8 rounded" />
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="aspect-[16/9] w-full bg-gray-300 animate-pulse rounded mb-10" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="h-8 w-48 bg-gray-200 animate-pulse mb-6 rounded" />
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="mb-6">
                <div className="h-6 w-full bg-gray-200 animate-pulse mb-4 rounded" />
                <div className="h-4 w-full bg-gray-200 animate-pulse mb-2 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="h-8 w-32 bg-gray-200 animate-pulse mb-6 rounded" />
            <div className="grid grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded">
                  <div className="h-6 w-16 bg-gray-200 animate-pulse mb-2 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 錯誤處理組件
function CaseDetailError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          載入案例詳情時發生錯誤
        </h2>
        <p className="text-gray-600 mb-8">
          {error.message || '請稍後再試或聯繫我們尋求協助'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          重新載入
        </button>
      </div>
    </div>
  )
}

// 案例詳情頁面
export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  
  // 使用 useMemo 緩存案例資料
  const currentCase = useMemo(() => {
    return caseStudies.find(c => c.id === id) || null
  }, [id])
  
  // 優化 useEffect 邏輯
  useEffect(() => {
    let isMounted = true
    
    const loadCaseData = async () => {
      if (id && currentCase) {
        try {
          // 使用 Promise.resolve().then 確保在微任務隊列中執行
          await Promise.resolve().then(() => {
            if (isMounted) {
              setCaseStudy(currentCase)
              setLoading(false)
              
              // 從 localStorage 中讀取案例收藏狀態
              try {
                const likedCases = JSON.parse(localStorage.getItem('likedCases') || '[]')
                setIsLiked(likedCases.includes(id))
              } catch (e) {
                console.error('Error reading liked cases from localStorage', e)
              }
            }
          })
        } catch (error) {
          console.error('Error loading case data:', error)
          if (isMounted) {
            setLoading(false)
          }
        }
      }
    }
    
    loadCaseData()
    
    return () => {
      isMounted = false
    }
  }, [id, currentCase])
  
  // 優化圖片錯誤處理
  const handleImageError = useCallback((url: string) => {
    setImageErrors(prev => ({
      ...prev,
      [url]: true
    }));
  }, []);
  
  // 優化圖片URL獲取
  const getImageUrl = useCallback((url: string) => {
    return imageErrors[url] ? '/images/testimonials/default-avatar.jpg' : url;
  }, [imageErrors]);
  
  // 優化分享功能
  const handleShare = useCallback(async () => {
    setShowShareMenu(prev => !prev);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: caseStudy?.name || '案例分享',
          text: caseStudy?.description || '',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    }
  }, [caseStudy]);
  
  // 優化收藏功能
  const handleLike = useCallback(() => {
    setIsLiked(prev => {
      const newState = !prev;
      try {
        const likedCases = JSON.parse(localStorage.getItem('likedCases') || '[]');
        const updatedCases = newState 
          ? [...likedCases, id]
          : likedCases.filter((caseId: string) => caseId !== id);
        
        localStorage.setItem('likedCases', JSON.stringify(updatedCases));
      } catch (e) {
        console.error('Error updating liked cases in localStorage', e);
      }
      return newState;
    });
  }, [id]);
  
  // 當找不到案例或正在加載時顯示骨架屏
  if (loading) {
    return <CaseDetailSkeleton />;
  }
  
  if (!caseStudy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">找不到案例</h2>
          <p className="text-xl text-gray-600 mb-8">抱歉，我們找不到您要查看的案例。</p>
          <Link 
            href="/case" 
            prefetch={true}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark transition-colors duration-300"
          >
            返回案例列表
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航區域 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6">
            {/* 返回按鈕 */}
            <Link 
              href="/case" 
              prefetch={true}
              className="flex items-center text-gray-600 hover:text-primary transition-colors duration-300 mb-4 sm:mb-0"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              返回案例列表
            </Link>
            
            {/* 操作按鈕 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-300"
                aria-label={isLiked ? '取消收藏' : '收藏案例'}
              >
                {isLiked ? (
                  <HeartIconSolid className="w-5 h-5 text-primary" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span className="ml-1 text-sm">{isLiked ? '已收藏' : '收藏'}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-300"
                aria-label="分享案例"
              >
                <ShareIcon className="w-5 h-5" />
                <span className="ml-1 text-sm">分享</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 案例標題、圖片與描述區 */}
      <div className="bg-white border-b border-gray-100 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* 左側：標題與描述 */}
            <div className="md:col-span-7 lg:col-span-8">
              {/* 案例標題和標籤 */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm">
                    {caseStudy.category}
                  </span>
                  {caseStudy.featured && (
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-sm">
                      精選案例
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{caseStudy.name}</h1>
              </div>
              
              {/* 案例描述 */}
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {caseStudy.description}
              </p>
            
              {/* 關鍵數據 */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {caseStudy.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 border border-gray-100"
                  >
                    <div className="text-2xl font-bold text-primary mb-1">
                      <CountUp
                        start={0}
                        end={parseInt(metric.value)}
                        duration={2}
                        suffix={metric.value.includes('%') ? '%' : ''}
                      />
                    </div>
                    <div className="text-sm text-gray-500">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 右側：客戶圖片 */}
            <div className="md:col-span-5 lg:col-span-4">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={caseStudy.image}
                  alt={caseStudy.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/case-placeholder.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主要內容區域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* 解決方案 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">解決方案</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {caseStudy.solutions.map((solution, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="flex flex-col h-full p-6 border border-gray-100 hover:border-primary/20 transition-colors duration-300">
                      {/* 圖標 */}
                      <div className="flex-shrink-0 mb-4">
                        <div className="w-12 h-12 flex items-center justify-center text-primary">
                          {index === 0 && (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          )}
                          {index === 1 && (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                          {index === 2 && (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          )}
                          {index === 3 && (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {/* 內容 */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                          {typeof solution === 'string' ? solution : solution.title}
                        </h3>
                        {typeof solution !== 'string' && (
                          <p className="text-gray-600 leading-relaxed">
                            {solution.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
            
            {/* 時間軸區塊 */}
            {caseStudy.timeline && caseStudy.timeline.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white rounded-xl shadow-sm p-8"
              >
                <motion.div 
                  variants={fadeInUp}
                  className="text-center mb-12"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    專案執行歷程
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    了解我們如何協助診所完成品牌轉型，實現業務成長目標
                  </p>
                </motion.div>
                
                <CaseTimeline items={caseStudy.timeline} />
              </motion.div>
            )}
            
            {/* 案例圖片 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">案例圖片</h2>
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
                <CaseGallery caseId={caseStudy.id} name={caseStudy.name} />
              </Suspense>
            </motion.section>
            
            {/* 客戶見證 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">客戶見證</h2>
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
                <CaseTestimonials caseStudy={caseStudy} />
              </Suspense>
            </motion.section>
            
            {/* 故事性 CTA 區塊 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-primary p-8 text-white relative"
            >
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-3xl font-bold mb-6">你也想成為我們的成功案例嗎？</h2>
                
                <p className="text-white text-lg mb-8 leading-relaxed">
                  每個成功的案例背後，都是從一個簡單的諮詢開始。{caseStudy.name} 曾面臨相似的挑戰，
                  而今天已成為行業標竿。
                  <span className="block mt-4 font-semibold">您的診所，是下一個成功故事。</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contact"
                    prefetch={true}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary text-base font-semibold rounded-none hover:bg-gray-100 transition-colors duration-300"
                  >
                    免費諮詢 30 分鐘
                    <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  
                  <Link
                    href="/service"
                    prefetch={true}
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white text-base font-semibold rounded-none hover:bg-white/10 transition-colors duration-300"
                  >
                    了解服務方案
                  </Link>
                </div>
                
                <div className="mt-8 p-4 text-white text-sm border border-white/20">
                  <span className="font-bold">實績數據：</span> 我們已幫助超過 50+ 家牙醫診所提升品牌價值與營收，平均成長 35% 以上
                </div>
              </div>
            </motion.section>
          </div>
          
          {/* 右側邊欄 */}
          <div className="lg:col-span-1 space-y-8">
            {/* 案例摘要 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">案例摘要</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">發布日期</span>
                  <p className="text-gray-900">
                    {new Date(caseStudy.publishedDate || '').toLocaleDateString('zh-TW')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">更新日期</span>
                  <p className="text-gray-900">
                    {new Date(caseStudy.updatedDate || '').toLocaleDateString('zh-TW')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">案例類別</span>
                  <p className="text-gray-900">{caseStudy.category}</p>
                </div>
              </div>
            </motion.div>
            
            {/* 相關案例 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">相關案例</h3>
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
                <CaseRelated currentId={caseStudy.id} category={caseStudy.category} />
              </Suspense>
            </motion.div>
            
            {/* 成功轉型 CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-black mb-3">成為下一個成功故事</h3>
              <p className="text-gray-800 mb-6 text-sm">
                診所經營遇到瓶頸？品牌形象需要提升？患者轉換率不理想？
              </p>
              
              <div className="space-y-3 mb-6 relative z-10">
                <div className="flex items-center text-sm">
                  <div className="w-4 h-4 bg-primary mr-3 flex-shrink-0"></div>
                  <span className="font-medium">專屬診所行銷策略</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-4 h-4 bg-primary mr-3 flex-shrink-0"></div>
                  <span className="font-medium">數位轉型全方位服務</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-4 h-4 bg-primary mr-3 flex-shrink-0"></div>
                  <span className="font-medium">患者體驗與轉換提升</span>
                </div>
              </div>
              
              <Link
                href="/contact?ref=case_detail"
                prefetch={true}
                className="inline-flex items-center justify-center w-full px-4 py-3 text-white bg-primary hover:bg-primary-dark transition-colors duration-300 text-sm font-medium"
              >
                預約免費診斷
              </Link>
            </motion.div>
            
            {/* 聯絡我們 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">聯絡我們</h3>
              <p className="text-gray-700 mb-6 text-sm">
                想了解更多關於我們的服務嗎？
                立即聯繫我們，專業顧問將在 24 小時內回覆您。
              </p>
              <Link
                href="/contact"
                prefetch={true}
                className="inline-flex items-center justify-center w-full px-4 py-3 text-white bg-primary hover:bg-primary-dark transition-colors duration-300 text-sm font-medium"
              >
                立即諮詢
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 