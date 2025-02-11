// 基礎類型
export interface Asset {
  url: string
}

export interface Image {
  asset: Asset
  alt?: string
  caption?: string
}

export interface Category {
  _id: string
  title: string
  color: string
}

export interface Author {
  name: string
  image: {
    asset: Asset
  }
  bio: string
}

// 文章相關類型
export interface Post {
  _id: string
  title: string
  slug: {
    current: string
  }
  mainImage: Image
  publishedAt: string
  body?: any[] // Sanity 的 Portable Text 格式
  excerpt: string
  readingTime: number
  categories: Category[]
  author: Author
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  ogImage?: {
    asset: Asset
  }
  viewCount?: number
}

// 組件 Props 類型
export interface BlogProps {
  posts: Post[]
  categories: Category[]
  currentPage: number
  totalPages: number
  searchQuery?: string
  selectedCategory?: string
  sortBy?: 'latest' | 'popular'
}

export interface BlogPostProps {
  post: Post
  relatedPosts: Post[]
}

// URL 參數類型
export interface BlogSearchParams {
  page?: string
  category?: string
  search?: string
  sort?: 'latest' | 'popular'
}

// API 響應類型
export interface PaginatedResponse<T> {
  data: T[]
  totalPages: number
  currentPage: number
}

// 查詢參數類型
export interface PostQueryParams {
  page?: number
  limit?: number
  category?: string
  search?: string
  sortBy?: 'latest' | 'popular'
} 