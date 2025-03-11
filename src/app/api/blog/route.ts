import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/sanity/services'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // 每 60 秒重新驗證

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10') 
  const category = searchParams.get('category') || ''
  
  try {
    const offset = (page - 1) * limit
    
    const { posts, total, error } = await BlogService.getPosts({
      limit,
      offset,
      category
    })
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      posts,
      totalPosts: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('獲取博客文章時發生錯誤:', error)
    return NextResponse.json(
      { error: '無法獲取文章' },
      { status: 500 }
    )
  }
} 