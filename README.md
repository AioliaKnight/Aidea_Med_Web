# Aidea:Med - 醫療行銷顧問公司品牌網站

## 專案概述

Aidea:Med 是一家專注於醫療診所和牙醫診所的整合行銷顧問公司。品牌名稱結合了 AI（人工智慧）、創意（Idea）和醫療（Medical）的概念，代表我們運用創新科技為醫療產業提供全方位的行銷解決方案。

## 技術棧

### 核心框架
- Next.js 15.2.3 (App Router)
- React 19.0.0
- TypeScript 5.4.2

### 樣式與UI
- Tailwind CSS 3.4.1
- Headless UI 2.0.0-alpha.4
- Heroicons 2.1.1
- Radix UI (Dialog, Select, Slot)
- Framer Motion 11.0.12
- Locomotive Scroll & Lenis (平滑滾動)
- GSAP 3.12.5
- Three.js (@react-three/fiber, @react-three/drei)

### 表單與驗證
- React Hook Form 7.50.1
- Zod 3.22.4
- React Hot Toast 2.5.2 (通知)

### 多媒體與動畫
- Plyr (影片播放)
- Sharp (圖片優化)
- React CountUp (數字動畫)

### 效能與分析
- Web Vitals 3.5.2
- Vercel Analytics
- Vercel Speed Insights

### PWA 支援
- next-pwa 5.6.0

### 開發工具
- ESLint 9.0.0
- Prettier 3.2.5
- TypeScript 5.4.2
- PostCSS 8.4.35
- Tailwind 插件
  - tailwindcss-animate
  - @tailwindcss/forms
  - @tailwindcss/typography
  - @tailwindcss/aspect-ratio

