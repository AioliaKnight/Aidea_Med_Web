'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CaseStudy } from '@/components/pages/CasePage'

export interface CaseCardProps {
  caseStudy: CaseStudy;
  index: number;
}

export const CaseCard = ({ caseStudy, index }: CaseCardProps): JSX.Element => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  // 使用預設圖片或案例圖片
  const imageSrc = caseStudy.image || '/images/case-placeholder.jpg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* 圖片區域 */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {!imageError ? (
          <Image
            src={imageSrc}
            alt={caseStudy.name}
            fill
            className={`object-cover transform group-hover:scale-105 transition-transform duration-500 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageError(true)}
            priority={index < 2}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-4xl">📷</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* 內容區域 */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full">
            {caseStudy.category}
          </span>
          {caseStudy.featured && (
            <span className="flex items-center text-yellow-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {caseStudy.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {caseStudy.description}
        </p>

        {/* 成效指標 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
            <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-primary mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* 解決方案列表 */}
        {caseStudy.solutions && (
          <div className="space-y-2 mb-6">
            {caseStudy.solutions.slice(0, 3).map((solution, idx) => (
              <div key={idx} className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {solution.title}
              </div>
            ))}
          </div>
        )}

        {/* 查看詳情按鈕 */}
        <Link
          href={`/case/${caseStudy.id}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          查看詳細案例
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  )
} 