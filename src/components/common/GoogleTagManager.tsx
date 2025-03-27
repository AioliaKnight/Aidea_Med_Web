'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { initDataLayer, pushEvent } from '@/lib/analytics'

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
  const [isInitialized, setIsInitialized] = useState(false)
  const lastPathRef = useRef<string>('')
  
  // 初始化dataLayer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 使用集中管理的初始化函數
    initDataLayer();
    
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
    setIsInitialized(true)
  }, [])

  // 頁面瀏覽追蹤
  const handlePageView = useCallback(() => {
    if (!isInitialized || typeof window === 'undefined') return;
    
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    
    // 防止重複觸發：比較目前路徑與上一次記錄的路徑
    if (lastPathRef.current !== url) {
      lastPathRef.current = url;
      
      // 使用集中管理的事件推送函數
      pushEvent('page_view', {
        page_path: pathname,
        page_url: url,
        page_title: document.title
      });
    }
  }, [pathname, searchParams, isInitialized])

  // 監聽路徑變化，觸發頁面瀏覽事件
  useEffect(() => {
    // 只有在初始化完成後才執行追蹤
    if (isInitialized) {
      handlePageView();
    }
  }, [pathname, searchParams, handlePageView, isInitialized])
  
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