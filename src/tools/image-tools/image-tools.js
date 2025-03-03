#!/usr/bin/env node

/**
 * image-tools.js - 圖片處理工具主入口
 * 
 * 這個工具整合了多個圖片處理功能，包括：
 * - 將圖片轉換為 WebP 格式
 * - 生成響應式圖片（多種尺寸）
 * - 從源圖片生成 favicon 和 touch icon
 * - 從源圖片生成 PWA 圖標
 * - 批量處理目錄中的圖片
 */

const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const { getProfile, listProfiles } = require('./profiles');
const { 
  convertToWebP, 
  convertImage, 
  generateFavicons, 
  generatePWAIcons, 
  processDirectory 
} = require('./converters');

// 默認配置
const DEFAULT_CONFIG = {
  sourceDir: './src/images',
  targetDir: './public/images',
  formats: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  excludePattern: /\.(min|processed|converted)\.|-(sm|md|lg|xl)\./,
  recursive: false,
  smartMode: true,
  force: false,
  webpQuality: 80
};

/**
 * 解析環境變數和命令行參數，構建選項對象
 * @param {Object} args - 命令行參數
 * @returns {Object} 構建的選項
 */
function buildOptions(args) {
  const options = {};
  
  // 從環境變數獲取默認值
  options.targetDir = process.env.IMAGE_TOOLS_OUT_DIR || DEFAULT_CONFIG.targetDir;
  options.quality = process.env.IMAGE_TOOLS_QUALITY || DEFAULT_CONFIG.webpQuality;
  options.profile = process.env.IMAGE_TOOLS_DEFAULT_PROFILE || 'default';
  
  // 覆蓋命令行選項
  if (args.out) options.targetDir = args.out;
  if (args.dir) options.sourceDir = args.dir;
  if (args.quality) options.quality = parseInt(args.quality, 10);
  if (args.profile) options.profile = args.profile;
  
  // 布爾選項
  options.force = !!args.force;
  options.recursive = !!args.recursive;
  options.verbose = !!args.verbose || process.env.IMAGE_TOOLS_VERBOSE === '1';
  
  // 智能模式（預設啟用）
  options.smartMode = args.smart !== false && args['no-smart'] !== true;
  
  // 解析尺寸
  if (args.sizes) {
    options.sizes = args.sizes === 'all' ? 'all' : args.sizes.split(',');
  }
  
  // 解析格式
  if (args.formats) {
    options.formats = args.formats.split(',');
  }
  
  return options;
}

function createCommandOptions(args) {
  const options = {
    formats: config.formats,
    exclude: config.exclude,
    smartMode: args.options['no-smart'] ? false : config.smartMode,
    force: args.options.force || config.force,
    recursive: args.options.recursive || config.recursive
  };

  // 設置品質
  if (args.options.quality) {
    options.quality = parseInt(args.options.quality);
  }

  // 設置配置
  if (args.options.profile && profiles[args.options.profile]) {
    options.profile = args.options.profile;
  }

  // 設置尺寸
  if (args.options.sizes) {
    options.sizes = args.options.sizes.split(',');
  }

  return options;
}

/**
 * 執行 WebP 命令
 * @param {Object} params - 參數
 * @param {string} params.sourceFile - 源文件
 * @param {string} params.targetDir - 目標目錄
 * @param {Object} params.options - 選項
 * @returns {Promise<Object>} 結果
 */
