# 網站圖片整合指南

本文件提供如何在您的網站中有效利用圖片處理工具所產生的圖片資源，以達到最佳的網站效能和用戶體驗。

## 處理後的圖片資源

使用圖片處理工具後，您將擁有以下資源：

1. **原始圖片**: `/image-name.jpg` 或 `/image-name.png`
2. **WebP 格式**: `/image-name.webp`
3. **小尺寸版本**: `/image-name_sm.webp` 或 `/image-name_sm.jpg` (適合手機)
4. **中尺寸版本**: `/image-name_md.webp` 或 `/image-name_md.jpg` (適合平板)
5. **預覽圖**: `/image-name_placeholder.webp` (模糊預載)

## Next.js 整合

### 基本使用（使用 Next.js Image 組件）

```jsx
import Image from 'next/image';

// 基本使用
<Image
  src="/images/case-study.webp"
  alt="案例研究"
  width={800}
  height={600}
  priority // 對於重要圖片，例如首屏顯示的圖片
/>
```

### 使用響應式尺寸

```jsx
import Image from 'next/image';

<Image
  src="/images/case-study.webp"
  alt="案例研究"
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
  className="object-cover"
/>
```

### 使用多格式和尺寸（最佳實踐）

使用自定義圖片組件來處理多種格式和尺寸：

```jsx
// components/ResponsiveImage.jsx
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}) {
  // 根據 src 生成不同格式和尺寸的路徑
  const baseSrc = src.replace(/\.(jpg|jpeg|png|webp)$/, '');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 生成 srcSet
  const webpSrcSet = `${baseSrc}_sm.webp 640w, ${baseSrc}_md.webp 1024w, ${baseSrc}.webp 1920w`;
  const fallbackSrcSet = `${baseSrc}_sm.jpg 640w, ${baseSrc}_md.jpg 1024w, ${baseSrc}.jpg 1920w`;
  
  // 使用 picture 元素提供多種格式
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* 模糊預載圖片 */}
      {!isLoaded && !priority && (
        <Image
          src={`${baseSrc}_placeholder.webp`}
          alt=""
          fill
          className="object-cover blur-lg transition-opacity"
        />
      )}
      
      <picture>
        {/* WebP 格式，支援現代瀏覽器 */}
        <source
          srcSet={webpSrcSet}
          type="image/webp"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* 傳統格式，用於舊瀏覽器 */}
        <source
          srcSet={fallbackSrcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* 後備圖片 */}
        <img
          src={`${baseSrc}.jpg`}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
        />
      </picture>
    </div>
  );
}
```

使用方式：

```jsx
import ResponsiveImage from '@/components/ResponsiveImage';

// 在頁面中使用
<ResponsiveImage
  src="/images/case-study.jpg"
  alt="案例研究"
  width={800}
  height={600}
  priority={true}
/>
```

## React 整合

### 使用 Picture 元素實現最佳兼容性

```jsx
function OptimizedImage({ src, alt, width, height, className = '' }) {
  // 從路徑中移除副檔名
  const baseSrc = src.replace(/\.(jpg|jpeg|png|webp)$/, '');
  
  return (
    <picture>
      <source 
        srcSet={`${baseSrc}.webp`}
        type="image/webp" 
      />
      <source 
        srcSet={`${baseSrc}.jpg`}
        type="image/jpeg" 
      />
      <img
        src={`${baseSrc}.jpg`} 
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={className}
      />
    </picture>
  );
}
```

### 響應式圖片組件

```jsx
function ResponsiveImage({ src, alt, className = '' }) {
  const baseSrc = src.replace(/\.(jpg|jpeg|png|webp)$/, '');
  
  return (
    <picture>
      {/* WebP 格式 */}
      <source
        media="(max-width: 640px)"
        srcSet={`${baseSrc}_sm.webp`}
        type="image/webp"
      />
      <source
        media="(max-width: 1024px)"
        srcSet={`${baseSrc}_md.webp`}
        type="image/webp"
      />
      <source
        srcSet={`${baseSrc}.webp`}
        type="image/webp"
      />
      
      {/* 傳統格式備用 */}
      <source
        media="(max-width: 640px)"
        srcSet={`${baseSrc}_sm.jpg`}
      />
      <source
        media="(max-width: 1024px)"
        srcSet={`${baseSrc}_md.jpg`}
      />
      <img
        src={`${baseSrc}.jpg`}
        alt={alt}
        className={className}
        loading="lazy"
      />
    </picture>
  );
}
```

## HTML 整合

如果不使用框架，可以直接在 HTML 中使用：

```html
<picture>
  <!-- WebP 格式 -->
  <source
    srcset="/images/banner_sm.webp 640w, /images/banner_md.webp 1024w, /images/banner.webp 1920w"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1920px"
    type="image/webp"
  >
  <!-- 傳統格式備用 -->
  <source
    srcset="/images/banner_sm.jpg 640w, /images/banner_md.jpg 1024w, /images/banner.jpg 1920w"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1920px"
  >
  <!-- 後備圖片 -->
  <img
    src="/images/banner.jpg"
    alt="橫幅圖片"
    width="1920"
    height="600"
    loading="lazy"
  >
</picture>
```

## 漸進式載入技術

實現模糊預載效果：

```jsx
import { useState, useEffect } from 'react';

function ProgressiveImage({ src, placeholderSrc, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`transition-all duration-500 ${
        isLoaded ? 'blur-0' : 'blur-lg'
      }`}
      {...props}
    />
  );
}

// 使用方式
<ProgressiveImage
  src="/images/case-study.jpg"
  placeholderSrc="/images/case-study_placeholder.jpg"
  alt="案例研究"
  width="800"
  height="600"
/>
```

## PWA 和 Favicon 整合

### 在 HTML 中引入 favicon

```html
<head>
  <!-- 基本 favicon -->
  <link rel="icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  
  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  
  <!-- Android Chrome 圖標 -->
  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
</head>
```

### 添加 PWA 圖標到 manifest.json

```json
{
  "name": "您的應用名稱",
  "short_name": "短名稱",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait"
}
```

## 最佳實踐建議

1. **總是使用相應的尺寸**：不要在小螢幕上載入大圖
2. **優先使用 WebP**：提供 WebP 作為主要格式，但總是提供備用格式
3. **使用延遲載入**：對於首屏以下的圖片使用 `loading="lazy"`
4. **模糊預載**：實現模糊預載效果提升用戶體驗
5. **正確設置 width 和 height**：避免佈局偏移 (CLS)
6. **使用 CDN**：將處理過的圖片放在 CDN 上加速載入
7. **使用智能裁剪**：針對特定比例的圖片容器使用智能裁剪
8. **考慮使用 LQIP**：低質量圖片預載技術 