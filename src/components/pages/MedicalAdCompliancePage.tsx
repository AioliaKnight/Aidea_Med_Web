'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo, useEffect } from 'react'
import { PageHeader, CTASection } from '@/components/common'
import { Heading } from '@/components/ui'
import { CheckCircle, AlertTriangle, BookOpen, FileText, Shield, TrendingUp, Info, Gavel, Scale, PlusCircle, MinusCircle } from 'lucide-react'
import MedicalResourceTabs from '@/components/MedicalResourceTabs'
import { trackButtonClick, trackServiceView, pushEvent } from '@/lib/analytics'

// 從配置文件導入
import { animations } from '@/utils/animations'

// 法規遵循服務項目
const complianceServices = [
  {
    id: 'legal-assessment',
    title: '診所廣告法規評估',
    icon: <FileText className="w-10 h-10 text-primary" />,
    items: [
      '現有廣告內容合規性檢查',
      '診所網站法規風險評估',
      '社群媒體發文合規分析',
      '廣告素材法規審核',
      '醫療術語使用指導',
      '病例照片使用審核'
    ],
    description: '我們提供全面的醫療廣告法規遵循評估，審查您現有的行銷內容，找出潛在風險，並提供專業改善建議，確保所有對外溝通皆符合衛福部規範。'
  },
  {
    id: 'policy-guide',
    title: '合規廣告策略規劃',
    icon: <Shield className="w-10 h-10 text-primary" />,
    items: [
      '診所專屬廣告合規指南',
      '醫療術語轉換建議',
      '合法效果展示策略',
      '病例分享標準流程',
      '專業認證強化方案',
      '教育性內容規劃'
    ],
    description: '在醫療法規限制下，我們協助您找出合法有效的廣告策略，透過專業醫療知識的分享、正確的病例展示和教育性內容，建立診所專業形象，在合規的前提下達成行銷目標。'
  },
  {
    id: 'staff-training',
    title: '員工廣告法規培訓',
    icon: <BookOpen className="w-10 h-10 text-primary" />,
    items: [
      '醫療廣告法規基礎培訓',
      '社群媒體合規發文指南',
      '患者溝通合規話術',
      '案例討論與實務演練',
      '最新法規更新通知',
      '合規文案撰寫技巧'
    ],
    description: '針對診所團隊提供專業的醫療廣告法規培訓，讓每位員工了解行銷活動的法規界限，避免無意間的違規風險，同時學習如何在合法框架內有效溝通診所優勢。'
  },
  {
    id: 'monitoring',
    title: '持續性合規監測',
    icon: <TrendingUp className="w-10 h-10 text-primary" />,
    items: [
      '定期廣告內容合規審查',
      '競爭對手廣告分析',
      '法規變更即時通知',
      '違規風險預警系統',
      '合規調整建議',
      '年度合規報告'
    ],
    description: '醫療廣告法規經常更新，我們提供持續性的合規監測服務，定期審查您的行銷內容，追蹤法規變化，及時調整策略，確保診所行銷始終保持在安全合規的範圍內。'
  }
]

// 常見醫療廣告違規類型
const commonViolations = [
  {
    title: '誇大療效承諾',
    description: '宣稱「保證」、「最好」、「無痛」等絕對性療效，或使用「奇蹟」、「完美」等誇張詞彙',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    solution: '專注於客觀描述療程過程與可能效果，使用「可能」、「有助於」等非絕對用詞',
    example: '2022年台北市某皮膚科診所宣稱「保證無疤痕」「100%永久除斑」，遭罰20萬元並要求下架所有相關廣告'
  },
  {
    title: '非醫療機構從事醫療廣告',
    description: '非合法醫療機構(如美容工作室、健身中心、生技公司)進行醫療相關宣傳或療效宣稱',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    solution: '嚴格區分醫療與非醫療服務，非醫療機構應避免使用任何醫療術語或療效宣傳',
    example: '2022年某美容工作室在社群媒體宣傳「微整形注射」、「痘疤治療」等醫療行為，違反醫療法第84條，被裁處15萬元罰鍰'
  },
  {
    title: '未經同意使用患者案例',
    description: '未取得患者明確書面同意就分享治療前後照片或病例資訊，或未妥善去識別化',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    solution: '建立標準化患者同意流程，確保所有案例展示都有書面授權，同時適當去識別化',
    example: '2022年新北市某牙醫診所未經患者書面同意在社群平台分享矯正治療照片，經患者投訴後遭衛生局罰鍰18萬元'
  },
  {
    title: '價格與折扣不當宣傳',
    description: '使用「特價」、「優惠」、「折扣」等商業化促銷用語，或以低價作為招徠病患主要訴求',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    solution: '採用「費用說明」或「參考費用」等中性表述，避免任何商業促銷語言',
    example: '2023年台中市某醫美診所於官網宣傳「限時優惠」「買一送一」等促銷活動，被衛生局開罰15萬元並命令立即修改網站內容'
  },
  {
    title: '未經實證的療效宣稱',
    description: '宣傳未有科學依據或誇大的治療效果，未提供醫學實證來源，或選擇性呈現有利數據',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    solution: '基於可靠醫學文獻提供資訊，清楚標示研究來源，呈現完整且平衡的效果評估',
    example: '2022年某減重診所宣稱其療程「科學證實」可達特定減重效果，衛福部要求提供研究證據後無法提供足夠證明，遭罰22萬元'
  },
  {
    title: '比較性廣告',
    description: '直接或間接與其他醫療機構或醫師進行比較，暗示自身服務優於其他同業',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    solution: '專注於自身專業特色描述，避免任何形式的比較性言論或貶低他人的表述',
    example: '2023年高雄市某診所在廣告中暗示其技術「遠優於其他診所」並間接貶低同業，遭衛生局開罰20萬元並要求登報道歉'
  },
  {
    title: '醫療名人代言',
    description: '使用名人推薦特定療程或療效，或透過網紅影響力間接宣傳醫療服務',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    solution: '透過專業醫療知識分享建立權威，避免使用名人代言方式',
    example: '2022年台北市某整形診所聘請知名藝人代言特定療程，強調「藝人推薦」並暗示效果保證，遭衛生局處分25萬元'
  },
  {
    title: '未揭露風險與副作用',
    description: '只強調療程效果而刻意隱匿或淡化可能的風險、併發症或副作用',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    solution: '平衡呈現療程效果與可能風險，誠實告知相關副作用與適應症',
    example: '2022年某整形外科診所僅宣傳手術效果而未提及恢復期和可能併發症，經患者申訴後遭衛福部處分16萬元，並要求更新所有宣傳材料'
  },
  {
    title: '違規使用醫療專業術語',
    description: '使用一般民眾難以理解的專業術語，或使用未經核准的療程名稱',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    solution: '使用淺顯易懂的語言描述醫療服務，確保專業術語有適當解釋',
    example: '2023年新竹市某診所使用未經核准的專利療程名稱並宣稱「獨家專利技術」，遭衛生局認定違規開罰12萬元'
  }
]

// 法規合規案例研究
const complianceCaseStudies = [
  {
    title: '牙醫診所社群媒體合規轉型',
    challenge: '診所社群平台充滿療效保證與價格促銷內容，面臨衛福部警告',
    solution: '重新規劃社群內容策略，轉向專業知識分享與衛教內容',
    result: '六個月內建立專業形象，粉絲互動提升40%，且完全符合法規要求'
  },
  {
    title: '皮膚科診所網站改版',
    challenge: '網站內含大量誇大療效描述與未授權的患者照片',
    solution: '全面內容審核，建立標準化患者同意流程，修改所有誇大表述',
    result: '消除所有法規風險，同時網站轉換率提高15%，患者信任感提升'
  },
  {
    title: '醫美診所廣告合規培訓',
    challenge: '員工不了解法規界限，社群發文頻繁違規',
    solution: '實施全員廣告法規培訓，建立發文前審核機制',
    result: '員工合規意識顯著提升，零違規記錄，患者諮詢質量提高'
  },
  {
    title: '美容工作室違法醫療廣告糾正',
    challenge: '非醫療機構進行醫療美容廣告宣傳，違反醫療法第84條',
    solution: '修改所有廣告內容，去除醫療服務宣傳用語，明確標示為非醫療行為',
    result: '避免5萬至25萬元罰款風險，轉型為合法美容服務，客戶滿意度維持穩定'
  }
]

