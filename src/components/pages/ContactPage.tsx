'use client'

export default function ContactPage() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          聯絡我們
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
          無論您是想了解更多服務內容，或是有任何問題想詢問，都歡迎與我們聯繫。我們將在一個工作日內回覆您。
        </p>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">填寫諮詢表單</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="請輸入您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      職稱
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="請輸入您的職稱"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      電話
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="請輸入您的聯絡電話"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="請輸入您的 Email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    診所名稱
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="請輸入診所名稱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    諮詢項目
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">請選擇諮詢項目</option>
                    <option value="brand">品牌策略諮詢</option>
                    <option value="digital">數位行銷服務</option>
                    <option value="content">內容製作服務</option>
                    <option value="other">其他項目</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    諮詢內容
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={4}
                    placeholder="請簡述您想了解的內容"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  送出表單
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">聯絡資訊</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">地址</div>
                  <div className="text-gray-700">台北市信義區信義路五段7號</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">電話</div>
                  <div className="text-gray-700">02-2345-6789</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <div className="text-gray-700">contact@aidea.com.tw</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">營業時間</div>
                  <div className="text-gray-700">
                    週一至週五 09:00-18:00
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">為什麼選擇我們？</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">專業團隊</h3>
                    <p className="text-gray-600">
                      擁有豐富的牙醫行銷經驗
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">客製化服務</h3>
                    <p className="text-gray-600">
                      根據診所需求打造專屬方案
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">數據驅動決策</h3>
                    <p className="text-gray-600">
                      運用 AI 技術提供精準的市場分析與建議
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-primary-foreground rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">立即預約諮詢</h2>
              <p className="mb-6">
                填寫表單後，我們會在一個工作日內與您聯繫，為您安排最適合的諮詢時間。
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p>服務專線</p>
                  <p className="font-semibold">0800-888-888</p>
                </div>
                <button className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity">
                  立即撥打
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 