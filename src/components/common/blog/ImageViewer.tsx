'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ImageViewerProps {
  src: string
  alt: string
  onClose: () => void
}

export const ImageViewer = ({ src, alt, onClose }: ImageViewerProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-full max-h-full"
        >
          <button
            className="absolute -top-12 right-0 text-white hover:text-primary transition-colors p-2"
            onClick={onClose}
            aria-label="關閉圖片"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="90vw"
            onClick={(e) => e.stopPropagation()}
          />
          {alt && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-center mt-2 text-sm"
            >
              {alt}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 