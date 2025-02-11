'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

interface TeamMember {
  name: string
  role: string
  description: string
  image: string
  expertise: string[]
  certifications?: string[]
  socialLinks?: {
    linkedin?: string
    twitter?: string
  }
}

const team: TeamMember[] = [
  {
    name: '張醫師',
    role: '醫療顧問',
    description: '擁有15年牙醫臨床經驗,深入了解診所營運與病患需求,協助診所優化服務流程。',
    image: 'https://placehold.co/400x400/FF0000/FFFFFF/png?text=張醫師',
    expertise: ['醫療管理', '服務設計'],
    certifications: ['醫療管理碩士'],
    socialLinks: {
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    name: '王經理',
    role: '品牌策略總監',
    description: '專注牙醫品牌策略規劃,擅長挖掘診所特色價值,建立差異化競爭優勢。',
    image: 'https://placehold.co/400x400/FF0000/FFFFFF/png?text=王總監',
    expertise: ['品牌策略', '成長駭客'],
    certifications: ['數位行銷認證'],
    socialLinks: {
      linkedin: '#'
    }
  },
  {
    name: '李設計師',
    role: '創意總監',
    description: '專精醫療資訊視覺化,將專業知識轉化為易懂內容,提升診所專業形象。',
    image: 'https://placehold.co/400x400/FF0000/FFFFFF/png?text=李總監',
    expertise: ['內容策展', '視覺設計'],
    certifications: ['醫療傳播碩士'],
    socialLinks: {
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    name: '陳工程師',
    role: '數位轉型顧問',
    description: '協助診所數位化升級,打造流暢的線上服務體驗,提升營運效率。',
    image: 'https://placehold.co/400x400/FF0000/FFFFFF/png?text=陳總監',
    expertise: ['流程優化', '數位工具'],
    certifications: ['專案管理認證'],
    socialLinks: {
      linkedin: '#'
    }
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

export default function Team() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 bg-white" ref={ref} id="team">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-7xl mx-auto"
        >
          {/* 標題區塊 */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-red to-brand-red/80 bg-clip-text text-transparent">
              專業團隊
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              集結醫療與行銷專家,為您的診所打造最佳成長方案
            </p>
          </motion.div>

          {/* 團隊成員 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="text-center group"
              >
                {/* 照片容器 */}
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* 懸浮效果 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-red/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <div className="flex gap-4">
                      {member.socialLinks?.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          className="text-white hover:text-white/80 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      )}
                      {member.socialLinks?.twitter && (
                        <a
                          href={member.socialLinks.twitter}
                          className="text-white hover:text-white/80 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Twitter
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* 資訊區塊 */}
                <motion.div
                  variants={itemVariants}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold group-hover:text-brand-red transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-brand-red mb-2">{member.role}</p>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                    {member.description}
                  </p>
                  
                  {/* 專長標籤 */}
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* 認證標籤 */}
                  {member.certifications && (
                    <div className="flex flex-wrap gap-2">
                      {member.certifications.map((cert, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* CTA 區塊 */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-brand-red text-white rounded-full hover:bg-opacity-90 transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
            >
              加入我們的團隊
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 