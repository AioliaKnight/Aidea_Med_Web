# Instagram API 設定 - 下一步指南

## 📋 您的應用程式資訊
- **應用程式編號：** `1399943624619996`
- **應用程式密鑰：** `1e1e8d0263291083ed512930f86f0d22`

## 🚀 下一步設定流程

### 步驟 1：設定 Instagram Basic Display 產品

1. 前往 [Facebook Developers](https://developers.facebook.com/apps/1399943624619996/dashboard/)
2. 在左側選單中找到「新增產品」
3. 找到「Instagram Basic Display」並點擊「設定」
4. 完成基本設定

### 步驟 2：配置重新導向 URI

在 Instagram Basic Display 設定中：

```
有效的 OAuth 重新導向 URI：
https://www.aideamed.com/
https://localhost:3000/

取消授權回呼 URL：
https://www.aideamed.com/

資料刪除要求回呼 URL：
https://www.aideamed.com/
```

### 步驟 3：新增 Instagram 測試用戶

1. 在 Instagram Basic Display 的「角色」區塊
2. 點擊「新增 Instagram 測試用戶」
3. 輸入：`aidea.med`
4. 點擊「提交」

### 步驟 4：接受測試邀請

1. 打開 Instagram 應用程式
2. 前往個人檔案 > 設定 > 帳號 > 開發者邀請
3. 接受來自您應用程式的邀請

### 步驟 5：生成 Access Token

1. 回到 Facebook Developers
2. 前往 Instagram Basic Display > 基本顯示 > 用戶權杖產生器
3. 點擊「產生權杖」按鈕
4. 登入 Instagram 並授權應用程式
5. 複製生成的 Access Token（格式：`IGQVJxxxxx...`）

### 步驟 6：設定 Vercel 環境變數

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的專案
3. 前往「Settings」> 「Environment Variables」
4. 新增以下變數：

```bash
# Instagram 應用程式設定
NEXT_PUBLIC_INSTAGRAM_APP_ID=1399943624619996

# Instagram 應用程式密鑰（僅伺服器端）
INSTAGRAM_APP_SECRET=1e1e8d0263291083ed512930f86f0d22

# Instagram Access Token（從步驟 5 獲得）
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=IGQVJxxxxx_your_actual_token_here
```

### 步驟 7：部署並測試

1. 儲存環境變數後，觸發新的部署
2. 前往 `https://www.aideamed.com/`
3. 捲動到 Instagram 區塊
4. 應該會看到您的真實 Instagram 貼文

## 🔍 測試檢查清單

- [ ] Facebook 應用程式已創建
- [ ] Instagram Basic Display 產品已新增
- [ ] OAuth 重新導向 URI 已設定
- [ ] Instagram 測試用戶已新增（aidea.med）
- [ ] 測試邀請已接受
- [ ] Access Token 已生成
- [ ] Vercel 環境變數已設定
- [ ] 網站已重新部署
- [ ] Instagram 貼文正常顯示

## ⚠️ 注意事項

1. **Token 有效期：** Access Token 有效期為 60 天，需要定期更新
2. **測試帳戶：** 只有新增為測試用戶的 Instagram 帳戶才能使用
3. **API 限制：** 每小時最多 200 次請求
4. **隱私設定：** 確保 Instagram 帳戶為公開或業務帳戶

## 🆘 常見問題

**Q: Access Token 生成失敗？**
A: 確保已接受 Instagram 測試邀請，並且帳戶為公開

**Q: 無法看到真實貼文？**
A: 檢查環境變數是否正確設定，並確保網站已重新部署

**Q: 顯示錯誤訊息？**
A: 檢查瀏覽器控制台，查看具體錯誤資訊

## 📞 需要協助？

如果在設定過程中遇到問題，請提供：
1. 具體的錯誤訊息
2. 設定進行到哪一步
3. 瀏覽器控制台的錯誤資訊

---

設定完成後，您的網站將顯示真實的 Instagram 貼文，為訪客提供最新的品牌動態！ 