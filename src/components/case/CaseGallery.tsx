'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface CaseGalleryProps {
  caseId: string
  name: string
}

// 案例圖片介面
interface CaseImage {
  url: string
  alt: string
  caption?: string
}

// 生成案例圖片 - 使用useMemo緩存圖片數組
const CaseGallery: React.FC<CaseGalleryProps> = ({ caseId, name }) => {
  const [activeImage, setActiveImage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  
  // 使用useMemo緩存圖片列表，避免重新渲染時重複生成
  const caseImages = useMemo(() => {
    // 根據案例ID生成一張主要圖片和相關視覺效果圖片
    const images = [
      {
        id: 'main',
        title: '案例主圖',
        url: `/images/cases/gallery/${caseId}.jpg`,
      },
      {
        id: 'website',
        title: '網站設計',
        url: `/images/cases/gallery/${caseId}-website.jpg`,
      },
      {
        id: 'social',
        title: '社群經營',
        url: `/images/cases/gallery/${caseId}-social.jpg`,
      },
      {
        id: 'ads',
        title: '廣告投放',
        url: `/images/cases/gallery/${caseId}-ads.jpg`,
      }
    ];
    return images.map((image) => ({
      url: image.url,
      alt: image.title,
      caption: image.title
    }))
  }, [caseId, name])

  // 使用useCallback緩存事件處理函數
  const openModal = useCallback((index: number) => {
    setActiveImage(index)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  const changeImage = useCallback((direction: 'next' | 'prev') => {
    setActiveImage((prev) => {
      if (direction === 'next') {
        return (prev + 1) % caseImages.length
      } else {
        return (prev - 1 + caseImages.length) % caseImages.length
      }
    })
  }, [caseImages.length])

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    target.src = '/images/case-placeholder.jpg'
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {caseImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative cursor-pointer"
            onClick={() => openModal(index)}
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                onError={handleImageError}
                loading={index <= 1 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                quality={index <= 1 ? 85 : 75}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
            {image.caption && (
              <p className="text-sm text-gray-600 mt-2 text-center">{image.caption}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* 圖片畫廊模態框 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full h-auto max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 關閉按鈕 */}
              <button
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 rounded-full p-2 text-white hover:bg-opacity-30 transition-all duration-300"
                onClick={closeModal}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 主圖區 */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <Image
                  src={caseImages[activeImage].url}
                  alt={caseImages[activeImage].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  onError={handleImageError}
                  priority
                  quality={90}
                />
              </div>

              {/* 圖片說明 */}
              {caseImages[activeImage].caption && (
                <div className="bg-white bg-opacity-10 p-4 mt-2 rounded-lg">
                  <p className="text-center text-white">{caseImages[activeImage].caption}</p>
                </div>
              )}

              {/* 導航按鈕 */}
              <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-4">
                <button
                  className="bg-white bg-opacity-20 rounded-full p-2 text-white hover:bg-opacity-30 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    changeImage('prev')
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="bg-white bg-opacity-20 rounded-full p-2 text-white hover:bg-opacity-30 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    changeImage('next')
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* 縮圖列表 */}
              <div className="mt-4 flex space-x-2 overflow-x-auto py-2">
                {caseImages.map((image, idx) => (
                  <div
                    key={idx}
                    className={`relative flex-shrink-0 w-20 h-20 cursor-pointer rounded overflow-hidden border-2 ${
                      idx === activeImage ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveImage(idx)
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      onError={handleImageError}
                      sizes="80px"
                      quality={60}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default React.memo(CaseGallery) 