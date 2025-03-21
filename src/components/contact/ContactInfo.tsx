'use client'

import { motion } from 'framer-motion'

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
              <div className="flex flex-wrap gap-4">
                <a href="https://www.facebook.com/www.aideamed" target="_blank" rel="noopener noreferrer" className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                  </svg>
                </a>
                
                <a href="https://www.instagram.com/aidea_med/" target="_blank" rel="noopener noreferrer" className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                
                <a href="https://www.linkedin.com/company/aideamed" target="_blank" rel="noopener noreferrer" className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
                
                <a href="https://lin.ee/ZPdkmHh" target="_blank" rel="noopener noreferrer" className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.819 4.588 8.845 10.784 9.613.421.097 1.003.3 1.141.692.13.36.084.921.043 1.273 0 0-.171 1.063-.208 1.29-.063.218-.292.874 1.01.477 1.303-.397 7.02-4.131 9.575-7.072 1.766-1.935 2.645-3.874 2.645-6.273zm-17.339 4.292h-1.961v-3.634a.48.48 0 0 0-.48-.48h-.084a.48.48 0 0 0-.48.48v4.226c0 .266.216.48.48.48h2.525a.48.48 0 0 0 .48-.48v-.113a.48.48 0 0 0-.48-.479zm1.872-3.646a.48.48 0 0 0-.48.48v4.226c0 .266.216.48.48.48h.084a.48.48 0 0 0 .48-.48v-4.226a.48.48 0 0 0-.48-.48h-.084zm4.261 2.158c0-.266-.216-.48-.48-.48h-.084a.48.48 0 0 0-.48.48v2.07h-1.969v-2.07a.48.48 0 0 0-.48-.48h-.084a.48.48 0 0 0-.48.48v4.226c0 .266.216.48.48.48h.084a.48.48 0 0 0 .48-.48v-1.182h1.969v1.182a.48.48 0 0 0 .48.48h.084a.48.48 0 0 0 .48-.48v-4.226zm3.071-1.488h-2.525a.48.48 0 0 0-.48.48v4.226c0 .266.216.48.48.48h2.525a.48.48 0 0 0 .48-.48v-.113a.48.48 0 0 0-.48-.479h-1.961v-.773h1.961a.48.48 0 0 0 .48-.48v-.113a.48.48 0 0 0-.48-.479h-1.961v-.773h1.961a.48.48 0 0 0 .48-.48v-.113a.48.48 0 0 0-.48-.483z" />
                  </svg>
                </a>

                <a href="https://www.aideamed.com" target="_blank" rel="noopener noreferrer" className="bg-primary/10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.41 8.64v6.5c0 3.22-2.6 5.83-5.83 5.83H8.64a5.83 5.83 0 01-5.83-5.83V8.64A5.83 5.83 0 018.64 2.81h6.93a5.83 5.83 0 015.84 5.83zm-7 10.15l3.76-3.76a2.64 2.64 0 000-3.73l-3.76-3.76a2.64 2.64 0 00-3.73 0L7 11.31a2.64 2.64 0 000 3.73l3.76 3.76a2.64 2.64 0 003.73-.01zm-2.65-10.8a1.75 1.75 0 110 2.5 1.75 1.75 0 110-2.5zm5.28 5.28a1.75 1.75 0 11-2.5 0 1.75 1.75 0 012.5 0z" />
                  </svg>
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
          <div className="aspect-video rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.154726173558!2d121.54687947695335!3d25.02882267781986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ab0005b56f13%3A0xc0d73bbc6001d29d!2z6ZuF5b635oCd6KGM6Yq36aGn5ZWP!5e0!3m2!1szh-TW!2stw!4v1742557801622!5m2!1szh-TW!2stw"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </AnimatedDiv>
  )
} 