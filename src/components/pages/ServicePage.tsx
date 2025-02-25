'use client'

export default function ServicePage() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          專業服務項目
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
          我們提供全方位的牙醫診所行銷解決方案，從品牌策略到數位行銷，協助您的診所在競爭市場中脫穎而出。
        </p>

        {/* Core Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Service 1: Brand Strategy */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">品牌策略規劃</h3>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li>• 品牌定位與識別</li>
              <li>• 目標客群分析</li>
              <li>• 競爭優勢分析</li>
              <li>• 診所環境空間規劃</li>
              <li>• 服務流程優化建議</li>
            </ul>
            <p className="text-sm text-gray-500 mb-4">
              建立獨特的診所品牌形象，提升市場競爭力
            </p>
            <button className="text-primary font-semibold hover:underline">
              了解更多 →
            </button>
          </div>

          {/* Service 2: Digital Marketing */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">數位行銷整合</h3>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li>• Google/Meta 廣告投放</li>
              <li>• SEO 搜尋引擎優化</li>
              <li>• 社群媒體行銷策略</li>
              <li>• 內容行銷規劃</li>
              <li>• 成效追蹤與優化</li>
            </ul>
            <p className="text-sm text-gray-500 mb-4">
              全方位數位行銷策略，提升診所線上能見度
            </p>
            <button className="text-primary font-semibold hover:underline">
              了解更多 →
            </button>
          </div>

          {/* Service 3: Content Creation */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">專業內容製作</h3>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li>• 診所環境攝影</li>
              <li>• 醫療團隊形象照</li>
              <li>• 衛教影片製作</li>
              <li>• 社群內容設計</li>
              <li>• 3D 診所環境建模</li>
            </ul>
            <p className="text-sm text-gray-500 mb-4">
              高質量的視覺內容，展現診所專業形象
            </p>
            <button className="text-primary font-semibold hover:underline">
              了解更多 →
            </button>
          </div>
        </div>

        {/* Service Process */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">服務流程</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">需求訪談</h3>
              <p className="text-gray-600">
                深入了解診所現況與目標
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">方案規劃</h3>
              <p className="text-gray-600">
                客製化行銷策略提案
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">執行優化</h3>
              <p className="text-gray-600">
                專業團隊執行並持續監測調整
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">成效報告</h3>
              <p className="text-gray-600">
                定期提供詳細數據分析報告
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">服務方案</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-4">基礎方案</h3>
              <div className="text-4xl font-bold mb-4">
                <span className="text-primary">$15,000</span>
                <span className="text-sm text-gray-500 font-normal">/月</span>
              </div>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• 社群媒體經營</li>
                <li>• 每月 12 篇貼文</li>
                <li>• 基礎成效報告</li>
                <li>• 每週互動維護</li>
              </ul>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-full font-semibold hover:opacity-90 transition-opacity">
                選擇方案
              </button>
            </div>
            <div className="bg-primary text-primary-foreground rounded-lg p-8 transform scale-105">
              <div className="inline-block px-4 py-1 bg-white text-primary rounded-full text-sm font-semibold mb-4">
                最受歡迎
              </div>
              <h3 className="text-2xl font-semibold mb-4">進階方案</h3>
              <div className="text-4xl font-bold mb-4">
                <span>$25,000</span>
                <span className="text-sm font-normal">/月</span>
              </div>
              <ul className="space-y-2 mb-8">
                <li>• 社群媒體全管理</li>
                <li>• 每月 20 篇貼文</li>
                <li>• 廣告投放服務</li>
                <li>• 每週成效報告</li>
                <li>• 24/7 專人服務</li>
              </ul>
              <button className="w-full bg-white text-primary py-2 rounded-full font-semibold hover:opacity-90 transition-opacity">
                選擇方案
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-4">客製方案</h3>
              <div className="text-4xl font-bold mb-4">
                <span className="text-primary">聯繫洽詢</span>
              </div>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li>• 品牌策略規劃</li>
                <li>• 全方位行銷服務</li>
                <li>• 客製化執行方案</li>
                <li>• 一對一專屬服務</li>
              </ul>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-full font-semibold hover:opacity-90 transition-opacity">
                預約諮詢
              </button>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">
            開始您的診所數位轉型之旅
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            立即與我們聯繫，了解如何為您的診所打造最適合的行銷策略
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity">
              預約免費諮詢
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-primary transition-all">
              索取服務說明
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 