#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 開始修正 ESLint 錯誤...\n');

// 修正檔案列表
const fixes = [
  // 移除未使用的導入和變數
  {
    file: 'src/app/layout.tsx',
    replacements: [
      {
        from: 'import { \n  sharedMetadata, \n  organizationSchema, \n  localBusinessSchema, \n  medicalServicesFaq,\n  brandingWebsiteSchema,\n  breadcrumbSchema,\n  enhancedLocalBusinessSchema,\n  enhancedMedicalServicesFaq\n} from \'./metadata\'',
        to: 'import { \n  sharedMetadata, \n  organizationSchema, \n  brandingWebsiteSchema,\n  breadcrumbSchema,\n  enhancedLocalBusinessSchema,\n  enhancedMedicalServicesFaq\n} from \'./metadata\''
      }
    ]
  },
  // 修正自關閉組件
  {
    file: 'src/app/blog/page.tsx',
    replacements: [
      {
        from: '        <div key={i} className="bg-gray-100 rounded-lg h-80"></div>',
        to: '        <div key={i} className="bg-gray-100 rounded-lg h-80" />'
      }
    ]
  }
];

// 執行修正
fixes.forEach(({ file, replacements }) => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    replacements.forEach(({ from, to }) => {
      if (content.includes(from)) {
        content = content.replace(from, to);
        console.log(`✅ 修正 ${file}`);
      }
    });
    
    fs.writeFileSync(file, content, 'utf8');
  } catch (error) {
    console.error(`❌ 修正 ${file} 失敗:`, error.message);
  }
});

// 自動修正 ESLint 可修復的錯誤
console.log('\n🔧 自動修正 ESLint 錯誤...');
try {
  execSync('npm run lint -- --fix', { stdio: 'inherit' });
  console.log('✅ ESLint 自動修正完成');
} catch (error) {
  console.log('⚠️  部分錯誤需要手動修正');
}

console.log('\n✨ 修正完成！'); 