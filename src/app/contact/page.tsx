import { contactMetadata } from '../metadata'
import ContactPage from '@/components/pages/ContactPage'
import { BreadcrumbNav } from '@/components/common'
import Script from 'next/script'
import Link from 'next/link'

export const metadata = contactMetadata

export default function Page() {
  return (
    <>
      {/* 確保 GTM 能被 Google Search Console 識別 */}
      <Script
        id="gtm-verification"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // 聯絡頁面 GTM 驗證標記
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'page_type': 'contact',
              'page_path': '/contact',
              'page_title': '聯絡我們 - Aidea:Med 醫療行銷顧問'
            });
          `
        }}
      />
      <div className="container mx-auto px-4 pt-16">
        <BreadcrumbNav 
          className="mb-3" 
          includeJsonLd={true}
        />
      </div>
      <ContactPage />
      
      {/* 相關服務連結區塊 */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold text-center mb-8">探索我們的服務</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/service#brand-strategy"
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <h3 className="text-lg font-semibold mb-2 text-primary">診所品牌策略</h3>
              <p className="text-gray-600 text-sm">為您的診所打造獨特的品牌定位與市場競爭力</p>
            </Link>
            
            <Link 
              href="/service#digital-marketing"
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <h3 className="text-lg font-semibold mb-2 text-primary">數位行銷優化</h3>
              <p className="text-gray-600 text-sm">提升線上曝光度與新患者轉化率的專業行銷方案</p>
            </Link>
            
            <Link 
              href="/service#seo-optimization"
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <h3 className="text-lg font-semibold mb-2 text-primary">SEO優化服務</h3>
              <p className="text-gray-600 text-sm">讓您的診所在搜尋引擎排名更前，獲得更多精準流量</p>
            </Link>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/service"
              className="inline-flex items-center text-primary font-medium hover:underline"
            >
              查看所有服務
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
} 