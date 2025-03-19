'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Metadata } from 'next'
import { animations } from '@/utils/animations'
import { CaseCard } from '@/components/case/CaseCard'

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
  metrics: CaseMetric[];
  solutions?: Solution[];
  featured?: boolean;
  color?: string;
  image?: string;
  imageWebp?: string;
  imagePlaceholder?: string;
  imageSizes?: {
    sm: string;
    md: string;
    lg: string;
  };
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
    image: '/Case_1.jpg',
    imageWebp: '/Case_1.webp',
    imagePlaceholder: '/Case_1_placeholder.jpg',
    imageSizes: {
      sm: '/Case_1_sm.jpg',
      md: '/Case_1_md.jpg',
      lg: '/Case_1.jpg',
    },
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
    image: '/Case_2.jpg',
    imageWebp: '/Case_2.webp',
    imagePlaceholder: '/Case_2_placeholder.jpg',
    imageSizes: {
      sm: '/Case_2_sm.jpg',
      md: '/Case_2_md.jpg',
      lg: '/Case_2.jpg',
    },
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
    image: '/Case_3.png',
    imageWebp: '/Case_3.webp',
    imagePlaceholder: '/Case_3_placeholder.png',
    imageSizes: {
      sm: '/Case_3_sm.png',
      md: '/Case_3_md.png',
      lg: '/Case_3.png',
    },
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
    image: '/Case_4.jpg',
    imageWebp: '/Case_4.webp',
    imagePlaceholder: '/Case_4_placeholder.jpg',
    imageSizes: {
      sm: '/Case_4_sm.jpg',
      md: '/Case_4_md.jpg',
      lg: '/Case_4.jpg',
    },
    featured: true,
    publishedDate: '2023-07-05T00:00:00Z',
    updatedDate: '2023-10-18T00:00:00Z',
    testimonial: {
      content: '數位轉型讓我們從繁瑣的行政工作中解放，能更專注於病患照護。新系統不僅提升效率，老病患也感受到服務品質的提升。',
      author: '陳醫師',
      title: '南區診所第二代負責人'
    }
  }
]

// 使用品牌主要配色系統
const brandColors = {
  primary: 'rgba(255, 0, 0, 0.9)', // 品牌紅色
  secondary: 'rgba(0, 0, 0, 0.9)', // 品牌黑色
  light: 'rgba(255, 255, 255, 1)', // 品牌白色
  lightGray: 'rgba(245, 245, 245, 1)' // 淺灰色用於背景
};

// 載入狀態組件
export const LoadingState = (): React.ReactElement => {
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

export const EmptyState = ({ category }: EmptyStateProps): React.ReactElement => {
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

export const CaseFilter = ({ activeCategory, setActiveCategory, categories }: CaseFilterProps): React.ReactElement => {
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

export const AnimatedNumber = ({ value, className }: AnimatedNumberProps): React.ReactElement => {
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

export const FeaturedCase = ({ caseStudy }: FeaturedCaseProps): React.ReactElement => {
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
              <Link 
                href={`/case/${caseStudy.id}`} 
                aria-label={`查看${caseStudy.name}的完整案例細節`}
                className="inline-flex items-center px-8 py-3 bg-primary text-white font-medium group transition-all duration-300 hover:bg-primary/90"
              >
                查看完整案例
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// CTA 組件 - 提供可重用的行動呼籲區塊
export const CTASection = (): React.ReactElement => {
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
        <Link 
          href="/contact"
          className="inline-block bg-primary text-white px-8 py-4 text-lg font-medium transition-colors hover:bg-primary/90"
        >
          免費諮詢
        </Link>
        <Link 
          href="/service"
          className="inline-block border border-white text-white px-8 py-4 text-lg font-medium hover:bg-white hover:text-black transition-colors"
        >
          了解服務方案
        </Link>
      </div>
    </motion.section>
  );
};

// 回到頂部按鈕組件
export const BackToTopButton = (): React.ReactElement => {
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
      url: 'https://www.aideamed.com/case',
      siteName: 'Aidea:Med 牙醫行銷專家',
      images: [
        {
          url: 'https://www.aideamed.com/images/case-og.jpg',
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
        url: 'https://www.aideamed.com/logo.png'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aidea:Med 牙醫行銷專家',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.aideamed.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.aideamed.com/case/${caseStudy.id}`
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
      url: `https://www.aideamed.com/case/${caseStudy.id}`,
      siteName: 'Aidea:Med 牙醫行銷專家',
      images: [
        {
          url: `https://www.aideamed.com/images/cases/${caseStudy.id}.jpg`,
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
      images: [`https://www.aideamed.com/images/cases/${caseStudy.id}.jpg`],
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
      canonical: `https://www.aideamed.com/case/${caseStudy.id}`,
    },
    authors: [{ name: 'Aidea:Med 牙醫行銷專家', url: 'https://www.aideamed.com' }],
    publisher: 'Aidea:Med 牙醫行銷專家',
    category: '成功案例',
  };
};

// 更新主頁面組件
export default function CasePage(): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [filteredCases, setFilteredCases] = useState(caseStudies)
  const [isLoading, setIsLoading] = useState(true)

  // 獲取所有案例類別
  const categories = ['全部', ...Array.from(new Set(caseStudies.map(cs => cs.category)))]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // 處理類別篩選
  useEffect(() => {
    if (activeCategory === '全部') {
      setFilteredCases(caseStudies)
    } else {
      setFilteredCases(caseStudies.filter(cs => cs.category === activeCategory))
    }
  }, [activeCategory])

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題區 */}
      <section className="relative py-20 bg-primary text-white overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/images/bgline-w.png"
            alt="背景線條"
            fill
            className="object-cover mix-blend-soft-light"
            quality={90}
            sizes="100vw"
          />
        </motion.div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 font-display">
              成功案例展示
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              探索我們如何幫助診所提升品牌價值、增加營業額，
              打造專屬的品牌成長策略
            </p>
          </motion.div>
        </div>
      </section>

      {/* 案例篩選與展示區 */}
      <section className="py-20">
        <div className="container-custom">
          {/* 篩選器 */}
          <CaseFilter
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            categories={categories}
          />

          {/* 案例列表 */}
          {filteredCases.length === 0 ? (
            <EmptyState category={activeCategory} />
          ) : (
            <motion.div
              variants={animations.staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCases.map((caseStudy, index) => (
                <CaseCard
                  key={caseStudy.id}
                  caseStudy={caseStudy}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA 區域 */}
      <CTASection />

      {/* 回到頂部按鈕 */}
      <BackToTopButton />
    </div>
  )
} 