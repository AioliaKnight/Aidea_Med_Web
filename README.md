# Aidea:Med - 醫療行銷顧問公司品牌網站

## 專案概述

Aidea:Med 是一家專注於醫療診所和牙醫診所的整合行銷顧問公司。品牌名稱結合了 AI（人工智慧）、創意（Idea）和醫療（Medical）的概念，代表我們運用創新科技為醫療產業提供全方位的行銷解決方案。

## 技術棧

### 核心框架
- Next.js 14.1.0 (App Router)
- React 18.2.0
- TypeScript 5.3.3

### 樣式與UI
- Tailwind CSS
- Radix UI (Dialog, Select, Slot)
- Headless UI
- Heroicons
- GSAP
- Framer Motion
- Locomotive Scroll & Lenis (平滑滾動)
- AOS (滾動動畫)
- Three.js (@react-three/fiber, @react-three/drei)

### 表單與驗證
- React Hook Form
- Zod
- React Hot Toast (通知)

### 內容管理
- Sanity CMS
- next-sanity
- Portable Text
- Sanity Image URL

### 多媒體與動畫
- Plyr (影片播放)
- Sharp (圖片優化)
- React CountUp (數字動畫)

### 效能與分析
- Web Vitals
- Vercel Analytics

### 錯誤處理
- Error Boundary
- 自定義錯誤頁面
- 重試機制

### PWA 支援
- next-pwa

### 開發工具
- ESLint
- Prettier
- Husky
- TypeScript
- PostCSS
- Tailwind 插件
  - @tailwindcss/forms
  - @tailwindcss/typography
  - @tailwindcss/aspect-ratio
  - tailwindcss-animate

### 工具庫
- date-fns (日期處理)
- clsx & tailwind-merge (條件式樣式)
- class-variance-authority (樣式變體)
- React Intersection Observer

## 專案結構

```
src/
├── app/                    # App Router 路由
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首頁
│   ├── viewport.ts        # 視口配置
│   ├── metadata.ts        # 元數據配置
│   ├── team/              # 團隊頁面
│   ├── case/              # 案例頁面
│   ├── service/           # 服務頁面
│   ├── blog/              # 部落格
│   └── contact/           # 聯絡頁面
├── components/            # React 組件
│   ├── common/           # 通用組件（錯誤處理、載入中等）
│   ├── layout/           # 布局組件（導航欄等）
│   ├── pages/            # 頁面特定組件
│   └── providers/        # 全局提供者
├── lib/                   # 工具函數
├── styles/               # 全局樣式
├── sanity/               # Sanity CMS 配置
└── public/               # 靜態資源
```

## 功能特點

1. **響應式設計**
   - 支援所有裝置尺寸
   - 流暢的斷點轉換
   - 最佳化的移動端體驗

2. **動畫效果**
   - 頁面轉場動畫
   - 滾動動畫
   - 互動效果
   - 載入動畫

3. **PWA 功能**
   - 離線支援
   - 可安裝性
   - 推送通知

4. **效能優化**
   - 圖片最佳化
   - 程式碼分割
   - 靜態生成
   - SEO 最佳化

## 開發指南

### 環境設置

1. 安裝依賴：
```bash
npm install
```

2. 環境變數設置：
複製 `.env.example` 到 `.env.local` 並填入必要的環境變數：
```
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-01
SANITY_API_TOKEN=your_api_token
SANITY_PREVIEW_SECRET=your_preview_secret

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# Vercel
VERCEL_URL=
VERCEL_ENV=

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_GTM_ID=your_gtm_id
```

3. 啟動開發伺服器：
```bash
npm run dev
```

### 開發規範

1. **Git 提交規範**
   - feat: 新功能
   - fix: 錯誤修復
   - docs: 文檔更新
   - style: 代碼格式
   - refactor: 重構
   - test: 測試
   - chore: 構建過程或輔助工具的變動

2. **代碼風格**
   - 使用 Prettier 格式化代碼
   - 遵循 ESLint 規則
   - 使用 TypeScript 強類型

3. **組件開發規範**
   - 使用函數組件
   - 實現響應式設計
   - 添加適當的動畫效果
   - 確保可訪問性

### 部署

1. 建構生產版本：
```bash
npm run build
```

2. 啟動生產伺服器：
```bash
npm start
```

## 當前進度

- [x] 設置基本路由結構
- [x] 實現載入動畫
- [x] 建立響應式導航
- [x] 設置錯誤邊界
- [x] 實現重試機制
- [x] 建立頁面組件結構
- [ ] 配置 Sanity CMS
- [ ] 實現頁面轉場動畫
- [ ] 實現暗色模式
- [ ] 配置分析工具

## 待辦事項

1. **PWA 相關**
   - 創建各尺寸的應用圖標
   - 設置離線功能
   - 配置推送通知

2. **CMS 整合**
   - 設置 Sanity Studio
   - 創建內容模型
   - 實現內容查詢

3. **效能優化**
   - 實現圖片延遲載入
   - 優化字體載入
   - 設置快取策略

4. **功能增強**
   - 添加搜索功能
   - 實現表單驗證
   - 添加多語言支援

## 貢獻指南

1. Fork 專案
2. 創建功能分支
3. 提交更改
4. 推送到分支
5. 創建 Pull Request

## 授權

ISC License

## 聯絡方式

如有任何問題或建議，請聯繫專案維護者。 