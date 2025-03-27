'use client'

import { useState, useEffect, memo, useMemo, Suspense, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Metadata } from 'next'
import { animations, fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/utils/animations'
import { CaseCard } from '@/components/case/CaseCard'
import { PageHeader } from '@/components/common'
import Image from 'next/image'

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
  metrics: { value: string; label: string }[];
  solutions: Solution[] | string[];
  color?: string;
  image: string;
  featured?: boolean;
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
    id: 'artisticdc',
    name: '雅德思牙醫診所',
    category: '品牌重塑',
    description: '從傳統診所到數位化品牌的成功轉型，透過整合性行銷策略，在短短 2 個月內實現顯著成長：',
    metrics: [
      { value: '200%', label: '新患預約成長' },
      { value: '900000000+', label: '年營業額' },
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
    image: '/images/cases/Case_artisticdc.jpg',
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
    id: 'ytdentalcare',
    name: '雲天牙醫診所',
    category: '廣告投放',
    description: '優化廣告投放，每月新增100+NP',
    metrics: [
      { value: '35%', label: '初診患者滿意度提升' },
      { value: '20%', label: '新患者增長' },
      { value: '23%', label: '廣告成效優化' },
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
    image: '/images/cases/Case_ytdentalcare.jpg',
    featured: true,
    publishedDate: '2023-06-10T00:00:00Z',
    updatedDate: '2023-09-15T00:00:00Z',
    testimonial: {
      content: '全新的診所空間不只讓患者感到舒適，也讓我們的工作效率提高。專業團隊從設計到執行都給予最佳支援。',
      author: '蘇醫師',
      title: '雲天牙醫診所總院長'
    }
  },
  {
    id: 'chinese',
    name: '中華牙醫診所',
    category: '品牌重塑',
    description: '透過專業的品牌重塑服務，打造現代化且親切的診所形象，提升品牌價值與患者信任感',
    metrics: [
      { value: '180%', label: '品牌知名度提升' },
      { value: '45%', label: '新患者增長' },
      { value: '85%', label: '患者滿意度' },
      { value: '60%', label: '回診率提升' }
    ],
    solutions: [
      {
        title: '品牌識別系統建立',
        description: '設計現代化且專業的品牌識別系統，包含標誌、色彩計畫與視覺元素，建立一致的品牌形象。'
      },
      {
        title: '診所空間改造',
        description: '重新規劃診所空間，打造舒適且專業的診療環境，提升患者就醫體驗。'
      },
      {
        title: '數位行銷策略',
        description: '制定完整的數位行銷計畫，透過社群媒體與網站優化，提升線上能見度。'
      },
      {
        title: '患者服務優化',
        description: '導入數位化管理系統，優化預約流程與患者服務，提升營運效率。'
      }
    ],
    color: '#4A6CF7',
    image: '/images/cases/Case_中華.jpg',
    featured: false,
    publishedDate: '2024-01-15T00:00:00Z',
    updatedDate: '2024-02-20T00:00:00Z',
    testimonial: {
      content: '品牌重塑後，診所的整體形象更加專業現代化，患者回饋也相當正面。',
      author: '林醫師',
      title: '中華牙醫診所院長'
    }
  },
  {
    id: 'pincheng',
    name: '品誠牙醫診所',
    category: '數位轉型',
    description: '導入數位化管理系統，優化診所營運流程，提升服務效率與患者體驗',
    metrics: [
      { value: '70%', label: '行政效率提升' },
      { value: '90%', label: '患者滿意度' },
      { value: '50%', label: '營運成本降低' },
      { value: '40%', label: '新患者成長' }
    ],
    solutions: [
      {
        title: '數位管理系統導入',
        description: '整合預約、病歷、收費等管理系統，提升診所營運效率。'
      },
      {
        title: '線上預約系統優化',
        description: '建置便捷的線上預約系統，提供24小時預約服務。'
      },
      {
        title: '患者資料管理',
        description: '導入電子病歷系統，提升病歷管理效率與安全性。'
      },
      {
        title: '員工培訓計畫',
        description: '提供完整的系統使用培訓，確保團隊順利適應新系統。'
      }
    ],
    color: '#2ECC71',
    image: '/images/cases/Case_品誠.jpg',
    featured: false,
    publishedDate: '2024-01-20T00:00:00Z',
    updatedDate: '2024-02-25T00:00:00Z',
    testimonial: {
      content: '數位轉型後，診所的營運更加順暢，患者服務品質也大幅提升。',
      author: '陳醫師',
      title: '品誠牙醫診所院長'
    }
  },
  {
    id: 'chunsheng',
    name: '春生牙醫診所',
    category: '社群經營',
    description: '透過專業的社群媒體經營，建立診所專業形象，提升品牌知名度',
    metrics: [
      { value: '250%', label: '社群追蹤成長' },
      { value: '45%', label: '互動率提升' },
      { value: '35%', label: '新患者來源' },
      { value: '80%', label: '品牌認知度' }
    ],
    solutions: [
      {
        title: '社群內容策略',
        description: '規劃專業的口腔衛教內容，建立診所專業形象。'
      },
      {
        title: '多平台經營',
        description: '整合 Facebook、Instagram、LINE 等平台，擴大品牌觸及。'
      },
      {
        title: '互動活動規劃',
        description: '設計線上互動活動，提升社群參與度。'
      },
      {
        title: '口碑行銷',
        description: '鼓勵患者分享就醫體驗，建立良好口碑。'
      }
    ],
    color: '#E74C3C',
    image: '/images/cases/Case_春生.jpg',
    featured: false,
    publishedDate: '2024-01-25T00:00:00Z',
    updatedDate: '2024-02-28T00:00:00Z',
    testimonial: {
      content: '社群經營讓我們能更直接地與患者互動，也幫助診所建立更親切的形象。',
      author: '王醫師',
      title: '春生牙醫診所院長'
    }
  },
  {
    id: 'jiayuan',
    name: '家源牙醫診所',
    category: '整合行銷',
    description: '透過全方位的整合行銷策略，提升診所品牌價值與市場競爭力',
    metrics: [
      { value: '200%', label: '品牌知名度' },
      { value: '55%', label: '新患者成長' },
      { value: '40%', label: '回診率提升' },
      { value: '85%', label: '患者滿意度' }
    ],
    solutions: [
      {
        title: '品牌定位策略',
        description: '建立清晰的品牌定位，突出診所特色與優勢。'
      },
      {
        title: '多管道行銷',
        description: '整合線上線下行銷管道，擴大品牌影響力。'
      },
      {
        title: '內容行銷',
        description: '製作專業的衛教內容，建立診所權威形象。'
      },
      {
        title: '患者服務優化',
        description: '優化診所服務流程，提升患者體驗。'
      }
    ],
    color: '#3498DB',
    image: '/images/cases/Case_家源.jpg',
    featured: false,
    publishedDate: '2024-02-01T00:00:00Z',
    updatedDate: '2024-03-05T00:00:00Z',
    testimonial: {
      content: '整合行銷策略幫助我們在競爭激烈的市場中脫穎而出，建立穩固的品牌形象。',
      author: '李醫師',
      title: '家源牙醫診所院長'
    }
  },
  {
    id: 'haidi',
    name: '海蒂牙醫診所',
    category: '品牌重塑',
    description: '重新打造診所品牌形象，建立專業且親切的診所風格',
    metrics: [
      { value: '150%', label: '品牌認知度' },
      { value: '40%', label: '新患者增長' },
      { value: '75%', label: '患者回饋' },
      { value: '60%', label: '社群互動率' }
    ],
    solutions: [
      {
        title: '視覺識別設計',
        description: '設計現代化的品牌視覺系統，提升品牌識別度。'
      },
      {
        title: '空間規劃',
        description: '重新規劃診所空間，打造舒適的診療環境。'
      },
      {
        title: '服務流程優化',
        description: '改善診所服務流程，提升患者體驗。'
      },
      {
        title: '社群經營',
        description: '建立活躍的社群平台，增加品牌互動。'
      }
    ],
    color: '#9B59B6',
    image: '/images/cases/Case_海蒂.jpg',
    featured: false,
    publishedDate: '2024-02-05T00:00:00Z',
    updatedDate: '2024-03-10T00:00:00Z',
    testimonial: {
      content: '品牌重塑後，診所的整體形象更加專業且親切，患者回饋相當正面。',
      author: '張醫師',
      title: '海蒂牙醫診所院長'
    }
  },
  {
    id: 'haohao',
    name: '皓皓牙醫診所',
    category: '數位行銷',
    description: '透過精準的數位行銷策略，提升診所線上能見度與患者轉換率',
    metrics: [
      { value: '300%', label: '網站流量成長' },
      { value: '50%', label: '線上預約率' },
      { value: '65%', label: '廣告投資報酬率' },
      { value: '45%', label: '新患者來源' }
    ],
    solutions: [
      {
        title: 'SEO優化',
        description: '優化網站搜尋引擎排名，提升自然流量。'
      },
      {
        title: '社群廣告投放',
        description: '精準投放社群廣告，提升品牌曝光度。'
      },
      {
        title: '內容行銷',
        description: '製作專業的衛教內容，建立診所權威形象。'
      },
      {
        title: '數據分析',
        description: '透過數據分析優化行銷策略，提升投資報酬率。'
      }
    ],
    color: '#F1C40F',
    image: '/images/cases/Case_皓皓.jpg',
    featured: true,
    publishedDate: '2024-02-10T00:00:00Z',
    updatedDate: '2024-03-15T00:00:00Z',
    testimonial: {
      content: '數位行銷策略幫助我們精準觸及目標客群，大幅提升新患者數量。',
      author: '黃醫師',
      title: '皓皓牙醫診所院長'
    }
  },
  {
    id: 'qinmei',
    name: '勤美民生牙醫診所',
    category: '整合行銷',
    description: '透過全方位的整合行銷策略，建立診所專業形象與市場競爭力',
    metrics: [
      { value: '180%', label: '品牌知名度' },
      { value: '50%', label: '新患者成長' },
      { value: '70%', label: '患者滿意度' },
      { value: '45%', label: '回診率提升' }
    ],
    solutions: [
      {
        title: '品牌策略規劃',
        description: '制定完整的品牌發展策略，建立診所特色。'
      },
      {
        title: '多管道整合',
        description: '整合線上線下行銷管道，擴大品牌影響力。'
      },
      {
        title: '社群經營',
        description: '經營活躍的社群平台，增加品牌互動。'
      },
      {
        title: '服務優化',
        description: '優化診所服務流程，提升患者體驗。'
      }
    ],
    color: '#1ABC9C',
    image: '/images/cases/Case_勤美民生.jpg',
    featured: true,
    publishedDate: '2024-02-15T00:00:00Z',
    updatedDate: '2024-03-20T00:00:00Z',
    testimonial: {
      content: '整合行銷策略幫助我們在市場中建立穩固的品牌形象，提升診所競爭力。',
      author: '吳醫師',
      title: '勤美民生牙醫診所院長'
    }
  },
  {
    id: 'classic',
    name: '經典聯合牙醫診所',
    category: '品牌重塑',
    description: '重新打造診所品牌形象，建立專業且現代的診所風格',
    metrics: [
      { value: '200%', label: '品牌認知度' },
      { value: '55%', label: '新患者增長' },
      { value: '80%', label: '患者滿意度' },
      { value: '65%', label: '社群互動率' }
    ],
    solutions: [
      {
        title: '品牌識別設計',
        description: '設計現代化的品牌識別系統，提升品牌形象。'
      },
      {
        title: '空間改造',
        description: '重新規劃診所空間，打造舒適的診療環境。'
      },
      {
        title: '服務流程優化',
        description: '改善診所服務流程，提升患者體驗。'
      },
      {
        title: '數位行銷',
        description: '建立完整的數位行銷策略，提升線上能見度。'
      }
    ],
    color: '#E67E22',
    image: '/images/cases/Case_經典聯合.jpg',
    featured: true,
    publishedDate: '2024-02-20T00:00:00Z',
    updatedDate: '2024-03-25T00:00:00Z',
    testimonial: {
      content: '品牌重塑後，診所的整體形象更加專業現代化，患者回饋相當正面。',
      author: '劉醫師',
      title: '經典聯合牙醫診所院長'
    }
  }
]

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
  }
}

