import { caseMetadata } from '../metadata'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/common'

// 使用動態導入代替直接導入，增加加載提示
const CasePage = dynamic(() => import('@/components/pages/CasePage'), {
  loading: () => <CasePageSkeleton />,
  ssr: true // 確保服務器端渲染
})

// 骨架組件，顯示加載中的外觀
function CasePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 標題區域骨架 */}
        <div className="text-center mb-16">
          <div className="w-16 h-1 bg-gray-200 mx-auto mb-6 animate-pulse" />
          <div className="h-10 w-48 bg-gray-200 mx-auto mb-4 rounded animate-pulse" />
          <div className="h-6 w-96 bg-gray-200 mx-auto rounded animate-pulse" />
        </div>
        
        {/* 過濾器骨架 */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        
        {/* 案例卡片骨架 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-[16/9] bg-gray-200 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 錯誤處理組件
function CasePageError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          載入案例時發生錯誤
        </h2>
        <p className="text-gray-600 mb-8">
          {error.message || '請稍後再試或聯繫我們尋求協助'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          重新載入
        </button>
      </div>
    </div>
  )
}

export const metadata = caseMetadata

export default function Page() {
  return (
    <ErrorBoundary fallback={<CasePageError error={new Error()} reset={() => {}} />}>
      <Suspense fallback={<CasePageSkeleton />}>
        <CasePage />
      </Suspense>
    </ErrorBoundary>
  )
} 