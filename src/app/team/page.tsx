import { teamMetadata } from '../metadata'
import TeamPage from '@/components/pages/TeamPage'
import { createFaqSchema } from '../metadata'
import { SEOOptimizer } from '@/components/common'

export const metadata = teamMetadata

// 為團隊頁面添加結構化FAQ數據
const teamFaqData = [
  {
    question: 'Aidea:Med團隊有什麼專業背景？',
    answer: '我們的團隊由專業牙醫診所行銷顧問、數位行銷專家、UI/UX設計師、內容創作者與技術開發人員組成。成員具有多年牙科與醫療產業經驗，深入了解牙醫診所的營運模式與市場需求，能為植牙、矯正、美白等各類牙醫診所提供精準的行銷策略與執行方案。'
  },
  {
    question: '如何與Aidea:Med團隊合作？',
    answer: '與我們合作的流程簡單而高效：首先，您可以透過聯絡頁面或電話與我們預約免費諮詢；接著，我們會進行深度需求診斷，了解您牙醫診所的獨特需求與挑戰；然後，我們會提供客製化的行銷方案與報價；一旦確認合作，我們會建立專屬項目團隊，定期溝通與調整，確保行銷策略有效執行並達成目標。'
  },
  {
    question: '團隊能為牙醫診所提供哪些行銷支援？',
    answer: '我們提供全方位的牙醫診所行銷支援，包括牙醫品牌策略規劃、診所視覺識別設計、牙醫專業網站開發與優化、牙科診所SEO/SEM服務、牙醫社群媒體經營、口腔健康內容行銷、牙醫診所口碑管理、牙醫師個人品牌建立、植牙與美白療程的數位廣告投放、以及牙醫診所的行銷自動化系統建置等。我們根據每家牙醫診所的獨特定位與目標患者群，提供客製化的服務組合。'
  },
  {
    question: '貴團隊如何協助牙醫診所提升網路曝光度？',
    answer: '我們運用多管道行銷策略提升牙醫診所的網路曝光度：首先，透過牙醫診所SEO優化，確保您的網站在相關搜尋中獲得良好排名；其次，規劃精準的牙科Google Ads與社群廣告，觸及潛在患者；再者，建立專業的牙醫診所社群媒體形象，持續分享口腔健康知識；此外，我們協助診所經營牙醫專業部落格，建立專業權威；最後，發展牙醫診所的口碑與評價管理系統，提升患者信任度。這些策略共同作用，全面提升診所的線上能見度。'
  },
  {
    question: '你們的團隊如何協助提高牙醫診所的自費診療項目轉換率？',
    answer: '我們採用多重策略提高牙醫診所自費項目的轉換率：首先，設計明確的植牙、美白、矯正等自費項目價值傳達策略，透過視覺化內容與真實案例展示療效；其次，開發專屬牙醫診所的患者教育內容與轉換漏斗，幫助患者理解自費項目的價值；再者，建立客製化的實體與線上諮詢流程，提升患者體驗；此外，設計特定療程的限時促銷活動與會員專屬優惠，刺激決策；最後，建立療程前後的完整溝通管道，使患者感受到充分的支持與關懷。透過這些精心規劃的策略，有效提升自費診療項目的轉換率。'
  },
  {
    question: '你們如何針對不同專科牙醫診所提供客製化行銷方案？',
    answer: '我們深知每種牙科專科（如植牙、矯正、兒童牙科、牙周專科等）有其獨特市場與患者群。我們的客製化流程包括：首先，進行專科市場研究與診所定位分析；接著，根據專科特性設定目標患者族群並分析其行為模式；然後，制定專科特色的品牌核心訊息與視覺識別；再者，選擇最適合該專科的行銷渠道組合；最後，設計符合專科特性的轉換策略與患者體驗流程。例如，植牙專科診所需要重視中高齡患者的接觸點，而矯正專科則需要更加注重社群媒體與年輕族群溝通。我們的方案會根據專科特性量身打造，確保行銷資源獲得最佳運用。'
  }
]

// 建立結構化資料，為確保唯一性加入 ID
const teamFaqSchema = createFaqSchema(teamFaqData, {
  id: 'https://www.aideamed.com/team#faq',
  datePublished: '2024-01-15',
  lastReviewed: '2024-07-04',
  languageCode: 'zh-TW'
})

export default function Page() {
  return (
    <>
      <SEOOptimizer
        title="專業醫療行銷團隊"
        description="認識我們由醫療行銷專家、數位策略師、創意總監組成的專業團隊"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          '@id': 'https://www.aideamed.com/team#about',
          mainEntity: {
            '@type': 'Organization',
            '@id': 'https://www.aideamed.com#organization',
            name: 'Aidea:Med 醫療行銷顧問',
            description: '專業醫療行銷團隊，提供醫療機構全方位品牌策略與數位行銷解決方案',
            url: 'https://www.aideamed.com',
            foundingDate: '2020',
            numberOfEmployees: {
              '@type': 'QuantitativeValue',
              value: 6
            },
            employee: [
              {
                '@type': 'Person',
                name: '陳維鈞 Wilson',
                jobTitle: '創辦人暨策略總監',
                description: '擁有十五年以上醫療行銷經驗，專精於醫療品牌策略與患者體驗設計'
              },
              {
                '@type': 'Person',
                name: 'Mike',
                jobTitle: '數位行銷總監',
                description: '數位行銷專家，擅長醫療機構網站優化與精準投放策略'
              },
              {
                '@type': 'Person',
                name: 'Leo',
                jobTitle: '創意內容總監',
                description: '資深醫療內容策略專家，擅長將複雜的醫療專業知識轉化為患者易懂的內容'
              },
              {
                '@type': 'Person',
                name: 'Chloe',
                jobTitle: '業務發展總監',
                description: '資深醫療業務專家，專注於醫療機構客戶關係管理與業務策略'
              },
              {
                '@type': 'Person',
                name: 'Queena',
                jobTitle: '顧客體驗總監',
                description: '專注於醫療顧客體驗與患者忠誠度系統建立'
              },
              {
                '@type': 'Person',
                name: '西裝哥',
                jobTitle: '技術開發總監',
                description: '資深醫療科技專家，專精於醫療機構數位轉型與患者體驗優化'
              }
            ],
            hasCredential: [
              {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'Professional Experience',
                recognizedBy: {
                  '@type': 'Organization',
                  name: 'Healthcare Marketing Industry'
                },
                description: '平均15年醫療行銷經驗，已協助70+醫療機構成功轉型'
              }
            ],
            award: [
              '客戶滿意度達95%以上',
              '平均提升45%以上新患者轉換率',
              '整合AI技術優化行銷效能'
            ]
          }
        }}
      />
      
      <TeamPage />
      
      {/* 插入團隊FAQ的結構化數據 - 使用唯一ID避免重複 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamFaqSchema) }}
      />
    </>
  )
} 