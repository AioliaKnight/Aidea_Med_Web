import { contactMetadata } from '../metadata'
import ContactPage from '@/components/pages/ContactPage'
import Script from 'next/script'

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
      <ContactPage />
    </>
  )
} 