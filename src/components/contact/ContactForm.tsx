'use client'

import React, { useState, useEffect, useCallback, useMemo, useTransition, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { animations } from '@/utils/animations'
import { ContactFormData, FormResponse, FormStatus } from '@/types/form'
import SubmitButton from '@/components/common/SubmitButton'

// 在文件頂部添加 Google Analytics 類型聲明
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      action: string,
      params: {
        event_category: string;
        event_label: string;
        value?: string;
        [key: string]: any;
      }
    ) => void;
  }
}

interface ContactFormProps {
  className?: string
  animation?: boolean
  showTitle?: boolean
}

// 將服務選項移到組件外部避免重複創建
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
  message: '',
  plan: '',
  source: ''
}

// 使用React.memo優化組件渲染
const ContactForm = React.memo(({
  className = '',
  animation = true,
  showTitle = true
}: ContactFormProps) => {
  // 使用useRef保持數據持久性
  const searchParamsRef = useRef<{[key: string]: string}>({});
  const [isPending, startTransition] = useTransition()
  
  const [formData, setFormData] = useState<ContactFormData>(initialFormData)
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.IDLE)

  // 在客戶端獲取 URL 參數 - 使用useCallback優化
  const getUrlParams = useCallback(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get('plan');
      const sourceParam = params.get('source');
      
      const urlParams: {[key: string]: string} = {};
      if (planParam) urlParams.plan = planParam;
      if (sourceParam) urlParams.source = sourceParam;
      
      searchParamsRef.current = urlParams;
      
      // 更新表單數據
      setFormData(prev => ({
        ...prev,
        ...urlParams,
        // 如果是從定價方案頁面過來的，自動添加方案相關訊息到諮詢內容
        message: urlParams.plan 
          ? `我對${urlParams.plan}方案有興趣，想了解更多詳情。${prev.message || ''}`
          : prev.message
      }));
    }
  }, []);
  
  // 僅在客戶端運行一次
  useEffect(() => {
    getUrlParams();
  }, [getUrlParams]);

  // 如果使用動畫，則使用motion.div，否則使用普通div
  const AnimatedDiv = animation ? motion.div : 'div' as any

  // 動畫屬性 - 使用useMemo避免重複計算
  const animationProps = useMemo(() => animation
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      }
    : {}, [animation]);

  // 使用useCallback優化事件處理函數，避免重複創建
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, []);

  // 使用useCallback和useTransition優化表單提交
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus(FormStatus.SUBMITTING)

    // 使用useTransition處理非UI阻塞操作
    startTransition(async () => {
      try {
        // 確保方案信息被包含在提交的數據中
        const submissionData = {
          ...formData,
          // 保留從 URL 獲取的方案和來源資訊
          plan: formData.plan || searchParamsRef.current.plan || '',
          source: formData.source || searchParamsRef.current.source || ''
        }

        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        })

        const data = await response.json() as FormResponse

        if (response.ok) {
          setFormStatus(FormStatus.SUCCESS)
          setFormData(initialFormData)
          toast.success(data.message || '感謝您的訊息！我們將盡快與您聯繫。')
          
          // 添加追蹤事件
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'form_submission', {
              'event_category': 'contact',
              'event_label': submissionData.plan || '一般諮詢',
              'value': submissionData.source
            });
          }
        } else {
          setFormStatus(FormStatus.ERROR)
          toast.error(data.message || '提交失敗，請稍後再試。')
        }
      } catch (error) {
        console.error('表單提交錯誤：', error)
        setFormStatus(FormStatus.ERROR)
        toast.error('提交失敗，請稍後再試。')
      }
    });
  }, [formData, startTransition]);

  // 使用useMemo優化提交按鈕文本和狀態
  const submitButtonProps = useMemo(() => {
    return {
      status: formStatus,
      submittingText: '提交中...',
      idleText: '提交諮詢',
      successText: '提交成功',
      errorText: '請重試'
    }
  }, [formStatus]);

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

        <div className="flex justify-center">
          <SubmitButton {...submitButtonProps} />
        </div>
      </form>
    </AnimatedDiv>
  )
});

ContactForm.displayName = 'ContactForm';

export default ContactForm 