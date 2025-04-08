'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { caseAnimations } from '@/utils/animations'
import { handleCaseImageError } from '@/utils/case'
import type { CaseRelatedProps } from '@/types/case'
import { caseStudies } from '@/data/cases'

const CaseRelated: React.FC<CaseRelatedProps> = ({ currentId, category }) => {
  // 使用 useMemo 緩存相關案例
  const relatedCases = useMemo(() => {
    return caseStudies
      .filter(caseStudy => 
        caseStudy.id !== currentId && 
        caseStudy.category === category
      )
      .slice(0, 3)
  }, [currentId, category])
  
  if (relatedCases.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {relatedCases.map((relatedCase, index) => (
        <Link
          key={relatedCase.id}
          href={`/case/${relatedCase.id}`}
          prefetch={true}
          className="group flex items-center p-3 hover:bg-gray-50 border border-transparent hover:border-primary/20 transition-all duration-300"
        >
          <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
            <img
              src={relatedCase.image || `/images/cases/${relatedCase.id}.jpg`}
              alt={relatedCase.name}
              className="max-h-12 max-w-[80%] object-contain group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = handleCaseImageError(target.src)
              }}
            />
          </div>
          <div className="ml-4 flex-grow overflow-hidden">
            <h4 className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors duration-300 text-sm">
              {relatedCase.name}
            </h4>
            <div className="flex items-center mt-1">
              <span className="px-2 py-0.5 text-xs border border-primary/20 text-primary">
                {relatedCase.category}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
      
      <div className="pt-4 mt-2 border-t border-gray-100">
        <Link
          href="/case"
          prefetch={true}
          className="text-primary hover:text-primary-dark text-sm flex items-center justify-center w-full py-2 border border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
        >
          查看所有案例
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default CaseRelated 