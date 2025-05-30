# AideaMed - 醫療行銷專家

![AideaMed Logo](public/images/aidea_logo.png)

## 專案簡介

AideaMed 是專為醫療專業人士打造的品牌行銷平台，提供專業的數位行銷、品牌建設與網站開發服務。我們專注為牙醫診所以及其他科別（如眼科、中醫、皮膚科等）打造全方位的醫療行銷解決方案。

> 我們堅信：讓醫療專業人員專注於提供優質的醫療服務，而行銷和品牌建設的專業工作交給我們。我們的團隊用心傾聽每一位醫師的故事，並以溫暖與信賴為橋樑，協助您在激烈競爭的市場中脫穎而出，同時贏得患者的心。

### 願景與使命

- **願景**：成為醫療機構最信賴的行銷夥伴，透過數據導向和創新策略，打造專業且充滿人情味的醫療品牌體驗。
- **使命**：讓每位醫療專業人員能夠全心專注於醫療服務，同時享有不斷成長的診所品牌價值。

## 技術堆疊

- **前端框架**: Next.js 14 (App Router)
- **樣式處理**: TailwindCSS + CSS Modules
- **狀態管理**: React Context API
- **動畫效果**: Framer Motion + GSAP
- **3D效果**: Three.js + React Three Fiber
- **部署平台**: Vercel
- **效能監控**: Vercel Analytics + Google Analytics
- **字體優化**: 自定義字體預載及優化
- **UI元件**: Radix UI + Headless UI
- **圖標**: Lucide React + Heroicons + Phosphor Icons
- **表單處理**: React Hook Form + Zod

## 專案特色

- **台灣地區最佳化**: 針對台灣使用者優化區域節點(香港、新加坡、東京)
- **高效能設計**: Core Web Vitals 指標優化，快速的首次內容繪製(FCP < 1.8s)
- **SEO友好**: 結構化資料、語意化HTML、動態Meta標籤
- **無障礙設計**: 符合WCAG 2.1 AA級標準
- **安全防護**: 嚴格的CSP策略、XSS防護、HTTPS強制
- **快取策略**: 智能資源快取，提升重複訪問效能
- **漸進式網頁應用(PWA)**: 提供離線使用體驗與原生應用感受

## AI賦能

AideaMed不僅是一個網站，更是一個結合AI能力的智能平台：

### 智能內容生成
- 根據診所特色自動生成專業醫療文案
- 透過自然語言處理技術提煉重點，輔助創建吸引人的案例描述
- AI輔助的視覺設計建議，確保色彩和佈局符合醫療專業調性

### 數據分析與洞察
- 患者行為分析，提供診所精準行銷建議
- 競爭環境自動監測，識別市場機會
- 透過機器學習預測行銷策略效果，優化投資回報

### 自適應用戶體驗
- 根據用戶行為動態調整內容展示優先級
- 個性化推薦系統，為每位訪客提供最相關的案例和服務
- 智能聊天助手，即時回答潛在客戶的常見問題

## 開始使用

### 環境要求

- Node.js 18.17.0 或更高版本
- npm 9.6.7 或更高版本

### 安裝步驟

```bash
# 複製專案
git clone https://github.com/AioliaKnight/Aidea_Med_Web.git
cd aidea_web

# 安裝依賴 (使用相容模式避免衝突)
npm install --legacy-peer-deps

# 開發環境運行
npm run dev

# 生產環境建置
npm run build

# 預覽生產版本
npm run start
```

## 專案結構

```
aidea_web/
├── public/               # 靜態資源
│   ├── fonts/            # 字體檔案
│   ├── images/           # 圖片資源
│   ├── icons/            # 圖示資源
│   ├── cases/            # 案例相關圖片
│   └── testimonials/     # 客戶見證資源
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 根佈局
│   │   ├── globals.css   # 全域樣式
│   │   ├── fonts.css     # 字體定義
│   │   ├── api/          # API路由
│   │   ├── case/         # 案例頁面
│   │   ├── contact/      # 聯絡頁面
│   │   ├── service/      # 服務頁面
│   │   └── team/         # 團隊頁面
│   ├── components/       # React元件
│   │   ├── common/       # 共用元件
│   │   ├── layout/       # 佈局元件
│   │   └── pages/        # 頁面專用元件
│   ├── config/           # 配置檔案
│   │   └── csp.ts        # 內容安全策略
│   ├── utils/            # 通用工具函式
│   ├── types/            # TypeScript類型
│   └── middleware.ts     # Next.js中間件
├── next.config.js        # Next.js配置
├── tailwind.config.js    # Tailwind配置
└── vercel.json           # Vercel部署配置
```

## 開發指南

### 程式碼風格

- 使用TypeScript強型別
- 遵循ESLint規則
- 使用函數式元件和React Hooks
- 元件命名使用PascalCase
- 檔案命名使用小駝峰式(camelCase)

### 性能優化要點

- 優先考慮移動設備的載入體驗和互動流暢度
- 關鍵路徑渲染優化，確保首屏內容快速呈現
- 實施漸進式加載策略，平衡功能與效能
- 使用Lighthouse和Web Vitals監控關鍵性能指標

### 分支管理

- `main`: 生產環境分支
- `dev`: 開發分支
- 功能分支: `feature/功能名稱`
- 修復分支: `fix/問題描述`

## 部署流程

專案使用Vercel自動部署，設定於`vercel.json`：

1. 使用香港(hkg1)、新加坡(sin1)及東京(nrt1)區域節點
2. 啟用Next.js專屬優化
3. 設定嚴格的安全標頭
4. 定義不同資源的快取策略

### 效能優化

- **圖片優化**: 使用Next.js Image元件自動優化及CDN快取
- **字體策略**: 核心字體使用`font-display: swap`，次要字體使用`font-display: optional`
- **代碼分割**: 路由自動代碼分割
- **預取策略**: 智能連結預取
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1

## 聯絡我們

如有任何問題或建議，請聯繫：

- 網站: [https://www.aideamed.com](https://www.aideamed.com)
- 電子郵件: service@aideamed.com

## 授權協議

© 2023-2024 AideaMed. 保留所有權利。
