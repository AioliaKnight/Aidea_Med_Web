import React, { Suspense } from 'react'
import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import { 
  Loading, 
  BackToTopButton, 
  GoogleTagManager,
  FloatingCTA,
  ErrorBoundary,
  BreadcrumbStructuredData,
  WebVitalsOptimizer
} from '@/components/common'
import { 
  sharedMetadata, 
  organizationSchema, 
  brandingWebsiteSchema,
  breadcrumbSchema,
  enhancedLocalBusinessSchema,
  enhancedMedicalServicesFaq
} from './metadata'
import { notoSansTC } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import '@/app/globals.css'
// 直接導入 Service Worker 組件 (已標記為 'use client')
import { ServiceWorkerProvider } from '@/components/common'

export const metadata: Metadata = sharedMetadata

// 直接定義 viewport 設定
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4A6CF7' },
    { media: '(prefers-color-scheme: dark)', color: '#191919' }
  ],
  colorScheme: 'light dark',
  interactiveWidget: 'resizes-visual'
}

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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo-w.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+886-2-2748-8919',
      contactType: '客戶服務',
      availableLanguage: ['Chinese', 'zh-TW']
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TW',
      addressRegion: '台北市',
      addressLocality: '大安區'
    },
    foundingDate: '2025',
    numberOfEmployees: '01-01',
    knowsAbout: [
      '醫療行銷',
      '診所經營',
      '數位行銷',
      '內容策略',
      '醫療廣告合規'
    ],
    serviceArea: {
      '@type': 'Country',
      name: '台灣'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '醫療行銷服務',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '醫療廣告合規諮詢',
            description: '協助診所符合廣告法規，避免法律風險'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '診所品牌策略',
            description: '打造專業醫療品牌形象，提升患者信任度'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '數位行銷規劃',
            description: '運用數位工具精準觸及目標患者群體'
          }
        }
      ]
    }
  }

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className={notoSansTC.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* 可訪問性: 跳到主要內容 */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50"
          tabIndex={1}
        >
          跳到主要內容
        </a>

        {/* Google Tag Manager */}
        <GoogleTagManager />
        
        {/* Service Worker 功能提供者 */}
        <ServiceWorkerProvider />
        
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col bg-white">
            {/* 導航欄 */}
            <Navbar />
            
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>
          
          {/* 全域組件 */}
          <BreadcrumbStructuredData />
          <WebVitalsOptimizer />
          <BackToTopButton />
          <FloatingCTA />
        </ErrorBoundary>
        
        {/* Vercel Analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
