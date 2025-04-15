import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getBlogPost } from '@/lib/blog-server'
import { generateBlogMetadata } from '@/lib/blog-utils'
import { BlogDetail } from '@/components/blog'

// 生成元資料
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: '找不到文章 | Aidea:Med 醫療行銷顧問'
    }
  }
  
  return generateBlogMetadata(post)
}

function BlogDetailSkeleton() {
  return (
    <div className="container mx-auto py-12">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-60 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  
  // 若文章不存在則返回404
  if (!post) {
    notFound()
  }
  
  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <BlogDetail post={post} />
    </Suspense>
  )
} 