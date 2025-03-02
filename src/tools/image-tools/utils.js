/**
 * utils.js - 圖片處理工具的實用函式集合
 * 
 * 這個模組提供各種輔助函式，用於檔案操作、路徑處理、圖片分析等。
 * 所有函式都設計成純函式或有明確目的的工具函式，便於測試和重用。
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// 將常用的 fs 函式轉換為 Promise 版本
const fsAccess = promisify(fs.access);
const fsMkdir = promisify(fs.mkdir);
const fsStat = promisify(fs.stat);
const fsReaddir = promisify(fs.readdir);

/**
 * 檢查檔案是否存在
 * @param {string} filePath - 檔案路徑
 * @returns {Promise<boolean>} - 檔案是否存在
 */
const fileExists = async (filePath) => {
  try {
    await fsAccess(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 確保目錄存在，如果不存在則創建它
 * @param {string} dirPath - 目錄路徑
 * @returns {Promise<boolean>} - 是否成功創建或已存在
 */
const ensureDirectoryExists = async (dirPath) => {
  try {
    if (await fileExists(dirPath)) {
      const stats = await fsStat(dirPath);
      if (stats.isDirectory()) {
        return true;
      }
      throw new Error(`路徑 '${dirPath}' 存在但不是目錄`);
    }
    
    await fsMkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error(`無法創建目錄 '${dirPath}': ${error.message}`);
    return false;
  }
};

/**
 * 取得不含副檔名的檔案名稱
 * @param {string} filePath - 檔案路徑
 * @returns {string} - 不含副檔名的檔案名稱
 */
const getBasename = (filePath) => {
  const basename = path.basename(filePath);
  const extname = path.extname(basename);
  return basename.slice(0, basename.length - extname.length);
};

/**
 * 取得檔案大小的人類可讀格式
 * @param {number} bytes - 檔案大小（以位元組為單位）
 * @param {number} [decimals=2] - 小數點位數
 * @returns {string} - 格式化後的檔案大小
 */
const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * 計算壓縮比率
 * @param {number} originalSize - 原始檔案大小
 * @param {number} compressedSize - 壓縮後檔案大小
 * @returns {string} - 格式化後的壓縮比率
 */
const calculateCompressionRatio = (originalSize, compressedSize) => {
  if (originalSize === 0) return '0%';
  
  const ratio = (1 - compressedSize / originalSize) * 100;
  return `${ratio.toFixed(2)}%`;
};

/**
 * 取得檔案的 MIME 類型
 * @param {string} filePath - 檔案路徑
 * @returns {string} - MIME 類型
 */
const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * 判斷檔案是否為圖片
 * @param {string} filePath - 檔案路徑
 * @returns {boolean} - 是否為圖片
 */
const isImage = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
  
  return imageExtensions.includes(ext);
};

/**
 * 檢查目錄中是否有圖片
 * @param {string} dirPath - 目錄路徑
 * @returns {Promise<boolean>} - 是否包含圖片
 */
const directoryContainsImages = async (dirPath) => {
  try {
    const files = await fsReaddir(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fsStat(filePath);
      
      if (stats.isFile() && isImage(filePath)) {
        return true;
      }
      
      if (stats.isDirectory()) {
        const containsImages = await directoryContainsImages(filePath);
        if (containsImages) {
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error(`檢查目錄 '${dirPath}' 時出錯: ${error.message}`);
    return false;
  }
};

/**
 * 返回輸出檔案路徑
 * @param {string} sourceFilePath - 來源檔案路徑
 * @param {string} [targetDir=null] - 目標目錄
 * @param {string} [newFilename=null] - 新檔案名稱（不含副檔名）
 * @param {string} [newExtension=null] - 新副檔名（不含點）
 * @returns {string} - 輸出檔案路徑
 */
const getOutputFilePath = (sourceFilePath, targetDir = null, newFilename = null, newExtension = null) => {
  const sourceDirname = path.dirname(sourceFilePath);
  const sourceBasename = getBasename(sourceFilePath);
  const sourceExtension = path.extname(sourceFilePath);
  
  const dirPath = targetDir || sourceDirname;
  const filename = newFilename || sourceBasename;
  const extension = newExtension ? `.${newExtension}` : sourceExtension;
  
  return path.join(dirPath, `${filename}${extension}`);
};

/**
 * 從智能模式中取得配置名稱
 * @param {string} filename - 檔案名稱
 * @returns {string|null} - 配置名稱
 */
const getProfileFromSmartMode = (filename) => {
  const lowercaseFilename = filename.toLowerCase();
  
  if (/hero|banner|cover/.test(lowercaseFilename)) {
    return 'hero';
  } else if (/casestudy|case-study|case_study/.test(lowercaseFilename)) {
    return 'caseStudy';
  } else if (/team|profile|avatar/.test(lowercaseFilename)) {
    return 'teamMember';
  } else if (/product|item/.test(lowercaseFilename)) {
    return 'product';
  } else if (/thumb|thumbnail/.test(lowercaseFilename)) {
    return 'thumbnail';
  } else if (/blog|article/.test(lowercaseFilename)) {
    return 'blogImage';
  } else if (/icon|logo/.test(lowercaseFilename)) {
    return 'icon';
  }
  
  return null;
};

/**
 * 取得檔案建立時間
 * @param {string} filePath - 檔案路徑
 * @returns {Promise<Date>} - 檔案建立時間
 */
const getFileCreationTime = async (filePath) => {
  try {
    const stats = await fsStat(filePath);
    return stats.birthtime;
  } catch (error) {
    console.error(`無法取得檔案建立時間 '${filePath}': ${error.message}`);
    return new Date();
  }
};

/**
 * 解析命令行參數
 * @param {Array<string>} args - 命令行參數陣列
 * @returns {Object} - 解析後的參數
 */
const parseCommandLineArgs = (args) => {
  const result = {
    command: null,
    options: {},
    source: null,
  };
  
  if (args.length >= 1) {
    result.command = args[0];
  }
  
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      result.options[key] = value === undefined ? true : value;
    } else if (arg.startsWith('-')) {
      const flags = arg.slice(1).split('');
      flags.forEach(flag => {
        result.options[flag] = true;
      });
    } else if (!result.source) {
      result.source = arg;
    }
  }
  
  return result;
};

/**
 * 顯示進度條
 * @param {number} current - 當前進度
 * @param {number} total - 總進度
 * @param {number} [width=50] - 進度條寬度
 */
const showProgressBar = (current, total, width = 50) => {
  const percentage = (current / total) * 100;
  const filledWidth = Math.round((current / total) * width);
  const bar = '█'.repeat(filledWidth) + '░'.repeat(width - filledWidth);
  
  process.stdout.write(`\r[${bar}] ${percentage.toFixed(2)}% (${current}/${total})`);
  
  if (current === total) {
    process.stdout.write('\n');
  }
};

module.exports = {
  fileExists,
  ensureDirectoryExists,
  getBasename,
  formatFileSize,
  calculateCompressionRatio,
  getMimeType,
  isImage,
  directoryContainsImages,
  getOutputFilePath,
  getProfileFromSmartMode,
  getFileCreationTime,
  parseCommandLineArgs,
  showProgressBar
}; 