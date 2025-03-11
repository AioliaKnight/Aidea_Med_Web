import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">找不到頁面</h1>
          <p className="text-lg text-gray-600 mb-8">
            很抱歉，您所尋找的頁面不存在或已被移除。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              返回部落格首頁
            </Link>
            <Link
              href="/"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"
            >
              返回網站首頁
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 