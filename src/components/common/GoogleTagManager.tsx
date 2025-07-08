'use client'

import { useEffect, useCallback, useState, useRef, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { initDataLayer, pushEvent } from '@/lib/analytics'

// 從環境變數獲取追蹤 ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-P5XLZB6F'
const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false'

// dataLayer類型定義
declare global {
  interface Window {
    dataLayer: any[] // dataLayer array
  }
}

/**
 * Google Tag Manager 內部組件
 * 負責初始化 GTM 並設置基本 dataLayer
 * GA4 設置將透過 GTM 後台進行配置
 */
const GoogleTagManagerInternal = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false)
  const lastPathRef = useRef<string>('')
  
  // 初始化 dataLayer - 使用記憶化函數減少不必要的重新渲染
  const setupDataLayer = useCallback(() => {
    if (!ENABLE_ANALYTICS || typeof window === 'undefined') return;
    
    try {
      // 使用集中管理的初始化函數
      initDataLayer();
      
      // 添加基本頁面信息到 dataLayer
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
        'language': 'zh-TW',
        'pageType': getPageType(pathname),
        'visitorType': getVisitorType(),
        'environment': process.env.NODE_ENV,
        'timestamp': new Date().toISOString()
      })
      
      // 標記訪客為回訪訪客
      localStorage.setItem('returning_visitor', 'true')
      setIsInitialized(true)
      
      // 性能監控 - 記錄 GTM 初始化時間
      if (window.performance && window.performance.now) {
        pushEvent('performance_monitoring', {
          event_name: 'gtm_initialized',
          time_since_page_load: Math.round(window.performance.now())
        });
      }
    } catch (error) {
      console.error('GTM 初始化失敗:', error);
      // 嘗試無錯誤初始化以確保頁面不會崩潰
      window.dataLayer = window.dataLayer || [];
      setIsInitialized(true);
    }
  }, [pathname])
  
  // 獲取頁面類型
  const getPageType = (path: string): string => {
    if (path === '/') return 'home';
    if (path.includes('/case')) return 'case';
    if (path.includes('/service')) return 'service';
    if (path.includes('/team')) return 'team';
    if (path.includes('/contact')) return 'contact';
    return 'other';
  }
  
  // 獲取訪客類型
  const getVisitorType = (): string => {
    if (typeof localStorage === 'undefined') return 'new';
    return localStorage.getItem('returning_visitor') ? 'returning' : 'new';
  }
  
  // 頁面瀏覽追蹤 - 使用記憶化函數優化性能
  const handlePageView = useCallback(() => {
    if (!isInitialized || !ENABLE_ANALYTICS || typeof window === 'undefined') return;
    
    try {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      
      // 防止重複觸發：比較目前路徑與上一次記錄的路徑
      if (lastPathRef.current !== url) {
        lastPathRef.current = url;
        
        // 推送頁面瀏覽事件到 dataLayer，GA4 將透過 GTM 配置來接收這個事件
        pushEvent('page_view', {
          page_path: pathname,
          page_url: url,
          page_title: document.title,
          page_location: window.location.href,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('頁面瀏覽追蹤失敗:', error);
    }
  }, [pathname, searchParams, isInitialized])

  // 初始化追蹤 - 只在組件掛載時執行一次
  useEffect(() => {
    if (ENABLE_ANALYTICS) {
      setupDataLayer();
    }
    
    // 清理函數
    return () => {
      if (typeof window !== 'undefined' && isInitialized && ENABLE_ANALYTICS) {
        pushEvent('component_unmount', {
          component: 'GoogleTagManager',
          timestamp: new Date().toISOString()
        });
      }
    };
  }, [setupDataLayer, isInitialized]);

  // 監聽路徑變化，觸發頁面瀏覽事件
  useEffect(() => {
    // 只有在初始化完成後才執行追蹤
    if (isInitialized && ENABLE_ANALYTICS) {
      // 使用 requestIdleCallback 或 setTimeout 確保不阻塞主線程
      if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => handlePageView());
        } else {
          setTimeout(handlePageView, 0);
        }
      }
    }
  }, [pathname, searchParams, handlePageView, isInitialized])
  
  // 對 GTM 腳本的加載結果進行監控
  const handleScriptLoad = () => {
    if (window.performance && window.performance.now) {
      pushEvent('performance_monitoring', {
        event_name: 'gtm_script_loaded',
        time_since_page_load: Math.round(window.performance.now())
      });
    }
    console.log('GTM 腳本加載成功');
  };
  
  const handleScriptError = () => {
    console.error('GTM 腳本加載失敗');
    pushEvent('error', {
      error_type: 'script_load_failure',
      script: 'GTM',
      timestamp: new Date().toISOString()
    });
  };
  
  // 如果分析功能被禁用，則返回空組件
  if (!ENABLE_ANALYTICS) {
    return null;
  }
  
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

/**
 * Google Tag Manager 主組件
 * 使用 Suspense 邊界包裝，避免 useSearchParams CSR bailout 錯誤
 */
const GoogleTagManager = () => {
  // 如果分析功能被禁用，則返回空組件
  if (!ENABLE_ANALYTICS) {
    return null;
  }
  
  return (
    <Suspense fallback={null}>
      <GoogleTagManagerInternal />
    </Suspense>
  )
}

export default GoogleTagManager 