### 工具庫
- date-fns 3.3.1 (日期處理)
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
│   ├── globals.css        # 全局樣式
│   ├── about/             # 關於我們頁面 
│   ├── team/              # 團隊頁面
│   ├── case/              # 案例頁面
│   ├── service/           # 服務頁面
│   ├── blog/              # 部落格
│   ├── contact/           # 聯絡頁面
│   ├── privacy/           # 隱私權政策
│   ├── terms/             # 服務條款
│   └── api/               # API路由
├── components/            # React 組件
│   ├── ui/               # 基礎 UI 組件
│   ├── common/           # 通用組件
│   │   ├── form/        # 表單相關組件
│   │   ├── blog/        # 部落格通用組件
│   │   ├── Loading.tsx  # 載入組件
│   │   ├── ScrollToTop.tsx # 回頂端組件
│   │   └── ErrorBoundary.tsx # 錯誤邊界
│   ├── layout/           # 布局組件
│   │   ├── Navbar.tsx    # 導航欄
│   │   └── Footer.tsx    # 頁腳
│   ├── pages/            # 頁面特定組件
│   │   ├── HomePage.tsx  # 首頁組件
│   │   ├── AboutPage.tsx # 關於頁組件
│   │   └── ServicePage.tsx # 服務頁組件
│   ├── blog/             # 部落格特定組件
│   ├── case/             # 案例特定組件
│   └── services/         # 服務特定組件
├── config/               # 配置文件
│   ├── content.ts       # 內容配置
│   └── theme.ts         # 主題配置
├── lib/                  # 工具函數
│   ├── utils.ts         # 通用工具
│   ├── performance.ts   # 性能監控
│   ├── services/        # 服務函數
│   └── constants/       # 常數定義
├── types/                # TypeScript 類型定義
├── styles/               # 其他樣式
├── content/              # 靜態內容
└── middleware.ts         # 中間件
```

## 公共資源

```
public/
├── fonts/                # 字體文件
│   ├── GenYoGothicTW-*.woff2 # 系統字體
│   └── Century Gothic *.woff2 # 品牌字體
├── images/               # 圖片資源
├── icons/                # 圖標資源
├── favicon.ico           # 網站圖標
└── manifest.json         # PWA 配置
```

## 組件架構

專案組件架構如下：

### 1. 核心 UI 組件 (`/components/ui`)

這些是最原子級別的 UI 元素，用於構建更複雜的組件。

### 2. 通用組件 (`/components/common`)

可在整個應用程序中重複使用的組件：

- **`Loading.tsx`** - 多種載入動畫
- **`ErrorBoundary.tsx`** - 錯誤邊界組件
- **`Logo.tsx`** - 網站 Logo 組件
- **`PageHeader.tsx`** - 頁面標題組件
- **`ScrollToTop.tsx`** - 回到頂部按鈕組件
- **`ImageViewer.tsx`** - 圖片查看器組件

#### 2.1 表單相關組件 (`/components/common/form`)

提供表單相關功能的組件集合。

#### 2.2 部落格通用組件 (`/components/common/blog`)

與部落格相關的可重用組件。

### 3. 布局組件 (`/components/layout`)

定義應用程序的整體結構：

- **`Navbar.tsx`** - 導航欄組件
- **`Footer.tsx`** - 頁腳組件

### 4. 頁面組件 (`/components/pages`)

表示主要頁面內容：

- **`HomePage.tsx`** - 首頁組件
- **`TeamPage.tsx`** - 團隊頁面組件
- **`CasePage.tsx`** - 案例頁面組件
- **`ServicePage.tsx`** - 服務頁面組件
- **`ContactPage.tsx`** - 聯絡頁面組件
- **`AboutPage.tsx`** - 關於我們頁面
- **`PrivacyPage.tsx`** - 隱私政策頁面
- **`TermsPage.tsx`** - 服務條款頁面

### 5. 功能特定組件

專門用於特定功能領域的組件。

## 最佳實踐

1. **使用命名導出**：
   - 使用命名導出 `export { ComponentName }` 而非默認導出
   - 通過 `index.ts` 統一導出相關組件

2. **減少重複代碼**：
   - 將重複功能整合到通用組件
   - 使用自定義 hooks 抽象共享邏輯

3. **TypeScript 類型定義**：
   - 所有組件和函數使用明確的類型定義
   - 避免使用 `any` 類型
   - 為函數參數和返回值定義接口

4. **樣式管理**：
   - 使用 Tailwind CSS 原子類
   - 對於複雜樣式，使用 Tailwind 的 `@apply` 指令創建自定義類

5. **代碼格式**：
   - 使用 Prettier 和 ESLint 保持一致的代碼風格
   - 遵循 Next.js 和 React 最佳實踐

## 功能特點

1. **響應式設計**
   - 支援所有裝置尺寸
   - 流暢的斷點轉換
   - 最佳化的移動端體驗

2. **效能優化**
   - 圖片優化
   - 代碼分割
   - 延遲加載
   - 字體優化

3. **無障礙設計**
   - ARIA 標記
   - 鍵盤導航支持
   - 語義化 HTML

4. **SEO 優化**
   - 結構化數據
   - 元標記
   - 動態 OG 圖片

5. **動畫效果**
   - 滾動動畫
   - 頁面轉場
   - 載入動畫

6. **PWA 功能**
   - 離線支持
   - 安裝提示
   - 快速啟動

## 開發指南

### 安裝依賴

```bash
npm install
```

### 開發環境

```bash
npm run dev
```

### 構建生產版本

```bash
npm run build
```

### 啟動生產服務器

```bash
npm start
```

### 代碼檢查

```bash
npm run lint
```

### 代碼格式化

```bash
npm run format
```

## 部署

項目配置為使用 Vercel 部署。連接 GitHub 儲存庫至 Vercel 並設置以下環境變數：

- `NEXT_PUBLIC_BASE_URL` - 網站基本URL
- `NEXT_PUBLIC_ANALYTICS_ID` - 分析ID（如有）

## 版本控制

使用 [語義化版本控制](https://semver.org/) 管理版本。 