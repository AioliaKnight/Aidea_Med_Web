# 原始獨立腳本說明

本文件提供原始獨立腳本的說明和參考。這些腳本的功能已經整合到主要的 image-tools 工具中，但為了保留參考，我們將它們的文檔保存在此。

## convert-favicon.js

這個腳本用於從單一圖片生成多種尺寸的網站 favicon 和觸控圖標。

```javascript
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 定義各種圖示尺寸和檔名
const icons = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' }
];

// 源圖片路徑
const sourceImage = path.join(__dirname, 'public', 'logo-b.png');

// 目標目錄
const targetDir = path.join(__dirname, 'public');

// 為每個尺寸生成圖示
async function generateFavicons() {
  try {
    // 讀取源圖片
    const imageBuffer = fs.readFileSync(sourceImage);
    
    // 處理每個尺寸
    for (const icon of icons) {
      const outputPath = path.join(targetDir, icon.name);
      
      // 使用 sharp 調整大小並保持品質
      await sharp(imageBuffer)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({ quality: 90 })
        .toFile(outputPath);
      
      console.log(`已生成圖示: ${outputPath} (${icon.size}x${icon.size})`);
    }
    
    // 生成 favicon.ico (多尺寸 ICO 檔案)
    await sharp(imageBuffer)
      .resize(32, 32)
      .toFile(path.join(targetDir, 'favicon.ico'));
    
    console.log(`已生成 favicon.ico`);
    console.log('所有 favicon 和桌面圖示生成完成！');
  } catch (error) {
    console.error('生成圖示時發生錯誤:', error);
  }
}

// 開始處理
generateFavicons();
```

## convert-icons.js

這個腳本用於從單一圖片生成多種尺寸的 PWA 應用圖標。

```javascript
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 定義圖示尺寸
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// 源圖片路徑
const sourceImage = path.join(__dirname, 'public', 'logo-b.png');

// 目標目錄
const targetDir = path.join(__dirname, 'public', 'icons');

// 確保目標目錄存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`已創建目錄: ${targetDir}`);
}

// 為每個尺寸生成圖示
async function generateIcons() {
  try {
    // 讀取源圖片
    const imageBuffer = fs.readFileSync(sourceImage);
    
    // 處理每個尺寸
    for (const size of iconSizes) {
      const outputPath = path.join(targetDir, `icon-${size}x${size}.png`);
      
      // 使用 sharp 調整大小並保持品質
      await sharp(imageBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({ quality: 90 })
        .toFile(outputPath);
      
      console.log(`已生成圖示: ${outputPath} (${size}x${size})`);
    }
    
    console.log('所有 PWA 圖示生成完成！');
  } catch (error) {
    console.error('生成圖示時發生錯誤:', error);
  }
}

// 開始處理
generateIcons();
```

## 遷移說明

這些腳本的功能已經整合到 `src/tools/image-tools` 工具包中：

1. `convert-favicon.js` 的功能可透過以下方式使用：
   - 主要工具：`image-tools favicon <圖片路徑> [選項]`
   - 獨立腳本：`favicon-gen <圖片路徑> [輸出目錄]`

2. `convert-icons.js` 的功能可透過以下方式使用：
   - 主要工具：`image-tools icons <圖片路徑> [選項]`
   - 獨立腳本：`pwa-icons-gen <圖片路徑> [輸出目錄]`

建議使用新的整合工具，以便獲得更多功能和更好的維護。 