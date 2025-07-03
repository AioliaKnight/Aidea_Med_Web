# Instagram Feed 設定指南

## 📸 功能說明

我們已經為您的網站首頁添加了 Instagram 動態展示區塊，目前有以下功能：

- 🎨 **美觀的展示設計**：響應式網格佈局，支援桌面和行動裝置
- 📱 **策展內容**：目前使用精心策展的醫療行銷相關內容
- 🔗 **直接連結**：點擊可直接前往您的 Instagram 頁面
- ⚡ **效能優化**：支援懶載入和圖片優化
- 🔄 **API 整合準備**：已具備完整的 Instagram API 整合架構

## 🚀 目前狀態

**✅ 立即可用**
- 已添加到首頁並正常運作
- 使用精心設計的策展內容
- 完全響應式設計
- 包含載入狀態和錯誤處理

## 🔧 升級到真實 Instagram API（可選）

如果您希望顯示真實的 Instagram 貼文，可以按照以下步驟設定：

### 步驟 1：創建 Instagram 應用程式

1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 點擊「我的應用程式」> 「建立應用程式」
3. 選擇「消費者」類型
4. 輸入應用程式名稱（例如：Aidea Medical Website）
5. 輸入聯絡信箱

### 步驟 2：設定 Instagram Basic Display

1. 在應用程式儀表板中，點擊「新增產品」
2. 找到「Instagram Basic Display」並點擊「設定」
3. 在設定頁面中：
   - **有效的 OAuth 重新導向 URI**：`https://www.aideamed.com/`
   - **取消授權回呼 URL**：`https://www.aideamed.com/`
   - **資料刪除要求回呼 URL**：`https://www.aideamed.com/`

### 步驟 3：新增 Instagram 測試用戶

1. 在 Instagram Basic Display 設定中，找到「角色」區塊
2. 點擊「新增 Instagram 測試用戶」
3. 輸入您的 Instagram 用戶名稱：`aidea.med`
4. 前往 Instagram 應用程式，接受測試邀請

### 步驟 4：生成 Access Token

1. 在「基本顯示」> 「用戶權杖產生器」中
2. 點擊「產生權杖」
3. 登入您的 Instagram 帳戶並授權
4. 複製產生的 Access Token

### 步驟 5：設定環境變數

**您的應用程式資訊：**
- 應用程式編號：`1399943624619996`
- 應用程式密鑰：`1e1e8d0263291083ed512930f86f0d22`

1. 在 Vercel 專案設定中，新增以下環境變數：
```
NEXT_PUBLIC_INSTAGRAM_APP_ID=1399943624619996
INSTAGRAM_APP_SECRET=1e1e8d0263291083ed512930f86f0d22
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=IGQVJYour_Long_Access_Token_Here
```

2. 或在本地開發時，在 `.env.local` 檔案中加入：
```
NEXT_PUBLIC_INSTAGRAM_APP_ID=1399943624619996
INSTAGRAM_APP_SECRET=1e1e8d0263291083ed512930f86f0d22
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=IGQVJYour_Long_Access_Token_Here
```

**⚠️ 安全提醒：**
- `INSTAGRAM_APP_SECRET` 是敏感資訊，不要加 `NEXT_PUBLIC_` 前綴
- 不要將應用程式密鑰暴露在客戶端代碼中
- 建議在生產環境中使用 Vercel 的環境變數功能

### 步驟 6：驗證設定

重新部署網站後：
1. 前往 `https://www.aideamed.com/`
2. 捲動到 Instagram 區塊
3. 應該會看到您的真實 Instagram 貼文

## 📊 技術細節

### 備用策略
- 如果 API 失效或未設定，會自動使用策展內容
- 錯誤時會顯示友善的錯誤訊息和重試按鈕
- 所有圖片都有備用處理機制

### 效能優化
- 使用 Next.js Image 組件進行圖片優化
- 支援懶載入和響應式圖片
- 實作了骨架屏載入狀態

### SEO 優化
- 所有連結都有適當的 `rel` 屬性
- 圖片包含 alt 文字
- 結構化的 HTML 語義

## 🎯 內容策略建議

為了最大化 Instagram 整合的效果，建議：

1. **定期更新內容**：每週發布 2-3 次與醫療行銷相關的內容
2. **保持專業性**：確保所有內容符合醫療行業規範
3. **使用相關標籤**：`#醫療行銷 #數位行銷 #診所管理 #AideaMed`
4. **視覺一致性**：使用一致的濾鏡和色調
5. **互動回應**：積極回應留言和私訊

## 💡 注意事項

- **Access Token 有效期**：Instagram Basic Display API 的 token 有效期為 60 天
- **API 限制**：每小時最多 200 次請求
- **審核需求**：如需獲取其他用戶的公開內容，需要通過 Instagram 審核
- **隱私合規**：確保符合 GDPR 和相關隱私法規

## 🛠️ 維護

1. **監控 Token 狀態**：建議設定提醒，在 token 過期前更新
2. **內容審核**：定期檢查顯示的內容是否適當
3. **效能監控**：使用 Vercel Analytics 監控載入時間
4. **使用者回饋**：收集使用者對 Instagram 整合的回饋

---

如有任何問題或需要協助設定，請聯絡開發團隊。 