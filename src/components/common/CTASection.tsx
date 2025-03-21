'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

interface CTAButtonProps {
  href: string
  text: string
  variant: 'primary' | 'secondary'
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
  
  // 按鈕樣式 - 扁平化不透明風格
  const getButtonClass = (variant: 'primary' | 'secondary') => {
    const baseClass = "inline-block text-center min-w-[140px] md:min-w-[160px] px-6 md:px-8 py-4 font-medium text-base md:text-lg transition-all duration-300"
    
    if (variant === 'primary') {
      return `${baseClass} bg-white text-primary hover:bg-gray-100`
    } else {
      return `${baseClass} bg-black text-white hover:bg-black/90`
    }
  }

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
            <Link
              href={primaryButton.href}
              className={`${getButtonClass('primary')} ${primaryButton.className || ''}`}
            >
              {primaryButton.text}
            </Link>
            <Link
              href={secondaryButton.href}
              className={`${getButtonClass('secondary')} ${secondaryButton.className || ''}`}
            >
              {secondaryButton.text}
            </Link>
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