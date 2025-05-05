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

// 根據路徑設定快取控制策略
const getCacheControlHeaders = (pathname: string): string => {
  // 醫療專業內容快取策略
  if (
    pathname.startsWith('/blog/') || 
    pathname.startsWith('/knowledge/')
  ) {
    // 專業內容使用適中的快取策略，確保及時更新但仍能享受CDN加速
    return 'public, max-age=3600, stale-while-revalidate=86400';
  }
  
  // 靜態資源使用長期快取
  if (
    pathname.match(/\.(jpg|jpeg|gif|png|ico|svg|webp|mp4|webm|woff|woff2)$/) ||
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/images/')
  ) {
    return 'public, max-age=31536000, immutable';
  }
  
  // JSON 檔案
  if (pathname.endsWith('.json')) {
    return 'public, max-age=3600';
  }
  
  // 網站圖示
  if (pathname === '/favicon.ico' || pathname === '/manifest.json') {
    return 'public, max-age=86400';
  }
  
  // API 路徑不快取
  if (pathname.startsWith('/api/')) {
    return 'no-store, no-cache, must-revalidate, proxy-revalidate';
  }
  
  // 案例頁面 - 中等快取時間
  if (pathname.startsWith('/case/')) {
    return 'public, max-age=7200, stale-while-revalidate=86400';
  }
  
  // 團隊頁面 - 中等快取時間
  if (pathname.startsWith('/team/')) {
    return 'public, max-age=7200, stale-while-revalidate=86400';
  }
  
  // 服務頁面 - 中等快取時間但較短的stale時間
  if (pathname.startsWith('/service/')) {
    return 'public, max-age=3600, stale-while-revalidate=43200';
  }
  
  // 主頁和主要著陸頁 - 較短快取以保持新鮮度
  if (pathname === '/' || pathname === '/contact') {
    return 'public, max-age=600, stale-while-revalidate=3600';
  }
  
  // 其他 HTML 頁面使用較短的快取時間，且啟用 stale-while-revalidate 策略
  return 'public, s-maxage=60, stale-while-revalidate=120';
};

// 獲取移動裝置優化標頭
const getMobileOptimizationHeaders = (userAgent: string | null): Record<string, string> => {
  const headers: Record<string, string> = {};
  
  // 如果是移動裝置，添加特定優化標頭
  if (userAgent && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    headers['X-UA-Compatible'] = 'IE=edge';
    headers['Accept-CH'] = 'DPR, Width, Viewport-Width';
    headers['Accept-CH-Lifetime'] = '86400';
    headers['Content-Type-Options'] = 'nosniff';
  }
  
  return headers;
};

// 中間件
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()
  
  // 應用安全標頭(不應用於API路徑)
  if (!pathname.startsWith('/api/')) {
    // 設置安全標頭
    const securityHeaders = constructSecurityHeaders(pathname)
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    // 設置快取控制標頭
    response.headers.set('Cache-Control', getCacheControlHeaders(pathname))
    
    // 設置移動裝置優化標頭
    const userAgent = request.headers.get('user-agent');
    const mobileHeaders = getMobileOptimizationHeaders(userAgent);
    Object.entries(mobileHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
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