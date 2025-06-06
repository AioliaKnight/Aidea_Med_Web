'use client'

import { useEffect, useState, useCallback } from 'react'

interface BlogMobileOptimizerProps {
  children?: React.ReactNode
}

/**
 * Blog 移動端優化組件
 * 專門處理移動設備上的性能和用戶體驗優化
 */
export default function BlogMobileOptimizer({ children }: BlogMobileOptimizerProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  // 檢測移動設備和網絡狀況
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      setIsMobile(mobile)
    }

    const checkConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        const slowConnections = ['slow-2g', '2g', '3g']
        setIsSlowConnection(slowConnections.includes(connection.effectiveType))
      }
    }

    checkDevice()
    checkConnection()
  }, [])

  // 移動端特定優化
  const applyMobileOptimizations = useCallback(() => {
    if (!isMobile) return

    // 1. 禁用 hover 效果以提升性能
    document.body.classList.add('mobile-device')

    // 2. 優化觸摸滾動
    const scrollElements = document.querySelectorAll('.blog-content, .blog-list')
    scrollElements.forEach(element => {
      const style = (element as HTMLElement).style as any
      style.webkitOverflowScrolling = 'touch'
    })

    // 3. 減少動畫複雜度
    if (isSlowConnection) {
      document.body.classList.add('reduce-motion')
    }

    // 4. 優化字體載入
    const fontDisplay = document.createElement('style')
    fontDisplay.textContent = `
      @font-face {
        font-family: 'Noto Sans TC';
        font-display: swap;
      }
    `
    document.head.appendChild(fontDisplay)

    // 5. 預載入關鍵 CSS
    const criticalCSS = document.createElement('link')
    criticalCSS.rel = 'preload'
    criticalCSS.href = '/styles/critical.css'
    criticalCSS.as = 'style'
    document.head.appendChild(criticalCSS)

  }, [isMobile, isSlowConnection])

  // 移動端圖片優化
  const optimizeImagesForMobile = useCallback(() => {
    if (!isMobile) return

    const images = document.querySelectorAll('img')
    images.forEach(img => {
      // 添加 loading="lazy" 如果沒有的話
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy')
      }

      // 對於慢速連接，使用較低質量的圖片
      if (isSlowConnection && img.src.includes('unsplash.com')) {
        const url = new URL(img.src)
        url.searchParams.set('q', '60') // 降低圖片質量
        url.searchParams.set('w', '800') // 限制寬度
        img.src = url.toString()
      }
    })
  }, [isMobile, isSlowConnection])

  // 移動端內容優化
  const optimizeContentForMobile = useCallback(() => {
    if (!isMobile) return

    // 1. 簡化表格顯示
    const tables = document.querySelectorAll('table')
    tables.forEach(table => {
      table.classList.add('mobile-responsive-table')
    })

    // 2. 優化代碼塊
    const codeBlocks = document.querySelectorAll('pre')
    codeBlocks.forEach(block => {
      block.style.fontSize = '14px'
      block.style.overflowX = 'auto'
    })

    // 3. 調整間距
    const headings = document.querySelectorAll('h1, h2, h3')
    headings.forEach(heading => {
      (heading as HTMLElement).style.marginTop = '1.5rem';
      (heading as HTMLElement).style.marginBottom = '1rem'
    })

  }, [isMobile])

  useEffect(() => {
    const timeouts = [
      setTimeout(applyMobileOptimizations, 100),
      setTimeout(optimizeImagesForMobile, 200),
      setTimeout(optimizeContentForMobile, 300)
    ]

    return () => timeouts.forEach(clearTimeout)
  }, [applyMobileOptimizations, optimizeImagesForMobile, optimizeContentForMobile])

  // 添加移動端特定樣式
  useEffect(() => {
    if (isMobile) {
      const mobileStyles = document.createElement('style')
      mobileStyles.textContent = `
        .mobile-device .hover\\:scale-105:hover {
          transform: none !important;
        }
        
        .mobile-device .hover\\:shadow-md:hover {
          box-shadow: none !important;
        }
        
        .reduce-motion * {
          animation-duration: 0.01s !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01s !important;
        }
        
        .mobile-responsive-table {
          font-size: 14px;
          overflow-x: auto;
          white-space: nowrap;
        }
        
        @media (max-width: 768px) {
          .blog-content h1 { font-size: 1.75rem !important; }
          .blog-content h2 { font-size: 1.5rem !important; }
          .blog-content h3 { font-size: 1.25rem !important; }
          .blog-content p { font-size: 1rem !important; line-height: 1.6 !important; }
        }
      `
      document.head.appendChild(mobileStyles)

      return () => {
        if (mobileStyles.parentNode) {
          mobileStyles.parentNode.removeChild(mobileStyles)
        }
      }
    }
  }, [isMobile])

  return (
    <>
      {children}
      {/* 移動端性能提示 */}
      {isMobile && isSlowConnection && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm z-50">
          <p>檢測到慢速網絡，已啟用省流量模式</p>
        </div>
      )}
    </>
  )
} 