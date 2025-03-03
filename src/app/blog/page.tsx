import { Metadata } from 'next'
import BlogPage from '@/components/pages/BlogPage'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'

export const revalidate = 3600 // 每小時重新驗證一次

export async function generateMetadata(): Promise<Metadata> {
  const query = groq`*[_type == "category"] {
    title,
    description
  }`
  const categories = await client.fetch(query)

  const categoryTitles = categories.map((cat: { title: string }) => cat.title).join('、')

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
  return <BlogPage />
} 