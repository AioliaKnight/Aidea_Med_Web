import { homeMetadata } from './metadata'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

import ClientProviders from '@/components/providers/ClientProviders'
import Navbar from '@/components/layout/Navbar'
import Loading from '@/components/common/Loading'
import ErrorBoundary from '@/components/common/ErrorBoundary'

import '@/app/globals.css'
import '@/styles/fonts.css'

export const metadata = homeMetadata

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

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
          href="/fonts/GenYoGothicTW-Regular-subset.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/fonts/GenYoGothicTW-Bold-subset.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans antialiased transition-colors overflow-x-hidden selection:bg-primary/20 selection:text-primary">
        <ErrorBoundary>
          <ClientProviders>
            {/* 導航欄在 Suspense 外以避免不必要的重新渲染 */}
            <Navbar />
            <main className="min-h-screen pt-0">
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
          </ClientProviders>
        </ErrorBoundary>

        {/* Portal Root */}
        <div id="portal-root" />

        {/* Toast */}
        <Toaster position="top-center" />

        {/* Analytics */}
        <Analytics />
        
        {/* Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  )
}
