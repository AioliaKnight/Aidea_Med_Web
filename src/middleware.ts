import { NextResponse, NextRequest } from 'next/server'
import { getContentSecurityPolicy } from './config/csp'

// 建構安全標頭
const constructSecurityHeaders = (pathname: string) => {
  const isDev = process.env.NODE_ENV === 'development'
  
  // 使用類型斷言定義標頭物件
  const headers: Record<string, string> = {
    // 防止 MIME 嗅探
    'X-Content-Type-Options': 'nosniff',
    
    // 阻止點擊劫持
    'X-Frame-Options': 'DENY',
    
    // 啟用 XSS 防護
    'X-XSS-Protection': '1; mode=block',
    
    // 控制引用者信息
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // 預存 DNS 查詢
    'X-DNS-Prefetch-Control': 'on',
    
    // 添加 CSP，對聯絡頁面特殊處理確保 GTM 正確加載
    'Content-Security-Policy': pathname === '/contact' 
      ? getContentSecurityPolicy() + "; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com tagmanager.google.com"
      : getContentSecurityPolicy()
  }
  
  return headers
}

// 中間件
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()
  
  // 應用安全標頭(不應用於API路徑)
  if (!pathname.startsWith('/api/')) {
    const securityHeaders = constructSecurityHeaders(pathname)
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }

  // 繼續正常的請求
  return response
}

// 只針對指定的路徑執行中間件
export const config = {
  matcher: [
    // 排除 Next.js 靜態資源、API 路由、Vercel API 路由
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 