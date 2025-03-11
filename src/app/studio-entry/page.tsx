'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { projectId, dataset, apiVersion } from '@/sanity/env'
import { client } from '@/lib/sanity/client'

export default function StudioEntryPage() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    async function checkConnection() {
      try {
        // 測試 Sanity 連接
        await client.fetch('*[_type == "post"][0]')
        setConnectionStatus('success')
      } catch (error) {
        setConnectionStatus('error')
        setErrorMessage(error instanceof Error ? error.message : '連接失敗')
      }
    }

    checkConnection()
  }, [])

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
                {connectionStatus === 'checking' && (
                  <span className="text-yellow-600">檢查中...</span>
                )}
                {connectionStatus === 'success' && (
                  <span className="text-green-600">已連接</span>
                )}
                {connectionStatus === 'error' && (
                  <span className="text-red-600">連接失敗: {errorMessage}</span>
                )}
              </li>
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