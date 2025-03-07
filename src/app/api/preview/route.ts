import { NextResponse } from 'next/server'
import { previewClient } from '@/lib/sanity/client'
import { getPost } from '@/lib/sanity/queries'
import { isValidPreviewToken } from '@/lib/sanity/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // 檢查預覽令牌
  if (!secret || !isValidPreviewToken(secret)) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    )
  }

  if (!slug) {
    return NextResponse.json(
      { message: 'No slug in the request' },
      { status: 401 }
    )
  }

  try {
    // 獲取預覽文章
    const post = await previewClient.fetch(getPost, { slug })

    if (!post) {
      return NextResponse.json(
        { message: 'Invalid slug' },
        { status: 401 }
      )
    }

    // 重定向到文章頁面
    return NextResponse.redirect(new URL(`/blog/${slug}`, request.url))
  } catch (error) {
    console.error('Error in preview:', error)
    return NextResponse.json(
      { message: 'Error in preview' },
      { status: 500 }
    )
  }
} 