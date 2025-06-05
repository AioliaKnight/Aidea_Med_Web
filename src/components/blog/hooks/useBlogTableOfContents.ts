'use client'

/**
 * Blog 目錄功能統一 Hook
 * 集中管理目錄解析、滾動定位、進度追蹤等功能
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { generateHeadingId } from '@/lib/blog-utils'
import { TocItem, BLOG_CONFIG } from '../types'

interface UseBlogTableOfContentsProps {
  content: string
}

interface UseBlogTableOfContentsReturn {
  // 目錄相關
  tocItems: TocItem[]
  activeId: string
  isVisible: boolean
  
  // 閱讀進度
  readingProgress: number
  estimatedReadTime: number
  
  // 功能函數
  scrollToHeading: (id: string) => void
  
  // Refs
  observerRef: React.MutableRefObject<IntersectionObserver | null>
}

export const useBlogTableOfContents = ({ content }: UseBlogTableOfContentsProps): UseBlogTableOfContentsReturn => {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [estimatedReadTime, setEstimatedReadTime] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 解析內容並生成目錄
  useEffect(() => {
    const timer = setTimeout(() => {
      // 直接從 DOM 中獲取已渲染的標題元素
      const headings = document.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6')
      
      const items: TocItem[] = []
      
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        const title = heading.textContent?.trim() || ''
        
        // 跳過太短的標題
        if (title.length < BLOG_CONFIG.MIN_HEADING_LENGTH) return
        
        // 生成唯一ID
        const id = generateHeadingId(title, index)
        
        // 如果標題還沒有 ID，設置它
        if (!heading.id) {
          heading.id = id
          // 添加滾動偏移樣式
          if (heading instanceof HTMLElement) {
            heading.style.scrollMarginTop = BLOG_CONFIG.SCROLL_MARGIN_TOP
          }
        }
        
        items.push({
          id: heading.id || id,
          title,
          level,
          element: heading as HTMLElement
        })
      })
      
      setTocItems(items)
      
      // 調試信息
      if (process.env.NODE_ENV === 'development') {
        // console.log('目錄項目:', items)
        // console.log('找到的標題元素:', headings.length)
      }
      
      // 計算預估閱讀時間
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')
      const textContent = doc.body.textContent || ''
      const wordCount = textContent.length
      const readTime = Math.ceil(wordCount / BLOG_CONFIG.READING_SPEED_WPM)
      setEstimatedReadTime(readTime)
    }, BLOG_CONFIG.TOC_DELAY)
    
    return () => clearTimeout(timer)
  }, [content])

  // 設置 Intersection Observer 來追蹤當前可見的標題
  useEffect(() => {
    if (typeof window === 'undefined' || tocItems.length === 0) return

    const headingElements = tocItems.map(item => {
      const element = document.getElementById(item.id)
      return { ...item, element }
    }).filter(item => item.element)

    if (headingElements.length === 0) return

    // 清理之前的 observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // 創建新的 observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting)
        
        if (visibleEntries.length > 0) {
          // 找到最靠近頂部的可見標題
          const topEntry = visibleEntries.reduce((prev, current) => {
            return prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current
          })
          
          setActiveId(topEntry.target.id)
        }
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    )

    // 觀察所有標題元素
    headingElements.forEach(item => {
      if (item.element) {
        observerRef.current?.observe(item.element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [tocItems])

  // 追蹤閱讀進度
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((scrollTop / docHeight) * 100, 100)
      setReadingProgress(progress)
      
      // 當滾動超過一定距離時顯示目錄
      setIsVisible(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 點擊目錄項目滾動到對應位置
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // 使用 scrollIntoView 以獲得更好的滾動體驗
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
      
      // 更新 URL hash（可選）
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`)
      }
    }
  }, [])

  return {
    // 目錄相關
    tocItems,
    activeId,
    isVisible,
    
    // 閱讀進度
    readingProgress,
    estimatedReadTime,
    
    // 功能函數
    scrollToHeading,
    
    // Refs
    observerRef
  }
} 