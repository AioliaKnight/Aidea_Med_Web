import { Noto_Sans_TC } from 'next/font/google'
import localFont from 'next/font/local'

// 載入 Noto Sans TC 作為主要中文字型
export const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-tc',
  preload: true,
})

// 自定義字型 Bageo
export const bageo = localFont({
  src: [
    {
      path: '../../public/fonts/Bageo.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-bageo',
  display: 'swap',
  preload: true,
}) 