'use client'

import React, { useState, useCallback, useMemo, memo } from 'react'
import { motion } from 'framer-motion'

// FAQ數據
const faqs = [
  {
    question: '為什麼專科診所需要專業的行銷顧問？',
    answer: '在充滿競爭的醫療環境中，專業與信任是吸引患者的關鍵。\n\n許多優秀的醫師專注於提供卓越的診療服務，卻往往忽略了如何有效地傳達自身的專業價值。我們理解，您的時間應該專注在為患者提供最好的照護，而非鑽研數位行銷的複雜策略。\n\n專業醫療行銷顧問能彌補這個落差，我們不只是行銷團隊，更是您診所成長的合作夥伴。透過深入了解您的診療理念和特色，我們幫助您的專業被更多需要的患者看見，建立長遠的診所品牌價值，讓優質的醫療服務能觸及更廣泛的社群。',
    category: '行銷基礎'
  },
  {
    question: '您們如何理解我診所的特殊需求和市場定位？',
    answer: '每一間診所都有獨特的靈魂和故事，我們的首要任務就是傾聽和理解這個故事。\n\n我們的合作始於深度診斷階段，包含：\n\n1. 院長願景訪談\n- 透過一對一深度對談，了解您對診所的願景、醫療理念與價值觀\n- 挖掘您最想幫助的患者類型及其需求\n\n2. 診所差異化分析\n- 實地參訪您的診所環境與工作流程\n- 與醫療團隊互動，了解內部文化與專長\n\n3. 市場定位研究\n- 分析地區競爭環境與機會\n- 確認目標患者群體的真實需求與痛點\n\n這個過程不只是資料收集，而是真正融入您的診所文化，感受您對醫療的熱忱與理念。唯有真正理解，才能打造出真實反映診所靈魂的行銷策略。',
    category: '合作流程'
  },
  {
    question: '醫療行銷有什麼特殊的法規限制需要注意？',
    answer: '醫療行銷需要在專業、真實與合規之間取得平衡，我們深知這道平衡的重要性。\n\n醫療廣告受《醫療法》第85條與《醫療廣告管理辦法》嚴格規範，我們的專業團隊會確保所有行銷內容完全合規：\n\n1. 內容審核機制\n- 由具醫療背景的專業審稿團隊把關\n- 每項內容皆遵循醫療廣告法規標準審核\n\n2. 避免常見法律陷阱\n- 不使用明確療效保證或誇大宣傳\n- 不進行不當價格比較或促銷手法\n- 患者見證遵循合規處理方式\n\n3. 專業表達技巧\n- 運用合規的敘事方式傳達專業價值\n- 以衛教資訊取代直接療效宣傳\n\n我們的行銷策略不僅是合規的，更是能有效傳達您專業價值的。在我們的合作過程中，您也將了解如何在法規框架內，最大化地展現診所的專業與特色。',
    category: '行銷基礎'
  },
  {
    question: 'AI技術如何應用在診所的數位行銷中？',
    answer: 'AI不只是流行詞彙，而是能為診所帶來實際價值的強大工具。\n\n我們整合前沿AI技術與醫療行銷專業，為您的診所創造智慧化的成長策略：\n\n1. 患者洞察與分析\n- AI驅動的數據分析，精準了解患者行為模式\n- 預測性分析協助識別潛在高價值患者群體\n\n2. 個人化內容策略\n- 智能內容系統根據不同患者需求自動調整訊息\n- AI輔助創作系統產生引人共鳴的專業內容\n\n3. 智慧化行銷優化\n- 實時投放效益分析與自動調整\n- 多管道協同最佳化，提升整體轉換率\n\n4. 診所運營智能化\n- 智能預約系統改善患者體驗\n- 自動化跟進機制提升回診率\n\n我們的AI技術不是為了取代人性化服務，而是讓您能更專注於與患者建立真誠連結。透過數據洞察和流程優化，您將能提供更貼心、更個人化的醫療體驗。',
    category: '行銷基礎'
  },
  {
    question: '如何評估行銷投資的實際回報？',
    answer: '醫療行銷不應是模糊的開支，而是能清楚衡量成效的策略性投資。\n\n我們建立全方位的ROI追蹤系統，讓每一分投資都能量化評估：\n\n1. 診所關鍵績效指標\n- 新患成長率：追蹤不同管道帶來的新患數量與品質\n- 預約轉換率：評估從諮詢到實際就診的轉換效率\n- 患者生命週期價值：分析長期患者價值而非單次就診\n\n2. 即時監控儀表板\n- 專屬數據中心，隨時查看行銷成效\n- 自動化報表，每週更新關鍵指標\n\n3. 投資報酬計算\n- 透明的成本效益分析\n- 不同行銷管道的投資回報比較\n\n我們的合作不是基於空泛的承諾，而是建立在實際績效上。平均而言，我們的客戶在6個月後能看到3-5倍的行銷投資回報，更重要的是，這些成長是可持續的，為診所建立長期競爭優勢。',
    category: '成效評估'
  },
  {
    question: '診所沒有大量預算，有適合的行銷方案嗎？',
    answer: '我們相信優質的醫療行銷不應該只是大型診所的專利，每一位認真執業的醫師都值得被更多患者看見。\n\n我們針對不同規模的診所設計了彈性的成長方案：\n\n1. 階段式成長模型\n- 從核心基礎建設開始，逐步擴展行銷範疇\n- 優先投資高回報管道，確保資源最大化運用\n\n2. 精準小預算策略\n- 聚焦區域性目標患者，不浪費預算在無效觸及\n- 善用免費或低成本管道，如Google商家檔案優化、社群自然成長策略\n\n3. 合作共贏模式\n- 彈性付費機制，部分報酬與實際成效連結\n- 成長顧問角色，教導診所團隊逐步建立自主行銷能力\n\n我們深信：重要的不是行銷預算的大小，而是策略的精準度。許多我們最成功的案例，都是從小規模合作開始，隨著初期成效顯現，再逐步擴大投資範圍。',
    category: '成本效益'
  }
];

