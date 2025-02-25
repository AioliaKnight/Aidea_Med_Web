'use client'

import { motion } from 'framer-motion'

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4
    }
  }
}

export default function CustomErrorFallback() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-background p-4"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-md w-full text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          系統暫時無法使用
        </h2>
        <p className="text-muted-foreground">
          我們正在進行修復，請稍後再試。
        </p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          重新整理
        </button>
      </div>
    </motion.div>
  )
} 