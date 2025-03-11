import { Metadata } from 'next';
import BlogList from '@/components/blog/BlogList';
import { BlogService } from '@/lib/sanity/services';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  };
}

export const revalidate = 3600; // 每小時重新驗證一次

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  
  try {
    // 使用 BlogService 獲取分類
    const { categories, error } = await BlogService.getCategories();
    if (error) throw error;
    
    const category = categories.find(cat => cat.slug === slug);
    
    if (!category) {
      return {
        title: '分類不存在 | Aidea:Med',
        description: '您嘗試訪問的分類不存在。',
      };
    }
    
    return {
      title: `${category.title} | 部落格分類 | Aidea:Med`,
      description: category.description || `探索 ${category.title} 分類下的所有文章`,
      openGraph: {
        title: `${category.title} | 部落格分類 | Aidea:Med`,
        description: category.description || `探索 ${category.title} 分類下的所有文章`,
        images: [{
          url: 'https://aideamed.com/images/blog-og.jpg',
          width: 1200,
          height: 630,
          alt: `${category.title} - Aidea:Med 部落格`,
        }],
      },
    };
  } catch (error) {
    console.error('獲取分類元數據時發生錯誤:', error);
    return {
      title: '部落格分類 | Aidea:Med',
      description: '探索醫療行銷的最新趨勢和見解',
    };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = params;
  
  try {
    // 使用專門的分類文章獲取方法
    const { posts, total, category, error } = await BlogService.getPostsByCategory(slug, 10, 0);
    
    if (error) {
      console.error(`獲取分類 ${slug} 文章錯誤:`, error);
      if (error.message.includes('不存在')) {
        notFound();
      }
      throw error;
    }
    
    // 獲取所有分類顯示在分類過濾器
    const { categories } = await BlogService.getCategories();
    
    // 獲取設定
    const { settings } = await BlogService.getBlogSettings();
    
    return (
      <BlogList 
        posts={posts}
        categories={categories}
        settings={settings}
        title={category.title}
        description={category.description || `探索 ${category.title} 分類下的所有文章`}
        currentPage={1}
        totalPosts={total}
        postsPerPage={10}
        isCategory={true}
        categorySlug={category._id}
      />
    );
  } catch (error) {
    console.error('載入分類頁面時發生錯誤:', error);
    notFound();
  }
} 