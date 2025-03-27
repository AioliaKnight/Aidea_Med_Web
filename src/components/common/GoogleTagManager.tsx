'use client'

import { useEffect, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

// GTM ID從環境變數獲取
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-P5XLZB6F'

// dataLayer類型定義
declare global {
  interface Window {
    dataLayer: any[]
  }
}

/**
 * Google Tag Manager 組件
 * 負責初始化GTM並設置基本dataLayer
 * 自動追蹤頁面瀏覽事件
 */
const GoogleTagManager = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // 初始化dataLayer
  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    
    // 添加基本頁面信息到dataLayer
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
      'language': 'zh-TW',
      'pageType': document.title.includes('Aidea:Med') ? 'home' : 'other',
      'visitorType': localStorage.getItem('returning_visitor') ? 'returning' : 'new'
    })
    
    // 標記訪客為回訪訪客
    localStorage.setItem('returning_visitor', 'true')
  }, [])

  // 頁面瀏覽追蹤
  const handlePageView = useCallback(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    
    // 防止重複觸發
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: pathname,
        page_url: url,
        page_title: document.title
      })
    }
  }, [pathname, searchParams])

  // 監聽路徑變化，觸發頁面瀏覽事件
  useEffect(() => {
    // 初始頁面加載時追蹤
    handlePageView()
    
    // 路徑變化時追蹤
  }, [pathname, searchParams, handlePageView])
  
  return (
    <>
      {/* Google Tag Manager - Head Script */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `
        }}
      />
      
      {/* Google Tag Manager - NoScript Fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}

export default GoogleTagManager 