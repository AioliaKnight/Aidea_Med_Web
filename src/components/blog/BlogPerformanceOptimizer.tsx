'use client'

import { useEffect, useCallback, useRef } from 'react'
import { trackPerformanceMetrics } from '@/lib/analytics'

interface BlogPerformanceOptimizerProps {
  postId: string
  contentLength: number
  imagesCount: number
}

/**
 * Blog 性能優化組件
 * 專門針對 blog 頁面的性能監控和優化
 */
export default function BlogPerformanceOptimizer({
  postId,
  contentLength,
  imagesCount
}: BlogPerformanceOptimizerProps) {
  const metricsReported = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 延遲載入圖片優化
  const setupLazyLoading = useCallback(() => {
    if (!('IntersectionObserver' in window)) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              observerRef.current?.unobserve(img)
            }
          }
        })
      },
      { 
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    )

    // 觀察所有帶有 data-src 的圖片
    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => observerRef.current?.observe(img))
  }, [])

  // 預載入關鍵資源
  const preloadCriticalResources = useCallback(() => {
    // 預載入相關文章的縮圖
    const relatedLinks = document.querySelectorAll('[data-related-post-image]')
    relatedLinks.forEach((link) => {
      const imageSrc = link.getAttribute('data-related-post-image')
      if (imageSrc) {
        const preloadLink = document.createElement('link')
        preloadLink.rel = 'prefetch'
        preloadLink.href = imageSrc
        document.head.appendChild(preloadLink)
      }
    })

    // 預載入字體（如果需要）
    const fontPreload = document.createElement('link')
    fontPreload.rel = 'preload'
    fontPreload.href = '/fonts/NotoSansTC-Regular.woff2'
    fontPreload.as = 'font'
    fontPreload.type = 'font/woff2'
    fontPreload.crossOrigin = 'anonymous'
    document.head.appendChild(fontPreload)
  }, [])

  // 監控核心網頁指標
  const monitorCoreWebVitals = useCallback(() => {
    if (metricsReported.current) return

    // 使用 Performance Observer 監控 LCP
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        if (lastEntry && lastEntry.entryType === 'largest-contentful-paint') {
          console.log('Blog LCP:', lastEntry.startTime)
          
          // 追蹤 blog 特定的性能指標
          trackPerformanceMetrics()
          
          // 發送自定義事件
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'blog_performance', {
              event_category: 'Blog Performance',
              event_label: postId,
              value: Math.round(lastEntry.startTime),
              custom_parameters: {
                content_length: contentLength,
                images_count: imagesCount
              }
            })
          }
          
          metricsReported.current = true
          observer.disconnect()
        }
      })

      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    }
  }, [postId, contentLength, imagesCount])

  // 優化滾動性能
  const optimizeScrollPerformance = useCallback(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // 這裡可以添加滾動相關的優化邏輯
          // 例如：延遲載入評論、相關文章等
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 記憶體清理優化
  const setupMemoryOptimization = useCallback(() => {
    // 清理未使用的事件監聽器
    const cleanup = () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }

    // 當頁面即將卸載時清理資源
    window.addEventListener('beforeunload', cleanup)
    
    return cleanup
  }, [])

  useEffect(() => {
    // 延遲執行非關鍵優化
    const timeouts = [
      setTimeout(setupLazyLoading, 100),
      setTimeout(preloadCriticalResources, 500),
      setTimeout(monitorCoreWebVitals, 1000)
    ]

    const scrollCleanup = optimizeScrollPerformance()
    const memoryCleanup = setupMemoryOptimization()

    return () => {
      timeouts.forEach(clearTimeout)
      scrollCleanup()
      memoryCleanup()
    }
  }, [setupLazyLoading, preloadCriticalResources, monitorCoreWebVitals, optimizeScrollPerformance, setupMemoryOptimization])

  return null // 這是一個純功能組件
} 