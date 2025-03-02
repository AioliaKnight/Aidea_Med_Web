import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aidea-med.vercel.app';
  
  // 靜態頁面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ] as MetadataRoute.Sitemap;

  try {
    // 從 Sanity 獲取部落格文章
    const blogQuery = groq`
      *[_type == "post"] {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }
    `;
    
    const blogPosts = await client.fetch(blogQuery);
    
    // 從 Sanity 獲取案例
    const caseQuery = groq`
      *[_type == "case"] {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }
    `;
    
    const cases = await client.fetch(caseQuery);
    
    // 將部落格文章添加到 sitemap
    const blogSitemap = blogPosts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt || post.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
    
    // 將案例添加到 sitemap
    const caseSitemap = cases.map((caseItem: any) => ({
      url: `${baseUrl}/case/${caseItem.slug}`,
      lastModified: new Date(caseItem._updatedAt || caseItem.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
    
    // 組合所有頁面
    return [...staticPages, ...blogSitemap, ...caseSitemap];
  } catch (error) {
    console.error('生成網站地圖時發生錯誤:', error);
    // 發生錯誤時返回靜態頁面
    return staticPages;
  }
} 