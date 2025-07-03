import { Metadata } from 'next'
import {
  FacebookLikeButton,
  FacebookComments,
  FacebookShareButton
} from '@/components/common'

export const metadata: Metadata = {
  title: 'Facebook 整合測試 | Aidea:Med',
  description: '測試 Facebook JavaScript SDK 整合功能',
  robots: {
    index: false,
    follow: false
  }
}

export default function FacebookTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Facebook JavaScript SDK 整合測試
          </h1>
          <p className="text-lg text-gray-600">
            測試各種 Facebook 社群外掛程式功能
          </p>
        </div>

        {/* Facebook Like Button 測試區 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Facebook 讚按鈕測試
          </h2>
          
          <div className="space-y-6">
            {/* 標準樣式 */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                標準樣式（包含分享和頭像）
              </h3>
              <div className="border border-gray-200 rounded p-4">
                <FacebookLikeButton
                  href="https://www.aideamed.com/"
                  width={450}
                  share={true}
                  showFaces={true}
                  layout="standard"
                />
              </div>
            </div>

            {/* 按鈕樣式 */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                按鈕樣式（僅按鈕）
              </h3>
              <div className="border border-gray-200 rounded p-4">
                <FacebookLikeButton
                  href="https://www.aideamed.com/"
                  layout="button"
                  share={false}
                  showFaces={false}
                  size="large"
                />
              </div>
            </div>

            {/* 計數樣式 */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                按鈕計數樣式
              </h3>
              <div className="border border-gray-200 rounded p-4">
                <FacebookLikeButton
                  href="https://www.aideamed.com/"
                  layout="button_count"
                  share={false}
                  showFaces={false}
                  size="medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Facebook Share Button 測試區 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Facebook 分享按鈕測試
          </h2>
          
          <div className="space-y-6">
            {/* 按鈕計數樣式 */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                分享按鈕（計數）
              </h3>
              <div className="border border-gray-200 rounded p-4">
                <FacebookShareButton
                  href="https://www.aideamed.com/"
                  layout="button_count"
                  size="large"
                />
              </div>
            </div>

            {/* 按鈕樣式 */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                分享按鈕（僅按鈕）
              </h3>
              <div className="border border-gray-200 rounded p-4">
                <FacebookShareButton
                  href="https://www.aideamed.com/"
                  layout="button"
                  size="medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Facebook Comments 測試區 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Facebook 留言外掛程式測試
          </h2>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              留言系統
            </h3>
            <div className="border border-gray-200 rounded p-4">
              <FacebookComments
                href="https://www.aideamed.com/"
                width="100%"
                numPosts={5}
                orderBy="social"
              />
            </div>
          </div>
        </div>

        {/* SDK 狀態檢查 */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            SDK 狀態檢查
          </h2>
          
          <div className="prose prose-blue">
            <p className="text-blue-700">
              如果上方的 Facebook 外掛程式正常顯示，表示 Facebook JavaScript SDK 已成功整合。
              如果沒有顯示，請檢查：
            </p>
            
            <ul className="text-blue-700 mt-4">
              <li>瀏覽器開發者工具的 Console 是否有錯誤訊息</li>
              <li>網路連線是否正常</li>
              <li>CSP (Content Security Policy) 設定是否正確</li>
              <li>Facebook SDK 是否成功載入</li>
            </ul>
          </div>
        </div>

        {/* 技術資訊 */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            技術資訊
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Facebook App 設定</h3>
              <ul className="space-y-1 text-gray-600">
                <li><strong>App ID:</strong> 1081823416607631</li>
                <li><strong>版本:</strong> v23.0</li>
                <li><strong>語言:</strong> en_US</li>
                <li><strong>XFBML:</strong> 啟用</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">功能狀態</h3>
              <ul className="space-y-1 text-gray-600">
                <li><strong>頁面檢視追蹤:</strong> 啟用</li>
                <li><strong>讚按鈕:</strong> 測試中</li>
                <li><strong>分享按鈕:</strong> 測試中</li>
                <li><strong>留言系統:</strong> 測試中</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 返回首頁按鈕 */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            返回首頁
          </a>
        </div>
      </div>
    </div>
  )
} 