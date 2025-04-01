import { teamMetadata } from '../metadata'
import TeamPage from '@/components/pages/TeamPage'
import { BreadcrumbNav } from '@/components/common'
import { createFaqSchema } from '../metadata'

export const metadata = teamMetadata

// 為團隊頁面添加結構化FAQ數據
const teamFaqSchema = createFaqSchema([
  {
    question: 'Aidea:Med團隊有什麼專業背景？',
    answer: '我們的團隊由醫療行銷專家、數位行銷專家、UI/UX設計師、內容創作者與技術開發人員組成。團隊成員具有醫療產業、品牌策略、數位行銷和技術開發等多元背景，能從多角度理解診所的需求，提供全方位的行銷解決方案。'
  },
  {
    question: '如何與Aidea:Med團隊合作？',
    answer: '與我們合作的流程簡單而高效：首先，您可以透過聯絡頁面或電話與我們預約免費諮詢；接著，我們會進行深度需求診斷，了解您診所的獨特需求與挑戰；然後，我們會提供客製化的行銷方案與報價；一旦確認合作，我們會建立專屬項目團隊，定期溝通與調整，確保行銷策略有效執行並達成目標。'
  },
  {
    question: '團隊能為診所提供哪些行銷支援？',
    answer: '我們提供全方位的診所行銷支援，包括品牌策略規劃、視覺識別設計、網站開發與優化、SEO/SEM服務、社群媒體經營、內容行銷策略、口碑管理、醫師個人品牌建立、數位廣告投放、行銷自動化系統建置等。我們根據每家診所的獨特需求，提供客製化的服務組合。'
  }
])

export default function Page() {
  return (
    <>
      <div className="container mx-auto px-4 pt-16">
        <BreadcrumbNav 
          className="mb-3" 
          includeJsonLd={true}
        />
      </div>
      <TeamPage />
      
      {/* 插入團隊FAQ的結構化數據 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamFaqSchema) }}
      />
    </>
  )
} 