// 生成案例結構化數據 (Server Component可使用)
export const generateCaseStudyMetadata = (caseStudy: CaseStudy): ArticleStructuredData => {
  const schemaData: ArticleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${caseStudy.name} - ${caseStudy.category}成功案例`,
    description: caseStudy.description,
    image: caseStudy.image,
    datePublished: caseStudy.publishedDate || new Date().toISOString(),
    dateModified: caseStudy.updatedDate || caseStudy.publishedDate || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Aidea:Med 牙醫行銷專家',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.aideamed.com/images/logo.png'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aidea:Med 牙醫行銷專家',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.aideamed.com/images/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.aideamed.com/case/${caseStudy.id}`
    },
    about: {
      '@type': 'Thing',
      name: '牙醫診所行銷',
      description: '專業牙醫診所品牌建立與數位行銷服務'
    },
    articleSection: caseStudy.category,
    keywords: ['牙醫行銷', '診所品牌', caseStudy.category, '醫療行銷', '成功案例']
  }
  
  return schemaData
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
  
  // 優化：使用useMemo過濾案例
  const filteredCases = useMemo(() => {
    return caseStudies.filter(caseStudy => {
      return activeCategory === '全部案例' || caseStudy.category === activeCategory
    })
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
    return caseStudies.filter(item => item.featured).slice(0, 2)
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