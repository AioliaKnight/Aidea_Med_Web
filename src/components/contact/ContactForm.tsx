'use client'

import React, { useState, useEffect, useCallback, useMemo, useTransition, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { animations } from '@/utils/animations'
import { ContactFormData, FormResponse, FormStatus } from '@/types/form'
import SubmitButton from '@/components/common/SubmitButton'
import { trackFormSubmission } from '@/lib/analytics'

// 注意：全局 gtag 類型已在 analytics.ts 中定義，此處不再重複定義

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
  { value: "social", label: "社群媒體經營" },
  { value: "website", label: "網站設計開發" },
  { value: "seo", label: "搜尋引擎優化" },
  { value: "ads", label: "廣告投放管理" },
  { value: "consultation", label: "行銷策略諮詢" },
  { value: "other", label: "其他服務" }
];

// 診所規模選項
const clinicSizes = [
  { value: "", label: "請選擇診所規模" },
  { value: "solo", label: "獨立診所 (1-2位醫師)" },
  { value: "small", label: "小型診所 (3-5位醫師)" },
  { value: "medium", label: "中型診所 (6-10位醫師)" },
  { value: "large", label: "大型診所 (10位以上醫師)" },
  { value: "chain", label: "連鎖診所 (多個據點)" }
];

// 偏好聯絡時段
const contactTimes = [
  { value: "", label: "請選擇偏好聯絡時段" },
  { value: "morning", label: "上午 (9:00-12:00)" },
  { value: "afternoon", label: "下午 (13:00-17:00)" },
  { value: "evening", label: "晚間 (17:00-19:00)" },
  { value: "anytime", label: "任何時段皆可" }
];

// 表單初始狀態
const initialFormData: ContactFormData & {
  clinicSize: string;
  contactTime: string;
  competitors: string;
  budget: string;
} = {
  name: '',
  email: '',
  phone: '',
  clinic: '',
  position: '',
  service: '',
  message: '',
  plan: '',
  source: '',
  clinicSize: '',
  contactTime: '',
  competitors: '',
  budget: ''
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
  
  const [formData, setFormData] = useState(initialFormData)
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.IDLE)
  const [showThankYou, setShowThankYou] = useState(false)

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

  // 處理表單提交
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus(FormStatus.SUBMITTING)

    // 使用useTransition處理非UI阻塞操作
    startTransition(async () => {
      try {
        // 進行表單基本驗證
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
          setFormStatus(FormStatus.ERROR)
          toast.error('請填寫所有必填欄位')
          return
        }

        // 驗證電子郵件格式
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(formData.email)) {
          setFormStatus(FormStatus.ERROR)
          toast.error('請輸入有效的電子郵件地址')
          return
        }
        
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
          setShowThankYou(true)
          // 使用統一的分析工具庫追蹤表單提交事件
          trackFormSubmission('contact_form', submissionData)
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

  // 重設表單
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFormStatus(FormStatus.IDLE);
    setShowThankYou(false);
  }, []);

  // 顯示感謝頁面
  if (showThankYou) {
    return (
      <AnimatedDiv {...animationProps} className={`${className} text-center py-8`}>
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-3">感謝您的諮詢</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          我們已收到您的表單，專業顧問將於 1 個工作日內與您聯繫，為您提供客製化的行銷解決方案。
        </p>
        <div className="bg-gray-50 p-5 rounded-lg mb-6 max-w-md mx-auto">
          <h3 className="font-medium mb-2">後續流程</h3>
          <ol className="text-left text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">1</span>
              <span>顧問電話初步了解您的需求</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">2</span>
              <span>安排免費一對一深度諮詢</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">3</span>
              <span>提供客製化行銷方案建議</span>
            </li>
          </ol>
        </div>
        <button 
          onClick={resetForm}
          className="px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-md"
        >
          填寫新的諮詢表單
        </button>
      </AnimatedDiv>
    );
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
        {/* 基本資訊 */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="font-medium mb-4 text-gray-800 flex items-center">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
            基本資訊
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
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
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
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
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="contactTime" className="block text-sm font-medium text-gray-700 mb-1">
                偏好聯絡時段
              </label>
              <select
                id="contactTime"
                name="contactTime"
                value={formData.contactTime}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                {contactTimes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 診所資訊 */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="font-medium mb-4 text-gray-800 flex items-center">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
            診所資訊
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                required
              />
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                您的職稱
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
                placeholder="您的職稱（選填）"
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="clinicSize" className="block text-sm font-medium text-gray-700 mb-1">
                診所規模
              </label>
              <select
                id="clinicSize"
                name="clinicSize"
                value={formData.clinicSize}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                {clinicSizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                月行銷預算
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="">請選擇月預算範圍</option>
                <option value="100k-150k">100,000-150,000元</option>
                <option value="150k-200k">150,000-200,000元</option>
                <option value="200k-300k">200,000-300,000元</option>
                <option value="over300k">300,000元以上</option>
                <option value="undecided">尚未決定</option>
              </select>
            </div>
          </div>
        </div>

        {/* 需求資訊 */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="font-medium mb-4 text-gray-800 flex items-center">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</span>
            需求資訊
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                需求服務 <span className="text-red-500">*</span>
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                required
              >
                {services.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="competitors" className="block text-sm font-medium text-gray-700 mb-1">
                主要競爭對手
              </label>
              <input
                type="text"
                id="competitors"
                name="competitors"
                value={formData.competitors}
                onChange={handleChange}
                placeholder="您診所周邊或同領域的競爭對手"
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
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
                rows={4}
                placeholder="請描述您診所的行銷需求或目前面臨的挑戰，讓我們能更精準提供解決方案"
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-3">
          <SubmitButton {...submitButtonProps} className="rounded-md py-2.5" />
        </div>

        <p className="text-center text-xs text-gray-500 mt-3">
          提交表單即表示您同意我們的隱私政策，我們會妥善保管您的資料。
        </p>
      </form>
    </AnimatedDiv>
  )
});

ContactForm.displayName = 'ContactForm';

export default ContactForm 