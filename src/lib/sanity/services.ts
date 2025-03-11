import { client } from './client';
import { getPosts, getPost, getBlogSettings } from './queries';
import { Category } from '@/types/blog';

/**
 * 部落格服務 - 集中處理所有 Sanity 部落格相關數據操作
 */
export const BlogService = {
  /**
   * 獲取文章列表
   * @param options 查詢選項
   */
  async getPosts(options: {
    limit?: number;
    offset?: number;
    category?: string;
  } = {}) {
    try {
      const result = await client.fetch(getPosts, {
        start: options.offset || 0,
        end: (options.offset || 0) + (options.limit || 10),
      });
      return { posts: result.posts, total: result.total, error: null };
    } catch (error) {
      console.error('獲取文章列表錯誤:', error);
      return { posts: [], total: 0, error };
    }
  },

  /**
   * 獲取單篇文章
   * @param slug 文章 slug
   */
  async getPost(slug: string) {
    try {
      const post = await client.fetch(getPost, { slug });
      return { post, error: null };
    } catch (error) {
      console.error(`獲取文章錯誤 (${slug}):`, error);
      return { post: null, error };
    }
  },

  /**
   * 獲取部落格設定
   */
  async getBlogSettings() {
    try {
      const settings = await client.fetch(getBlogSettings);
      return { settings, error: null };
    } catch (error) {
      console.error('獲取部落格設定錯誤:', error);
      return { settings: null, error };
    }
  },

  /**
   * 獲取所有分類
   */
  async getCategories() {
    try {
      const categories = await client.fetch(`*[_type == "category"] | order(title asc) {
        _id,
        title,
        "slug": slug.current,
        description
      }`);
      return { categories, error: null };
    } catch (error) {
      console.error('獲取分類錯誤:', error);
      return { categories: [], error };
    }
  },

  /**
   * 獲取部落格首頁完整數據
   */
  async getBlogHomeData(limit = 10, offset = 0) {
    try {
      const [postsData, settingsData, categoriesData] = await Promise.all([
        this.getPosts({ limit, offset }),
        this.getBlogSettings(),
        this.getCategories()
      ]);

      return {
        posts: postsData.posts,
        totalPosts: postsData.total,
        settings: settingsData.settings,
        categories: categoriesData.categories,
        error: null
      };
    } catch (error) {
      console.error('獲取部落格首頁數據錯誤:', error);
      return {
        posts: [],
        totalPosts: 0,
        settings: null,
        categories: [],
        error
      };
    }
  },

  /**
   * 根據分類獲取文章
   * @param categorySlug 分類 slug
   * @param limit 限制數量
   * @param offset 偏移量
   */
  async getPostsByCategory(categorySlug: string, limit = 10, offset = 0) {
    try {
      // 先檢查分類是否存在
      const { categories } = await this.getCategories();
      const category = categories.find((cat: Category) => cat.slug === categorySlug);
      
      if (!category) {
        return { 
          posts: [], 
          total: 0, 
          category: null, 
          error: new Error(`分類 ${categorySlug} 不存在`) 
        };
      }
      
      // 直接查詢該分類的文章
      const query = `*[_type == "post" && status == "published" && $categoryId in categories[]._ref] | order(publishedAt desc) {
        "total": count(*[_type == "post" && status == "published" && $categoryId in categories[]._ref]),
        "posts": *[_type == "post" && status == "published" && $categoryId in categories[]._ref] | order(publishedAt desc) [${offset}...${offset + limit}] {
          _id,
          title,
          "slug": slug.current,
          publishedAt,
          excerpt,
          mainImage,
          "categories": categories[]->{
            _id,
            title,
            "slug": slug.current
          }
        }
      }[0]`;
      
      const result = await client.fetch(query, { categoryId: category._id });
      
      return { 
        posts: result?.posts || [], 
        total: result?.total || 0, 
        category,
        error: null 
      };
    } catch (error) {
      console.error(`獲取分類 ${categorySlug} 文章錯誤:`, error);
      return { posts: [], total: 0, category: null, error };
    }
  }
}; 