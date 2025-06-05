'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, AlertTriangle, BookOpen, ChevronRight, Info } from 'lucide-react'

type TabType = 'checklist' | 'consent' | 'risk' | 'social'

const MedicalResourceTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>('checklist')

  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
      {/* Tab Header */}
      <div className="flex flex-wrap md:flex-nowrap border-b border-gray-200">
        <TabButton 
          active={activeTab === 'checklist'} 
          onClick={() => setActiveTab('checklist')}
          icon={<FileText className="w-4 h-4 mr-2" />}
          title="醫療廣告合規檢核表"
          subtitle="檢核工具"
        />
        <TabButton 
          active={activeTab === 'consent'} 
          onClick={() => setActiveTab('consent')}
          icon={<CheckCircle className="w-4 h-4 mr-2" />}
          title="患者案例同意書範本"
          subtitle="實用範本"
        />
        <TabButton 
          active={activeTab === 'risk'} 
          onClick={() => setActiveTab('risk')}
          icon={<AlertTriangle className="w-4 h-4 mr-2" />}
          title="醫療廣告違規風險評估表"
          subtitle="風險評估"
        />
        <TabButton 
          active={activeTab === 'social'} 
          onClick={() => setActiveTab('social')}
          icon={<BookOpen className="w-4 h-4 mr-2" />}
          title="社群媒體合規發文指引"
          subtitle="實務指南"
        />
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'checklist' && <ChecklistTab />}
        {activeTab === 'consent' && <ConsentFormTab />}
        {activeTab === 'risk' && <RiskAssessmentTab />}
        {activeTab === 'social' && <SocialMediaGuideTab />}
      </div>

      {/* Download Button */}
      <div className="px-6 pb-6 flex justify-end">
        <a href="/contact" className="flex items-center justify-center px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-300">
          <span>預約專屬顧問</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  )
}

