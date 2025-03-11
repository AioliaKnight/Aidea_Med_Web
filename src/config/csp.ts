// 內容安全策略 (CSP) 配置
// 參考: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

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
    ],
    
    // 允許載入的樣式
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
    ],
    
    // 允許連接的來源
    'connect-src': [
      "'self'",
      'https://*.sanity.io',
      'https://*.apicdn.sanity.io',
      'https://vitals.vercel-insights.com',
      'https://*.googleapis.com',
      'https://*.google-analytics.com',
      'https://vercel.com',
      'https://vercel.live',
      ...(isDev ? ['http://localhost:*'] : []),
    ],
    
    // 允許載入圖片的來源
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://*.sanity.io',
      'https://*.apicdn.sanity.io',
      'https://cdn.sanity.io',
      'https://source.unsplash.com',
      'https://placehold.co',
    ],
    
    // 允許載入字體的來源
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
    ],
    
    // 允許載入音頻的來源
    'media-src': ["'self'"],
    
    // 允許載入物件的來源（例如PDF）
    'object-src': ["'none'"],
    
    // 允許載入框架的來源
    'frame-src': [
      "'self'",
      'https://vercel.com',
      'https://vercel.live',
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

// 建立CSP格式字串
export const formatDirectives = (directives: Record<string, string[]>) => {
  return Object.entries(directives)
    .filter(([_key, value]) => value.length > 0)
    .map(([key, value]) => {
      if (key === 'upgrade-insecure-requests' && value.length === 0) {
        return 'upgrade-insecure-requests'
      }
      return `${key} ${value.join(' ')}`
    })
    .join('; ')
}

// 獲取完整的CSP策略
export const getContentSecurityPolicy = () => {
  const directives = getDefaultDirectives()
  return formatDirectives(directives)
} 