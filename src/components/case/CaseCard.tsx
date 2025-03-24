'use client'

import React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CaseStudy } from '@/components/pages/CasePage'

export interface CaseCardProps {
  caseStudy: CaseStudy;
  index: number;
  isLinked?: boolean; // 新增屬性：是否需要被Link包裹
  isCompact?: boolean; // 新增屬性：是否使用緊湊佈局
}

// 有效案例 ID 列表作為常量避免重複創建
const VALID_CASE_IDS = [
  'north-district-dental', 
  'east-district-dental', 
  'central-district-dental', 
  'south-district-dental',
  'smile-dental'
];

// 使用memo包裝CaseCard以避免不必要的重渲染
export const CaseCard = React.memo(({ 
  caseStudy, 
  index, 
  isLinked = true,
  isCompact = false 
}: CaseCardProps): React.ReactElement => {
  // 圖片源計算邏輯
  const imgSrc = useMemo(() => {
    if (caseStudy.image) {
      return caseStudy.image;
    } 
    
    if (caseStudy.id && VALID_CASE_IDS.includes(caseStudy.id)) {
      return `/cases/${caseStudy.id}.jpg`;
    }
    
    return '/cases/case-placeholder.jpg';
  }, [caseStudy.image, caseStudy.id]);
  
  // 新增狀態
  const [isHovered, setIsHovered] = useState(false);
  const [imgStatus, setImgStatus] = useState({
    error: false,
    loading: true
  });
  
  // 使用 useMemo 計算動畫延遲，避免過長延遲
  const animationDelay = useMemo(() => Math.min(index * 0.1, 0.5), [index]);
  
  // 圖片處理回調
  const handleImageLoad = useCallback(() => {
    setImgStatus({loading: false, error: false});
  }, []);
  
  const handleImageError = useCallback(() => {
    setImgStatus({loading: false, error: true});
  }, []);

  // 鼠標事件處理
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // 建立卡片內容
  const cardContent = (
    <div 
      className={`
        h-full bg-white border border-gray-100 transition-all duration-400
        ${isHovered ? 'shadow-lg translate-y-[-5px]' : 'shadow-md'}
        ${isCompact ? 'rounded-lg overflow-hidden' : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4, 
          delay: animationDelay, 
          ease: "easeOut" 
        }}
        className="h-full flex flex-col"
      >
        {/* 圖片區域 */}
        <div className={`
          relative overflow-hidden 
          ${isCompact ? 'aspect-[3/2]' : 'aspect-[4/3]'}
        `}>
          {imgStatus.loading && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent animate-spin rounded-full" />
            </div>
          )}
          
          <Image
            src={imgStatus.error ? '/cases/case-placeholder.jpg' : imgSrc}
            alt={caseStudy.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`
              object-cover transition-transform duration-400 
              ${isHovered ? 'scale-105' : 'scale-100'}
            `}
            priority={index <= 2} // 優化：只對前2個案例設置為優先加載
            loading={index <= 2 ? 'eager' : 'lazy'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            fetchPriority={index <= 2 ? 'high' : 'auto'} // 使用新的fetchPriority屬性
            quality={index <= 4 ? 85 : 75} // 根據優先級設定不同的圖片質量
          />
          
          {/* 圖片覆蓋層 */}
          <div className={`
            absolute inset-0 bg-black transition-opacity duration-400
            ${isHovered ? 'opacity-20' : 'opacity-0'}
          `} />
          
          {/* 類別標籤 */}
          {caseStudy.category && (
            <div className={`
              absolute left-0 top-3 bg-primary text-white font-medium
              ${isCompact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'}
            `}>
              {caseStudy.category}
            </div>
          )}
          
          {/* 精選標籤 */}
          {caseStudy.featured && (
            <div className={`
              absolute right-0 top-3 bg-amber-500 text-white font-medium
              ${isCompact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'}
            `}>
              精選案例
            </div>
          )}
        </div>
        
        {/* 內容區域 */}
        <div className={`
          flex-1 flex flex-col
          ${isCompact ? 'p-3' : 'p-5'}
        `}>
          <h3 className={`
            font-bold text-gray-900 
            ${isCompact ? 'text-base mb-1.5' : 'text-xl mb-3'}
          `}>
            {caseStudy.name}
          </h3>
          
          <p className={`
            text-gray-600 flex-grow
            ${isCompact ? 'text-xs mb-2 line-clamp-1' : 'text-sm mb-4 line-clamp-2'}
          `}>
            {caseStudy.description}
          </p>
          
          {/* 績效指標 */}
          {Array.isArray(caseStudy.metrics) && caseStudy.metrics.length > 0 && (
            <div className="mt-auto">
              <div className={`
                flex flex-wrap
                ${isCompact ? 'gap-2 mb-2' : 'gap-3 mb-4'}
              `}>
                {caseStudy.metrics.slice(0, isCompact ? 1 : 2).map((metric, idx) => (
                  <div key={idx} className={`
                    flex items-center border-l-4 border-primary
                    ${isCompact ? 'pl-1.5 py-0.5' : 'pl-2 py-1'}
                  `}>
                    <span className={`
                      font-bold text-primary
                      ${isCompact ? 'text-base' : 'text-lg'}
                    `}>
                      {metric.value}
                    </span>
                    <span className={`
                      text-gray-600 ml-1
                      ${isCompact ? 'text-xxs' : 'text-xs'}
                    `}>
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 解決方案提示 - 只在非緊湊模式下顯示 */}
          {!isCompact && Array.isArray(caseStudy.solutions) && caseStudy.solutions.length > 0 && (
            <div className="flex items-center text-sm text-primary mt-auto">
              <span className="mr-2">解決方案</span>
              <div className="flex gap-1">
                {caseStudy.solutions.slice(0, 3).map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`
                      w-2 h-2 bg-primary rounded-sm
                      ${isHovered ? 'scale-110' : 'scale-100'}
                      transition-transform duration-300
                    `}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  // 如果需要Link包裹則返回Link包裹的內容，否則直接返回內容
  return isLinked ? (
    <Link 
      href={`/case/${caseStudy.id}`} 
      prefetch={true}
      className="block h-full"
    >
      {cardContent}
    </Link>
  ) : cardContent;
}); 