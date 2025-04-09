import { caseMetadata } from '../metadata'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { ErrorBoundary, CaseErrorBoundary } from '@/components/common'
import { organizationSchema } from '../metadata'

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

export const metadata = caseMetadata

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="animate-fadeIn">
        <CaseErrorBoundary>
          <Suspense fallback={<CasePageSkeleton />}>
            <CasePage />
          </Suspense>
        </CaseErrorBoundary>
      </div>
      
      {/* 添加組織結構化數據以支持案例列表頁的SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </div>
  )
} 