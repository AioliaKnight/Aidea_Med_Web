'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { animations } from '@/utils/animations'

interface ContactFormProps {
  className?: string
  animation?: boolean
  showTitle?: boolean
}

interface FormData {
  name: string
  email: string
  phone: string
  clinic: string
  position?: string
  service: string
  message: string
}

export default function ContactForm({
  className = '',
  animation = true,
  showTitle = true
}: ContactFormProps) {
  // 服務選項
  const services = [
    '診所品牌形象建立',
    '醫療SEO與搜尋排名優化',
    '診所網站設計與開發',
    '社群媒體行銷與內容管理',
    '醫療服務廣告投放',
    '病患轉介紹與預約系統',
    '醫療專業內容製作',
    '數據分析與診所績效追蹤',
    '其他醫療行銷服務'
  ]

  // 表單初始狀態
  const initialFormData: FormData = {
    name: '',
    email: '',
    phone: '',
    clinic: '',
    position: '',
    service: '',
    message: ''
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 如果使用動畫，則使用motion.div，否則使用普通div
  const AnimatedDiv = animation ? motion.div : 'div' as any

  // 動畫屬性
  const animationProps = animation
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      }
    : {}

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 驗證表單
    if (!formData.name || !formData.email || !formData.phone || !formData.service) {
      toast.error('請填寫所有必填欄位')
      setIsSubmitting(false)
      return
    }

    // 模擬API請求
    try {
      // 在實際應用中，這裡會是一個API請求
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 清空表單
      setFormData(initialFormData)
      
      // 顯示成功訊息
      toast.success('感謝您的訊息！我們的醫療行銷顧問將於一個工作日內與您聯繫。')
      setIsSubmitting(false)
    } catch (error) {
      toast.error('提交失敗，請稍後再試。')
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatedDiv {...animationProps} className={`${className}`}>
      {showTitle && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">預約免費醫療行銷諮詢</h2>
          <p className="text-gray-600">
            讓專業顧問為您的診所量身打造行銷策略，一對一諮詢討論
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="請輸入您的姓名"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              電子郵件 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="您的電子郵件"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              聯絡電話 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="您的聯絡電話"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="clinic" className="block text-sm font-medium text-gray-700 mb-1">
              診所名稱 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="clinic"
              name="clinic"
              value={formData.clinic}
              onChange={handleChange}
              placeholder="您的診所名稱"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
          </div>
          
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              職稱
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position || ''}
              onChange={handleChange}
              placeholder="您的職稱（選填）"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
              需求服務 <span className="text-red-500">*</span>
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            >
              <option value="">請選擇服務項目</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            診所目前面臨的挑戰或需求
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="請描述您診所的行銷需求或目前面臨的挑戰，讓我們能更精準提供解決方案"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-sm transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? '提交中...' : '預約免費諮詢'}
          </button>
          <p className="text-xs text-gray-500 mt-3 text-center">
            提交表單即表示您同意我們的隱私政策。您的資料將受到保護，僅用於行銷諮詢服務。
          </p>
        </div>
      </form>
    </AnimatedDiv>
  )
} 