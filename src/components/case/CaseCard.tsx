'use client'

import React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CaseStudy } from '@/components/pages/CasePage'
import { caseAnimations } from '@/utils/animations'
import { handleCaseImageError, generateCaseThumbnailUrl } from '@/utils/case'

export interface CaseCardProps {
  caseStudy: CaseStudy;
  index: number;
  isLinked?: boolean; // 新增屬性：是否需要被Link包裹
  isCompact?: boolean; // 新增屬性：是否使用緊湊佈局
  hasParentLink?: boolean; // 新增屬性：是否已有父級Link包裹
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
  isCompact = false,
  hasParentLink = false 
}: CaseCardProps): React.ReactElement => {
  // 圖片源計算邏輯
  const imgSrc = useMemo(() => {
    // 如果案例有自定義圖片，直接使用
    if (caseStudy.image) {
      return caseStudy.image;
    }
    
    // 根據案例 ID 生成圖片路徑
    const caseId = caseStudy.id.toLowerCase();
    return `/images/cases/Case_${caseId}.jpg`;
  }, [caseStudy.image, caseStudy.id]);
  
  const [isHovered, setIsHovered] = useState(false);
  const [imgStatus, setImgStatus] = useState({
    error: false,
    loading: true
  });
  
  // 優化圖片載入處理
  const handleImageLoad = useCallback(() => {
    setImgStatus(prev => ({...prev, loading: false, error: false}));
  }, []);
  
  const handleImageError = useCallback(() => {
    // 如果圖片載入失敗，嘗試使用備用圖片
    const fallbackSrc = '/images/case-placeholder.jpg';
    setImgStatus(prev => ({...prev, loading: false, error: true}));
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const cardContent = (
    <div 
      className={`
        h-full bg-white rounded-lg overflow-hidden
        border border-gray-100 shadow-sm
        transition-all duration-300
        ${isHovered ? 'shadow-lg translate-y-[-4px]' : ''}
        ${isCompact ? 'aspect-[3/2]' : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      <motion.div 
        variants={caseAnimations.card}
        initial="hidden"
        animate="visible"
        custom={index}
        className="h-full flex flex-col"
      >
        {/* 圖片區域 */}
        <div className={`
          relative overflow-hidden 
          ${isCompact ? 'aspect-[3/2]' : 'aspect-[4/3]'}
        `}>
          {/* 載入中狀態 */}
          {imgStatus.loading && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
            </div>
          )}
          
          {/* 圖片組件 */}
          <Image
            src={imgStatus.error ? '/images/case-placeholder.jpg' : imgSrc}
            alt={caseStudy.name}
            fill
            sizes={isCompact 
              ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className={`
              object-cover transition-transform duration-500
              ${isHovered ? 'scale-110' : 'scale-100'}
              ${imgStatus.loading ? 'opacity-0' : 'opacity-100'}
            `}
            priority={index <= 2}
            loading={index <= 2 ? 'eager' : 'lazy'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            fetchPriority={index <= 2 ? 'high' : 'auto'}
            quality={index <= 4 ? 85 : 75}
          />
          
          {/* 圖片覆蓋層 */}
          <div className={`
            absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-80'}
          `} />
          
          {/* 類別標籤 */}
          <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
            {caseStudy.category && (
              <div className="bg-primary/90 backdrop-blur-sm text-white font-medium px-3 py-1 rounded-full text-xs">
                {caseStudy.category}
              </div>
            )}
            
            {caseStudy.featured && (
              <div className="bg-amber-500/90 backdrop-blur-sm text-white font-medium px-3 py-1 rounded-full text-xs">
                精選
              </div>
            )}
          </div>
          
          {/* 案例名稱和描述 */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className={`
              text-white font-bold 
              ${isCompact ? 'text-base' : 'text-xl'}
              line-clamp-2 drop-shadow-lg
              transition-transform duration-300
              ${isHovered ? 'translate-y-[-2px]' : ''}
            `}>
              {caseStudy.name}
            </h3>
            
            {!isCompact && caseStudy.description && (
              <p className="text-white/90 text-sm mt-2 line-clamp-2 drop-shadow-lg">
                {caseStudy.description}
              </p>
            )}
          </div>
        </div>
        
        {/* 內容區域 - 僅在標準模式下顯示 */}
        {!isCompact && (
          <div className="flex-1 flex flex-col p-4">
            {/* 績效指標 */}
            {Array.isArray(caseStudy.metrics) && caseStudy.metrics.length > 0 && (
              <div className="mt-auto">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <span className="font-bold text-primary text-sm mr-2">
                        {metric.value}
                      </span>
                      <span className="text-gray-600 text-xs">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 解決方案計數 */}
            {Array.isArray(caseStudy.solutions) && caseStudy.solutions.length > 0 && (
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {caseStudy.solutions.length} 項解決方案
                </span>
                <div className="flex items-center text-primary text-sm font-medium">
                  查看詳情
                  <svg 
                    className="w-4 h-4 ml-1 transform transition-transform duration-200 group-hover:translate-x-1" 
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
            )}
          </div>
        )}
      </motion.div>
    </div>
  );

  if (hasParentLink || !isLinked) {
    return cardContent;
  }
  
  return (
    <Link 
      href={`/case/${caseStudy.id}`} 
      prefetch={true}
      className="block h-full"
    >
      {cardContent}
    </Link>
  );
}); 

// 重命名組件以便於調試
CaseCard.displayName = 'CaseCard'; 