import { CaseStudy } from '@/types/case';

/**
 * 案例資料模型 - 集中管理網站的案例資料
 * 用於案例頁面、sitemap 生成等功能
 */
export const caseStudies: CaseStudy[] = [
  {
    id: 'artisticdc',
    name: '雅德思牙醫診所',
    category: '品牌重塑',
    description: '從傳統診所到數位化品牌的成功轉型，透過整合性行銷策略，在短短 2 個月內實現顯著成長：',
    metrics: [
      { value: '1000', label: '每月患者預約' },
      { value: '300%', label: '年營業額成長' },
      { value: '100%', label: '品牌知名度提升' },
      { value: '20%', label: '每月穩定回診率成長' }
    ],
    solutions: [
      {
        title: '品牌識別系統重塑',
        description: '建立清晰的品牌定位和一致的視覺識別系統，從診所空間設計到線上形象，創造專業且現代化的品牌體驗。'
      },
      {
        title: '數位行銷策略規劃',
        description: '制定完整的數位行銷策略，包含社群媒體、內容行銷、SEO 優化等多元管道，提升線上能見度與病患互動。'
      },
      {
        title: '社群媒體經營優化',
        description: '針對目標客群偏好，優化社群媒體策略，持續創建高品質的專業口腔衛教內容，增強診所專業形象與患者信任感。'
      },
      {
        title: '顧客體驗流程改造',
        description: '導入數位化管理系統，提升診所運營效率，優化從預約到回診的全流程體驗，建立長期忠誠度與口碑推薦系統。'
      }
    ],
    color: '#4A6CF7',
    image: '/images/cases/Case_artisticdc.jpg',
    featured: true,
    publishedDate: '2023-08-15T00:00:00Z',
    updatedDate: '2023-11-20T00:00:00Z',
    testimonial: {
      content: '透過專業的品牌重塑服務，不僅提升了診所形象，更帶來實質的營收成長。團隊的執行力和專業度令人印象深刻。',
      author: '王醫師',
      title: '診所院長'
    },
    content: `
# 從「透明」開始建立信任感

想想看，當你牙齒不舒服，踏進一間牙醫診所，心裡最渴望的是什麼？絕對不只是把牙齒弄好而已，更重要的是那份安心感。所以，雅德思在行銷的第一步，就是強調「透明化」。這聽起來很簡單，但實際執行起來卻有很多細節。

比方說，傳統的牙醫診所網站，可能只會放上醫師的資歷和診所的設備照片。但在雅德思這邊，你會看到更多關於治療流程的詳細說明，甚至連使用的材料、設備的品牌型號都清清楚楚地列出來。這就像餐廳直接把食材的產地、來源告訴你一樣，讓人覺得很放心。

有個案例讓我印象很深刻。一位長期受缺牙困擾的何先生，因為牙齦萎縮，很多美食都只能看著別人吃。他找了很多牙醫診所，但總覺得資訊不夠透明，讓他遲遲不敢做決定。後來，他在網路上看到雅德思的網站，詳細介紹了「一日全口重建」的All-on-4技術，從手術流程、使用的植體品牌，到術後的照護都寫得非常清楚。這份透明感打動了他，讓他願意踏出第一步，最終成功解決了缺牙的困擾，又可以和太太一起享受各地的美食了。這就是「透明」帶來的信任感，它能有效降低患者的疑慮，促使他們做出選擇。

# 用「故事」拉近距離

信任感建立起來之後，下一步就是拉近和患者的距離。比起冷冰冰的專業術語，人們更容易被「故事」所吸引。雅德思很擅長挖掘和分享患者的故事，這些故事往往充滿了真實的情感和力量。

還記得那位缺牙多年的張先生嗎？他是一位工程包商，長期靠抽菸、吃檳榔提神，導致牙齒狀況很差，缺牙將近二十年。這讓他非常困擾，連和朋友聚餐都覺得尷尬。雅德思的團隊就記錄了他的整個治療過程，從術前的諮詢、手術的進行，到術後重拾笑容的喜悅，都用影像和文字真實地呈現出來。

這樣的故事分享，不僅讓其他有類似困擾的患者看到希望，也展現了雅德思專業的技術和對患者的關懷。這些真實的案例，比任何華麗的廣告詞都更能打動人心。這就是「故事」的力量，它能讓潛在患者感同身受，覺得「原來也有人和我一樣，而且他們成功解決了！」

# 探索「個人化」的需求

當信任和連結都建立起來後，我們開始更深入地思考患者的「個人化」需求。每個人的牙齒狀況、預算考量、甚至對治療的恐懼程度都不同。雅德思的行銷並非一刀切，而是更注重提供客製化的解決方案。

舉例來說，有些患者可能對傳統的植牙手術感到害怕，這時候雅德思就會介紹微創植牙或舒眠植牙的選項，降低他們的恐懼感。有些患者可能預算有限，團隊就會協助他們規劃分期付款方案，讓他們在經濟壓力較小的情況下也能獲得妥善的治療。

這種「個人化」的思維，也體現在他們的線上溝通上。當患者透過社群媒體或網站諮詢時，雅德思的團隊會花時間了解他們的具體情況，提供量身定制的建議，而不是制式的回覆。這種細膩的服務，讓患者感受到被重視和理解，自然更願意選擇雅德思。

# 打造「體驗」創造口碑

最後，一個成功的行銷不僅僅是吸引新患者，更重要的是讓現有患者願意分享他們的經驗，創造口碑。雅德思深知這一點，所以他們非常注重患者的整體「體驗」。

這包含了舒適的診所環境、親切的醫護人員、專業的治療技術，以及術後的關懷追蹤。他們甚至會定期舉辦一些患者活動，讓大家有一個交流的平台。這種種細節，都是為了讓患者感受到除了治療本身之外的價值。

曾經有一位在雅德思做過矯正的年輕上班族，因為對整個治療過程非常滿意，就在自己的社群媒體上分享了她的心得和照片。她的分享吸引了很多朋友的詢問，其中不少人後來也成為了雅德思的患者。你看，好的「體驗」自然會帶來好的口碑，而口碑才是最強大的行銷力量。

總結來說，雅德思牙醫診所的行銷思路，並非只是追逐表面的流量，而是更深入地從患者的需求出發，透過「透明」建立信任、「故事」拉近距離、「個人化」滿足需求、「體驗」創造口碑。這樣有溫度、有敘事性的行銷方式，才能真正打動人心，讓牙醫診所的品牌在患者心中留下深刻的印象。
    `
  },
  {
    id: 'ytdentalcare',
    name: '雲天牙醫診所',
    category: '廣告投放',
    description: '優化廣告投放，每月新增100+NP',
    metrics: [
      { value: '35%', label: '初診患者滿意度提升' },
      { value: '20%', label: '新患者增長' },
      { value: '23%', label: '廣告成效優化' },
      { value: '40%', label: '回診率提升' }
    ],
    solutions: [
      {
        title: '空間規劃重塑',
        description: '依照診所特性與目標客群，重新規劃診療空間、候診區與服務櫃檯，建立療癒系專業風格，減輕患者就醫焦慮。'
      },
      {
        title: '視覺形象優化',
        description: '配合空間設計，整合品牌色彩、素材與視覺傳達系統，建立一致性的品牌體驗，增強品牌識別度。'
      },
      {
        title: '服務流程最佳化',
        description: '根據新空間配置，優化就診流程與動線，提升醫師診療效率與患者體驗，縮短等候時間。'
      },
      {
        title: '員工訓練計劃',
        description: '為診所團隊提供專業服務訓練，確保軟硬體品質一致，打造從進門到離開的完美診所體驗。'
      }
    ],
    color: '#8D72E1',
    image: '/images/cases/Case_ytdentalcare.jpg',
    featured: true,
    publishedDate: '2023-06-10T00:00:00Z',
    updatedDate: '2023-09-15T00:00:00Z',
    testimonial: {
      content: '全新的診所空間不只讓患者感到舒適，也讓我們的工作效率提高。專業團隊從設計到執行都給予最佳支援。',
      author: '蘇醫師',
      title: '雲天牙醫診所總院長'
    }
  },
  {
    id: 'chinese',
    name: '中華牙醫診所',
    category: '品牌重塑',
    description: '透過專業的品牌重塑服務，打造現代化且親切的診所形象，提升品牌價值與患者信任感',
    metrics: [
      { value: '180%', label: '品牌知名度提升' },
      { value: '45%', label: '新患者增長' },
      { value: '85%', label: '患者滿意度' },
      { value: '60%', label: '回診率提升' }
    ],
    solutions: [
      {
        title: '品牌識別系統建立',
        description: '設計現代化且專業的品牌識別系統，包含標誌、色彩計畫與視覺元素，建立一致的品牌形象。'
      },
      {
        title: '診所空間改造',
        description: '重新規劃診所空間，打造舒適且專業的診療環境，提升患者就醫體驗。'
      },
      {
        title: '數位行銷策略',
        description: '制定完整的數位行銷計畫，透過社群媒體與網站優化，提升線上能見度。'
      },
      {
        title: '患者服務優化',
        description: '導入數位化管理系統，優化預約流程與患者服務，提升營運效率。'
      }
    ],
    color: '#4A6CF7',
    image: '/images/cases/Case_中華.jpg',
    featured: false,
    publishedDate: '2024-01-15T00:00:00Z',
    updatedDate: '2024-02-20T00:00:00Z',
    testimonial: {
      content: '品牌重塑後，診所的整體形象更加專業現代化，患者回饋也相當正面。',
      author: '林醫師',
      title: '中華牙醫診所院長'
    }
  },
  {
    id: 'pincheng',
    name: '品誠牙醫診所',
    category: '數位轉型',
    description: '導入數位化管理系統，優化診所營運流程，提升服務效率與患者體驗',
    metrics: [
      { value: '70%', label: '行政效率提升' },
      { value: '90%', label: '患者滿意度' },
      { value: '50%', label: '營運成本降低' },
      { value: '40%', label: '新患者成長' }
    ],
    solutions: [
      {
        title: '數位管理系統導入',
        description: '整合預約、病歷、收費等管理系統，提升診所營運效率。'
      },
      {
        title: '線上預約系統優化',
        description: '建置便捷的線上預約系統，提供24小時預約服務。'
      },
      {
        title: '患者資料管理',
        description: '導入電子病歷系統，提升病歷管理效率與安全性。'
      },
      {
        title: '員工培訓計畫',
        description: '提供完整的系統使用培訓，確保團隊順利適應新系統。'
      }
    ],
    color: '#2ECC71',
    image: '/images/cases/Case_品誠.jpg',
    featured: false,
    publishedDate: '2024-01-20T00:00:00Z',
    updatedDate: '2024-02-25T00:00:00Z',
    testimonial: {
      content: '數位轉型後，診所的營運更加順暢，患者服務品質也大幅提升。',
      author: '陳醫師',
      title: '品誠牙醫診所院長'
    }
  },
  {
    id: 'chunsheng',
    name: '春生牙醫診所',
    category: '社群經營',
    description: '透過專業的社群媒體經營，建立診所專業形象，提升品牌知名度',
    metrics: [
      { value: '250%', label: '社群追蹤成長' },
      { value: '45%', label: '互動率提升' },
      { value: '35%', label: '新患者來源' },
      { value: '80%', label: '品牌認知度' }
    ],
    solutions: [
      {
        title: '社群內容策略',
        description: '規劃專業的口腔衛教內容，建立診所專業形象。'
      },
      {
        title: '多平台經營',
        description: '整合 Facebook、Instagram、LINE 等平台，擴大品牌觸及。'
      },
      {
        title: '互動活動規劃',
        description: '設計線上互動活動，提升社群參與度。'
      },
      {
        title: '口碑行銷',
        description: '鼓勵患者分享就醫體驗，建立良好口碑。'
      }
    ],
    color: '#E74C3C',
    image: '/images/cases/Case_春生.jpg',
    featured: false,
    publishedDate: '2024-01-25T00:00:00Z',
    updatedDate: '2024-02-28T00:00:00Z',
    testimonial: {
      content: '社群經營讓我們能更直接地與患者互動，也幫助診所建立更親切的形象。',
      author: '王醫師',
      title: '春生牙醫診所院長'
    }
  },
  {
    id: 'jiayuan',
    name: '家源牙醫診所',
    category: '整合行銷',
    description: '透過全方位的整合行銷策略，提升診所品牌價值與市場競爭力',
    metrics: [
      { value: '200%', label: '品牌知名度' },
      { value: '55%', label: '新患者成長' },
      { value: '40%', label: '回診率提升' },
      { value: '85%', label: '患者滿意度' }
    ],
    solutions: [
      {
        title: '品牌定位策略',
        description: '建立清晰的品牌定位，突出診所特色與優勢。'
      },
      {
        title: '多管道行銷',
        description: '整合線上線下行銷管道，擴大品牌影響力。'
      },
      {
        title: '內容行銷',
        description: '製作專業的衛教內容，建立診所權威形象。'
      },
      {
        title: '患者服務優化',
        description: '優化診所服務流程，提升患者體驗。'
      }
    ],
    color: '#3498DB',
    image: '/images/cases/Case_家源.jpg',
    featured: false,
    publishedDate: '2024-02-01T00:00:00Z',
    updatedDate: '2024-03-05T00:00:00Z',
    testimonial: {
      content: '整合行銷策略幫助我們在競爭激烈的市場中脫穎而出，建立穩固的品牌形象。',
      author: '李醫師',
      title: '家源牙醫診所院長'
    }
  },
  {
    id: 'haidi',
    name: '海蒂牙醫診所',
    category: '品牌重塑',
    description: '重新打造診所品牌形象，建立專業且親切的診所風格',
    metrics: [
      { value: '150%', label: '品牌認知度' },
      { value: '40%', label: '新患者增長' },
      { value: '75%', label: '患者回饋' },
      { value: '60%', label: '社群互動率' }
    ],
    solutions: [
      {
        title: '視覺識別設計',
        description: '設計現代化的品牌視覺系統，提升品牌識別度。'
      },
      {
        title: '空間規劃',
        description: '重新規劃診所空間，打造舒適的診療環境。'
      },
      {
        title: '服務流程優化',
        description: '改善診所服務流程，提升患者體驗。'
      },
      {
        title: '社群經營',
        description: '建立活躍的社群平台，增加品牌互動。'
      }
    ],
    color: '#9B59B6',
    image: '/images/cases/Case_海蒂.jpg',
    featured: false,
    publishedDate: '2024-02-05T00:00:00Z',
    updatedDate: '2024-03-10T00:00:00Z',
    testimonial: {
      content: '品牌重塑後，診所的整體形象更加專業且親切，患者回饋相當正面。',
      author: '張醫師',
      title: '海蒂牙醫診所院長'
    }
  },
  {
    id: 'haohao',
    name: '皓皓牙醫診所',
    category: '數位行銷',
    description: '透過精準的數位行銷策略，提升診所線上能見度與患者轉換率',
    metrics: [
      { value: '300%', label: '網站流量成長' },
      { value: '50%', label: '線上預約率' },
      { value: '65%', label: '廣告投資報酬率' },
      { value: '45%', label: '新患者來源' }
    ],
    solutions: [
      {
        title: 'SEO優化',
        description: '優化網站搜尋引擎排名，提升自然流量。'
      },
      {
        title: '社群廣告投放',
        description: '精準投放社群廣告，提升品牌曝光度。'
      },
      {
        title: '內容行銷',
        description: '製作專業的衛教內容，建立診所權威形象。'
      },
      {
        title: '數據分析',
        description: '透過數據分析優化行銷策略，提升投資報酬率。'
      }
    ],
    color: '#F1C40F',
    image: '/images/cases/Case_皓皓.jpg',
    featured: true,
    publishedDate: '2024-02-10T00:00:00Z',
    updatedDate: '2024-03-15T00:00:00Z',
    testimonial: {
      content: '數位行銷策略幫助我們精準觸及目標客群，大幅提升新患者數量。',
      author: '黃醫師',
      title: '皓皓牙醫診所院長'
    }
  },
  {
    id: 'qinmei',
    name: '勤美民生牙醫診所',
    category: '整合行銷',
    description: '透過全方位的整合行銷策略，建立診所專業形象與市場競爭力',
    metrics: [
      { value: '180%', label: '品牌知名度' },
      { value: '50%', label: '新患者成長' },
      { value: '70%', label: '患者滿意度' },
      { value: '45%', label: '回診率提升' }
    ],
    solutions: [
      {
        title: '品牌策略規劃',
        description: '制定完整的品牌發展策略，建立診所特色。'
      },
      {
        title: '多管道整合',
        description: '整合線上線下行銷管道，擴大品牌影響力。'
      },
      {
        title: '社群經營',
        description: '經營活躍的社群平台，增加品牌互動。'
      },
      {
        title: '服務優化',
        description: '優化診所服務流程，提升患者體驗。'
      }
    ],
    color: '#1ABC9C',
    image: '/images/cases/Case_勤美民生.jpg',
    featured: true,
    publishedDate: '2024-02-15T00:00:00Z',
    updatedDate: '2024-03-20T00:00:00Z',
    testimonial: {
      content: '整合行銷策略幫助我們在市場中建立穩固的品牌形象，提升診所競爭力。',
      author: '吳醫師',
      title: '勤美民生牙醫診所院長'
    }
  },
  {
    id: 'classic',
    name: '經典聯合牙醫診所',
    category: '品牌重塑',
    description: '重新打造診所品牌形象，建立專業且現代的診所風格',
    metrics: [
      { value: '200%', label: '品牌認知度' },
      { value: '55%', label: '新患者增長' },
      { value: '80%', label: '患者滿意度' },
      { value: '65%', label: '社群互動率' }
    ],
    solutions: [
      {
        title: '品牌識別設計',
        description: '設計現代化的品牌識別系統，提升品牌形象。'
      },
      {
        title: '空間改造',
        description: '重新規劃診所空間，打造舒適的診療環境。'
      },
      {
        title: '服務流程優化',
        description: '改善診所服務流程，提升患者體驗。'
      },
      {
        title: '數位行銷',
        description: '建立完整的數位行銷策略，提升線上能見度。'
      }
    ],
    color: '#E67E22',
    image: '/images/cases/Case_經典聯合.jpg',
    featured: true,
    publishedDate: '2024-02-20T00:00:00Z',
    updatedDate: '2024-03-25T00:00:00Z',
    testimonial: {
      content: '品牌重塑後，診所的整體形象更加專業現代化，患者回饋相當正面。',
      author: '劉醫師',
      title: '經典聯合牙醫診所院長'
    }
  }
]; 