async function executeWebpCommand({ sourceFile, targetDir, options = {} }) {
  try {
    // 檢查源文件是否存在
    if (!(await utils.fileExists(sourceFile))) {
      throw new Error(`找不到源文件: ${sourceFile}`);
    }
    
    // 確定輸出路徑
    let outputPath;
    if (targetDir) {
      await utils.ensureDirectoryExists(targetDir);
      const baseName = utils.getBasename(sourceFile);
      outputPath = path.join(targetDir, `${baseName}.webp`);
    } else {
      const sourceDir = path.dirname(sourceFile);
      const baseName = utils.getBasename(sourceFile);
      outputPath = path.join(sourceDir, `${baseName}.webp`);
    }
    
    console.log(`正在將 ${sourceFile} 轉換為 WebP 格式...`);
    
    // 執行轉換
    const result = await convertToWebP(sourceFile, outputPath, {
      quality: options.quality || DEFAULT_CONFIG.webpQuality,
      force: options.force || false
    });
    
    if (result.success) {
      console.log(`轉換成功: ${result.outputPath}`);
      console.log(`原始大小: ${utils.formatFileSize(result.originalSize)}`);
      console.log(`轉換後大小: ${utils.formatFileSize(result.convertedSize)}`);
      console.log(`壓縮比: ${result.compressionRatio}`);
      return { success: true, result };
    } else if (result.skipped) {
      console.log(`跳過: ${outputPath} (文件已存在，使用 --force 強制覆寫)`);
      return { success: true, skipped: true };
    } else {
      console.error(`轉換失敗: ${result.error}`);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error(`執行 WebP 命令時出錯: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 執行轉換命令
 * @param {Object} params - 參數
 * @param {string} params.sourceFile - 源文件
 * @param {string} params.sourceDir - 源目錄
 * @param {string} params.targetDir - 目標目錄
 * @param {Object} params.options - 選項
 * @returns {Promise<Object>} 結果
 */
async function executeConvertCommand({ sourceFile, sourceDir, targetDir, options = {} }) {
  try {
    // 檢查是處理單個文件還是目錄
    if (sourceFile) {
      // 單個文件處理
      if (!(await utils.fileExists(sourceFile))) {
        throw new Error(`找不到源文件: ${sourceFile}`);
      }
      
      const filename = path.basename(sourceFile);
      
      // 確定使用的配置
      let profileName = options.profile || 'default';
      
      // 如果啟用了智能模式，嘗試從文件名猜測配置
      if (options.smartMode) {
        const smartProfile = utils.getProfileFromSmartMode(filename);
        if (smartProfile) {
          profileName = smartProfile;
          console.log(`使用智能配置: ${profileName} (根據文件名推斷)`);
        }
      }
      
      const profile = getProfile(profileName);
      
      console.log(`正在使用 ${profile.name} 配置轉換 ${filename}...`);
      
      // 執行轉換
      const result = await convertImage(sourceFile, targetDir, profile, {
        sizes: options.sizes,
        formats: options.formats,
        force: options.force
      });
      
      if (result.success) {
        const successCount = result.outputs.filter(o => !o.skipped).length;
        const skippedCount = result.outputs.filter(o => o.skipped).length;
        
        console.log(`轉換成功: ${filename}`);
        console.log(`- 生成文件數: ${successCount}`);
        
        if (skippedCount > 0) {
          console.log(`- 跳過文件數: ${skippedCount} (文件已存在，使用 --force 強制覆寫)`);
        }
        
        if (result.errors.length > 0) {
          console.warn(`- 部分轉換失敗: ${result.errors.length} 個錯誤`);
          result.errors.forEach(err => {
            console.warn(`  - ${err.size}/${err.format}: ${err.error}`);
          });
        }
        
        return { success: true, result };
      } else {
        console.error(`轉換失敗: ${result.error}`);
        return { success: false, error: result.error };
      }
    } else if (sourceDir) {
      // 目錄處理
      if (!(await utils.fileExists(sourceDir))) {
        throw new Error(`找不到源目錄: ${sourceDir}`);
      }
      
      // 檢查是否為目錄
      const stats = fs.statSync(sourceDir);
      if (!stats.isDirectory()) {
        throw new Error(`${sourceDir} 不是一個目錄`);
      }
      
      // 確定使用的配置
      const profileName = options.profile || 'default';
      const profile = getProfile(profileName);
      
      console.log(`正在處理目錄: ${sourceDir} (使用 ${profile.name} 配置)`);
      console.log(`- 輸出目錄: ${targetDir}`);
      console.log(`- 遞迴處理: ${options.recursive ? '是' : '否'}`);
      
      // 執行目錄處理
      const result = await processDirectory(sourceDir, targetDir, profile, {
        recursive: options.recursive,
        formats: DEFAULT_CONFIG.formats,
        exclude: DEFAULT_CONFIG.excludePattern,
        force: options.force
      });
      
      console.log(`\n處理完成:`);
      console.log(`- 總圖片數: ${result.total}`);
      console.log(`- 成功處理: ${result.success}`);
      console.log(`- 跳過處理: ${result.skipped} (文件已存在，使用 --force 強制覆寫)`);
      
      if (result.failed > 0) {
        console.warn(`- 處理失敗: ${result.failed}`);
        result.errors.slice(0, 5).forEach(err => {
          console.warn(`  - ${err.path}: ${err.error}`);
        });
        
        if (result.errors.length > 5) {
          console.warn(`  - 還有 ${result.errors.length - 5} 個錯誤未顯示`);
        }
      }
      
      return { success: true, result };
    } else {
      throw new Error('未指定源文件或目錄');
    }
  } catch (error) {
    console.error(`執行轉換命令時出錯: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 執行 Favicon 命令
 * @param {Object} params - 參數
 * @param {string} params.sourceFile - 源文件
 * @param {string} params.targetDir - 目標目錄
 * @param {Object} params.options - 選項
 * @returns {Promise<Object>} 結果
 */
async function executeFaviconCommand({ sourceFile, targetDir, options = {} }) {
  try {
    // 檢查源文件是否存在
    if (!(await utils.fileExists(sourceFile))) {
      throw new Error(`找不到源文件: ${sourceFile}`);
    }
    
    // 確保目標目錄存在
    if (!targetDir) {
      targetDir = './public';
    }
    
    await utils.ensureDirectoryExists(targetDir);
    
    // 確定輸出路徑
    const fileExt = path.extname(sourceFile);
    const baseName = path.basename(sourceFile, fileExt);
    const outputDir = targetDir || path.dirname(sourceFile);

    // 執行 favicon 生成
    console.log(`生成 Favicon 圖標，源文件: ${sourceFile}...`);
    const result = await generateFavicons(sourceFile, outputDir, options);

    if (result.success) {
      console.log(`Favicon 生成成功! 輸出目錄: ${outputDir}`);
      return { success: true, outputFiles: result.outputFiles };
    } else {
      throw new Error(result.error || '生成 Favicon 失敗');
    }
  } catch (error) {
    console.error(`生成 Favicon 時出錯: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 執行圖片轉換命令(包含多尺寸)
 * @param {Object} args 命令參數
 */
async function handleConvertCommand(args) {
  // 檢查是單個文件還是目錄處理
  if (args.sourceFile) {
    // 單個文件處理
    if (!fs.existsSync(args.sourceFile)) {
      console.error(`錯誤: 找不到文件 ${args.sourceFile}`);
      return;
    }

    const outputDir = args.targetDir || path.dirname(args.sourceFile);
    const options = createCommandOptions(args);

    // 執行轉換
    console.log(`處理單個文件 ${args.sourceFile}...`);
    const result = await convertImage(args.sourceFile, outputDir, options);

    if (result.success) {
      console.log(`處理完成! 輸出目錄: ${outputDir}`);
    } else {
      console.error(`處理失敗: ${result.error}`);
    }
  } else if (args.sourceDir || args.options.dir) {
    // 目錄處理
    const sourceDir = args.sourceDir || args.options.dir || config.sourceDir;
    
    if (!fs.existsSync(sourceDir)) {
      console.error(`錯誤: 找不到目錄 ${sourceDir}`);
      return;
    }

    const outputDir = args.targetDir || args.options.out || sourceDir;
    const options = createCommandOptions(args);

    // 執行目錄處理
    console.log(`處理目錄 ${sourceDir}...`);
    const results = await processDirectory(sourceDir, outputDir, options);

    // 打印處理摘要
    console.log('\n====== 處理摘要 ======');
    console.log(`總圖片數: ${results.total}`);
    console.log(`成功處理: ${results.success}`);
    console.log(`處理失敗: ${results.failed}`);

    if (results.errors.length > 0) {
      console.log('\n錯誤詳情:');
      results.errors.forEach((err, index) => {
        console.log(`${index + 1}. ${err.file}: ${err.error}`);
      });
    }
  } else {
    console.error('錯誤: 未指定源文件或目錄。請指定 --dir=<目錄> 或提供文件路徑。');
    utils.showHelp();
  }
}

/**
 * 執行favicon生成命令
 * @param {Object} args 命令參數
 */
async function handleFaviconCommand(args) {
  // 檢查是否指定了源文件
  if (!args.sourceFile) {
    console.error('錯誤: 未指定源文件。請提供logo圖片路徑。');
    utils.showHelp();
    return;
  }

  if (!fs.existsSync(args.sourceFile)) {
    console.error(`錯誤: 找不到文件 ${args.sourceFile}`);
    return;
  }

  const targetDir = args.targetDir || './public';
  const options = createCommandOptions(args);

  // 執行favicon生成
  console.log(`從 ${args.sourceFile} 生成favicon系列圖標...`);
  const result = await generateFavicons(args.sourceFile, targetDir, options);

  if (result.success) {
    console.log(`處理完成! 已生成 ${result.count} 個圖標文件到 ${targetDir}`);
  } else {
    console.error(`處理失敗: ${result.error}`);
  }
}

/**
 * 執行PWA圖標生成命令
 * @param {Object} args 命令參數
 */
async function executeIconsCommand(args) {
  // 檢查是否指定了源文件
  if (!args.sourceFile) {
    console.error('錯誤: 未指定源文件。請提供logo圖片路徑。');
    utils.showHelp();
    return;
  }

  if (!fs.existsSync(args.sourceFile)) {
    console.error(`錯誤: 找不到文件 ${args.sourceFile}`);
    return;
  }

  // 確定輸出目錄
  const outputDir = args.targetDir || args.options.out || path.join(path.dirname(args.sourceFile), 'public', 'icons');

  // 執行PWA圖標生成
  console.log(`從 ${args.sourceFile} 生成PWA圖標...`);
  const options = createCommandOptions(args);
  const result = await generatePWAIcons(args.sourceFile, outputDir, options);

  if (result.success) {
    console.log(`處理完成! 已生成 ${result.count} 個PWA圖標文件到 ${outputDir}`);
  } else {
    console.error(`處理失敗: ${result.error}`);
  }
}

/**
 * 執行批處理命令
 * @param {Object} args 命令參數
 */
async function executeBatchCommand(args) {
  const sourceDir = args.sourceDir;
  const targetDir = args.targetDir || args.options.out || sourceDir;
  
  // 檢查源目錄是否存在
  if (!fs.existsSync(sourceDir)) {
    console.error(`錯誤: 找不到目錄 ${sourceDir}`);
    return;
  }

  const recursive = args.options.recursive || false;
  
  // 構建選項
  const options = createCommandOptions(args);
  options.recursive = recursive;

  // 執行批處理
  console.log(`批量處理目錄 ${sourceDir} 中的圖片...`);
  console.log(`輸出到: ${targetDir}`);
  console.log(`處理子目錄: ${recursive ? '是' : '否'}`);

  const results = await processDirectory(sourceDir, targetDir, options);

  // 打印處理摘要
  console.log('\n====== 處理摘要 ======');
  console.log(`總圖片數: ${results.total}`);
  console.log(`成功處理: ${results.success}`);
  console.log(`處理失敗: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\n錯誤詳情:');
    results.errors.forEach((err, index) => {
      console.log(`${index + 1}. ${err.file}: ${err.error}`);
    });
  }
}

/**
 * 列出可用的配置設定檔
 */
function showAvailableProfiles() {
  console.log('\n可用的圖片處理配置:');
  Object.keys(profiles).forEach((profileName, index) => {
    console.log(`${index + 1}. ${profileName}`);
  });
}

/**
 * 主函數 - 處理命令行參數並執行相應功能
 */
async function main() {
  // 解析命令行參數
  const args = utils.parseArgs(process.argv);

  // 沒有指定命令或請求幫助
  if (!args.command || args.options.help) {
    utils.showHelp();
    return;
  }

  // 根據命令執行相應功能
  switch (args.command.toLowerCase()) {
    case 'webp':
      await executeWebpCommand(args);
      break;
    case 'convert':
      await handleConvertCommand(args);
      break;
    case 'favicon':
      await handleFaviconCommand(args);
      break;
    case 'icons':
      await executeIconsCommand(args);
      break;
    case 'batch':
      await executeBatchCommand(args);
      break;
    case 'list-profiles':
      showAvailableProfiles();
      break;
    default:
      console.error(`未知命令: ${args.command}`);
      utils.showHelp();
  }
}

// 執行主函數
if (require.main === module) {
  main().catch(err => {
    console.error('執行過程中發生錯誤:', err);
    process.exit(1);
  });
}

module.exports = {
  executeWebpCommand,
  executeConvertCommand,
  executeFaviconCommand,
  executeIconsCommand,
  executeBatchCommand,
  main
}; 