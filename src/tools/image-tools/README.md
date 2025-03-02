# 圖片處理工具 (Image Tools)

這是一個綜合圖片處理工具，整合了多個功能，能夠有效地處理網站中的圖片資源。

## 功能特點

- **WebP 轉換**：將圖片轉換為高效的 WebP 格式
- **響應式圖片**：生成多種尺寸的圖片，以適應不同裝置
- **Favicon 生成**：從單一圖片生成完整的 favicon 和 touch icon 系列
- **PWA 圖標**：生成用於 PWA 應用的各種尺寸圖標
- **批量處理**：一次處理目錄中的多個圖片
- **智能模式**：根據檔案名稱自動選擇最佳配置
- **多種配置**：根據不同類型的圖片提供優化的處理配置

## 安裝

### 前提條件

- Node.js >= 14.0.0
- NPM 或 Yarn

### 安裝步驟

```bash
# 全局安裝
npm install -g image-tools

# 或者使用 Yarn
yarn global add image-tools

# 或者在項目中本地安裝
npm install --save-dev image-tools
```

## 使用方式

### 主要命令行工具

主要命令行工具整合了所有功能：

```bash
# 轉換圖片為 WebP 格式
image-tools webp path/to/image.jpg

# 創建響應式圖片（多種尺寸）
image-tools convert path/to/image.jpg --profile=hero

# 生成 favicon 圖標
image-tools favicon path/to/logo.png

# 生成 PWA 圖標
image-tools icons path/to/logo.png

# 批量處理目錄
image-tools batch --source=./images --target=./optimized
```

### 獨立腳本

如果您只需要使用特定功能，可以使用以下獨立腳本：

#### Favicon 生成

```bash
# 使用獨立腳本生成 favicon
favicon-gen path/to/logo.png [output-directory]

# 或使用 NPM 腳本
npm run favicon-direct path/to/logo.png
```

#### PWA 圖標生成

```bash
# 使用獨立腳本生成 PWA 圖標
pwa-icons-gen path/to/logo.png [output-directory]

# 或使用 NPM 腳本
npm run icons-direct path/to/logo.png
```

這些獨立腳本專注於特定功能，使用更簡單的參數結構，適合整合到自動化流程中。

## 配置選項

這個工具內建了多種圖片處理配置，針對不同類型的圖片提供最佳設定：

- `caseStudy`: 案例研究圖片配置
- `hero`: 英雄橫幅圖片配置
- `icon`: 網站圖標配置
- `product`: 產品圖片配置
- `teamMember`: 團隊成員照片配置
- `thumbnail`: 內容縮略圖配置
- `blogImage`: 部落格文章圖片配置
- `pwaIcon`: PWA 圖標配置
- `favicon`: Favicon 配置

可以透過 `--profile` 選項來指定使用哪種配置，或者使用智能模式，讓工具根據檔案名稱自動選擇適合的配置。

```bash
# 查看可用的配置設定檔
image-tools list-profiles
```

## 在專案中使用

如果你想在自己的 Node.js 專案中使用這個工具的功能，可以這樣做：

```javascript
const imageTools = require('image-tools');

// 轉換為 WebP
imageTools.executeWebpCommand({
  sourceFile: './image.jpg',
  options: { quality: 90 }
});

// 轉換圖片
imageTools.executeConvertCommand({
  sourceFile: './image.jpg',
  options: { profile: 'hero' }
});

// 生成 favicon
imageTools.executeFaviconCommand({
  sourceFile: './logo.png',
  targetDir: './public'
});

// 生成 PWA 圖標
imageTools.executeIconsCommand({
  sourceFile: './logo.png',
  targetDir: './public/icons'
});

// 批量處理
imageTools.executeBatchCommand({
  sourceDir: './images',
  targetDir: './optimized',
  options: { recursive: true }
});
```

## 使用優化建議

1. 在開發過程中使用 `convert` 命令處理單個圖片
2. 在上線前使用 `batch` 命令處理整個專案的圖片
3. 使用 `favicon` 和 `icons` 命令生成適合的網站圖標
4. 優先選擇 WebP 格式，但保留原始格式作為後備方案
5. 使用智能模式讓工具根據檔案名稱自動選擇最佳配置

## 疑難排解

如果遇到問題，請檢查：

1. Sharp 套件是否正確安裝
2. 圖片路徑是否正確
3. 是否有寫入權限到輸出目錄

## 授權

本工具使用 MIT 授權發布。 