// 服務流程步驟
const complianceProcess = [
  {
    step: 1,
    title: '初步法規風險評估',
    description: '全面審查診所現有行銷內容，包括網站、社群媒體、宣傳材料等，評估潛在法規風險'
  },
  {
    step: 2,
    title: '診所專屬合規方案',
    description: '根據診所特性與行銷目標，制定專屬合規策略，找出合法有效的行銷方式'
  },
  {
    step: 3,
    title: '合規內容改善',
    description: '調整現有行銷內容，消除違規風險，同時保持行銷效果與專業形象'
  },
  {
    step: 4,
    title: '團隊法規培訓',
    description: '為診所團隊提供醫療廣告法規培訓，建立長期合規意識與能力'
  },
  {
    step: 5,
    title: '持續監測與優化',
    description: '定期審查診所行銷內容，追蹤法規變化，確保長期合規'
  }
]

// 台灣醫療廣告法規重點
const taiwanMedicalAdRegulations = [
  {
    title: '醫療廣告基本定義與範疇',
    description: <>
      <p className="mb-3"><strong>醫療法第9條</strong>明確定義：「本法所稱醫療廣告，係指利用傳播媒體或其他方法，<strong>宣傳醫療業務，以達招徠患者醫療為目的之行為</strong>」。</p>
      
      <p className="mb-3"><strong>醫療法第87條</strong>進一步補充：「<strong>廣告內容暗示或影射醫療業務者，視為醫療廣告</strong>」。這意味著即使沒有直接提及療程，只要具有招徠患者意圖的宣傳內容，都可能被視為醫療廣告。</p>
      
      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 mb-2">
        <p className="font-medium text-gray-900 mb-1">實例說明：</p>
        <p>某美容工作室在社群媒體分享「除皺成功案例」並暗示效果，雖未明確提及醫療服務，但因暗示醫療業務效果，仍被衛生局認定為醫療廣告。</p>
      </div>
    </>,
    icon: <Info className="w-8 h-8 text-primary" />
  },
  {
    title: '醫療廣告的主體限制',
    description: <>
      <p className="mb-3"><strong>醫療法第84條</strong>明確規定：「<strong>非醫療機構，不得為醫療廣告</strong>」。這是醫療廣告最基本的門檻限制，確保只有合法登記的醫療機構才能進行醫療廣告活動。</p>
      
      <p className="mb-3">此規定適用於：</p>
      <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-700">
        <li>美容工作室</li>
        <li>健身中心</li>
        <li>保健食品公司</li>
        <li>其他非醫療機構</li>
      </ul>
      
      <p className="mb-3">這與<strong>第9條</strong>和<strong>第87條</strong>密切關聯：一旦內容被認定為醫療廣告，發布者必須是合法醫療機構，否則即違反第84條規定。</p>
      
      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
        <p className="font-medium text-gray-900 mb-1">案例：</p>
        <p>2022年，某美容工作室因在社群媒體宣傳「微整形效果」和「除斑療程」，被衛生局依醫療法第84條與第104條規定，處以新台幣15萬元罰鍰。</p>
      </div>
    </>,
    icon: <Shield className="w-8 h-8 text-primary" />
  },
  {
    title: '醫療廣告的合法內容範圍',
    description: <>
      <p className="mb-3"><strong>醫療法第85條第1項</strong>明確限制醫療廣告內容僅能包含：</p>
      <ol className="list-decimal pl-5 mb-3 space-y-1 text-gray-700">
        <li>醫療機構基本資訊（名稱、執照字號、地址、電話）</li>
        <li>醫師資訊（姓名、性別、學經歷、證書號）</li>
        <li>健保特約資訊</li>
        <li>診療科別與時間</li>
        <li>開業相關資訊</li>
        <li>其他經核准事項</li>
      </ol>
      
      <p className="mb-3"><strong>衛福部於103年公告</strong>的「容許登載事項」進一步允許在符合醫學倫理前提下刊登：</p>
      <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-700">
        <li>疾病名稱</li>
        <li>診療項目、檢查及檢驗項目</li>
        <li>醫療儀器及經完成人體檢驗之醫療技術</li>
        <li>醫療費用</li>
      </ul>
      
      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
        <p className="font-medium text-gray-900 mb-1">範例比較：</p>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="flex-1 border border-green-200 bg-green-50 p-2 rounded">
            <p className="font-medium text-green-800 mb-1">✓ 合法內容</p>
            <p className="text-gray-700">「本診所提供植牙服務」<br/>「診所配備數位全口掃描設備」</p>
          </div>
          <div className="flex-1 border border-red-200 bg-red-50 p-2 rounded">
            <p className="font-medium text-red-800 mb-1">✗ 不合法內容</p>
            <p className="text-gray-700">「最先進的植牙技術」<br/>「保證無痛治療」</p>
          </div>
        </div>
      </div>
    </>,
    icon: <FileText className="w-8 h-8 text-primary" />
  },
  {
    title: '禁止的廣告方式與不當招攬',
    description: <>
      <p className="mb-3"><strong>醫療法第86條</strong>禁止七種廣告方式：</p>
      <ol className="list-decimal pl-5 mb-3 space-y-1 text-gray-700">
        <li>假借他人名義宣傳</li>
        <li>利用贈送醫療刊物宣傳</li>
        <li>公開祖傳秘方</li>
        <li>摘錄醫學刊物</li>
        <li>藉採訪報導宣傳</li>
        <li>與違規內容並排</li>
        <li>其他不正當方式</li>
      </ol>
      
      <p className="mb-3">這與<strong>第61條「禁止不正當招攬方式」</strong>互相呼應，包括禁止：</p>
      <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-700">
        <li>贈送醫療無關禮品</li>
        <li>利用回扣招攬</li>
        <li>其他不正當招攬行為</li>
      </ul>
      
      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
        <p className="font-medium text-gray-900 mb-1">實際案例：</p>
        <p>某醫美診所曾請網紅拍攝「真實體驗」影片宣傳特定療程，虛構療效並提供優惠碼，被認定違反第86條第1款和第7款，遭處20萬元罰鍰。</p>
      </div>
      
      <p className="mt-2 text-gray-700">這些限制確保醫療服務以<strong>專業而非商業方式</strong>呈現，維護醫療專業形象。</p>
    </>,
    icon: <AlertTriangle className="w-8 h-8 text-primary" />
  },
  {
    title: '醫療資訊與醫療廣告的區別',
    description: <>
      <p className="mb-3"><strong>醫療法第87條第2項</strong>規定：</p>
      <div className="bg-blue-50 p-3 rounded-md mb-3">
        <p className="text-gray-800">「<strong>醫學新知或研究報告之發表、病人衛生教育、學術性刊物，未涉及招徠醫療業務者，不視為醫療廣告</strong>」</p>
      </div>
      
      <p className="mb-3">這為醫療專業人員提供了分享專業知識的合法空間。判斷關鍵在於<strong>「是否具有招徠患者意圖」</strong>。</p>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <div className="flex-1 border border-green-200 bg-green-50 p-3 rounded-md">
          <p className="font-medium text-green-800 mb-1">✓ 合法醫療資訊</p>
          <p className="text-gray-700">皮膚科醫師在個人部落格分享「如何正確保養皮膚」的衛教知識，<strong>未提及</strong>診所資訊或引導就診</p>
        </div>
        <div className="flex-1 border border-red-200 bg-red-50 p-3 rounded-md">
          <p className="font-medium text-red-800 mb-1">✗ 可能被視為醫療廣告</p>
          <p className="text-gray-700">衛教文章末尾加上「本診所提供相關諮詢，歡迎預約」</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-700">💡 <strong>實用建議：</strong>醫療機構發布衛教資訊時，宜避免在同一頁面放置明顯的預約按鈕或聯絡資訊，減少被視為招徠患者的可能性。</p>
    </>,
    icon: <Scale className="w-8 h-8 text-primary" />
  },
  {
    title: '網路平台與社群媒體的特殊規範',
    description: <>
      <p className="mb-3"><strong>醫療法第85條第3項</strong>對醫療機構網際網路提供的資訊有特別規定：</p>
      <div className="bg-blue-50 p-3 rounded-md mb-3">
        <p className="text-gray-800">醫療機構網站內容<strong>不受第1項內容範圍限制</strong>，但須遵守「<strong>醫療機構網際網路資訊管理辦法</strong>」</p>
      </div>
      
      <p className="mb-3">這意味著醫療機構在網站上可以提供更豐富的醫療資訊，但仍<strong>不得有誇大不實內容</strong>。</p>
      
      <p className="mb-2"><strong>社群媒體注意事項：</strong></p>
      <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-700">
        <li>醫療機構對其官方帳號內容（包括留言區）負<strong>完全責任</strong></li>
        <li>須避免療效保證或誇大表述</li>
        <li>分享病患療前療後照片時須取得<strong>書面同意</strong></li>
        <li>不能使用「最佳效果」「無痛治療」等字眼</li>
        <li>應註明「個案效果因人而異」的警語</li>
      </ul>
      
      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
        <p className="font-medium text-gray-900 mb-1">適用平台：</p>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">Facebook</span>
          <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">Instagram</span>
          <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">YouTube</span>
          <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">Line官方帳號</span>
          <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">部落格</span>
          <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">其他數位平台</span>
        </div>
      </div>
    </>,
    icon: <Info className="w-8 h-8 text-primary" />
  },
  {
    title: '醫療廣告的審核與執行細則',
    description: <>
      <p className="mb-3"><strong>醫療法施行細則</strong>為醫療廣告提供具體執行標準：</p>
      
      <div className="mb-2 border-l-4 border-primary pl-3 py-1">
        <p className="font-medium">第58條：廣告中可呈現的「學歷」與「經歷」</p>
        <p className="text-sm text-gray-700">學歷須為醫學相關系所畢業，經歷須有證明文件</p>
      </div>
      
      <div className="mb-2 border-l-4 border-primary pl-3 py-1">
        <p className="font-medium">第59條：廣告中的診療科別限制</p>
        <p className="text-sm text-gray-700">僅限於主管機關核准登記的專科</p>
      </div>
      
      <div className="mb-3 border-l-4 border-primary pl-3 py-1">
        <p className="font-medium">第60條：廣播電視廣告審核</p>
        <p className="text-sm text-gray-700">須經直轄市或縣市主管機關書面審核</p>
      </div>
      
      <p className="mb-3">這些細則與<strong>第85條</strong>密切關聯，提供明確的執行標準。</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-gray-50 p-3 rounded-md text-sm text-gray-700">
          <p className="font-medium text-gray-900 mb-1">例子一：醫師專科資格</p>
          <p>醫師在廣告中只能列出實際取得的專科證書，不能宣稱未經認證的專長</p>
        </div>
        <div className="flex-1 bg-gray-50 p-3 rounded-md text-sm text-gray-700">
          <p className="font-medium text-gray-900 mb-1">例子二：電視廣告流程</p>
          <p>電視廣告必須事先取得地方衛生局書面核准，不能直接播出後再申請</p>
        </div>
      </div>
    </>,
    icon: <Gavel className="w-8 h-8 text-primary" />
  },
  {
    title: '違規的法律後果與罰則',
    description: <>
      <p className="mb-3"><strong>法定罰則：</strong></p>
      <div className="bg-red-50 p-3 rounded-md mb-3">
        <p className="mb-2"><strong>醫療法第103條</strong>：醫療機構違反第85條、第86條或擅自變更廣告內容</p>
        <p className="text-gray-800">→ 處<strong>5萬元以上25萬元以下罰鍰</strong></p>
        
        <p className="mt-3 mb-2"><strong>醫療法第104條</strong>：非醫療機構違反第84條為醫療廣告</p>
        <p className="text-gray-800">→ 處<strong>5萬元以上25萬元以下罰鍰</strong></p>
      </div>
      
      <p className="mb-2"><strong>情節嚴重者可加重處罰：</strong></p>
      <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-700">
        <li>內容虛偽誇張</li>
        <li>宣傳非法墮胎</li>
        <li>一年內三次違規</li>
      </ul>
      <p className="mb-3 text-red-700 font-medium">可處停業或廢止執照，並吊銷負責醫師證書一年</p>
      
      <p className="mb-2"><strong>其他可能處罰：</strong></p>
      <p className="mb-3 text-gray-700">違反公平交易法的處罰，最高可達<strong>2,500萬元</strong></p>
      
      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
        <p className="font-medium text-gray-900 mb-1">實際案例與隱形成本：</p>
        <p className="mb-2">2022年某連鎖醫美診所在社群媒體宣稱「獨家技術，保證效果」：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>被處以25萬元罰鍰</li>
          <li>媒體負面報導</li>
          <li>品牌形象嚴重受損</li>
          <li>預約量下降30%以上</li>
        </ul>
        <p className="mt-2 text-gray-900 italic">違規的無形成本往往遠高於罰款金額</p>
      </div>
    </>,
    icon: <AlertTriangle className="w-8 h-8 text-primary" />
  },
  {
    title: '合法有效的醫療行銷策略',
    description: <>
      <p className="mb-3">在嚴格的法規下，醫療機構仍有許多<strong>合法有效的行銷方式</strong>：</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="font-medium text-blue-800 mb-1">1. 專業衛教知識分享</p>
          <p className="text-sm text-gray-700">建立權威形象，提供實質價值</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="font-medium text-blue-800 mb-1">2. 診所環境與設備展示</p>
          <p className="text-sm text-gray-700">客觀呈現就醫體驗，不誇大效果</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="font-medium text-blue-800 mb-1">3. 醫師專業背景分享</p>
          <p className="text-sm text-gray-700">呈現實際學經歷，建立專業信任</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="font-medium text-blue-800 mb-1">4. 真實病例分享</p>
          <p className="text-sm text-gray-700">須取得同意並去識別化處理</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="font-medium text-blue-800 mb-1">5. 公益活動參與</p>
          <p className="text-sm text-gray-700">展現社會責任，提升品牌形象</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="font-medium text-blue-800 mb-1">6. 學術活動參與</p>
          <p className="text-sm text-gray-700">強化專業地位，提升公信力</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
        <p className="font-medium text-gray-900 mb-2">合法行銷實例：</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>牙醫診所</strong>：定期發布口腔保健衛教影片，既提供價值又建立專業形象</li>
          <li><strong>皮膚科診所</strong>：展示先進設備與舒適環境，讓患者了解就醫體驗</li>
          <li><strong>整形外科</strong>：在患者同意下分享真實案例，註明「效果因人而異」</li>
        </ul>
      </div>
      
      <p className="mt-3 text-primary font-medium">這些策略既符合法規要求，又能有效傳達專業價值，是現代醫療機構的明智選擇。</p>
    </>,
    icon: <CheckCircle className="w-8 h-8 text-primary" />
  }
]

