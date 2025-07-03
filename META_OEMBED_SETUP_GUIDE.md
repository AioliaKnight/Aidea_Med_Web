# Meta oEmbed 應用程式設定指南

## 概述

oEmbed 功能讓您能夠在 Aidea:Med 網站上嵌入任何公開的 Facebook、Instagram 和 Threads 內容，不限於自己的帳號。

### 與現有 Instagram 整合的差異

| 功能 | Instagram Basic Display API | Meta oEmbed API |
|------|----------------------------|-----------------|
| **用途** | 獲取自己帳號的貼文 | 嵌入任何公開內容 |
| **限制** | 僅限授權帳號 | 任何公開貼文/頁面 |
| **格式** | JSON 資料 | 嵌入式 HTML |
| **適用平台** | Instagram | Facebook + Instagram + Threads |

## 申請流程總結

### 步驟 1：建立 Meta 應用程式

1. **進入 Meta 開發者平台**
   - 前往 [Facebook Developers](https://developers.facebook.com/)
   - 點擊「建立應用程式」

2. **新增應用程式詳細資訊**
   ```
   應用程式名稱: Aidea:Med 醫療行銷平台
   聯絡電子郵件: [您的聯絡信箱]
   ```

3. **選擇使用案例**
   - ✅ 選擇：「Embed Facebook, Instagram and Threads content in other websites」
   - 點擊「下一步」

### 步驟 2：設定應用程式

4. **連結商家（選用）**
   - 如果是自己的商家：不需要連結
   - 如果是代理商：需要完成商家驗證

5. **自訂使用案例**
   - 點擊「Embed Facebook, Instagram and Threads content」
   - 添加「Threads oEmbed Read」功能
   - 獲取以下資訊：
     ```
     Threads App ID: [系統產生]
     Threads App Secret: [系統產生]
     Threads Display Name: Aidea:Med
     ```

### 步驟 3：開發和測試

6. **實作 oEmbed 功能**
   - 參考 [oEmbed 開發者文件](https://developers.facebook.com/docs/plugins/oembed/)
   - 對每個端點進行至少一次成功的 API 呼叫

7. **測試要求**
   - 在「審查 > 測試」中檢視測試狀態
   - 確認 API 呼叫計數

### 步驟 4：提交審查

8. **應用程式審查**
   
   **應用程式設定：**
   - 應用程式圖示
   - 隱私政策網址：`https://www.aideamed.com/privacy`
   - 應用程式類別：醫療/健康

   **應用程式驗證：**
   - 提供測試帳號和詳細說明
   - 解釋如何使用 oEmbed 功能
   - 提供測試網址範例

   **權限說明：**
   ```
   我們使用 oEmbed 讀取功能在醫療行銷網站上嵌入相關的
   社群媒體內容，為訪客提供更豐富的資訊體驗。
   
   測試網址：https://www.aideamed.com
   嵌入內容：Facebook 頁面貼文、Instagram 貼文
   ```

### 步驟 5：發佈應用程式

9. **基本設定**
   - 隱私政策網址
   - 用戶資料刪除說明
   - 應用程式類別

10. **進階設定（可選）**
    - 網域管理員設定
    - 應用程式限制
    - 測試人員許可清單

## 技術實作

### API 端點

```javascript
// Facebook oEmbed
https://www.facebook.com/plugins/oembed.json/?url={POST_URL}

// Instagram oEmbed  
https://api.instagram.com/oembed/?url={POST_URL}

// Threads oEmbed
https://threads.net/oembed/?url={POST_URL}
```

### 使用範例

```javascript
// 獲取 Facebook 貼文的嵌入代碼
const facebookOEmbed = async (postUrl) => {
  const response = await fetch(
    `https://www.facebook.com/plugins/oembed.json/?url=${encodeURIComponent(postUrl)}`
  )
  const data = await response.json()
  return data.html // 嵌入式 HTML
}

// 獲取 Instagram 貼文的嵌入代碼
const instagramOEmbed = async (postUrl) => {
  const response = await fetch(
    `https://api.instagram.com/oembed/?url=${encodeURIComponent(postUrl)}`
  )
  const data = await response.json()
  return data.html // 嵌入式 HTML
}
```

## 整合到 Aidea:Med 網站

### 使用案例

1. **部落格文章增強**
   - 在醫療行銷文章中嵌入相關的社群媒體貼文
   - 展示成功案例的社群證明

2. **案例研究**
   - 嵌入客戶在社群媒體上的正面回饋
   - 展示診所的社群媒體表現

3. **教育內容**
   - 嵌入醫療專業知識的社群貼文
   - 分享業界重要資訊

### 實作計劃

```typescript
// 新組件：SocialEmbed.tsx
interface SocialEmbedProps {
  url: string
  platform: 'facebook' | 'instagram' | 'threads'
  maxWidth?: number
}

const SocialEmbed: React.FC<SocialEmbedProps> = ({ url, platform, maxWidth = 500 }) => {
  // 實作 oEmbed API 呼叫
  // 返回嵌入式 HTML
}
```

## 申請時間軸

| 階段 | 預估時間 | 說明 |
|------|----------|------|
| 應用程式建立 | 1-2 小時 | 完成基本設定 |
| 開發實作 | 1-2 天 | 建立 oEmbed 組件 |
| 測試驗證 | 1 天 | API 呼叫測試 |
| 審查等待 | 1-2 週 | Meta 官方審查 |
| 上線部署 | 1 天 | 正式啟用功能 |

## 注意事項

### 審查要求
- 必須提供實際的網站範例
- 需要解釋使用目的和價值
- 必須符合 Meta 開發者政策

### 使用限制
- 只能嵌入公開內容
- 需要遵守內容使用條款
- 可能有 API 呼叫限制

### 維護更新
- 定期檢查 API 狀態
- 更新嵌入式內容
- 監控載入效能

## 後續整合建議

1. **優先實作 Instagram oEmbed**
   - 與現有 Instagram 功能互補
   - 可以嵌入其他帳號的優質內容

2. **擴展到 Facebook 內容**
   - 嵌入醫療相關的 Facebook 頁面貼文
   - 展示業界新聞和趨勢

3. **考慮 Threads 內容**
   - 新興平台，可能有較少競爭
   - 適合專業討論內容

這個 oEmbed 功能將大大增強 Aidea:Med 網站的社群媒體整合能力，讓您能夠展示更豐富的內容和社群證明。 