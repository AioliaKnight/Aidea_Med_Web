'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { Spinner } from '@/components/common/Spinner'
import {
  LightBulbIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

// 團隊成員資料
const teamMembers = [
  {
    name: '陳維鈞',
    nameEn: 'Wilson Chen',
    title: '創辦人暨執行長',
    titleEn: 'Founder & CEO',
    expertise: ['醫療品牌策略', '診所數位轉型', '整合行銷規劃'],
    description: '擁有超過15年醫療行銷經驗，協助百家診所成功打造品牌。專精於整合數位策略與品牌發展，為診所制定精準的成長方案。曾獲選台灣醫療創新百大。',
    image: '/images/team/member-1.png',
    linkedin: 'https://www.linkedin.com/in/wilson-chen/'
  },
  {
    name: '張方剛',
    nameEn: 'Mike Chang',
    title: '行銷總監',
    titleEn: 'Marketing Director', 
    expertise: ['診所社群經營', '醫療SEO優化', '影音內容策略'],
    description: '數位行銷專家，專注於牙醫診所品牌經營與SEO優化。曾帶領團隊獲得多項數位行銷獎項，協助診所每月諮詢量成長300%以上。',
    image: '/images/team/member-2.jpg',
    linkedin: 'https://www.linkedin.com/in/mike-chang/'
  },
  {
    name: '李品憲',
    nameEn: 'Leo Lee',
    title: '技術長',
    titleEn: 'CTO',
    expertise: ['AI行銷系統', '數據分析', '自動化工具'],
    description: '資深技術專家，擅長運用AI技術優化醫療行銷流程。開發多項專利技術，協助診所建立數據導向的精準行銷系統。',
    image: '/images/team/member-3.jpg',
    linkedin: 'https://www.linkedin.com/in/leo-lee/'
  },
  {
    name: '溫于萱',
    nameEn: 'Chloe Wen',
    title: '設計總監',
    titleEn: 'Design Director',
    expertise: ['診所品牌設計', 'UI/UX設計', '空間視覺規劃'],
    description: '資深設計師，專精於醫療品牌視覺設計。作品曾獲得金點設計獎等國際獎項，為超過50家診所打造專業品牌識別。',
    image: '/images/team/member-4.jpg',
    linkedin: 'https://www.linkedin.com/in/chloe-wen/'
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
  member: typeof teamMembers[0]
  delay: number
}

const TeamMemberCard = ({ member, delay }: TeamMemberCardProps) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  return (
    <AnimatedSection delay={delay}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="aspect-[3/4] sm:aspect-[4/5] relative overflow-hidden bg-gray-100">
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
                  {member.nameEn}
                </p>
              </div>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                  aria-label={`${member.name}的LinkedIn個人檔案`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
            </div>
            <p className="text-primary/80 font-medium text-sm sm:text-base">
              {member.title}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {member.titleEn}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {member.expertise.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 sm:px-3 sm:py-1 bg-primary/5 text-primary rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 sm:text-sm sm:line-clamp-3 md:line-clamp-none">
            {member.description}
          </p>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default function TeamPage() {
  return (
    <ErrorBoundary>
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
      </div>
    </ErrorBoundary>
  )
} 