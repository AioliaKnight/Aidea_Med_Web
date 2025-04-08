'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { caseAnimations } from '@/utils/animations'
import { CaseStudy, Testimonial, CaseTestimonialsProps } from '@/types/case'

// 生成客戶見證
function generateTestimonials(caseStudy: CaseStudy): Testimonial[] {
  return [
    {
      content: `與Aidea:Med合作後，我們的網路預約人數增加了${Math.floor(Math.random() * 40 + 60)}%，新患者轉換率顯著提升。他們不只提供行銷服務，更能深入了解牙醫診所的特殊需求，提供專業且有效的解決方案。`,
      author: `${caseStudy.name.includes('診所') ? caseStudy.name.replace('診所', '') : caseStudy.name}院長`,
      title: '院長',
      company: caseStudy.name,
      avatar: '/images/testimonials/doctor-avatar.jpg'
    },
    {
      content: `Aidea:Med團隊的專業度讓我們印象深刻，從市場分析到執行細節都非常到位。我們的品牌形象煥然一新，診所的數位足跡也大幅提升，是值得長期合作的夥伴。`,
      author: '劉經理',
      title: '營運總監',
      company: caseStudy.name,
      avatar: '/images/testimonials/manager-avatar.jpg'
    }
  ]
}

const CaseTestimonials: React.FC<CaseTestimonialsProps> = ({ caseStudy, variant = 'card' }) => {
  // 如果沒有見證資料則不顯示組件
  if (!caseStudy.testimonial) {
    return null
  }

  // 使用 useState 追蹤圖片載入狀態
  const [imgStatus, setImgStatus] = useState({
    loading: true,
    error: false
  });

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">客戶回饋</h3>
        
        {/* 見證卡片 - 重新設計布局 */}
        <div className="relative bg-white border border-gray-100 overflow-hidden shadow-sm">
          {/* 左側裝飾 */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          
          <div className="p-6 sm:p-8">
            {/* 引號圖標 */}
            <div className="absolute top-4 right-4 text-primary/10">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* 客戶頭像 - 放大並置於左側 */}
              <div className="mx-auto sm:mx-0 sm:mt-2">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary/20">
                  {/* 載入狀態顯示 */}
                  {imgStatus.loading && (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center animate-pulse">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  
                  <Image
                    src={imgStatus.error ? '/images/testimonials/default-avatar.jpg' : '/images/testimonials/default-avatar.jpg'}
                    alt={caseStudy.testimonial.author}
                    fill
                    sizes="96px"
                    className={`
                      object-cover
                      transition-all duration-300
                      ${imgStatus.loading ? 'opacity-0' : 'opacity-100'}
                    `}
                    priority
                    quality={90}
                    onLoad={() => setImgStatus({ loading: false, error: false })}
                    onError={() => setImgStatus({ loading: false, error: true })}
                  />
                </div>
                
                {/* 客戶資料 - 僅在小螢幕時顯示在頭像下方 */}
                <div className="mt-3 text-center sm:hidden">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {caseStudy.testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {caseStudy.testimonial.title}
                  </p>
                </div>
              </div>
              
              <div className="flex-1">
                {/* 客戶資料 - 在大螢幕時顯示在內容上方 */}
                <div className="hidden sm:block mb-3">
                  <h4 className="font-semibold text-gray-900 text-xl">
                    {caseStudy.testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {caseStudy.testimonial.title}
                  </p>
                </div>
                
                {/* 見證內容 */}
                <p className="text-gray-600 text-lg leading-relaxed">
                  "{caseStudy.testimonial.content}"
                </p>
              </div>
            </div>
          </div>
          
          {/* 底部裝飾 */}
          <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-100">
            <span className="text-sm text-gray-500">專案合作夥伴</span>
            <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
              預約諮詢
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CaseTestimonials 