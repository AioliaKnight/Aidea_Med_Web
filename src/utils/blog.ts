/**
 * 部落格工具函數：用於處理部落格文章的加載和管理
 */

/**
 * 從API獲取單篇部落格文章
 * @param slug 文章的slug
 * @returns 文章對象或null（如果找不到）
 */
export async function getBlogPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 3600 } // 每小時更新快取
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch blog post')
    }
    
    return await res.json()
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    return null
  }
}

/**
 * 從API獲取所有部落格文章
 * @returns 文章數組
 */
export async function getAllBlogPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 3600 } // 每小時更新快取
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch blog posts')
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error fetching all blog posts:', error)
    return []
  }
}

/**
 * 追蹤部落格文章閱讀歷史
 * @param slug 文章的slug
 */
export function trackReadBlogPost(slug: string) {
  try {
    const readPosts = JSON.parse(localStorage.getItem('readBlogPosts') || '[]')
    
    if (!readPosts.includes(slug)) {
      readPosts.push(slug)
      
      // 限制追蹤的最大數量
      if (readPosts.length > 20) {
        readPosts.shift() // 移除最舊的記錄
      }
      
      localStorage.setItem('readBlogPosts', JSON.stringify(readPosts))
    }
  } catch (error) {
    console.error('Error tracking read blog post:', error)
  }
}

/**
 * 獲取指定分類的部落格文章
 * @param category 文章分類
 * @returns 文章數組
 */
export async function getBlogPostsByCategory(category: string) {
  try {
    const posts = await getAllBlogPosts()
    return posts.filter((post: any) => post.category === category)
  } catch (error) {
    console.error(`Error fetching blog posts for category ${category}:`, error)
    return []
  }
}

/**
 * 根據標籤獲取部落格文章
 * @param tag 文章標籤
 * @returns 文章數組
 */
export async function getBlogPostsByTag(tag: string) {
  try {
    const posts = await getAllBlogPosts()
    return posts.filter((post: any) => post.tags.includes(tag))
  } catch (error) {
    console.error(`Error fetching blog posts for tag ${tag}:`, error)
    return []
  }
}

/**
 * 搜索部落格文章
 * @param query 搜索關鍵詞
 * @returns 文章數組
 */
export async function searchBlogPosts(query: string) {
  try {
    const posts = await getAllBlogPosts()
    const searchTerm = query.toLowerCase()
    
    return posts.filter((post: any) => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.summary.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    )
  } catch (error) {
    console.error(`Error searching blog posts for "${query}":`, error)
    return []
  }
} 