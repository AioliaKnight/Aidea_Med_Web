'use client'

import { useEffect, useState } from 'react'
import { useLoading } from '@/contexts/LoadingContext'
import Hero from '@/components/sections/Hero'
import Cases from '@/components/sections/Cases'
import Team from '@/components/sections/Team'
import Contact from '@/components/sections/Contact'
import Marketing from '@/components/sections/Marketing'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { showLoading, hideLoading } = useLoading()

  useEffect(() => {
    setMounted(true)
    showLoading()
    
    // 設定延遲以展示載入動畫
    const timer = setTimeout(() => {
      hideLoading()
    }, 2000)

    return () => clearTimeout(timer)
  }, [showLoading, hideLoading])

  if (!mounted) return null

  return (
    <main className="min-h-screen">
      <Hero />
      <Marketing />
      <Cases />
      <Team />
      <Contact />
    </main>
  )
} 