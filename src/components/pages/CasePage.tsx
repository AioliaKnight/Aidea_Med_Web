'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Script from 'next/script'
import { Metadata } from 'next'

// 定義案例資料類型
export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  name: string;
  category: string;
  description: string;
  metrics: CaseMetric[];
  solutions?: string[];
  featured?: boolean;
  color?: string;
  image?: string;
  publishedDate?: string;
  updatedDate?: string;
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
    id: 'smile-dental',
    name: '微笑牙醫診所',
    category: '品牌重塑',
    description: '從傳統診所到數位化品牌的成功轉型，透過整合性行銷策略，在短短 6 個月內實現：',
    metrics: [
      { value: '200%', label: '新患預約成長' },
      { value: '5萬+', label: '社群追蹤者' },
      { value: '300%', label: '品牌知名度提升' },
      { value: '50%', label: '每月穩定回診率成長' }
    ],
    color: '#4A6CF7', // 主題藍色
    publishedDate: '2023-08-15T00:00:00Z',
    updatedDate: '2023-11-20T00:00:00Z'
  },
  {
    id: 'kongde-dental',
    name: '康德牙醫診所',
    category: '社群經營',
    description: '透過專業的社群媒體經營與內容策略，3 個月內實現：',
    metrics: [
      { value: '180%', label: '預約轉換率' },
      { value: '3萬+', label: '社群互動' }
    ],
    solutions: [
      '建立專業醫療內容庫',
      '優化社群互動策略',
      '提升品牌知名度'
    ],
    color: '#FF7A50', // 橘色系
    publishedDate: '2023-07-10T00:00:00Z',
    updatedDate: '2023-10-05T00:00:00Z'
  },
  {
    id: 'hengmei-dental',
    name: '恆美牙醫診所',
    category: '品牌策略',
    description: '全方位品牌升級與數位轉型，6 個月內達成：',
    metrics: [
      { value: '250%', label: '營收成長' },
      { value: '90%', label: '客戶滿意度' }
    ],
    solutions: [
      '品牌識別系統重塑',
      '服務流程優化',
      '數位預約系統建置'
    ],
    color: '#7E57C2', // 紫色系
    publishedDate: '2023-06-20T00:00:00Z',
    updatedDate: '2023-09-15T00:00:00Z'
  },
  {
    id: 'yadesi-dental',
    name: '雅德思牙醫診所',
    category: '整合行銷',
    description: '全方位的數位整合行銷策略，4 個月內達到：',
    metrics: [
      { value: '320%', label: '新患數量' },
      { value: '210%', label: '品牌曝光' }
    ],
    solutions: [
      '多平台數位廣告整合',
      '專業形象重塑',
      '病患轉介計畫實施'
    ],
    color: '#26A69A', // 綠松石色
    featured: true,
    publishedDate: '2023-05-05T00:00:00Z',
    updatedDate: '2023-08-30T00:00:00Z'
  },
  {
    id: 'yuntian-dental',
    name: '雲天牙醫診所',
    category: '數位轉型',
    description: '完整的診所數位轉型與線上服務體驗提升，5 個月內達到：',
    metrics: [
      { value: '280%', label: '線上預約率' },
      { value: '45%', label: '營運成本降低' }
    ],
    solutions: [
      '智能預約系統導入',
      '線上客戶關係管理',
      '行動支付整合'
    ],
    color: '#EC407A', // 粉紅色
    publishedDate: '2023-04-15T00:00:00Z',
    updatedDate: '2023-07-10T00:00:00Z'
  }
]

// 使用品牌主要配色系統
const brandColors = {
  primary: 'rgba(255, 0, 0, 0.9)', // 品牌紅色
  secondary: 'rgba(0, 0, 0, 0.9)', // 品牌黑色
  light: 'rgba(255, 255, 255, 1)', // 品牌白色
  lightGray: 'rgba(245, 245, 245, 1)' // 淺灰色用於背景
};

