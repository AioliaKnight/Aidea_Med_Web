import { Metadata } from 'next'
import { getPost, getAllPosts } from '@/lib/sanity'
import BlogPost from '@/components/sections/BlogPost'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// 生成靜態頁面路徑
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug.current,
  }))
}

// 生成動態 metadata
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: '找不到文章',
      description: '您要找的文章不存在',
    }
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: [
        {
          url: post.ogImage?.asset.url || post.mainImage.asset.url,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: [post.ogImage?.asset.url || post.mainImage.asset.url],
    },
  }
}

export const revalidate = 3600 // 每小時重新生成一次頁面

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main>
      <BlogPost post={post} relatedPosts={post.relatedPosts} />
    </main>
  )
} 