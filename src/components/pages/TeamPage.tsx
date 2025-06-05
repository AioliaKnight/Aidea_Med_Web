'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { OptimizedImage, Spinner, PageHeader, AnimatedSection } from '@/components/common'
import {
  LightBulbIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UsersIcon,
  StarIcon,
  TrophyIcon,
  SparklesIcon,
  HeartIcon,
  SpeakerWaveIcon,
  HandRaisedIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
// import { animations } from '@/utils/animations' // 暫時移除未使用的導入

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
  experience: string;
  specialties: string[];
}

interface CoreValue {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface Achievement {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface Testimonial {
  name: string;
  role: string;
  clinic: string;
  content: string;
  rating: number;
}

// 添加使命宣言相關介面
interface MissionPillar {
  title: string;
  subtitle: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  philosophy: string;
}

interface MissionStatement {
  title: string;
  subtitle: string;
  mainQuote: string;
  description: string;
  missionPillars: MissionPillar[];
  coreBeliefs: string[];
}

// 團隊成員數據
const teamMembers: TeamMember[] = [
  {
    name: '陳維鈞 Wilson',
    role: '創辦人暨策略總監',
    image: '/images/team/member-1.jpg',
    description: '擁有十五年以上醫療行銷經驗，專精於醫療品牌策略與患者體驗設計。帶領團隊協助超過70家醫療機構重塑品牌形象，包括醫學中心、區域醫院及各類專科診所。深諳如何將專業醫療價值轉譯為患者信任。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'instagram', url: 'https://www.instagram.com/aidea.med/' },
      { platform: 'line', url: 'https://lin.ee/ZPdkmHh' }
    ],
    expertise: ['醫療品牌策略', '患者體驗設計', '醫病溝通優化'],
    quote: '每位醫療專業人士都有獨特的專業價值，我們的使命是讓這些價值被更多需要的患者看見與理解。',
    experience: '15+ 年醫療行銷經驗',
    specialties: ['品牌策略規劃', '危機溝通管理', '醫療產業趨勢分析']
  },
  {
    name: 'Mike',
    role: '數位行銷總監',
    image: '/images/team/member-2.jpg',
    description: '數位行銷專家，擅長醫療機構網站優化與精準投放策略。過去五年成功幫助40多家醫療機構提升45%以上的新患數量，專注於透過AI與數據分析優化醫療行銷績效，實現醫療機構的永續成長。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'instagram', url: 'https://www.instagram.com/aidea.med/' }
    ],
    expertise: ['AI行銷策略', '醫療轉換率提升', '精準廣告投放'],
    quote: '數據不僅是數字，而是每一個尋求醫療協助的故事，我們的工作是讓對的醫療專業人士被對的患者找到。',
    experience: '8+ 年數位行銷經驗',
    specialties: ['Google Ads優化', 'SEO策略執行', '社群媒體經營']
  },
  {
    name: 'Leo',
    role: '創意內容總監',
    image: '/images/team/member-3.jpg',
    description: '資深醫療內容策略專家，擅長將複雜的醫療專業知識轉化為患者易懂且具共鳴的內容。帶領創意團隊為各類專科醫療機構打造專業醫療內容，建立患者信任與醫師權威。專精於醫療故事敘事與品牌內容策略。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'instagram', url: 'https://www.instagram.com/aidea.med/' }
    ],
    expertise: ['醫療故事敘事', '專業知識轉譯', '品牌內容策略'],
    quote: '最動人的醫療故事來自於真實的專業價值，我們的文字是連結醫療專業與患者信任的橋樑。',
    experience: '10+ 年內容創作經驗',
    specialties: ['醫療文案撰寫', '影音腳本策劃', '品牌故事建構']
  },
  {
    name: 'Chloe',
    role: '業務發展總監',
    image: '/images/team/member-4.jpg',
    description: '資深醫療業務專家，專注於醫療機構客戶關係管理與業務策略。擅長精準掌握各類專科醫療機構需求並轉化為客製化行銷方案，協助超過50家醫療機構建立品牌差異化並提升30%以上的患者回診率。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'instagram', url: 'https://www.instagram.com/aidea.med/' }
    ],
    expertise: ['醫療客戶關係', '業務策略規劃', '品牌差異化'],
    quote: '每個醫療品牌都有其獨特的專業價值，我的使命是協助他們找到最適合的方式，讓這些價值被更多需要的患者看見。',
    experience: '12+ 年業務發展經驗',
    specialties: ['客戶需求分析', '提案策略規劃', '長期關係維護']
  },
  {
    name: 'Queena',
    role: '顧客體驗總監',
    image: '/images/team/member-5.jpg',
    description: '專注於醫療顧客體驗與患者忠誠度系統建立。深入理解醫病關係的獨特性，協助醫療機構設計全方位的患者溝通策略與服務流程優化，成功提升客戶35%以上的患者滿意度與回診率。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'instagram', url: 'https://www.instagram.com/aidea.med/' }
    ],
    expertise: ['患者體驗管理', '醫療服務設計', '忠誠度建立'],
    quote: '優質的醫療體驗不只是專業治療，更包含了完整的服務歷程，我們的使命是讓每位患者都感受到被重視與理解。',
    experience: '9+ 年體驗設計經驗',
    specialties: ['患者旅程優化', '服務流程設計', '滿意度提升']
  },
  {
    name: '西裝哥',
    role: '技術開發總監',
    image: '/images/team/member-6.jpg',
    description: '資深醫療科技專家，專精於醫療機構數位轉型與患者體驗優化。領導技術團隊開發整合預約管理、患者關係維護等系統，運用AI技術提升醫療機構營運效率與數位體驗。',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/www.aideamed' },
      { platform: 'line', url: 'https://lin.ee/ZPdkmHh' }
    ],
    expertise: ['醫療系統開發', 'AI應用整合', '數位轉型諮詢'],
    quote: '科技應該為醫療服務賦能，我們的目標是運用創新技術，為醫療專業人士節省時間，為患者創造更好的醫療體驗。',
    experience: '11+ 年技術開發經驗',
    specialties: ['系統架構設計', 'AI工具整合', '數位化流程建置']
  }
]

