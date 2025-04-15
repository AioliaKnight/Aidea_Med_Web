import { PageHeader } from '@/components/common'
import { Suspense } from 'react'
import { BlogList } from '@/components/blog'
import { getAllBlogPosts } from '@/lib/blog-server'

export const metadata = {
  title: '行銷新知 | Aidea:Med 醫療行銷顧問',
  description: '探索醫療行銷的最新趨勢、診所經營策略和數位工具應用，幫助您的診所脫穎而出。',
  keywords: '醫療行銷, 診所經營, 數位行銷, 醫療內容策略',
  openGraph: {
    title: '行銷新知 | Aidea:Med 醫療行銷顧問',
    description: '探索醫療行銷的最新趨勢、診所經營策略和數位工具應用，幫助您的診所脫穎而出。',
    images: [
      {
        url: '/images/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: '行銷新知'
      }
    ]
  }
}

function BlogPageSkeleton() {
  return (
    <div className="container mx-auto py-12 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-80"></div>
        ))}
      </div>
    </div>
  );
}

export default async function Page() {
  // 預先獲取所有文章，使用伺服器端功能
  const posts = await getAllBlogPosts();
  
  return (
    <>
      <PageHeader
        title="行銷新知"
        description="探索醫療行銷的最新趨勢、診所經營策略和數位工具應用"
        variant="red"
        alignment="center"
        size="md"
        backgroundImage="/images/bgline-w.webp"
      />
      <Suspense fallback={<BlogPageSkeleton />}>
        <BlogList initialPosts={posts} />
      </Suspense>
    </>
  )
} 