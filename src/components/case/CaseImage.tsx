'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CaseStudy } from '@/content/cases/types'

interface CaseImageProps {
  caseStudy: CaseStudy;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  usePlaceholder?: boolean;
  animate?: boolean;
  showLoader?: boolean;
}

// 預設圖片路徑
const DEFAULT_PLACEHOLDER = '/images/cases/case-placeholder.jpg';

export const CaseImage = ({
  caseStudy,
  priority = false,
  fill = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  className = "",
  containerClassName = "",
  aspectRatio = "aspect-video",
  usePlaceholder = true,
  animate = true,
  showLoader = true
}: CaseImageProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [src, setSrc] = useState<string>(DEFAULT_PLACEHOLDER);

  // 圖片來源處理邏輯
  useEffect(() => {
    // 決定要使用的圖片來源
    let imgSrc = DEFAULT_PLACEHOLDER;
    
    if (caseStudy.image) {
      imgSrc = caseStudy.image;
    } else if (caseStudy.id) {
      imgSrc = `/images/cases/${caseStudy.id}.jpg`;
    }
    
    setSrc(imgSrc);
  }, [caseStudy]);

  // 根據是否需要動畫決定使用的容器元素
  const Container = animate ? motion.div : 'div';
  
  // 動畫屬性
  const animationProps = animate ? {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 }
  } : {};

  return (
    <Container 
      className={`relative ${aspectRatio} overflow-hidden bg-gray-100 ${containerClassName}`}
      {...animationProps}
    >
      {/* 載入狀態 */}
      {loading && showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
        </div>
      )}

      {/* 圖片內容 */}
      {!error ? (
        <Image
          src={src || DEFAULT_PLACEHOLDER}
          alt={caseStudy.name || '案例圖片'}
          fill={fill}
          sizes={sizes}
          priority={priority}
          className={`object-cover transition-all duration-300 ${loading ? 'opacity-0' : 'opacity-100'} ${className}`}
          onLoadingComplete={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
            if (usePlaceholder) {
              setSrc(DEFAULT_PLACEHOLDER);
            }
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          <span className="text-4xl">📷</span>
        </div>
      )}

      {/* 漸層遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Container>
  );
};

export default CaseImage; 