'use client'

import { useEffect } from 'react'
import { initializeServiceWorkerFeatures } from '@/lib/sw-helpers'

/**
 * Service Worker 功能提供者
 * 負責初始化 PWA 功能、離線支援和性能監控
 */
export default function ServiceWorkerProvider() {
  useEffect(() => {
    // 在客戶端初始化 Service Worker 功能
    initializeServiceWorkerFeatures()
    
    // 請求通知權限（可選）
    if ('Notification' in window && Notification.permission === 'default') {
      // 延遲請求通知權限，避免打擾用戶
      setTimeout(() => {
        Notification.requestPermission().then(permission => {
          console.log('通知權限:', permission)
        })
      }, 10000) // 10 秒後請求
    }
  }, [])

  return null // 此組件不渲染任何內容
} 