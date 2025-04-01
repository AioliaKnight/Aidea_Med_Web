/**
 * 網站分析工具庫
 * 提供GTM/GA事件追蹤和使用者行為分析功能
 */

// 確保dataLayer存在
export const initDataLayer = () => {
  try {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
    }
  } catch (error) {
    console.error('初始化dataLayer失敗:', error);
  }
};

/**
 * 推送事件到dataLayer
 * @param eventName 事件名稱
 * @param eventParams 事件參數
 * @returns {boolean} 是否成功推送事件
 */
export const pushEvent = (eventName: string, eventParams?: Record<string, any>): boolean => {
  try {
    if (typeof window !== 'undefined') {
      initDataLayer();
      window.dataLayer.push({
        event: eventName,
        ...eventParams,
        timestamp: eventParams?.timestamp || new Date().toISOString()
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error(`推送事件 ${eventName} 失敗:`, error);
    return false;
  }
};

/**
 * 追蹤頁面瀏覽
 * @param pageTitle 頁面標題
 * @param pagePath 頁面路徑
 */
export const trackPageView = (pageTitle: string, pagePath: string): void => {
  pushEvent('page_view', {
    page_title: pageTitle,
    page_path: pagePath,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
  
  // 同時追蹤頁面載入性能指標
  if (typeof window !== 'undefined' && window.performance) {
    trackPerformanceMetrics();
  }
};

/**
 * 追蹤表單提交事件
 * @param formName 表單名稱
 * @param formData 表單數據
 */
export const trackFormSubmission = (formName: string, formData: Record<string, any>): void => {
  pushEvent('form_submission', {
    form_name: formName,
    form_id: formData.id || formName,
    form_service: formData.service || '未指定服務',
    source: formData.source || '直接訪問',
    plan: formData.plan || '一般諮詢',
  });
};

/**
 * 追蹤按鈕點擊事件
 * @param buttonName 按鈕名稱
 * @param buttonLocation 按鈕位置
 * @param additionalData 額外數據
 */
export const trackButtonClick = (
  buttonName: string, 
  buttonLocation: string, 
  additionalData?: Record<string, any>
): void => {
  pushEvent('button_click', {
    button_name: buttonName,
    button_location: buttonLocation,
    page_title: typeof document !== 'undefined' ? document.title : '',
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    ...additionalData
  });
};

/**
 * 追蹤搜尋事件
 * @param searchTerm 搜尋詞
 * @param searchResults 搜尋結果數量
 */
export const trackSearch = (searchTerm: string, searchResults: number): void => {
  pushEvent('search', {
    search_term: searchTerm,
    search_results_count: searchResults,
  });
};

/**
 * 追蹤服務瀏覽事件
 * @param serviceName 服務名稱
 * @param serviceCategory 服務類別
 */
export const trackServiceView = (serviceName: string, serviceCategory: string): void => {
  pushEvent('service_view', {
    service_name: serviceName,
    service_category: serviceCategory,
  });
};

/**
 * 追蹤圖片載入事件
 * @param imageType 圖片類型，例如 'logo', 'hero', 'banner'
 * @param imageVariant 圖片變體，例如 'white', 'black', 'primary'
 * @param format 圖片格式，例如 'webp', 'png', 'jpg'
 * @param loadTime 載入時間（毫秒），可選
 */
export const trackImageLoad = (
  imageType: string, 
  imageVariant: string, 
  format: string, 
  loadTime?: number
): void => {
  pushEvent('image_load', {
    image_type: imageType,
    image_variant: imageVariant,
    image_format: format,
    load_time: loadTime,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
};

/**
 * 追蹤案例查看事件
 * @param caseName 案例名稱
 * @param caseId 案例ID
 * @param caseCategory 案例類別
 */
export const trackCaseView = (caseName: string, caseId: string, caseCategory: string): void => {
  pushEvent('case_view', {
    case_name: caseName,
    case_id: caseId,
    case_category: caseCategory,
  });
};

/**
 * 追蹤性能指標
 * 收集並發送常見Web Vitals和自定義性能指標
 */
export const trackPerformanceMetrics = (): void => {
  if (typeof window === 'undefined' || !window.performance) return;
  
  // 使用Performance API收集指標
  try {
    const navigationTiming = window.performance.timing;
    const pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
    const domReadyTime = navigationTiming.domComplete - navigationTiming.domLoading;
    
    pushEvent('performance_metrics', {
      page_load_time: pageLoadTime > 0 ? pageLoadTime : undefined,
      dom_ready_time: domReadyTime > 0 ? domReadyTime : undefined,
      navigation_type: getNavigationType(),
      memory: window.performance.memory ? {
        usedJSHeapSize: Math.round(window.performance.memory.usedJSHeapSize / 1048576), // MB
        totalJSHeapSize: Math.round(window.performance.memory.totalJSHeapSize / 1048576) // MB
      } : undefined
    });
    
    // 收集資源載入時間
    collectResourceTiming();
  } catch (error) {
    console.error('追蹤性能指標失敗:', error);
  }
};

/**
 * 獲取導航類型
 * @returns {string} 導航類型的描述
 */
const getNavigationType = (): string => {
  if (typeof window === 'undefined' || !window.performance || !window.performance.navigation) {
    return 'unknown';
  }
  
  const navType = window.performance.navigation.type;
  switch (navType) {
    case 0: return 'navigate';
    case 1: return 'reload';
    case 2: return 'back_forward';
    default: return 'other';
  }
};

/**
 * 收集資源載入時間
 */
const collectResourceTiming = (): void => {
  if (typeof window === 'undefined' || !window.performance || !window.performance.getEntriesByType) {
    return;
  }
  
  try {
    // 獲取所有資源載入項目
    const resources = window.performance.getEntriesByType('resource');
    
    // 篩選出關鍵資源
    const criticalResources = resources.filter((resource: any) => {
      const url = resource.name.toLowerCase();
      return (
        url.includes('.js') || 
        url.includes('.css') || 
        url.includes('googletagmanager') ||
        url.includes('analytics')
      );
    }).slice(0, 10); // 限制只取前10個關鍵資源
    
    // 提取並發送關鍵資源的載入時間
    if (criticalResources.length > 0) {
      const resourcesData = criticalResources.map((resource: any) => ({
        name: resource.name.split('/').pop()?.substring(0, 30) || 'unknown',
        duration: Math.round(resource.duration),
        fileType: getFileType(resource.name),
        size: resource.transferSize || 0
      }));
      
      pushEvent('resource_timing', {
        resources: resourcesData,
        total_resources: resources.length
      });
    }
  } catch (error) {
    console.error('收集資源載入時間失敗:', error);
  }
};

/**
 * 獲取文件類型
 * @param url 資源URL
 * @returns {string} 文件類型
 */
const getFileType = (url: string): string => {
  if (!url) return 'unknown';
  
  if (url.includes('.js')) return 'javascript';
  if (url.includes('.css')) return 'stylesheet';
  if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.webp')) return 'image';
  if (url.includes('.svg')) return 'svg';
  if (url.includes('.woff') || url.includes('.woff2') || url.includes('.ttf')) return 'font';
  if (url.includes('gtm') || url.includes('googletagmanager')) return 'gtm';
  if (url.includes('analytics')) return 'analytics';
  
  return 'other';
};

/**
 * 追蹤錯誤事件
 * @param errorMessage 錯誤訊息
 * @param errorSource 錯誤來源
 * @param errorData 額外錯誤數據
 */
export const trackError = (
  errorMessage: string,
  errorSource: string,
  errorData?: Record<string, any>
): void => {
  pushEvent('error', {
    error_message: errorMessage,
    error_source: errorSource,
    error_data: errorData,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    page_title: typeof document !== 'undefined' ? document.title : ''
  });
};

/**
 * 追蹤用戶行為
 * @param actionName 行為名稱
 * @param category 類別
 * @param label 標籤
 * @param value 值
 */
export const trackUserBehavior = (
  actionName: string,
  category: string,
  label?: string,
  value?: number
): void => {
  pushEvent('user_behavior', {
    action: actionName,
    category: category,
    label: label,
    value: value
  });
};

// 確保Performance Memory API的類型定義
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
  
  interface Window {
    dataLayer: any[];
    gtag?: (command: string, action: string, params?: Record<string, any>) => void;
  }
} 