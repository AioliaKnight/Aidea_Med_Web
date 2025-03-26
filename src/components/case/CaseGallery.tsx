'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface CaseGalleryProps {
  caseId: string
  name: string
  hasVideo?: boolean
  videoUrl?: string
}

// 案例圖片介面
interface CaseImage {
  url: string
  alt: string
  caption?: string
  type?: 'image' | 'video'
}

// 生成案例圖片 - 使用useMemo緩存圖片數組
const CaseGallery: React.FC<CaseGalleryProps> = ({ caseId, name, hasVideo, videoUrl }) => {
  const [activeImage, setActiveImage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  
  // 使用useMemo緩存圖片列表，避免重新渲染時重複生成
  const caseImages = useMemo(() => {
    const images: CaseImage[] = []
    
    // 如果有影片，加入影片作為第一個項目
    if (hasVideo && videoUrl) {
      images.push({
        url: videoUrl,
        alt: `${name} - 廣告影片`,
        caption: '廣告投放案例',
        type: 'video'
      })
    }
    
    // 加入其他圖片
    const imageTypes = [
      { id: '', title: '案例主圖' },
      { id: '_website', title: '網站設計' },
      { id: '_social', title: '社群經營' },
      { id: '_ads', title: '廣告投放' }
    ]
    
    imageTypes.forEach(({ id, title }) => {
      const imageUrl = `/images/cases/Case_${caseId}${id}.jpg`
      images.push({
        url: imageUrl,
        alt: `${name} - ${title}`,
        caption: title,
        type: 'image'
      })
    })
    
    return images
  }, [caseId, name, hasVideo, videoUrl])

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

  const handleImageError = useCallback((url: string) => {
    setImageErrors(prev => ({
      ...prev,
      [url]: true
    }))
  }, [])

  // 檢查圖片是否已載入錯誤
  const isImageError = useCallback((url: string) => {
    return imageErrors[url] || false
  }, [imageErrors])

  // 獲取圖片URL，如果載入錯誤則返回預設圖片
  const getImageUrl = useCallback((url: string) => {
    return isImageError(url) ? '/images/case-placeholder.jpg' : url
  }, [isImageError])

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
              {image.type === 'video' ? (
                <div className="absolute inset-0 bg-gray-100">
                  <iframe
                    src={image.url}
                    className="w-full h-full"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                  <Image
                    src={getImageUrl(image.url)}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                    onError={() => handleImageError(image.url)}
                    loading={index <= 1 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    quality={index <= 1 ? 85 : 75}
                  />
                </>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
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
              <div className="relative aspect-[16/9] bg-gray-100">
                {caseImages[activeImage].type === 'video' ? (
                  <iframe
                    src={caseImages[activeImage].url}
                    className="w-full h-full"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : (
                  <Image
                    src={getImageUrl(caseImages[activeImage].url)}
                    alt={caseImages[activeImage].alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    onError={() => handleImageError(caseImages[activeImage].url)}
                    priority
                    quality={90}
                  />
                )}
              </div>

              {/* 圖片說明 */}
              {caseImages[activeImage].caption && (
                <div className="p-4 bg-white border-t border-gray-100">
                  <p className="text-center text-gray-900 font-medium">
                    {caseImages[activeImage].caption}
                  </p>
                </div>
              )}

              {/* 導航按鈕 */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                <button
                  className="bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-all duration-300"
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
                  className="bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-all duration-300"
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
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                  {caseImages.map((image, idx) => (
                    <div
                      key={idx}
                      className={`relative flex-shrink-0 w-16 h-16 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        idx === activeImage 
                          ? 'border-primary scale-105 shadow-md' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveImage(idx)
                      }}
                    >
                      {image.type === 'video' ? (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      ) : (
                        <Image
                          src={getImageUrl(image.url)}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(image.url)}
                          sizes="64px"
                          quality={60}
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