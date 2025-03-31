'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { caseAnimations } from '@/utils/animations'
import { generateCaseImageUrl, handleCaseImageError } from '@/utils/case'
import type { CaseGalleryProps, CaseImage } from '@/types/case'

/**
 * 案例圖片畫廊組件 - 優化版
 * 
 * 專注於:
 * 1. 高效圖片載入
 * 2. 優化圖片排版與顯示
 * 3. 確保模態框中圖片完整顯示
 * 4. 增強使用者體驗
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
  }, [])
  
  // 圖片錯誤處理
  const handleImageError = useCallback((url: string) => {
    setErrorImages(prev => ({
      ...prev,
      [url]: true
    }))
  }, [])
  
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
    
    return (
      <>
        {/* 載入指示器 */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <Image
          src={imgUrl}
          alt={image.alt || `案例圖片 ${index + 1}`}
          fill
          className={`
            transition-all duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${isInModal 
              ? `object-${fitMode}` 
              : 'object-cover group-hover:scale-105 transition-transform duration-500'}
          `}
          sizes={isInModal 
            ? "(max-width: 1280px) 100vw, 1280px" 
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
          loading={index < 3 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          quality={isInModal ? 95 : index < 3 ? 85 : 75}
          onError={() => handleImageError(image.url)}
          onLoad={() => handleImageLoad(image.url)}
          unoptimized={isInModal} // 在模態框中顯示原始圖片，保持最高品質
        />
      </>
    )
  }, [loadedImages, errorImages, getImageUrl, handleImageError, handleImageLoad, name, fitMode])

  return (
    <>
      {/* 圖片網格 */}
      <div className={`
        ${layout === 'masonry' 
          ? "columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}
        my-6
      `}>
        {caseImages.map((image, index) => (
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
              className={`relative overflow-hidden rounded-lg shadow-md ${
                layout === 'masonry' ? '' : `aspect-[${aspectRatio}]`
              }`}
              style={layout === 'masonry' ? { aspectRatio } : undefined}
            >
              {renderImage(image, index)}
              
              {/* 懸停效果 */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
                <div className="text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>
            {image.caption && (
              <p className="text-sm text-gray-600 mt-2 text-center">{image.caption}</p>
            )}
          </div>
        ))}
      </div>

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
              className="relative w-full max-w-6xl mx-auto h-[85vh] bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 關閉按鈕 */}
              <button
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-all duration-300"
                onClick={closeModal}
                aria-label="關閉圖片"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 主圖區 */}
              <div className="relative h-[70vh] bg-gray-100 dark:bg-gray-800">
                {renderImage(caseImages[activeImage], activeImage, true)}
                
                {/* 切換顯示模式按鈕 */}
                <button
                  className="absolute bottom-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFitMode()
                  }}
                  aria-label={fitMode === 'contain' ? '放大填滿' : '顯示完整'}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
              >
                {caseImages[activeImage].caption && (
                  <p className="text-center text-gray-900 dark:text-gray-100 font-medium">
                    {caseImages[activeImage].caption}
                  </p>
                )}
              </motion.div>

              {/* 導航按鈕 */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                <button
                  className="bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-all duration-300 pointer-events-auto"
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
                  className="bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-all duration-300 pointer-events-auto"
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
              
              {/* 縮圖列表 */}
              <div className="p-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-center gap-2 overflow-x-auto pb-1 px-4">
                  {caseImages.map((image, idx) => (
                    <div
                      key={`thumb-${caseId}-${idx}`}
                      className={`relative flex-shrink-0 w-16 h-16 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        idx === activeImage 
                          ? 'border-primary scale-110 shadow-md' 
                          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveImage(idx)
                      }}
                    >
                      {image.type === 'video' ? (
                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      ) : (
                        <Image
                          src={getImageUrl(image.url)}
                          alt={image.alt || `縮圖 ${idx + 1}`}
                          fill
                          className="object-cover"
                          loading="lazy"
                          sizes="64px"
                          quality={40}
                          onError={() => handleImageError(image.url)}
                        />
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