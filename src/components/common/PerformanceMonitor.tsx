'use client'

import { useEffect } from 'react'
import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals'

interface PerformanceMonitorProps {
  debug?: boolean
}

export default function PerformanceMonitor({ debug = false }: PerformanceMonitorProps) {
  useEffect(() => {
    // 只在生產環境或開啟 debug 時執行
    if (process.env.NODE_ENV === 'production' || debug) {
      // 累積佈局偏移 (CLS)
      onCLS((metric: Metric) => {
        if (debug) console.log('CLS:', metric)
        // 發送到分析服務
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'CLS',
            value: Math.round(metric.value * 1000),
            non_interaction: true,
          })
        }
      })

      // 首次輸入延遲 (FID)
      onFID((metric: Metric) => {
        if (debug) console.log('FID:', metric)
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'FID',
            value: Math.round(metric.value),
            non_interaction: true,
          })
        }
      })

      // 首次內容繪製 (FCP)
      onFCP((metric: Metric) => {
        if (debug) console.log('FCP:', metric)
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'FCP',
            value: Math.round(metric.value),
            non_interaction: true,
          })
        }
      })

      // 最大內容繪製 (LCP)
      onLCP((metric: Metric) => {
        if (debug) console.log('LCP:', metric)
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'LCP',
            value: Math.round(metric.value),
            non_interaction: true,
          })
        }
      })

      // 首位元組時間 (TTFB)
      onTTFB((metric: Metric) => {
        if (debug) console.log('TTFB:', metric)
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'TTFB',
            value: Math.round(metric.value),
            non_interaction: true,
          })
        }
      })
    }
  }, [debug])

  return null
} 