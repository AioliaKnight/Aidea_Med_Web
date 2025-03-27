/**
 * 網站分析工具庫
 * 提供GTM/GA事件追蹤和使用者行為分析功能
 */

// 確保dataLayer存在
export const initDataLayer = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

/**
 * 推送事件到dataLayer
 * @param eventName 事件名稱
 * @param eventParams 事件參數
 */
export const pushEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    initDataLayer();
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
  }
};

/**
 * 追蹤頁面瀏覽
 * @param pageTitle 頁面標題
 * @param pagePath 頁面路徑
 */
export const trackPageView = (pageTitle: string, pagePath: string) => {
  pushEvent('page_view', {
    page_title: pageTitle,
    page_path: pagePath,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
};

/**
 * 追蹤表單提交事件
 * @param formName 表單名稱
 * @param formData 表單數據
 */
export const trackFormSubmission = (formName: string, formData: Record<string, any>) => {
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
 */
export const trackButtonClick = (buttonName: string, buttonLocation: string) => {
  pushEvent('button_click', {
    button_name: buttonName,
    button_location: buttonLocation,
    page_title: typeof document !== 'undefined' ? document.title : '',
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
};

/**
 * 追蹤搜尋事件
 * @param searchTerm 搜尋詞
 * @param searchResults 搜尋結果數量
 */
export const trackSearch = (searchTerm: string, searchResults: number) => {
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
export const trackServiceView = (serviceName: string, serviceCategory: string) => {
  pushEvent('service_view', {
    service_name: serviceName,
    service_category: serviceCategory,
  });
};

/**
 * 追蹤案例查看事件
 * @param caseName 案例名稱
 * @param caseId 案例ID
 * @param caseCategory 案例類別
 */
export const trackCaseView = (caseName: string, caseId: string, caseCategory: string) => {
  pushEvent('case_view', {
    case_name: caseName,
    case_id: caseId,
    case_category: caseCategory,
  });
};

// 導出全局類型定義
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (command: string, action: string, params?: Record<string, any>) => void;
  }
} 