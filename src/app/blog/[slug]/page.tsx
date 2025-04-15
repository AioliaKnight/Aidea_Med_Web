import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getBlogPost } from '@/lib/blog-server'
import { generateBlogMetadata } from '@/lib/blog-utils'
import { BlogDetail } from '@/components/blog'

// 生成元資料
export async function generateMetadata(props: { params: { slug: string } }) {
  // 先解析 params，再使用其屬性
  const params = await Promise.resolve(props.params);
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: '找不到文章 | Aidea:Med 醫療行銷顧問'
    }
  }
  
  return generateBlogMetadata(post)
}

// 生成結構化資料 Schema.org
function generateBlogStructuredData(post: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${baseUrl}/team`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aidea:Med 醫療行銷顧問',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`
    },
    keywords: post.tags.join(', '),
    articleBody: post.content.replace(/<[^>]*>/g, '').substring(0, 500) + '...',
    articleSection: post.category || '醫療行銷',
    wordCount: post.content.replace(/<[^>]*>/g, '').split(/\s+/).length
  }
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

export default async function Page(props: { params: { slug: string } }) {
  // 先解析 params，再使用其屬性
  const params = await Promise.resolve(props.params);
  const post = await getBlogPost(params.slug)
  
  // 若文章不存在則返回404
  if (!post) {
    notFound()
  }
  
  const structuredData = generateBlogStructuredData(post)
  
  return (
    <>
      {/* Schema.org 結構化資料 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <Suspense fallback={<BlogDetailSkeleton />}>
        <BlogDetail post={post} />
      </Suspense>
    </>
  )
} 