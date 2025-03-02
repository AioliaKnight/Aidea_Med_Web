# 圖片處理工具示範指南

## 影片演示步驟指南

本指南提供錄製示範影片的腳本計劃，展示圖片處理工具的主要功能。

### 1. 工具介紹 (0:00-0:30)

- 簡介工具的目標和主要功能
- 提及它如何簡化網站圖片處理流程
- 強調整合了多個獨立工具的便利性

### 2. 安裝與設定 (0:30-1:30)

```bash
# 展示如何安裝
npm install -g image-tools

# 確認安裝
image-tools --version

# 顯示幫助訊息
image-tools --help
```

### 3. WebP 轉換功能 (1:30-3:00)

```bash
# 展示一張原始圖片
open original.jpg

# 轉換成 WebP
image-tools webp original.jpg

# 比較檔案大小
ls -la original.jpg original.webp

# 展示品質選項
image-tools webp --quality=90 original.jpg

# 開啟結果檔案
open original.webp
```

### 4. 生成響應式圖片 (3:00-5:00)

```bash
# 展示 convert 命令
image-tools convert hero-banner.jpg

# 查看生成的檔案
ls -la hero-banner*

# 展示不同尺寸
open hero-banner-sm.jpg
open hero-banner-md.jpg
open hero-banner-lg.jpg

# 使用特定配置檔
image-tools convert --profile=caseStudy case-example.jpg

# 查看生成的檔案
ls -la case-example*
```

### 5. Favicon 生成 (5:00-7:00)

```bash
# 從 logo 生成 favicon
image-tools favicon logo.png --out=./demo-public

# 查看生成的圖標
ls -la demo-public/

# 展示生成的圖標
open demo-public/favicon.ico
open demo-public/apple-touch-icon.png

# 展示在瀏覽器中的效果
# (這裡插入瀏覽器預覽片段)
```

### 6. PWA 圖標生成 (7:00-8:30)

```bash
# 生成 PWA 圖標
image-tools icons logo.png --out=./demo-public/icons

# 查看生成的圖標
ls -la demo-public/icons/

# 展示在 PWA 中的效果
# (這裡插入 PWA 預覽片段)
```

### 7. 批量處理功能 (8:30-10:30)

```bash
# 準備一個包含多個圖片的目錄
mkdir -p demo-images
cp sample1.jpg sample2.png sample3.jpg demo-images/

# 批量處理整個目錄
image-tools batch --dir=./demo-images --out=./optimized

# 查看結果
ls -la optimized/

# 展示遞迴處理子目錄
mkdir -p demo-images/sub
cp sample4.jpg demo-images/sub/

# 遞迴處理
image-tools batch --dir=./demo-images --recursive --out=./optimized

# 查看結果
ls -la optimized/sub/
```

### 8. 智能模式功能 (10:30-12:00)

```bash
# 展示自動識別檔案類型
cp logo.png hero-banner.jpg caseStudy-example.jpg team-profile.jpg demo-smart/

# 使用智能模式
image-tools batch --dir=./demo-smart --smart --out=./smart-optimized

# 查看根據檔案名稱應用的不同配置結果
ls -la smart-optimized/
```

### 9. 在項目中整合 (12:00-13:30)

```javascript
// 展示在 package.json 中添加腳本
{
  "scripts": {
    "optimize-images": "image-tools batch --dir=./src/images --out=./public/images",
    "generate-icons": "image-tools favicon src/assets/logo.png --out=./public"
  }
}

// 展示運行腳本
npm run optimize-images
npm run generate-icons
```

### 10. 效能分析與統計 (13:30-14:30)

```bash
# 展示處理前後的檔案大小差異
du -sh original-images/
du -sh optimized-images/

# 顯示處理前後的頁面載入速度
# (這裡插入頁面速度測試片段)
```

### 11. 進階技巧和注意事項 (14:30-16:00)

- 討論何時該使用哪種配置
- 如何自定義配置或添加新配置
- 圖片格式選擇的最佳實踐
- 整合到建置流程的建議

### 12. 總結 (16:00-17:00)

- 回顧工具的主要功能
- 強調圖片優化對網站效能的重要性
- 鼓勵觀眾嘗試這個工具
- 提供獲取進一步協助的資源

## 準備工作清單

在錄製示範影片前，請準備以下檔案：

1. 原始圖片範例：
   - logo.png (適合生成favicon和圖標的方形圖像)
   - hero-banner.jpg (大型橫幅圖像)
   - caseStudy-example.jpg (案例研究圖像)
   - team-profile.jpg (團隊成員照片)
   - 多張用於批量處理的各種格式圖片

2. 目錄結構：
   - demo-images/ (用於批量處理範例)
   - demo-public/ (用於輸出favicon和PWA圖標)
   - optimized/ (用於輸出處理後的圖片)

3. 演示環境：
   - 乾淨的命令行介面
   - 圖片瀏覽器
   - 網頁瀏覽器 (用於展示favicon和PWA效果)
   - 代碼編輯器 (用於展示集成到項目)

4. 可選：簡單的演示網站，展示優化前後的效果

## 錄製提示

- 使用高解析度螢幕錄製
- 適當放大終端機字體大小，確保清晰可讀
- 使用清晰的語音解說
- 在關鍵點暫停，強調重要概念
- 顯示錯誤處理和疑難排解的方法
- 保持節奏流暢，避免過長停頓 