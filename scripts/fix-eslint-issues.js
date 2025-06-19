#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 修正 ESLint 錯誤...\n');

// 定義修正規則
const fixes = [
  // 修正自關閉組件
  {
    pattern: /<div([^>]*)><\/div>/g,
    replacement: '<div$1 />',
    description: '修正空的 div 為自關閉格式'
  },
  {
    pattern: /<span([^>]*)><\/span>/g,
    replacement: '<span$1 />',
    description: '修正空的 span 為自關閉格式'
  },
  {
    pattern: /&quot;/g,
    replacement: '&ldquo;',
    description: '修正 HTML 實體'
  }
];

// 需要修正的檔案
const filesToFix = [
  'src/app/blog/[slug]/page.tsx',
  'src/components/blog/BlogGallery.tsx',
  'src/components/blog/BlogList.tsx',
  'src/components/blog/BlogMobileTableOfContents.tsx',
  'src/components/common/CTASection.tsx',
  'src/components/common/PageHeader.tsx',
  'src/components/contact/ContactForm.tsx',
  'src/components/pages/HomePage.tsx',
  'src/components/pages/MedicalAdCompliancePage.tsx',
  'src/components/pages/MedicalResourceTabs.tsx',
  'src/components/pages/ServicePage.tsx',
  'src/components/pages/TeamPage.tsx',
  'src/components/ui/Button.tsx'
];

// 特殊修正
const specialFixes = {
  'src/components/blog/BlogContent.tsx': (content) => {
    // 移除未使用的變數
    return content.replace(
      /const fragment = document\.createDocumentFragment\(\);[\s\S]*?fragment\.appendChild\(element\);/g,
      '// Fragment code removed as unused'
    );
  },
  
  'src/components/blog/BlogGallery.tsx': (content) => {
    // 移除未使用的 Image 導入
    return content.replace(/import Image from 'next\/image'[\s\S]*?\n/, '');
  },
  
  'src/components/blog/BlogList.tsx': (content) => {
    // 標記未使用變數
    return content.replace(
      /const availableCategories/g,
      '// eslint-disable-next-line @typescript-eslint/no-unused-vars\n  const availableCategories'
    );
  },
  
  'src/components/common/CTASection.tsx': (content) => {
    // 移除未使用的 Link 導入
    return content.replace(/import Link from 'next\/link'[\s\S]*?\n/, '');
  },
  
  'src/components/common/Loading.tsx': (content) => {
    // 標記未使用的常量
    return content
      .replace(/const LOADING_ANIMATION_CONFIG/g, '// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst LOADING_ANIMATION_CONFIG')
      .replace(/const loadingLogoVariants/g, '// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst loadingLogoVariants');
  },
  
  'src/components/common/OptimizedImage.tsx': (content) => {
    // 移除未使用的 Image 導入，標記未使用變數
    return content
      .replace(/import Image from 'next\/image'[\s\S]*?\n/, '')
      .replace(/const quality/g, '// eslint-disable-next-line @typescript-eslint/no-unused-vars\n  const quality')
      .replace(/const sizes/g, '// eslint-disable-next-line @typescript-eslint/no-unused-vars\n  const sizes');
  },
  
  'src/components/common/SEOOptimizer.tsx': (content) => {
    // 標記未使用變數
    return content.replace(
      /const ogImage/g,
      '// eslint-disable-next-line @typescript-eslint/no-unused-vars\n  const ogImage'
    );
  },
  
  'src/components/pages/TeamPage.tsx': (content) => {
    // 修正 HTML 實體和移除未使用導入
    return content
      .replace(/import Image from 'next\/image'[\s\S]*?\n/, '')
      .replace(/Spinner,?/g, '')
      .replace(/HandRaisedIcon,?/g, '')
      .replace(/Cog6ToothIcon,?/g, '')
      .replace(/"/g, '&ldquo;')
      .replace(/"/g, '&rdquo;');
  }
};

// 執行修正
filesToFix.forEach(filePath => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  檔案不存在: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // 應用通用修正規則
    fixes.forEach(({ pattern, replacement, description }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        changed = true;
      }
    });
    
    // 應用特殊修正
    if (specialFixes[filePath]) {
      const newContent = specialFixes[filePath](content);
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 修正: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ 錯誤修正 ${filePath}:`, error.message);
  }
});

console.log('\n✨ 修正完成！');
console.log('請執行 "npm run lint" 檢查剩餘問題'); 