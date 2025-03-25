'use client'

import React, { useEffect, useState, useMemo, Suspense } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { caseStudies, CaseStudy, generateCaseStudyMetadata } from '@/components/pages/CasePage'
import { ArrowLeftIcon, ShareIcon, ChartBarIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'

// 時間軸和案例詳情組件
const CaseTimeline = React.lazy(() => import('@/components/case/CaseTimeline'));
const CaseGallery = React.lazy(() => import('@/components/case/CaseGallery'));
const CaseTestimonials = React.lazy(() => import('@/components/case/CaseTestimonials'));
const CaseRelated = React.lazy(() => import('@/components/case/CaseRelated'));

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

// 案例詳情頁
export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('solution');
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // 找到當前案例和相關案例
  useEffect(() => {
    if (id) {
      // 將查找案例的邏輯包裝在 setTimeout 中，以確保在客戶端渲染期間執行
      const timer = setTimeout(() => {
        const foundCase = caseStudies.find(c => c.id === id) || null;
        setCaseStudy(foundCase);
        setLoading(false);
        
        // 從 localStorage 中讀取案例收藏狀態
        try {
          const likedCases = JSON.parse(localStorage.getItem('likedCases') || '[]');
          setIsLiked(likedCases.includes(id));
        } catch (e) {
          console.error('Error reading liked cases from localStorage', e);
        }
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [id]);
  
  // 分享功能
  const handleShare = async () => {
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
  };
  
  // 收藏功能
  const handleLike = () => {
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
  };
  
  // 標籤切換
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
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
      <div className="bg-white pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <Link 
              href="/case" 
              prefetch={true}
              className="flex items-center text-gray-600 hover:text-primary transition-colors duration-300"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              返回案例列表
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center text-gray-600 hover:text-primary transition-colors duration-300"
                aria-label={isLiked ? '取消收藏' : '收藏案例'}
              >
                {isLiked ? (
                  <HeartIconSolid className="w-5 h-5 text-primary" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span className="ml-1 hidden sm:inline text-sm">{isLiked ? '已收藏' : '收藏'}</span>
              </button>
              
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center text-gray-600 hover:text-primary transition-colors duration-300"
                  aria-label="分享案例"
                >
                  <ShareIcon className="w-5 h-5" />
                  <span className="ml-1 hidden sm:inline text-sm">分享</span>
                </button>
                
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10"
                    >
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          setShowShareMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        複製連結
                      </button>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowShareMenu(false)}
                      >
                        Facebook
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowShareMenu(false)}
                      >
                        LinkedIn
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* 案例關鍵資訊卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* 左側內容：標題和標籤 */}
            <div className="lg:col-span-3 flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{caseStudy.name}</h1>
              <p className="text-gray-600 mb-4 line-clamp-2">{caseStudy.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                  {caseStudy.category}
                </span>
                {caseStudy.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-white">
                    精選案例
                  </span>
                )}
                {caseStudy.publishedDate && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {new Date(caseStudy.publishedDate).toLocaleDateString('zh-TW')}
                  </span>
                )}
              </div>
            </div>
            
            {/* 右側內容：關鍵指標 */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-3">
                {caseStudy.metrics.slice(0, 4).map((metric, index) => (
                  <div key={index} className="flex flex-col justify-center bg-gray-50 p-3 rounded-md border-l-2 border-primary">
                    <span className="text-xl font-bold text-primary">
                      {metric.value}
                    </span>
                    <span className="text-xs text-gray-600">{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 主要圖片展示 */}
          <div className="relative aspect-[21/9] w-full mb-6 overflow-hidden rounded-lg shadow-sm">
            <Image
              src={caseStudy.image || `/cases/${caseStudy.id}.jpg`}
              alt={caseStudy.name}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* 案例內容區域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左側主要內容區 */}
          <div className="lg:col-span-8 space-y-8">
            {/* 標籤切換按鈕 - 改進樣式與互動體驗 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                {['solution', 'process', 'results'].map(tab => (
                  <button
                    key={tab}
                    className={`flex-1 py-4 px-6 font-medium text-sm transition-all duration-300 ${
                      activeTab === tab 
                        ? 'text-primary border-b-2 border-primary bg-primary/5' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleTabChange(tab)}
                  >
                    {tab === 'solution' && '解決方案'}
                    {tab === 'process' && '執行過程'}
                    {tab === 'results' && '成效分析'}
                  </button>
                ))}
              </div>
            
              {/* 標籤內容容器 - 統一外觀 */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* 解決方案內容 */}
                  {activeTab === 'solution' && (
                    <motion.div
                      key="solution"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="w-1 h-5 bg-primary rounded-full mr-2"></span>
                        解決方案
                      </h2>
                      
                      <div className="prose max-w-none prose-p:text-gray-600 prose-p:my-4">
                        <p className="text-gray-600">{caseStudy.description}</p>
                      </div>
                      
                      <div className="space-y-4 mt-6">
                        {Array.isArray(caseStudy.solutions) && caseStudy.solutions.map((solution, index) => (
                          <div key={index} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                              <span className="flex items-center justify-center bg-primary/10 text-primary w-6 h-6 rounded-full text-sm mr-2">{index + 1}</span>
                              {typeof solution === 'string' ? `解決方案 ${index + 1}` : solution.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {typeof solution === 'string' ? solution : solution.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* 執行過程內容 */}
                  {activeTab === 'process' && (
                    <motion.div
                      key="process"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="w-1 h-5 bg-primary rounded-full mr-2"></span>
                        執行過程
                      </h2>
                      
                      <Suspense fallback={<div className="h-60 bg-gray-100 animate-pulse rounded-lg" />}>
                        <CaseTimeline caseStudy={caseStudy} />
                      </Suspense>
                      
                      <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <span className="w-1 h-4 bg-gray-300 rounded-full mr-2"></span>
                          案例圖片展示
                        </h3>
                        
                        <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg" />}>
                          <CaseGallery caseId={caseStudy.id} name={caseStudy.name} />
                        </Suspense>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* 成效分析內容 */}
                  {activeTab === 'results' && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="w-1 h-5 bg-primary rounded-full mr-2"></span>
                        成效分析
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {caseStudy.metrics.map((metric, index) => (
                          <div key={index} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">{metric.label}</span>
                              <ChartBarIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="text-2xl font-bold text-primary flex items-baseline">
                              <CountUp 
                                end={parseFloat(metric.value.replace(/[^0-9.]/g, ''))} 
                                duration={2.5}
                                separator=","
                                decimals={metric.value.includes('.') ? 2 : 0}
                                enableScrollSpy={false}
                              />
                              <span className="ml-1">{metric.value.replace(/[0-9.]/g, '')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="w-1 h-4 bg-gray-300 rounded-full mr-2"></span>
                        客戶見證
                      </h3>
                      
                      <Suspense fallback={<div className="h-60 bg-gray-100 animate-pulse rounded-lg" />}>
                        <CaseTestimonials caseStudy={caseStudy} />
                      </Suspense>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* 右側側邊欄 */}
          <div className="lg:col-span-4 space-y-6">
            {/* 案例概要卡片 */}
            <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 py-3 px-4 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">案例概要</h3>
              </div>
              <div className="p-4">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">類別</dt>
                    <dd className="mt-1 text-sm text-gray-900">{caseStudy.category}</dd>
                  </div>
                  {caseStudy.publishedDate && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">發佈日期</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(caseStudy.publishedDate).toLocaleDateString('zh-TW')}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">解決方案數量</dt>
                    <dd className="mt-1 text-sm text-gray-900">{caseStudy.solutions.length} 項</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* 相關案例推薦 */}
            <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 py-3 px-4 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">相關案例</h3>
              </div>
              <div className="p-4">
                <Suspense fallback={<div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
                  ))}
                </div>}>
                  <CaseRelated currentId={caseStudy.id} category={caseStudy.category} />
                </Suspense>
              </div>
            </div>
            
            {/* 聯絡我們卡片 */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">需要類似的解決方案？</h3>
              <p className="text-sm text-gray-600 mb-4">我們可以為您的診所量身打造專屬策略</p>
              <Link
                href="/contact"
                prefetch={true}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                立即諮詢
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 