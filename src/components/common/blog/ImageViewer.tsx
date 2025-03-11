'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import Image from 'next/image'

interface ImageViewerProps {
  src: string
  alt: string
  onClose: () => void
}

export const ImageViewer = ({ src, alt, onClose }: ImageViewerProps) => {
  // 按 ESC 關閉
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        onClick={onClose}
      >
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          onClick={onClose}
        >
          <IoClose size={32} />
        </motion.button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-[90vw] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={675}
            className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
            priority
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 