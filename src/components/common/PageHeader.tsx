'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export default function PageHeader({ 
  title, 
  description, 
  className = ''
}: PageHeaderProps) {
  return (
    <div className={`relative bg-primary text-white py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  )
} 