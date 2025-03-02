import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-extrabold text-primary">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">頁面未找到</h2>
          <p className="mt-2 text-lg text-gray-600">
            抱歉，您請求的頁面不存在。
          </p>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-primary hover:text-primary-dark font-medium">
            ← 返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
} 