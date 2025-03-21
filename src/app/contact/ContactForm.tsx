'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { ContactFormData, FormResponse } from '@/types/form'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  title: string
  message: string
}

// 初始表單數據
const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  title: '',
  message: ''
}

// 表單映射到ContactFormData
const mapFormDataToContactFormData = (data: FormData): ContactFormData => {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    clinic: data.company,
    position: data.title,
    message: data.message
  }
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 驗證表單
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('請填寫所有必填欄位')
      setIsSubmitting(false)
      return
    }

    try {
      // 映射為統一的表單數據結構
      const contactFormData = mapFormDataToContactFormData(formData)

      // 發送表單數據到API端點
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactFormData),
      })

      const data: FormResponse = await response.json()

      if (response.ok) {
        // 顯示成功訊息
        toast.success(data.message || '感謝您的訊息，我們會盡快回覆！')
        // 清空表單
        setFormData(initialFormData)
      } else {
        // 顯示錯誤訊息
        toast.error(data.message || '提交失敗，請稍後再試。')
      }
    } catch (error) {
      console.error('表單提交錯誤：', error)
      toast.error('提交失敗，請稍後再試。')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 處理輸入變化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-20 md:py-28">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-black mb-4">
              聯絡我們
            </h1>
            <p className="text-lg text-white/90">
              我們期待與您展開對話，為您的診所打造最適合的行銷策略
            </p>
          </motion.div>
        </div>
      </section>

      {/* 聯絡資訊 */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* 聯絡表單 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8"
            >
              <h2 className="text-2xl font-bold mb-6">免費諮詢</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    電子郵件
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    聯絡電話
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    診所名稱
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    諮詢內容
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 focus:border-primary focus:outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 font-medium hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? '處理中...' : '送出諮詢'}
                </button>
              </form>
            </motion.div>

            {/* 聯絡資訊 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">聯絡資訊</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">地址</h3>
                    <p className="text-gray-600">台北市大安區敦化南路二段99號13樓</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">營業時間</h3>
                    <p className="text-gray-600">週一至週五：09:00 - 18:00</p>
                    <p className="text-gray-600">週六、週日：休息</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">聯絡方式</h3>
                    <p className="text-gray-600">電話：(02) 2345-6789</p>
                    <p className="text-gray-600">Email：contact@aideamed.com</p>
                  </div>
                </div>
              </div>

              {/* Google 地圖嵌入 */}
              <div className="aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.0088590165146!2d121.54673731500854!3d25.033776983972203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abd379a5ec97%3A0xedc006d25a9e35df!2zMTA25Y-w5YyX5biC5aSn5a6J5Y2A5pWm5YyW5Y2X6Lev5LqM5q61OTnomZ8!5e0!3m2!1szh-TW!2stw!4v1631234567890!5m2!1szh-TW!2stw"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
} 