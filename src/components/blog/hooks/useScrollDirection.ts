'use client'

import { useState, useEffect } from 'react'

/**
 * 檢測滾動方向的共用 Hook
 * @param threshold 觸發滾動檢測的閾值（像素）
 * @returns 滾動方向：'up' | 'down' | null
 */
export const useScrollDirection = (threshold: number = 100) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>('up')
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        setScrollDirection('down')
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up')
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, threshold])

  return scrollDirection
} 