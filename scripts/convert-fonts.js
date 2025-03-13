/**
 * 字體轉換腳本
 * 將 TTF 格式轉換為更小的 WOFF2 格式
 * 
 * 使用方法:
 * 1. 安裝依賴: npm install ttf2woff2
 * 2. 執行: node scripts/convert-fonts.js
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ttf2woff2 from 'ttf2woff2';

// 獲取當前文件的目錄
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 字體目錄
const fontsDir = path.join(__dirname, '../public/fonts');

async function main() {
  try {
    // 找出所有 TTF 字體
    const files = await fs.readdir(fontsDir);
    const ttfFonts = files.filter(file => file.toLowerCase().endsWith('.ttf'));

    console.log(`找到 ${ttfFonts.length} 個 TTF 字體檔案，開始轉換...`);

    // 轉換每個 TTF 字體為 WOFF2
    for (const font of ttfFonts) {
      const ttfPath = path.join(fontsDir, font);
      const woff2Path = ttfPath.replace(/\.ttf$/i, '.woff2');
      
      try {
        // 讀取 TTF 檔案
        const ttfBuffer = await fs.readFile(ttfPath);
        
        // 轉換為 WOFF2
        const woff2Buffer = ttf2woff2(ttfBuffer);
        
        // 儲存 WOFF2 檔案
        await fs.writeFile(woff2Path, woff2Buffer);
        
        // 計算尺寸縮減
        const ttfSize = ttfBuffer.length;
        const woff2Size = woff2Buffer.length;
        const reduction = ((ttfSize - woff2Size) / ttfSize * 100).toFixed(2);
        
        console.log(`✅ ${font} 轉換成功！尺寸從 ${formatSize(ttfSize)} 減少到 ${formatSize(woff2Size)} (減少 ${reduction}%)`);
      } catch (error) {
        console.error(`❌ 轉換 ${font} 失敗:`, error.message);
      }
    }

    console.log('\n完成轉換！請更新 fonts.css 以使用新的 WOFF2 字體檔案。');
    console.log('示例：將 format(\'truetype\') 改為 format(\'woff2\')，並將檔案路徑從 .ttf 改為 .woff2');
  } catch (error) {
    console.error('發生錯誤:', error.message);
  }
}

// 格式化檔案大小
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// 執行主函數
main(); 