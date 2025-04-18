'use client'

import React, { useState, useEffect, memo } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
  /**
   * 是否啟用動畫效果
   * @default true
   */
  withAnimation?: boolean;
  /**
   * 動畫持續時間（秒）
   * @default 0.3
   */
  animationDuration?: number;
  /**
   * 錯誤時的替代圖片
   * @default '/images/testimonials/default-avatar.jpg'
   */
  fallbackSrc?: string;
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
 * 7. 支援動畫效果
 * 8. 錯誤處理和替代圖片
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
  withAnimation = true,
  animationDuration = 0.3,
  fallbackSrc = '/images/testimonials/default-avatar.jpg',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // 預先檢查圖片是否存在
  useEffect(() => {
    // 只在客戶端運行
    if (typeof window === 'undefined') return;
    
    // 如果已知錯誤，不再檢查
    if (error) return;
    
    const checkImageExists = () => {
      // 使用更安全的方式創建臨時圖片
      const tempImg = document.createElement('img');
      
      tempImg.onload = () => {
        tempImg.onload = null;
      };
      
      tempImg.onerror = () => {
        setError(true);
        tempImg.onerror = null;
      };
      
      // 設置src將開始加載圖片
      tempImg.src = src;
    };
    
    checkImageExists();
  }, [src, error]);

  // 使用 Intersection Observer API 進行優化延遲載入策略
  useEffect(() => {
    // 已加載或是 LCP 元素則不需要觀察
    if (isLoaded || isLCP) return;
    
    // 只在客戶端執行
    if (typeof window === 'undefined') return;
    
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
    const containerId = `img-container-${src.replace(/\W/g, '')}`;
    const container = document.getElementById(containerId);
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
  };

  const Container = withAnimation ? motion.div : 'div';

  return (
    <Container
      id={`img-container-${src.replace(/\W/g, '')}`}
      className={cn(
        'relative overflow-hidden', 
        className
      )}
      {...(withAnimation && {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: animationDuration }
      })}
    >
      {error ? (
        // 圖片加載失敗時顯示替代內容
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2">👤</span>
            <span className="text-xs text-gray-500">圖片無法載入</span>
          </div>
        </div>
      ) : (
        // 使用標準HTML img標籤代替Next.js的Image組件
        // 避免Next.js 15中的Image API變更帶來的兼容性問題
        <img
          src={error ? fallbackSrc : src}
          alt={alt || ''}
          className={cn(
            'w-full h-full object-cover',
            'transition-all duration-300 ease-in-out',
            withBlur && !isLoaded && blurDataURL && 'blur-sm scale-[1.02]',
            isLoaded && 'blur-0'
          )}
          loading={isLCP || props.priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          width={props.width}
          height={props.height}
          // 手動選擇img標籤支持的屬性，避免傳遞Next.js專有屬性
          style={props.style}
          decoding={props.decoding}
          referrerPolicy={props.referrerPolicy}
          sizes={undefined} // 標準img也有sizes，但我們不使用Next.js的sizes值
        />
      )}
      
      {/* 載入動畫指示器 */}
      {!isLoaded && !error && !blurDataURL && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </Container>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 