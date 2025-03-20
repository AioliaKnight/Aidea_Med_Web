'use client'

import React, { useState, useEffect, memo } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  /**
   * 圖片來源
   */
  src: string;
  /**
   * 用於漸進式加載的低質量圖片或模糊佔位符的 Data URL
   * 建議使用小型模糊版本的 base64 格式圖片
   */
  blurDataURL?: string;
  /**
   * 是否為最大內容繪製 (LCP) 元素，優先載入
   * @default false
   */
  isLCP?: boolean;
  /**
   * 是否使用模糊效果
   * @default true
   */
  withBlur?: boolean;
  /**
   * 延遲加載邊界
   * @default '200px'
   */
  lazyBoundary?: string;
  /**
   * 圖片質量 (1-100)
   * @default 75
   */
  quality?: number;
  /**
   * 螢幕尺寸斷點的圖片尺寸設定
   * @default "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
   */
  sizes?: string;
  /**
   * 當圖片載入完成時的回調
   */
  onLoadComplete?: () => void;
}

/**
 * 優化圖片組件
 * 
 * 特點：
 * 1. 自動延遲載入畫面外圖片
 * 2. LCP 元素使用 fetchpriority="high"
 * 3. 支援模糊佔位符和漸進式載入
 * 4. 自適應圖片大小 (responsive sizes)
 * 5. 自動優化圖片格式 (WebP/AVIF)
 * 6. 記憶化 (memoization) 以避免不必要重新渲染
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  blurDataURL,
  isLCP = false,
  withBlur = true,
  className,
  alt,
  lazyBoundary = '200px',
  quality = 75,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  onLoadComplete,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // 使用 Intersection Observer API 進行優化延遲載入策略
  useEffect(() => {
    // 已加載或是 LCP 元素則不需要觀察
    if (isLoaded || isLCP) return;
    
    // 創建 IntersectionObserver 實例
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 元素可見時，設置為已加載狀態
            setIsLoaded(true);
            // 停止觀察
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: lazyBoundary,
        threshold: 0.1
      }
    );

    // 獲取包含元素的 DOM 節點
    const container = document.getElementById(`img-container-${src.replace(/\W/g, '')}`);
    if (container) {
      observer.observe(container);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, isLCP, isLoaded, lazyBoundary]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoadComplete) {
      onLoadComplete();
    }
  };

  const handleError = () => {
    setError(true);
    console.error(`Failed to load image: ${src}`);
  };

  return (
    <div 
      id={`img-container-${src.replace(/\W/g, '')}`}
      className={cn(
        'relative overflow-hidden', 
        className
      )}
    >
      <Image
        src={error ? '/images/placeholder.webp' : src}
        alt={alt || ''}
        className={cn(
          'transition-all duration-300 ease-in-out',
          withBlur && !isLoaded && blurDataURL && 'blur-sm scale-[1.02]',
          isLoaded && 'blur-0'
        )}
        fetchPriority={isLCP ? 'high' : 'auto'}
        loading={isLCP ? 'eager' : 'lazy'}
        quality={quality}
        sizes={sizes}
        placeholder={withBlur && blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* 載入動畫指示器 */}
      {!isLoaded && !blurDataURL && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 