'use client'

import React, { useEffect, useState, useMemo, Suspense, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { caseStudies } from '@/data/cases'
import type { CaseStudy } from '@/types/case'
import { ArrowLeftIcon, ShareIcon, ChartBarIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import { staggerContainer, fadeInUp } from '@/utils/animations'
import { ErrorBoundary, CaseDetailErrorBoundary } from '@/components/common'
import { trackViewedCases, generateCaseStudyMetadata } from '@/utils/case'

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
    return Array.isArray(caseStudies) 
      ? caseStudies.find((c: CaseStudy) => c.id === id)
      : undefined
  }, [id])
  
  // 優化 useEffect 邏輯
  useEffect(() => {
    let isMounted = true
    
    const loadCaseData = async () => {
      try {
        if (!id) {
          console.error('案例 ID 不存在')
          if (isMounted) setLoading(false)
          return
        }
        
        if (!Array.isArray(caseStudies)) {
          console.error('案例資料未正確載入')
          if (isMounted) setLoading(false)
          return
        }
        
        if (!currentCase) {
          console.error(`找不到 ID 為 ${id} 的案例`)
          if (isMounted) setLoading(false)
          return
        }
        
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
            
            // 追蹤已瀏覽案例
            try {
              // 更新瀏覽記錄
              trackViewedCases(id)
            } catch (e) {
              console.error('Error tracking viewed case', e)
            }
          }
        })
      } catch (error) {
        console.error('載入案例資料時發生錯誤:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    loadCaseData()
    
    return () => {
      isMounted = false
    }
  }, [id, currentCase, caseStudies])
  
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
        // 如果原生分享失敗，顯示分享選單
        setShowShareMenu(true);
      }
    } else {
      // 如果不支援原生分享，顯示分享選單
      setShowShareMenu(true);
    }
  }, [caseStudy]);
  
  // 分享到社交媒體
  const shareToSocialMedia = useCallback((platform: 'facebook' | 'twitter' | 'linkedin' | 'line') => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(caseStudy?.name || '');
    const description = encodeURIComponent(caseStudy?.description || '');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'line':
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
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
    <CaseDetailErrorBoundary>
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
              <div className="flex items-center space-x-4 relative">
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
                
                {/* 社交媒體分享選單 */}
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-10 z-10 bg-white shadow-lg rounded-md border border-gray-100 p-2 w-48"
                    >
                      <div className="flex flex-col">
                        <button 
                          onClick={() => shareToSocialMedia('facebook')}
                          className="flex items-center p-2 hover:bg-gray-50 text-gray-700 text-sm"
                        >
                          <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                          </svg>
                          Facebook
                        </button>
                        <button 
                          onClick={() => shareToSocialMedia('twitter')}
                          className="flex items-center p-2 hover:bg-gray-50 text-gray-700 text-sm"
                        >
                          <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                          Twitter
                        </button>
                        <button 
                          onClick={() => shareToSocialMedia('linkedin')}
                          className="flex items-center p-2 hover:bg-gray-50 text-gray-700 text-sm"
                        >
                          <svg className="w-5 h-5 mr-3 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                          </svg>
                          LinkedIn
                        </button>
                        <button 
                          onClick={() => shareToSocialMedia('line')}
                          className="flex items-center p-2 hover:bg-gray-50 text-gray-700 text-sm"
                        >
                          <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.365 9.89c.50 0 .866-.37.866-.87 0-.5-.366-.87-.866-.87H8.668v-1.9c0-.47-.345-.85-.813-.85-.47 0-.815.38-.815.85v2.77c0 .47.345.85.815.85h11.51v.02zm-9.88 5.89h-4.03c-.47 0-.813-.38-.813-.85 0-.47.345-.85.814-.85h4.03c.47 0 .814.38.814.85s-.344.85-.814.85zM19.883 3H4.117C1.85 3 0 4.85 0 7.117v9.766C0 19.15 1.85 21 4.117 21h15.766C22.15 21 24 19.15 24 16.883V7.117C24 4.85 22.15 3 19.883 3zM4.117 4.637h15.766c1.368 0 2.48 1.11 2.48 2.48v9.766c0 1.37-1.112 2.48-2.48 2.48H4.117c-1.37 0-2.48-1.11-2.48-2.48V7.117c0-1.37 1.11-2.48 2.48-2.48z" />
                          </svg>
                          LINE
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              {/* 案例內容區域 */}
              {caseStudy.content && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">案例詳情</h2>
                  <div className="prose prose-lg max-w-none">
                    {caseStudy.content.split('# ').map((section, index) => {
                      if (!section) return null;
                      
                      // 處理標題和內容
                      const lines = section.split('\n');
                      const title = lines[0];
                      const content = lines.slice(1).join('\n');
                      
                      return (
                        <div key={index} className="mb-10">
                          {index > 0 && (
                            <h3 className="text-2xl font-bold text-primary mb-5 pb-2 border-b border-gray-100">
                              {title}
                            </h3>
                          )}
                          {content.split('\n\n').map((paragraph, pIndex) => (
                            <p key={pIndex} className="mb-5 text-gray-700 leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </motion.section>
              )}
              
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
                  <CaseGallery 
                    caseId={caseStudy.id} 
                    name={caseStudy.name}
                    layout="grid"
                    aspectRatio="4/3"
                    images={caseStudy.gallery}
                  />
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

      {/* 頁面底部推薦相關內容區塊 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
            <div className="w-10 h-1 bg-primary mr-4"></div>
            <h2 className="text-2xl font-bold">其他相關案例</h2>
            <div className="w-10 h-1 bg-primary ml-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 篩選出3個相同類別的其他案例 - 添加安全檢查防止錯誤 */}
            {Array.isArray(caseStudies) && caseStudies
              .filter((c: CaseStudy) => c.id !== id && c.category === caseStudy?.category)
              .slice(0, 3)
              .map((relatedCase: CaseStudy) => (
                <Link
                  key={relatedCase.id}
                  href={`/case/${relatedCase.id}`}
                  prefetch={true}
                  className="group block bg-white border border-gray-100 hover:border-primary/30 transition-all duration-300"
                >
                  {/* 圖片容器 */}
                  <div className="relative py-8 overflow-hidden bg-gray-50 border-b border-gray-100 flex items-center justify-center">
                    <div className="relative h-28 w-full mx-auto px-10 flex items-center justify-center">
                      <img
                        src={relatedCase.image}
                        alt={relatedCase.name}
                        className="max-h-28 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  
                  {/* 內容區 */}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block text-xs font-medium px-3 py-1 border border-primary/20 text-primary">
                        {relatedCase.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {relatedCase.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                      {relatedCase.description}
                    </p>
                    
                    {/* 閱讀更多 - 採用扁平化設計 */}
                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      <div className="text-primary text-sm flex items-center font-medium group-hover:translate-x-1 transition-transform duration-300">
                        閱讀更多案例
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            
            {/* 如果同類案例不足3個，則添加其他類別的案例補足 - 添加安全檢查防止錯誤 */}
            {Array.isArray(caseStudies) && caseStudies
              .filter((c: CaseStudy) => c.id !== id && c.category !== caseStudy?.category)
              .slice(0, 3 - (Array.isArray(caseStudies) ? caseStudies.filter((c: CaseStudy) => c.id !== id && c.category === caseStudy?.category).length : 0))
              .map((relatedCase: CaseStudy) => (
                <Link
                  key={relatedCase.id}
                  href={`/case/${relatedCase.id}`}
                  prefetch={true}
                  className="group block bg-white border border-gray-100 hover:border-primary/30 transition-all duration-300"
                >
                  {/* 圖片容器 */}
                  <div className="relative py-8 overflow-hidden bg-gray-50 border-b border-gray-100 flex items-center justify-center">
                    <div className="relative h-28 w-full mx-auto px-10 flex items-center justify-center">
                      <img
                        src={relatedCase.image}
                        alt={relatedCase.name}
                        className="max-h-28 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  
                  {/* 內容區 */}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block text-xs font-medium px-3 py-1 border border-primary/20 text-primary">
                        {relatedCase.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {relatedCase.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                      {relatedCase.description}
                    </p>
                    
                    {/* 閱讀更多 - 採用扁平化設計 */}
                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      <div className="text-primary text-sm flex items-center font-medium group-hover:translate-x-1 transition-transform duration-300">
                        閱讀更多案例
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/case"
              prefetch={true}
              className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-colors duration-300"
            >
              查看所有案例
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </CaseDetailErrorBoundary>
  );
}