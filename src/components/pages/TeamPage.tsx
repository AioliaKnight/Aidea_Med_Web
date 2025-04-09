'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { OptimizedImage, Spinner, PageHeader, AnimatedSection } from '@/components/common'
import {
  LightBulbIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { animations } from '@/utils/animations'

// 定義團隊成員類型
interface SocialLink {
  platform: string;
  url: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  socialLinks: SocialLink[];
  expertise: string[];
  quote: string;
}

// 團隊成員數據
const teamMembers: TeamMember[] = [
  {
    name: '陳維鈞 Wilson',
    role: '創辦人暨策略總監',
    image: '/images/team/member-1.jpg',
    description: '擁有十五年以上醫療行銷經驗，專精於診所品牌策略與患者體驗設計。帶領團隊協助超過50家診所重塑品牌形象，深諳如何將專業醫療價值轉譯為患者信任。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'instagram', url: 'https://www.instagram.com/aidea_med/' },
      { platform: 'line', url: 'https://lin.ee/ZPdkmHh' }
    ],
    expertise: ['醫療品牌策略', '患者體驗設計', '醫病溝通優化'],
    quote: '每位醫師都有獨特的故事與價值，我的使命是讓這些故事被更多患者看見與理解。'
  },
  {
    name: 'Mike',
    role: '數位行銷總監',
    image: '/images/team/member-2.jpg',
    description: '數位行銷專家，擅長診所網站優化與精準投放策略。過去五年成功幫助30多家醫療機構提升40%以上的新患數量，專注於將數據轉化為實際診所成長。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'instagram', url: 'https://www.instagram.com/aidea_med/' }
    ],
    expertise: ['搜尋引擎優化', '醫療轉換率提升', '精準廣告投放'],
    quote: '每一個數據背後都是一個尋求幫助的人，我們的工作是讓對的醫師被對的患者找到。'
  },
  {
    name: 'Leo',
    role: '創意內容總監',
    image: '/images/team/member-3.jpg',
    description: '資深醫療內容策略專家，擅長將艱澀的醫療知識轉化為患者易懂且具共鳴的內容。帶領創意團隊為診所打造各類專業醫療內容，建立患者信任與醫師權威。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'instagram', url: 'https://www.instagram.com/aidea_med/' }
    ],
    expertise: ['醫療故事敘事', '衛教內容創作', '專業知識轉譯'],
    quote: '最動人的醫療故事往往是最簡單的真實分享，我們的文字是連結醫師熱忱與患者信任的橋樑。'
  },
  {
    name: 'Chloe',
    role: '業務經理',
    image: '/images/team/member-4.jpg',
    description: '資深業務專家，專注於醫療機構客戶關係管理與業務策略。擅長精準掌握醫師需求並轉化為客製化行銷方案，協助超過40家診所建立品牌差異化並有效提升患者轉換率。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'instagram', url: 'https://www.instagram.com/aidea_med/' }
    ],
    expertise: ['醫療客戶關係', '業務策略規劃', '客製化方案設計'],
    quote: '每位醫師背後都有獨特的專業故事，我的工作是協助他們找到最適合的方式，讓這些價值被更多需要的患者看見。'
  },
  {
    name: 'Queena',
    role: '顧客關係總監',
    image: '/images/team/member-5.jpg',
    description: '專注於醫療顧客體驗與患者忠誠度系統建立。深入理解醫病關係的獨特性，協助診所設計全方位的患者溝通策略，成功提升客戶30%以上的回診率。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'instagram', url: 'https://www.instagram.com/aidea_med/' }
    ],
    expertise: ['患者體驗管理', '醫療關係維護', '診所服務優化'],
    quote: '每位走進診所的人都帶著自己的故事與擔憂，我們的使命是讓他們感受到：這裡有人真正在乎你。'
  },
  {
    name: '西裝哥',
    role: '技術開發總監',
    image: '/images/team/member-6.jpg',
    description: '資深醫療科技專家，專精於診所數位轉型與患者體驗優化。領導技術團隊開發整合預約管理、患者關係維護等系統，提升診所營運效率與數位體驗。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'line', url: 'https://lin.ee/ZPdkmHh' }
    ],
    expertise: ['醫療系統開發', '診所數位轉型', '患者數據管理'],
    quote: '科技的終極目標是為人創造價值，在醫療領域，這意味著為醫師節省時間，為患者提供便利。'
  }
]

