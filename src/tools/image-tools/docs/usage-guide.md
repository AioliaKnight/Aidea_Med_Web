# 圖片轉換工具使用指南

這個工具包可以幫助你輕鬆地將網站中的圖片批量轉換為 WebP 格式和不同尺寸的版本，優化網站載入速度和用戶體驗。

## 功能特色

- 將 JPG/PNG 等圖片轉換為高效的 WebP 格式
- 自動創建不同尺寸的圖片版本（手機版、平板版等）
- 生成低品質的模糊預覽圖，支持漸進式載入
- 智能檢測圖片類型，套用最佳優化配置
- 支持批量處理整個目錄或指定圖片
- 智能跳過已處理的圖片，節省時間
- 提供詳細的轉換報告和錯誤診斷

## 環境需求

- Node.js (v14+)
- Sharp 套件 (`npm install sharp`)

## 使用方法

### 基本用法

處理整個 public 目錄中的圖片：

```bash
image-tools batch
```

處理特定圖片：

```bash
image-tools convert image1.jpg
```

### 進階選項

可以使用以下選項自定義處理行為：

```bash
image-tools [命令] [選項] [檔案...]
```

#### 選項列表

- `--help`, `-h`: 顯示幫助訊息
- `--source`, `-s DIR`: 指定來源目錄 (默認: ./public)
- `--target`, `-t DIR`: 指定目標目錄 (默認: ./public)
- `--subdirs`, `-r`: 處理子目錄 (默認: false)
- `--profile`, `-p NAME`: 使用指定配置 (默認: caseStudy)
- `--smart`, `-m`: 使用智能模式根據檔名自動選擇配置 (默認: true)
- `--force`, `-f`: 強制覆寫已存在的檔案 (默認: false)
- `--list-profiles`, `-l`: 顯示所有可用配置

#### 例子

```bash
# 處理 images 目錄中的所有圖片，並將結果儲存到 optimized 目錄
image-tools batch --source ./images --target ./optimized

# 使用英雄橫幅配置處理圖片並強制覆寫已存在的檔案
image-tools convert banner.jpg --profile hero --force

# 列出所有可用的配置
image-tools list-profiles

# 處理包括子目錄在內的所有圖片
image-tools batch --subdirs
```

## 配置詳解

工具內置了多種圖片優化配置，針對不同類型的圖片設定最佳的處理參數：

1. **caseStudy**: 適合案例研究圖片
2. **hero**: 適合網站橫幅大圖
3. **icon**: 適合圖標和小型圖形
4. **product**: 適合產品圖片
5. **teamMember**: 適合團隊成員照片
6. **thumbnail**: 適合縮略圖
7. **blogImage**: 適合部落格文章圖片
8. **pwaIcon**: 適合 PWA 應用圖標
9. **favicon**: 適合網站圖標

每種配置都定義了：
- 不同尺寸的寬度設定
- WebP 和原始格式的品質設定
- 預覽圖的尺寸、模糊程度和品質

## 使用場景

### 批量處理已有的圖片

```bash
# 將所有現有圖片一次性轉換
image-tools batch --source ./public --subdirs --force
```

### 創建圖片上傳腳本

```javascript
// 上傳後自動處理圖片的示例
const { execSync } = require('child_process');

function processUploadedImage(imagePath) {
  // 上傳完成後自動優化
  execSync(`image-tools convert "${imagePath}" --force`);
}
```

### 添加到構建流程

```json
// package.json
{
  "scripts": {
    "build": "next build",
    "optimize-images": "image-tools batch --source ./public",
    "prebuild": "npm run optimize-images"
  }
}
```

## 故障排除

### 常見問題

1. **Error: Input file is missing**: 確認指定的圖片檔案路徑正確
2. **記憶體不足錯誤**: 調整配置中的 `batchSize` 參數降低同時處理的圖片數量
3. **處理速度慢**: 針對較大的目錄，可以按子目錄分批處理

### 相容性提示

- 不是所有瀏覽器都支持 WebP 格式，請確保網站有適當的 fallback 機制
- 對於透明圖片，PNG 轉 WebP 有時可能不會有太大的壓縮效果

## 自定義配置

如需添加新的圖片類型配置，請編輯 `profiles.js` 檔案：

```javascript
// 添加新的配置類型
profiles.newType = {
  sizes: [
    { name: 'sm', width: 400 }
  ],
  webpQuality: 85,
  originalQuality: 80,
  placeholder: {
    width: 200,
    blur: 8,
    quality: 30
  }
};

// 添加對應的檔名檢測規則
if (lowerFilename.startsWith('newtype_')) {
  return 'newType';
}
```

## 效能建議

- 對於大型網站，建議保留轉換後的圖片到 CDN
- 考慮使用現代圖片格式如 AVIF (較新的瀏覽器支持)，需要額外的配置
- 結合 `<picture>` 元素和 `srcset` 屬性在前端網頁中實現最佳呈現 