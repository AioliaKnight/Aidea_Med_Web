import { Metadata } from 'next'
import BlogList from '@/components/blog/BlogList'
import { BlogService } from '@/lib/sanity/services'

export const revalidate = 3600 // 每小時重新驗證一次

export async function generateMetadata(): Promise<Metadata> {
  const { categories, error } = await BlogService.getCategories()
  
  let categoryTitles = '醫療行銷、診所經營、數位策略'; // 預設分類標題
  
  if (categories && categories.length > 0 && !error) {
    categoryTitles = categories.map((cat: { title: string }) => cat.title).join('、')
  }

  return {
    title: '部落格 | Aidea:Med',
    description: `探索醫療行銷的最新趨勢、案例分析和專業見解。分類包含：${categoryTitles}`,
    openGraph: {
      title: '部落格 | Aidea:Med',
      description: `探索醫療行銷的最新趨勢、案例分析和專業見解。分類包含：${categoryTitles}`,
      images: [{
        url: 'https://aideamed.com/images/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Aidea:Med 部落格',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: '部落格 | Aidea:Med',
      description: `探索醫療行銷的最新趨勢、案例分析和專業見解`,
      images: ['https://aideamed.com/images/blog-og.jpg'],
    },
  }
}

export default async function Page() {
  const { posts, totalPosts, settings, categories, error } = await BlogService.getBlogHomeData(10, 0)
  
  if (error) {
    console.error('獲取部落格數據發生錯誤:', error)
  }

  return (
    <BlogList 
      posts={posts || []} 
      settings={settings}
      categories={categories}
      title="部落格"
      description="探索醫療行銷的最新趨勢、案例分析和專業見解"
      currentPage={1}
      totalPosts={totalPosts || 0}
      postsPerPage={10}
    />
  )
} 