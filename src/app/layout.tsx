import { 
  sharedMetadata, 
  organizationSchema, 
  localBusinessSchema, 
  medicalServicesFaq,
  brandingWebsiteSchema,
  breadcrumbSchema,
  enhancedLocalBusinessSchema,
  enhancedMedicalServicesFaq
} from './metadata'
import { viewport } from './viewport'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Navbar from '@/components/layout/Navbar'
import { 
  Loading, 
  BackToTopButton, 
  GoogleTagManager,
  PerformanceMonitor 
} from '@/components/common'
import { notoSansTC } from '@/lib/fonts'

import '@/app/globals.css'

export const metadata = sharedMetadata

// 使用從viewport.ts匯入的viewport設定
export { viewport }

// 支援靜態生成優化
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
    <html 
      lang="zh-TW" 
      className={`${notoSansTC.variable}`} 
      suppressHydrationWarning
      // 添加結構化資料屬性以增強EEAT
      itemScope
      itemType="https://schema.org/WebPage"
      // 醫療知識屬性
      data-medical-content="true"
      // 醫療權威性
      data-trustworthiness="high"
    >
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
        {/* 字體設定已改為使用 Google Fonts，移除本地字體預載 */}
        
        {/* 移動優化設定 */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
        <meta name="application-name" content="Aidea:Med 醫療行銷顧問" />
        
        {/* 醫療專業權威聲明 */}
        <meta name="description" content="由具醫療行銷背景的專業顧問提供診所品牌策略、醫師個人品牌建立、診所數位行銷優化等專業服務。我們的內容受醫療專業人士審核，符合衛福部規範。" />
        <meta name="author" content="Aidea:Med 醫療行銷顧問" />
        <meta name="copyright" content="© Aidea:Med 醫療行銷顧問" />
        <meta name="rating" content="general" />
        
        {/* 預加載關鍵資源 */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
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
            __html: JSON.stringify(enhancedLocalBusinessSchema) 
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(enhancedMedicalServicesFaq) 
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(brandingWebsiteSchema) 
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(breadcrumbSchema) 
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans antialiased transition-colors overflow-x-hidden selection:bg-primary/20 selection:text-primary">
        {/* Google Tag Manager (noscript) */}
        <Suspense fallback={null}>
          <GoogleTagManager />
        </Suspense>
        
        {/* 權威認證標記 - 增強 EEAT */}
        <div id="trustBadge" className="hidden" aria-hidden="true" data-certification="medical-marketing-authority">
          <span data-authority="medical-content">醫療行銷專業內容</span>
          <span data-authority-level="expert">專業審核認證</span>
          <span data-content-quality="high">高品質專業內容</span>
        </div>
        
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
                borderRadius: '8px',
                padding: '16px'
              }
            }}
          />
        </Suspense>

        {/* 分析工具 - 使用非阻塞渲染 */}
        <Suspense fallback={null}>
          <Analytics />
          <SpeedInsights />
          <PerformanceMonitor />
        </Suspense>
        
        {/* 可訪問性提升添加跳過導航連結 */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md">
          跳到主要內容
        </a>
      </body>
    </html>
  )
}
