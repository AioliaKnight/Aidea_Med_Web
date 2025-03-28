# Aidea:Med - 醫療行銷專家平台

![版本](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

<p align="center">
  <img src="https://raw.githubusercontent.com/AioliaKnight/Aidea_Med_Web/main/public/logo-b.png" alt="Aidea:Med Logo" width="300">
</p>

<p align="center">
  <b>「讓您專注醫療初心，行銷交給我們！」</b>
</p>

## 📋 關於 Aidea:Med

在醫療市場中，每位醫師與診所都有一顆堅守專業、追求卓越醫療品質的初心。然而，繁瑣的行銷與品牌推廣常常讓專注醫療的您分心。Aidea:Med 結合尖端 AI 科技、創意策略與豐富醫療經驗，專注為牙醫診所以及其他科別（如眼科、中醫、皮膚科等）打造全方位的醫療行銷解決方案。

我們堅信：讓醫療專業人員專注於提供優質的醫療服務，而行銷和品牌建設的專業工作交給我們。我們的團隊用心傾聽每一位醫師的故事，並以溫暖與信賴為橋樑，協助您在激烈競爭的市場中脫穎而出，同時贏得患者的心。

### 願景與使命

- **願景**：成為醫療機構最信賴的行銷夥伴，透過數據導向和創新策略，打造專業且充滿人情味的醫療品牌體驗。
- **使命**：讓每位醫療專業人員能夠全心專注於醫療服務，同時享有不斷成長的診所品牌價值。

## 📊 目錄

- [品牌定位](#關於-aideamed)
- [技術亮點](#技術亮點)
- [功能特色](#功能特色)
- [專案架構](#專案架構)
- [AI 賦能](#ai-賦能)
- [安裝說明](#安裝說明)
- [使用指南](#使用指南)
- [開發規範](#開發規範)
- [部署方案](#部署方案)
- [授權資訊](#授權資訊)

## 🚀 技術亮點

### 現代化前端框架
- **Next.js 15.2.3**: 具備 App Router、SSR、圖片自動優化等先進特性
- **React 19.0.0**: 採用最新的 React 生態系統，配合 React Hooks 實現高效能組件
- **TypeScript 5.8.2**: 完全類型化的開發體驗，提升代碼質量與可維護性

### 視覺與使用者體驗
- **TailwindCSS 3.3.0**: 靈活高效的 CSS 工具類框架，實現精確設計
- **Framer Motion 12.5.0**: 平滑流暢的動畫效果，增強用戶體驗
- **GSAP 3.12.7 & @gsap/react**: 專業級動畫解決方案，優化複雜的頁面轉場效果
- **Three.js 0.174.0 & @react-three/fiber**: 打造沉浸式 3D 視覺體驗
- **Locomotive Scroll 5.0.0-beta.11**: 順滑的自定義捲動體驗

### UI 元件生態系
- **Radix UI**: 無樣式但高度可訪問的頭部組件，如Dialog、Select等
- **Headless UI 2.2.0**: 提供無樣式但功能完整的UI元件
- **Lucide React**: 簡潔優雅的矢量圖標庫
- **Heroicons & Phosphor Icons**: 豐富多樣的圖標系統

### 效能與開發工具
- **Vercel Analytics & Speed Insights**: 實時監控網站表現與用戶體驗
- **Next.js Image 與 Sharp 0.33.2**: 自動優化圖片加載與顯示效能
- **React Hook Form 7.54.2 & Zod 3.24.2**: 高效表單處理與資料驗證
- **ESLint 9.22.0, Prettier 3.5.3, Jest 29.7.0**: 完善的代碼品質保障工具鏈
- **Next-PWA**: 漸進式網頁應用支持，提升離線使用體驗

## 💡 功能特色

### 扁平化現代設計
- 符合醫療專業形象的清晰介面，重視空間和內容層次
- 注重資訊架構，引導用戶直覺地獲取所需資訊
- 在專業感中融入溫暖元素，展現品牌溫度

### 智能案例展示
- **緊湊視圖模式**: 針對行動裝置優化的多案例瀏覽體驗
- **智能分類系統**: 依醫療專科、需求類型等多維度過濾案例
- **動態加載畫廊**: 透過交互動畫展示不同類型的成功案例
- **案例詳情展示**: 完整呈現診所行銷前後的轉變對比

### 用戶互動與轉化設計
- 智能聯絡表單系統，支援多種服務需求分類
- 客製化動畫反饋，增強使用者互動感受
- 社交媒體無縫整合，擴大品牌影響力
- 可訪問性優化，確保各類用戶群體都能輕易使用

### 效能優化策略
- 圖片優先級與延遲加載系統，優化首屏載入速度
- 靈活的組件渲染策略，減少不必要的重渲染
- 漸進式網頁應用(PWA)支持，提供接近原生應用的體驗
- 針對不同網路條件的自適應資源載入策略

## 📁 專案架構

```
├── public/                # 靜態資源
│   ├── cases/             # 案例相關圖片
│   ├── fonts/             # 自定義字型
│   ├── images/            # 網站圖片資源
│   ├── icons/             # 應用圖標與SVG
│   ├── testimonials/      # 客戶見證相關資源
│   └── manifest.json      # PWA 配置文件
├── src/                   # 源代碼
│   ├── app/               # Next.js App Router 路由
│   │   ├── api/           # API 端點
│   │   ├── case/          # 案例展示頁面
│   │   ├── contact/       # 聯絡與諮詢頁面
│   │   ├── service/       # 服務項目頁面
│   │   ├── team/          # 團隊成員頁面
│   │   ├── layout.tsx     # 主佈局文件
│   │   ├── globals.css    # 全域樣式
│   │   ├── fonts.css      # 字型配置
│   │   └── metadata.ts    # SEO 元數據
│   ├── components/        # 組件庫
│   │   ├── case/          # 案例相關組件
│   │   ├── common/        # 通用UI組件
│   │   ├── contact/       # 聯絡表單組件
│   │   ├── layout/        # 佈局與導航組件
│   │   ├── pages/         # 頁面級組件
│   │   └── ui/            # 基礎UI元素
│   ├── lib/               # 核心功能與工具
│   │   └── utils.ts       # 通用工具函數
│   ├── types/             # TypeScript 類型定義
│   ├── config/            # 全局配置與常量
│   ├── utils/             # 輔助工具函數
│   └── middleware.ts      # Next.js 中間件
├── tailwind.config.js     # Tailwind 設定
├── tsconfig.json          # TypeScript 設定
├── next.config.js         # Next.js 設定
├── postcss.config.js      # PostCSS 配置
├── vercel.json            # Vercel 部署配置
├── .env.local             # 環境變數（本地）
├── .env.example           # 環境變數範例
├── LICENSE                # ISC 授權文件
└── package.json           # 專案依賴與腳本
```

## 🧠 AI 賦能

Aidea:Med 不僅是一個網站，更是一個結合 AI 能力的智能平台：

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

## 📥 安裝說明

### 系統需求
- Node.js >= 18.17.0
- npm >= 9.0.0

### 快速開始

1. 克隆專案
```bash
git clone https://github.com/AioliaKnight/Aidea_Med_Web.git
cd Aidea_Med_Web
```

2. 安裝依賴
```bash
npm install
```

3. 設定環境變數
```bash
cp .env.example .env.local
# 編輯 .env.local 設定必要的環境變數
```

4. 啟動開發伺服器
```bash
npm run dev
```

## 🖥️ 使用指南

### 開發模式
```bash
npm run dev
```
服務將在 http://localhost:3000 啟動，支持熱更新。

### 生產建構
```bash
npm run build
npm run start
```

### 代碼維護
```bash
# 檢查代碼品質
npm run lint

# 格式化代碼
npm run format

# 運行測試
npm run test

# 類型檢查
npm run type-check

# 分析構建包
npm run analyze

# 清理緩存並重建
npm run rebuild
```

## 👨‍💻 開發規範

### 組件開發最佳實踐
- 利用 React.memo、useMemo 和 useCallback 優化效能
- 保持組件專一性原則，每個組件專注解決單一問題
- 確保所有組件具備完整的 TypeScript 類型定義
- 遵循原子設計模式，從基礎UI元件構建複雜介面

### 性能優化要點
- 優先考慮移動設備的載入體驗和互動流暢度
- 關鍵路徑渲染優化，確保首屏內容快速呈現
- 實施漸進式加載策略，平衡功能與效能
- 使用Lighthouse和Web Vitals監控關鍵性能指標

### 代碼風格與品質
- 遵循 ESLint 與 Prettier 規範
- 組件命名使用 PascalCase，功能函數使用 camelCase
- 提交前確保代碼通過全部檢查與測試
- 使用 Husky 和 lint-staged 確保提交代碼品質

## 🌐 部署方案

### Vercel (推薦)
1. 連接 GitHub 儲存庫到 Vercel
2. 配置環境變數
3. 設定自定義域名與 SSL
4. 啟用自動部署與預覽功能
5. 利用Edge Functions提升全球訪問速度

### 其他選項
- **AWS Amplify**: 適合與其他 AWS 服務整合
- **Netlify**: 簡單易用的靜態網站部署平台
- **Docker 自託管**: 自定義基礎設施的完全控制方案
- **Azure Static Web Apps**: Microsoft平台整合選項

## 📄 授權資訊

本專案採用 ISC 許可證。完整許可證文本請參閱 [LICENSE](LICENSE) 文件。

---

<p align="center">© 2025 Aidea:Med Team. All rights reserved.</p>
<p align="center">讓您專注醫療初心，行銷交給我們！</p>
