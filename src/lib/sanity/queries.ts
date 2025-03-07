import { groq } from 'next-sanity'
import { Post, BlogQueryResult, BlogSettings } from '@/types/blog'

// 圖片查詢片段
const imageQuery = `
  _type,
  asset->{
    _id,
    url,
    metadata {
      dimensions,
      lqip
    }
  },
  alt,
  caption
`

// 作者查詢片段
const authorQuery = `
  _id,
  name,
  slug,
  image {
    ${imageQuery}
  },
  bio
`

// 分類查詢片段
const categoryQuery = `
  _id,
  title,
  slug,
  description,
  mainImage {
    ${imageQuery}
  }
`

// 文章查詢片段
const postQuery = `
  _id,
  _type,
  title,
  slug,
  publishedAt,
  updatedAt,
  excerpt,
  mainImage {
    ${imageQuery}
  },
  categories[] {
    ${categoryQuery}
  },
  author {
    ${authorQuery}
  },
  content,
  seo {
    title,
    description,
    keywords,
    ogImage {
      ${imageQuery}
    }
  },
  related[] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage {
      ${imageQuery}
    },
    categories[] {
      ${categoryQuery}
    }
  },
  readingTime,
  status
`

// 獲取單篇文章
export const getPost = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postQuery}
  }
`

// 獲取文章列表
export const getPosts = groq`
  {
    "posts": *[_type == "post" && status == "published" ${
      '&& category->slug.current == $category'
    } ${
      '&& (title match $search || excerpt match $search)'
    }] | order($sort $order) [$start...$end] {
      ${postQuery}
    },
    "total": count(*[_type == "post" && status == "published" ${
      '&& category->slug.current == $category'
    } ${
      '&& (title match $search || excerpt match $search)'
    }])
  }
`

// 獲取部落格設定
export const getBlogSettings = groq`
  *[_type == "blogSettings"][0] {
    title,
    description,
    mainImage {
      ${imageQuery}
    },
    categories[] {
      ${categoryQuery}
    },
    seo {
      title,
      description,
      keywords,
      ogImage {
        ${imageQuery}
      }
    }
  }
`

// 獲取相關文章
export const getRelatedPosts = groq`
  *[_type == "post" && status == "published" && _id != $postId && count(categories[@._ref in $categoryRefs]) > 0] | order(publishedAt desc)[0...3] {
    ${postQuery}
  }
`

// 獲取作者文章
export const getAuthorPosts = groq`
  *[_type == "post" && status == "published" && author._ref == $authorId] | order(publishedAt desc) {
    ${postQuery}
  }
`

// 獲取分類文章
export const getCategoryPosts = groq`
  *[_type == "post" && status == "published" && category._ref == $categoryId] | order(publishedAt desc) {
    ${postQuery}
  }
` 