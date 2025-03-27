'use client'

import { useEffect } from 'react'
import { homeMetadata } from './metadata'
import HomePage from '@/components/pages/HomePage'
import { trackPageView } from '@/lib/analytics'

export const metadata = homeMetadata

export default function Home() {
  // 追蹤首頁瀏覽
  useEffect(() => {
    trackPageView('首頁', '/')
  }, [])
  
  return <HomePage />
} 