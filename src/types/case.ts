// 案例資料類型
export interface CaseMetric {
  value: string;
  label: string;
  prefix?: string; // 前綴 (例如 +, $)
  suffix?: string; // 後綴 (例如 %, 倍)
  emphasize?: boolean; // 是否強調顯示
}

export interface Solution {
  title: string;
  description: string;
  icon?: string; // 解決方案圖標
}

export interface CaseStudy {
  id: string;
  name: string;
  category: string;
  description: string;
  metrics: CaseMetric[];
  solutions: Solution[] | string[];
  color?: string;
  image: string;
  featured?: boolean;
  publishedDate?: string;
  updatedDate?: string;
  testimonial?: {
    content: string;
    author: string;
    title: string;
    avatar?: string; // 客戶頭像
  };
  gallery?: CaseImage[]; // 案例圖片集
  timeline?: TimelineItem[]; // 時間軸
  badges?: string[]; // 標籤
  priority?: number; // 優先順序 (用於排序)
  backgroundColor?: string; // 背景色
}

// Schema.org 結構化資料類型定義
export interface ArticleStructuredData {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  about: {
    '@type': string;
    name: string;
    description: string;
  };
  articleSection: string;
  keywords: string[];
}

// 案例圖片介面
export interface CaseImage {
  url: string;
  alt: string;
  caption?: string;
  type?: 'image' | 'video';
  width?: number; // 圖片寬度
  height?: number; // 圖片高度
  priority?: boolean; // 是否優先載入
}

// 案例時間軸項目介面
export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon?: string;
  completed?: boolean; // 是否已完成
}

// 案例見證介面
export interface Testimonial {
  content: string;
  author: string;
  title: string;
  avatar?: string;
  company?: string; // 公司名稱
  rating?: number; // 評分(1-5)
}

// 案例相關組件 Props 介面
export interface CaseGalleryProps {
  caseId: string;
  name: string;
  hasVideo?: boolean;
  videoUrl?: string;
  images?: CaseImage[]; // 直接傳入圖片集
  layout?: 'grid' | 'carousel' | 'masonry'; // 佈局類型
  aspectRatio?: string; // 圖片縱橫比
}

export interface CaseTimelineProps {
  caseStudy: CaseStudy;
  variant?: 'vertical' | 'horizontal'; // 時間軸方向
}

export interface CaseTestimonialsProps {
  caseStudy: CaseStudy;
  variant?: 'card' | 'simple' | 'quote'; // 見證顯示樣式
}

export interface CaseRelatedProps {
  currentId: string;
  category: string;
  limit?: number; // 顯示數量限制
  layout?: 'grid' | 'slider'; // 佈局類型
}

export interface CaseCardProps {
  caseStudy: CaseStudy;
  index: number;
  isCompact?: boolean;
  variant?: 'standard' | 'featured' | 'minimal'; // 卡片樣式變體
  showMetrics?: boolean; // 是否顯示指標
  aspectRatio?: string; // 圖片縱橫比
  priority?: boolean; // 圖片是否優先載入
} 