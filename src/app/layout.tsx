import { 
  sharedMetadata, 
  organizationSchema, 
  localBusinessSchema, 
  medicalServicesFaq,
  brandingWebsiteSchema
} from './metadata'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

import Navbar from '@/components/layout/Navbar'
import Loading from '@/components/common/Loading'

import '@/app/globals.css'
import '@/app/fonts.css'

export const metadata = sharedMetadata

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#e62733',
  colorScheme: 'light'
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
        
        {/* 主要內容區域 */}
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

        {/* Portal Root */}
        <div id="portal-root" />

        {/* Toast */}
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

        {/* Analytics */}
        <script
          defer
          src="/_vercel/insights/script.js"
        ></script>
        
        {/* Speed Insights */}
        <script
          defer
          src="/_vercel/speed-insights/script.js"
        ></script>
      </body>
    </html>
  )
}
