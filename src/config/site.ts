/**
 * 網站全局配置
 * 用於集中管理網站基本信息、SEO和共享配置
 */

// 定義網站配置類型
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook: string;
    instagram: string;
    line: string;
  };
  images: {
    logo: string;
    favicon: string;
    ogImage: string;
  };
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    robotsProps: {
      index: boolean;
      follow: boolean;
      googleBot: {
        index: boolean;
        follow: boolean;
        'max-image-preview': string;
        'max-snippet': number;
      };
    };
  };
  services: string[];
  clientTypes: string[];
}

// 網站配置
export const siteConfig: SiteConfig = {
  // 網站基本信息
  name: 'Aidea:Med 醫療行銷顧問',
  description: '讓專業的醫師專注於醫療品質，行銷交給我們。Aidea:Med運用創新科技與人性化服務，協助診所打造溫暖而專業的品牌形象。',
  url: 'https://www.aideamed.com',
  
  // 聯絡信息
  contact: {
    email: 'contact@aideamed.com',
    phone: '(02) 2748-8919',
    address: '台北市大安區敦化南路二段99號13樓'
  },
  
  // 社交媒體
  social: {
    facebook: 'https://www.facebook.com/www.aideamed',
    instagram: 'https://www.instagram.com/aidea.med/',
    line: 'https://lin.ee/ZPdkmHh'
  },
  
  // 圖片資源
  images: {
    logo: '/logo-w.png',
    favicon: '/favicon.ico',
    ogImage: '/og-image.jpg'
  },
  
  // 共用SEO配置
  seo: {
    titleTemplate: '%s | Aidea:Med 醫療行銷顧問',
    defaultTitle: 'Aidea:Med 醫療行銷顧問',
    robotsProps: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  },
  
  // 核心服務
  services: [
    '診所品牌策略',
    '網路行銷優化',
    '社群經營管理',
    '數位轉型諮詢',
    '空間設計規劃',
    'AI整合行銷'
  ],
  
  // 主要客戶類型
  clientTypes: [
    '牙醫診所',
    '皮膚科診所',
    '眼科診所',
    '家醫科診所',
    '中醫診所'
  ]
}; 