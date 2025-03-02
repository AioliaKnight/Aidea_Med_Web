/**
 * 圖片轉換配置文件
 * 
 * 此文件定義了不同類型圖片的轉換配置,
 * 可被其他轉換腳本引用
 */

// 圖片類型配置
const profiles = {
  // 案例研究圖片配置
  caseStudy: {
    // 尺寸配置
    sizes: [
      { name: 'sm', width: 640 },  // 手機版
      { name: 'md', width: 1024 }  // 平板版
    ],
    // WebP 品質設定
    webpQuality: 85,
    // 原始圖片格式品質設定
    originalQuality: 80,
    // 預覽小圖設定
    placeholder: {
      width: 400,
      blur: 10,
      quality: 30
    }
  },
  
  // 英雄橫幅圖片配置
  hero: {
    sizes: [
      { name: 'sm', width: 768 },
      { name: 'md', width: 1280 },
      { name: 'lg', width: 1920 }
    ],
    webpQuality: 90,
    originalQuality: 85,
    placeholder: {
      width: 480,
      blur: 15,
      quality: 30
    }
  },
  
  // 網站圖標配置
  icon: {
    sizes: [
      { name: 'sm', width: 64 },
      { name: 'md', width: 128 }
    ],
    webpQuality: 95,
    originalQuality: 90,
    placeholder: null  // 不需要預覽圖
  },
  
  // 產品圖片配置
  product: {
    sizes: [
      { name: 'sm', width: 480 },
      { name: 'md', width: 800 }
    ],
    webpQuality: 90,
    originalQuality: 85,
    placeholder: {
      width: 200,
      blur: 5,
      quality: 30
    }
  },
  
  // 團隊成員照片配置
  teamMember: {
    sizes: [
      { name: 'sm', width: 320 },
      { name: 'md', width: 480 }
    ],
    webpQuality: 90,
    originalQuality: 85,
    placeholder: {
      width: 100,
      blur: 5,
      quality: 40
    }
  },
  
  // 內容縮略圖配置
  thumbnail: {
    sizes: [
      { name: 'sm', width: 320 }
    ],
    webpQuality: 80,
    originalQuality: 75,
    placeholder: {
      width: 80,
      blur: 5,
      quality: 30
    }
  },
  
  // 部落格文章圖片配置
  blogImage: {
    sizes: [
      { name: 'sm', width: 640 },
      { name: 'md', width: 1024 }
    ],
    webpQuality: 85,
    originalQuality: 80,
    placeholder: {
      width: 320,
      blur: 10,
      quality: 30
    }
  },

  // PWA圖標配置
  pwaIcon: {
    sizes: [72, 96, 128, 144, 152, 192, 384, 512],
    webpQuality: 90,
    originalQuality: 90,
    placeholder: null
  },

  // Favicon配置
  favicon: {
    sizes: [16, 32, 48, 180, 192, 512],
    names: [
      { size: 16, name: 'favicon-16x16.png' },
      { size: 32, name: 'favicon-32x32.png' },
      { size: 48, name: 'favicon-48x48.png' },
      { size: 180, name: 'apple-touch-icon.png' },
      { size: 192, name: 'android-chrome-192x192.png' },
      { size: 512, name: 'android-chrome-512x512.png' }
    ],
    webpQuality: 90,
    originalQuality: 90,
    placeholder: null
  }
};

// 預設配置，如果未指定特定配置則使用此設定
const defaultProfile = {
  sizes: [
    { name: 'sm', width: 640 }
  ],
  webpQuality: 80,
  originalQuality: 75,
  placeholder: {
    width: 300,
    blur: 10,
    quality: 30
  }
};

// 識別圖片類型的規則
const identifyProfile = (filename) => {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.startsWith('case_') || lowerFilename.includes('casestudy')) {
    return 'caseStudy';
  }
  
  if (lowerFilename.startsWith('hero_') || lowerFilename.includes('banner')) {
    return 'hero';
  }
  
  if (lowerFilename.startsWith('icon_') || lowerFilename.includes('icon')) {
    return 'icon';
  }
  
  if (lowerFilename.startsWith('product_') || lowerFilename.includes('product')) {
    return 'product';
  }
  
  if (lowerFilename.startsWith('team_') || lowerFilename.includes('member')) {
    return 'teamMember';
  }
  
  if (lowerFilename.startsWith('thumb_') || lowerFilename.includes('thumbnail')) {
    return 'thumbnail';
  }
  
  if (lowerFilename.startsWith('blog_') || lowerFilename.includes('article')) {
    return 'blogImage';
  }
  
  // 如果沒有匹配的類型，返回預設類型
  return 'default';
};

// 根據文件名獲取配置
const getProfileByFilename = (filename) => {
  const profileType = identifyProfile(filename);
  return profiles[profileType] || defaultProfile;
};

module.exports = {
  profiles,
  defaultProfile,
  identifyProfile,
  getProfileByFilename
}; 