// 團隊價值觀
const coreValues: CoreValue[] = [
  {
    title: '專業創新',
    description: '結合醫療專業知識與創新數位科技，為各類專科醫療機構打造獨特且有效的行銷策略。從醫學中心到專科診所，我們持續創新服務模式，確保每個解決方案都能精準對應醫療機構的需求。',
    icon: LightBulbIcon,
    color: 'text-yellow-500'
  },
  {
    title: '以人為本',
    description: '深入理解醫療人文關懷的重要性，我們致力於在數位行銷中保持醫病關係的溫度。每個專案都以改善患者體驗為核心，協助醫療機構建立信任與專業的品牌形象。',
    icon: HeartIcon,
    color: 'text-red-500'
  },
  {
    title: '數據驅動',
    description: '運用先進的AI技術與數據分析工具，為醫療機構提供精準的行銷策略與成效追蹤。透過持續的數據分析與優化，確保行銷資源的最佳配置，實現醫療機構的永續成長。',
    icon: ChartBarIcon,
    color: 'text-blue-500'
  },
  {
    title: '持續成長',
    description: '我們不斷學習與進化，緊跟醫療產業發展趨勢與數位科技創新。透過定期的產業研究與技術更新，確保能為醫療機構提供最前瞻的行銷解決方案。',
    icon: SparklesIcon,
    color: 'text-purple-500'
  }
]

