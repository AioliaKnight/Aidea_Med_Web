import { 
  sharedMetadata, 
  organizationSchema, 
  localBusinessSchema, 
  medicalServicesFaq,
  brandingWebsiteSchema
} from './metadata'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Navbar from '@/components/layout/Navbar'
import { Loading, BackToTopButton, WebsiteChat } from '@/components/common'

import '@/app/globals.css'
import '@/app/fonts.css'

export const metadata = sharedMetadata

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: 'var(--color-primary)',
  colorScheme: 'light'
}

export const runtime = 'edge'  // 使用邊緣運行時
export const preferredRegion = ['auto']  // 自動選擇最佳區域
export const dynamic = 'force-dynamic'  // 利用PPR的動態部分

// 使用Next.js 15+的部分預渲染功能
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({
  children
}: RootLayoutProps) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        {/* PWA 相關設定 */}
        <link
          rel="manifest"
          href="/manifest.json"
        />
        <meta 
          name="apple-mobile-web-app-capable" 
          content="yes" 
        />
        <meta 
          name="mobile-web-app-capable" 
          content="yes" 
        />
        <meta 
          name="apple-mobile-web-app-status-bar-style" 
          content="default" 
        />
        <meta 
          name="format-detection" 
          content="telephone=yes" 
        />
        
        {/* PWA 圖示 */}
        <link
          rel="icon"
          href="/favicon.ico"
          sizes="any"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        
        {/* 預加載字體以避免CSP問題 */}
        <link 
          rel="preload" 
          href="/fonts/GenYoGothicTW-Regular.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/fonts/GenYoGothicTW-Bold.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* 結構化資料 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(organizationSchema) 
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(localBusinessSchema) 
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(medicalServicesFaq) 
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(brandingWebsiteSchema) 
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans antialiased transition-colors overflow-x-hidden selection:bg-primary/20 selection:text-primary">
        {/* 導航欄 */}
        <Navbar />
        
        {/* 主要內容區域 - 使用React 19的優化Suspense設計，調整頂部間距以配合更緊湊的導航欄 */}
        <main className="min-h-screen pt-14 md:pt-[4rem]">
          <Suspense
            fallback={
              <Loading
                fullscreen
                text="載入應用程式..."
                blur
                size="lg"
                theme="primary"
              />
            }
          >
            {children}
          </Suspense>
        </main>

        {/* 增強型使用者體驗功能控制 - 使用Suspense分離非關鍵UI */}
        <div id="ux-controls" className="print:hidden">
          <Suspense fallback={null}>
            {/* 全局回到頂部按鈕 - 調整出現閾值，提升動畫效果 */}
            <BackToTopButton 
              threshold={600} /* 增加閾值，使按鈕不會過早出現 */
              position="bottom-24 right-9" /* 調整為有效的Tailwind類值 */
              rounded={true}
              size="w-10 h-10" /* 增大按鈕尺寸提高可見性 */
              iconSize="h-6 w-6"
              autoHideDelay={4000} /* 停止滾動4秒後自動隱藏 */
            />
          </Suspense>

          <Suspense fallback={null}>
            {/* 客服聊天功能 - 添加到固定UI控制區塊中 */}
            <WebsiteChat />
          </Suspense>
        </div>

        {/* Portal Root */}
        <div id="portal-root" />

        {/* Toast - 使用非阻塞渲染 */}
        <Suspense fallback={null}>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#fff',
                color: '#333',
                boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
                borderRadius: '6px',
                padding: '16px',
              },
              success: {
                style: {
                  border: '1px solid #e2f8f0',
                  borderLeft: '4px solid #10b981',
                },
              },
              error: {
                style: {
                  border: '1px solid #fee2e2',
                  borderLeft: '4px solid #ef4444',
                },
              },
            }}
          />
        </Suspense>

        {/* 分析工具 - 使用Suspense優化非阻塞加載 */}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <Suspense fallback={null}>
          <SpeedInsights />
        </Suspense>
      </body>
    </html>
  )
}
