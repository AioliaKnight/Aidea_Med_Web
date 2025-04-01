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
    dataLayer: any[] // 保持原始類型以避免lint錯誤
  }
}

// 自定義類型用於內部使用，不影響全局定義
interface DataLayerEvent {
  event?: string;
  'gtm.start'?: number;
  language?: string;
  pageType?: string;
  visitorType?: string;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Google Tag Manager 組件
 * 負責初始化GTM並設置基本dataLayer
 * 自動追蹤頁面瀏覽事件
 * @returns {JSX.Element} GTM腳本和noscript標籤
 */
const GoogleTagManager = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false)
  const lastPathRef = useRef<string>('')
  
  // 初始化dataLayer - 使用記憶化函數減少不必要的重新渲染
  const setupDataLayer = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;
      
      // 使用集中管理的初始化函數
      initDataLayer();
      
      // 添加基本頁面信息到dataLayer
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
        'language': 'zh-TW',
        'pageType': document.title.includes('Aidea:Med') ? 'home' : 'other',
        'visitorType': localStorage.getItem('returning_visitor') ? 'returning' : 'new',
        'timestamp': new Date().toISOString()
      })
      
      // 標記訪客為回訪訪客
      localStorage.setItem('returning_visitor', 'true')
      setIsInitialized(true)
      
      // 性能監控 - 記錄GTM初始化時間
      if (window.performance && window.performance.now) {
        pushEvent('performance_monitoring', {
          event_name: 'gtm_initialized',
          time_since_page_load: Math.round(window.performance.now())
        });
      }
    } catch (error) {
      console.error('GTM初始化失敗:', error);
      // 嘗試無錯誤初始化以確保頁面不會崩潰
      window.dataLayer = window.dataLayer || [];
      setIsInitialized(true);
    }
  }, [])
  
  // 頁面瀏覽追蹤 - 使用記憶化函數優化性能
  const handlePageView = useCallback(() => {
    try {
      if (!isInitialized || typeof window === 'undefined') return;
      
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      
      // 防止重複觸發：比較目前路徑與上一次記錄的路徑
      if (lastPathRef.current !== url) {
        lastPathRef.current = url;
        
        // 使用集中管理的事件推送函數
        pushEvent('page_view', {
          page_path: pathname,
          page_url: url,
          page_title: document.title,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('頁面瀏覽追蹤失敗:', error);
    }
  }, [pathname, searchParams, isInitialized])

  // 初始化dataLayer - 只在組件掛載時執行一次
  useEffect(() => {
    setupDataLayer();
    
    // 清理函數
    return () => {
      if (typeof window !== 'undefined' && isInitialized) {
        pushEvent('component_unmount', {
          component: 'GoogleTagManager',
          timestamp: new Date().toISOString()
        });
      }
    };
  }, [setupDataLayer]);

  // 監聽路徑變化，觸發頁面瀏覽事件
  useEffect(() => {
    // 只有在初始化完成後才執行追蹤
    if (isInitialized) {
      // 使用requestIdleCallback或setTimeout確保不阻塞主線程
      if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => handlePageView());
        } else {
          setTimeout(handlePageView, 0);
        }
      }
    }
  }, [pathname, searchParams, handlePageView, isInitialized])
  
  // 對GTM腳本的加載結果進行監控
  const handleScriptLoad = () => {
    if (window.performance && window.performance.now) {
      pushEvent('performance_monitoring', {
        event_name: 'gtm_script_loaded',
        time_since_page_load: Math.round(window.performance.now())
      });
    }
  };
  
  const handleScriptError = () => {
    console.error('GTM腳本加載失敗');
    pushEvent('error', {
      error_type: 'script_load_failure',
      script: 'GTM',
      timestamp: new Date().toISOString()
    });
  };
  
  return (
    <>
      {/* Google Tag Manager - Head Script */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
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
          title="Google Tag Manager"
        />
      </noscript>
    </>
  )
}

export default GoogleTagManager 