// Tab Button Component
const TabButton = ({ 
  active, 
  onClick, 
  icon, 
  title, 
  subtitle 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-0 py-4 px-4 flex flex-col items-center text-center transition-all duration-200 border-b-2 ${
        active 
          ? 'border-primary text-primary bg-primary/5' 
          : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
      }`}
    >
      <span className="text-xs font-medium mb-1 block">{subtitle}</span>
      <div className="flex items-center justify-center">
        {icon}
        <span className="font-medium text-sm truncate">{title}</span>
      </div>
    </button>
  )
}

// 醫療廣告合規檢核表
const ChecklistTab = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">醫療廣告合規檢核表</h3>
        <p className="text-gray-600">
          完整的60項檢核清單，協助診所自我評估所有對外宣傳內容的合規性
        </p>
      </div>

      <div className="space-y-6">
        <ChecklistSection 
          title="基本資訊與法規符合性 (15項)" 
          items={[
            '廣告內容是否包含醫療機構合法名稱與開業執照字號',
            '廣告中的醫師資訊是否包含正確的姓名與證書字號',
            '是否避免使用「最佳」、「首選」等比較性或絕對性用詞',
            '廣告是否未含有療效保證或成功率的承諾',
            '是否未使用「特價」、「優惠」、「折扣」等商業促銷用語',
            '查看更多...'
          ]}
        />

        <ChecklistSection 
          title="病例與治療結果呈現 (12項)" 
          items={[
            '是否取得患者的書面同意書用於展示案例',
            '治療前後照片是否在相同的拍攝條件下進行',
            '是否避免宣稱特定治療效果適用於所有患者',
            '案例呈現是否註明「個案效果因人而異」等警語',
            '分享的案例是否適當去識別化處理',
            '查看更多...'
          ]}
        />

        <ChecklistSection 
          title="社群媒體與網站內容 (18項)" 
          items={[
            '社群媒體貼文是否避免誇大療效宣傳',
            '網站是否明確區分醫療資訊與醫療廣告',
            '留言區回覆是否避免療效承諾或具體治療建議',
            '轉發的醫療新聞是否符合醫療廣告規範',
            '是否建立社群媒體內容定期審核機制',
            '查看更多...'
          ]}
        />

        <ChecklistSection 
          title="費用與服務說明 (15項)" 
          items={[
            '費用說明是否以客觀、透明方式呈現',
            '是否避免使用價格比較或最低價宣傳',
            '收費標準是否清楚標示包含與不包含的項目',
            '是否未將價格作為吸引患者的主要訴求',
            '是否避免使用價格暗示療效品質的關聯',
            '查看更多...'
          ]}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1 mr-3" />
        <p className="text-sm text-blue-800">
          此檢核表根據衛福部最新醫療廣告規範與實際稽查案例編製，定期更新以符合最新法規要求。完整檢核表包含詳細說明與實例，可下載使用。
        </p>
      </div>
    </div>
  )
}

// 檢核表區段組件
const ChecklistSection = ({ title, items }: { title: string; items: string[] }) => {
  return (
    <div className="bg-gray-50 p-5 rounded-lg">
      <h4 className="font-bold text-gray-900 mb-4">{title}</h4>
      <div className="space-y-2 pl-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
            <span className="ml-3 text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 患者案例同意書範本
const ConsentFormTab = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">患者案例同意書範本</h3>
        <p className="text-gray-600">
          符合衛福部要求的患者照片與案例分享標準同意書範本，包含法律專家審核備註
        </p>
      </div>

      <div className="border rounded-lg divide-y divide-gray-200">
        <div className="p-5 bg-gray-50">
          <h4 className="font-bold text-lg text-center text-gray-900 mb-4">醫療案例分享授權同意書</h4>
          
          <div className="space-y-4 text-sm text-gray-700">
            <p>本人 ______________ (患者姓名)，身分證字號末五碼：__________，</p>
            
            <p>茲同意 ______________ (醫療機構名稱) 及其授權之醫事人員使用本人相關醫療資訊，包括但不限於：</p>
            
            <div className="ml-4 space-y-2">
              <div className="flex">
                <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                <span className="ml-2">治療前、治療中及治療後之相關照片</span>
              </div>
              <div className="flex">
                <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                <span className="ml-2">治療過程之相關影片</span>
              </div>
              <div className="flex">
                <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                <span className="ml-2">治療相關檢查及檢驗報告 (不含病理報告)</span>
              </div>
              <div className="flex">
                <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                <span className="ml-2">治療過程及結果之描述</span>
              </div>
              <div className="flex">
                <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                <span className="ml-2">其他： ______________________________</span>
              </div>
            </div>
            
            <p className="font-medium">使用目的及範圍：</p>
            <div className="ml-4 space-y-2">
              <div className="flex">
                <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                <span className="ml-2">醫療機構網站</span>
              </div>
              <div className="flex">
                <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                <span className="ml-2">社群媒體平台（如FB、IG、Line等）</span>
              </div>
              <div className="flex">
                <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                <span className="ml-2">學術研討會或教學用途</span>
              </div>
              <div className="flex">
                <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                <span className="ml-2">醫療機構實體文宣</span>
              </div>
              <div className="flex">
                <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                <span className="ml-2">其他： ______________________________</span>
              </div>
            </div>
            
            <p>本人已清楚了解以下事項：</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>本同意書簽署為自願性質，不影響本人接受醫療服務之權利。</li>
              <li>同意範圍內之資料使用將經適當去識別化處理，但仍可能有被辨識之可能。</li>
              <li>本授權同意有效期限為 ________ 年，或至本人以書面通知撤銷為止。</li>
              <li>本人得隨時以書面通知撤銷此同意書，但已發布之內容不在撤銷範圍。</li>
              <li>本案例分享不得有療效保證、誇大或不實之內容。</li>
            </ol>
            
            <div className="pt-2">
              <p>同意人簽章：______________ 日期：______________</p>
              <p className="mt-2">醫療機構代表：______________ 日期：______________</p>
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <h5 className="font-bold text-gray-900 mb-3">法律專家審核備註</h5>
          <div className="space-y-3 text-sm text-gray-700">
            <p><span className="font-medium">✓ 適用範圍：</span>本同意書適用於所有需要使用患者照片或案例之醫療機構，包括但不限於診所、醫院等。</p>
            <p><span className="font-medium">✓ 法規依據：</span>依據醫療法施行細則第61條及衛福部「醫療機構網際網路資訊管理辦法」第3條規定。</p>
            <p><span className="font-medium">✓ 修改說明：</span>醫療機構可依自身需求調整同意書內容，但不得刪除患者權益保障相關條款。</p>
            <p><span className="font-medium">✓ 告知義務：</span>使用前須向患者充分說明使用目的、範圍及可能影響，並確保患者理解後再行簽署。</p>
            <p><span className="font-medium">✓ 特別提醒：</span>同意書簽署後，醫療機構仍不得發布任何誇大、不實或療效保證之內容。</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1 mr-3" />
        <p className="text-sm text-blue-800">
          此同意書範本經法律專家審核，符合現行法規要求。建議使用前諮詢法律顧問，確保符合貴機構特定需求，完整版本包含使用指引與常見問答。
        </p>
      </div>
    </div>
  )
}

// 醫療廣告違規風險評估表
const RiskAssessmentTab = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">醫療廣告違規風險評估表</h3>
        <p className="text-gray-600">
          各類型醫療廣告與溝通方式的風險等級評估與建議，幫助優先處理高風險區域
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">廣告/溝通類型</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">風險等級</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">主要風險點與注意事項</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <RiskRow 
              type="療效保證或誇大宣傳" 
              level="高風險" 
              levelColor="bg-red-100 text-red-800"
              notes={[
                "使用「保證」、「無痛」、「最好」等絕對性用詞",
                "宣稱100%成功率或完全無副作用",
                "療效描述遠超過醫學實證支持範圍"
              ]}
            />
            
            <RiskRow 
              type="醫療機構官網療程介紹" 
              level="中高風險" 
              levelColor="bg-orange-100 text-orange-800"
              notes={[
                "未提及療程可能的風險或副作用",
                "使用患者案例但未取得適當同意",
                "以商業化話術或過度行銷手法描述療程"
              ]}
            />
            
            <RiskRow 
              type="社群媒體平台發文" 
              level="中高風險" 
              levelColor="bg-orange-100 text-orange-800"
              notes={[
                "未經審核的即時互動回覆可能違規",
                "留言區未適當管理病患提問與回覆",
                "轉貼或分享誇大報導但未適當說明"
              ]}
            />
            
            <RiskRow 
              type="醫療費用與促銷活動" 
              level="高風險" 
              levelColor="bg-red-100 text-red-800"
              notes={[
                "使用「特價」、「優惠」、「限時折扣」等商業促銷用語",
                "以價格比較作為主要訴求",
                "綁定銷售或滿額贈送等營銷策略"
              ]}
            />
            
            <RiskRow 
              type="醫師個人社群帳號" 
              level="中風險" 
              levelColor="bg-yellow-100 text-yellow-800"
              notes={[
                "醫師個人分享但明顯指向特定醫療機構",
                "以個人經驗分享形式進行醫療服務推薦",
                "未清楚區分專業意見與個人觀點"
              ]}
            />
            
            <RiskRow 
              type="醫療新知或衛教文章" 
              level="低中風險" 
              levelColor="bg-blue-100 text-blue-800"
              notes={[
                "衛教內容最後加上診所資訊與聯絡方式",
                "選擇性呈現有利研究結果",
                "以衛教形式包裝特定療程推薦"
              ]}
            />
            
            <RiskRow 
              type="病例分享與治療成果" 
              level="中高風險" 
              levelColor="bg-orange-100 text-orange-800"
              notes={[
                "未適當去識別化或未取得書面同意",
                "僅展示最佳治療結果而非典型案例",
                "未註明「個案效果可能因人而異」等警語"
              ]}
            />
            
            <RiskRow 
              type="影片平台內容(YouTube等)" 
              level="中風險" 
              levelColor="bg-yellow-100 text-yellow-800"
              notes={[
                "影片標題或縮圖使用誇張療效字眼",
                "醫師示範但未適當說明風險或侷限性",
                "評論區回覆可能違反醫療廣告規範"
              ]}
            />
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1 mr-3" />
        <p className="text-sm text-blue-800">
          本風險評估表基於2022-2023年衛福部裁罰案例分析編製。完整版評估表還包含風險緩解策略、實際違規案例分析、以及詳細的風險評分系統，可供醫療機構全面檢視自身廣告風險。
        </p>
      </div>
    </div>
  )
}

// 風險評估表行
const RiskRow = ({ 
  type, 
  level, 
  levelColor,
  notes 
}: { 
  type: string; 
  level: string; 
  levelColor: string;
  notes: string[] 
}) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
        {type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm border-r">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${levelColor}`}>
          {level}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <ul className="list-disc pl-5 space-y-1">
          {notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </td>
    </tr>
  )
}

