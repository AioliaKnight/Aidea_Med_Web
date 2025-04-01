'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/common'

export default function CaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="成功案例展示"
        description="探索我們如何協助醫療診所提升品牌價值與患者轉換率，實現業務成長目標"
        variant="red"
        size="md"
        alignment="center"
        backgroundImage="/images/bgline-w.webp"
        className="border-b border-red-700"
      />
      <div className="container mx-auto px-4">
        
      </div>
      <div className="animate-fadeIn">
        {children}
      </div>
    </div>
  )
} 