/**
 * 圖片轉換功能模組
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { formatFileSize, ensureDirectoryExists, fileExists } = require('./utils');
const { profiles, getProfileByFilename } = require('./profiles');

/**
 * 將圖片轉換為WebP格式
 * @param {string} inputPath 輸入圖片路徑
 * @param {string} outputPath 輸出圖片路徑
 * @param {number} quality WebP品質 (1-100)
 * @returns {Promise<Object>} 轉換結果
 */
async function convertToWebP(inputPath, outputPath, quality = 80) {
  try {
    console.log(`開始轉換: ${inputPath} -> ${outputPath}`);
    
    await sharp(inputPath)
      .webp({ quality: quality })
      .toFile(outputPath);
    
    // 獲取原始檔案和轉換後檔案的大小
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    
    const compressionRatio = (1 - webpSize / originalSize) * 100;
    console.log(`原始檔案大小: ${formatFileSize(originalSize)}`);
    console.log(`WebP 檔案大小: ${formatFileSize(webpSize)}`);
    console.log(`節省空間: ${compressionRatio.toFixed(2)}%`);
    
    return {
      success: true,
      originalSize,
      webpSize,
      compressionRatio
    };
  } catch (error) {
    console.error(`轉換失敗: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 轉換圖片並創建多種尺寸和格式
 * @param {string} inputPath 輸入圖片路徑
 * @param {string} outputDir 輸出目錄
 * @param {Object} options 選項
 * @returns {Promise<Object>} 轉換結果
 */
async function convertImage(inputPath, outputDir, options = {}) {
  try {
    const filename = path.basename(inputPath);
    const fileExt = path.extname(filename);
    const baseName = path.basename(filename, fileExt);
    
    // 確定使用哪個配置
    const profileConfig = options.profile ? 
      profiles[options.profile] : 
      (options.smartMode !== false ? getProfileByFilename(filename) : profiles.default);
    
    console.log(`\n===== 處理圖片: ${filename} =====`);
    console.log(`使用配置: ${options.profile || (options.smartMode !== false ? '智能模式' : '默認')}`);
    
    // 確保輸出目錄存在
    ensureDirectoryExists(outputDir);
    
    // 獲取原始圖片資訊
    const imageInfo = await sharp(inputPath).metadata();
    const originalSize = fs.statSync(inputPath).size;
    
    // 創建 WebP 版本
    const webpOutputPath = path.join(outputDir, `${baseName}.webp`);
    if (fileExists(webpOutputPath) && !options.force) {
      console.log(`- 跳過 WebP 轉換：${baseName}.webp 已存在`);
    } else {
      await sharp(inputPath)
        .webp({ quality: options.quality || profileConfig.webpQuality })
        .toFile(webpOutputPath);
        
      const webpSize = fs.statSync(webpOutputPath).size;
      const compressionRatio = (1 - webpSize / originalSize) * 100;
      
      console.log(`- 已創建 WebP: ${baseName}.webp`);
      console.log(`  原始大小: ${formatFileSize(originalSize)}`);
      console.log(`  WebP 大小: ${formatFileSize(webpSize)}`);
      console.log(`  ${compressionRatio > 0 ? '節省' : '增加'}空間: ${Math.abs(compressionRatio).toFixed(2)}%`);
    }
    
    // 創建不同尺寸的版本
    if (profileConfig.sizes && profileConfig.sizes.length > 0) {
      for (const size of profileConfig.sizes) {
        // 如果不是數字類型的size (針對PWA圖標)，則跳過
        if (typeof size !== 'object') continue;
        
        // 如果原始圖片小於目標尺寸，則跳過
        if (imageInfo.width <= size.width) {
          console.log(`- 跳過 ${size.name} 尺寸：原始圖片(${imageInfo.width}px)比目標尺寸(${size.width}px)小`);
          continue;
        }
        
        // WebP 版本
        const sizeWebpPath = path.join(outputDir, `${baseName}_${size.name}.webp`);
        if (fileExists(sizeWebpPath) && !options.force) {
          console.log(`- 跳過 ${size.name} WebP：${baseName}_${size.name}.webp 已存在`);
        } else {
          await sharp(inputPath)
            .resize(size.width, null, { withoutEnlargement: true })
            .webp({ quality: options.quality || profileConfig.webpQuality })
            .toFile(sizeWebpPath);
          console.log(`- 已創建 ${size.name} WebP: ${baseName}_${size.name}.webp`);
        }
        
        // 原始格式版本
        const sizeOrigPath = path.join(outputDir, `${baseName}_${size.name}${fileExt}`);
        if (fileExists(sizeOrigPath) && !options.force) {
          console.log(`- 跳過 ${size.name} ${fileExt.substring(1)}：${baseName}_${size.name}${fileExt} 已存在`);
        } else {
          const sharpInstance = sharp(inputPath)
            .resize(size.width, null, { withoutEnlargement: true });
            
          // 根據不同格式設定輸出選項
          if (fileExt.toLowerCase() === '.jpg' || fileExt.toLowerCase() === '.jpeg') {
            await sharpInstance.jpeg({ quality: options.quality || profileConfig.originalQuality }).toFile(sizeOrigPath);
          } else if (fileExt.toLowerCase() === '.png') {
            await sharpInstance.png({ quality: options.quality || profileConfig.originalQuality }).toFile(sizeOrigPath);
          } else {
            await sharpInstance.toFile(sizeOrigPath);
          }
          
          console.log(`- 已創建 ${size.name} ${fileExt.substring(1)}: ${baseName}_${size.name}${fileExt}`);
        }
      }
    }
    
    // 創建占位圖像
    if (profileConfig.placeholder) {
      // WebP 版本
      const placeholderWebpPath = path.join(outputDir, `${baseName}_placeholder.webp`);
      if (fileExists(placeholderWebpPath) && !options.force) {
        console.log(`- 跳過占位圖像 WebP：${baseName}_placeholder.webp 已存在`);
      } else {
        await sharp(inputPath)
          .resize(profileConfig.placeholder.width, null, { withoutEnlargement: true })
          .blur(profileConfig.placeholder.blur)
          .webp({ quality: profileConfig.placeholder.quality })
          .toFile(placeholderWebpPath);
        console.log(`- 已創建占位圖像 WebP: ${baseName}_placeholder.webp`);
      }
      
      // 原始格式版本
      const placeholderOrigPath = path.join(outputDir, `${baseName}_placeholder${fileExt}`);
      if (fileExists(placeholderOrigPath) && !options.force) {
        console.log(`- 跳過占位圖像 ${fileExt.substring(1)}：${baseName}_placeholder${fileExt} 已存在`);
      } else {
        const sharpInstance = sharp(inputPath)
          .resize(profileConfig.placeholder.width, null, { withoutEnlargement: true })
          .blur(profileConfig.placeholder.blur);
          
        // 根據不同格式設定輸出選項
        if (fileExt.toLowerCase() === '.jpg' || fileExt.toLowerCase() === '.jpeg') {
          await sharpInstance.jpeg({ quality: profileConfig.placeholder.quality }).toFile(placeholderOrigPath);
        } else if (fileExt.toLowerCase() === '.png') {
          await sharpInstance.png({ quality: profileConfig.placeholder.quality }).toFile(placeholderOrigPath);
        } else {
          await sharpInstance.toFile(placeholderOrigPath);
        }
        
        console.log(`- 已創建占位圖像 ${fileExt.substring(1)}: ${baseName}_placeholder${fileExt}`);
      }
    }
    
    console.log(`圖片 ${filename} 處理完成!`);
    
    return { success: true, filename };
  } catch (error) {
    console.error(`處理圖片 ${inputPath} 時出錯: ${error.message}`);
    return { success: false, filename: path.basename(inputPath), error: error.message };
  }
}

/**
 * 生成Favicon和Touch Icons
 * @param {string} sourceImage 源圖片路徑
 * @param {string} targetDir 目標目錄
 * @param {Object} options 選項
 * @returns {Promise<Object>} 處理結果
 */
async function generateFavicons(sourceImage, targetDir, options = {}) {
  try {
    // 讀取源圖片
    const imageBuffer = fs.readFileSync(sourceImage);
    const profile = profiles.favicon;
    const icons = profile.names;
    
    console.log(`\n===== 生成Favicon系列圖標 =====`);
    console.log(`源圖片: ${sourceImage}`);
    console.log(`目標目錄: ${targetDir}`);
    
    // 確保目標目錄存在
    ensureDirectoryExists(targetDir);
    
    // 處理每個尺寸
    for (const icon of icons) {
      const outputPath = path.join(targetDir, icon.name);
      
      // 如果文件存在且不強制覆蓋，則跳過
      if (fileExists(outputPath) && !options.force) {
        console.log(`- 跳過 ${icon.name}：文件已存在`);
        continue;
      }
      
      // 使用 sharp 調整大小並保持品質
      await sharp(imageBuffer)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({ quality: options.quality || profile.originalQuality })
        .toFile(outputPath);
      
      console.log(`- 已生成圖標: ${icon.name} (${icon.size}x${icon.size})`);
    }
    
    // 生成 favicon.ico (多尺寸 ICO 檔案)
    const faviconPath = path.join(targetDir, 'favicon.ico');
    if (fileExists(faviconPath) && !options.force) {
      console.log(`- 跳過 favicon.ico：文件已存在`);
    } else {
      await sharp(imageBuffer)
        .resize(32, 32)
        .toFile(faviconPath);
      
      console.log(`- 已生成 favicon.ico`);
    }
    
    console.log('所有 favicon 和桌面圖示生成完成！');
    return { success: true, count: icons.length + 1 };
  } catch (error) {
    console.error('生成圖示時發生錯誤:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 生成PWA圖標
 * @param {string} sourceImage 源圖片路徑
 * @param {string} targetDir 目標目錄
 * @param {Object} options 選項
 * @returns {Promise<Object>} 處理結果
 */
async function generatePWAIcons(sourceImage, targetDir, options = {}) {
  try {
    // 讀取源圖片
    const imageBuffer = fs.readFileSync(sourceImage);
    const profile = profiles.pwaIcon;
    const iconSizes = profile.sizes;
    
    console.log(`\n===== 生成PWA圖標 =====`);
    console.log(`源圖片: ${sourceImage}`);
    console.log(`目標目錄: ${targetDir}`);
    
    // 確保目標目錄存在
    ensureDirectoryExists(targetDir);
    
    // 處理每個尺寸
    for (const size of iconSizes) {
      const outputPath = path.join(targetDir, `icon-${size}x${size}.png`);
      
      // 如果文件存在且不強制覆蓋，則跳過
      if (fileExists(outputPath) && !options.force) {
        console.log(`- 跳過 icon-${size}x${size}.png：文件已存在`);
        continue;
      }
      
      // 使用 sharp 調整大小並保持品質
      await sharp(imageBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({ quality: options.quality || profile.originalQuality })
        .toFile(outputPath);
      
      console.log(`- 已生成圖標: icon-${size}x${size}.png`);
    }
    
    console.log('所有 PWA 圖標生成完成！');
    return { success: true, count: iconSizes.length };
  } catch (error) {
    console.error('生成圖標時發生錯誤:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 處理目錄中的所有圖片
 * @param {string} directory 來源目錄
 * @param {string} outputDir 輸出目錄
 * @param {Object} options 選項
 * @returns {Promise<Object>} 處理結果
 */
async function processDirectory(directory, outputDir, options = {}) {
  try {
    console.log(`\n掃描目錄: ${directory}`);
    
    // 讀取目錄中的所有項目
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    // 圖片檔案列表和子目錄列表
    let imageFiles = [];
    let subdirectories = [];
    
    // 收集圖片和子目錄
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory() && options.recursive) {
        subdirectories.push({ path: fullPath, name: entry.name });
      } else if (entry.isFile() && isImage(entry.name, options.formats, options.exclude)) {
        imageFiles.push(fullPath);
      }
    }
    
    console.log(`找到 ${imageFiles.length} 個圖片檔案需要處理`);
    
    // 追蹤處理進度
    const results = {
      total: imageFiles.length,
      success: 0,
      failed: 0,
      errors: []
    };
    
    // 逐一處理圖片
    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = imageFiles[i];
      console.log(`\n[${i + 1}/${imageFiles.length}] 處理中...`);
      
      const result = await convertImage(imagePath, outputDir, options);
      
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({
          file: result.filename,
          error: result.error
        });
      }
    }
    
    // 處理子目錄
    if (options.recursive && subdirectories.length > 0) {
      console.log(`\n處理 ${subdirectories.length} 個子目錄...`);
      
      for (const subdir of subdirectories) {
        // 為子目錄創建相應的輸出目錄
        const subOutputDir = path.join(outputDir, subdir.name);
        
        // 遞迴處理子目錄
        const subResults = await processDirectory(subdir.path, subOutputDir, options);
        
        // 合併結果
        results.total += subResults.total;
        results.success += subResults.success;
        results.failed += subResults.failed;
        results.errors = results.errors.concat(subResults.errors);
      }
    }
    
    return results;
  } catch (error) {
    console.error(`讀取目錄 ${directory} 時出錯: ${error.message}`);
    return {
      total: 0,
      success: 0,
      failed: 0,
      errors: [{ file: directory, error: error.message }]
    };
  }
}

module.exports = {
  convertToWebP,
  convertImage,
  generateFavicons,
  generatePWAIcons,
  processDirectory
}; 