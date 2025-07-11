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
  const wordsPerMinute = 600; // 平均每分鐘閱讀字數
  const textContent = content.replace(/<[^>]*>/g, ''); // 移除HTML標籤
  const wordCount = textContent.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime < 1 ? 1 : readTime;
}

// 生成文章的SEO元數據 - 客戶端可用
export function generateBlogMetadata(post: Post) {
  // 從環境變數獲取基礎 URL，如不存在則使用預設值
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com';
  
  // 為社交媒體優化圖片 URL
  const imageUrl = post.coverImage.startsWith('http') 
    ? post.coverImage 
    : `${baseUrl}${post.coverImage}`;
  
  // 使用靜態 OG 圖片替代動態生成
  const staticOGImage = `${baseUrl}/images/blog/default_lg.jpg`;
    
  // 移除 HTML 標籤，獲得純文本摘要
  const plainTextSummary = post.summary ? post.summary.replace(/<[^>]*>/g, '') : '';
  
  // 構建標準化的標題
  const seoTitle = `${post.title} | Aidea:Med 醫療行銷顧問`;
  
  return {
    title: seoTitle,
    description: plainTextSummary,
    keywords: post.tags?.join(', '),
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
    authors: [
      { name: post.author.name, url: `${baseUrl}/team` }
    ],
    category: post.category || '醫療行銷',
    openGraph: {
      title: post.title,
      description: plainTextSummary,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [`${baseUrl}/team`],
      tags: post.tags,
      locale: 'zh_TW',
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: 'Aidea:Med 醫療行銷顧問',
      images: [
        {
          url: staticOGImage,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/jpeg'
        },
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/jpeg'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: plainTextSummary,
      images: [staticOGImage, imageUrl],
      creator: '@aideamed',
      site: '@aideamed'
    }
  };
}

// 根據分類過濾文章 - 客戶端可用
export function filterPostsByCategory(posts: Post[], category: string | null): Post[] {
  if (!category || category === 'all') {
    return posts;
  }
  
  // 使用直接比較而不是嚴格比較，以處理可能的字符編碼或類型差異
  return posts.filter(post => post.category && post.category === category);
}

// 獲取所有可用分類 - 客戶端可用
export function getAllCategories(posts: Post[]): string[] {
  if (!posts || posts.length === 0) {
    return [];
  }
  
  // 提取所有非空的分類，並去重
  const categories = Array.from(
    new Set(posts.map(post => post.category).filter(Boolean))
  ) as string[];
  
  return categories;
}

// 根據分類獲取文章數量 - 客戶端可用
export function getPostCountByCategory(posts: Post[], category: string): number {
  if (!posts || posts.length === 0) {
    return 0;
  }
  
  return posts.filter(post => post.category === category).length;
}

/**
 * 為標題生成唯一的 ID
 * @param title 標題文本
 * @param index 標題在文檔中的索引
 * @returns 生成的唯一 ID
 */
export function generateHeadingId(title: string, index: number): string {
  return `heading-${index}-${title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)}`
}

/**
 * 為 DOM 中的標題元素設置 ID 和滾動偏移
 * @param headings 標題元素列表
 */
export function setupHeadingIds(headings: NodeListOf<Element> | Element[]): void {
  Array.from(headings).forEach((heading, index) => {
    const title = heading.textContent?.trim() || ''
    
    // 跳過太短的標題
    if (title.length < 3) return
    
    const id = generateHeadingId(title, index)
    
    // 如果標題還沒有 ID，設置它
    if (!heading.id) {
      heading.id = id
      // 添加滾動偏移樣式
      if (heading instanceof HTMLElement) {
        heading.style.scrollMarginTop = '100px'
      }
    }
  })
} 