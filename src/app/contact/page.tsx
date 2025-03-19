'use client'

import { motion } from 'framer-motion'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'

export default function ContactPage() {
  return (
    <main>
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">與醫療行銷專家對話</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              專注於您的醫療專業，讓我們處理行銷事務。Aidea:Med為牙醫、眼科、中醫、皮膚科等各類醫療診所提供專業且量身訂製的行銷解決方案。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-3">預約免費行銷諮詢</h2>
                  <p className="text-gray-600">
                    填寫以下表單，我們的醫療行銷顧問將與您聯繫，討論您診所的行銷需求和目標。
                  </p>
                </div>
                <ContactForm showTitle={false} />
              </motion.div>
            </div>
            
            <div className="md:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 h-full"
              >
                <ContactInfo showTitle={false} showMap={true} />
                
                <div className="mt-10 pt-10 border-t border-gray-100">
                  <h3 className="text-xl font-bold mb-4">為何選擇 Aidea:Med?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>專業團隊</strong>：醫療行銷專家與專科醫師顧問組成的團隊</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>AI技術整合</strong>：運用人工智能提升行銷效率與精準度</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>數據分析</strong>：以數據為導向制定行銷策略，追蹤成效</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><strong>全方位服務</strong>：從品牌建立到數位行銷，一站式解決方案</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 