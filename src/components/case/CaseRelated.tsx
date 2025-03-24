'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { caseStudies, CaseStudy } from '@/components/pages/CasePage'

interface CaseRelatedProps {
  currentId: string
  category: string
}

const CaseRelated: React.FC<CaseRelatedProps> = ({ currentId, category }) => {
  // 使用 useMemo 緩存相關案例
  const relatedCases = useMemo(() => {
    return caseStudies
      .filter(c => c.id !== currentId && (c.category === category || c.featured))
      .slice(0, 3)
  }, [currentId, category])
  
  if (relatedCases.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {relatedCases.map((relatedCase, index) => (
        <motion.div
          key={relatedCase.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            href={`/case/${relatedCase.id}`}
            prefetch={true}
            className="flex items-center p-2 hover:bg-gray-50 group transition-colors duration-300"
          >
            <div className="relative h-16 w-16 flex-shrink-0 bg-gray-200 overflow-hidden">
              <Image
                src={relatedCase.image || `/cases/${relatedCase.id}.jpg`}
                alt={relatedCase.name}
                fill
                sizes="64px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/cases/case-placeholder.jpg'
                }}
              />
            </div>
            <div className="ml-4 flex-grow overflow-hidden">
              <h4 className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors duration-300">
                {relatedCase.name}
              </h4>
              <p className="text-sm text-gray-500 line-clamp-1">
                {relatedCase.category}
              </p>
            </div>
            <div className="flex-shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </motion.div>
      ))}
      
      <div className="pt-4 mt-4 border-t border-gray-100">
        <Link
          href="/case"
          prefetch={true}
          className="text-primary hover:underline text-sm flex items-center"
        >
          查看所有案例
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default CaseRelated 