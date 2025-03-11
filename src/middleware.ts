import { NextResponse, NextRequest } from 'next/server'

// 中間件
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 重定向 /studio (精確路徑) 到 /studio-entry
  if (pathname === '/studio') {
    return NextResponse.redirect(new URL('/studio-entry', request.url))
  }

  // 繼續正常的請求
  return NextResponse.next()
}

// 只針對指定的路徑執行中間件
export const config = {
  matcher: [
    '/studio',
  ],
} 