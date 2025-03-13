'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { urlForImage } from '@/lib/sanity';
import { SanityImage as SanityImageType } from '@/types/blog';

interface SanityImageProps {
  image: SanityImageType;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
  // 新增易於使用的預設尺寸選項
  preset?: 'thumbnail' | 'small' | 'medium' | 'large' | 'full';
  // 新增失敗時的占位符選項
  fallbackSrc?: string;
  // 新增懶加載和淡入效果選項
  lazy?: boolean;
  fade?: boolean;
  onClick?: () => void;
  // 新增 fill 屬性支持
  fill?: boolean;
}

// 預設尺寸配置
const presetSizes = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 900, height: 600 },
  full: { width: 1200, height: 800 }
};

export default function SanityImage({
  image,
  width,
  height,
  priority = false,
  quality = 80,
  sizes,
  className = '',
  alt,
  style,
  preset,
  fallbackSrc = '/images/placeholder.jpg',
  lazy = true,
  fade = true,
  onClick,
  fill
}: SanityImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState(false);
  
  // 根據 preset 設置尺寸
  const dimensions = preset ? presetSizes[preset] : { width, height };
  const imageWidth = dimensions.width || 1200;
  const imageHeight = dimensions.height || 800;
  
  // 處理圖片 URL
  useEffect(() => {
    try {
      if (!image || !image.asset) {
        setError(true);
        return;
      }
      
      const builder = urlForImage(image);
      
      // 根據 builder 的類型處理
      if (typeof builder === 'string') {
        // 確保 URL 是有效的
        try {
          // 測試 URL 是否有效
          new URL(builder);
          setImageUrl(builder);
        } catch (e) {
          console.error('無效的圖片 URL:', builder);
          setError(true);
        }
      } else if (typeof builder === 'object' && typeof builder.width === 'function') {
        // 使用 builder 方法處理圖片
        setImageUrl(
          builder
            .width(imageWidth)
            .height(imageHeight)
            .quality(quality)
            .auto('format')
            .url()
        );
      } else {
        // 如果 builder 不符合預期格式
        console.error('Invalid image builder:', builder);
        setError(true);
      }
    } catch (err) {
      console.error('Error generating image URL:', err);
      setError(true);
    }
  }, [image, imageWidth, imageHeight, quality]);
  
  // 處理圖片載入完成
  const handleLoad = () => {
    setLoaded(true);
  };
  
  // 處理圖片載入錯誤
  const handleError = () => {
    console.warn('Failed to load image, using fallback');
    setError(true);
  };
  
  // 圖片加載錯誤時使用佔位圖
  if (error) {
    return (
      <Image 
        src={fallbackSrc}
        alt={alt || '圖片載入失敗'}
        width={imageWidth}
        height={imageHeight}
        className={className}
        style={style}
        onClick={onClick}
      />
    );
  }
  
  return (
    <div 
      className={`sanity-image-wrapper ${fade ? 'overflow-hidden' : ''}`}
      style={{ position: 'relative', ...(fill ? { width: '100%', height: '100%' } : {}) }}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={alt || image.alt || ''}
          {...(!fill ? {
            width: imageWidth,
            height: imageHeight,
          } : { fill: true })}
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={`${className} ${fade ? (loaded ? 'opacity-100 duration-700' : 'opacity-0') : ''}`}
          style={{ 
            transition: fade ? 'opacity 0.7s ease-in-out' : 'none',
            ...style 
          }}
          loading={lazy && !priority ? 'lazy' : undefined}
          onLoad={fade ? handleLoad : undefined}
          onError={handleError}
          onClick={onClick}
        />
      )}
    </div>
  );
} 