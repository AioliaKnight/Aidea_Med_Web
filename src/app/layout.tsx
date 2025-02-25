import { homeMetadata } from './metadata'
import { Analytics } from '@vercel/analytics/react'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

import ClientProviders from '@/components/providers/ClientProviders'
import Navbar from '@/components/layout/Navbar'
import Loading from '@/components/common/Loading'
import ErrorBoundary from '@/components/common/ErrorBoundary'

import '@/styles/globals.css'

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
        {/* 字體預加載 */}
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous" 
        />
        
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
          name="apple-mobile-web-app-status-bar-style" 
          content="default" 
        />
        <meta 
          name="format-detection" 
          content="telephone=yes" 
        />
        
        {/* PWA 圖示 */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-192x192.png"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased transition-colors overflow-x-hidden selection:bg-primary/20 selection:text-primary">
        <ErrorBoundary>
          <ClientProviders>
            {/* 導航欄在 Suspense 外以避免不必要的重新渲染 */}
            <Navbar />
            
            <main className="min-h-screen pt-20">
              <Suspense
                fallback={
                  <Loading
                    fullscreen
                    text="載入應用程式..."
                    blur
                    size="lg"
                    color="primary"
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
      </body>
    </html>
  )
}
