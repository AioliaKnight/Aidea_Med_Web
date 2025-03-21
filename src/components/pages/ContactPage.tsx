'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/common/PageHeader'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { ContactFormData, FormResponse } from '@/types/form'

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    title: '',
    phone: '',
    email: '',
    clinic: '',
    service: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 驗證表單
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('請填寫所有必填欄位')
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
        // 顯示成功訊息並標記為已提交
        setFormSubmitted(true)
      } else {
        // 顯示錯誤訊息
        toast.error(data.message || '提交失敗，請稍後再試。')
      }
    } catch (error) {
      console.error('表單提交錯誤：', error)
      toast.error('提交失敗，請稍後再試。')
    }
  }

  return (
    <div>
      <PageHeader 
        title="讓我們聆聽您的故事" 
        description="每間診所都有獨特的挑戰與願景，讓我們一同探索適合您的成長路徑"
        variant="red"
        size="lg"
        alignment="center"
        backgroundImage="/images/contact-header-bg.jpg"
        overlayOpacity={0.8}
      />
      
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-20">
            {/* Left Side - Form */}
            <div className="lg:col-span-3">
              <motion.div 
                className="bg-white border border-gray-100 p-8 md:p-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {!formSubmitted ? (
                  <>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 heading-underline">預約專業諮詢</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="animate-slide-up">
                          <label 
                            htmlFor="name" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            姓名 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                            placeholder="您的姓名"
                          />
                        </div>
                        <div className="animate-slide-up delay-100">
                          <label 
                            htmlFor="title" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            職稱
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                            placeholder="您的職稱"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="animate-slide-up delay-200">
                          <label 
                            htmlFor="phone" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            電話 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                            placeholder="聯絡電話"
                          />
                        </div>
                        <div className="animate-slide-up delay-300">
                          <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                            placeholder="電子郵件"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6 animate-slide-up delay-300">
                        <label 
                          htmlFor="clinic" 
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          診所名稱 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="clinic"
                          name="clinic"
                          required
                          value={formData.clinic}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                          placeholder="您的診所名稱"
                        />
                      </div>
                      
                      <div className="mb-6 animate-slide-up delay-300">
                        <label 
                          htmlFor="service" 
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          需求服務
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                        >
                          <option value="">請選擇服務項目</option>
                          <option value="brand">品牌故事打造</option>
                          <option value="marketing">整合行銷服務</option>
                          <option value="digital">數位轉型優化</option>
                          <option value="content">內容創作服務</option>
                          <option value="other">其他服務</option>
                        </select>
                      </div>
                      
                      <div className="mb-6 animate-slide-up delay-400">
                        <label 
                          htmlFor="message" 
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          諮詢內容
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-primary transition-colors duration-200"
                          placeholder="請簡述您的需求或問題"
                        ></textarea>
                      </div>
                      
                      <div className="animate-slide-up delay-500">
                        <button 
                          type="submit"
                          className="w-full bg-primary text-white py-3 font-semibold hover:bg-primary/90 transition-colors"
                        >
                          送出諮詢表單
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-10 animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 animate-slide-up">感謝您的諮詢</h2>
                    <p className="text-gray-600 mb-6 animate-slide-up delay-100">我們已收到您的表單，將會在 24 小時內與您聯繫。</p>
                    <Link 
                      href="/"
                      className="px-6 py-2 bg-primary text-white font-medium hover:bg-primary/90 transition-colors animate-slide-up delay-200"
                    >
                      返回首頁
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Right Side - Contact Information */}
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-white border border-gray-100 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6 heading-underline">聯絡資訊</h2>
                
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-start" 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">電話諮詢</h4>
                      <p className="text-gray-600">02-2748-8919</p>
                      <p className="text-gray-500 text-sm">週一至週五 9:00-18:00</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">Email 聯繫</h4>
                      <p className="text-gray-600">info@aideamed.com</p>
                      <p className="text-gray-500 text-sm">我們將在 24 小時內回覆</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">公司地址</h4>
                      <p className="text-gray-600">台北市內湖區瑞光路513巷32號7樓</p>
                      <p className="text-gray-500 text-sm">台北市 內湖科技園區</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">預約諮詢</h4>
                      <p className="text-gray-600">建議提前 3-5 天預約</p>
                      <p className="text-gray-500 text-sm">可安排線上或實體會議</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-100">
            <motion.div 
              className="bg-primary p-8 text-center text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 heading-accent">常見問答集</h2>
              <p className="text-white text-shadow-light max-w-2xl mx-auto">
                對我們的服務有疑問？以下是診所夥伴們最常詢問的問題
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
              <motion.div 
                className="p-6 border border-gray-100 hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="font-bold text-lg mb-3 heading-underline">服務範圍涵蓋哪些診所類型？</h3>
                <p className="text-gray-600">
                  我們專注於台灣各類醫療診所的行銷需求，主要包括牙醫、皮膚科、眼科、泌尿科等專科診所。每種專科都有其獨特的病患需求與溝通方式，我們會依據不同專科特性，客製化最合適的行銷策略。
                </p>
              </motion.div>
              <motion.div 
                className="p-6 border border-gray-100 rounded-lg hover:border-primary/30 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="font-bold text-lg mb-3">合作方式與收費標準如何？</h3>
                <p className="text-gray-600">
                  我們提供月費制的持續性合作與專案制的短期服務兩種模式。收費標準根據診所規模、需求複雜度與服務內容有所不同，我們重視透明溝通，會在初次諮詢後提供詳細報價與服務內容說明，歡迎預約免費諮詢。
                </p>
              </motion.div>
              <motion.div 
                className="p-6 border border-gray-100 rounded-lg hover:border-primary/30 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="font-bold text-lg mb-3">能保證行銷效果嗎？</h3>
                <p className="text-gray-600">
                  我們重視誠信與實際成效，不提供不切實際的保證。我們會與您共同設定合理的KPI目標，提供每月詳細的成效報告與分析，讓您清楚掌握每項行銷活動的實際效果。我們的成功案例與客戶推薦是我們服務品質的最佳保證。
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 