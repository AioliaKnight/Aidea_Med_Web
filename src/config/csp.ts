// 內容安全策略 (CSP) 配置
// 參考: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

// 定義 ContentSecurityPolicy 介面
interface ContentSecurityPolicy {
  [directive: string]: string[];
}

// 預設政策（開發環境較寬鬆，生產環境較嚴格）
export const getDefaultDirectives = () => {
  const isDev = process.env.NODE_ENV === 'development'

  return {
    // 預設資源限制
    'default-src': ["'self'"],
    
    // 允許執行的 JavaScript
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://vercel.com',
      'https://vercel.live',
      'https://*.vercel-scripts.com',
      'https://*.google.com',
      'https://*.googleapis.com',
      'https://*.gstatic.com',
      'https://cdn.respond.io',
      // GTM和GA相關
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://ssl.google-analytics.com',
      'https://tagmanager.google.com',
    ],
    
    // 允許載入的樣式
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
      'https://*.googleapis.com',
      'https://cdn.respond.io',
      'https://tagmanager.google.com',
    ],
    
    // 允許連接的來源
    'connect-src': [
      "'self'",
      'https://vitals.vercel-insights.com',
      'https://*.vercel-insights.com',
      'https://*.googleapis.com',
      'https://*.google-analytics.com',
      'https://stats.g.doubleclick.net',
      'https://vercel.com',
      'https://vercel.live',
      'https://*.respond.io',
      'wss://*.respond.io',
      ...(isDev ? ['http://localhost:*'] : []),
    ],
    
    // 允許載入圖片的來源
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://source.unsplash.com',
      'https://placehold.co',
      'https://*.google.com',
      'https://*.googleapis.com',
      'https://*.gstatic.com',
      'https://*.respond.io',
      'https://www.google-analytics.com',
      'https://stats.g.doubleclick.net',
      'https://www.googletagmanager.com',
    ],
    
    // 允許載入字體的來源
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'https://*.gstatic.com',
      'https://cdn.respond.io',
    ],
    
    // 允許載入音頻的來源
    'media-src': [
      "'self'",
      'https://*.respond.io',
    ],
    
    // 允許載入物件的來源（例如PDF）
    'object-src': ["'none'"],
    
    // 允許載入框架的來源
    'frame-src': [
      "'self'",
      'https://vercel.com',
      'https://vercel.live',
      'https://*.google.com',
      'https://www.google.com/maps/',
      'https://*.respond.io',
      'https://www.googletagmanager.com',
    ],
    
    // 禁止顯示此網頁於iframe中
    'frame-ancestors': ["'none'"],
    
    // 禁止表單提交到其他網站
    'form-action': ["'self'"],
    
    // 添加基本安全措施
    'base-uri': ["'self'"],
    'upgrade-insecure-requests': isDev ? [] : [],
  }
}

// 將當前的指令格式化為標頭值格式
function formatDirectives(directives: { [key: string]: string[] }): string {
  return Object.entries(directives)
    .map(([key, values]) => {
      if (!values || !values.length) return '';
      return `${key} ${values.join(' ')}`;
    })
    .filter(Boolean)
    .join('; ');
}

// 獲取完整的CSP策略
export const getContentSecurityPolicy = () => {
  const directives = getDefaultDirectives()
  return formatDirectives(directives)
}

// 將 CSP 轉換為標頭字符串
export function cspToString(csp: ContentSecurityPolicy): string {
  return Object.entries(csp)
    .map(([key, values]) => {
      if (!values || !values.length) return null;
      
      return `${key} ${values.join(' ')}`;
    })
    .filter(Boolean)
    .join('; ');
} 