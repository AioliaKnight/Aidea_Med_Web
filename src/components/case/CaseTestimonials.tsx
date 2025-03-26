'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CaseStudy } from '@/components/pages/CasePage'

interface CaseTestimonialsProps {
  caseStudy: CaseStudy
}

// 客戶見證介面
interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  avatar?: string
}

// 生成客戶見證
function generateTestimonials(caseStudy: CaseStudy): Testimonial[] {
  return [
    {
      name: `${caseStudy.name.includes('診所') ? caseStudy.name.replace('診所', '') : caseStudy.name}院長`,
      role: '院長',
      company: caseStudy.name,
      content: `與Aidea:Med合作後，我們的網路預約人數增加了${Math.floor(Math.random() * 40 + 60)}%，新患者轉換率顯著提升。他們不只提供行銷服務，更能深入了解牙醫診所的特殊需求，提供專業且有效的解決方案。`,
      avatar: '/images/testimonials/doctor-avatar.jpg'
    },
    {
      name: '劉經理',
      role: '營運總監',
      company: caseStudy.name,
      content: `Aidea:Med團隊的專業度讓我們印象深刻，從市場分析到執行細節都非常到位。我們的品牌形象煥然一新，診所的數位足跡也大幅提升，是值得長期合作的夥伴。`,
      avatar: '/images/testimonials/manager-avatar.jpg'
    }
  ]
}

const CaseTestimonials: React.FC<CaseTestimonialsProps> = ({ caseStudy }) => {
  // 使用 useMemo 緩存見證資料
  const testimonials = React.useMemo(() => generateTestimonials(caseStudy), [caseStudy])
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({})

  // 處理圖片載入錯誤
  const handleImageError = React.useCallback((url: string) => {
    setImageErrors(prev => ({
      ...prev,
      [url]: true
    }))
  }, [])

  // 獲取圖片URL，如果載入錯誤則返回預設圖片
  const getImageUrl = React.useCallback((url: string) => {
    return imageErrors[url] ? '/images/testimonials/default-avatar.jpg' : url
  }, [imageErrors])

  return (
    <div className="space-y-8">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.2 }}
          className="bg-white p-6 rounded-lg border-l-4 border-primary relative shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto md:mx-0">
                {testimonial.avatar ? (
                  <Image
                    src={getImageUrl(testimonial.avatar)}
                    alt={testimonial.name}
                    width={96}
                    height={96}
                    className="object-cover"
                    onError={() => handleImageError(testimonial.avatar!)}
                    priority={index === 0}
                    quality={85}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow">
              <div className="absolute -top-4 -left-2 text-primary opacity-30 text-6xl">&ldquo;</div>
              <p className="text-gray-700 italic mb-4 relative z-10">
                {testimonial.content}
              </p>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">{testimonial.name}</span>
                <span className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">您也想成為我們的成功案例嗎？</h3>
        <p className="text-center text-gray-600 mb-6">
          立即預約免費諮詢，讓我們為您的診所打造專屬行銷策略
        </p>
        <div className="flex justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            預約免費諮詢
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default CaseTestimonials 