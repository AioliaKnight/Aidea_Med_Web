#!/usr/bin/env node

/**
 * Robots.ts 路徑驗證腳本
 * 檢查 robots.ts 中配置的路徑是否與實際專案結構一致
 * 使用方法: node scripts/validate-robots-paths.js
 */

const fs = require('fs');
const path = require('path');

// 專案根目錄
const projectRoot = path.join(__dirname, '..');

console.log('🤖 開始驗證 robots.ts 路徑配置...\n');

/**
 * 檢查實際存在的路由
 */
function checkActualRoutes() {
  const appDir = path.join(projectRoot, 'src/app');
  const routes = new Set();
  
  function scanDirectory(dir, basePath = '') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 跳過特殊目錄
        if (item.startsWith('_') || item === 'api' || item === 'images') continue;
        
        // 處理動態路由
        if (item.startsWith('[') && item.endsWith(']')) {
          const paramName = item.slice(1, -1);
          routes.add(`${basePath}/*`);
        } else {
          const newPath = `${basePath}/${item}`;
          routes.add(`${newPath}/`);
          scanDirectory(fullPath, newPath);
        }
      } else if (item === 'page.tsx' || item === 'route.ts') {
        if (basePath === '') {
          routes.add('/');
        } else {
          routes.add(`${basePath}/`);
        }
      }
    }
  }
  
  scanDirectory(appDir);
  return Array.from(routes).sort();
}

/**
 * 檢查 public 目錄中的文件
 */
function checkPublicFiles() {
  const publicDir = path.join(projectRoot, 'public');
  const files = new Set();
  
  function scanPublic(dir, basePath = '') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        const newPath = `${basePath}/${item}`;
        files.add(`${newPath}/`);
        scanPublic(fullPath, newPath);
      } else {
        files.add(`${basePath}/${item}`);
      }
    }
  }
  
  scanPublic(publicDir);
  return Array.from(files).sort();
}

/**
 * 解析 robots.ts 中的路徑配置
 */
function parseRobotsConfig() {
  const robotsPath = path.join(projectRoot, 'src/app/robots.ts');
  
  if (!fs.existsSync(robotsPath)) {
    console.error('❌ robots.ts 文件不存在');
    return null;
  }
  
  const content = fs.readFileSync(robotsPath, 'utf-8');
  
  // 提取 existingRoutes 陣列
  const existingRoutesMatch = content.match(/const existingRoutes = \[([\s\S]*?)\];/);
  const mediaContentPathsMatch = content.match(/const mediaContentPaths = \[([\s\S]*?)\];/);
  
  if (!existingRoutesMatch || !mediaContentPathsMatch) {
    console.error('❌ 無法解析 robots.ts 配置');
    return null;
  }
  
  const extractPaths = (matchContent) => {
    return matchContent[1]
      .split(',')
      .map(line => {
        const pathMatch = line.match(/'([^']+)'/);
        return pathMatch ? pathMatch[1] : null;
      })
      .filter(Boolean);
  };
  
  return {
    existingRoutes: extractPaths(existingRoutesMatch),
    mediaContentPaths: extractPaths(mediaContentPathsMatch)
  };
}

/**
 * 主要驗證邏輯
 */
