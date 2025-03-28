'use client'

import { PageHeader } from '@/components/common'
import { motion } from 'framer-motion'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'
import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export default function ContactPage() {
  // 明確追蹤聯絡頁面瀏覽
  useEffect(() => {
    trackPageView('聯絡我們 - Aidea:Med 醫療行銷顧問', '/contact')
  }, [])
  
  return (
    <div className="bg-white">
      {/* 頁面標題區 */}
      <PageHeader 
        title="讓我們聆聽您的故事" 
        description="每間診所都有獨特的挑戰與願景，讓我們一同探索適合您的成長路徑"
        variant="red"
        size="md"
        alignment="center"
        backgroundImage="/images/bgline-w.webp"
        className="border-b border-red-700"
      />
      
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 聯絡表單區域 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 p-6 lg:p-8 rounded-lg shadow-sm"
          >
            <ContactForm 
              showTitle={true}
              animation={true}
              className="max-w-2xl"
            />
          </motion.div>
          
          {/* 聯絡資訊區域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactInfo />
          </motion.div>
        </div>
      </div>
    </div>
  )
} 