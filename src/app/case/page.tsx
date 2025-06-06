import { Metadata } from 'next'
import CasePage from '@/components/pages/CasePage'

export const metadata: Metadata = {
  title: '成功案例 | Aidea:Med 牙醫行銷專家',
  description: '探索我們協助牙醫診所提升品牌價值與病患轉換率的成功案例，包含品牌重塑、數位行銷、空間規劃等多元服務。',
  keywords: ['牙醫行銷', '診所品牌', '醫療行銷', '成功案例', '品牌重塑', '數位行銷'],
  openGraph: {
    title: '成功案例 | Aidea:Med 牙醫行銷專家',
    description: '探索我們協助牙醫診所提升品牌價值與病患轉換率的成功案例，包含品牌重塑、數位行銷、空間規劃等多元服務。',
    url: 'https://www.aideamed.com/case',
    siteName: 'Aidea:Med 牙醫行銷專家',
    locale: 'zh_TW',
    type: 'website',
    images: [
      {
        url: 'https://www.aideamed.com/images/og-case.jpg',
        width: 1200,
        height: 630,
        alt: '成功案例展示',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '成功案例 | Aidea:Med 牙醫行銷專家',
    description: '探索我們協助牙醫診所提升品牌價值與病患轉換率的成功案例。',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CaseListPage() {
  return <CasePage />
} 