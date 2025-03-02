#!/usr/bin/env node

/**
 * PWA 圖標生成工具
 * 
 * 這是一個獨立的命令行腳本，用於生成 Progressive Web App (PWA) 所需的各種尺寸圖標。
 * 使用 src/tools/image-tools/converters.js 中的函數實現功能。
 */

const path = require('path');
const { generatePWAIcons } = require('./converters');

// 定義預設設定
const DEFAULT_CONFIG = {
  quality: 90,
  background: { r: 255, g: 255, b: 255, alpha: 0 }
};

/**
 * 主程式
 */
async function main() {
  try {
    // 取得命令行參數
    const args = process.argv.slice(2);
    
    // 檢查參數
    if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
      console.log(`
PWA 圖標生成工具

使用方法:
  pwa-icons.js <來源圖片> [目標目錄]

參數:
  <來源圖片>   用於生成 PWA 圖標的來源圖片路徑
  [目標目錄]   生成的圖標存放目錄 (預設: ./public/icons)

範例:
  pwa-icons.js logo.png
  pwa-icons.js ./assets/logo.png ./public/pwa-icons
      `);
      process.exit(0);
    }
    
    // 解析參數
    const sourceImage = args[0];
    const targetDir = args[1] || path.join(process.cwd(), 'public', 'icons');
    
    console.log(`開始生成 PWA 圖標...`);
    console.log(`來源圖片: ${sourceImage}`);
    console.log(`目標目錄: ${targetDir}`);
    
    // 呼叫 generatePWAIcons 函數
    await generatePWAIcons(sourceImage, targetDir, DEFAULT_CONFIG);
    
    console.log(`\n✅ PWA 圖標生成完成！`);
  } catch (error) {
    console.error(`\n❌ 錯誤: ${error.message}`);
    process.exit(1);
  }
}

// 執行主程式
main(); 