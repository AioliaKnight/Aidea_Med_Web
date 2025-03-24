'use client'

import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CaseStudy } from '@/components/pages/CasePage'

export interface CaseCardProps {
  caseStudy: CaseStudy;
  index: number;
  isLinked?: boolean; // 新增屬性：是否需要被Link包裹
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
export const CaseCard = React.memo(({ caseStudy, index, isLinked = true }: CaseCardProps): React.ReactElement => {
  // 合併相關的圖片狀態為一個狀態對象
  const [imageState, setImageState] = useState({
    loading: true,
    error: false,
    src: '/cases/case-placeholder.jpg' // 默認圖片
  });
  
  // 新增狀態
  const [isHovered, setIsHovered] = useState(false);
  
  // 使用 useMemo 計算動畫延遲，避免過長延遲
  const animationDelay = useMemo(() => Math.min(index * 0.1, 0.5), [index]);
  
  // 優化圖片處理邏輯
  useEffect(() => {
    let imgSrc = imageState.src;
    
    // 確定圖片來源
    if (caseStudy.image) {
      imgSrc = caseStudy.image;
    } else if (caseStudy.id && VALID_CASE_IDS.includes(caseStudy.id)) {
      imgSrc = `/cases/${caseStudy.id}.jpg`;
    }
    
    // 只有在圖片路徑變化時才更新狀態
    if (imgSrc !== imageState.src) {
      setImageState(prev => ({ ...prev, src: imgSrc }));
    }
  }, [caseStudy.image, caseStudy.id, imageState.src]);
  
  // 圖片加載狀態處理
  const handleImageLoad = () => {
    setImageState(prev => ({ ...prev, loading: false, error: false }));
  };
  
  const handleImageError = () => {
    setImageState(prev => ({ 
      ...prev, 
      loading: false, 
      error: true,
      src: '/cases/case-placeholder.jpg'
    }));
  };

  // 建立卡片內容
  const cardContent = (
    <div 
      className={`
        h-full bg-white border border-gray-100 transition-all duration-400
        ${isHovered ? 'shadow-lg translate-y-[-5px]' : 'shadow-md'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
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
        <div className="relative overflow-hidden aspect-[4/3]">
          {imageState.loading && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent animate-spin rounded-full" />
            </div>
          )}
          
          <Image
            src={imageState.src}
            alt={caseStudy.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`
              object-cover transition-transform duration-400 
              ${isHovered ? 'scale-105' : 'scale-100'}
            `}
            priority={index <= 3} // 只對前3個案例設置為優先加載
            loading={index <= 3 ? 'eager' : 'lazy'}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {/* 圖片覆蓋層 */}
          <div className={`
            absolute inset-0 bg-black transition-opacity duration-400
            ${isHovered ? 'opacity-20' : 'opacity-0'}
          `} />
          
          {/* 類別標籤 */}
          {caseStudy.category && (
            <div className="absolute left-0 top-3 bg-primary text-white px-3 py-1 text-xs font-medium">
              {caseStudy.category}
            </div>
          )}
          
          {/* 精選標籤 */}
          {caseStudy.featured && (
            <div className="absolute right-0 top-3 bg-amber-500 text-white px-3 py-1 text-xs font-medium">
              精選案例
            </div>
          )}
        </div>
        
        {/* 內容區域 */}
        <div className="flex-1 p-5 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{caseStudy.name}</h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {caseStudy.description}
          </p>
          
          {/* 績效指標 */}
          {Array.isArray(caseStudy.metrics) && caseStudy.metrics.length > 0 && (
            <div className="mt-auto">
              <div className="flex flex-wrap gap-3 mb-4">
                {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
                  <div key={idx} className="flex items-center border-l-4 border-primary pl-2 py-1">
                    <span className="text-lg font-bold text-primary">{metric.value}</span>
                    <span className="text-xs text-gray-600 ml-1">{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 解決方案提示 */}
          {Array.isArray(caseStudy.solutions) && caseStudy.solutions.length > 0 && (
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
})); 