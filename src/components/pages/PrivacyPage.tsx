import React from 'react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">隱私權政策</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-gray-600 mb-8">
            最後更新日期：2024年5月15日
          </p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">1. 前言</h2>
            <p>
              Aidea:Med（以下簡稱「我們」、「本公司」）非常重視您的隱私權。本隱私權政策旨在說明我們如何收集、使用、披露及保護您在使用我們的網站和服務時所提供的個人資料。請您在使用我們的服務前，仔細閱讀本隱私權政策。
            </p>
            <p>
              當您使用我們的網站（https://www.aideamed.com）及相關服務時，即表示您同意本隱私權政策中描述的資料處理方式。如您不同意本政策的任何部分，請勿使用我們的服務。
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">2. 我們收集的資料</h2>
            <p>我們可能會收集以下類型的資料：</p>
            <h3 className="text-xl font-medium mt-6 mb-3">2.1 您主動提供的資料</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>聯絡資訊：包括姓名、電子郵件地址、電話號碼、公司/診所名稱</li>
              <li>帳戶資訊：註冊帳號時提供的資料</li>
              <li>服務相關資訊：您在使用我們的顧問服務過程中提供的業務資訊</li>
              <li>諮詢和通訊內容：透過表單、電子郵件或其他方式與我們溝通的內容</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-6 mb-3">2.2 自動收集的資料</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>裝置資訊：IP位址、裝置類型、瀏覽器類型及設定</li>
              <li>使用資訊：瀏覽歷史、點擊行為、瀏覽時間</li>
              <li>位置資訊：根據您的IP位址獲取的大致位置</li>
              <li>Cookie及類似技術收集的資訊</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">3. 我們如何使用您的資料</h2>
            <p>我們使用收集到的資料用於以下目的：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>提供、維護及改進我們的服務</li>
              <li>處理您的諮詢及回應您的請求</li>
              <li>向您發送與服務相關的通知及更新</li>
              <li>在獲得您同意的情況下，向您發送行銷及推廣訊息</li>
              <li>分析網站流量及使用情況以優化用戶體驗</li>
              <li>維護網站安全並預防詐騙活動</li>
              <li>遵守法律義務及保護我們的合法權益</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">4. 資料的分享與披露</h2>
            <p>我們不會出售或出租您的個人資料給第三方。在以下情況下，我們可能會分享您的資料：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>服務提供商：我們與幫助提供服務的第三方供應商合作（如網站託管、電子郵件服務、分析工具提供商）</li>
              <li>經您同意：在您明確同意的情況下</li>
              <li>法律要求：當法律要求或為了保護我們的合法權益時</li>
              <li>業務轉讓：如果我們的業務被合併、收購或資產轉讓，您的資料可能成為轉讓資產的一部分</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">5. Cookie及追蹤技術</h2>
            <p>
              我們使用Cookie及類似技術來收集和存儲有關您訪問我們網站的資訊。Cookie是小型文本文件，存儲在您的設備上。我們使用Cookie來：
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>記住您的偏好設定</li>
              <li>了解並分析網站流量</li>
              <li>追蹤網站使用情況以進行優化</li>
              <li>提供個人化的體驗</li>
            </ul>
            <p>
              您可以透過瀏覽器設定控制或刪除Cookie。但請注意，禁用Cookie可能會影響網站的某些功能。
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">6. 資料安全</h2>
            <p>
              我們採取合理的技術和組織措施來保護您的個人資料不被未經授權的存取、使用或披露。雖然我們致力於保護您的資料安全，但請理解互聯網傳輸沒有任何系統是完全安全的。
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">7. 資料保存</h2>
            <p>
              我們僅在實現本隱私權政策中所述目的所需的時間內保存您的個人資料，除非法律要求或允許更長的保存期限。
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">8. 您的權利</h2>
            <p>根據適用的資料保護法律，您可能擁有以下權利：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>存取權：獲取有關我們處理您個人資料的信息</li>
              <li>更正權：要求更正不准確的個人資料</li>
              <li>刪除權：在某些情況下要求刪除您的個人資料</li>
              <li>限制處理權：在某些情況下限制我們處理您資料的方式</li>
              <li>資料可攜權：以結構化、常用的格式接收您的資料</li>
              <li>反對權：基於您特定情況反對處理您的個人資料</li>
            </ul>
            <p>
              如您希望行使這些權利，請透過以下聯絡方式與我們聯繫。
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">9. 兒童隱私</h2>
            <p>
              我們的服務不針對16歲以下的兒童。我們不會故意收集16歲以下兒童的個人資料。如果您是父母或監護人，並相信您的孩子向我們提供了個人資料，請立即與我們聯繫。
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">10. 第三方連結</h2>
            <p>
              我們的網站可能包含指向第三方網站或服務的連結。我們對這些第三方的隱私權實踐或內容不負責任。我們建議您在離開我們的網站時閱讀每個訪問網站的隱私權政策。
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">11. 隱私權政策的變更</h2>
            <p>
              我們可能會不時更新本隱私權政策。我們會在網站上發布更新後的政策，並在政策頂部更新「最後更新日期」。對於重大變更，我們可能會通過電子郵件或網站通知提醒您。我們鼓勵您定期查閱本政策以了解最新資訊。
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">12. 聯絡我們</h2>
            <p>
              如果您對本隱私權政策有任何疑問、意見或請求，請透過以下方式與我們聯繫：
            </p>
            <ul className="list-none mb-4">
              <li>電子郵件：contact@aideamed.com</li>
              <li>電話：+886-2-27488919</li>
              <li>地址：台北市大安區敦化南路二段99號13樓</li>
            </ul>
          </section>
          
          <div className="mt-12 border-t pt-8">
            <p className="text-gray-600 text-sm">
              本隱私權政策的中文版本與其他語言版本間如有歧義，概以中文版本為準。
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  )
} 