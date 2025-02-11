import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Sanity 客戶端配置
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-02-11',
  useCdn: process.env.NODE_ENV === 'production',
})

// 圖片 URL 建構器
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// 獲取所有文章
export async function getAllPosts() {
  return await client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage {
        asset->{
          url
        },
        alt,
        caption
      },
      publishedAt,
      excerpt,
      readingTime,
      categories[]->{
        title,
        color
      },
      author->{
        name,
        image {
          asset->{
            url
          }
        }
      }
    }`
  )
}

// 獲取分頁文章
export async function getPaginatedPosts({
  page = 1,
  limit = 9,
  category = '',
  search = '',
  sortBy = 'latest',
}: {
  page?: number
  limit?: number
  category?: string
  search?: string
  sortBy?: 'latest' | 'popular'
}) {
  const start = (page - 1) * limit
  const end = start + limit

  let query = `*[_type == "post"`

  // 添加分類過濾
  if (category) {
    query += ` && references(*[_type == "category" && _id == "${category"}]._id)`
  }

  // 添加搜尋過濾
  if (search) {
    query += ` && (title match "*${search}*" || excerpt match "*${search}*")`
  }

  // 添加排序
  query += `] | order(${
    sortBy === 'popular' ? 'viewCount' : 'publishedAt'
  } desc) [${start}...${end}] {
    _id,
    title,
    slug,
    mainImage {
      asset->{
        url
      },
      alt,
      caption
    },
    publishedAt,
    excerpt,
    readingTime,
    categories[]->{
      title,
      color
    },
    author->{
      name,
      image {
        asset->{
          url
        }
      }
    }
  }`

  // 獲取總數的查詢
  let countQuery = `count(*[_type == "post"`
  if (category) {
    countQuery += ` && references(*[_type == "category" && _id == "${category"}]._id)`
  }
  if (search) {
    countQuery += ` && (title match "*${search}*" || excerpt match "*${search}*")`
  }
  countQuery += `])`

  const [posts, totalCount] = await Promise.all([
    client.fetch(query),
    client.fetch(countQuery),
  ])

  return {
    posts,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  }
}

// 獲取單篇文章
export async function getPost(slug: string) {
  return await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      mainImage {
        asset->{
          url
        },
        alt,
        caption
      },
      body,
      publishedAt,
      excerpt,
      readingTime,
      categories[]->{
        title,
        color
      },
      author->{
        name,
        image {
          asset->{
            url
          }
        },
        bio
      },
      "relatedPosts": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc) [0...2] {
        _id,
        title,
        slug,
        mainImage {
          asset->{
            url
          }
        },
        excerpt
      }
    }`,
    { slug }
  )
}

// 獲取所有分類
export async function getAllCategories() {
  return await client.fetch(
    `*[_type == "category"] {
      _id,
      title,
      color
    }`
  )
}

// 更新文章瀏覽次數
export async function incrementViewCount(postId: string) {
  return await client
    .patch(postId)
    .setIfMissing({ viewCount: 0 })
    .inc({ viewCount: 1 })
    .commit()
}

// 獲取熱門文章
export async function getPopularPosts(limit = 5) {
  return await client.fetch(
    `*[_type == "post"] | order(viewCount desc) [0...${limit}] {
      _id,
      title,
      slug,
      mainImage {
        asset->{
          url
        }
      },
      publishedAt,
      excerpt,
      readingTime,
      categories[]->{
        title,
        color
      },
      author->{
        name,
        image {
          asset->{
            url
          }
        }
      }
    }`
  )
}

// 獲取最新文章
export async function getLatestPosts(limit = 5) {
  return await client.fetch(
    `*[_type == "post"] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      slug,
      mainImage {
        asset->{
          url
        }
      },
      publishedAt,
      excerpt,
      readingTime,
      categories[]->{
        title,
        color
      },
      author->{
        name,
        image {
          asset->{
            url
          }
        }
      }
    }`
  )
}

// 獲取相關文章
export async function getRelatedPosts(postId: string, categoryIds: string[], limit = 2) {
  return await client.fetch(
    `*[_type == "post" && _id != $postId && count(categories[@._ref in $categoryIds]) > 0] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      slug,
      mainImage {
        asset->{
          url
        }
      },
      excerpt
    }`,
    { postId, categoryIds }
  )
}

// 搜尋文章
export async function searchPosts(query: string) {
  return await client.fetch(
    `*[_type == "post" && (title match "*${query}*" || excerpt match "*${query}*")] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage {
        asset->{
          url
        }
      },
      publishedAt,
      excerpt,
      readingTime,
      categories[]->{
        title,
        color
      },
      author->{
        name,
        image {
          asset->{
            url
          }
        }
      }
    }`
  )
} 