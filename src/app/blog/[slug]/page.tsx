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

// 生成結構化資料 Schema.org - 優化版本
function generateBlogStructuredData(post: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
  const postUrl = `${baseUrl}/blog/${post.slug}`

  // 處理文章內容，移除HTML標籤以用於結構化資料
  const cleanContent = post.content.replace(/<[^>]*>/g, '')
  
  // 計算閱讀時間，如果沒有提供則使用一個估算
  const readingTime = post.readTime || Math.ceil(cleanContent.split(/\s+/).length / 200)
  
  // 擷取關鍵段落作為文章摘錄
  const excerpt = post.summary || cleanContent.substring(0, 150) + '...'
  
  // 從內容中提取前三個段落，用於articleBody
  const firstParagraphs = cleanContent
    .split(/(?:\r?\n){2,}/)
    .slice(0, 3)
    .join('\n\n')

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    headline: post.title,
    name: post.title,
    description: excerpt,
    abstract: post.summary,
    image: {
      '@type': 'ImageObject',
      url: post.coverImage.startsWith('http') ? post.coverImage : `${baseUrl}${post.coverImage}`,
      width: 1200,
      height: 630
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${baseUrl}/team`,
      image: post.author.avatar ? 
        (post.author.avatar.startsWith('http') ? post.author.avatar : `${baseUrl}${post.author.avatar}`) : 
        undefined,
      jobTitle: post.author.title || '醫療行銷專家'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aidea:Med 醫療行銷顧問',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 600,
        height: 60
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    },
    keywords: post.tags.join(', '),
    articleSection: post.category || '醫療行銷',
    articleBody: firstParagraphs,
    wordCount: cleanContent.split(/\s+/).length,
    timeRequired: `PT${readingTime}M`,
    inLanguage: 'zh-TW',
    isAccessibleForFree: true,
    creativeWorkStatus: 'Published',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.article-summary', 'h2', 'p']
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: [postUrl]
    }
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