const missionStatement: MissionStatement = {
  title: '醫療行銷的人文革命',
  subtitle: '重新定義醫療品牌與患者的深度連結',
  mainQuote: '真正的醫療行銷，是讓專業溫度傳遞到每一個需要關懷的心靈',
  description: '我們相信，每位醫療專業人士背後都有改變生命的故事。我們的使命不只是傳播醫療服務，而是傳遞醫者的溫度、專業的價值，以及對生命的承諾。',
  missionPillars: [
    {
      title: '深度傾聽',
      subtitle: 'Listen Deeply',
      description: '深入理解每位醫師的專業初衷與患者的真實需求，在兩者之間建立有意義的對話。',
      gradientFrom: 'from-blue-400',
      gradientTo: 'to-cyan-500',
      icon: SpeakerWaveIcon,
      philosophy: '好的醫療行銷始於真正的傾聽'
    },
    {
      title: '情感共鳴',
      subtitle: 'Emotional Connection',
      description: '透過真實的故事與溫暖的內容，讓醫療專業不再冷冰冰，而是充滿人性關懷。',
      gradientFrom: 'from-rose-400',
      gradientTo: 'to-pink-500',
      icon: HeartIcon,
      philosophy: '醫療的本質是人與人之間的關懷'
    },
    {
      title: '價值創造',
      subtitle: 'Value Creation',
      description: '為醫療機構創造長期品牌價值，為患者提供更好的醫療體驗與健康資訊。',
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-500',
      icon: SparklesIcon,
      philosophy: '真正的價值來自於對生命的敬重'
    },
    {
      title: '永續發展',
      subtitle: 'Sustainable Growth',
      description: '建構可持續的醫療品牌生態，讓優質醫療資源能夠更廣泛地惠及社會大眾。',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-green-500',
      icon: ArrowTrendingUpIcon,
      philosophy: '永續的醫療品牌造福世代'
    }
  ],
  coreBeliefs: [
    '醫療行銷的核心是建立信任，不是銷售服務',
    '每個成功的醫療品牌背後都有動人的人文故事',
    '技術是工具，但溫度才是醫療行銷的靈魂'
  ]
}

const achievements: Achievement[] = [
  {
    title: '醫療機構合作數',
    value: '70+',
    description: '包含醫學中心、區域醫院、專科診所等多元醫療機構',
    icon: UsersIcon
  },
  {
    title: '平均成長率',
    value: '45%',
    description: '協助合作夥伴顯著提升新患數量與品牌知名度',
    icon: TrophyIcon
  },
  {
    title: '客戶滿意度',
    value: '95%',
    description: '持續獲得合作夥伴的正面評價與長期信任',
    icon: StarIcon
  },
  {
    title: '專業團隊',
    value: '25+',
    description: '匯集醫療行銷、數位科技、創意設計等多元人才',
    icon: AcademicCapIcon
  }
]

// 客戶推薦
const testimonials: Testimonial[] = [
  {
    name: '李醫師',
    role: '院長',
    clinic: '雅德思牙醫診所',
    content: 'Aidea:Med 團隊真的很專業！他們不只幫我們重新設計品牌形象，更協助我們建立了完整的數位行銷策略。現在我們的新患數量比之前成長了50%以上。',
    rating: 5
  },
  {
    name: '陳醫師',
    role: '醫療總監',
    clinic: '品誠醫美診所',
    content: '合作後最明顯的改變是患者詢問度大幅提升，而且詢問的都是高價值的自費項目。團隊對醫美市場的了解讓我們非常驚艷。',
    rating: 5
  },
  {
    name: '王醫師',
    role: '主治醫師',
    clinic: '春生牙醫診所',
    content: '從網站設計到社群經營，他們都展現了極高的專業度。最重要的是，他們真的理解我們醫師的需求和患者的想法。',
    rating: 5
  }
]

// 團隊成員卡片組件
interface TeamMemberCardProps {
  member: TeamMember;
  delay?: number;
}

