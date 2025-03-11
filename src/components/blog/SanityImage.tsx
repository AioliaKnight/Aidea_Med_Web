import { useState } from 'react';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity/client';
import { SanityImage as SanityImageType } from '@/types/blog';

interface SanityImageProps {
  image: SanityImageType | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  fallbackSrc?: string;
}

export default function SanityImage({
  image,
  alt = '文章圖片',
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  priority = false,
  className = '',
  fallbackSrc = '/images/placeholder.jpg',
}: SanityImageProps) {
  const [isError, setIsError] = useState(false);
  
  // 如果沒有圖片或圖片載入錯誤，則使用預設圖片
  if (!image || isError) {
    return fill ? (
      // 當 fill 為 true 時
      <Image
        src={fallbackSrc}
        alt={alt}
        fill={true}
        sizes={sizes}
        priority={priority}
        className={`${className} object-cover`}
      />
    ) : (
      // 當 fill 為 false 時
      <Image
        src={fallbackSrc}
        alt={alt}
        width={width || 600}
        height={height || 400}
        sizes={sizes}
        priority={priority}
        className={`${className} object-cover`}
      />
    );
  }
  
  // 使用 Sanity 圖片 URL
  const imageUrl = urlForImage(image)
    .width(width || 1200)
    .height(height || 800)
    .url();
  
  return fill ? (
    // 當 fill 為 true 時
    <Image
      src={imageUrl}
      alt={alt || image.alt || '文章圖片'}
      fill={true}
      sizes={sizes}
      priority={priority}
      className={`${className} object-cover`}
      onError={() => setIsError(true)}
      placeholder={image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
      blurDataURL={image?.asset?.metadata?.lqip}
    />
  ) : (
    // 當 fill 為 false 時
    <Image
      src={imageUrl}
      alt={alt || image.alt || '文章圖片'}
      width={width || 600}
      height={height || 400}
      sizes={sizes}
      priority={priority}
      className={`${className} object-cover`}
      onError={() => setIsError(true)}
      placeholder={image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
      blurDataURL={image?.asset?.metadata?.lqip}
    />
  );
} 