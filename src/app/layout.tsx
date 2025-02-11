import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import { ScrollProvider } from '@/contexts/ScrollContext'
import { LoadingProvider } from '@/contexts/LoadingContext'
import Navbar from '@/components/ui/Navbar'
import './globals.css'

const notoSans = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
})

const notoSerif = Noto_Serif_TC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif',
})

export const metadata: Metadata = {
  title: 'Aidea:Med - 醫療行銷顧問公司',
  description: '專業的醫療與牙醫診所行銷顧問服務',
  keywords: ['醫療行銷', '牙醫診所行銷', '數位行銷', '整合行銷'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="min-h-screen font-sans">
        <LoadingProvider>
          <ScrollProvider>
            <Navbar />
            <main className="relative">
              {children}
            </main>
            <Analytics />
          </ScrollProvider>
        </LoadingProvider>
      </body>
    </html>
  )
} 