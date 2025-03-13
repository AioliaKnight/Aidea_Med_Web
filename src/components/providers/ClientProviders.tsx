'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'
import PerformanceProvider from './PerformanceProvider'

// 常量配置
const TOAST_CONFIG = {
  NETWORK: {
    id: 'network-status',
    online: {
      duration: 2000,
      className: 'bg-green-50'
    },
    offline: {
      duration: Infinity,
      className: 'bg-red-50'
    }
  }
} as const

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const pathname = usePathname()

  // 頁面切換時重置滾動位置，使用 RAF 避免阻塞渲染
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    });
  }, [pathname])

  // 網路狀態處理函數
  const handleOffline = useCallback(() => {
    toast.error('網路已斷開', {
      id: TOAST_CONFIG.NETWORK.id,
      duration: TOAST_CONFIG.NETWORK.offline.duration,
      className: TOAST_CONFIG.NETWORK.offline.className
    })
  }, [])

  const handleOnline = useCallback(() => {
    toast.success('網路已連接', {
      id: TOAST_CONFIG.NETWORK.id,
      duration: TOAST_CONFIG.NETWORK.online.duration,
      className: TOAST_CONFIG.NETWORK.online.className
    })
  }, [])

  // 檢查網路狀態
  const checkNetworkStatus = useCallback(() => {
    if (!navigator.onLine) {
      handleOffline()
    }
  }, [handleOffline])

  // 監聽網路狀態 - 使用 deferTask 延遲執行
  useEffect(() => {
    // 預先檢查當前狀態
    checkNetworkStatus()

    // 監聽網路狀態變化
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 監聽頁面可見性變化
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkNetworkStatus()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      toast.dismiss(TOAST_CONFIG.NETWORK.id)
    }
  }, [checkNetworkStatus, handleOnline, handleOffline])

  return (
    <PerformanceProvider>
      {children}
    </PerformanceProvider>
  )
} 