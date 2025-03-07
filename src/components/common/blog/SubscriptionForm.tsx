'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SubscriptionFormProps {
  className?: string
}

export const SubscriptionForm = ({ className = '' }: SubscriptionFormProps) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 基本驗證
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('請輸入有效的電子郵件地址')
      return
    }
    
    setError('')
    setIsSubmitting(true)
    
    try {
      // 模擬API提交 - 在實際項目中，應替換為真實的API請求
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 假設成功訂閱
      setSubmissionStatus('success')
      setEmail('')
    } catch (err) {
      setSubmissionStatus('error')
      setError('訂閱失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`bg-primary/5 p-6 md:p-8 rounded-lg shadow-sm ${className}`}>
      <div className="max-w-md mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">訂閱我們的最新文章</h3>
        <p className="text-gray-600 mb-6">
          訂閱我們的電子報，獲取最新的數位行銷趨勢和牙醫診所經營策略
        </p>
        
        <AnimatePresence mode="wait">
          {submissionStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>感謝您的訂閱！我們將定期發送最新內容到您的信箱。</span>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="請輸入您的電子郵件地址"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSubmitting}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm mt-1 text-left"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    處理中...
                  </span>
                ) : (
                  '立即訂閱'
                )}
              </button>
              
              <p className="text-xs text-gray-500 mt-2">
                訂閱即表示您同意接收我們的電子報。您可以隨時取消訂閱。
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 