// 社群媒體合規發文指引
const SocialMediaGuideTab = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">社群媒體合規發文指引</h3>
        <p className="text-gray-600">
          針對不同社群平台的合規發文指引，包含範例與禁忌，適用於各類醫療專業
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h4 className="font-bold text-gray-900">一般社群媒體發文原則</h4>
          </div>
          <div className="p-5 space-y-4 text-sm">
            <div className="flex">
              <div className="flex-shrink-0 text-green-500 mr-2">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">應優先分享醫療衛教知識，而非特定療程效果</p>
                <p className="text-gray-600 mt-1">發文內容應以教育、知識分享為主，避免明顯營銷意圖，保持80%教育內容、20%診所資訊的比例</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 text-green-500 mr-2">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">使用非絕對性、客觀的描述方式</p>
                <p className="text-gray-600 mt-1">使用「可能」、「有助於」、「根據研究顯示」等非絕對用詞，避免「保證」、「一定」、「完全」等絕對性表述</p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 text-green-500 mr-2">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">確保所有患者案例均取得書面同意</p>
                <p className="text-gray-600 mt-1">分享前後照片需有明確書面同意，適當去識別化處理，並註明「個案效果可能因人而異」</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 text-red-500 mr-2">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">避免商業化促銷用語與價格競爭</p>
                <p className="text-gray-600 mt-1">不得使用「特價」、「優惠」、「限時折扣」等商業促銷用語，或與其他機構進行價格與效果比較</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 text-red-500 mr-2">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">不可使用網紅或名人代言療效</p>
                <p className="text-gray-600 mt-1">請勿邀請網紅、KOL或名人推薦特定療程效果，或宣傳其在貴診所的療程經驗</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-lg border border-gray-200 overflow-hidden h-full">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h4 className="font-bold text-gray-900">Facebook/Instagram平台特別注意事項</h4>
            </div>
            <div className="p-5 space-y-3 text-sm h-full">
              <p className="font-medium">✅ 正確做法</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>使用Stories功能分享日常專業活動，展現診所氛圍</li>
                <li>定期發布實用衛教內容，建立專業形象</li>
                <li>回覆互動時使用通用性回答，避免個人化醫療建議</li>
                <li>設置留言審核機制，及時管理違規或不當內容</li>
              </ul>
              
              <p className="font-medium mt-4">❌ 常見錯誤</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>使用「打卡送禮」等促銷手法招攬患者</li>
                <li>在留言區回覆具體治療建議與預期效果</li>
                <li>發布療程促銷活動或限時優惠資訊</li>
                <li>未經同意分享患者照片或案例細節</li>
              </ul>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 overflow-hidden h-full">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h4 className="font-bold text-gray-900">YouTube/Line平台特別注意事項</h4>
            </div>
            <div className="p-5 space-y-3 text-sm h-full">
              <p className="font-medium">✅ 正確做法</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>製作專業衛教影片，解釋常見醫療問題</li>
                <li>針對醫學新知提供專業解析與說明</li>
                <li>Line官方帳號提供一般性健康資訊與診所服務介紹</li>
                <li>標註影片為「資訊分享」性質，非替代個人診斷</li>
              </ul>
              
              <p className="font-medium mt-4">❌ 常見錯誤</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>使用聳動標題或縮圖誇大療效</li>
                <li>影片中未說明風險或可能的副作用</li>
                <li>Line推播促銷活動或優惠方案</li>
                <li>以醫師身分在評論區給予具體治療建議</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h4 className="font-bold text-gray-900">合規社群發文範例</h4>
          </div>
          <div className="p-5 space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">✅ 合規範例 1：專業知識分享</p>
              <div className="bg-gray-50 p-4 rounded-md mt-2 text-gray-700">
                <p className="font-medium">【認識牙周病的早期警訊】</p>
                <p className="mt-2">牙周病是許多成人的常見問題，但早期症狀往往容易被忽略。以下是您應該注意的5個警訊：</p>
                <ol className="list-decimal mt-2 ml-5 space-y-1">
                  <li>刷牙時牙齦出血</li>
                  <li>牙齦紅腫或疼痛</li>
                  <li>口臭持續不改善</li>
                  <li>牙齦萎縮，牙齒看起來變長</li>
                  <li>牙齒鬆動或位置改變</li>
                </ol>
                <p className="mt-2">定期牙科檢查是預防牙周病最好的方法。若有任何疑問，建議諮詢專業牙醫師評估。</p>
                <p className="mt-2 text-gray-500 text-xs">本文僅供衛教參考，不能替代專業醫療診斷。</p>
              </div>
            </div>
            
            <div>
              <p className="font-medium text-gray-900">❌ 違規範例 1：誇大療效與促銷</p>
              <div className="bg-gray-50 p-4 rounded-md mt-2 text-gray-700">
                <p className="font-medium">【超強美白技術 - 保證雪白牙齒！】</p>
                <p className="mt-2">厭倦了黃板牙？本診所獨家引進最新美白技術，100%無痛、絕對有效！只需一次療程，立即亮白8階以上，效果持久保證一年以上！</p>
                <p className="mt-2">本月特惠價只要$XXXX元（原價$XXXX），前20名預約還送精美居家美白組！立即預約，重拾自信笑容！</p>
                <p className="mt-2">看看我們滿意顧客的燦爛笑容！效果有目共睹，讓您成為下一個成功案例！</p>
              </div>
              <p className="text-xs text-red-600 mt-1">* 此為違規示範，包含誇大療效宣傳、療效保證、價格促銷等多項違規內容</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1 mr-3" />
        <p className="text-sm text-blue-800">
          完整版社群媒體指南包含各平台特性分析、合規發文範本、常見問答、留言回覆指引等更豐富內容，並針對醫美、牙科、中醫等不同專科提供專屬合規建議。
        </p>
      </div>
    </div>
  )
}

export default MedicalResourceTabs 