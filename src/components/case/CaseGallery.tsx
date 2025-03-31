'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { caseAnimations } from '@/utils/animations'
import { generateCaseImageUrl, handleCaseImageError } from '@/utils/case'
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
      images.push({
        url,
        alt: `${name} - 案例圖片 ${i}`,
        type: 'image'
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
  
  // 圖片錯誤處理
  const handleImageError = useCallback((url: string) => {
    setErrorImages(prev => ({
      ...prev,
      [url]: true
    }))
  }, [])
  
  // 使用WebP格式預載入圖片 (優先使用WebP格式以加快載入)
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
      
      // 創建圖片實例預載入
      const img = new window.Image()
      
      // 載入完成處理
      img.onload = () => handleImageLoad(image.url)
      img.onerror = () => {
        handleImageError(image.url)
        
        // 如果WebP載入失敗，嘗試載入原始圖片
        if (image.url.includes('.webp')) {
          const originalUrl = image.url.replace('.webp', '.jpg')
          const imgOriginal = new window.Image()
          imgOriginal.src = originalUrl
          imgOriginal.onload = () => handleImageLoad(originalUrl)
        }
      }
      
      // 開始載入
      img.src = image.url
    })
    
    setIsInitialized(true)
  }, [caseImages, handleImageLoad, handleImageError, isInitialized])
  
  // 初始化圖片預載入
  useEffect(() => {
    preloadImages()
  }, [preloadImages])
  
  // 獲取圖片URL (處理錯誤情況)
  const getImageUrl = useCallback((url: string) => {
    return errorImages[url] ? handleCaseImageError(url) : url
  }, [errorImages])
  
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
  
  // 圖片網格樣式 - 優化手機顯示
  const gridLayout = useMemo(() => {
    if (isMobile) {
      // 手機上使用水平滾動，而不是網格
      return "flex flex-nowrap overflow-x-auto gap-4 pb-4 snap-x snap-mandatory"
    }
    return layout === 'masonry' 
      ? "columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
  }, [layout, isMobile])
  
  // 渲染圖片元素
  const renderImage = useCallback((image: CaseImage, index: number, isInModal = false) => {
    if (image.type === 'video') {
      return (
        <div className="absolute inset-0 bg-gray-100">
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
    
    const isLoaded = loadedImages[image.url]
    const hasError = errorImages[image.url]
    const imgUrl = getImageUrl(image.url)
    
    // 使用更直接的渲染方法，確保圖片立即可見
    return (
      <>
        {/* 固定背景 - 不使用動畫 */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-100 flex items-center justify-center">
          {!isLoaded && (
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        {/* 圖片層 - 默認有一定不透明度 */}
        <div className="absolute inset-0 z-[1]">
          <img 
            src={imgUrl}
            alt={image.alt || `案例圖片 ${index + 1}`}
            className={`
              w-full h-full object-cover
              ${isInModal ? `object-${fitMode}` : 'object-cover group-hover:scale-[1.03]'}
              ${isLoaded ? 'opacity-100' : 'opacity-60'}
              transition-all duration-300
            `}
            onError={() => handleImageError(image.url)}
            onLoad={() => handleImageLoad(image.url)}
          />
        </div>
      </>
    )
  }, [loadedImages, errorImages, getImageUrl, handleImageError, handleImageLoad, name, fitMode])

  // 手機版圖片項目
  const renderMobileImageItem = (image: CaseImage, index: number) => (
    <div
      key={`case-image-${caseId}-${index}`}
      className="flex-none w-[85vw] snap-center snap-always"
      onClick={() => openModal(index)}
    >
      <div 
        className="cursor-pointer overflow-hidden rounded-lg shadow-md relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200"
        // 簡化觸控處理，只保留點擊事件
      >
        {renderImage(image, index)}
        
        {/* 圖片指示器 */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-[5]">
          {index + 1}/{caseImages.length}
        </div>
        
        {/* 觸控效果 - 始終有輕微陰影 */}
        <div className="absolute inset-0 bg-black/5 z-[2]"></div>
      </div>
      {image.caption && (
        <p className="text-sm text-gray-600 mt-2 text-center">{image.caption}</p>
      )}
    </div>
  )
  
  // 桌面版圖片項目
  const renderDesktopImageItem = (image: CaseImage, index: number) => (
    <div
      key={`case-image-${caseId}-${index}`}
      className={`group cursor-pointer ${layout === 'masonry' ? 'break-inside-avoid mb-5' : ''}`}
      onClick={() => openModal(index)}
    >
      <motion.div
        variants={caseAnimations.gallery}
        initial="hidden"
        animate="visible"
        custom={index}
        className={`relative overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-gray-200 to-gray-100 ${
          layout === 'masonry' ? '' : `aspect-[${aspectRatio}]`
        }`}
        style={layout === 'masonry' ? { aspectRatio } : undefined}
      >
        {renderImage(image, index)}
        
        {/* 簡化懸停效果 */}
        <div className="absolute inset-0 z-[2] bg-black/5 group-hover:bg-black/20 transition-colors duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white opacity-0 group-hover:opacity-70 transition-opacity duration-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
      {image.caption && (
        <p className="text-sm text-gray-600 mt-2 text-center">{image.caption}</p>
      )}
    </div>
  )

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

      {/* 圖片模態框 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={caseAnimations.galleryModal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full ${isMobile ? 'h-[90vh] max-w-full mx-2' : 'max-w-6xl mx-auto h-[85vh]'} bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 關閉按鈕 */}
              <button
                className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-all duration-300"
                onClick={closeModal}
                aria-label="關閉圖片"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 主圖區 */}
              <div className={`relative ${isMobile ? 'h-[65vh]' : 'h-[70vh]'} bg-gray-100 dark:bg-gray-800`}>
                {/* 添加額外的背景保證 */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700" />
                
                {/* 模態框使用普通img標籤，確保兼容性和立即顯示 */}
                {caseImages[activeImage].type === 'video' ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <iframe
                      src={caseImages[activeImage].url}
                      className="w-full h-full"
                      style={{ border: 'none', overflow: 'hidden' }}
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen
                      title={`${name} - 案例視頻`}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={getImageUrl(caseImages[activeImage].url)}
                      alt={caseImages[activeImage].alt || `案例圖片 ${activeImage + 1}`}
                      className={`max-h-full max-w-full object-${fitMode}`}
                      onError={() => handleImageError(caseImages[activeImage].url)}
                      onLoad={() => handleImageLoad(caseImages[activeImage].url)}
                    />
                  </div>
                )}
                
                {/* 切換顯示模式按鈕 */}
                <button
                  className="absolute bottom-4 right-4 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-all duration-300"
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

              {/* 圖片說明 */}
              <motion.div
                variants={caseAnimations.galleryImage}
                initial="hidden"
                animate="visible"
                custom={activeImage}
                className="p-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
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

              {/* 導航按鈕 */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-4 pointer-events-none">
                <button
                  className="bg-black/50 hover:bg-black/70 rounded-full p-2 md:p-3 text-white transition-all duration-300 pointer-events-auto z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    changeImage('prev')
                  }}
                  aria-label="上一張圖片"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="bg-black/50 hover:bg-black/70 rounded-full p-2 md:p-3 text-white transition-all duration-300 pointer-events-auto z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    changeImage('next')
                  }}
                  aria-label="下一張圖片"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* 縮圖列表 - 優化手機顯示 */}
              <div className="p-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="flex justify-start md:justify-center gap-2 overflow-x-auto pb-1 px-2 md:px-4 snap-x snap-mandatory">
                  {caseImages.map((image, idx) => (
                    <div
                      key={`thumb-${caseId}-${idx}`}
                      className={`relative flex-shrink-0 w-14 h-14 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 snap-center ${
                        idx === activeImage 
                          ? 'border-primary scale-110 shadow-md' 
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
                      {/* 始終顯示的背景圖層 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800" />
                      
                      {image.type === 'video' ? (
                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="absolute inset-0 z-10">
                          <img
                            src={getImageUrl(image.url)}
                            alt={image.alt || `縮圖 ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(image.url)}
                            onLoad={() => handleImageLoad(image.url)}
                          />
                        </div>
                      )}
                      
                      {/* 縮圖索引指示器 - 僅在手機上顯示 */}
                      {isMobile && (
                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 z-10">
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