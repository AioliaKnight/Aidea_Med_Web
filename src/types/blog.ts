/**
 * 部落格文章的完整型別定義
 */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  author: {
    name: string;
    avatar?: string;
    title?: string;
  };
  tags: string[];
  readTime: number;
  category?: string;
  relatedPostIds?: string[];
  gallery?: BlogImage[];
}

/**
 * 部落格圖片類型
 */
export interface BlogImage {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

/**
 * 部落格頁面的Props型別
 */
export interface BlogPageProps {
  posts: BlogPost[];
}

/**
 * 部落格文章詳情頁的Props型別
 */
export interface BlogDetailProps {
  post: BlogPost;
}

/**
 * 部落格文章卡片的Props型別
 */
export interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

/**
 * 部落格作者卡片的Props型別
 */
export interface BlogAuthorProps {
  author: BlogPost['author'];
  publishedAt: string;
  updatedAt?: string;
}

/**
 * 部落格分類標籤的Props型別
 */
export interface BlogCategoryProps {
  category: string;
  className?: string;
}

/**
 * 部落格標籤列表的Props型別
 */
export interface BlogTagsProps {
  tags: string[];
  className?: string;
  onClick?: (tag: string) => void;
}

/**
 * 部落格共享按鈕的Props型別
 */
export interface BlogShareProps {
  title: string;
  url: string;
  className?: string;
}

/**
 * 部落格圖片畫廊的Props型別
 */
export interface BlogGalleryProps {
  images: BlogImage[];
  layout?: 'grid' | 'carousel' | 'masonry';
  aspectRatio?: string;
} 