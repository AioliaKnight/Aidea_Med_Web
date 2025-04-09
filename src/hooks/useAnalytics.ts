'use client'

import { useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { 
  pushEvent, 
  trackPageView, 
  trackButtonClick, 
  trackFormSubmission, 
  trackCaseView 
} from '@/lib/analytics'

/**
 * 自定義 hook 用於在組件中簡化 GTM 分析追蹤
 * 所有事件都會推送到 dataLayer 中，然後由 GTM 決定如何處理這些事件
 * 
 * @returns 分析追蹤函數集合
 */
export function useAnalytics() {
  const pathname = usePathname()
  
  // 自動追蹤頁面瀏覽 - 推送到 dataLayer 供 GTM 使用
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 等待頁面完全載入
      const trackCurrentPage = () => {
        trackPageView(document.title, pathname)
      }
      
      // 如果頁面已載入，立即追蹤
      if (document.readyState === 'complete') {
        trackCurrentPage()
      } else {
        // 否則等待頁面載入完成
        window.addEventListener('load', trackCurrentPage)
        return () => {
          window.removeEventListener('load', trackCurrentPage)
        }
      }
    }
  }, [pathname])
  
  /**
   * 追蹤按鈕點擊 - 推送到 dataLayer 供 GTM 使用
   */
  const trackClick = useCallback((
    buttonName: string, 
    buttonLocation: string, 
    additionalData?: Record<string, any>
  ) => {
    trackButtonClick(buttonName, buttonLocation, additionalData)
  }, [])
  
  /**
   * 追蹤表單提交 - 推送到 dataLayer 供 GTM 使用
   */
  const trackForm = useCallback((
    formName: string, 
    formData: Record<string, any>
  ) => {
    trackFormSubmission(formName, formData)
  }, [])
  
  /**
   * 追蹤案例查看 - 推送到 dataLayer 供 GTM 使用
   */
  const trackCase = useCallback((
    caseName: string,
    caseId: string,
    caseCategory: string
  ) => {
    trackCaseView(caseName, caseId, caseCategory)
  }, [])
  
  /**
   * 追蹤自定義事件 - 推送到 dataLayer 供 GTM 使用
   */
  const trackEvent = useCallback((
    eventName: string,
    eventData?: Record<string, any>
  ) => {
    pushEvent(eventName, eventData)
  }, [])

  return {
    trackClick,
    trackForm,
    trackCase,
    trackEvent
  }
}

export default useAnalytics 