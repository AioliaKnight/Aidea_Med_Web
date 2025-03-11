import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogList from '@/components/blog/BlogList';
import { BlogService } from '@/lib/sanity/services';
import { Category } from '@/types/blog';

interface PageParams {
  slug: string;
}

interface PageProps {
  params: PageParams;
}

export const revalidate = 3600; // 每小時重新驗證一次

// 生成靜態頁面參數
export async function generateStaticParams(): Promise<PageParams[]> {
  try {
    // 獲取所有分類的 slug
    const { categories } = await BlogService.getCategories();
    
    if (!categories || categories.length === 0) {
      return [];
    }

    // 返回所有 slug 作為靜態頁面的參數
    return categories.map((category: Category) => ({
      slug: category.slug || '',
    })).filter(params => params.slug);
  } catch (error) {
    console.error('生成靜態參數時發生錯誤:', error);
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: PageParams }
): Promise<Metadata> {
  try {
    const { category, error } = await BlogService.getPostsByCategory(params.slug);

    if (!category || error) {
      return {
        title: '找不到分類',
        description: '您所尋找的分類不存在或已被移除。',
      };
    }

    return {
      title: `${category.title} - 部落格分類`,
      description: category.description || `瀏覽 ${category.title} 分類的所有文章`,
      openGraph: {
        title: `${category.title} - 部落格分類`,
        description: category.description || `瀏覽 ${category.title} 分類的所有文章`,
        type: 'website',
        url: `https://aideamed.com/blog/category/${params.slug}`,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '載入分類時發生錯誤，請稍後再試。';
    console.error('生成元數據時發生錯誤:', error);
    return {
      title: '發生錯誤',
      description: errorMessage,
    };
  }
}

export default async function Page({ params }: PageProps) {
  try {
    const { posts, total, category, error } = await BlogService.getPostsByCategory(params.slug);
    
    if (!category || error) {
      notFound();
    }
    
    return (
      <BlogList
        posts={posts}
        title={category.title}
        description={category.description || `瀏覽 ${category.title} 分類的所有文章`}
        totalPosts={total}
        categorySlug={params.slug}
      />
    );
  } catch (error) {
    console.error('載入分類頁面時發生錯誤:', error);
    notFound();
  }
} 