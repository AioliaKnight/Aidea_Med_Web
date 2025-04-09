import { Noto_Sans_TC } from 'next/font/google'

// 載入 Noto Sans TC 作為主要中文字型
export const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-tc',
  preload: true,
}) 