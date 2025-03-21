'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { animations } from '@/utils/animations'
import { ContactFormData, FormResponse, FormStatus } from '@/types/form'
import SubmitButton from '@/components/common/SubmitButton'

interface ContactFormProps {
  className?: string
  animation?: boolean
  showTitle?: boolean
}

export default function ContactForm({
  className = '',
  animation = true,
  showTitle = true
}: ContactFormProps) {
  // 服務選項
  const services = [
    { value: "", label: "請選擇服務項目" },
    { value: "brand", label: "品牌故事打造" },
    { value: "marketing", label: "整合行銷服務" },
    { value: "digital", label: "數位轉型優化" },
    { value: "content", label: "內容創作服務" },
    { value: "other", label: "其他服務" }
  ];

  // 表單初始狀態
  const initialFormData: ContactFormData = {
    name: '',
    email: '',
    phone: '',
    clinic: '',
    position: '',
    service: '',
    message: ''
  }

  const [formData, setFormData] = useState<ContactFormData>(initialFormData)
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.IDLE)

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
    setFormStatus(FormStatus.SUBMITTING)

    // 驗證表單
    if (!formData.name || !formData.email || !formData.phone || !formData.service) {
      toast.error('請填寫所有必填欄位')
      setFormStatus(FormStatus.ERROR)
      return
    }

    try {
      // 發送表單數據到API端點
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data: FormResponse = await response.json()

      if (response.ok) {
        // 清空表單
        setFormData(initialFormData)
        
        // 顯示成功訊息
        toast.success(data.message || '感謝您的訊息！我們的醫療行銷顧問將於一個工作日內與您聯繫。')
        setFormStatus(FormStatus.SUCCESS)
        
        // 3秒後重置狀態
        setTimeout(() => {
          setFormStatus(FormStatus.IDLE)
        }, 3000)
      } else {
        // 顯示錯誤訊息
        toast.error(data.message || '提交失敗，請稍後再試。')
        setFormStatus(FormStatus.ERROR)
      }
    } catch (error) {
      console.error('表單提交錯誤：', error)
      toast.error('提交失敗，請稍後再試。')
      setFormStatus(FormStatus.ERROR)
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
              {services.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
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
          <SubmitButton
            status={formStatus}
            idleText="預約免費諮詢"
            submittingText="提交中..."
            successText="提交成功！"
            errorText="提交失敗，請重試"
            className="rounded-lg shadow-sm"
          />
          <p className="text-xs text-gray-500 mt-3 text-center">
            提交表單即表示您同意我們的隱私政策。您的資料將受到保護，僅用於行銷諮詢服務。
          </p>
        </div>
      </form>
    </AnimatedDiv>
  )
} 