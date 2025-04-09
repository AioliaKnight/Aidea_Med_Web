'use client'

import React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CaseCardProps } from '@/types/case'
import { handleCaseImageError, formatMetricValue } from '@/utils/case'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

// 使用memo包裝CaseCard以避免不必要的重渲染
export const CaseCard = React.memo(({ 
  caseStudy, 
  index, 
  variant = 'standard',
  showMetrics = true,
  aspectRatio = '16/9',
  priority = false,
  isCircular = false,
  isCompact = false
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
    console.log(`圖片載入失敗: ${imgSrc}`);
  }, [imgSrc]);

  // 預先載入圖片 - 添加這段代碼確保圖片預載入
  useEffect(() => {
    const preloadImage = new window.Image();
    preloadImage.src = imgStatus.error ? '/images/case-placeholder.jpg' : imgSrc;
    preloadImage.onload = () => handleImageLoad();
    preloadImage.onerror = () => handleImageError();
    
    return () => {
      preloadImage.onload = null;
      preloadImage.onerror = null;
    };
  }, [imgSrc, imgStatus.error, handleImageLoad, handleImageError]);

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

  // 選擇Card變體
  const cardVariant = useMemo(() => {
    switch (variant) {
      case 'featured':
        return 'accent';
      case 'minimal':
        return 'flat';
      default: // standard
        return 'default';
    }
  }, [variant]);

  return (
    // 暫時禁用案例詳情頁面連結 - 將Link標籤改為div
    <div className="block h-full">
      <Card 
        variant={cardVariant}
        hoverEffect="lift"
        isClickable
        className={cn(
          "h-full",
          isCircular ? 'pt-3 text-center' : ''
        )}
      >
        {/* 類別標籤 - 移至圖片外部頂部 */}
        <div className="flex justify-between items-center px-3 py-2">
          {caseStudy.category && (
            <div className="text-primary font-medium text-xs tracking-wide">
              {caseStudy.category}
            </div>
          )}
          
          {caseStudy.featured && (
            <div className="text-gray-900 font-medium text-xs tracking-wide flex items-center">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1"></span>
              精選案例
            </div>
          )}
        </div>
        
        {/* 圖片區域 */}
        <div className={isCircular 
          ? "relative overflow-hidden rounded-full aspect-square mx-auto w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] border-4 border-white" 
          : `relative overflow-hidden aspect-[${aspectRatio}]`
        }>
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
            sizes={isCircular 
              ? "(max-width: 640px) 160px, (max-width: 768px) 180px, 200px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className={`
              object-cover ${isCircular ? 'object-center' : ''}
              transition-all duration-500
              ${imgStatus.loading ? 'opacity-0' : 'opacity-100'}
              group-hover:scale-105
            `}
            priority={priority || index <= 2}
            loading={imageLoadingStrategy}
            onLoad={handleImageLoad}
            onError={handleImageError}
            fetchPriority={priority || index <= 2 ? 'high' : 'auto'}
            quality={imageQuality}
          />
          
        </div>
        
        {/* 內容區域 */}
        <div className="flex-1 flex flex-col p-3 sm:p-4">
          <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight mb-2">
            {caseStudy.name}
          </h3>
          
          {caseStudy.description && !isCompact && (
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2">
              {caseStudy.description}
            </p>
          )}
          
          {/* 績效指標 - 扁平化設計 */}
          {showMetrics && Array.isArray(caseStudy.metrics) && caseStudy.metrics.length > 0 && !isCompact && (
            <div className="mt-auto">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
                  <div 
                    key={idx} 
                    className="bg-gray-50 px-2 sm:px-3 py-2 sm:py-3"
                  >
                    <div className="font-bold text-primary text-base sm:text-lg leading-none mb-1">
                      {formatMetricValue(metric.value, metric.prefix, metric.suffix)}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 標籤顯示 */}
          {caseStudy.badges && caseStudy.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-auto pt-2 sm:pt-3">
              {caseStudy.badges.slice(0, isCompact ? 1 : 2).map((badge, idx) => (
                <span key={idx} className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 sm:py-1 rounded-sm">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
});

// 重命名組件以便於調試
CaseCard.displayName = 'CaseCard'; 