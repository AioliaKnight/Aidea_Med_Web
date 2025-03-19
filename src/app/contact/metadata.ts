import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '與我們聯繫 | Aidea:Med 專業醫療行銷',
  description: '專注於醫療診所行銷，讓您專注於醫療專業，行銷交給我們！Aidea:Med結合AI技術與豐富醫療經驗，為牙醫、眼科、中醫、皮膚科等專科診所提供全方位數位行銷服務。',
  keywords: '醫療行銷, 診所行銷, 牙醫行銷, 醫美行銷, 中醫行銷, AI醫療行銷',
  openGraph: {
    title: '醫療行銷專家 | Aidea:Med',
    description: '讓您專注於醫療專業，行銷交給我們！結合AI技術與醫療行銷經驗，提供客製化行銷解決方案。',
    url: 'https://aideamed.com/contact',
    siteName: 'Aidea:Med',
    locale: 'zh_TW',
    type: 'website',
    images: [
      {
        url: 'https://aideamed.com/images/contact-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Aidea:Med 專業醫療行銷團隊'
      }
    ]
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://aideamed.com/contact'
  }
} 