'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { projectId, dataset, apiVersion } from '@/sanity/env'
import { client, handleSanityError } from '@/lib/sanity/client'

export default function StudioEntryPage() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({})
  const [isRetrying, setIsRetrying] = useState<boolean>(false)

  useEffect(() => {
    async function checkConnection() {
      try {
        // 收集環境信息
        const envInfo = {
          projectId,
          dataset,
          apiVersion,
          nodeEnv: process.env.NODE_ENV,
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com',
        }
        
        setDebugInfo(envInfo)
        
        // 首先使用健康檢查 API 測試連接
        try {
          const healthResponse = await fetch('/api/sanity-check')
          if (healthResponse.ok) {
            const healthData = await healthResponse.json()
            // 只在開發環境中記錄日誌
            if (process.env.NODE_ENV === 'development') {
              console.log("Sanity 健康檢查結果:", healthData)
            }
            
            if (healthData.status === 'ok') {
              setConnectionStatus('success')
              setErrorMessage('')
              return
            }
          }
        } catch (healthError) {
          // 健康檢查失敗，繼續嘗試直接連接
          if (process.env.NODE_ENV === 'development') {
            console.warn("Sanity 健康檢查失敗，嘗試直接連接:", healthError)
          }
        }
        
        // 嘗試直接使用 Sanity 客戶端
        // 使用非常簡單的查詢確保最大可能性的成功
        const result = await client.fetch('*[_type == "post"][0..1]{ _id, title }')
        
        // 只在開發環境中記錄日誌
        if (process.env.NODE_ENV === 'development') {
          console.log("Sanity 直接連接成功:", result)
        }
        
        setConnectionStatus('success')
        setErrorMessage('')
        
      } catch (error) {
        // 只在開發環境中記錄錯誤
        if (process.env.NODE_ENV === 'development') {
          console.error("Sanity 連接錯誤:", error)
        }
        
        setConnectionStatus('error')
        
        // 使用處理 Sanity 錯誤的輔助函數
        if (typeof handleSanityError === 'function') {
          setErrorMessage(handleSanityError(error))
        } else {
          setErrorMessage(error instanceof Error ? error.message : '連接失敗')
        }
      }
    }

    checkConnection()
  }, [])

  async function retryConnection() {
    setIsRetrying(true)
    setConnectionStatus('loading')
    setErrorMessage('')
    
    try {
      // 清除快取 (如果瀏覽器支援)
      if (typeof window !== 'undefined' && 'caches' in window) {
        try {
          // 嘗試清除 API 快取
          const cache = await caches.open('next-data')
          await cache.delete('/api/sanity-check')
          
          if (process.env.NODE_ENV === 'development') {
            console.log('已清除 API 快取')
          }
        } catch (cacheError) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('清除快取失敗:', cacheError)
          }
        }
      }
      
      // 直接獲取最新的 Sanity 健康檢查
      const response = await fetch('/api/sanity-check?t=' + new Date().getTime(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      const data = await response.json()
      
      if (data.status === 'ok') {
        setConnectionStatus('success')
        setErrorMessage('')
        setDebugInfo(prev => ({
          ...prev,
          lastCheck: new Date().toISOString(),
          checkResult: data
        }))
      } else {
        throw new Error(data.message || '連接失敗')
      }
    } catch (error) {
      setConnectionStatus('error')
      if (typeof handleSanityError === 'function') {
        setErrorMessage(handleSanityError(error))
      } else {
        setErrorMessage(error instanceof Error ? error.message : '連接重試失敗')
      }
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="mr-4">
            <Image 
              src="/logo-r.png"
              alt="Aidea:Med Logo"
              width={120}
              height={60}
              className="object-contain"
            />
          </div>
          <div className="h-10 w-px bg-gray-300 mx-4"></div>
          <div className="ml-4">
            <Image 
              src="https://cdn.sanity.io/images/3do82whm/next/dcc78cfa8bde2b1709b5bf0bd7398186ea3b3c2b-1000x750.png"
              alt="Sanity Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center text-blue-800">Sanity Studio 整合</h1>
        <p className="text-gray-600 mb-6 text-center">
          Aidea:Med 的內容管理系統
        </p>

        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">專案資訊</h2>
            <ul className="space-y-2 text-gray-700">
              <li><span className="font-medium">專案 ID:</span> {projectId || '未設定'}</li>
              <li><span className="font-medium">資料集:</span> {dataset}</li>
              <li><span className="font-medium">API 版本:</span> {apiVersion}</li>
              <li>
                <span className="font-medium">連接狀態: </span>
                {connectionStatus === 'loading' && (
                  <span className="text-yellow-600">檢查中...</span>
                )}
                {connectionStatus === 'success' && (
                  <span className="text-green-600">已連接</span>
                )}
                {connectionStatus === 'error' && (
                  <span className="text-red-600">連接失敗: {errorMessage}</span>
                )}
              </li>
              {debugInfo && connectionStatus === 'error' && (
                <li className="mt-2 p-2 bg-gray-100 rounded text-xs">
                  <details>
                    <summary className="cursor-pointer font-medium text-gray-700">診斷資訊</summary>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </details>
                </li>
              )}
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-800 mb-2">可用功能</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ 文章管理</li>
              <li>✓ 分類管理</li>
              <li>✓ 媒體庫</li>
              <li>✓ 即時預覽</li>
              <li>✓ 版本控制</li>
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">注意事項</h2>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              <li>請確保您有適當的權限訪問 Studio</li>
              <li>建議使用最新版本的瀏覽器</li>
              <li>所有更改都會即時保存</li>
              <li>大型媒體文件上傳可能需要較長時間</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">連接狀態: {
            connectionStatus === 'loading' ? '檢查中...' :
            connectionStatus === 'success' ? '連接成功' :
            '連接失敗'
          }</h2>
          
          {connectionStatus === 'error' && errorMessage && (
            <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              <p className="font-medium">錯誤信息:</p>
              <p className="whitespace-pre-line">{errorMessage}</p>
            </div>
          )}
          
          {connectionStatus === 'success' && (
            <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
              <p>成功連接到 Sanity CMS! 您現在可以繼續進入 Studio。</p>
            </div>
          )}
          
          <div className="mt-4 flex space-x-4">
            <button
              onClick={retryConnection}
              disabled={isRetrying}
              className={`px-4 py-2 rounded-md ${
                isRetrying 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRetrying ? '重試中...' : '重新檢查連接'}
            </button>
            
            {connectionStatus === 'success' && (
              <a 
                href="/studio"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                繼續進入 Studio
              </a>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <details className="bg-gray-50 p-4 rounded-lg">
            <summary className="font-medium cursor-pointer">診斷資訊</summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>

        <div className="flex flex-col space-y-4">
          <Link
            href="/studio/desk"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition-colors"
          >
            進入 Studio
          </Link>
          <a 
            href={`https://www.sanity.io/manage/project/${projectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg text-center transition-colors"
          >
            管理專案設定
          </a>
          <Link
            href="/blog"
            className="w-full py-3 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold rounded-lg text-center transition-colors"
          >
            查看部落格
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>
            需要協助？請查看{' '}
            <a 
              href="https://www.sanity.io/docs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Sanity 文件
            </a>
            {' '}或聯繫技術支援
          </p>
        </div>
      </div>
    </div>
  )
} 