'use client'

import { motion } from 'framer-motion'
import { FacebookLogo, InstagramLogo, LinkedinLogo, Globe, ChatCircle } from '@phosphor-icons/react'

interface ContactInfoProps {
  className?: string
  showTitle?: boolean
  showMap?: boolean
  showSocialMedia?: boolean
  animation?: boolean
}

export default function ContactInfo({
  className = '',
  showTitle = true,
  showMap = true,
  showSocialMedia = true,
  animation = true
}: ContactInfoProps) {
  // 如果使用動畫，則使用motion.div，否則使用普通div
  const AnimatedDiv = animation ? motion.div : 'div' as any

  // 動畫屬性
  const animationProps = animation ? {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  } : {}

  return (
    <AnimatedDiv
      {...animationProps}
      className={`space-y-8 ${className}`}
    >
      <div>
        {showTitle && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold">專業團隊聯絡方式</h2>
            <p className="text-gray-600 mt-2">我們的醫療行銷顧問隨時準備為您服務</p>
          </div>
        )}
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full text-primary mr-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">顧問團隊總部</h3>
              <p className="text-gray-600 mb-1">歡迎預約參訪討論</p>
              <p className="text-gray-900">台北市大安區敦化南路二段99號13樓</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full text-primary mr-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">顧問服務時間</h3>
              <p className="text-gray-600">週一至週五：09:00 - 18:00</p>
              <p className="text-gray-600">週六：預約制 / 週日：休息</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full text-primary mr-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">專線諮詢</h3>
              <p className="text-gray-600 mb-1">醫療行銷顧問直接服務</p>
              <a href="tel:+886227488919" className="text-primary font-medium hover:text-primary-dark transition-colors">
                (02) 2748-8919
              </a>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full text-primary mr-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">業務合作信箱</h3>
              <p className="text-gray-600 mb-1">24小時內專人回覆</p>
              <a href="mailto:contact@aideamed.com" className="text-primary font-medium hover:text-primary-dark transition-colors">
                contact@aideamed.com
              </a>
            </div>
          </div>
          
          {showSocialMedia && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">關注我們</h3>
              <p className="text-gray-600 mb-4">追蹤我們獲取最新醫療行銷趨勢與專業知識</p>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/www.aideamed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  aria-label="前往 Aidea Medical Facebook 粉絲專頁"
                >
                  <FacebookLogo className="w-6 h-6" />
                </a>
                <a
                  href="https://www.instagram.com/aidea_med/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  aria-label="前往 Aidea Medical Instagram 帳號"
                >
                  <InstagramLogo className="w-6 h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/company/aideamed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  aria-label="前往 Aidea Medical LinkedIn 公司頁面"
                >
                  <LinkedinLogo className="w-6 h-6" />
                </a>
                <a
                  href="https://lin.ee/ZPdkmHh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  aria-label="加入 Aidea Medical Line 官方帳號"
                >
                  <ChatCircle className="w-6 h-6" />
                </a>
                <a
                  href="https://www.aideamed.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  aria-label="前往 Aidea Medical 官方網站"
                >
                  <Globe className="w-6 h-6" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Google 地圖嵌入 */}
      {showMap && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">我們的位置</h3>
          <div className="aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d903.7886813800274!2d121.54945439999999!3d25.0288227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ab8b88183207%3A0x87dcf4ad28f1b7d1!2zQWlkZWE6TWVkIOmGq-eZguihjOmKt-mhp-WVj-WFrOWPuA!5e0!3m2!1szh-TW!2stw!4v1742886041837!5m2!1szh-TW!2stw"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Aidea Medical 位置地圖"
              aria-label="Aidea Medical 在台北市的位置地圖"
            />
          </div>
        </div>
      )}
    </AnimatedDiv>
  )
} 