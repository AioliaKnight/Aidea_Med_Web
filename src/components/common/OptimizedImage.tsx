import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  lowQualitySrc?: string; // 用於漸進式加載的低質量圖片
  isLCP?: boolean; // 是否為 LCP 元素
  withBlur?: boolean; // 是否使用模糊效果
  lazyBoundary?: string; // 延遲加載邊界
}

/**
 * 優化圖片組件
 * 
 * 特點：
 * 1. 自動延遲載入畫面外圖片
 * 2. LCP 元素使用 fetchpriority="high"
 * 3. 支援漸進式加載 (先顯示低質量圖片，再加載高質量圖片)
 * 4. 可選模糊效果
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  lowQualitySrc,
  isLCP = false,
  withBlur = true,
  className,
  alt,
  lazyBoundary = '200px',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [usedSrc, setUsedSrc] = useState(lowQualitySrc || src);

  // 監聽 Intersection Observer 以延遲加載非 LCP 圖片
  useEffect(() => {
    if (!lowQualitySrc || isLCP) {
      setUsedSrc(src);
      return;
    }

    // 非 LCP 元素才需要延遲加載原始圖片
    const timer = setTimeout(() => {
      setUsedSrc(src);
    }, isLCP ? 0 : 300); // LCP 元素立即加載，其他 300ms 後加載

    return () => clearTimeout(timer);
  }, [src, lowQualitySrc, isLCP]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={usedSrc}
        alt={alt || ''}
        className={cn(
          'transition-opacity duration-300 ease-in-out',
          withBlur && !isLoaded && 'blur-sm scale-[1.02]',
          isLoaded && 'blur-0'
        )}
        fetchPriority={isLCP ? 'high' : 'auto'}
        loading={isLCP ? 'eager' : 'lazy'}
        lazyBoundary={lazyBoundary}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage; 