function main() {
  // 檢查實際路由
  const actualRoutes = checkActualRoutes();
  console.log('📁 實際存在的路由：');
  actualRoutes.forEach(route => console.log(`   ${route}`));
  console.log('');
  
  // 檢查 public 文件
  const publicFiles = checkPublicFiles();
  console.log('📂 Public 目錄文件：');
  publicFiles.slice(0, 10).forEach(file => console.log(`   ${file}`));
  if (publicFiles.length > 10) {
    console.log(`   ... 以及其他 ${publicFiles.length - 10} 個文件`);
  }
  console.log('');
  
  // 解析 robots.ts 配置
  const robotsConfig = parseRobotsConfig();
  if (!robotsConfig) return;
  
  console.log('🤖 robots.ts 中配置的路徑：');
  console.log('   existingRoutes:');
  robotsConfig.existingRoutes.forEach(route => console.log(`     ${route}`));
  console.log('   mediaContentPaths:');
  robotsConfig.mediaContentPaths.forEach(path => console.log(`     ${path}`));
  console.log('');
  
  // 驗證路由一致性
  console.log('✅ 路由驗證結果：');
  
  let allValid = true;
  
  // 檢查 existingRoutes 是否都存在
  for (const configRoute of robotsConfig.existingRoutes) {
    if (configRoute.endsWith('/*')) {
      // 動態路由檢查
      const baseRoute = configRoute.replace('/*', '/');
      if (!actualRoutes.includes(baseRoute)) {
        console.log(`   ❌ 動態路由基礎路徑不存在: ${baseRoute}`);
        allValid = false;
      } else {
        console.log(`   ✅ 動態路由: ${configRoute}`);
      }
    } else {
      // 靜態路由檢查
      if (!actualRoutes.includes(configRoute)) {
        console.log(`   ❌ 路由不存在: ${configRoute}`);
        allValid = false;
      } else {
        console.log(`   ✅ 路由存在: ${configRoute}`);
      }
    }
  }
  
  // 檢查是否有遺漏的重要路由
  for (const actualRoute of actualRoutes) {
    if (!robotsConfig.existingRoutes.includes(actualRoute) && 
        !robotsConfig.existingRoutes.includes(actualRoute.replace('/', '/*'))) {
      console.log(`   ⚠️  未在 robots.ts 中配置的路由: ${actualRoute}`);
    }
  }
  
  // 檢查媒體文件路徑
  console.log('\n📷 媒體路徑驗證：');
  for (const mediaPath of robotsConfig.mediaContentPaths) {
    if (mediaPath.includes('*')) {
      // 通配符路徑檢查
      const basePath = mediaPath.replace('*', '');
      const matchingFiles = publicFiles.filter(file => file.startsWith(basePath));
      if (matchingFiles.length > 0) {
        console.log(`   ✅ 通配符路徑匹配: ${mediaPath} (${matchingFiles.length} 個文件)`);
      } else {
        console.log(`   ⚠️  通配符路徑無匹配: ${mediaPath}`);
      }
    } else {
      // 具體路徑檢查
      if (publicFiles.includes(mediaPath) || publicFiles.some(file => file.startsWith(mediaPath))) {
        console.log(`   ✅ 媒體路徑存在: ${mediaPath}`);
      } else {
        console.log(`   ❌ 媒體路徑不存在: ${mediaPath}`);
        allValid = false;
      }
    }
  }
  
  console.log('\n📊 驗證總結：');
  console.log(`   實際路由數量: ${actualRoutes.length}`);
  console.log(`   配置路由數量: ${robotsConfig.existingRoutes.length}`);
  console.log(`   配置媒體路徑數量: ${robotsConfig.mediaContentPaths.length}`);
  console.log(`   Public 文件數量: ${publicFiles.length}`);
  
  if (allValid) {
    console.log('\n🎉 所有路徑配置都正確！');
  } else {
    console.log('\n⚠️  發現一些配置問題，請檢查上述警告和錯誤。');
  }
  
  // 生成優化建議
  console.log('\n💡 優化建議：');
  
  // 檢查是否有重要的 public 文件未被包含
  const importantPublicFiles = publicFiles.filter(file => 
    file.includes('sitemap') || 
    file.includes('manifest') || 
    file.includes('favicon') ||
    file.includes('robots') ||
    file.includes('.xml') ||
    file.includes('.txt')
  );
  
  for (const file of importantPublicFiles) {
    if (!robotsConfig.mediaContentPaths.some(path => 
      file.startsWith(path.replace('*', '')) || path.includes(file)
    )) {
      console.log(`   💡 建議添加重要文件: ${file}`);
    }
  }
  
  console.log('   💡 定期執行此腳本以確保路徑配置的一致性');
  console.log('   💡 新增路由時記得更新 robots.ts');
  console.log('   💡 考慮根據業務需求調整爬蟲延遲時間');
}

// 執行驗證
main(); 