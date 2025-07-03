# Instagram API 問題排解指南

## 問題：為什麼看不到真實的 Instagram 貼文？

當前網站顯示的是手動策展的備用內容，而非真實的 Instagram 貼文。這是因為缺少必要的環境變數設定。

## 根本原因

1. **缺少 Instagram Access Token**：需要有效的 access token 才能從 Instagram API 獲取真實貼文
2. **環境變數未設定**：Vercel 部署環境中沒有配置 Instagram API 相關環境變數

## 解決步驟

### 步驟 1：在 Vercel 設定環境變數

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇 `aidea_web` 專案
3. 進入 `Settings` → `Environment Variables`
4. 添加以下環境變數：

```
NEXT_PUBLIC_INSTAGRAM_APP_ID = 1399943624619996
INSTAGRAM_APP_SECRET = 1e1e8d0263291083ed512930f86f0d22
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN = [待獲取]
```

### 步驟 2：獲取 Instagram Access Token

#### 方法 A：使用 Facebook Graph API Explorer（推薦）

1. 前往 [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. 選擇應用程式：`1399943624619996`
3. 選擇權限：`instagram_basic`, `pages_show_list`
4. 點擊 "Get Token" → "Instagram Basic Display"
5. 複製生成的 access token

#### 方法 B：手動授權流程

1. 打開瀏覽器，訪問以下 URL（將 REDIRECT_URI 替換為實際值）：
```
https://api.instagram.com/oauth/authorize?client_id=1399943624619996&redirect_uri=REDIRECT_URI&scope=user_profile,user_media&response_type=code
```

2. 授權後獲取 authorization code
3. 使用以下 API 獲取 access token：
```bash
curl -X POST \
  https://api.instagram.com/oauth/access_token \
  -F client_id=1399943624619996 \
  -F client_secret=1e1e8d0263291083ed512930f86f0d22 \
  -F grant_type=authorization_code \
  -F redirect_uri=REDIRECT_URI \
  -F code=AUTHORIZATION_CODE
```

### 步驟 3：獲取 Long-lived Access Token（推薦）

短期 token 只有 1 小時有效期，建議換取長期 token（60天）：

```bash
curl -i -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=1e1e8d0263291083ed512930f86f0d22&access_token=SHORT_LIVED_TOKEN"
```

### 步驟 4：在 Vercel 更新環境變數

1. 將獲取的 access token 添加到 Vercel 環境變數：
```
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN = [您的_access_token]
```

2. 重新部署應用程式

## 本地開發設定

如果需要在本地測試，請創建 `.env.local` 文件：

```bash
# .env.local
NEXT_PUBLIC_INSTAGRAM_APP_ID=1399943624619996
INSTAGRAM_APP_SECRET=1e1e8d0263291083ed512930f86f0d22
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=你的_access_token
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-CCT5JDRZ8B
NEXT_PUBLIC_GTM_ID=GTM-P5XLZB6F
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 驗證設定

設定完成後，您可以：

1. 檢查瀏覽器開發者工具的 Console，確認沒有 Instagram API 錯誤
2. 重新載入頁面，應該會看到真實的 Instagram 貼文
3. 如果仍顯示備用內容，檢查 access token 是否有效

## 常見問題

### Q: Access token 過期怎麼辦？
A: Instagram access token 有 60 天有效期，需要定期更新。建議設定提醒或實作自動更新機制。

### Q: 為什麼 API 調用失敗？
A: 檢查以下項目：
- Access token 是否有效
- 應用程式是否已通過 Instagram 審核
- 是否超過 API 調用限制（每小時 200 次）

### Q: 能否顯示其他 Instagram 帳號的貼文？
A: 目前只能顯示 token 所屬帳號的貼文。如需顯示其他帳號，需要該帳號的授權。

## 技術支援

如果遇到問題，請檢查：
1. 瀏覽器開發者工具的 Console 錯誤訊息
2. Vercel 部署日誌
3. Instagram API 文件：https://developers.facebook.com/docs/instagram-basic-display-api

## 備用方案

如果暫時無法設定 Instagram API，網站會自動顯示手動策展的優質內容，確保用戶體驗不受影響。 