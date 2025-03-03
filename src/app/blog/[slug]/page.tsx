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
  params: PageParams
}

export const revalidate = 3600 // 每小時重新驗證一次

async function getPost(slug: string) {
  const query = groq`
    *[_type == "post" && slug.current == $slug][0] {
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
      body,
      "related": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc) [0...3] {
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
  
  try {
    const post = await client.fetch(query, { slug })
    
    // 檢查是否有找到文章
    if (!post) {
      console.error(`找不到 slug 為 "${slug}" 的文章`)
      return null
    }
    
    return post
  } catch (error) {
    console.error(`獲取文章時發生錯誤 (slug: ${slug}):`, error)
    return null
  }
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  try {
    const post = await getPost(params.slug)

    if (!post) {
      return {
        title: '找不到文章 | Aidea:Med',
        description: '抱歉，您要找的文章不存在。',
      }
    }

    const ogImageUrl = post.mainImage
      ? urlForImage(post.mainImage).width(1200).height(630).url()
      : 'https://aideamed.com/images/blog-og.jpg'

    // 檢查 post.categories 是否存在並有內容
    const tags = post.categories && post.categories.length > 0 
      ? post.categories.map((cat: { title: string }) => cat.title) 
      : ['牙醫行銷', '診所經營']

    return {
      title: `${post.title} | Aidea:Med`,
      description: post.excerpt || '了解更多關於牙醫診所經營與行銷的專業知識',
      openGraph: {
        title: `${post.title} | Aidea:Med`,
        description: post.excerpt || '了解更多關於牙醫診所經營與行銷的專業知識',
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
        tags: tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${post.title} | Aidea:Med`,
        description: post.excerpt || '了解更多關於牙醫診所經營與行銷的專業知識',
        images: [ogImageUrl],
      },
    }
  } catch (error) {
    console.error('生成元數據時發生錯誤:', error)
    return {
      title: 'Aidea:Med | 數位行銷專家',
      description: '牙醫診所的數位行銷夥伴，助您打造數位牙醫帝國',
    }
  }
}

export default async function Page({ params }: PageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return <BlogPost post={post} />
}
