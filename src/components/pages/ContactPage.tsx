'use client'

import { PageHeader } from '@/components/common'
import { motion } from 'framer-motion'
import { animations } from '@/utils/animations'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'

export default function ContactPage() {
  return (
    <div className="bg-white">
      <PageHeader 
        title="聯絡我們" 
        description="我們期待與您展開對話，為您的診所打造最適合的行銷策略"
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