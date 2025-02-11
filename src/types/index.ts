// 共用型別定義
export interface SocialLinks {
  linkedin?: string
  twitter?: string
}

export interface TeamMember {
  name: string
  role: string
  description: string
  image: string
  socialLinks?: SocialLinks
}

export interface CaseStudy {
  title: string
  category: string
  description: string
  image: string
  stats: Array<{
    label: string
    value: string
  }>
}

export interface Service {
  title: string
  description: string
  icon: string
  gradient: string
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  clinic: string
  message: string
} 