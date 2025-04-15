'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface BlogImage {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface BlogGalleryProps {
  images: BlogImage[];
  layout?: 'grid' | 'carousel' | 'masonry';
  aspectRatio?: string;
}

/**
 * 部落格圖片畫廊組件
 * 
 * 專注於:
 * 1. 高效的圖片載入與展示
 * 2. 最佳化的手機觀看體驗
 * 3. 圖片模態框瀏覽功能
 */
const BlogGallery: React.FC<BlogGalleryProps> = ({
  images,
  layout = 'grid',
  aspectRatio = '4/3'
}) => {
  // 基本狀態管理
  const [activeImage, setActiveImage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})
  const [isMobile, setIsMobile] = useState(false)
  
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
  
  // 圖片載入處理
  const handleImageLoad = useCallback((url: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [url]: true
    }))
  }, [])
  
  // 模態框控制
  const openModal = useCallback((index: number) => {
    setActiveImage(index)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  const changeImage = useCallback((direction: 'next' | 'prev') => {
    setActiveImage(prev => {
      if (direction === 'next') {
        return (prev + 1) % images.length
      } else {
        return (prev - 1 + images.length) % images.length
      }
    })
  }, [images.length])
  
  // 圖片網格樣式
  const gridLayout = useMemo(() => {
    if (isMobile) {
      // 手機上使用水平滾動
      return "flex flex-nowrap overflow-x-auto gap-4 pb-4 snap-x snap-mandatory"
    }
    
    // 桌面版使用網格布局
    return layout === 'masonry' 
      ? "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  }, [layout, isMobile])
  
  // 桌面版圖片項目
  const renderDesktopImageItem = (image: BlogImage, index: number) => (
    <div
      key={`blog-image-${index}`}
      className={`group cursor-pointer ${layout === 'masonry' ? 'break-inside-avoid mb-6' : ''}`}
      onClick={() => openModal(index)}
    >
      <div
        className={`relative overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${
          layout === 'masonry' ? '' : `aspect-[${aspectRatio}]`
        }`}
        style={layout === 'masonry' ? { aspectRatio } : undefined}
      >
        {/* 背景層 */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100"></div>
        
        {/* 圖片層 */}
        <div className="absolute inset-0 z-10">
          <img 
            src={image.url}
            alt={image.alt}
            className={`w-full h-full object-cover transition-all duration-500 ${
              loadedImages[image.url] ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            }`}
            onLoad={() => handleImageLoad(image.url)}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
          />
        </div>
        
        {/* 載入指示器 */}
        {!loadedImages[image.url] && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center backdrop-blur-sm">
              <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
        
        {/* 懸停效果層 */}
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
  )

  // 移動版圖片項目
  const renderMobileImageItem = (image: BlogImage, index: number) => (
    <div
      key={`blog-image-${index}`}
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
            src={image.url}
            alt={image.alt}
            className={`w-full h-full object-cover transition-all duration-500 ${
              loadedImages[image.url] ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            }`}
            onLoad={() => handleImageLoad(image.url)}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
          />
        </div>
        
        {/* 載入指示器 */}
        {!loadedImages[image.url] && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center backdrop-blur-sm">
              <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
        
        {/* 圖片指示器 */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-20 shadow-md backdrop-blur-sm">
          {index + 1}/{images.length}
        </div>
      </div>
      {image.caption && (
        <p className="text-sm text-gray-600 mt-2 text-center">{image.caption}</p>
      )}
    </div>
  )

  return (
    <>
      {/* 圖片畫廊區域 */}
      <div className={gridLayout}>
        {images.map((image, index) => (
          isMobile 
            ? renderMobileImageItem(image, index) 
            : renderDesktopImageItem(image, index)
        ))}
      </div>

      {/* 圖片模態框 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-7xl mx-auto h-[85vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 關閉按鈕 */}
              <button
                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white shadow-lg transition-all duration-300 backdrop-blur-sm"
                onClick={closeModal}
                aria-label="關閉圖片"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 主圖區 */}
              <div className="relative h-[70vh] bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={images[activeImage].url}
                    alt={images[activeImage].alt}
                    className="max-h-[95%] max-w-[95%] object-contain shadow-lg"
                    onLoad={() => handleImageLoad(images[activeImage].url)}
                  />
                </div>
              </div>

              {/* 圖片說明 */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                {images[activeImage].caption && (
                  <p className="text-center text-gray-900 dark:text-gray-100 font-medium text-sm">
                    {images[activeImage].caption}
                  </p>
                )}
                <p className="text-center text-xs text-gray-500 mt-1">
                  {activeImage + 1} / {images.length}
                </p>
              </div>

              {/* 導航按鈕 */}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default React.memo(BlogGallery) 