const TeamMemberCard = ({ member, delay }: TeamMemberCardProps) => {
  const [imageError, setImageError] = useState(false)

  return (
    <AnimatedSection delay={delay}>
      <div 
        className="group bg-white border-b-2 border-primary hover:border-black transition-colors duration-300 h-full flex flex-col"
        tabIndex={0}
        role="article"
        aria-label={`團隊成員：${member.name}，職位：${member.role}`}
      >
        {/* 頭像區域 - 改為置中且大小適中的圓形 */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="relative overflow-hidden rounded-full aspect-square w-24 xs:w-28 sm:w-32 md:w-36">

          {!imageError ? (
            <OptimizedImage
              src={member.image}
              alt={`${member.name}的照片`}
              fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                sizes="(max-width: 480px) 96px, (max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
              onLoadComplete={() => {}}
              onError={() => setImageError(true)}
              priority={delay === 0}
                quality={85}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full" aria-label="圖片無法載入">
              <div className="flex flex-col items-center">
                  <span className="text-3xl mb-1" role="img" aria-label="使用者圖示">👤</span>
                  <span className="text-[10px] text-gray-700">圖片無法載入</span>
              </div>
            </div>
          )}
          {/* 懸停效果遮罩 */}
          <div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 opacity-0 group-hover:opacity-100 transition duration-300"
            aria-hidden="true"
          >
            </div>
          </div>
        </div>
        
        {/* 內容區域 */}
        <div className="p-3 xs:p-4 flex-1 flex flex-col">
          <div className="mb-2 sm:mb-3 text-center">
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
          
          {/* 經驗年數 */}
          <div className="mb-2 text-center">
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {member.experience}
            </span>
          </div>
          
          {/* 專業領域標籤 */}
          <div className="mb-3 space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 text-center">專業領域</h4>
            <div className="flex flex-wrap gap-1 justify-center" role="list" aria-label="專業領域">
            {member.expertise.map((skill, i) => (
              <span 
                key={i} 
                  className="px-2 py-1 bg-primary text-white text-xs font-medium rounded"
              >
                {skill}
              </span>
            ))}
            </div>
          </div>
          
          {/* 特殊專長 */}
          <div className="mb-3 hidden sm:block">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">專業技能</h4>
            <ul className="space-y-1">
              {member.specialties.slice(0, 3).map((specialty, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-center">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                  {specialty}
                </li>
              ))}
            </ul>
          </div>
          
          {/* 個人引言 */}
          <div className="mb-3 bg-gray-50 p-3 border-l-3 border-primary">
            <p className="text-gray-700 italic text-xs leading-relaxed line-clamp-3">
              "{member.quote}"
            </p>
          </div>
          
          {/* 社交媒體圖標 */}
          <div className="flex space-x-2 xs:space-x-3 mt-3 pt-3 border-t border-gray-200 justify-center" role="list" aria-label="社交媒體連結">
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
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      <PageHeader
        title="專業團隊介紹"
          description="由醫療行銷專家、設計師和技術開發人員組成的跨領域團隊，為各類醫療機構提供最專業的行銷服務"
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
            <div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto" 
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
                  我們的核心價值引領著我們如何思考、如何工作、以及如何與醫療專業人士和患者互動
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 lg:gap-6" role="list" aria-label="團隊價值觀">
                {coreValues.map((value, index) => (
                <motion.div 
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border-b-2 border-primary p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
                  tabIndex={0}
                  role="article"
                >
                  <div className="mb-3 sm:mb-4" aria-hidden="true">
                    <value.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-700 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 使命宣言 */}
        <section className="py-10 sm:py-16 md:py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
                {missionStatement.title}
              </h2>
              <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto mt-3 sm:mt-4 px-4">
                {missionStatement.subtitle}
              </p>
            </div>

            {/* 主要引言區塊 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto mb-12 sm:mb-16"
            >
              <div className="bg-gray-50 border-l-4 border-primary p-6 sm:p-8 shadow-sm">
                <blockquote className="text-xl sm:text-2xl font-medium text-gray-800 leading-relaxed text-center italic">
                  "{missionStatement.mainQuote}"
                </blockquote>
                <p className="text-base sm:text-lg text-gray-600 text-center mt-4 leading-relaxed">
                  {missionStatement.description}
                </p>
              </div>
            </motion.div>

            {/* 使命支柱 */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 lg:gap-6 mb-12 sm:mb-16" role="list" aria-label="使命支柱">
              {missionStatement.missionPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
                  tabIndex={0}
                  role="article"
                >
                  <div className="mb-3 sm:mb-4" aria-hidden="true">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-primary text-white rounded-lg flex items-center justify-center">
                      <pillar.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">
                    {pillar.title}
                  </h3>
                  <p className="text-xs xs:text-sm font-medium text-primary mb-2 text-center">
                    {pillar.subtitle}
                  </p>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-700 leading-relaxed text-center mb-3">
                    {pillar.description}
                  </p>
                  <div className="pt-3">
                    <p className="text-xs italic text-gray-500 text-center leading-relaxed">
                      "{pillar.philosophy}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 核心信念 */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  我們的核心信念
                </h3>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {missionStatement.coreBeliefs.map((belief, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-primary"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm sm:text-base font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed flex-1">
                        {belief}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 成就統計 */}
        <section className="py-10 sm:py-16 md:py-20 bg-gray-100">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
                我們的成就
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                數字背後是每一位醫療專業人士的信任與每一個成功故事
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <achievement.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold text-primary mb-2">
                    {achievement.value}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {achievement.description}
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
                <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
                  專業醫療行銷團隊
                </h2>
                <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                    我們不僅是行銷專家，更深入理解各類醫療專科的獨特挑戰與機會。我們的團隊由來自醫療、設計、行銷與技術背景的專業人才組成，共同致力於為各類醫療專業人士創造真正有價值的行銷解決方案。
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
                      <p className="text-sm sm:text-base text-gray-700">我們與超過<strong>100家醫療機構</strong>合作，深知各類專科的獨特需求</p>
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

        {/* 人才招募區塊 */}
        <section className="py-10 sm:py-16 md:py-20 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
                    加入我們的團隊
                  </h2>
                  <p className="text-base sm:text-lg text-gray-700 mb-6">
                      我們正在尋找對醫療行銷充滿熱情的人才加入我們的團隊。在這裡，你將有機會與各類醫療領域專業人士合作，打造有影響力的品牌策略，同時不斷學習成長。
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="p-4 sm:p-6 bg-white shadow-sm">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">我們提供</h3>
                      <ul className="space-y-2" role="list">
                        <li className="flex items-start text-sm sm:text-base text-gray-700">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>具競爭力的薪資與完善的福利制度</span>
                        </li>
                        <li className="flex items-start text-sm sm:text-base text-gray-700">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>彈性工作制度與舒適的工作環境</span>
                        </li>
                        <li className="flex items-start text-sm sm:text-base text-gray-700">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>持續學習與專業發展的機會</span>
                        </li>
                        <li className="flex items-start text-sm sm:text-base text-gray-700">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>與頂尖醫療專業人士合作的平台</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <Link
                    href="https://www.104.com.tw/company/1a2x6bmyub#info06"
                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-medium hover:bg-primary-dark focus:bg-primary-dark transition-colors text-sm sm:text-base"
                    aria-label="前往104人力銀行查看職缺"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>立即申請職位</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                
                <div className="bg-white p-4 sm:p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    目前職缺
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="pb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">醫療內容策略專員</h4>
                      <p className="text-sm text-gray-700 mb-2">
                          負責規劃與撰寫各類醫療專業內容，包括網站內容、社群貼文、部落格文章等，需具備醫療相關知識或學習意願。
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">全職</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">台北</span>
                      </div>
                    </div>
                    
                    <div className="pb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">數位行銷執行專員</h4>
                      <p className="text-sm text-gray-700 mb-2">
                          負責執行醫療機構的數位行銷活動，包括廣告投放、追蹤與優化，社群媒體經營等，歡迎有醫療行銷熱情的新手。
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">全職/兼職</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">台北/遠端</span>
                      </div>
                    </div>
                    
                    <div className="pb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">UI/UX設計師</h4>
                      <p className="text-sm text-gray-700 mb-2">
                          為各類醫療機構設計網站及數位應用介面，創造具專業感且易用的使用者體驗，需對醫療品牌設計有興趣。
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">全職</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">台北</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">醫療行銷顧問</h4>
                      <p className="text-sm text-gray-700 mb-2">
                          為各類醫療機構提供行銷策略規劃與諮詢，協助建立專業品牌與提升市場競爭力，需具備3年以上相關經驗。
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">全職</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">台北</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

                {/* 客戶推薦 */}
        <section className="py-10 sm:py-16 md:py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
                客戶推薦
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                聽聽與我們合作的醫療專業人士怎麼說
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-800 mb-4 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="pt-4">
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-700">
                      {testimonial.role} • {testimonial.clinic}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 sm:py-16 md:py-20 bg-black text-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-4 sm:mb-6 text-white">
                準備好開始合作了嗎？
              </h2>
              <p className="text-base xs:text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto text-white">
                  讓我們的專業團隊，為您的醫療機構打造最適合的品牌成長策略
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

        {/* 回到頂部按鈕 */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showScrollTop ? 1 : 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 bg-primary-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${
            showScrollTop ? 'visible' : 'invisible'
          }`}
          aria-label="回到頁面頂部"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  )
} 