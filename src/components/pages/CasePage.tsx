'use client'

import { useState, useEffect, memo, useMemo, Suspense, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'
import { CaseCard } from '@/components/case'
import { CaseStudy } from '@/types/case'
import { sortCasesByPriority } from '@/utils/case'
import { caseStudies } from '@/data/cases'
import Image from 'next/image'

// 優化後的Loading State
export const LoadingState = memo((): React.ReactElement => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-2xl shadow-sm animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-2xl"></div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                <div className="w-20 h-5 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20"
    >
      <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
        <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">暫無{category !== '全部案例' ? category : ''}案例</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-8">{message}</p>
      <Link
        href="/contact"
        className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition-colors"
      >
        聯繫我們了解更多
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </motion.div>
  )
}

// 簡潔專業的英雄區塊
const HeroSection = memo(() => {
  // 基於真實數據計算統計信息
  const totalCases = caseStudies.length
  const featuredCount = caseStudies.filter(c => c.featured).length
  const categories = Array.from(new Set(caseStudies.map(item => item.category))).length
  
  // 計算平均業績提升（基於真實案例數據）
  const avgGrowth = useMemo(() => {
    const growthMetrics = caseStudies.flatMap(cs => 
      cs.metrics.filter(m => m.label.includes('成長') || m.label.includes('提升'))
        .map(m => parseInt(m.value.replace(/[^\d]/g, '')) || 0)
    )
    return growthMetrics.length > 0 
      ? Math.round(growthMetrics.reduce((sum, val) => sum + val, 0) / growthMetrics.length)
      : 0
  }, [])

  const stats = [
    { 
      value: `${totalCases}`, 
      label: '成功案例', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: `${featuredCount}`, 
      label: '重點專案', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    },
    { 
      value: `${categories}`, 
      label: '服務領域', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      value: `${avgGrowth}%`, 
      label: '平均績效提升', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
  ]

  return (
    <section className="relative bg-white py-16 border-b border-gray-100">
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="mb-8">
            <Image
              src="/images/logo.png"
              alt="Aidea:Med 牙醫行銷專家"
              width={200}
              height={80}
              className="mx-auto"
              priority
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            成功案例實績
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed">
            專業的牙醫診所行銷顧問服務，協助診所建立品牌價值、優化營運流程、
            <br className="hidden md:block" />
            提升患者體驗，創造可持續的業務成長
          </p>
          
          {/* 真實數據統計 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100"
              >
                <div className="text-primary mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
})
HeroSection.displayName = 'HeroSection';

// 專業的分類過濾器
export interface CaseFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
  caseCounts: Record<string, number>;
}

const CaseFilter = memo(({ activeCategory, setActiveCategory, categories, caseCounts }: CaseFilterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-xl p-6 mb-12"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="lg:w-1/4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">服務分類</h3>
          <p className="text-gray-600 text-sm">選擇您感興趣的服務類型</p>
        </div>
        
        <div className="lg:w-3/4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory('全部案例')}
              className={`group relative px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === '全部案例'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="relative z-10">全部案例</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                activeCategory === '全部案例'
                  ? 'bg-white/20 text-white'
                  : 'bg-primary text-white'
              }`}>
                {caseStudies.length}
              </span>
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`group relative px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="relative z-10">{category}</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === category
                    ? 'bg-white/20 text-white'
                    : 'bg-primary text-white'
                }`}>
                  {caseCounts[category] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
})
CaseFilter.displayName = 'CaseFilter';

// 案例網格展示
const CaseGrid = memo(({ cases, viewMode }: { cases: CaseStudy[], viewMode: 'grid' | 'list' }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={
        viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          : "space-y-6"
      }
    >
      {cases.map((caseStudy, index) => (
        <motion.div
          key={caseStudy.id}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <CaseCard
            caseStudy={caseStudy}
            index={index}
            variant={caseStudy.featured ? 'featured' : 'standard'}
            priority={index < 6}
            isCompact={viewMode === 'list'}
          />
        </motion.div>
      ))}
    </motion.div>
  )
})
CaseGrid.displayName = 'CaseGrid';

// 簡潔的CTA區塊
const CTASection = memo(() => {
  return (
    <section className="bg-gray-50 py-16 mt-16">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            準備開始您的成功故事？
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            讓我們協助您的牙醫診所實現業務成長與品牌提升
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              立即諮詢
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              了解服務
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
})
CTASection.displayName = 'CTASection';


// 主要內容組件
const MainContent = memo(function MainContent() {
  const [activeCategory, setActiveCategory] = useState('全部案例')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // 生成分類和計數
  const categories = useMemo(() => {
    return Array.from(new Set(caseStudies.map(item => item.category)))
  }, [])
  
  const caseCounts = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = caseStudies.filter(item => item.category === category).length
      return acc
    }, {} as Record<string, number>)
  }, [categories])
  
  // 過濾和排序案例
  const filteredCases = useMemo(() => {
    let filtered = activeCategory === '全部案例' 
      ? caseStudies 
      : caseStudies.filter(item => item.category === activeCategory)
    
    return sortCasesByPriority(filtered)
  }, [activeCategory])
  
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-16">
        <CaseFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
          caseCounts={caseCounts}
        />
        
        {/* 視圖模式切換 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeCategory === '全部案例' ? '所有案例' : activeCategory}
            </h2>
            <p className="text-gray-600 mt-1">
              共 {filteredCases.length} 個{activeCategory === '全部案例' ? '' : activeCategory}案例
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 案例展示 */}
        {filteredCases.length > 0 ? (
          <CaseGrid cases={filteredCases} viewMode={viewMode} />
        ) : (
          <EmptyState 
            category={activeCategory}
            message="我們將持續更新更多優質案例，敬請期待。"
          />
        )}
      </div>
      
      <CTASection />
    </div>
  )
})

export default memo(function CasePage(): React.ReactElement {
  return (
    <Suspense fallback={<LoadingState />}>
      <MainContent />
    </Suspense>
  )
}) 