import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogDetail from '@/components/blog/BlogDetail'
import { urlForImage } from '@/lib/sanity'
import { BlogService } from '@/lib/sanity/services'

interface PageParams {
  slug: string
}

interface PageProps {
  params: PageParams
}

export const revalidate = 3600 // 每小時重新驗證一次

// 生成靜態頁面參數
export async function generateStaticParams() {
  try {
    // 獲取所有文章的 slug
    const { posts } = await BlogService.getPosts({ limit: 100 });
    
    // 返回所有 slug 作為靜態頁面的參數
    return posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('生成靜態參數時發生錯誤:', error);
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const slug = params.slug
    const { post, error } = await BlogService.getPost(slug)

    if (!post || error) {
      return {
        title: '找不到文章',
        description: '您所尋找的文章不存在或已被移除。',
      }
    }

    // 生成 OG 圖片 URL
    let ogImageUrl = 'https://aideamed.com/images/blog-og.jpg'
    if (post.mainImage) {
      try {
        // 使用 urlForImage 獲取構建器，然後添加尺寸和格式參數
        const imageBuilder = urlForImage(post.mainImage)
        if (typeof imageBuilder === 'object' && typeof imageBuilder.width === 'function') {
          ogImageUrl = imageBuilder
            .width(1200)
            .height(630)
            .format('jpg')
            .quality(80)
            .url()
        } else if (typeof imageBuilder === 'string') {
          // 如果 urlForImage 返回字符串，直接添加參數
          ogImageUrl = `${imageBuilder}?w=1200&h=630&fm=jpg&q=80`
        }
      } catch (error) {
        console.error('生成 OG 圖片 URL 時發生錯誤:', error)
      }
    }

    // 從文章分類中提取標籤
    const tags = post.categories?.map((cat: any) => cat.title) || []

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        url: `https://aideamed.com/blog/${slug}`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        tags: tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.mainImage ? [ogImageUrl] : [],
      },
    }
  } catch (error) {
    console.error('生成元數據時發生錯誤:', error)
    return {
      title: '發生錯誤',
      description: '載入文章時發生錯誤，請稍後再試。',
    }
  }
}

export default async function Page({ params }: PageProps) {
  try {
    // 獲取當前文章
    const { post, error } = await BlogService.getPost(params.slug)
    if (!post || error) {
      notFound()
    }
    
    // 獲取相關文章（目前使用最新文章）
    const { posts: recentPosts } = await BlogService.getPosts({ 
      limit: 3,
      offset: 0 
    })
    
    // 過濾掉當前文章
    const filteredRecentPosts = recentPosts.filter((p: any) => p._id !== post._id)
    
    return <BlogDetail post={post} recentPosts={filteredRecentPosts} />
  } catch (error) {
    console.error('載入文章頁面時發生錯誤:', error)
    notFound()
  }
}