// FAQ組件
export const HomeFAQSection = memo(function HomeFAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // 定義FAQ分類
  const categories = useMemo(() => {
    const categorySet = new Set(faqs.map(faq => faq.category));
    return ['全部問題', ...Array.from(categorySet)];
  }, []);
  
  const [activeCategory, setActiveCategory] = useState('全部問題');
  
  // 過濾FAQ
  const filteredFaqs = useMemo(() => {
    if (activeCategory === '全部問題') {
      return faqs;
    }
    return faqs.filter(faq => faq.category === activeCategory);
  }, [activeCategory]);
  
  // 切換FAQ開關狀態
  const toggleFaq = useCallback((id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  }, [openFaq]);

  // 處理分類切換
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setOpenFaq(null);
  }, []);
  
  // 格式化FAQ答案，處理換行
  const formatAnswer = useCallback((answer: string) => {
    // 根據雙換行符分割段落
    const paragraphs = answer.split('\n\n');
    
    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, idx) => {
          // 如果段落包含列表項目（以"- "開頭的行）
          if (paragraph.includes('\n- ')) {
            const [listTitle, ...listItems] = paragraph.split('\n- ');
            return (
              <div key={idx} className="space-y-2">
                <p className="font-medium text-gray-800">{listTitle}</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5">
                  {listItems.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-gray-600 text-sm sm:text-base leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            );
          }
          // 一般段落
          return <p key={idx} className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">{paragraph}</p>;
        })}
      </div>
    );
  }, []);
  
  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="container-custom max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">常見問題</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我們整理了關於數位行銷的常見問題，協助您更了解如何透過專業行銷策略提升診所業績
          </p>
        </div>
        
        {/* 類別選擇器 */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* FAQ列表 */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-gray-50"
              >
                <h3 className="font-semibold text-base sm:text-lg pr-8 text-gray-900">{faq.question}</h3>
                <div className={`transform transition-transform duration-300 ${
                  openFaq === index ? 'rotate-180' : ''
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              
              {/* 答案區塊 */}
              {openFaq === index && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6 pt-2 border-t border-gray-100"
                >
                  {formatAnswer(faq.answer)}
                  <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                    <p>還有其他問題？<a href="/contact" className="text-primary hover:underline">聯絡我們</a>獲取專業建議</p>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}); 