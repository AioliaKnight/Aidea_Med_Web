'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui'

interface CTAButtonProps {
  href: string
  text: string
  variant: 'primary' | 'white' | 'black' | 'outline-white' | 'outline-red' | 'outline-black' | 'dark-overlay' | 'link'
  className?: string
}

interface CTASectionProps {
  title: string
  description: string
  primaryButton: CTAButtonProps
  secondaryButton: CTAButtonProps
  titleClassName?: string
  descriptionClassName?: string
  buttonsContainerClassName?: string
  sectionId?: string
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  titleClassName = '',
  descriptionClassName = '',
  buttonsContainerClassName = '',
  sectionId
}) => {
  // 基礎樣式 - 扁平化現代風格
  const defaultTitleClass = "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 tracking-tight"
  const defaultDescriptionClass = "text-base sm:text-lg md:text-xl mb-10 sm:mb-12 max-w-2xl mx-auto font-normal"
  const defaultButtonsContainerClass = "flex flex-row gap-4 md:gap-6 justify-center items-center"
  
  return (
    <section 
      className="py-24 sm:py-28 md:py-32 bg-primary text-white relative"
      role="region"
      aria-labelledby={sectionId || "cta-title"}
    >
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto px-4 sm:px-6 relative"
        >
          {/* 上方裝飾線 */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 120 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-white w-0 mx-auto mb-10"
          ></motion.div>
          
          <motion.h2 
            id={sectionId || "cta-title"}
            className={`${defaultTitleClass} ${titleClassName}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            className={`${defaultDescriptionClass} ${descriptionClassName}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {description}
          </motion.p>
          
          <motion.div 
            className={`${defaultButtonsContainerClass} ${buttonsContainerClassName}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              href={primaryButton.href}
              variant={primaryButton.variant}
              size="xl"
              animate={true}
              className={primaryButton.className}
            >
              {primaryButton.text}
            </Button>
            
            <Button
              href={secondaryButton.href}
              variant={secondaryButton.variant}
              size="xl"
              animate={true}
              className={secondaryButton.className}
            >
              {secondaryButton.text}
            </Button>
          </motion.div>
          
          {/* 下方裝飾線 */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="h-1 bg-white w-0 mx-auto mt-16"
          ></motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection 