import { Metadata } from 'next'
import { getPaginatedPosts, getAllCategories } from '@/lib/sanity'
import Blog from '@/components/sections/Blog'

interface BlogPageProps {
  searchParams: {
    page?: string
    category?: string
    search?: string
    sort?: 'latest' | 'popular'
  }
}

export const metadata: Metadata = {
  title: '部落格 | 專業知識分享',
  description: '深入探討牙醫行銷趨勢與實務經驗',
}

export const revalidate = 3600 // 每小時重新生成一次頁面

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const category = searchParams.category || ''
  const search = searchParams.search || ''
  const sort = (searchParams.sort as 'latest' | 'popular') || 'latest'

  const [{ posts, totalPages, currentPage }, categories] = await Promise.all([
    getPaginatedPosts({
      page,
      category,
      search,
      sortBy: sort,
    }),
    getAllCategories(),
  ])

  return (
    <main>
      <Blog
        posts={posts}
        categories={categories}
        currentPage={currentPage}
        totalPages={totalPages}
        searchQuery={search}
        selectedCategory={category}
        sortBy={sort}
      />
    </main>
  )
} 