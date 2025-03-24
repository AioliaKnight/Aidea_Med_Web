'use client'

import React, { useState } from 'react'
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

// 生成案例圖片
function generateCaseImages(caseId: string, name: string): CaseImage[] {
  // 根據案例ID生成一張主要圖片和相關視覺效果圖片
  return [
    {
      url: `/cases/${caseId}.jpg`,
      alt: `${name}主視覺`,
      caption: '全新品牌視覺設計'
    },
    {
      url: `/cases/${caseId}-website.jpg`,
      alt: `${name}網站設計`,
      caption: '響應式網站設計'
    },
    {
      url: `/cases/${caseId}-social.jpg`,
      alt: `${name}社群經營`,
      caption: '社群媒體內容規劃'
    },
    {
      url: `/cases/${caseId}-ads.jpg`,
      alt: `${name}廣告投放`,
      caption: '數位廣告成效分析'
    }
  ]
}

const CaseGallery: React.FC<CaseGalleryProps> = ({ caseId, name }) => {
  const [activeImage, setActiveImage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const caseImages = generateCaseImages(caseId, name)

  // 開啟畫廊模態框
  const openModal = (index: number) => {
    setActiveImage(index)
    setShowModal(true)
  }

  // 關閉畫廊模態框
  const closeModal = () => {
    setShowModal(false)
  }

  // 切換畫廊圖片
  const changeImage = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setActiveImage((prev) => (prev + 1) % caseImages.length)
    } else {
      setActiveImage((prev) => (prev - 1 + caseImages.length) % caseImages.length)
    }
  }

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
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/cases/case-placeholder.jpg'
                }}
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
              <p className="mt-2 text-sm text-center text-gray-600">
                {image.caption}
              </p>
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
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl"
              onClick={e => e.stopPropagation()}
            >
              {/* 關閉按鈕 */}
              <button 
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-20"
                onClick={closeModal}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* 左右箭頭 */}
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-20 p-2 bg-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  changeImage('prev')
                }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-20 p-2 bg-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  changeImage('next')
                }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* 主圖片 */}
              <div className="relative aspect-[16/9] bg-black">
                <Image
                  src={caseImages[activeImage]?.url || '/cases/case-placeholder.jpg'}
                  alt={caseImages[activeImage]?.alt || '案例圖片'}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={90}
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/cases/case-placeholder.jpg'
                  }}
                />
              </div>
              
              {/* 圖片說明 */}
              {caseImages[activeImage]?.caption && (
                <div className="bg-black p-4 text-white text-center">
                  <p>{caseImages[activeImage].caption}</p>
                  <p className="text-sm text-gray-300 mt-1">圖片 {activeImage + 1} / {caseImages.length}</p>
                </div>
              )}
              
              {/* 縮圖列表 */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {caseImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`relative aspect-[4/3] cursor-pointer ${
                      index === activeImage ? 'border-4 border-primary' : 'border border-gray-700'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveImage(index)
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 100px"
                      quality={60}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/cases/case-placeholder.jpg'
                      }}
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

export default CaseGallery 