'use client'

export default function CasePage() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          成功案例分享
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
          透過專業的數位行銷策略，我們協助多家牙醫診所成功打造品牌形象、提升營收。以下是部分合作診所的實際成效。
        </p>

        {/* Featured Case Study */}
        <div className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-w-16 aspect-h-9 lg:aspect-none lg:h-full">
                <div className="w-full h-full bg-gray-200"></div>
              </div>
              <div className="p-8 lg:p-12">
                <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                  品牌重塑案例
                </div>
                <h2 className="text-3xl font-bold mb-6">微笑牙醫診所</h2>
                <div className="space-y-4 text-gray-600 mb-8">
                  <p>
                    從傳統診所到數位化品牌的成功轉型，透過整合性行銷策略，在短短 6 個月內實現：
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      新患預約成長 200%
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      社群追蹤者突破 5 萬
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      品牌知名度提升 300%
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      每月穩定回診率成長 50%
                    </li>
                  </ul>
                </div>
                <button className="text-primary font-semibold hover:underline">
                  查看完整案例 →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Case Study 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <div className="w-full h-full bg-gray-200"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold">康德牙醫診所</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  社群經營
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                透過專業的社群媒體經營與內容策略，3 個月內實現：
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">180%</div>
                  <div className="text-sm text-gray-600">預約轉換率</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">3萬+</div>
                  <div className="text-sm text-gray-600">社群互動</div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500">• 建立專業醫療內容庫</p>
                <p className="text-gray-500">• 優化社群互動策略</p>
                <p className="text-gray-500">• 提升品牌知名度</p>
              </div>
              <button className="mt-6 text-primary font-semibold hover:underline">
                查看詳細案例 →
              </button>
            </div>
          </div>

          {/* Case Study 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <div className="w-full h-full bg-gray-200"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold">恆美牙醫診所</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  品牌策略
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                全方位品牌升級與數位轉型，6 個月內達成：
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">250%</div>
                  <div className="text-sm text-gray-600">營收成長</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">90%</div>
                  <div className="text-sm text-gray-600">客戶滿意度</div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500">• 品牌識別系統重塑</p>
                <p className="text-gray-500">• 服務流程優化</p>
                <p className="text-gray-500">• 數位預約系統建置</p>
              </div>
              <button className="mt-6 text-primary font-semibold hover:underline">
                查看詳細案例 →
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">
            想要成為下一個成功案例嗎？
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            立即與我們聯繫，讓我們為您的診所打造專屬的數位行銷策略。
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity">
              免費諮詢
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-primary transition-all">
              了解服務方案
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 