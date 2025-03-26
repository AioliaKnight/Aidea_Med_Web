// 案例資料類型
export interface CaseMetric {
  value: string;
  label: string;
}

export interface Solution {
  title: string;
  description: string;
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
  };
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
}

// 案例時間軸項目介面
export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon?: string;
}

// 案例見證介面
export interface Testimonial {
  content: string;
  author: string;
  title: string;
  avatar?: string;
}

// 案例相關組件 Props 介面
export interface CaseGalleryProps {
  caseId: string;
  name: string;
  hasVideo?: boolean;
  videoUrl?: string;
}

export interface CaseTimelineProps {
  caseStudy: CaseStudy;
}

export interface CaseTestimonialsProps {
  caseStudy: CaseStudy;
}

export interface CaseRelatedProps {
  currentId: string;
  category: string;
}

export interface CaseCardProps {
  caseStudy: CaseStudy;
  index: number;
  isCompact?: boolean;
} 