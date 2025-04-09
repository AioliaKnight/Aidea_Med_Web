'use client'

import React, { useState, useEffect, useCallback, useMemo, useTransition, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { animations } from '@/utils/animations'
import { ContactFormData, FormResponse, FormStatus } from '@/types/form'
import { trackFormSubmission } from '@/lib/analytics'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'

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
  const [showExtraInfo, setShowExtraInfo] = useState(false)
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [errors, setErrors] = useState<Record<keyof ContactFormData, string>>({})

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

  // 重設表單
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFormStatus(FormStatus.IDLE);
    setShowThankYou(false);
    setShowExtraInfo(false);
    setPrivacyChecked(false);
    setErrors({});
  }, []);

  // 基本輸入框模板
  const renderInput = (name: keyof ContactFormData, label: string, placeholder: string, type = 'text', required = false) => (
    <Input
      name={name}
      value={formData[name]}
      onChange={handleChange}
      label={label + (required ? ' *' : '')}
      placeholder={placeholder}
      type={type}
      disabled={formStatus === FormStatus.SUBMITTING}
      error={errors[name]}
      className="mb-4"
    />
  );

  // 下拉選單模板
  const renderSelect = (name: string, label: string, options: {value: string, label: string}[], required = false) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        {label + (required ? ' *' : '')}
      </label>
      <select
        name={name}
        value={(formData as any)[name]}
        onChange={handleChange}
        disabled={formStatus === FormStatus.SUBMITTING}
        className={cn(
          "w-full px-4 py-3 border border-gray-200 focus:border-primary focus:ring-0 transition-colors",
          errors[name] && "border-red-500 focus:border-red-500",
          formStatus === FormStatus.SUBMITTING && "bg-gray-100 text-gray-500 cursor-not-allowed"
        )}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  // 顯示感謝頁面
  if (showThankYou) {
    return (
      <AnimatedDiv {...animationProps} className="text-center py-8">
        <div className="text-primary text-5xl mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold mb-3">感謝您的諮詢！</h3>
        <p className="text-gray-600 mb-8">
          我們已收到您的訊息，將在1個工作日內與您聯繫。<br />
          期待與您進一步討論診所的行銷需求。
        </p>
        
        <Button 
          onClick={resetForm}
          variant="outline-red"
          size="lg"
        >
          填寫新的諮詢表單
        </Button>
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
          
          {renderInput('name', '姓名', '請輸入您的姓名', 'text', true)}
          {renderInput('email', '電子郵件', '請輸入您的電子郵件', 'email', true)}
          {renderInput('phone', '聯絡電話', '請輸入您的聯絡電話', 'tel', true)}
          {renderInput('clinic', '診所/機構名稱', '請輸入您的診所或機構名稱')}
          {renderInput('position', '職稱', '請輸入您的職稱')}
        </div>
        
        {/* 需求資訊 */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h3 className="font-medium mb-4 text-gray-800 flex items-center">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
            需求資訊
          </h3>
          
          {renderSelect('service', '需要的服務', services, true)}
          {renderSelect('clinicSize', '診所規模', clinicSizes)}
          {renderSelect('contactTime', '偏好聯絡時段', contactTimes)}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              諮詢內容
            </label>
            <textarea
              name="message"
              placeholder="請簡述您的需求或問題"
              value={formData.message}
              onChange={handleChange}
              disabled={formStatus === FormStatus.SUBMITTING}
              className={cn(
                "w-full px-4 py-3 border border-gray-200 focus:border-primary focus:ring-0 transition-colors h-32",
                errors.message && "border-red-500 focus:border-red-500",
                formStatus === FormStatus.SUBMITTING && "bg-gray-100 text-gray-500 cursor-not-allowed"
              )}
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
        </div>
        
        {/* 額外資訊 - 可摺疊區塊 */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <button 
            type="button"
            onClick={() => setShowExtraInfo(!showExtraInfo)}
            className="w-full text-left font-medium text-gray-800 flex items-center justify-between mb-2 focus:outline-none"
          >
            <span className="flex items-center">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">3</span>
              其他參考資訊 (選填)
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${showExtraInfo ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showExtraInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-2"
            >
              {renderInput('competitors', '主要競爭診所', '請列出您所知的競爭診所名稱')}
              {renderInput('budget', '預算範圍', '請提供您的行銷預算範圍 (選填)')}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  您如何得知我們？
                </label>
                <div className="space-y-2">
                  {marketingSources.map(source => (
                    <label key={source.value} className="flex items-center">
                      <input
                        type="radio"
                        name="source"
                        value={source.value}
                        checked={formData.source === source.value}
                        onChange={handleChange}
                        disabled={formStatus === FormStatus.SUBMITTING}
                        className="text-primary mr-2"
                      />
                      {source.label}
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* 隱私權政策確認 */}
        <div className="mt-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={privacyChecked}
              onChange={() => setPrivacyChecked(!privacyChecked)}
              disabled={formStatus === FormStatus.SUBMITTING}
              className="text-primary mt-1 mr-2"
              required
            />
            <span className="text-sm text-gray-600">
              我已閱讀並同意<a href="/privacy" target="_blank" className="text-primary underline">隱私權政策</a>，並同意Aidea:Med處理我的個人資料用於回覆諮詢。
            </span>
          </label>
        </div>
        
        {/* 提交按鈕 */}
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={formStatus === FormStatus.SUBMITTING}
            loadingText="提交中..."
            disabled={formStatus === FormStatus.SUBMITTING || !privacyChecked}
          >
            送出諮詢表單
          </Button>
        </div>
      </form>
    </AnimatedDiv>
  )
});

ContactForm.displayName = 'ContactForm';

export default ContactForm 