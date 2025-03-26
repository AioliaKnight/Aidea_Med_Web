'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { caseAnimations } from '@/utils/animations'
import type { CaseTimelineProps } from '@/types/case'
import { CaseStudy } from '@/components/pages/CasePage'

interface CaseTimelineProps {
  caseStudy: CaseStudy
}

// 時間軸項目介面
interface TimelineItem {
  title: string
  description: string
  date: string
  icon: React.ReactNode
}

// 生成時間軸數據
function generateTimeline(caseStudy: CaseStudy): TimelineItem[] {
  return [
    {
      title: '需求分析',
      description: '深入了解診所現況、目標客群與市場定位，制定完整的品牌策略。',
      date: '第一階段',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: '品牌規劃',
      description: '設計品牌識別系統，包含標誌、色彩計畫與視覺元素，建立一致的品牌形象。',
      date: '第二階段',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    {
      title: '執行階段',
      description: '根據規劃內容進行品牌重塑，包含空間改造、視覺設計與數位行銷等項目。',
      date: '第三階段',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: '成果驗收',
      description: '追蹤各項指標達成狀況，確保品牌轉型目標達成，並持續優化調整。',
      date: '第四階段',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]
}

const CaseTimeline: React.FC<CaseTimelineProps> = ({ caseStudy }) => {
  const timelineItems = generateTimeline(caseStudy)

  return (
    <div className="relative">
      {/* 時間軸線 */}
      <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/20 via-primary/10 to-primary/20 hidden sm:block" />
      
      <div className="space-y-6 sm:space-y-8">
        {timelineItems.map((item, index) => (
          <div
            key={index}
            className="relative group"
          >
            {/* 時間軸點 */}
            <div className="absolute left-0 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center -translate-x-1/2 sm:-translate-x-1/2">
              <div className="relative">
                {/* 圖標容器 */}
                <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors duration-300">
                  <div className="text-primary/80 group-hover:text-primary transition-colors duration-300">
                    {item.icon}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 內容卡片 */}
            <div className="ml-8 sm:ml-16 bg-white rounded-xl border border-gray-100 p-4 sm:p-6 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-primary/80 uppercase tracking-wider">
                  {item.date}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CaseTimeline 