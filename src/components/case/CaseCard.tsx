'use client'

import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { OptimizedImage, Spinner } from '@/components/common'
import { CaseStudy } from '@/components/pages/CasePage'

export interface CaseCardProps {
  caseStudy: CaseStudy;
  index: number;
}

// 有效案例 ID 列表作為常量避免重複創建
const VALID_CASE_IDS = [
  'north-district-dental', 
  'east-district-dental', 
  'central-district-dental', 
  'south-district-dental',
  'smile-dental'
];

export const CaseCard = ({ caseStudy, index }: CaseCardProps): React.ReactElement => {
  // 合併相關的圖片狀態為一個狀態對象
  const [imageState, setImageState] = useState({
    loading: true,
    error: false,
    src: '/cases/case-placeholder.jpg' // 默認圖片
  });
  
  // 使用 useMemo 計算動畫延遲，避免過長延遲
  const animationDelay = useMemo(() => Math.min(index * 0.1, 0.5), [index]);
  
  // 優化圖片處理邏輯
  useEffect(() => {
    let isUnmounted = false;
    let imgSrc = imageState.src;
    
    // 確定圖片來源
    if (caseStudy.image) {
      imgSrc = caseStudy.image;
    } else if (caseStudy.id && VALID_CASE_IDS.includes(caseStudy.id)) {
      imgSrc = `/cases/${caseStudy.id}.jpg`;
    }
    
    // 只有當源圖片變更時才更新
    if (imgSrc !== imageState.src) {
      setImageState(prev => ({ ...prev, loading: true, src: imgSrc }));
      
      // 僅在開發環境下進行圖片存在性檢查
      if (process.env.NODE_ENV === 'development') {
        const checkImage = new Image();
        checkImage.onload = () => {
          if (!isUnmounted) {
            setImageState(prev => ({ ...prev, loading: false, error: false }));
          }
        };
        checkImage.onerror = () => {
          if (!isUnmounted) {
            setImageState({ loading: false, error: true, src: '/cases/case-placeholder.jpg' });
          }
        };
        checkImage.src = imgSrc;
      }
    }

    return () => { isUnmounted = true; };
  }, [caseStudy.id, caseStudy.image, imageState.src]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
    >
      {/* 圖片區域 */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {imageState.loading && !imageState.error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Spinner className="w-10 h-10 text-primary" />
          </div>
        )}
        {!imageState.error ? (
          <OptimizedImage
            src={imageState.src}
            alt={caseStudy.name}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 480px) 95vw, (max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 30vw, 300px"
            onLoadComplete={() => setImageState(prev => ({ ...prev, loading: false }))}
            onError={() => setImageState({ loading: false, error: true, src: '/cases/case-placeholder.jpg' })}
            priority={index < 2}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-4xl">📷</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* 內容區域 */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full">
            {caseStudy.category}
          </span>
          {caseStudy.featured && (
            <span className="flex items-center text-yellow-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {caseStudy.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {caseStudy.description}
        </p>

        {/* 成效指標 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
            <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-primary mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* 解決方案列表 */}
        {caseStudy.solutions && (
          <div className="space-y-2 mb-6">
            {caseStudy.solutions.slice(0, 3).map((solution, idx) => (
              <div key={idx} className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="line-clamp-1">{solution.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* 查看詳情按鈕 */}
        <div className="mt-auto pt-3">
          <Link
            href={`/case/${caseStudy.id}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            查看詳細案例
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  )
} 