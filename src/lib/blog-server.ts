/**
 * 部落格伺服器端工具函數庫
 * 處理檔案系統操作的伺服器端函數
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { Post, calculateReadTime, generateBlogMetadata } from './blog-utils'

// 重新導出需要的函數
export { generateBlogMetadata }

// 定義文章目錄路徑
const postsDirectory = path.join(process.cwd(), 'src/content/blog')

// 獲取所有文章 - 僅在伺服器端使用
export async function getAllBlogPosts(): Promise<Post[]> {
  try {
    // 確保目錄存在
    if (!fs.existsSync(postsDirectory)) {
      console.warn('Blog directory does not exist:', postsDirectory);
      return [];
    }

    // 讀取所有文章檔案
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = await Promise.all(fileNames
      .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
      .map(async fileName => {
        // 從檔案名稱中移除.md副檔名以獲得slug
        const slug = fileName.replace(/\.mdx?$/, '');
        
        // 讀取Markdown檔案
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        // 使用matter解析文章的YAML前置資料
        const matterResult = matter(fileContents);
        
        // 使用remark將Markdown處理為HTML
        const processedContent = await remark()
          .use(html, { sanitize: false })
          .process(matterResult.content);
        const contentHtml = processedContent.toString();
        
        // 解析前置資料
        const frontmatter = matterResult.data;
        
        // 返回文章資料
        return {
          id: slug,
          slug,
          title: frontmatter.title,
          summary: frontmatter.summary || '',
          content: contentHtml,
          coverImage: frontmatter.coverImage || '/images/default-cover.jpg',
          publishedAt: frontmatter.publishedAt || new Date().toISOString(),
          updatedAt: frontmatter.updatedAt,
          author: {
            name: frontmatter.author?.name || '團隊編輯',
            avatar: frontmatter.author?.avatar || '/images/team/default-avatar.jpg',
            title: frontmatter.author?.title || '內容創作者'
          },
          tags: frontmatter.tags || [],
          readTime: frontmatter.readTime || calculateReadTime(matterResult.content),
          category: frontmatter.category,
          gallery: frontmatter.gallery || []
        };
      }));
    
    // 依發布日期排序
    return allPostsData.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// 獲取單篇文章 - 僅在伺服器端使用
export async function getBlogPost(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // 檢查檔案是否存在
    if (!fs.existsSync(fullPath)) {
      // 嘗試.mdx副檔名
      const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
      if (!fs.existsSync(mdxPath)) {
        return null;
      }
      // 如果找到.mdx檔案，使用它
      const fileContents = fs.readFileSync(mdxPath, 'utf8');
      return await processMarkdownFile(fileContents, slug);
    }
    
    // 如果找到.md檔案，使用它
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return await processMarkdownFile(fileContents, slug);
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}

// 處理Markdown檔案 - 僅在伺服器端使用
async function processMarkdownFile(fileContents: string, slug: string): Promise<Post> {
  // 使用matter解析文章的YAML前置資料
  const matterResult = matter(fileContents);
  
  // 使用remark將Markdown處理為HTML
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  
  // 解析前置資料
  const frontmatter = matterResult.data;
  
  // 返回文章資料
  return {
    id: slug,
    slug,
    title: frontmatter.title,
    summary: frontmatter.summary || '',
    content: contentHtml,
    coverImage: frontmatter.coverImage || '/images/default-cover.jpg',
    publishedAt: frontmatter.publishedAt || new Date().toISOString(),
    updatedAt: frontmatter.updatedAt,
    author: {
      name: frontmatter.author?.name || '團隊編輯',
      avatar: frontmatter.author?.avatar || '/images/team/default-avatar.jpg',
      title: frontmatter.author?.title || '內容創作者'
    },
    tags: frontmatter.tags || [],
    readTime: frontmatter.readTime || calculateReadTime(matterResult.content),
    category: frontmatter.category,
    gallery: frontmatter.gallery || []
  };
} 