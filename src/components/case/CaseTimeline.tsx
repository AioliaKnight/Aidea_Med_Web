'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { caseAnimations } from '@/utils/animations'
import type { CaseTimelineProps, TimelineItem } from '@/types/case'

// 使用React.memo優化組件效能
const CaseTimeline: React.FC<CaseTimelineProps> = ({ items }) => {
  return (
    <div className="relative">
      {/* 時間軸線 */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
      
      {/* 時間軸項目 */}
      <div className="space-y-8">
        {items.map((item: TimelineItem, index: number) => (
          <motion.div
            key={index}
            variants={caseAnimations.timeline}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={index}
            className="relative pl-12"
          >
            {/* 時間軸點 */}
            <div className="absolute left-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {index + 1}
              </span>
            </div>
            
            {/* 內容區塊 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(CaseTimeline) 