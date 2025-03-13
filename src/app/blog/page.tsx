import { Metadata } from 'next'
import BlogList from '@/components/blog/BlogList'
import { BlogService } from '@/lib/sanity/services'
import { Category } from '@/types/blog'

export const revalidate = 3600 // 每小時重新驗證一次

export async function generateMetadata(): Promise<Metadata> {
  let categoryTitles = '醫療行銷、診所經營、數位策略'; // 預設分類標題
  
  try {
    const { categories } = await BlogService.getCategories()

    if (categories && categories.length > 0) {
      categoryTitles = categories.map((cat: Category) => cat.title).join('、')
    }
  } catch (error) {
    console.error('無法獲取分類資料:', error)
  }

  return {
    title: '部落格 | Aidea:Med',
    description: `探索醫療行銷的最新趨勢、案例分析和專業見解。分類包含：${categoryTitles}`,
    openGraph: {
      title: '部落格 | Aidea:Med',
      description: `探索醫療行銷的最新趨勢、案例分析和專業見解。分類包含：${categoryTitles}`,
      type: 'website',
      url: 'https://aideamed.com/blog',
      images: [
        {
          url: 'https://aideamed.com/images/blog-og.jpg',
          width: 1200,
          height: 630,
          alt: 'Aidea:Med 部落格',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: '部落格 | Aidea:Med',
      description: `探索醫療行銷的最新趨勢、案例分析和專業見解。分類包含：${categoryTitles}`,
      images: ['https://aideamed.com/images/blog-og.jpg'],
    },
  }
}

export default async function Page() {
  try {
    const { posts, total } = await BlogService.getPosts({ limit: 9, offset: 0 })
    
    return (
      <BlogList
        posts={posts}
        title="部落格"
        description="探索醫療行銷的最新趨勢、案例分析和專業見解"
        totalPosts={total}
      />
    )
  } catch (error) {
    console.error('無法獲取初始文章:', error)
    return (
      <BlogList
        posts={[]}
        title="部落格"
        description="探索醫療行銷的最新趨勢、案例分析和專業見解"
        totalPosts={0}
      />
    )
  }
} 