'use client'

/**
 * Sanity Studio 連接頁面
 */

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// 動態導入 SanityFetch 組件，避免服務器端渲染問題
const SanityFetch = dynamic(() => import('../components/SanityFetch'), {
  ssr: false,
  loading: () => (
    <div className="p-4 bg-gray-100 rounded-lg animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
})

export default function StudioPage() {
  // 環境變數
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0xftlo5k'
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-25'

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
              <li><span className="font-medium">專案 ID:</span> {projectId}</li>
              <li><span className="font-medium">資料集:</span> {dataset}</li>
              <li><span className="font-medium">API 版本:</span> {apiVersion}</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-800 mb-2">內容模型</h2>
            <ul className="space-y-2 text-gray-700">
              <li><span className="font-medium">文章 (Post):</span> 部落格文章，包含標題、內容、分類等</li>
              <li><span className="font-medium">分類 (Category):</span> 文章分類，用於組織和篩選文章</li>
            </ul>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Sanity 連接測試</h2>
            <SanityFetch />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <a 
            href={`https://${projectId}.sanity.studio/`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition-colors"
          >
            前往 Sanity Studio
          </a>
          <a 
            href="https://www.sanity.io/manage"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg text-center transition-colors"
          >
            管理 Sanity 專案
          </a>
          <Link
            href="/blog"
            className="w-full py-3 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold rounded-lg text-center transition-colors"
          >
            查看部落格內容
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>如需協助，請聯繫您的開發團隊或查閱 <a href="https://www.sanity.io/docs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sanity 文件</a></p>
        </div>
      </div>
    </div>
  )
} 