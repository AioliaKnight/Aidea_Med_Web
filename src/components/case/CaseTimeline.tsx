'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
      description: `深入了解${caseStudy.name}的市場定位、目標客群和發展需求，制定客製化行銷策略。`,
      date: '第一階段',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: '策略規劃',
      description: '根據診斷結果，提供完整的行銷策略建議，包含品牌定位、通路規劃等。',
      date: '第二階段',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: '執行優化',
      description: '專業團隊執行行銷策略，持續監測成效並即時調整優化。',
      date: '第三階段',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]
}

const CaseTimeline: React.FC<CaseTimelineProps> = ({ caseStudy }) => {
  const timelineItems = generateTimeline(caseStudy)

  return (
    <div className="max-w-4xl mx-auto">
      {timelineItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="relative pl-8 pb-12 last:pb-0"
        >
          {/* 時間軸線 */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary" />
          
          {/* 時間點 */}
          <div className="absolute left-1 top-0 w-8 h-8 -translate-x-1/2 bg-primary text-white flex items-center justify-center">
            {item.icon}
          </div>
          
          {/* 內容 */}
          <div className="bg-white p-6 border-l-2 border-primary shadow-sm">
            <div className="text-sm text-primary font-medium mb-2">
              {item.date}
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              {item.title}
            </h3>
            <p className="text-gray-600">
              {item.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default CaseTimeline 