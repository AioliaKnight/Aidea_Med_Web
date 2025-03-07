import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'
import { getPosts, getBlogSettings } from '@/lib/sanity/queries'
import { BlogQueryParams } from '@/types/blog'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '9')
  const sort = (searchParams.get('sort') || 'publishedAt') as 'publishedAt' | 'title'
  const order = searchParams.get('order') || 'desc'

  try {
    const start = (page - 1) * limit
    const end = start + limit

    const params: BlogQueryParams = {
      start,
      end,
      category: category || undefined,
      search: search || undefined,
      sort,
      order: order as 'asc' | 'desc',
    }

    const result = await client.fetch(getPosts, params)
    const settings = await client.fetch(getBlogSettings)

    return NextResponse.json({
      posts: result.posts,
      total: result.total,
      page,
      totalPages: Math.ceil(result.total / limit),
      hasMore: end < result.total,
      settings,
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
} 