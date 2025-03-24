import { caseMetadata } from '../metadata'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// 使用動態導入代替直接導入，增加加載提示
const CasePage = dynamic(() => import('@/components/pages/CasePage'), {
  loading: () => <CasePageSkeleton />,
  ssr: true // 確保服務器端渲染
})

// 骨架組件，顯示加載中的外觀
function CasePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6 pb-10">
          <div className="w-60 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="w-96 h-6 bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden h-[420px]">
              <div className="w-full h-56 bg-gray-300 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata = caseMetadata

export default function Page() {
  return (
    <Suspense fallback={<CasePageSkeleton />}>
      <CasePage />
    </Suspense>
  )
} 