'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'

interface ScrollContextType {
  scrollProgress: number
  showScrollPrompt: boolean
  lenis: Lenis | null
}

const ScrollContext = createContext<ScrollContextType>({
  scrollProgress: 0,
  showScrollPrompt: true,
  lenis: null,
})

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollPrompt, setShowScrollPrompt] = useState(true)
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    // 初始化 Lenis
    const lenisInstance = new Lenis({
      duration: 1.2,
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    setLenis(lenisInstance)

    // RAF 循環
    function raf(time: number) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // 滾動處理
    function handleScroll() {
      // 計算滾動進度
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = (window.scrollY / totalHeight) * 100
      setScrollProgress(currentProgress)

      // 控制滾動提示顯示
      setShowScrollPrompt(window.scrollY < 100)
    }

    lenisInstance.on('scroll', handleScroll)

    return () => {
      lenisInstance.destroy()
    }
  }, [])

  return (
    <ScrollContext.Provider value={{ scrollProgress, showScrollPrompt, lenis }}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScroll() {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider')
  }
  return context
} 