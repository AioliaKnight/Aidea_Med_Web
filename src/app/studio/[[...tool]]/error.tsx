'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Sanity Studio Error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Sanity Studio 發生錯誤
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || '載入 Sanity Studio 時發生錯誤。請稍後再試。'}
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            重試
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-center"
          >
            返回首頁
          </Link>
          <a
            href="https://www.sanity.io/manage"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-center"
          >
            前往 Sanity 管理頁面
          </a>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-gray-500">
            錯誤代碼: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
} 