// 醫療廣告法規常見問答
const medicalAdFAQs = [
  {
    question: '什麼是醫療廣告？一般衛教資訊算醫療廣告嗎？',
    answer: <>
      <p className="mb-3">依衛福部規定，凡以傳播方法宣傳醫療機構、醫師或其醫療技術、專長、成果、價格等相關資訊，<strong>達到宣傳為目的之傳播內容</strong>，均屬醫療廣告。</p>
      
      <div className="mb-3">
        <p className="mb-2">純粹衛教資訊若符合下列條件，通常不視為醫療廣告：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>無涉及特定醫療機構、醫師或療程介紹</li>
          <li>無招徠患者之意圖</li>
          <li>以知識傳播為主要目的</li>
          <li>不含促使就醫的呼籲或聯絡方式</li>
        </ul>
      </div>
      
      <p className="mb-2">關鍵在於傳播內容的<strong>目的與效果</strong>，若主要目的是促使民眾到特定醫療機構就醫，即使以衛教資訊形式呈現，仍可能被認定為醫療廣告。</p>
      
      <p className="text-gray-700 italic text-sm">※ 實務案例：某診所在社群平台分享「假牙材質比較」，文末附上「本院特聘專家可為您諮詢」及診所電話，雖以衛教形式呈現，因明顯意圖引導就醫，衛生局仍認定為醫療廣告。</p>
    </>
  },
  {
    question: '診所社群媒體發布治療前後照片是否合法？',
    answer: <>
      <p className="mb-3">診所在社群媒體發布治療前後照片須<strong>同時符合三大條件</strong>才合法：</p>
      <ol className="list-decimal pl-5 mb-3 space-y-1">
        <li>必須取得患者明確書面同意，且同意書應詳細記載使用範圍與目的</li>
        <li>內容不得有誇大或保證療效的文字說明</li>
        <li>必須客觀呈現，不應使用過度修圖或誤導性角度</li>
      </ol>
      
      <div className="mb-3">
        <p className="mb-2">此外，應注意下列事項：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>避免使用「最佳」、「首選」、「無痛」等絕對性用詞</li>
          <li>保護患者隱私，即使取得同意也應適當遮蔽可辨識特徵</li>
          <li>避免暗示所有患者都能達到相同效果</li>
          <li>前後照片應在相同角度、光線條件下拍攝，不得刻意選擇有利呈現</li>
        </ul>
      </div>
      
      <p className="text-gray-700 italic text-sm">※ 依據衛福部規定，前後照片僅能作為治療效果的客觀呈現，不得作為保證所有患者都能達到相同效果的宣傳手段。2023年起，特別加強對濫用前後照片案例的稽查。</p>
    </>
  },
  {
    question: '醫療機構可以在廣告中提及療程價格嗎？',
    answer: <>
      <p className="mb-3">醫療機構可以在廣告中提及療程價格，但須遵守特定規範：</p>
      <ol className="list-decimal pl-5 mb-3 space-y-1">
        <li>價格必須誠實明確，不得有隱藏費用或誤導性表述</li>
        <li>不得使用「特價」、「優惠」、「折扣」等商業促銷用語</li>
        <li>不得與其他醫療機構價格進行比較</li>
        <li>不得以低價作為招徠患者的主要訴求</li>
      </ol>
      
      <p className="mb-3">價格說明應以<strong>資訊提供為目的</strong>，不應有促銷或鼓勵消費的意涵，且須清楚說明價格所包含的服務內容與範圍。</p>
      
      <p className="mb-2">根據醫師公會全國聯合會發布的《醫療價格資訊指引》，建議使用「參考費用」或「費用說明」等中性詞彙，而非「價格」或「收費」等商業化用語。</p>
      
      <p className="text-gray-700 italic text-sm">※ 案例：台北市衛生局2022年曾對多家牙醫診所開罰，因其在廣告中使用「限時優惠」、「特價」等商業促銷詞彙，每家罰款新台幣10萬元。</p>
    </>
  },
  {
    question: '醫師個人網站或部落格是否受醫療廣告法規限制？',
    answer: <>
      <p className="mb-3">是的，醫師個人網站或部落格若包含其執業資訊、專長、療程介紹等內容，均受醫療廣告法規限制。</p>
      
      <div className="mb-3">
        <p className="mb-2">依據「醫療機構網際網路資訊管理辦法」，醫師個人網站需遵守以下規定：</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>確實註明醫師姓名、執業機構及專科資格</li>
          <li>不得使用誇大或易使人誤解的內容</li>
          <li>若分享案例需經患者同意且不得宣稱療效保證</li>
          <li>不得對其他醫療機構或醫師進行貶抑評論</li>
        </ol>
      </div>
      
      <p className="mb-3">醫師個人社群媒體帳號（如Instagram、Facebook、YouTube等）若分享醫療相關內容並能辨識其醫師身分，同樣適用醫療廣告規範，特別是當該帳號公開發表專業意見、療程介紹或案例分享時。</p>
      
      <p className="mb-2">違反規定同樣可依醫療法第85條處罰，且處罰對象不僅可能是執業機構，也可能直接針對醫師個人。</p>
      
      <p className="text-gray-700 italic text-sm">※ 2022年衛福部明確表示「知名度高的醫師個人社群平台若涉及醫療宣傳，將比照一般醫療廣告標準進行查核」，並已對多名具高知名度的醫師社群帳號進行稽查。</p>
    </>
  },
  {
    question: '醫療機構發布的學術研究資訊算廣告嗎？',
    answer: <>
      <div className="mb-3">
        <p className="mb-2">醫療機構發布學術研究資訊若符合以下條件，通常<strong>不被視為廣告</strong>：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>內容基於客觀研究結果，引用可靠醫學文獻或研究</li>
          <li>目的為知識分享而非招徠患者</li>
          <li>不包含特定療程推薦或促銷內容</li>
          <li>使用學術性而非商業性表達方式</li>
          <li>提供完整研究參考資料與出處</li>
        </ul>
      </div>
      
      <div className="mb-3">
        <p className="mb-2">但若研究資訊出現以下情況，則可能被認定為醫療廣告：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>以宣傳特定療程效果為主要目的</li>
          <li>使用「革命性突破」、「獨家技術」等推銷性質用語</li>
          <li>選擇性呈現有利研究結果而忽略風險或限制</li>
          <li>將研究結果與診所服務直接連結</li>
        </ul>
      </div>
      
      <p className="mb-2">衛福部建議醫療機構分享學術研究時，應清楚說明「此為一般醫學知識分享，不代表對特定治療效果之保證」等免責聲明。</p>
      
      <p className="text-gray-700 italic text-sm">※ 台灣高等行政法院曾明確表示：醫學知識分享「若伴隨特定醫療機構資訊且有明顯招徠病患意圖」，則屬醫療廣告範疇。</p>
    </>
  },
  {
    question: '診所如何在合法範圍內有效宣傳專業特色？',
    answer: <>
      <div className="mb-3">
        <p className="mb-2">診所可透過以下<strong>合法方式</strong>有效宣傳專業特色：</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li><strong>強調客觀事實：</strong>醫師資歷、專科證照、學經歷等可驗證之事實</li>
          <li><strong>專業知識分享：</strong>發布深入淺出的衛教知識與醫療新知</li>
          <li><strong>呈現診所環境：</strong>展示診所空間、設備與服務流程</li>
          <li><strong>分享治療案例：</strong>在取得同意下，客觀呈現真實治療過程和結果</li>
          <li><strong>專業活動紀錄：</strong>參與學術研討、進修、公益活動等紀錄</li>
          <li><strong>診所特色服務：</strong>如無障礙設施、特殊關懷服務等</li>
        </ol>
      </div>
      
      <div className="mb-3">
        <p className="mb-2">有效但<strong>須謹慎處理</strong>的宣傳方式：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>國際認證或特殊技術（需有明確依據且不誇大）</li>
          <li>專業醫學會或學術組織認可（需真實且相關）</li>
          <li>媒體採訪報導（需非付費且客觀呈現）</li>
        </ul>
      </div>
      
      <p className="mb-2">重點是以<strong>教育、資訊為主</strong>，避免商業促銷性質的內容。同時，內容應注重患者需求與專業價值，而非單純以利益為導向。</p>
      
      <p className="text-gray-700 italic text-sm">※ 衛福部推薦的診所宣傳方式：「透過專業行醫過程及真實患者體驗故事，呈現診所價值與特色，而非僅關注治療成效」。</p>
    </>
  },
  {
    question: '使用病患推薦或評價於宣傳是否合法？',
    answer: <>
      <div className="mb-3">
        <p className="mb-2">使用病患推薦或評價於宣傳需謹慎處理，基本原則為：</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li><strong>取得書面同意：</strong>必須取得患者明確書面同意，包含使用範圍與目的</li>
          <li><strong>確保真實性：</strong>推薦內容必須真實，不得虛構或引導患者做出特定評價</li>
          <li><strong>避免療效保證：</strong>患者分享不得包含療效保證或誇大效果的內容</li>
          <li><strong>保護隱私：</strong>除非患者明確同意，否則應適當保護患者身分</li>
        </ol>
      </div>
      
      <div className="mb-3">
        <p className="mb-2"><strong>特別注意事項：</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>即使獲得患者同意，若推薦內容包含療效保證、比較性言論或誇大效果描述，仍可能違反醫療法規</li>
          <li>不得使用「名人推薦」作為主要宣傳手法</li>
          <li>患者評價應呈現綜合性意見，不應選擇性只展示正面評價</li>
          <li>應避免引導患者撰寫特定內容的評價</li>
        </ul>
      </div>
      
      <p className="mb-2">最安全的做法是以<strong>客觀呈現診所服務過程與專業特色為主</strong>，而非依賴患者推薦作為主要宣傳手段。若使用患者評價，應著重於服務體驗而非療效保證。</p>
      
      <p className="text-gray-700 italic text-sm">※ 法規趨勢：2023年衛福部正研議更嚴格的「醫療機構網路評價管理規範」，對於醫療機構如何處理、呈現與回應網路評價提出具體規範。</p>
    </>
  },
  {
    question: '跨境醫療行銷是否適用台灣醫療廣告法規？',
    answer: <>
      <p className="mb-3">是的，台灣醫療機構即使針對海外患者進行跨境醫療行銷，仍需遵守台灣醫療廣告法規。關鍵考量點包括：</p>
      <ol className="list-decimal pl-5 mb-3 space-y-1">
        <li>廣告內容若可被台灣民眾接觸到，無論目標對象為何，均受台灣法規規範</li>
        <li>使用中文進行宣傳時，更明確受台灣法規限制</li>
        <li>即使廣告平台或目標受眾在境外，只要廣告主體為台灣醫療機構，仍應遵守台灣法規</li>
        <li>國際社群媒體平台（如Facebook、Instagram）上的宣傳同樣受規範</li>
      </ol>
      
      <div className="mb-3">
        <p className="mb-2"><strong>跨境醫療行銷建議做法：</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>明確區分不同語言和地區的宣傳內容</li>
          <li>同時考量台灣與目標國家的醫療法規</li>
          <li>避免使用在台灣法規下可能違規的內容，即使目標國家允許</li>
          <li>在跨境平台上明確標示目標對象與適用範圍</li>
        </ul>
      </div>
      
      <p className="mb-2">值得注意的是，衛福部近年來加強對跨境醫療行銷的稽查，特別是針對醫美、生殖醫學等領域。</p>
      
      <p className="text-gray-700 italic text-sm">※ 2022年衛福部曾處罰多家以英文、日文、韓文等外語宣傳醫療服務的機構，理由為「雖以外語呈現，但台灣民眾仍可接觸，且廣告主體為台灣醫療機構，故適用台灣法規」。</p>
    </>
  },
  {
    question: '醫療機構如何合法使用社群媒體行銷？',
    answer: <>
      <div className="mb-3">
        <p className="mb-2">醫療機構在社群媒體行銷需遵循以下<strong>五大原則</strong>：</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li><strong>內容真實原則：</strong>所有發布內容必須真實、正確且有醫學依據</li>
          <li><strong>表達適當原則：</strong>避免誇大、保證或絕對性用語</li>
          <li><strong>形式合規原則：</strong>清楚標示發布者身分、執業機構</li>
          <li><strong>隱私保護原則：</strong>尊重患者隱私，取得適當同意</li>
          <li><strong>互動謹慎原則：</strong>在線上互動與回覆時維持專業態度</li>
        </ol>
      </div>
      
      <div className="mb-3">
        <p className="mb-2"><strong>社群媒體合規策略：</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>建立明確的內部社群媒體發布審核機制</li>
          <li>指定專人負責管理社群媒體內容合規性</li>
          <li>定期更新衛教知識而非僅宣傳服務</li>
          <li>遵循「80/20原則」：80%專業知識分享，20%診所資訊</li>
          <li>使用「故事分享」方式而非直接促銷</li>
        </ul>
      </div>
      
      <p className="mb-2">衛福部特別提醒，醫療機構應特別注意<strong>付費貼文推廣</strong>，付費推廣的內容受更嚴格的醫療廣告規範，需確保符合所有廣告要求。</p>
      
      <p className="text-gray-700 italic text-sm">※ 2023年新修訂的《醫療機構網際網路資訊管理辦法》特別增加對社群媒體平台的規範，明確要求醫療機構對其社群平台內容負完全責任，包括留言區互動內容。</p>
    </>
  },
  {
    question: '違反醫療廣告法規的處罰有哪些？',
    answer: <>
      <p className="mb-3">違反醫療廣告法規的處罰涵蓋多個層面：</p>
      <div className="mb-3">
        <ol className="list-decimal pl-5 space-y-1">
          <li><strong>行政處罰：</strong>
            <ul className="list-disc pl-5 mb-2 mt-1 space-y-1">
              <li>根據醫療法第103條規定，違反第85條、第86條者，可處新台幣5萬至25萬元罰鍰</li>
              <li>非醫療機構進行醫療廣告(違反第84條)，同樣可處5萬至25萬元罰鍰</li>
              <li>情節重大或屢次違規者，可處停業1個月至1年的處分</li>
              <li>限期令其改善，屆期未改善者，按次連續處罰</li>
            </ul>
          </li>
          <li><strong>法律責任：</strong>
            <ul className="list-disc pl-5 mb-2 mt-1 space-y-1">
              <li>若廣告內容造成消費者誤解或損害，可能面臨消費者保護法或民法侵權行為的賠償責任</li>
              <li>若涉及不實廣告，可能同時違反公平交易法，面臨公平會處分</li>
            </ul>
          </li>
          <li><strong>執業影響：</strong>
            <ul className="list-disc pl-5 mb-2 mt-1 space-y-1">
              <li>醫師個人可能受到醫師公會懲戒</li>
              <li>嚴重違規者可能被衛福部列入特別監督對象</li>
            </ul>
          </li>
        </ol>
      </div>
      
      <div className="mb-3">
        <p className="mb-2"><strong>近年處罰趨勢：</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>衛福部加重對特定領域的稽查強度，如醫美、牙科、生殖醫學等</li>
          <li>對於社群媒體違規行為的罰則執行更加嚴格</li>
          <li>多次違規者通常會受到累進式處罰</li>
          <li>對知名度高的醫療機構或醫師的監管更加嚴格</li>
        </ul>
      </div>
      
      <p className="mb-2">除了罰款外，違規事件可能對醫療機構造成<strong>品牌聲譽損害</strong>與<strong>患者信任流失</strong>，這些非金錢損失往往比罰款本身更為嚴重。</p>
      
      <p className="text-gray-700 italic text-sm">※ 實例：2023年某知名連鎖醫美診所因在社群媒體上發布誇大療效聲明，不僅被處以25萬元罰鍰(最高額度)，更因媒體報導導致品牌形象受損，預約量下降達30%。</p>
    </>
  },
  {
    question: '醫療法第85條和第86條規定的具體限制有哪些？',
    answer: <>
      <p className="mb-3">醫療法第85條和第86條對醫療廣告有非常明確的限制：</p>
      
      <div className="mb-3">
        <p className="mb-2"><strong>醫療法第85條規定廣告內容限制：</strong></p>
        <p className="mb-2">醫療廣告內容僅限於以下事項：</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>醫療機構之名稱、開業執照字號、地址、電話及交通路線</li>
          <li>醫師之姓名、性別、學歷、經歷及其醫師、專科醫師證書字號</li>
          <li>全民健康保險及其他非商業性保險之特約醫院、診所字樣</li>
          <li>診療科別及診療時間</li>
          <li>開業、歇業、停業、復業、遷移及其年、月、日</li>
          <li>其他經中央主管機關公告容許登載或播放事項</li>
        </ol>
      </div>
      
      <div className="mb-3">
        <p className="mb-2"><strong>醫療法第86條規定廣告方式限制：</strong></p>
        <p className="mb-2">醫療廣告不得以下列方式為之：</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>假借他人名義為宣傳</li>
          <li>利用出售或贈與醫療刊物為宣傳</li>
          <li>以公開祖傳秘方或公開答問為宣傳</li>
          <li>摘錄醫學刊物內容為宣傳</li>
          <li>藉採訪或報導為宣傳</li>
          <li>與違反前條規定內容之廣告聯合或並排為宣傳</li>
          <li>以其他不正當方式為宣傳</li>
        </ol>
      </div>
      
      <p className="mb-3"><strong>重要例外：網際網路資訊</strong></p>
      <p className="mb-3">依據醫療法第85條第3項規定，醫療機構以網際網路提供之資訊，不受第一項所定內容範圍限制，但須符合《醫療機構網際網路資訊管理辦法》的規範，包括不得有誇大、不實、禁止比較性內容等要求。</p>
      
      <p className="text-gray-700 italic text-sm">※ 實務提醒：雖然網路內容不受第85條第1項內容限制，但仍不得有不實、誇大、禁止或過度宣傳療效等內容，亦不得以第86條禁止的方式進行宣傳。2023年起，衛福部對網路內容監管更加嚴格，特別是社群媒體平台內容。</p>
    </>
  },
  {
    question: '診所和醫師如何在法規限制下進行有效的醫療行銷？',
    answer: <>
      <p className="mb-3">在嚴格的醫療法規框架下，診所和醫師仍有多種<strong>合法有效</strong>的行銷策略：</p>
      
      <div className="mb-3">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>專業衛教內容行銷</strong>
            <p className="text-sm text-gray-700 mt-1">透過分享專業醫療知識、疾病預防資訊與健康管理建議，建立專業權威形象，同時提供實質價值給潛在患者，避免直接宣傳療效或服務。</p>
          </li>
          
          <li>
            <strong>診所環境與專業設備展示</strong>
            <p className="text-sm text-gray-700 mt-1">客觀展示診所環境、設備及服務流程，讓患者了解就醫體驗，但須避免使用「最先進」、「頂級」等誇大或比較性用語。</p>
          </li>
          
          <li>
            <strong>醫師專業背景與進修經歷分享</strong>
            <p className="text-sm text-gray-700 mt-1">強調醫師的教育背景、專業資格、進修經歷及參與的學術活動，但應僅呈現客觀事實，避免「專家」、「權威」等自我標榜詞彙。</p>
          </li>
          
          <li>
            <strong>適當的病例分享</strong>
            <p className="text-sm text-gray-700 mt-1">在取得患者明確書面同意且妥善去識別化的前提下，分享真實病例，呈現診療過程與醫師專業判斷，但不得宣稱療效保證或使用誇大詞彙。</p>
          </li>
          
          <li>
            <strong>建立社群媒體互動策略</strong>
            <p className="text-sm text-gray-700 mt-1">在社群平台上與患者互動，回答醫療相關問題，但應避免個案診斷或治療建議，且互動內容應以教育性質為主。</p>
          </li>
          
          <li>
            <strong>發展與專業相關的個人品牌</strong>
            <p className="text-sm text-gray-700 mt-1">醫師可透過參與公益活動、發表學術研究、受邀演講等方式，建立專業個人品牌，間接提升診所能見度。</p>
          </li>
        </ol>
      </div>
      
      <div className="mb-3">
        <p className="mb-2"><strong>實踐提示：</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>建立內部審核機制，確保所有對外內容都經過法規審查</li>
          <li>培訓診所人員了解醫療廣告法規界限</li>
          <li>諮詢專業醫療行銷顧問，設計合規且有效的行銷方案</li>
          <li>定期追蹤法規變化，及時調整行銷策略</li>
          <li>重視內容品質與專業深度，而非營銷性質與數量</li>
        </ul>
      </div>
      
      <p className="text-gray-700 italic text-sm">※ 成功案例：台北某牙醫診所改變行銷策略後，將90%的內容轉為專業口腔健康知識分享，10%呈現診所服務與醫師背景，在合規的前提下，三個月內網站流量提升35%，新患轉換率增加22%。</p>
    </>
  },
  {
    question: '衛福部容許登載哪些醫療廣告內容？',
    answer: <>
      <p className="mb-3">依據衛福部民國103年1月24日公告的「醫療法第八十五條第一項第六款所定容許登載或播放之醫療廣告事項」，明確規範了可合法刊登的醫療廣告內容：</p>
      
      <div className="mb-3">
        <p className="mb-2"><strong>一、基本容許項目</strong> (在符合醫學倫理，傳遞正確醫療資訊前提下)：</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>疾病名稱</li>
          <li>診療項目、檢查及檢驗項目</li>
          <li>醫療儀器及經完成人體檢驗之醫療技術</li>
          <li>醫療費用</li>
        </ol>
      </div>
      
      <div className="mb-3">
        <p className="mb-2"><strong>二、國際醫療服務廣告</strong> (需事前報主管機關許可)：</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>分項醫療服務或組合式醫療服務項目、費用及其優惠措施之說明</li>
          <li>結合相關業者共同提供之服務項目、費用及其優惠措施之說明</li>
          <li>其他有關服務特色之說明</li>
        </ol>
      </div>
      
      <p className="mb-3"><strong>三、兼辦醫療業務</strong>：</p>
      <p className="mb-3">醫療機構有具多重醫事人員資格者(如醫師、中醫師、牙醫師)辦理執業登記，在符合相關規定時，得於招牌之醫療機構名稱後以較小字體，加註「兼辦自費西醫(中醫或牙醫)診療，服務」字樣。</p>
      
      <div className="mb-3">
        <p className="mb-2"><strong>重要注意事項：</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>雖有上述容許項目，但仍不得有誇大、保證療效、不實或引人錯誤之表述</li>
          <li>不得使用「最佳」、「最高級」等比較性用語</li>
          <li>不得暗示其服務品質或療效優於其他醫療機構</li>
          <li>廣告費用項目不得以「特價」、「優惠」等商業促銷手法呈現</li>
          <li>須注意醫療機構網際網路資訊管理辦法的相關規定</li>
        </ul>
      </div>
      
      <p className="text-gray-700 italic text-sm">※ 資料來源：衛生福利部醫事司醫療廣告管理專區，<a href="https://dep.mohw.gov.tw/DOMA/cp-2708-38120-106.html" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://dep.mohw.gov.tw/DOMA/cp-2708-38120-106.html</a></p>
    </>
  }
]