// 團隊價值觀
const values = [
  {
    title: '創新思維',
    description: '持續探索新技術與方法，為客戶帶來創新的解決方案',
    icon: LightBulbIcon
  },
  {
    title: '專業導向',
    description: '以專業知識為基礎，提供最適合的行銷策略建議',
    icon: AcademicCapIcon
  },
  {
    title: '數據驅動',
    description: '運用數據分析，制定精準的行銷策略與優化方案',
    icon: ChartBarIcon
  },
  {
    title: '協作精神',
    description: '與客戶緊密合作，共同實現品牌成長目標',
    icon: UsersIcon
  }
]

// 團隊成員卡片組件
interface TeamMemberCardProps {
  member: TeamMember;
  delay?: number;
}

const TeamMemberCard = ({ member, delay }: TeamMemberCardProps) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 針對 Next.js 15+ 與 React 19+ 優化圖片預加載邏輯
  useEffect(() => {
    let isMounted = true;
    
    // 僅在客戶端執行
    if (typeof window !== 'undefined') {
      // 避免使用 new Image() 構造函數，改用更安全的方法檢查圖片
      const checkImage = () => {
        // 建立臨時的 img 元素而不是用構造函數
        const tempImg = document.createElement('img');
        tempImg.src = member.image;
        
        // 設置監聽事件
        tempImg.onerror = () => {
          if (isMounted) {
            setImageError(true);
          }
          tempImg.onerror = null; // 清理事件處理器
        };
        
        // 如果圖片已在快取中，可能不會觸發load事件，但也不會觸發error事件
        tempImg.onload = () => {
          if (isMounted) {
            setImageLoading(false);
          }
          tempImg.onload = null; // 清理事件處理器
        };
      };
      
      checkImage();
      
      // 檢查視窗寬度並設置移動設備狀態
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640);
      };
      
      // 初始檢查
      checkMobile();
      
      // 監聽視窗大小變化
      window.addEventListener('resize', checkMobile);
      
      // 清理函數
      return () => {
        isMounted = false; // 防止在組件卸載後設置狀態
        window.removeEventListener('resize', checkMobile);
      };
    }
    
    return () => {
      isMounted = false; // 防止在組件卸載後設置狀態
    };
  }, [member.image]);

  return (
    <AnimatedSection delay={delay}>
      <div 
        className="group bg-white border-b-2 border-primary hover:border-black transition-colors duration-300 h-full flex flex-col"
        tabIndex={0}
        role="article"
        aria-label={`團隊成員：${member.name}，職位：${member.role}`}
      >
        {/* 頭像區域 */}
        <div className="relative overflow-hidden aspect-square w-full mb-3">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full" aria-hidden="true">
              <Spinner />
            </div>
          )}
          {!imageError ? (
            <OptimizedImage
              src={member.image}
              alt={`${member.name}的照片`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform rounded-full"
              sizes="(max-width: 480px) 40vw, (max-width: 768px) 33vw, 25vw"
              onLoadComplete={() => setImageLoading(false)}
              onError={() => setImageError(true)}
              priority={delay === 0}
              quality={90}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full" aria-label="圖片無法載入">
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2" role="img" aria-label="使用者圖示">👤</span>
                <span className="text-xs text-gray-700">圖片無法載入</span>
              </div>
            </div>
          )}
          {/* 懸停效果遮罩 */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 opacity-0 group-hover:opacity-100 transition duration-300 rounded-full"
            aria-hidden="true"
          >
          </div>
        </div>
        
        {/* 內容區域 */}
        <div className="p-3 xs:p-4 sm:p-5 flex-1 flex flex-col">
          <div className="mb-2 sm:mb-3">
            <h3 className="text-base xs:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
              {member.name}
            </h3>
            <p className="text-xs xs:text-sm text-primary font-medium">
              {member.role}
            </p>
          </div>
          
          {/* 專業描述文字 - 在小屏幕上隱藏以優化信息密度 */}
          <div className="mb-3 sm:mb-4 hidden sm:block">
            <p className="text-gray-800 text-xs sm:text-sm leading-relaxed line-clamp-3">{member.description}</p>
          </div>
          
          {/* 添加引言顯示 */}
          <div className="mb-3 sm:mb-5 bg-gray-50 p-2 xs:p-3 border-l-2 border-primary flex-1">
            <p className="text-gray-700 italic text-xs sm:text-sm line-clamp-3 sm:line-clamp-none">
              {member.quote}
            </p>
          </div>
          
          {/* 專業領域標籤 - 在小屏幕上限制數量 */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-auto" role="list" aria-label="專業領域">
            {/* 使用CSS類控制顯示，而不是依賴JavaScript */}
            {member.expertise.map((skill, i) => (
              <span 
                key={i} 
                className={`px-2 sm:px-3 py-1 bg-black text-white text-[10px] xs:text-xs font-medium ${i > 0 ? 'hidden xs:inline-block' : ''} ${i > 1 ? 'xs:hidden sm:inline-block' : ''}`}
              >
                {skill}
              </span>
            ))}
          </div>
          
          {/* 社交媒體圖標 */}
          <div className="flex space-x-2 xs:space-x-3 mt-3 pt-3 border-t border-gray-200" role="list" aria-label="社交媒體連結">
            {member.socialLinks.map((link: SocialLink, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-primary focus:text-primary transition-colors p-1 sm:p-2"
                aria-label={`在${link.platform}上關注${member.name}`}
              >
                <span className="sr-only">{link.platform}</span>
                {link.platform === 'facebook' ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                  </svg>
                ) : link.platform === 'instagram' ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                ) : link.platform === 'line' ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.819 4.588 8.845 10.784 9.613.421.097 1.003.3 1.141.692.13.36.084.921.043 1.273 0 0-.171 1.063-.208 1.29-.063.218-.292.874 1.01.477 1.303-.397 7.02-4.131 9.575-7.072 1.766-1.935 2.645-3.874 2.645-6.273zm-17.339 4.292h-1.961v-3.634a.48.48 0 0 0-.48-.48h-.084a.48.48 0 0 0-.48.48v4.226c0 .266.216.48.48.48h2.525a.48.48 0 0 0 .48-.48v-.113a.48.48 0 0 0-.48-.479zm1.872-3.646a.48.48 0 0 0-.48.48v4.226c0 .266.216.48.48.48h.084a.48.48 0 0 0 .48-.48v-4.226a.48.48 0 0 0-.48-.48h-.084zm4.261 2.158c0-.266-.216-.48-.48-.48h-.084a.48.48 0 0 0-.48.48v2.07h-1.969v-2.07a.48.48 0 0 0-.48-.48h-.084a.48.48 0 0 0-.48.48v4.226c0 .266.216.48.48.48h.084a.48.48 0 0 0 .48-.48v-1.182h1.969v1.182a.48.48 0 0 0 .48.48h.084a.48.48 0 0 0 .48-.48v-4.226zm3.071-1.488h-2.525a.48.48 0 0 0-.48.48v4.226c0 .266.216.48.48.48h2.525a.48.48 0 0 0 .48-.48v-.113a.48.48 0 0 0-.48-.479h-1.961v-.773h1.961a.48.48 0 0 0 .48-.48v-.113a.48.48 0 0 0-.48-.479h-1.961v-.773h1.961a.48.48 0 0 0 .48-.48v-.113a.48.48 0 0 0-.48-.483z" />
                  </svg>
                ) : link.platform === 'linkedin' ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.06 10.06 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="專業團隊介紹"
        description="由醫療行銷專家、設計師和技術開發人員組成的跨領域團隊，為您提供最專業的服務"
        variant="red"
        size="md"
        alignment="center"
        backgroundImage="/images/bgline-w.webp"
        className="border-b border-primary"
      />
      
      <main>
        {/* 團隊成員 */}
        <section className="py-10 sm:py-16 md:py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-3 sm:mb-4 border-b-2 border-primary pb-2 inline-block">
                認識我們的專業團隊
              </h2>
              <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto mt-3 sm:mt-4 px-4">
                每位成員都擁有豐富的醫療行銷經驗，致力於為診所打造最佳品牌策略
              </p>
            </div>

            <div 
              className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 md:gap-8 xl:gap-10 max-w-7xl mx-auto" 
              role="list"
              aria-label="團隊成員列表"
            >
              {teamMembers.map((member, index) => (
                <TeamMemberCard key={member.name} member={member} delay={index * 0.1} />
              ))}
            </div>
          </div>
        </section>

        {/* 團隊價值觀 */}
        <section className="py-10 sm:py-16 md:py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-3 sm:mb-4 border-b-2 border-primary pb-2 inline-block">
                團隊核心價值
              </h2>
              <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto mt-3 sm:mt-4 px-4">
                秉持專業與創新精神，為客戶提供最優質的服務
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 lg:gap-6" role="list" aria-label="團隊價值觀">
              {values.map((value, index) => (
                <motion.div 
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border-b-2 border-primary p-4 sm:p-6"
                  tabIndex={0}
                  role="article"
                >
                  <div className="mb-3 sm:mb-4" aria-hidden="true">
                    <value.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-700">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 團隊優勢 */}
        <section className="py-10 sm:py-16 md:py-20 bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div>
                <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 border-b-2 border-primary pb-2 inline-block">
                  專業醫療行銷團隊
                </h2>
                <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                  我們不僅是行銷專家，更深入理解醫療產業的獨特挑戰與機會。我們的團隊由來自醫療、設計、行銷與技術背景的專業人才組成，共同致力於為醫療專業人士創造真正有價值的行銷解決方案。
                </p>
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8" role="list" aria-label="我們的優勢">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">我們的團隊成員平均擁有<strong>8年以上</strong>的醫療行銷經驗</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">我們與超過<strong>100家醫療診所</strong>合作，深知各類專科的獨特需求</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">我們的客戶平均實現<strong>40%以上</strong>的新病患增長</p>
                  </div>
                </div>
                <div>
                  <Link 
                    href="/service" 
                    className="inline-flex items-center px-5 sm:px-6 py-2 sm:py-3 bg-primary text-white font-medium hover:bg-primary-dark focus:bg-primary-dark transition-colors text-sm sm:text-base"
                    prefetch
                    aria-label="了解更多服務內容"
                  >
                    <span className="text-white">了解我們的服務</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 xs:gap-4">
                <div className="relative overflow-hidden rounded-full aspect-square">
                  <OptimizedImage 
                    src="/images/team/office-1.png" 
                    alt="現代化的辦公環境" 
                    fill
                    className="object-cover w-full h-full"
                    quality={90}
                    sizes="(max-width: 640px) 40vw, (max-width: 768px) 33vw, 25vw"
                  />
                </div>
                <div className="relative overflow-hidden rounded-full aspect-square">
                  <OptimizedImage 
                    src="/images/team/office-2.png" 
                    alt="團隊協作空間" 
                    fill
                    className="object-cover w-full h-full"
                    quality={90}
                    sizes="(max-width: 640px) 40vw, (max-width: 768px) 33vw, 25vw"
                  />
                </div>
                <div className="relative overflow-hidden rounded-full aspect-square">
                  <OptimizedImage 
                    src="/images/team/office-3.png" 
                    alt="創意討論空間" 
                    fill
                    className="object-cover w-full h-full"
                    quality={90}
                    sizes="(max-width: 640px) 40vw, (max-width: 768px) 33vw, 25vw"
                  />
                </div>
                <div className="relative overflow-hidden rounded-full aspect-square">
                  <OptimizedImage 
                    src="/images/team/office-4.png" 
                    alt="會議與討論空間" 
                    fill
                    className="object-cover w-full h-full"
                    quality={90}
                    sizes="(max-width: 640px) 40vw, (max-width: 768px) 33vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 sm:py-16 md:py-20 bg-black text-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-4 sm:mb-6">
                準備好開始合作了嗎？
              </h2>
              <p className="text-base xs:text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto">
                讓我們的專業團隊，為您的診所打造最適合的品牌成長策略
              </p>
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-medium hover:bg-primary-dark focus:bg-primary-dark transition-colors text-sm sm:text-lg"
                  aria-label="立即預約專業行銷諮詢"
                >
                  立即預約諮詢
                </Link>
                <Link
                  href="/service"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-medium hover:bg-white hover:text-black focus:bg-white focus:text-black transition-colors text-sm sm:text-lg"
                  aria-label="了解更多服務內容"
                >
                  了解服務內容
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
} 