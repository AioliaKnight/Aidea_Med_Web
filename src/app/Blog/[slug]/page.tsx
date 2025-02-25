import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import BlogPost from '@/components/pages/BlogPost'
import { urlForImage } from '@/lib/sanity'

interface PageParams {
  slug: string
}

interface PageProps {
  params: Promise<PageParams>
}

export const revalidate = 3600 // 每小時重新驗證一次

async function getPost(slug: string) {
  const query = groq`
    *[_type == "blog" && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      mainImage,
      categories[]->{
        title,
        description
      },
      content,
      "related": *[_type == "blog" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc) [0...3] {
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        mainImage,
        categories[]->{
          title
        }
      }
    }
  `
  const post = await client.fetch(query, { slug })
  return post
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) {
    return {
      title: '找不到文章 | Aidea:Med',
      description: '抱歉，您要找的文章不存在。',
    }
  }

  const ogImageUrl = post.mainImage
    ? urlForImage(post.mainImage).width(1200).height(630).url()
    : 'https://aideamed.com/images/blog-og.jpg'

  return {
    title: `${post.title} | Aidea:Med`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Aidea:Med`,
      description: post.excerpt,
      type: 'article',
      url: `https://aideamed.com/blog/${post.slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: ['Aidea:Med'],
      tags: post.categories.map((cat: { title: string }) => cat.title),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Aidea:Med`,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  return <BlogPost post={post} />
} 