# TinaCMS Blog 管理後台設定指南

## 🚀 快速開始

TinaCMS 已成功整合到您的專案中！現在您可以通過視覺化介面管理部落格文章，並且所有變更會自動同步到 GitHub。

## 📋 設定步驟

### 1. 註冊 TinaCMS 帳戶

1. 前往 [TinaCMS Cloud](https://app.tina.io/)
2. 使用 GitHub 帳戶登入
3. 創建新專案，連接您的 GitHub repository

### 2. 獲取 API 金鑰

在 TinaCMS Dashboard 中：
1. 選擇您的專案
2. 前往 "Settings" → "API Keys"
3. 複製以下值：
   - `Client ID` → `NEXT_PUBLIC_TINA_CLIENT_ID`
   - `Token` → `TINA_TOKEN`

### 3. 設定環境變數

複製 `env.template` 為 `.env.local`：

```bash
cp env.template .env.local
```

在 `.env.local` 中填入正確的值：

```env
# TinaCMS Configuration
NEXT_PUBLIC_TINA_CLIENT_ID=your_actual_client_id
TINA_TOKEN=your_actual_token

# GitHub Integration
GITHUB_OWNER=your_github_username
GITHUB_REPO=aidea_web
GITHUB_BRANCH=main
```

### 4. 在 Vercel 中設定環境變數

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的專案
3. 前往 "Settings" → "Environment Variables"
4. 添加以下變數：
   - `NEXT_PUBLIC_TINA_CLIENT_ID`
   - `TINA_TOKEN`

## 🎯 使用方式

### 啟動開發模式

```bash
npm run dev
```

TinaCMS 會自動啟動，您可以：
- 前往 `http://localhost:3000/admin` 進入管理後台
- 在前台網站上，以管理員身份登入後會看到編輯按鈕

### 管理文章

1. **新增文章**：
   - 在後台點擊 "Create New Post"
   - 填寫標題、摘要、內容等
   - 上傳封面圖片
   - 設定標籤和分類

2. **編輯現有文章**：
   - 在文章列表中選擇要編輯的文章
   - 使用視覺化編輯器修改內容
   - 即時預覽變更

3. **發布文章**：
   - 完成編輯後點擊 "Save"
   - TinaCMS 會自動 commit 到 GitHub
   - Vercel 自動部署更新

## 🖼️ 圖片管理

### 上傳圖片

1. 在編輯器中點擊圖片圖標
2. 拖拽或選擇圖片檔案
3. 圖片會自動上傳到 `/public/images/` 目錄
4. 系統會自動最佳化圖片尺寸

### 圖片 SEO

- 所有圖片都會自動加上 `alt` 文字
- 支援 `caption` 圖片說明
- 自動 lazy loading

## 📝 支援的內容區塊

您的 TinaCMS 編輯器支援以下特殊區塊：

- **文章導言** (`intro-summary`)
- **警告框** (`warning-box`)
- **關鍵洞察** (`key-insight`)
- **前後對比** (`before-after`)
- **範例框** (`example-box`)
- **案例研究** (`case-study`)
- **行動呼籲** (`cta-section`)

## 🔄 GitHub 工作流程

### 自動化流程

1. **編輯內容** → TinaCMS 編輯器
2. **儲存變更** → 自動 commit 到 GitHub
3. **觸發部署** → Vercel 自動建置和部署
4. **網站更新** → 新內容上線

### 版本控制

- 每次儲存都會創建一個 Git commit
- Commit 訊息會自動生成
- 可以在 GitHub 中查看完整的變更歷史
- 支援回滾到任何歷史版本

## 👥 協作編輯

### 邀請團隊成員

1. 在 TinaCMS Dashboard 中前往 "Team"
2. 邀請團隊成員加入專案
3. 設定適當的權限等級

### 權限管理

- **Admin**：完整管理權限
- **Editor**：可編輯內容，不能修改設定
- **Contributor**：可建議變更，需要審核

## 🛠️ 進階設定

### 自訂編輯器樣式

編輯 `.tina/config.ts` 來：
- 添加新的內容區塊
- 修改欄位驗證規則
- 客製化編輯器介面

### 批次操作

```bash
# 批次生成 TinaCMS 文件
npm run tina:build

# 初始化 TinaCMS（如果需要重新設定）
npm run tina:init
```

## 🔒 安全性

- 管理後台需要驗證才能存取
- 所有 API 請求都經過加密
- 支援 OAuth 登入
- 環境變數安全儲存

## 📱 行動裝置支援

- 管理介面完全響應式設計
- 支援手機和平板編輯
- 觸控友善的編輯器
- 離線編輯能力

## 🚨 疑難排解

### 常見問題

1. **無法登入管理後台**
   - 檢查環境變數是否正確設定
   - 確認 TinaCMS Client ID 和 Token 有效

2. **圖片上傳失敗**
   - 檢查圖片檔案大小（建議 < 5MB）
   - 確認檔案格式支援（jpg, png, webp）

3. **變更沒有部署**
   - 檢查 Vercel 部署日志
   - 確認 GitHub Webhook 設定正確

### 取得支援

- [TinaCMS 官方文檔](https://tina.io/docs/)
- [GitHub Issues](https://github.com/tinacms/tinacms/issues)
- [TinaCMS Discord 社群](https://discord.gg/zumN63Ybpf)

## 🎉 完成！

現在您已經擁有一個功能完整的部落格管理系統！

- ✅ 視覺化內容編輯
- ✅ GitHub 自動同步
- ✅ 即時預覽
- ✅ 圖片管理
- ✅ 團隊協作
- ✅ 版本控制
- ✅ 自動部署

開始創作精彩的醫療行銷內容吧！🚀 