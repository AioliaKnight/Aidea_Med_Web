'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { caseAnimations } from '@/utils/animations'
import { 
  generateCaseImageUrl, 
  generateCaseImageUrlWithFallbacks, 
  handleCaseImageError 
} from '@/utils/case'
import type { CaseGalleryProps, CaseImage } from '@/types/case'

/**
 * 案例圖片畫廊組件 - 手機優化版
 * 
 * 專注於:
 * 1. 高效圖片載入並確保在手機上正確顯示
 * 2. 優化圖片排版與水平滾動
 * 3. 確保模態框中圖片完整顯示
 * 4. 提升手機使用者體驗
 */
const CaseGallery: React.FC<CaseGalleryProps> = ({ 
  caseId, 
  name, 
  hasVideo, 
  videoUrl,
  images: propImages,
  layout = 'grid',
  aspectRatio = '4/3' 
}) => {
  // 基本狀態管理
  const [activeImage, setActiveImage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})
  const [errorImages, setErrorImages] = useState<Record<string, boolean>>({})
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain')
  const [isMobile, setIsMobile] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // 偵測手機瀏覽器
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // 初始檢查
    checkMobile()
    
    // 監聽視窗大小變化
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  // 使用 useMemo 生成圖片集，避免重複計算
  const caseImages = useMemo(() => {
    // 如果提供了圖片列表，則使用之
    if (propImages && propImages.length > 0) {
      return propImages
    }
    
    // 否則，根據 caseId 生成圖片列表 (最多8張)
    const images: CaseImage[] = []
    const imageCount = 8
    
    for (let i = 1; i <= imageCount; i++) {
      const url = generateCaseImageUrl(caseId, i)
      const fallbackUrls = generateCaseImageUrlWithFallbacks(caseId, i)
      
      images.push({
        url,
        alt: `${name} - 案例圖片 ${i}`,
        type: 'image',
        fallbackUrls
      })
    }
    
    // 如果有視頻，添加到開頭
    if (hasVideo && videoUrl) {
      images.unshift({
        url: videoUrl,
        alt: `${name} - 案例視頻`,
        type: 'video'
      })
    }
    
    return images
  }, [caseId, name, propImages, hasVideo, videoUrl])
  
  // 圖片載入處理
  const handleImageLoad = useCallback((url: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [url]: true
    }))
    
    // 嘗試將載入成功的圖片快取到localStorage
    try {
      const cachedImages = JSON.parse(localStorage.getItem('cachedImageUrls') || '{}')
      localStorage.setItem('cachedImageUrls', JSON.stringify({
        ...cachedImages,
        [url]: true
      }))
    } catch (e) {
      // 忽略localStorage錯誤
    }
  }, [])
  
  // 提前定義函數類型，解決循環引用問題
  type TryFallbackImagesType = (image: CaseImage, currentIndex: number) => void;
  
  // 嘗試載入圖片的備用格式
  const tryFallbackImages = useCallback<TryFallbackImagesType>((image: CaseImage, currentIndex: number = 0) => {
    if (!image.fallbackUrls || currentIndex >= (image.fallbackUrls.length - 1)) return;
    
    const fallbackUrl = image.fallbackUrls[currentIndex + 1];
    
    // 創建圖片實例嘗試載入
    const img = new window.Image();
    img.onload = () => handleImageLoad(fallbackUrl);
    img.onerror = () => {
      setErrorImages(prev => ({
        ...prev,
        [fallbackUrl]: true
      }));
      
      // 繼續嘗試下一個備用格式
      if (image.fallbackUrls && currentIndex + 1 < image.fallbackUrls.length - 1) {
        tryFallbackImages(image, currentIndex + 1);
      }
    };
    img.src = fallbackUrl;
  }, [handleImageLoad]); // 只依賴於 handleImageLoad
  
  // 圖片錯誤處理
  const handleImageError = useCallback((url: string) => {
    setErrorImages(prev => ({
      ...prev,
      [url]: true
    }));
    
    // 在完成初始化後才嘗試使用備用圖片
    const image = caseImages.find(img => img.url === url);
    if (image && image.fallbackUrls) {
      const currentIndex = image.fallbackUrls.indexOf(url);
      if (currentIndex === -1) {
        tryFallbackImages(image, 0);
      } else if (currentIndex < image.fallbackUrls.length - 1) {
        tryFallbackImages(image, currentIndex);
      }
    }
  }, [caseImages, tryFallbackImages]);
  
  // 使用WebP格式預載入圖片
  const preloadImages = useCallback(() => {
    if (isInitialized) return // 避免重複預載入
    
    // 檢查本地緩存
    try {
      const cachedImages = JSON.parse(localStorage.getItem('cachedImageUrls') || '{}')
      Object.keys(cachedImages).forEach(url => {
        if (cachedImages[url]) {
          handleImageLoad(url)
        }
      })
    } catch (e) {
      // 忽略localStorage錯誤
    }
    
    // 預載入所有圖片
    caseImages.forEach((image, index) => {
      if (image.type !== 'image') return
      
      // 強制進行首圖預載入，避免生產環境黑屏問題
      if (index === 0) {
        const img = new window.Image();
        img.onload = () => handleImageLoad(image.url);
        img.onerror = () => {
          setErrorImages(prev => ({
            ...prev,
            [image.url]: true
          }));
          
          // 如果主圖載入失敗且有備用URL，嘗試載入備用URL
          if (image.fallbackUrls && image.fallbackUrls.length > 0) {
            const fallbackImg = new window.Image();
            fallbackImg.onload = () => handleImageLoad(image.fallbackUrls![0]);
            fallbackImg.src = image.fallbackUrls[0];
          }
        };
        // 設置較高的加載優先級
        if ('fetchPriority' in img) {
          (img as any).fetchPriority = "high";
        }
        img.loading = "eager";
        img.src = image.url;
      }
      
      // 如果有備用URL，嘗試按優先順序載入
      else if (image.fallbackUrls && image.fallbackUrls.length > 0) {
        // 使用備用URL中的第一個（可能是WebP）
        const primaryUrl = image.fallbackUrls[0];
        const img = new window.Image();
        img.onload = () => handleImageLoad(primaryUrl);
        img.onerror = () => {
          setErrorImages(prev => ({
            ...prev,
            [primaryUrl]: true
          }));
          // 嘗試後續格式
          tryFallbackImages(image, 0);
        };
        img.src = primaryUrl;
      } else {
        // 創建圖片實例預載入
        const img = new window.Image();
        
        // 載入完成處理
        img.onload = () => handleImageLoad(image.url);
        img.onerror = () => {
          setErrorImages(prev => ({
            ...prev,
            [image.url]: true
          }));
        };
        
        // 開始載入
        img.src = image.url;
      }
    })
    
    setIsInitialized(true)
  }, [caseImages, handleImageLoad, isInitialized, tryFallbackImages]);
  
  // 初始化圖片預載入
  useEffect(() => {
    preloadImages()
    
    // 針對生產環境的特殊處理
    if (typeof window !== 'undefined') {
      // 使用requestIdleCallback或setTimeout確保在頁面渲染完成後進行二次預載入
      const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
      idleCallback(() => {
        // 強制重新加載第一張圖片，避免生產環境黑屏問題
        if (caseImages.length > 0 && caseImages[0].type === 'image') {
          const firstImage = caseImages[0];
          // 使用原生Image對象加載
          const img = new window.Image();
          img.onload = () => {
            handleImageLoad(firstImage.url);
            // 更新狀態強制重新渲染
            setLoadedImages(prev => ({...prev}));
          };
          img.src = firstImage.url;
        }
      });
    }
  }, [preloadImages, caseImages])
  
  // 獲取圖片URL，支援備用URL
  const getImageUrl = useCallback((image: CaseImage) => {
    // 檢查主圖片URL是否已載入或出錯
    if (loadedImages[image.url]) {
      return image.url;
    }
    
    // 檢查是否有備用URL已載入
    if (image.fallbackUrls && image.fallbackUrls.length > 0) {
      const loadedFallback = image.fallbackUrls.find(url => loadedImages[url]);
      if (loadedFallback) return loadedFallback;
    }
    
    // 如果主URL有錯誤，且有備用URL，返回第一個備用URL
    if (errorImages[image.url] && image.fallbackUrls && image.fallbackUrls.length > 0) {
      return image.fallbackUrls[0];
    }
    
    // 否則返回主URL
    return image.url;
  }, [loadedImages, errorImages]);
  
  // 模態框控制
  const openModal = useCallback((index: number) => {
    setActiveImage(index)
    setShowModal(true)
    setFitMode('contain') // 初始設為 contain 模式以顯示完整圖片
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  const changeImage = useCallback((direction: 'next' | 'prev') => {
    setActiveImage(prev => {
      if (direction === 'next') {
        return (prev + 1) % caseImages.length
      } else {
        return (prev - 1 + caseImages.length) % caseImages.length
      }
    })
  }, [caseImages.length])

  // 切換圖片顯示模式
  const toggleFitMode = useCallback(() => {
    setFitMode(prev => prev === 'contain' ? 'cover' : 'contain')
  }, [])

  // 圖片網格樣式 - 優化桌面顯示
  const gridLayout = useMemo(() => {
    if (isMobile) {
      // 手機上使用水平滾動，而不是網格
      return "flex flex-nowrap overflow-x-auto gap-4 pb-4 snap-x snap-mandatory"
    }
    
    // 桌面版使用更現代的網格布局
    return layout === 'masonry' 
      ? "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  }, [layout, isMobile])
  
  // 桌面版圖片項目 - 全新設計
  const renderDesktopImageItem = (image: CaseImage, index: number) =>
    <div
      key={`case-image-${caseId}-${index}`}
      className={`group cursor-pointer ${layout === 'masonry' ? 'break-inside-avoid mb-6' : ''}`}
      onClick={() => openModal(index)}
    >
      <div
        className={`relative overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${
          layout === 'masonry' ? '' : `aspect-[${aspectRatio}]`
        }`}
        style={layout === 'masonry' ? { aspectRatio } : undefined}
      >
        {/* 背景與持久層 */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100"></div>
        
        {/* 圖片層 */}
        <div className="absolute inset-0 z-10">
          <img 
            key={`img-${caseId}-${index}-${loadedImages[image.url] ? 'loaded' : 'loading'}`}
            src={getImageUrl(image)}
            alt={image.alt || `案例圖片 ${index + 1}`}
            className={`w-full h-full object-cover transition-all duration-500 ${
              loadedImages[image.url] || (image.fallbackUrls?.some(url => loadedImages[url])) 
                ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            }`}
            onError={() => handleImageError(image.url)}
            onLoad={() => {
              handleImageLoad(image.url);
              if (index === 0) {
                setLoadedImages(prev => ({...prev}));
              }
            }}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
          />
        </div>
        
        {/* 載入指示器 */}
        {!(loadedImages[image.url] || (image.fallbackUrls?.some(url => loadedImages[url]))) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center backdrop-blur-sm">
              <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
        
        {/* 懸停效果層 - 更豐富的視覺反饋 */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {image.caption && (
              <p className="text-sm font-medium mb-1">{image.caption}</p>
            )}
            <div className="flex items-center text-xs text-white/80">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>點擊查看大圖</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  // 移動版圖片項目 - 保持一致性的設計語言
  const renderMobileImageItem = (image: CaseImage, index: number) => (
    <div
      key={`case-image-${caseId}-${index}`}
      className="flex-none w-[85vw] snap-center snap-always"
      onClick={() => openModal(index)}
    >
      <div 
        className="cursor-pointer overflow-hidden rounded-xl shadow-sm relative aspect-[4/3] border border-gray-100"
      >
        {/* 背景層 */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100"></div>
        
        {/* 圖片層 */}
        <div className="absolute inset-0 z-10">
          <img 
            key={`img-${caseId}-${index}-${loadedImages[image.url] ? 'loaded' : 'loading'}`}
            src={getImageUrl(image)}
            alt={image.alt || `案例圖片 ${index + 1}`}
            className={`w-full h-full object-cover transition-all duration-500 ${
              loadedImages[image.url] || (image.fallbackUrls?.some(url => loadedImages[url])) 
                ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            }`}
            onError={() => handleImageError(image.url)}
            onLoad={() => handleImageLoad(image.url)}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
          />
        </div>
        
        {/* 載入指示器 */}
        {!(loadedImages[image.url] || (image.fallbackUrls?.some(url => loadedImages[url]))) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center backdrop-blur-sm">
              <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
        
        {/* 圖片指示器 */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-20 shadow-md backdrop-blur-sm">
          {index + 1}/{caseImages.length}
        </div>
      </div>
      {image.caption && (
        <p className="text-sm text-gray-600 mt-2 text-center">{image.caption}</p>
      )}
    </div>
  )
  
  // 模態框圖片渲染
  const renderModalImage = useCallback(() => {
    const image = caseImages[activeImage]
    
    if (image.type === 'video') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <iframe
                    src={image.url}
                    className="w-full h-full"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
            title={`${name} - 案例視頻`}
                  />
                </div>
      )
    }
    
    const isLoaded = loadedImages[image.url] || (image.fallbackUrls && image.fallbackUrls.some(url => loadedImages[url]));
    const imgUrl = getImageUrl(image);
    
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        {/* 背景層 - 使用更優雅的背景效果 */}
        <div 
          className="absolute inset-0 bg-center bg-cover opacity-10 dark:opacity-5 blur-md" 
          style={{
            backgroundImage: `url('${imgUrl}')`,
          }}
        />
        
        {/* 實際圖片 - 改進圖片顯示效果 */}
        <img
          src={imgUrl}
          alt={image.alt || `案例圖片 ${activeImage + 1}`}
          className={`relative z-10 ${
            fitMode === 'contain' 
              ? 'max-h-[95%] max-w-[95%] object-contain' 
              : 'w-full h-full object-cover'
          } shadow-lg transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onError={() => handleImageError(image.url)}
          onLoad={() => handleImageLoad(image.url)}
        />
        
        {/* 載入指示器 - 優化載入動畫 */}
        {!isLoaded && (
          <div className="absolute z-20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center shadow-lg">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            )}
          </div>
    )
  }, [caseImages, activeImage, loadedImages, getImageUrl, handleImageError, handleImageLoad, name, fitMode])

  return (
    <>
      {/* 圖片輪播區域 */}
      <div className={gridLayout}>
        {caseImages.map((image, index) => (
          isMobile 
            ? renderMobileImageItem(image, index) 
            : renderDesktopImageItem(image, index)
        ))}
      </div>

      {/* 手機版輪播指示器 */}
      {isMobile && (
        <div className="flex justify-center gap-1 mt-4">
          {caseImages.map((_, idx) => (
            <div 
              key={`indicator-${idx}`}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                idx === activeImage ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* 圖片模態框 - 重新設計 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={caseAnimations.galleryModal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full ${isMobile ? 'h-[90vh] max-w-full mx-2' : 'max-w-7xl mx-auto h-[85vh]'} bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 關閉按鈕 - 更現代的設計 */}
              <button
                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white shadow-lg transition-all duration-300 backdrop-blur-sm"
                onClick={closeModal}
                aria-label="關閉圖片"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 主圖區 - 改進背景和動畫效果 */}
              <div className={`relative ${isMobile ? 'h-[65vh]' : 'h-[70vh]'} bg-gray-50 dark:bg-gray-900 overflow-hidden`}>
                {renderModalImage()}
                
                {/* 切換顯示模式按鈕 - 優化位置和樣式 */}
                <button
                  className="absolute bottom-4 right-4 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white shadow-lg transition-all duration-300 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFitMode()
                  }}
                  aria-label={fitMode === 'contain' ? '放大填滿' : '顯示完整'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {fitMode === 'contain' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    )}
                  </svg>
                </button>
              </div>

              {/* 圖片說明 - 優化樣式和動畫 */}
              <motion.div
                variants={caseAnimations.galleryImage}
                initial="hidden"
                animate="visible"
                custom={activeImage}
                className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
              >
                {caseImages[activeImage].caption && (
                  <p className="text-center text-gray-900 dark:text-gray-100 font-medium text-sm">
                    {caseImages[activeImage].caption}
                  </p>
                )}
                <p className="text-center text-xs text-gray-500 mt-1">
                  {activeImage + 1} / {caseImages.length}
                </p>
              </motion.div>

              {/* 導航按鈕 - 優化按鈕樣式 */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                <button
                  className="bg-black/40 hover:bg-black/60 rounded-full p-3 text-white shadow-lg transition-all duration-300 pointer-events-auto z-10 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    changeImage('prev')
                  }}
                  aria-label="上一張圖片"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="bg-black/40 hover:bg-black/60 rounded-full p-3 text-white shadow-lg transition-all duration-300 pointer-events-auto z-10 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    changeImage('next')
                  }}
                  aria-label="下一張圖片"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* 縮圖列表 - 優化樣式和滾動效果 */}
              <div className="p-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="flex justify-start md:justify-center gap-2 overflow-x-auto pb-1 px-2 md:px-4 snap-x snap-mandatory">
                  {caseImages.map((image, idx) => (
                    <div
                      key={`thumb-${caseId}-${idx}`}
                      className={`relative flex-shrink-0 w-16 h-16 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 snap-center ${
                        idx === activeImage 
                          ? 'border-primary scale-110 shadow-lg' 
                          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveImage(idx)
                      }}
                      onTouchStart={() => {}} // 空函數確保觸控事件被捕獲
                      onTouchEnd={(e) => {
                        e.stopPropagation()
                        setActiveImage(idx)
                      }}
                    >
                      {/* 縮圖背景 */}
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800" />
                      
                      {image.type === 'video' ? (
                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
                          <svg className="w-6 h-6 text-primary dark:text-primary/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      ) : (
                        <>
                          {/* 實際縮圖 */}
                          <div className="absolute inset-0 z-10">
                            <img
                              src={getImageUrl(image)}
                              alt={image.alt || `縮圖 ${idx + 1}`}
                              className="w-full h-full object-cover"
                          onError={() => handleImageError(image.url)}
                              onLoad={() => handleImageLoad(image.url)}
                              loading="lazy"
                            />
                          </div>
                        </>
                      )}
                      
                      {/* 縮圖索引指示器 - 優化顯示效果 */}
                      {isMobile && (
                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 z-10 backdrop-blur-sm">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default React.memo(CaseGallery) 