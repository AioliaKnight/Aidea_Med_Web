import { Suspense } from 'react'
import Loading from '@/components/common/Loading'

// 模擬異步數據獲取
async function getData() {
  await new Promise(resolve => setTimeout(resolve, 3000))
  return {
    message: '載入完成！'
  }
}

// 異步組件
async function AsyncComponent() {
  const data = await getData()
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-medium tracking-wide text-slate-900 dark:text-slate-100">
        {data.message}
      </h1>
    </div>
  )
}

// 展示不同主題的載入動畫
function LoadingDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="relative h-[320px] rounded-lg bg-white dark:bg-slate-900 shadow-sm">
        <Loading
          text="Slate 主題"
          size="md"
          theme="slate"
          className="absolute inset-0"
        />
      </div>
      <div className="relative h-[320px] rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
        <Loading
          text="Zinc 主題"
          size="md"
          theme="zinc"
          className="absolute inset-0"
        />
      </div>
      <div className="relative h-[320px] rounded-lg bg-white dark:bg-neutral-900 shadow-sm">
        <Loading
          text="Neutral 主題"
          size="md"
          theme="neutral"
          className="absolute inset-0"
        />
      </div>
    </div>
  )
}

export default function TestLoadingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 space-y-8">
      <Suspense
        fallback={
          <Loading
            fullscreen
            text="載入中..."
            blur
            size="md"
            theme="slate"
            background="bg-white/80 dark:bg-slate-950/80"
          />
        }
      >
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">載入動畫測試頁面</h1>
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-6">主題展示</h2>
              <LoadingDemo />
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-6">異步載入測試</h2>
              <Suspense
                fallback={
                  <Loading
                    text="載入資料中..."
                    size="md"
                    theme="slate"
                    className="py-12"
                  />
                }
              >
                <AsyncComponent />
              </Suspense>
            </section>
          </div>
        </div>
      </Suspense>
    </div>
  )
} 