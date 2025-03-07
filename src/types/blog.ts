import { PortableTextBlock } from '@portabletext/types'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
}

export interface Category {
  _id: string
  title: string
  slug: string
  description?: string
  mainImage?: SanityImage
}

export interface Author {
  _id: string
  name: string
  slug: string
  image?: SanityImage
  bio?: string
}

export interface Post {
  _id: string
  _type: 'post'
  title: string
  slug: string
  publishedAt: string
  updatedAt?: string
  excerpt: string
  mainImage?: SanityImage
  categories: Category[]
  author: Author
  content: PortableTextBlock[]
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: SanityImage
  }
  related?: Post[]
  readingTime?: number
  status: 'draft' | 'published'
}

export interface BlogSettings {
  title: string
  description: string
  mainImage?: SanityImage
  categories: Category[]
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: SanityImage
  }
}

export interface BlogQueryParams {
  page?: number
  limit?: number
  category?: string
  search?: string
  author?: string
  sort?: 'publishedAt' | 'title'
  order?: 'asc' | 'desc'
  start?: number
  end?: number
}

export interface BlogQueryResult {
  posts: Post[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
} 