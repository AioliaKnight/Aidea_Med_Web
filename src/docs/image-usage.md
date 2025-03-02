# 圖片資源使用指南

本文件提供專案中圖片資源的使用建議，協助開發人員選擇適合的圖片格式和尺寸，優化網站性能。

## 圖片資源結構

轉換後的圖片資源遵循以下命名模式：

1. **原始圖片**: `/image-name.jpg` 或 `/image-name.png`
2. **WebP 格式**: `/image-name.webp`
3. **小尺寸版本**: `/image-name_sm.webp` 或 `/image-name_sm.jpg` (適合手機)
4. **中尺寸版本**: `/image-name_md.webp` 或 `/image-name_md.jpg` (適合平板)
5. **預覽圖**: `/image-name_placeholder.webp` 或 `/image-name_placeholder.jpg` (模糊預載)

## 如何在 Next.js 中使用圖片

### 1. 基本使用（使用 Next.js Image 組件）

```jsx
import Image from 'next/image';

// 基本使用
<Image
  src="/Case_1.webp"
  alt="案例研究"
  width={800}
  height={600}
  priority // 對於重要圖片，例如首屏顯示的圖片
/>
```

### 2. 使用響應式尺寸（推薦）

```jsx
import Image from 'next/image';

<Image
  src="/Case_1.webp"
  alt="案例研究"
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
  className="object-cover"
/>
```

### 3. 使用 Picture 元素實現多格式支援（最佳實踐）

```jsx
// 適合在自定義組件中使用
<picture>
  {/* WebP 格式，支援現代瀏覽器 */}
  <source
    srcSet={`${image}_sm.webp 640w, ${image}_md.webp 1024w, ${image}.webp 1920w`}
    type="image/webp"
  />
  {/* 傳統格式，用於舊瀏覽器 */}
  <source
    srcSet={`${image}_sm.jpg 640w, ${image}_md.jpg 1024w, ${image}.jpg 1920w`}
    type="image/jpeg"
  />
  {/* 後備圖片 */}
  <img
    src={image}
    alt={alt}
    className={className}
    width={width}
    height={height}
    loading={priority ? 'eager' : 'lazy'}
  />
</picture>
```

### 4. 圖片的漸進式載入（高級技巧）

```jsx
import { useState, useEffect } from 'react';
import Image from 'next/image';

const ProgressiveImage = ({ src, placeholderSrc, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);
  
  useEffect(() => {
    // 預加載高品質圖片
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
    };
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={`transition-opacity duration-500 ${
        imgSrc === placeholderSrc ? 'blur-lg' : 'blur-0'
      }`}
      {...props}
    />
  );
};

// 使用方式
<ProgressiveImage
  src="/Case_1.webp"
  placeholderSrc="/Case_1_placeholder.webp"
  alt="案例研究"
  width={800}
  height={600}
/>
```

## 圖片資源選擇指南

### 選擇圖片格式

1. **WebP 格式** (.webp)：
   - 首選格式，提供最佳壓縮效果
   - 適合大多數現代瀏覽器

2. **JPEG 格式** (.jpg)：
   - 適合照片和複雜圖像
   - 作為 WebP 的後備方案

3. **PNG 格式** (.png)：
   - 適合帶有透明度的圖像
   - 適合圖標、插圖等需要清晰邊緣的內容

### 選擇圖片尺寸

1. **小尺寸** (_sm)：
   - 寬度：640px
   - 適合移動設備和小屏幕

2. **中尺寸** (_md)：
   - 寬度：1024px
   - 適合平板和中等屏幕

3. **原始尺寸**：
   - 通常最大寬度為 1920px
   - 適合桌面和大屏幕

## 最佳實踐

1. **始終使用 WebP 作為主要格式**，但提供傳統格式作為後備
2. **使用響應式圖片尺寸**，避免在小屏幕設備上加載過大的圖片
3. **設置適當的 loading 屬性**：首屏圖片使用 `priority`，其他使用 `lazy`
4. **不要忘記 alt 屬性**，它對於無障礙訪問和 SEO 都很重要
5. **考慮使用漸進式載入**，提升用戶體驗

## 案例研究圖片示例

案例研究圖片已經按照以下結構進行組織：

```javascript
{
  id: 'case-1',
  title: '雅德思牙醫診所',
  image: '/Case_1.jpg',           // 原始圖片
  imageWebp: '/Case_1.webp',      // WebP 格式
  imagePlaceholder: '/Case_1_placeholder.jpg',  // 預載小圖
  imageSizes: {
    sm: '/Case_1_sm.jpg',         // 小尺寸 (手機版)
    md: '/Case_1_md.jpg',         // 中尺寸 (平板版)
    lg: '/Case_1.jpg',            // 大尺寸 (桌面版)
  }
}
```

## 使用圖片處理工具

如需轉換新圖片，請使用以下命令：

```bash
# 轉換單一圖片
node convert-all-images.js 您的圖片.jpg

# 處理整個目錄
node convert-all-images.js --dir=您的目錄

# 處理公共目錄中的所有圖片
node convert-all-images.js
``` 