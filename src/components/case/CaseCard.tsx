'use client'

import React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CaseCardProps } from '@/types/case'
import { handleCaseImageError, formatMetricValue } from '@/utils/case'
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
    if (caseStudy.image) {
      return caseStudy.image;
    }
    return '/images/case-placeholder.jpg';
  }, [caseStudy.image]);
  
  const [imgStatus, setImgStatus] = useState({
    error: false,
    loading: true
  });
  
  const [isHovered, setIsHovered] = useState(false);
  
  // 優化圖片載入處理
  const handleImageLoad = useCallback(() => {
    setImgStatus({ loading: false, error: false });
  }, []);
  
  const handleImageError = useCallback(() => {
    setImgStatus({ loading: false, error: true });
  }, []);

  // 預先載入圖片
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

  // 動畫變體
  const cardVariants = {
    initial: { 
      y: 20, 
      opacity: 0,
      scale: 0.95
    },
    animate: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.6 }
    }
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group h-full"
    >
      <div className={cn(
        "relative h-full bg-white rounded-3xl overflow-hidden transition-all duration-500",
        "shadow-sm hover:shadow-2xl hover:shadow-primary/10",
        "border border-gray-100 hover:border-primary/20",
        variant === 'featured' && "ring-2 ring-primary/20 bg-gradient-to-br from-white to-primary/5",
        isCircular ? 'pt-6 text-center' : ''
      )}>
        {/* 精選標籤 */}
        {caseStudy.featured && (
          <div className="absolute top-4 left-4 z-20">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              精選
            </div>
          </div>
        )}

        {/* 類別標籤 */}
        <div className="absolute top-4 right-4 z-20">
          <div className="px-3 py-1.5 bg-black/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {caseStudy.category}
          </div>
        </div>
        
        {/* 圖片區域 */}
        <div className={cn(
          "relative overflow-hidden",
          isCircular 
            ? "mx-auto w-[200px] h-[200px] rounded-full border-4 border-white shadow-xl" 
            : `aspect-[${aspectRatio}]`
        )}>
          {/* 載入中狀態 */}
          {imgStatus.loading && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary animate-spin rounded-full" />
                <div className="absolute inset-2 border-2 border-primary/10 border-b-primary/30 animate-spin rounded-full animation-delay-150" />
              </div>
            </div>
          )}
          
          {/* 圖片組件 */}
          <motion.div
            variants={imageVariants}
            className="relative w-full h-full"
          >
            <Image
              src={imgStatus.error ? '/images/case-placeholder.jpg' : imgSrc}
              alt={caseStudy.name}
              fill
              sizes={isCircular 
                ? "200px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              className={cn(
                "object-cover transition-all duration-700",
                isCircular ? 'object-center' : '',
                imgStatus.loading ? 'opacity-0' : 'opacity-100'
              )}
              priority={priority || index <= 2}
              loading={imageLoadingStrategy}
              onLoad={handleImageLoad}
              onError={handleImageError}
              fetchPriority={priority || index <= 2 ? 'high' : 'auto'}
              quality={imageQuality}
            />
          </motion.div>
          
          {/* 懸浮覆蓋層 */}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center"
          >
            <div className="p-4 text-center">
              <button className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 font-medium rounded-full hover:bg-white transition-all duration-300 shadow-lg">
                查看詳情
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* 內容區域 */}
        <div className="flex-1 flex flex-col p-6">
          {/* 標題區域 */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
              {caseStudy.name}
            </h3>
            
            {caseStudy.description && !isCompact && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {caseStudy.description}
              </p>
            )}
          </div>
          
          {/* 績效指標 - 現代化設計 */}
          {showMetrics && Array.isArray(caseStudy.metrics) && caseStudy.metrics.length > 0 && !isCompact && (
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-3">
                {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * idx }}
                    className="relative group/metric"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-md">
                      <div className="font-bold text-primary text-xl leading-none mb-2 group-hover/metric:scale-110 transition-transform duration-300">
                        {formatMetricValue(metric.value, metric.prefix, metric.suffix)}
                      </div>
                      <div className="text-gray-600 text-xs font-medium">
                        {metric.label}
                      </div>
                      
                      {/* 裝飾性元素 */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary/20 rounded-full group-hover/metric:bg-primary/40 transition-colors"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* 標籤顯示 */}
          {caseStudy.badges && caseStudy.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {caseStudy.badges.slice(0, isCompact ? 1 : 3).map((badge, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center text-xs bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 py-1 rounded-full font-medium border border-primary/10"
                >
                  {badge}
                </span>
              ))}
              {caseStudy.badges.length > (isCompact ? 1 : 3) && (
                <span className="inline-flex items-center text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
                  +{caseStudy.badges.length - (isCompact ? 1 : 3)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 懸浮時的邊框光效 */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-xl"></div>
        </div>
      </div>
    </motion.div>
  );
});

// 重命名組件以便於調試
CaseCard.displayName = 'CaseCard'; 