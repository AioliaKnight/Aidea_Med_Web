/**
 * 部落格文章工具函數庫
 * 用於統一處理博客文章的獲取、處理和格式化
 */

// 客戶端可用的部分
export interface Post {
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
    avatar: string;
    title: string;
  };
  tags: string[];
  readTime?: number;
  category?: string;
  gallery?: BlogImage[];
}

export interface BlogImage {
  url: string;
  alt: string;
  caption?: string;
}

// 格式化日期函數 - 客戶端可用
export function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('zh-TW', options);
}

// 計算閱讀時間 - 客戶端可用
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200; // 平均每分鐘閱讀字數
  const textContent = content.replace(/<[^>]*>/g, ''); // 移除HTML標籤
  const wordCount = textContent.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime < 1 ? 1 : readTime;
}

// 生成文章的SEO元數據 - 客戶端可用
export function generateBlogMetadata(post: Post) {
  return {
    title: `${post.title} | Aidea:Med 醫療行銷顧問`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    }
  };
}

// 根據分類過濾文章 - 客戶端可用
export function filterPostsByCategory(posts: Post[], category: string | null): Post[] {
  if (!category || category === 'all') {
    return posts;
  }
  
  return posts.filter(post => post.category === category);
} 