# 快速解決 Instagram 貼文問題

## 問題現狀
✅ Instagram 組件已正確安裝
❌ 缺少 Instagram Access Token，所以顯示備用內容

## 最快解決方案

### 🚀 5 分鐘快速設定

1. **登入 Vercel Dashboard**
   - 前往：https://vercel.com/dashboard
   - 選擇 `aidea_web` 專案

2. **設定環境變數**
   - 點擊 `Settings` → `Environment Variables`
   - 添加以下變數：
   
   ```
   變數名稱: INSTAGRAM_APP_SECRET
   值: 1e1e8d0263291083ed512930f86f0d22
   
   變數名稱: NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN
   值: [等待獲取 - 見下方步驟]
   ```

3. **獲取 Instagram Access Token**
   
   **方法一：使用 Facebook Graph API Explorer（推薦）**
   
   1. 開啟：https://developers.facebook.com/tools/explorer/
   2. 在應用程式下拉選單選擇：`1399943624619996`
   3. 點擊 "Get Token" → "Get User Access Token"
   4. 勾選權限：`instagram_basic`, `pages_show_list`
   5. 點擊 "Generate Access Token"
   6. 複製產生的 token
   
   **方法二：直接授權 URL**
   
   點擊此連結進行授權：
   ```
   https://api.instagram.com/oauth/authorize?client_id=1399943624619996&redirect_uri=https://www.aideamed.com&scope=user_profile,user_media&response_type=code
   ```
   授權後獲取 code，然後聯繫我們協助獲取 access token。

4. **更新 Vercel 環境變數**
   - 將獲取的 access token 填入 `NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN`
   - 點擊 "Save"

5. **重新部署**
   - 點擊 `Deployments` 標籤
   - 點擊最新部署旁的三個點
   - 選擇 "Redeploy"

## 驗證成功

✅ 重新載入網站
✅ Instagram 區塊應該顯示真實貼文
✅ 檢查瀏覽器 Console 沒有錯誤訊息

## 需要協助？

如果遇到問題：
1. 檢查瀏覽器開發者工具的 Console
2. 確認 access token 格式正確
3. 確認 Instagram 帳號與 Facebook 應用程式已連接

## 臨時解決方案

當前備用內容是精心策展的醫療行銷相關貼文，品質良好，可以暫時使用。 