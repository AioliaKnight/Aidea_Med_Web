'use client'

import { useEffect, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface WebVital {
  name: string
  value: number
  delta: number
  id: string
  entries: PerformanceEntry[]
}

interface WebVitalsOptimizerProps {
  reportWebVitals?: (metric: WebVital) => void
  enableConsoleLog?: boolean
  enableAnalytics?: boolean
}

/**
 * Web Vitals 優化組件
 * 監控並報告核心網頁體驗指標 (Core Web Vitals)
 * - LCP (Largest Contentful Paint)
 * - INP (Interaction to Next Paint) - 替代 FID
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 */
export default function WebVitalsOptimizer({
  reportWebVitals,
  enableConsoleLog = process.env.NODE_ENV === 'development',
  enableAnalytics = true
}: WebVitalsOptimizerProps) {
  const pathname = usePathname()
  const hasInitialized = useRef(false)
  const metricsCache = useRef<Map<string, WebVital>>(new Map())

  // 報告指標到 Google Analytics
  const reportToGA = useCallback((metric: WebVital) => {
    if (!enableAnalytics) return

    try {
      // 發送到 Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          custom_parameter_1: metric.value,
          custom_parameter_2: metric.id,
          custom_parameter_3: pathname,
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true
        })
      }

      // 發送到 GTM dataLayer
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'web_vitals',
          metric_name: metric.name,
          metric_value: metric.value,
          metric_id: metric.id,
          page_path: pathname,
          metric_delta: metric.delta
        })
      }
    } catch (error) {
      console.error('Failed to report metric to GA:', error)
    }
  }, [pathname, enableAnalytics])

  // 統一的指標處理函數
  const handleMetric = useCallback((metric: WebVital) => {
    // 避免重複報告相同指標
    const cacheKey = `${metric.name}-${metric.id}`
    const cachedMetric = metricsCache.current.get(cacheKey)
    
    if (cachedMetric && cachedMetric.value === metric.value) {
      return
    }

    metricsCache.current.set(cacheKey, metric)

    // 控制台日誌
    if (enableConsoleLog) {
      console.group(`🚀 Web Vitals: ${metric.name}`)
      console.log(`Value: ${metric.value}${metric.name === 'CLS' ? '' : 'ms'}`)
      console.log(`Delta: ${metric.delta}${metric.name === 'CLS' ? '' : 'ms'}`)
      console.log(`ID: ${metric.id}`)
      console.log(`Entries:`, metric.entries)
      console.log(`Page: ${pathname}`)
      
      // 性能評分
      const rating = getPerformanceRating(metric.name, metric.value)
      console.log(`Rating: ${rating}`)
      console.groupEnd()
    }

    // 發送到外部回調
    if (reportWebVitals) {
      reportWebVitals(metric)
    }

    // 發送到 Analytics
    reportToGA(metric)
  }, [enableConsoleLog, reportWebVitals, reportToGA, pathname])

  // 初始化 Web Vitals 監控
  useEffect(() => {
    if (hasInitialized.current) return

    const initWebVitals = async () => {
      try {
        // 動態載入 web-vitals，使用正確的 v4+ API
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals')

        // 監控各項指標
        onCLS(handleMetric)
        onINP(handleMetric) // 使用 INP 替代 FID
        onFCP(handleMetric)
        onLCP(handleMetric)
        onTTFB(handleMetric)

        hasInitialized.current = true
      } catch (error) {
        console.error('Failed to initialize Web Vitals:', error)
      }
    }

    initWebVitals()
  }, [handleMetric])

  // 清理路由變更時的快取
  useEffect(() => {
    metricsCache.current.clear()
  }, [pathname])

  return null
}

// 性能評分函數
function getPerformanceRating(metricName: string, value: number): string {
  const thresholds: Record<string, { good: number; needsImprovement: number }> = {
    LCP: { good: 2500, needsImprovement: 4000 },
    INP: { good: 200, needsImprovement: 500 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FCP: { good: 1800, needsImprovement: 3000 },
    TTFB: { good: 800, needsImprovement: 1800 }
  }

  const threshold = thresholds[metricName]
  if (!threshold) return 'Unknown'

  if (value <= threshold.good) return '🟢 Good'
  if (value <= threshold.needsImprovement) return '🟡 Needs Improvement'
  return '🔴 Poor'
} 