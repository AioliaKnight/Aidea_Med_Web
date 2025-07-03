# Facebook JavaScript SDK 設定指南

## 概述

我們已成功整合 Facebook JavaScript SDK 到 Aidea:Med 網站中，此 SDK 提供以下功能：

- ✅ Facebook 事件追蹤
- ✅ 支援 Facebook 社群外掛程式
- ✅ 為 Instagram API 提供基礎支援
- ✅ 頁面檢視分析

## 應用程式配置

### Facebook 應用程式
- **App ID**: `1081823416607631`
- **用途**: 主要的 Facebook SDK 功能
- **功能**: 事件追蹤、社群外掛程式、分析

### Instagram 應用程式
- **App ID**: `1399943624619996`
- **用途**: Instagram Basic Display API
- **功能**: 獲取 Instagram 貼文內容

## 技術實作

### 1. Facebook SDK 組件
位置：`src/components/common/FacebookSDK.tsx`

特色：
- 非同步載入，不阻塞頁面渲染
- 自動錯誤處理
- 支援繁體中文介面
- 開發模式偵錯功能

### 2. 環境變數設定

#### Vercel 部署環境
```
NEXT_PUBLIC_FACEBOOK_APP_ID=1081823416607631
NEXT_PUBLIC_INSTAGRAM_APP_ID=1399943624619996
INSTAGRAM_APP_SECRET=1e1e8d0263291083ed512930f86f0d22
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=[待設定]
```

#### 本地開發環境（.env.local）
```
NEXT_PUBLIC_FACEBOOK_APP_ID=1081823416607631
NEXT_PUBLIC_INSTAGRAM_APP_ID=1399943624619996
INSTAGRAM_APP_SECRET=1e1e8d0263291083ed512930f86f0d22
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=[待設定]
```

### 3. 整合位置

SDK 已整合到 `src/app/layout.tsx` 中：

```tsx
{/* Facebook JavaScript SDK */}
<FacebookSDK />
```

載入順序：
1. Google Tag Manager
2. Facebook SDK
3. 主要應用程式內容

## 功能說明

### 自動功能
- ✅ 頁面檢視追蹤
- ✅ Facebook 事件記錄
- ✅ XFBML 解析支援

### 可用 API
通過 `useFacebookAPI` hook：
- `checkSDKLoaded()`: 檢查 SDK 載入狀態
- `logEvent(eventName, parameters)`: 記錄自定義事件

### 使用範例

```tsx
import { useFacebookAPI } from '@/components/common/FacebookSDK'

const MyComponent = () => {
  const { checkSDKLoaded, logEvent } = useFacebookAPI()
  
  const handleButtonClick = async () => {
    const isLoaded = await checkSDKLoaded()
    if (isLoaded) {
      logEvent('custom_button_click', { page: 'homepage' })
    }
  }
  
  return <button onClick={handleButtonClick}>追蹤點擊</button>
}
```

## 安全性設定

### CSP (Content Security Policy)
SDK 載入已配置適當的安全性設定：
- `crossOrigin="anonymous"`
- 載入來源：`https://connect.facebook.net/zh_TW/sdk.js`

### 隱私權設定
- 僅記錄必要的頁面檢視事件
- 不收集個人識別資訊
- 符合 GDPR 規範

## 驗證設定

### 1. 檢查 SDK 載入
開啟瀏覽器開發者工具 Console，應該看到：
```
Facebook SDK initialized successfully
App ID: 1081823416607631
Version: v23.0
```

### 2. 檢查全域物件
在 Console 中輸入：
```javascript
window.FB
```
應該返回 Facebook SDK 物件

### 3. 網路請求
在 Network 標籤中應該看到成功載入：
- `sdk.js` from `connect.facebook.net`

## 常見問題

### Q: 為什麼有兩個不同的 App ID？
A: 
- `1081823416607631` 用於 Facebook SDK 和一般功能
- `1399943624619996` 專門用於 Instagram API 整合

### Q: SDK 載入失敗怎麼辦？
A: 
1. 檢查網路連線
2. 確認 App ID 正確
3. 檢查 CSP 設定
4. 查看 Console 錯誤訊息

### Q: 如何確認事件追蹤正常？
A: 
1. 使用 Facebook Events Manager
2. 檢查 Facebook Analytics
3. 開發模式下查看 Console 記錄

## 後續功能擴展

### 可新增功能
- Facebook 登入整合
- 社群分享按鈕
- Facebook 留言外掛程式
- Facebook Pixel 進階追蹤

### 相關文件
- [Facebook for Developers](https://developers.facebook.com/)
- [JavaScript SDK 文件](https://developers.facebook.com/docs/javascript/)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api/)

## 更新紀錄

- **2024-01-15**: 初始設定 Facebook SDK
- **2024-01-15**: 整合到 layout.tsx
- **2024-01-15**: 配置環境變數 