// 添加醫療法規參考資料
const legalReferences = [
  {
    title: '衛生福利部醫事司 - 醫療法規專區',
    url: 'https://dep.mohw.gov.tw/DOMA/',
    description: '台灣醫療法規最新動態、法規解釋及相關公告',
    type: '官方資源'
  },
  {
    title: '醫療法第85條、第86條修正條文與解釋',
    url: 'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0020021',
    description: '醫療廣告相關法條最新版本及修法說明',
    type: '法規條文'
  },
  {
    title: '醫療機構網際網路資訊管理辦法 - 衛福部',
    url: 'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0020165',
    description: '規範醫療機構網站與社群媒體內容管理規範',
    type: '子法規'
  },
  {
    title: '台灣醫療廣告違規案例彙編 (2022-2023)',
    url: '#',
    description: '彙整各縣市衛生局公告之違規案例與裁罰依據',
    type: '案例彙編'
  },
  {
    title: '醫師公會全國聯合會 - 醫療廣告自律規範',
    url: 'https://www.tma.tw/',
    description: '醫師公會發布的醫療廣告自律規範與建議實務',
    type: '專業組織'
  },
  {
    title: '醫療廣告臨床實務指引 - 台灣醫療法學會',
    url: '#',
    description: '專業組織提供的醫療廣告實務操作指南',
    type: '實務指引'
  }
];

