'use client'

import React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CaseCardProps } from '@/types/case'
import { caseAnimations } from '@/utils/animations'
import { handleCaseImageError, formatMetricValue } from '@/utils/case'

// 使用memo包裝CaseCard以避免不必要的重渲染
export const CaseCard = React.memo(({ 
  caseStudy, 
  index, 
  variant = 'standard',
  showMetrics = true,
  aspectRatio = '16/9',
  priority = false
}: CaseCardProps): React.ReactElement => {
  // 圖片源計算邏輯
  const imgSrc = useMemo(() => {
    // 檢查圖片路徑是否有效
    if (caseStudy.image) {
      return caseStudy.image;
    }
    
    // 使用預設圖片
    return '/images/case-placeholder.jpg';
  }, [caseStudy.image]);
  
  const [isHovered, setIsHovered] = useState(false);
  const [imgStatus, setImgStatus] = useState({
    error: false,
    loading: true
  });
  
  // 優化圖片載入處理
  const handleImageLoad = useCallback(() => {
    setImgStatus({ loading: false, error: false });
  }, []);
  
  const handleImageError = useCallback(() => {
    setImgStatus({ loading: false, error: true });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // 優化圖片加載策略
  const imageLoadingStrategy = useMemo(() => {
    return priority || index < 4 ? 'eager' : 'lazy';
  }, [index, priority]);

  // 優化圖片品質設置
  const imageQuality = useMemo(() => {
    if (priority || index < 3) return 90;
    if (index < 8) return 80;
    return 70;
  }, [index, priority]);

  // 根據不同變體選擇卡片樣式
  const cardStyle = useMemo(() => {
    switch (variant) {
      case 'featured':
        return 'bg-white border-t-4 border-primary';
      case 'minimal':
        return 'bg-white';
      default: // standard
        return 'bg-white';
    }
  }, [variant]);

  const cardContent = (
    <div 
      className={`
        h-full transition-all duration-300 group
        ${cardStyle}
        ${isHovered ? 'shadow-md' : 'shadow-sm'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-full flex flex-col">
        {/* 圖片區域 */}
        <div className={`
          relative overflow-hidden
          ${`aspect-[${aspectRatio}]`}
        `}>
          {/* 載入中狀態 */}
          {imgStatus.loading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
            </div>
          )}
          
          {/* 圖片組件 */}
          <Image
            src={imgStatus.error ? '/images/case-placeholder.jpg' : imgSrc}
            alt={caseStudy.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`
              object-cover transition-all duration-500
              ${imgStatus.loading ? 'opacity-0' : 'opacity-100'}
            `}
            priority={priority || index <= 2}
            loading={imageLoadingStrategy}
            onLoad={handleImageLoad}
            onError={handleImageError}
            fetchPriority={priority || index <= 2 ? 'high' : 'auto'}
            quality={imageQuality}
          />
          
          {/* 圖片覆蓋層 - 扁平化設計 */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-primary text-white px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              查看案例詳情
            </div>
          </div>
          
          {/* 類別標籤 */}
          <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
            {caseStudy.category && (
              <div className="bg-primary/90 text-white font-medium px-3 py-1 text-xs">
                {caseStudy.category}
              </div>
            )}
            
            {caseStudy.featured && (
              <div className="bg-amber-500/90 text-white font-medium px-3 py-1 text-xs">
                精選
              </div>
            )}
          </div>
        </div>
        
        {/* 內容區域 */}
        <div className="flex-1 flex flex-col p-5">
          <h3 className="font-bold text-gray-900 text-lg mb-2">
            {caseStudy.name}
          </h3>
          
          {caseStudy.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {caseStudy.description}
            </p>
          )}
          
          {/* 績效指標 */}
          {showMetrics && Array.isArray(caseStudy.metrics) && caseStudy.metrics.length > 0 && (
            <div className="mt-auto">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
                  <div 
                    key={idx} 
                    className="border border-gray-200 px-3 py-2"
                  >
                    <div className="font-bold text-primary text-lg">
                      {formatMetricValue(metric.value, metric.prefix, metric.suffix)}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 標籤和類別 */}
          {(caseStudy.badges || caseStudy.category) && (
            <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-100">
              {caseStudy.badges?.map((badge, idx) => (
                <span key={idx} className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1">
                  {badge}
                </span>
              ))}
              {caseStudy.category && !caseStudy.badges?.includes(caseStudy.category) && (
                <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1">
                  {caseStudy.category}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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