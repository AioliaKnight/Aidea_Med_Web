'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { Spinner } from '@/components/common/Spinner'
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
  education: string;
  expertise: string[];
  quote: string;
}

// 團隊成員數據
const teamMembers: TeamMember[] = [
  {
    name: '林佳穎',
    role: '創辦人暨策略總監',
    image: '/images/team/team-1.jpg',
    description: '擁有十年以上醫療行銷經驗，曾協助超過50家診所完成品牌轉型。曾任大型牙醫連鎖集團行銷總監，深諳醫療領域的病患心理與行銷策略。她相信，真正有溫度的醫療體驗，始於醫者的用心與良好的溝通橋樑。',
    socialLinks: [
      { platform: 'linkedin', url: '#' },
      { platform: 'twitter', url: '#' }
    ],
    education: '國立台灣大學工商管理碩士',
    expertise: ['醫療品牌策略', '病患體驗設計', '醫病溝通優化'],
    quote: '每位醫師都有獨特的故事與價值，我的使命是讓這些故事被更多人看見與理解。'
  },
  {
    name: '陳俊宏',
    role: '數位行銷總監',
    image: '/images/team/team-2.jpg',
    description: '數位行銷專家，擅長診所網站優化與搜尋引擎行銷，過去五年成功幫助30多家牙醫與皮膚科診所提升40%以上的新客數量。他深信數據與溫度不是對立的，透過精準的數據分析，能更準確地回應病患的真實需求。',
    socialLinks: [
      { platform: 'linkedin', url: '#' },
      { platform: 'twitter', url: '#' }
    ],
    education: '國立政治大學數位行銷碩士',
    expertise: ['搜尋引擎優化', '醫療網站轉換率提升', 'Google Ads操作'],
    quote: '每一個數據背後都是一個尋求幫助的人，我們的工作是讓對的醫師被對的病患找到。'
  },
  {
    name: '黃雅芳',
    role: '創意內容總監',
    image: '/images/team/team-3.jpg',
    description: '資深醫療內容創作者，曾任健康雜誌主編，擅長將艱澀的醫療知識轉化為溫暖易懂的內容。她帶領的創意團隊每月為診所客戶產出超過200篇精彩內容，從專業文章到暖心故事，讓醫療不再冰冷距離。',
    socialLinks: [
      { platform: 'linkedin', url: '#' },
      { platform: 'twitter', url: '#' }
    ],
    education: '輔仁大學大眾傳播學系',
    expertise: ['醫療故事敘事', '衛教內容創作', '診所品牌文案'],
    quote: '最動人的醫療故事往往是最簡單的真實分享，我們的文字是連結醫師熱忱與病患信任的橋樑。'
  },
  {
    name: '張志遠',
    role: '視覺設計總監',
    image: '/images/team/team-4.jpg',
    description: '擁有十年以上設計經驗，專注於醫療環境與品牌視覺設計。他理解醫療環境設計的獨特需求，如何在保持專業的同時，創造溫暖舒適的空間體驗。他的設計作品曾獲得多項國際設計大獎。',
    socialLinks: [
      { platform: 'linkedin', url: '#' },
      { platform: 'twitter', url: '#' }
    ],
    education: '台灣科技大學設計研究所',
    expertise: ['診所空間設計', '醫療品牌視覺系統', 'UI/UX設計'],
    quote: '好的設計是無形的，它讓病患在不知不覺中感到安心與信任，這在醫療環境中格外重要。'
  },
  {
    name: '劉心怡',
    role: '顧客關係總監',
    image: '/images/team/team-5.jpg',
    description: '專注於優化診所病患體驗與建立忠誠度系統。她擁有心理諮商背景，深入理解病患心理需求與疑慮，協助診所建立完善的溝通系統與顧客旅程。她帶領的團隊成功幫助客戶提升30%以上的回診率。',
    socialLinks: [
      { platform: 'linkedin', url: '#' },
      { platform: 'twitter', url: '#' }
    ],
    education: '台灣師範大學心理諮商研究所',
    expertise: ['病患體驗管理', '醫療顧客關係維護', '診所服務流程優化'],
    quote: '每位走進診所的人都帶著自己的故事與擔憂，我們的使命是讓他們感受到：這裡有人真正在乎你。'
  },
  {
    name: '王建中',
    role: '技術開發總監',
    image: '/images/team/team-6.jpg',
    description: '資深技術專家，專注於醫療相關數位工具開發。他帶領的技術團隊為診所開發便捷的預約管理系統、病患關係管理工具等，提升診所營運效率的同時，也創造更好的病患數位體驗。',
    socialLinks: [
      { platform: 'linkedin', url: '#' },
      { platform: 'twitter', url: '#' }
    ],
    education: '交通大學資訊工程博士',
    expertise: ['醫療系統開發', '診所數位工具整合', '資料安全管理'],
    quote: '科技的終極目標是為人創造價值，在醫療領域，這意味著為醫師節省時間，為病患提供便利，使醫療服務回歸人性關懷的本質。'
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

// 動畫區塊組件
interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

const AnimatedSection = ({ children, className = '', delay = 0 }: AnimatedSectionProps) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      controls.start('animate')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 團隊成員卡片組件
interface TeamMemberCardProps {
  member: TeamMember;
  delay?: number;
}

const TeamMemberCard = ({ member, delay }: TeamMemberCardProps) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <AnimatedSection delay={delay}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative overflow-hidden">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Spinner />
            </div>
          )}
          {!imageError ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className={`object-cover transform group-hover:scale-105 transition-transform duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="(max-width: 480px) 45vw, (max-width: 640px) 40vw, (max-width: 768px) 33vw, 25vw"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-4xl">👤</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-0.5 sm:mb-1">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {member.role}
                </p>
              </div>
              {member.socialLinks.map((link: SocialLink, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                  aria-label={`${member.name}的${link.platform}個人檔案`}
                >
                  <span className="sr-only">{link.platform}</span>
                  {link.platform === 'linkedin' ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.06 10.06 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
            <p className="text-primary/80 font-medium text-sm sm:text-base">
              {member.quote}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {member.expertise.map((skill: string, i) => (
              <span
                key={i}
                className="px-2 py-0.5 sm:px-3 sm:py-1 bg-primary/5 text-primary rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 sm:text-sm sm:line-clamp-3 md:line-clamp-none">
            {showDetails ? member.description : `${member.description.substring(0, 100)}...`}
          </p>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-primary font-medium hover:underline focus:outline-none"
          >
            {showDetails ? '收起' : '了解更多'}
          </button>
          
          {showDetails && (
            <motion.div 
              className="mt-4 space-y-4 pt-4 border-t border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h4 className="font-bold text-sm uppercase text-gray-500 mb-2">學歷背景</h4>
                <p className="text-gray-700">{member.education}</p>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase text-gray-500 mb-2">專業領域</h4>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill: string, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedSection>
  )
}

function TeamIntroSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              為何選擇我們
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              一個理解醫療<span className="text-primary">與行銷</span>的專業團隊
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              我們不僅是行銷專家，更深入理解醫療產業的獨特挑戰與機會。我們的團隊由來自醫療、設計、行銷與技術背景的專業人才組成，共同致力於為醫療專業人士創造真正有價值的行銷解決方案。
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 text-primary mt-1">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-4 text-gray-600">我們的團隊成員平均擁有8年以上的醫療行銷經驗</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 text-primary mt-1">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-4 text-gray-600">我們與超過100家醫療診所合作，深知各類專科的獨特需求</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 text-primary mt-1">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-4 text-gray-600">我們的客戶平均實現40%以上的新病患增長</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image 
                src="/images/team/office-1.jpg" 
                alt="Our Office" 
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </motion.div>
            <motion.div 
              className="rounded-lg overflow-hidden mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Image 
                src="/images/team/office-2.jpg" 
                alt="Our Team" 
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </motion.div>
            <motion.div 
              className="rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Image 
                src="/images/team/office-3.jpg" 
                alt="Team Collaboration" 
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </motion.div>
            <motion.div 
              className="rounded-lg overflow-hidden mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Image 
                src="/images/team/office-4.jpg" 
                alt="Our Meeting" 
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TeamValues() {
  const values = [
    {
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      title: '以人為本',
      description: '我們相信醫療的核心價值在於人與人之間的連結與關懷。每一項行銷策略都以建立醫師與病患間的信任為根本，讓醫療回歸最溫暖的初衷。'
    },
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: '專業誠信',
      description: '我們承諾只提供真正有效的策略與服務，清晰透明地提供數據與結果，成為醫療專業人士可長期信賴的行銷夥伴。'
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: '創新突破',
      description: '醫療行銷不應止步於傳統模式。我們持續探索新技術與方法，為診所客戶開創差異化的品牌形象與行銷策略，在競爭中脫穎而出。'
    },
    {
      icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
      title: '持續成長',
      description: '我們與診所客戶共同成長，提供持續優化的服務與策略，確保長期穩定的發展，而非短期的行銷效應。'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
            我們的價值觀
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            指引我們每一步的<span className="text-primary">核心理念</span>
          </h2>
          <p className="text-lg text-gray-600">
            這些價值觀不只是掛在牆上的標語，而是深植於我們每一位團隊成員的心中，指引我們在每個專案中的決策與行動。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div 
              key={index}
              className="bg-gray-50 p-8 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={value.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - 優化響應式設計 */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-primary text-white overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/images/team/bgline-w.png"
            alt="背景線條"
            fill
            className="object-cover object-center mix-blend-soft-light"
            quality={90}
            sizes="100vw"
            priority
          />
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 md:mb-6 font-display">
                專業團隊
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                擁有豐富醫療行銷經驗的跨領域專家，
                <br className="hidden sm:block" />
                為您的診所打造最適合的品牌成長策略
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 團隊成員 */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-primary">
              認識我們的團隊
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              每位成員都擁有豐富的醫療行銷經驗，致力於為診所打造最佳品牌策略
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* 團隊價值觀 - 優化響應式設計 */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-primary mb-3 sm:mb-4">
              團隊價值觀
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              秉持專業與創新精神，為客戶提供最優質的服務
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <div className="group bg-gray-50 p-4 sm:p-6 md:p-8 rounded-lg text-center hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="mb-4 sm:mb-6 flex justify-center">
                    <value.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary/80 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2 sm:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-3 sm:line-clamp-none">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - 優化響應式設計 */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6">
                準備好開始合作了嗎？
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
                讓我們的專業團隊，為您的診所打造最適合的品牌成長策略
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-white/90 transition-colors"
                >
                  立即預約諮詢
                </Link>
                <Link
                  href="/service"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-white/10 transition-colors"
                >
                  了解服務內容
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <TeamIntroSection />
      
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-primary font-medium mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
              專業團隊
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              每位成員都是各自領域的<span className="text-primary">專家</span>
            </h2>
            <p className="text-lg text-gray-600">
              我們的團隊由來自行銷、設計、技術與醫療背景的專業人才組成，共同為診所客戶創造最有溫度、最能打動人心的品牌體驗。
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard 
                key={index} 
                member={member}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>
      
      <TeamValues />
    </div>
  )
} 