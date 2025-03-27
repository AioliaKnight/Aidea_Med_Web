const toIco = require('to-ico');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

async function createIco() {
  try {
    // 圖標尺寸
    const sizes = [16, 24, 32, 48, 64];
    const buffers = [];
    
    // 生成各種尺寸的PNG圖標
    for (const size of sizes) {
      await sharp('public/logo.png')
        .resize(size, size)
        .toFile(`temp/icons/icon-${size}x${size}.png`);
      
      const buffer = await fs.promises.readFile(`temp/icons/icon-${size}x${size}.png`);
      buffers.push(buffer);
    }
    
    // 將PNG圖標轉換為ICO格式
    const icoBuffer = await toIco(buffers);
    
    // 寫入ICO文件
    await fs.promises.writeFile('temp/favicon.ico', icoBuffer);
    console.log('高解析度 favicon.ico 生成完成');
    
    // 複製到public目錄
    await fs.promises.copyFile('temp/favicon.ico', 'public/favicon.ico');
    console.log('已複製到 public 目錄');
  } catch (err) {
    console.error('生成 favicon.ico 失敗:', err);
  }
}

createIco(); 