// 動畫變體定義
export const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  },
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  itemFadeIn: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }
};

// 載入狀態組件
export const LoadingState = (): JSX.Element => {
  return (
    <div className="py-20 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full border-l-2 border-t-2 border-primary animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium">載入案例資料中...</p>
    </div>
  );
};

// 空結果組件
export interface EmptyStateProps {
  category: string;
}

export const EmptyState = ({ category }: EmptyStateProps): JSX.Element => {
  return (
    <div className="py-16 flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M12 14a3 3 0 100-6 3 3 0 000 6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-700 mb-2">尚無{category}案例</h3>
      <p className="text-gray-500 max-w-md text-center">目前沒有符合此類別的案例，請選擇其他類別或稍後再查看。</p>
    </div>
  );
};

// 篩選組件 - 改進導覽與無障礙體驗
export interface CaseFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
}

export const CaseFilter = ({ activeCategory, setActiveCategory, categories }: CaseFilterProps): JSX.Element => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-4 mb-20 justify-center"
      aria-label="案例類別篩選"
      role="navigation"
    >
      {categories.map((category: string, index: number) => (
        <motion.button 
          key={category}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 * index }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveCategory(category)}
          aria-pressed={activeCategory === category}
          aria-label={`篩選${category}類別案例`}
          className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 border ${
            activeCategory === category 
              ? 'bg-primary text-white border-primary shadow-sm' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
          }`}
        >
          {category}
        </motion.button>
      ))}
    </motion.nav>
  );
};

// 數字動畫組件
export interface AnimatedNumberProps {
  value: string;
  className?: string;
}

export const AnimatedNumber = ({ value, className }: AnimatedNumberProps): JSX.Element => {
  // 過濾出數字部分，預處理加號和百分比
  const numericPart = value.replace(/[^0-9.]/g, '');
  const hasPlusSign = value.includes('+');
  const hasPercentage = value.includes('%');
  
  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {numericPart}
      {hasPercentage && <span>%</span>}
      {hasPlusSign && <span>+</span>}
    </motion.span>
  );
};

// 特色案例組件 - 優化結構與無障礙體驗
export interface FeaturedCaseProps {
  caseStudy: CaseStudy;
}

export const FeaturedCase = ({ caseStudy }: FeaturedCaseProps): JSX.Element => {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-24"
      role="article"
      aria-labelledby={`featured-case-${caseStudy.id}`}
    >
      <div className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-video lg:aspect-auto lg:h-full overflow-hidden lg:col-span-7"
            style={{ background: brandColors.primary }}
          >
            {/* 扁平設計風格的幾何圖形背景 */}
            <div className="absolute inset-0">
              <div className="absolute top-[10%] right-[5%] w-24 h-24 opacity-20 bg-white rounded-none"></div>
              <div className="absolute bottom-[15%] left-[10%] w-40 h-10 opacity-10 bg-black rounded-none"></div>
              <div className="absolute top-[40%] right-[30%] w-16 h-16 opacity-15 bg-white rounded-none"></div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <AnimatedNumber 
                  value={caseStudy.metrics[0].value}
                  className="text-7xl font-bold mb-2 font-gothic"
                />
                <div className="text-xl font-tw">{caseStudy.metrics[0].label}</div>
              </div>
            </div>
          </motion.div>
          <div className="p-8 lg:p-12 lg:col-span-5">
            <div className="flex items-center mb-6">
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-primary h-6 w-1 mr-3"
              ></motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-gray-700 text-sm font-medium"
              >
                {caseStudy.category}
              </motion.div>
            </div>
            <motion.h2 
              id={`featured-case-${caseStudy.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold mb-6 font-gothic"
            >
              {caseStudy.name}
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="space-y-4 text-gray-600 mb-8"
            >
              <p>{caseStudy.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {caseStudy.metrics.slice(1, 3).map((metric: CaseMetric, index: number) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                    className="bg-gray-50 p-4 border-l-2 border-primary"
                  >
                    <AnimatedNumber 
                      value={metric.value}
                      className="text-2xl font-bold font-gothic text-primary"
                    />
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <Link href={`/case/${caseStudy.id}`} aria-label={`查看${caseStudy.name}的完整案例細節`}>
                <span className="inline-flex items-center px-8 py-3 bg-primary text-white font-medium group transition-all duration-300 hover:bg-primary/90">
                  查看完整案例
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// 案例卡片組件 - 優化結構與無障礙體驗
export interface CaseCardProps {
  caseStudy: CaseStudy;
  index: number;
}

export const CaseCard = ({ caseStudy }: CaseCardProps): JSX.Element => {
  return (
    <motion.article
      variants={animations.itemFadeIn}
      whileHover={{ y: -5 }}
      className="bg-white border border-gray-100 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md flex flex-col h-full"
      role="article"
      aria-labelledby={`case-heading-${caseStudy.id}`}
    >
      <div className="aspect-video relative overflow-hidden" style={{ background: brandColors.primary }}>
        {/* 扁平設計的幾何元素 */}
        <div className="absolute inset-0">
          <div className="absolute top-[10%] right-[5%] w-12 h-12 opacity-20 bg-white rounded-none"></div>
          <div className="absolute bottom-[15%] left-[10%] w-20 h-8 opacity-10 bg-black rounded-none"></div>
          <div className="absolute top-[40%] right-[30%] w-8 h-8 opacity-15 bg-white rounded-none"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <AnimatedNumber 
              value={caseStudy.metrics[0].value}
              className="text-5xl font-bold font-gothic"
            />
            <div className="text-sm">{caseStudy.metrics[0].label}</div>
          </div>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <span className="inline-block px-2 py-1 border-l-2 border-primary text-gray-700 text-xs font-medium mb-2">
            {caseStudy.category}
          </span>
          <h3 id={`case-heading-${caseStudy.id}`} className="text-xl font-bold font-gothic">{caseStudy.name}</h3>
        </div>
        <p className="text-gray-600 mb-5 text-sm">
          {caseStudy.description.length > 60 
            ? caseStudy.description.substring(0, 60) + '...' 
            : caseStudy.description}
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {caseStudy.metrics.slice(0, 2).map((metric: CaseMetric, index: number) => (
            <div key={index} className="bg-gray-50 border-l-2 border-primary p-3">
              <AnimatedNumber 
                value={metric.value}
                className="text-xl font-bold mb-1 font-gothic text-primary"
              />
              <div className="text-xs text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
        {caseStudy.solutions && caseStudy.solutions.length > 0 && (
          <div className="space-y-2 mb-5">
            {caseStudy.solutions.slice(0, 2).map((solution: string, index: number) => (
              <p key={index} className="text-gray-500 text-sm flex items-start">
                <span className="flex-shrink-0 h-5 w-5 flex items-center justify-center bg-primary text-white text-xs mr-2">
                  {index + 1}
                </span>
                <span className="line-clamp-1">{solution}</span>
              </p>
            ))}
          </div>
        )}
        <motion.div
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
          className="mt-auto"
        >
          <Link href={`/case/${caseStudy.id}`} aria-label={`查看${caseStudy.name}的詳細案例`}>
            <span className="text-primary font-medium inline-flex items-center group transition-colors duration-300">
              查看詳細案例
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
};

// CTA 組件 - 提供可重用的行動呼籲區塊
export const CTASection = (): JSX.Element => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="mb-20 bg-black text-white p-8 md:p-12 text-center"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-4 font-gothic">想為您的診所打造 AI 驅動的專屬數位行銷策略？</h2>
      <div className="w-20 h-0.5 bg-primary mx-auto mb-8"></div>
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        立即與我們聯繫，獲取專業諮詢與由 AI 技術支持的量身定制行銷方案，讓您的診所在數位時代脫穎而出。
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link href="/contact">
          <span className="inline-block bg-primary text-white px-8 py-4 text-lg font-medium transition-colors hover:bg-primary/90">
            免費諮詢
          </span>
        </Link>
        <Link href="/service">
          <span className="inline-block border border-white text-white px-8 py-4 text-lg font-medium hover:bg-white hover:text-black transition-colors">
            了解服務方案
          </span>
        </Link>
      </div>
    </motion.section>
  );
};

// 回到頂部按鈕組件
export const BackToTopButton = (): JSX.Element => {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 bg-primary text-white w-10 h-10 flex items-center justify-center shadow-sm hover:bg-primary/90"
      aria-label="回到頂部"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
    </motion.button>
  );
};

// 生成頁面 Metadata - 與 Next.js metadata 檔案保持一致
export const generateCasePageMetadata = (): Metadata => {
  return {
    title: '成功案例分享 | Aidea:Med 牙醫行銷專家',
    description: '透過專業的 AI 整合數位行銷策略，我們協助多家牙醫診所成功打造品牌形象、提升營收。瀏覽我們的成功案例，了解如何為您的診所帶來更多新患與營收。',
    keywords: ['牙醫診所', 'AI行銷', '醫療行銷', '成功案例', '品牌重塑', '社群經營', '品牌策略', '整合行銷', '數位轉型'],
    openGraph: {
      title: '成功案例分享 | Aidea:Med 牙醫行銷專家',
      description: '透過專業的 AI 整合數位行銷策略，我們協助多家牙醫診所成功打造品牌形象、提升營收。瀏覽我們的成功案例，了解如何為您的診所帶來更多新患與營收。',
      url: 'https://www.aidea-med.com/case',
      siteName: 'Aidea:Med 牙醫行銷專家',
      images: [
        {
          url: 'https://www.aidea-med.com/images/case-og.jpg',
          width: 1200,
          height: 630,
          alt: '牙醫診所數位行銷成功案例'
        }
      ],
      locale: 'zh_TW',
      type: 'website',
    }
  };
};

// 生成個別案例的 schema.org 結構化資料
export const generateCaseStudyMetadata = (caseStudy: CaseStudy): ArticleStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${caseStudy.name} - ${caseStudy.category}`,
    description: caseStudy.description,
    image: caseStudy.image || `https://www.aidea-med.com/images/cases/${caseStudy.id}.jpg`,
    datePublished: caseStudy.publishedDate || new Date().toISOString(),
    dateModified: caseStudy.updatedDate || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Aidea:Med 牙醫行銷專家',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.aidea-med.com/logo.png'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aidea:Med 牙醫行銷專家',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.aidea-med.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.aidea-med.com/case/${caseStudy.id}`
    },
    about: {
      '@type': 'Thing',
      name: caseStudy.category,
      description: `Aidea:Med 牙醫行銷專家提供的${caseStudy.category}服務，結合AI技術與創意策略，為牙醫診所提供專業的數位行銷解決方案`
    },
    articleSection: '成功案例',
    keywords: ['牙醫診所', 'AI行銷', '醫療行銷', '數位行銷', caseStudy.category, caseStudy.name]
  };
};

// 生成個別案例頁面的 Next.js Metadata
export const generateCaseMetadata = (caseStudy: CaseStudy): Metadata => {
  return {
    title: `${caseStudy.name} - ${caseStudy.category} | Aidea:Med 牙醫行銷專家`,
    description: caseStudy.description,
    keywords: ['牙醫診所', 'AI行銷', '醫療行銷', '成功案例', caseStudy.category, caseStudy.name],
    openGraph: {
      title: `${caseStudy.name} - ${caseStudy.category} | Aidea:Med 牙醫行銷專家`,
      description: caseStudy.description,
      url: `https://www.aidea-med.com/case/${caseStudy.id}`,
      siteName: 'Aidea:Med 牙醫行銷專家',
      images: [
        {
          url: `https://www.aidea-med.com/images/cases/${caseStudy.id}.jpg`,
          width: 1200,
          height: 630,
          alt: caseStudy.name
        }
      ],
      locale: 'zh_TW',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${caseStudy.name} - ${caseStudy.category} | Aidea:Med 牙醫行銷專家`,
      description: caseStudy.description,
      images: [`https://www.aidea-med.com/images/cases/${caseStudy.id}.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://www.aidea-med.com/case/${caseStudy.id}`,
    },
    authors: [{ name: 'Aidea:Med 牙醫行銷專家', url: 'https://www.aidea-med.com' }],
    publisher: 'Aidea:Med 牙醫行銷專家',
    category: '成功案例',
  };
};

// 頁面主組件
export default function CasePage(): JSX.Element {
  // 載入與篩選狀態
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [isChangingCategory, setIsChangingCategory] = useState<boolean>(false);
  
  // 根據類別篩選案例
  const filteredCases = activeCategory === '全部' 
    ? caseStudies 
    : caseStudies.filter(cs => cs.category === activeCategory);
  
  // 獲取特色案例和一般案例
  const featuredCase = filteredCases.find(cs => cs.featured);
  const regularCases = filteredCases.filter(cs => !cs.featured);
  
  // 從案例中提取獨特的類別
  const uniqueCategories = ['全部', ...Array.from(new Set(caseStudies.map(cs => cs.category)))];
  
  // 處理類別變更
  const handleCategoryChange = (category: string): void => {
    if (category === activeCategory) return;
    
    // 顯示載入狀態並模擬載入時間，提升UX
    setIsChangingCategory(true);
    setActiveCategory(category);
    
    setTimeout(() => {
      setIsChangingCategory(false);
    }, 300);
  };
  
  // SEO結構化資料 - 符合 schema.org 標準
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": caseStudies.map((caseStudy, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "name": caseStudy.name,
        "headline": `${caseStudy.name} - ${caseStudy.category}`,
        "description": caseStudy.description,
        "url": `https://www.aidea-med.com/case/${caseStudy.id}`,
        "datePublished": caseStudy.publishedDate || new Date().toISOString(),
        "dateModified": caseStudy.updatedDate || new Date().toISOString(),
        "publisher": {
          "@type": "Organization",
          "name": "雅德數位行銷",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.aidea-med.com/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://www.aidea-med.com/case/${caseStudy.id}`
        }
      }
    }))
  };
  
  // 模擬完整頁面載入效果（可在實際API整合時移除）
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, []);
  
  if (loading) {
    return <LoadingState />;
  }
  
  return (
    <>
      {/* 結構化資料 */}
      <Script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      
      <div className="py-20 min-h-screen bg-white">
        <div className="container mx-auto px-4">
          {/* 頁面標題 */}
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold font-gothic mb-4"
            >
              成功案例展示
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-1 bg-primary"></div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              透過專業的數位行銷策略，我們協助多家牙醫診所成功打造品牌形象、提升營收，
              以下是部分合作診所的實際成效。
            </motion.p>
          </div>
          
          {/* 類別篩選器 */}
          <CaseFilter 
            activeCategory={activeCategory} 
            setActiveCategory={handleCategoryChange}
            categories={uniqueCategories}
          />
          
          {/* 內容區 */}
          {isChangingCategory ? (
            <LoadingState />
          ) : filteredCases.length === 0 ? (
            <EmptyState category={activeCategory} />
          ) : (
            <div>
              {/* 特色案例 */}
              {featuredCase && activeCategory === '全部' && <FeaturedCase caseStudy={featuredCase} />}
              
              {/* 一般案例 */}
              {regularCases.length > 0 && (
                <motion.div
                  variants={animations.staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                >
                  {regularCases.map((caseStudy, index) => (
                    <CaseCard 
                      key={caseStudy.id} 
                      caseStudy={caseStudy} 
                      index={index}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          )}
          
          {/* CTA 區域 */}
          <CTASection />
          
          {/* 回到頂部按鈕 */}
          <BackToTopButton />
        </div>
      </div>
    </>
  );
} 