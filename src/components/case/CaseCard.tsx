'use client'

import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Spinner } from '@/components/common'
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
  
  // 新增狀態
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
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
    }

    return () => { isUnmounted = true; };
  }, [caseStudy.id, caseStudy.image, imageState.src]);

  // 格式化數字，添加千分位
  const formatNumber = (num: string): string => {
    const numValue = parseFloat(num.replace(/[^0-9.]/g, ''));
    if (isNaN(numValue)) return num;
    
    const formatted = new Intl.NumberFormat('zh-TW').format(numValue);
    const suffix = num.replace(/[0-9.]/g, '');
    return formatted + suffix;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => {
        setIsHovered(true);
        setHasInteracted(true);
      }}
      onTouchEnd={() => {
        if (hasInteracted) {
          setIsHovered(false);
          setHasInteracted(false);
        }
      }}
    >
      {/* 圖片區域 */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {imageState.loading && !imageState.error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Spinner className="w-10 h-10 text-primary" />
          </div>
        )}
        {!imageState.error ? (
          <Image
            src={imageState.src}
            alt={caseStudy.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-103"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={80}
            priority={index < 2}
            loading={index < 2 ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEQQJKENLrXgAAAABJRU5ErkJggg=="
            onLoadingComplete={() => setImageState(prev => ({ ...prev, loading: false }))}
            onError={() => setImageState({ loading: false, error: true, src: '/cases/case-placeholder.jpg' })}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-4xl">📷</span>
          </div>
        )}
        
        {/* 覆蓋層 (改為扁平化設計) */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        
        {/* 分類標籤 - 改為扁平設計 */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 text-sm font-medium text-white bg-primary rounded-md">
            {caseStudy.category}
          </span>
        </div>
        
        {/* 精選標記 - 改為扁平設計 */}
        {caseStudy.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="flex items-center px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-md">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              精選案例
            </span>
          </div>
        )}
      </div>

      {/* 內容區域 */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {caseStudy.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {caseStudy.description}
        </p>

        {/* 成效指標 - 改為扁平化設計 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
            <div key={idx} className="text-center p-3 bg-gray-50 rounded-md border-l-4 border-primary">
              <div className="text-xl font-bold text-primary mb-1">
                {formatNumber(metric.value)}
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
                <div className="w-4 h-4 bg-primary text-white flex items-center justify-center rounded-sm mr-2 flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="line-clamp-1">{typeof solution === 'string' ? solution : solution.title}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* 發布日期 */}
        {caseStudy.publishedDate && (
          <div className="text-xs text-gray-500 mb-4 mt-auto">
            發布日期: {new Date(caseStudy.publishedDate).toLocaleDateString('zh-TW')}
          </div>
        )}

        {/* 查看詳情按鈕 - 改為扁平化設計 */}
        <div className="mt-auto pt-3">
          <Link
            href={`/case/${caseStudy.id}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            查看詳細案例
            <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* 角標區塊 - 改為更扁平的設計 */}
      {isHovered && (
        <div className="absolute top-0 right-0 bg-primary text-white w-auto h-auto py-1 px-3 rounded-bl-md">
          <span className="text-sm font-medium">查看案例</span>
        </div>
      )}
    </motion.div>
  )
} 