// 添加參考資料卡片組件
const ReferenceCard = ({ reference }: { reference: typeof legalReferences[0] }) => {
  return (
    <Link href={reference.url} target="_blank" rel="noopener noreferrer">
      <div className={`${CARD_BASE_STYLE} hover:border-primary/30 p-5`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-md font-semibold text-gray-900">{reference.title}</h3>
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {reference.type}
          </span>
        </div>
        <p className="text-sm text-gray-600">{reference.description}</p>
      </div>
    </Link>
  );
};

// 指南使用建議步驟
const guideUsageTips = [
  {
    title: '診所自我評估',
    description: '使用本指南的違規類型清單，對照您現有的廣告內容、社群帳號、網站等進行初步自我評估，找出潛在風險點。',
    icon: <FileText className="w-6 h-6 text-primary" />
  },
  {
    title: '優先處理高風險區域',
    description: '根據統計數據，社群媒體帳號、價格宣傳文字、療效描述是最常被衛生局稽查的重點區域，建議優先檢視並改善這些區域的內容。',
    icon: <AlertTriangle className="w-6 h-6 text-primary" />
  },
  {
    title: '建立合規審核機制',
    description: '為診所建立標準化的內容發布審核機制，所有對外宣傳內容都應經過法規審核後再發布，特別是由外部廠商製作的廣告素材。',
    icon: <Shield className="w-6 h-6 text-primary" />
  },
  {
    title: '諮詢專業法規顧問',
    description: '若有疑慮或需要專業意見，建議諮詢熟悉醫療法規的專業顧問，或直接洽詢當地衛生局法規單位獲取明確指引。',
    icon: <Gavel className="w-6 h-6 text-primary" />
  }
];

// 指南使用建議卡片組件
const GuideTipCard = ({ tip }: { tip: typeof guideUsageTips[0] }) => {
  return (
    <div className={`${CARD_BASE_STYLE} ${CARD_HOVER_EFFECT} p-5`}>
      <div className="flex items-center mb-4">
        <div className="p-2 bg-primary/10 rounded-full mr-3">
          {tip.icon}
        </div>
        <h3 className={`text-lg ${HEADING_STYLE}`}>{tip.title}</h3>
      </div>
      <p className="text-gray-600 text-sm">{tip.description}</p>
    </div>
  );
};

// 將重複使用的通用樣式提取為常量
const CARD_BASE_STYLE = "bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300";
const CARD_HOVER_EFFECT = "hover:border-primary/20";
const HEADING_STYLE = "font-bold text-gray-900";
const TEXT_STYLE = "text-gray-600";
const ICON_WRAPPER = "rounded-full";

// 流程步驟組件
const ProcessStep = ({ step, index }: { step: typeof complianceProcess[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1 * index }}
      className="relative pl-12 md:pl-16"
      role="listitem"
      aria-label={`步驟 ${step.step}: ${step.title}`}
    >
      <div className="flex items-start">
        <div className="absolute left-0 sm:left-0 flex items-center justify-center">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full font-bold text-lg z-10" aria-hidden="true">
            {step.step}
          </div>
        </div>
        <div className={`${CARD_BASE_STYLE} ${CARD_HOVER_EFFECT} p-6 w-full`}>
          <h3 className={`text-xl ${HEADING_STYLE} mb-2`}>{step.title}</h3>
          <p className={TEXT_STYLE}>{step.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

// 服務卡片組件
const ServiceCard = ({ service, index }: { service: typeof complianceServices[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${CARD_BASE_STYLE} ${CARD_HOVER_EFFECT} p-6 sm:p-8`}
      role="article"
      aria-labelledby={`service-title-${index}`}
    >
      <div className="mb-6" aria-hidden="true">
        {service.icon}
      </div>
      <h3 id={`service-title-${index}`} className={`text-xl sm:text-2xl ${HEADING_STYLE} mb-4`}>{service.title}</h3>
      <p className={`${TEXT_STYLE} mb-6`}>{service.description}</p>
      <div className="pt-4 border-t border-gray-200">
        <ul className="text-sm text-gray-600 space-y-2" aria-label={`${service.title}包含的服務項目`}>
          {service.items.map((item, idx) => (
            <li key={idx} className="flex items-start">
              <CheckCircle className="text-primary w-4 h-4 mr-2 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// 違規類型卡片組件
const ViolationCard = ({ violation, index }: { violation: typeof commonViolations[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${CARD_BASE_STYLE} p-6`}
      role="article"
      aria-labelledby={`violation-title-${index}`}
    >
      <div className="flex items-start mb-4">
        <div className="bg-red-50 p-2 rounded-full" aria-hidden="true">
          {violation.icon}
        </div>
        <h3 id={`violation-title-${index}`} className={`text-lg ${HEADING_STYLE} ml-3 mt-1`}>{violation.title}</h3>
      </div>
      <p className={`${TEXT_STYLE} mb-4 text-sm`}>{violation.description}</p>
      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-start mt-2">
          <CheckCircle className="text-green-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-gray-700">{violation.solution}</p>
        </div>
        <div className="mt-3 bg-gray-50 p-3 rounded-md text-xs text-gray-600 italic">
          <span className="font-semibold text-red-600">違規案例：</span> {violation.example}
        </div>
      </div>
    </motion.div>
  )
}

// 案例研究卡片組件
const CaseStudyCard = ({ caseStudy, index }: { caseStudy: typeof complianceCaseStudies[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${CARD_BASE_STYLE} ${CARD_HOVER_EFFECT} p-6`}
      role="article"
      aria-labelledby={`case-study-title-${index}`}
    >
      <h3 id={`case-study-title-${index}`} className="text-xl font-bold mb-4 text-primary">{caseStudy.title}</h3>
      <div className="space-y-4 text-sm">
        <div>
          <p className="font-semibold text-gray-900 mb-1">挑戰:</p>
          <p className={TEXT_STYLE}>{caseStudy.challenge}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900 mb-1">解決方案:</p>
          <p className={TEXT_STYLE}>{caseStudy.solution}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900 mb-1">成果:</p>
          <p className={TEXT_STYLE}>{caseStudy.result}</p>
        </div>
      </div>
    </motion.div>
  )
}

// 法規重點卡片組件
const RegulationCard = ({ regulation, index }: { regulation: typeof taiwanMedicalAdRegulations[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${CARD_BASE_STYLE} p-6`}
      role="article"
      aria-labelledby={`regulation-title-${index}`}
    >
      <div className="flex items-start mb-4">
        <div className="bg-primary/10 rounded-full p-2" aria-hidden="true">
          {regulation.icon}
        </div>
        <h3 id={`regulation-title-${index}`} className={`text-lg ${HEADING_STYLE} ml-4 mt-2`}>{regulation.title}</h3>
      </div>
      <div className={TEXT_STYLE}>{regulation.description}</div>
    </motion.div>
  )
}

// FAQ項目組件
const FAQItem = ({ faq, index }: { faq: typeof medicalAdFAQs[0]; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const headingId = `faq-heading-${index}`;
  const contentId = `faq-content-${index}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 text-left bg-white transition-all duration-300 hover:bg-gray-50 px-6"
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={headingId}
      >
        <h3 className="text-lg font-semibold pr-8 text-gray-800">{faq.question}</h3>
        <div className="flex-shrink-0" aria-hidden="true">
          {isOpen ? (
            <MinusCircle className="w-5 h-5 text-primary" />
          ) : (
            <PlusCircle className="w-5 h-5 text-primary" />
          )}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0, 
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-gray-50/50"
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        hidden={!isOpen}
      >
        <div className="p-6 pt-4 text-gray-700">
          {faq.answer}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function MedicalAdCompliancePage() {
  // 定義滾動深度追蹤函數
  const trackScrollDepth = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.offsetHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = scrollTop / (docHeight - winHeight) * 100;
    
    // 在特定滾動深度時觸發事件
    const depths = [25, 50, 75, 90];
    depths.forEach(depth => {
      if (scrollPercent >= depth && !localStorage.getItem(`scrollDepth_${depth}`)) {
        pushEvent('scroll_depth', { depth: `${depth}%`, page: '醫療廣告法規遵循' });
        localStorage.setItem(`scrollDepth_${depth}`, 'true');
        
        // 24小時後重置
        setTimeout(() => {
          localStorage.removeItem(`scrollDepth_${depth}`);
        }, 24 * 60 * 60 * 1000);
      }
    });
  };
  
  // 服務頁面瀏覽追蹤
  useEffect(() => {
    // 追蹤頁面瀏覽
    trackServiceView('醫療廣告法規遵循服務', '/service/medical-ad-compliance')
    
    // 追蹤頁面滾動深度
    window.addEventListener('scroll', trackScrollDepth)
    
    return () => {
      window.removeEventListener('scroll', trackScrollDepth)
    }
  }, []);

  // 只保留 FAQPage 結構化數據
  useEffect(() => {
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    
    const faqItems = medicalAdFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": typeof faq.answer === 'string' ? faq.answer : "請參考網頁內容查看詳細回答"
      }
    }));
    
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com';
    const SERVICE_URL = `${BASE_URL}/service/medical-ad-compliance`;
    
    faqScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${SERVICE_URL}#faq-data`,
      "mainEntity": faqItems,
      "isPartOf": {
        "@id": `${SERVICE_URL}#webpage`
      },
      "about": {
        "@id": `${SERVICE_URL}#service`
      }
    });
    
    document.head.appendChild(faqScript);
    
    return () => {
      if (faqScript.parentNode) {
        faqScript.parentNode.removeChild(faqScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-black overflow-hidden">
        {/* 背景組件 */}
        <div className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/bgline-w-small.webp"
              alt="背景圖案"
              fill
              priority
              quality={30}
              sizes="100vw"
              className="object-cover opacity-30"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoQAAYABUB8JZwAAp3OPvwA/v7u/wD+/u7/AP7+7v8A/v7u/wD+/u7/AA=="
            />
          </div>
          <PageHeader
            title="醫療廣告與法規遵循"
            description="合法有效的醫療行銷策略，降低違規風險，建立合規專業形象"
            variant="red"
            size="md"
            alignment="center"
            backgroundImage="/images/bgline-w.webp"
            className="border-b border-primary relative z-10"
          />
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 pt-16 pb-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
            >
              在合規的基礎上打造有效醫療品牌
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-200 mb-8"
            >
              醫療廣告法規複雜嚴格，一不小心就可能面臨處罰與聲譽受損。我們專精於醫療法規遵循，
              協助診所與醫療機構在合法的前提下，最大化行銷效果，打造專業且值得信賴的品牌形象。
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link
                href="/contact"
                onClick={() => trackButtonClick('預約免費法規諮詢', 'hero區塊', { button_type: 'primary' })}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md transition-all duration-300 w-full sm:w-auto text-center"
                role="button"
                aria-label="預約免費法規諮詢"
                data-tracking="hero_cta_primary"
              >
                預約免費法規諮詢
              </Link>
              <Link
                href="#violations"
                onClick={() => trackButtonClick('瞭解常見違規類型', 'hero區塊', { button_type: 'secondary' })}
                className="px-8 py-3 bg-white hover:bg-gray-100 text-primary font-semibold rounded-md transition-all duration-300 w-full sm:w-auto text-center"
                role="button"
                aria-label="瞭解常見違規類型"
                data-tracking="hero_cta_secondary"
              >
                瞭解常見違規類型
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 如何使用本指南 - 新增區塊 */}
      <section className="py-16 md:py-20 bg-white border-b border-gray-100" id="guide" aria-labelledby="guide-heading">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full">
              實用指引
            </span>
            <h2 id="guide-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              如何<span className="text-primary">有效使用</span>本指南
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-6 text-gray-600 leading-relaxed">
              為診所經營者和行銷團隊提供的實用步驟，幫助您將本指南的內容轉化為實際行動
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {guideUsageTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GuideTipCard tip={tip} />
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="/contact"
              onClick={() => trackButtonClick('預約免費合規評估諮詢', '實用指引區塊', { button_type: 'text_link' })}
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-colors duration-300"
              data-tracking="guide_cta"
              aria-label="預約免費合規評估諮詢"
            >
              <span>預約免費合規評估諮詢</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* 台灣醫療廣告法規重點 */}
      <section className="py-16 md:py-24 bg-white" id="regulations" aria-labelledby="regulations-heading">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full">
              法規基礎知識
            </span>
            <h2 id="regulations-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              台灣<span className="text-primary">醫療廣告法規</span>重點
            </h2>
            <p className="text-base sm:text-lg max-w-3xl mx-auto px-4 sm:px-6 text-gray-600 leading-relaxed">
              了解台灣醫療法規的關鍵內容，是醫療行銷合規的第一步。我們持續追蹤最新法規動態，確保您的廣告策略始終符合現行規範。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {taiwanMedicalAdRegulations.map((regulation, index) => (
              <RegulationCard key={index} regulation={regulation} index={index} />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto mt-12 p-5 bg-yellow-50 rounded-lg border border-yellow-200"
          >
            <div className="flex items-start">
              <Info className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>重要提醒：</strong> 醫療法規持續更新中，目前衛福部正在研議《醫療機構媒體廣告管理辦法》，預計2024年將對醫療廣告進行更全面且嚴格的規範。建議診所定期檢視自身行銷內容並諮詢專業顧問，及時調整以符合最新法規要求。
                </p>
                <p className="text-xs text-yellow-700 mt-2">
                  資料來源：衛生福利部醫事司「醫療廣告管理專區」(<a href="https://dep.mohw.gov.tw/DOMA/cp-2708-38120-106.html" className="text-yellow-800 hover:underline" target="_blank" rel="noopener noreferrer">https://dep.mohw.gov.tw/DOMA/cp-2708-38120-106.html</a>)，最後更新日期：113年4月12日
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 服務項目區塊 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full">
              合規服務項目
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              全方位醫療廣告<span className="text-primary">法規遵循</span>解決方案
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-6 text-gray-600 leading-relaxed">
              從內容審核到策略規劃，從員工培訓到持續監測，我們提供完整的醫療行銷合規方案
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {complianceServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 違規風險與解決方案 */}
      <section id="violations" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-red-100 text-red-600 rounded-full">
              需要注意的重點
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              常見醫療廣告<span className="text-red-600">違規類型</span>與解決方案
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-6 text-gray-600 leading-relaxed">
              了解衛福部常見查核重點，避免無意間踩到法規紅線，以下為台灣地區常見醫療廣告違規案例
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonViolations.map((violation, index) => (
              <ViolationCard key={index} violation={violation} index={index} />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 p-5 bg-red-50 rounded-lg border border-red-100 max-w-3xl mx-auto"
          >
            <div className="flex items-start">
              <Info className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 mb-2">
                  <strong>法規執法趨勢提醒：</strong> 衛福部2023年起加強對醫療機構社群媒體內容稽查，特別針對醫美、牙科、生殖醫學等高風險領域。台北市、台中市、高雄市等地方衛生局亦成立專責稽查小組，主動監測轄區內醫療機構網路宣傳內容。
                </p>
                <p className="text-xs text-red-700">違規成本提高 - 首次違規平均罰款由往年約12萬元提高至18萬元，再犯者處分更加嚴厲。</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 法規遵循統計 - 更新數據 */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                醫療廣告違規的代價高昂
              </h2>
              <p className="text-gray-300 text-lg">
                違反醫療法規不僅面臨罰款，更可能損害診所長期建立的專業形象與患者信任
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800 p-6 rounded-lg"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">25萬元</p>
                <p className="text-xl text-gray-300 mb-2">最高罰款</p>
                <p className="text-sm text-gray-400">違反醫療法第84條、第85條或第86條醫療廣告規定的最高單次罰款金額</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800 p-6 rounded-lg"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">78%</p>
                <p className="text-xl text-gray-300 mb-2">查核不合格率</p>
                <p className="text-sm text-gray-400">2023年衛福部抽查的醫療診所社群媒體不符合規定比例</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800 p-6 rounded-lg"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">92%</p>
                <p className="text-xl text-gray-300 mb-2">患者信任流失</p>
                <p className="text-sm text-gray-400">因違規被處分的診所面臨的患者信任度下降比例</p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center bg-gray-800 p-6 rounded-lg"
            >
              <p className="text-xl text-primary font-semibold mb-2">2023年重點數據</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3">
                  <p className="text-2xl font-bold text-white">468件</p>
                  <p className="text-sm text-gray-400">違規案件總數</p>
                </div>
                <div className="p-3">
                  <p className="text-2xl font-bold text-white">18.6萬</p>
                  <p className="text-sm text-gray-400">平均罰款金額</p>
                </div>
                <div className="p-3">
                  <p className="text-2xl font-bold text-white">58%</p>
                  <p className="text-sm text-gray-400">社群媒體違規佔比</p>
                </div>
                <div className="p-3">
                  <p className="text-2xl font-bold text-white">42%</p>
                  <p className="text-sm text-gray-400">違規再犯率</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">資料來源：衛生福利部醫事司2023年醫療廣告稽查年度報告</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 案例研究 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full">
              成功案例
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              醫療廣告<span className="text-primary">合規轉型</span>案例研究
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-6 text-gray-600 leading-relaxed">
              看看其他診所如何在我們的協助下實現合規轉型，同時提升行銷效果
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {complianceCaseStudies.map((caseStudy, index) => (
              <CaseStudyCard key={index} caseStudy={caseStudy} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 服務流程 */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full">
              合規服務流程
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              透明高效的<span className="text-primary">合規轉型</span>流程
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-6 text-gray-600 leading-relaxed">
              從初步評估到長期監測，我們建立系統化流程，確保您的醫療行銷始終合規有效
            </p>
          </motion.div>

          <div className="px-4 sm:px-8 relative max-w-4xl mx-auto">
            <motion.div 
              className="absolute top-0 bottom-0 left-5 sm:left-9 w-1 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20 rounded-full hidden sm:block" 
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <div className="space-y-6 sm:space-y-8" role="list" aria-label="合規轉型流程步驟">
              {complianceProcess.map((step, index) => (
                <ProcessStep key={step.step} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 參考資料與研究報告 - 新增區塊 */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-gray-100 text-gray-800 rounded-full">
              資料來源
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              醫療廣告法規<span className="text-primary">參考資料</span>
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-6 text-gray-600 leading-relaxed">
              本頁內容參考最新法規資料與研究報告，確保提供您最準確的醫療廣告合規指引
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalReferences.map((reference, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ReferenceCard reference={reference} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 常見問答 FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full">
              常見問題
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              醫療廣告法規<span className="text-primary">常見問答</span>
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-6 text-gray-600 leading-relaxed">
              解答醫療行銷人員與醫療專業人士最常遇到的法規疑問
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {medicalAdFAQs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA區段 */}
      <CTASection 
        title="讓您的醫療行銷既合規又有效"
        description="與我們專業團隊聯繫，為您的診所打造合法有效的醫療行銷策略"
        primaryButton={{
          href: "/contact",
          text: "聯絡我們",
          variant: "white",
          className: "cta-primary-button" // 添加特殊類名用於後續附加事件監聽
        }}
        secondaryButton={{
          href: "/service",
          text: "了解其他服務",
          variant: "black",
          className: "cta-secondary-button" // 添加特殊類名用於後續附加事件監聽
        }}
      />

      {/* 為CTA按鈕添加事件追蹤 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              var primaryBtn = document.querySelector('.cta-primary-button');
              var secondaryBtn = document.querySelector('.cta-secondary-button');
              
              if (primaryBtn) {
                primaryBtn.addEventListener('click', function() {
                  if (window.dataLayer) {
                    window.dataLayer.push({
                      event: 'button_click',
                      button_name: '聯絡我們',
                      button_location: 'CTA區塊',
                      button_type: 'primary_cta',
                      timestamp: new Date().toISOString()
                    });
                  }
                });
              }
              
              if (secondaryBtn) {
                secondaryBtn.addEventListener('click', function() {
                  if (window.dataLayer) {
                    window.dataLayer.push({
                      event: 'button_click',
                      button_name: '了解其他服務',
                      button_location: 'CTA區塊',
                      button_type: 'secondary_cta',
                      timestamp: new Date().toISOString()
                    });
                  }
                });
              }
            });
          `
        }}
      ></script>

      {/* 醫療廣告合規資源中心 */}
      <section className="py-16 md:py-24 bg-white" id="resources" aria-labelledby="resources-heading">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs sm:text-sm font-medium mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full">
              醫療廣告合規資源
            </span>
            <h2 id="resources-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              <span className="text-primary">實用指南</span>與參考資料
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-6 text-gray-600 leading-relaxed">
              我們提供醫療廣告法規專業知識，幫助醫療機構審核廣告內容、管理合規風險，建立有效且符合法規的行銷流程
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-5xl mx-auto"
            data-testid="medical-resource-tabs"
          >
            {/* 引入醫療資源分頁組件 */}
            <MedicalResourceTabs />
          </motion.div>
        </div>
      </section>
    </div>
  )
} 