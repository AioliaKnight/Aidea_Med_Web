'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/common/PageHeader'
import Link from 'next/link'
import { ErrorBoundary } from 'react-error-boundary'

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 這裡會處理表單提交邏輯，例如API呼叫
    console.log('Form submitted:', formData)
    setFormSubmitted(true)
  }

  return (
    <div>
      <PageHeader 
        title="讓我們聆聽您的故事" 
        description="每間診所都有獨特的挑戰與願景，讓我們一同探索適合您的成長路徑"
      />
      
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-20">
            {/* Left Side - Form */}
            <div className="lg:col-span-3">
              <motion.div 
                className="bg-white rounded-xl shadow-sm p-8 md:p-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {!formSubmitted ? (
                  <>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">與我們分享您的醫療願景</h2>
                    <p className="text-gray-600 mb-8">每位醫師與診所都有獨特的理念與挑戰，填寫以下表單，讓我們更了解您的需求與理想，我們將在24小時內與您聯繫，共同探索最適合的成長方案</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            您的姓名 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            placeholder="請輸入您的姓名"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            職稱
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            placeholder="例如：院長、醫師、管理人員"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            聯絡電話 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            placeholder="方便聯繫您的電話"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                            placeholder="您的電子郵件"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          診所/醫療機構名稱 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="clinic"
                          value={formData.clinic}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                          placeholder="您所屬的診所或醫療機構名稱"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          感興趣的服務項目
                        </label>
                        <select 
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        >
                          <option value="">請選擇服務項目</option>
                          <option value="brand">品牌故事打造</option>
                          <option value="digital">數位轉型優化</option>
                          <option value="content">內容行銷策略</option>
                          <option value="operation">全方位行銷推廣</option>
                          <option value="other">其他需求</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          您的需求與願景
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                          rows={5}
                          placeholder="請分享您的診所理念、面臨的挑戰或希望達成的目標，讓我們能更精準地為您提供協助..."
                        ></textarea>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="privacy" 
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          required 
                        />
                        <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                          我同意 Aidea:Med 根據<Link href="/privacy" className="text-primary hover:underline">隱私權政策</Link>處理我的個人資料
                        </label>
                      </div>
                      <motion.button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        送出諮詢需求
                      </motion.button>
                    </form>
                  </>
                ) : (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">感謝您的分享！</h2>
                    <p className="text-gray-600 mb-6">
                      我們已收到您的諮詢需求，專屬顧問將在24小時內與您聯繫，期待了解更多您診所的故事，一同探索最適合的行銷策略與成長方案。
                    </p>
                    <motion.button
                      onClick={() => setFormSubmitted(false)}
                      className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      返回表單
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Right Side - Contact Info & Benefits */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div 
                className="bg-white rounded-xl shadow-sm p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-xl font-bold mb-6">與我們直接對話</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">電話諮詢</h4>
                      <p className="text-gray-600 mb-1">週一至週五 9:00-18:00</p>
                      <a href="tel:+886227488919" className="text-primary font-medium hover:underline">02-2748-8919</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">電子郵件</h4>
                      <p className="text-gray-600 mb-1">24小時內回覆</p>
                      <a href="mailto:contact@aidea-med.com" className="text-primary font-medium hover:underline">contact@aidea-med.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">公司地址</h4>
                      <p className="text-gray-600 mb-1">歡迎預約來訪</p>
                      <address className="text-gray-700 not-italic">
                        台北市大安區敦化南路二段99號13樓
                      </address>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">社群媒體</h4>
                      <p className="text-gray-600 mb-2">關注最新醫療行銷趨勢</p>
                      <div className="flex space-x-3">
                        <a href="https://www.facebook.com/aideamed" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                          <span className="sr-only">Facebook</span>
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a href="https://www.instagram.com/aideamed" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                          <span className="sr-only">Instagram</span>
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a href="https://www.linkedin.com/company/aideamed" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                          <span className="sr-only">LinkedIn</span>
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-primary/5 rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold mb-6">為何選擇我們？</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">深入了解台灣醫療環境與診所挑戰</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">兼顧專業形象與溫度的行銷策略</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">結合AI數據分析與人文關懷的獨特優勢</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">十年以上豐富醫療行銷經驗與實績</p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <blockquote className="italic text-gray-600 mb-4">
                    "我們相信，真正好的醫療行銷應建立在對醫者初心的尊重與理解之上。"
                  </blockquote>
                  <Link 
                    href="/services" 
                    className="text-primary font-medium flex items-center hover:underline"
                  >
                    了解我們的服務理念 
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <motion.div 
              className="bg-primary/5 p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">常見問答集</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                對我們的服務有疑問？以下是診所夥伴們最常詢問的問題
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
              <motion.div 
                className="p-6 border border-gray-100 rounded-lg hover:border-primary/30 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="font-bold text-lg mb-3">服務範圍涵蓋哪些診所類型？</h3>
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