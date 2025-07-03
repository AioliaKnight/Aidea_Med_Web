// 內容安全策略 (CSP) 配置
// 參考: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

// 定義 ContentSecurityPolicy 介面
interface ContentSecurityPolicy {
  [directive: string]: string[];
}

// 醫療相關可信任來源
const medicalTrustedSources = [
  // 醫療機構和醫療資訊網站
  'https://*.nhi.gov.tw',
  'https://*.cdc.gov.tw',
  'https://*.mohw.gov.tw',
  'https://*.who.int',
  'https://*.cdc.gov',
  'https://*.nih.gov',
  'https://*.mayoclinic.org',
  'https://*.commonhealth.com.tw',
  'https://*.dentist.com.tw',
  'https://*.dent.com.tw',
  'https://*.e-oral.com.tw',
  'https://*.wd.guide',
  'https://*.healthnews.com.tw',
  'https://*.teacherlee.com',
  'https://*.rootcanal.com.tw',
  'https://*.health.yam.com',
];

// 預設政策（開發環境較寬鬆，生產環境較嚴格）
export const getDefaultDirectives = () => {
  const isDev = process.env.NODE_ENV === 'development'

  return {
    // 預設資源限制
    'default-src': ["'self'", ...medicalTrustedSources],
    
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
      // Facebook 和 Instagram API
      'https://connect.facebook.net',
      'https://*.facebook.net',
      'https://*.facebook.com',
      'https://graph.facebook.com',
      'https://api.instagram.com',
      'https://graph.instagram.com',
      // 醫療相關工具和分析
      'https://cdn.jsdelivr.net',
      'https://cdnjs.cloudflare.com',
      'https://player.vimeo.com',
      'https://embed.medicalmonk.com',
      'https://api.medigraphic.com',
      'https://dentalhub-analytics.com',
      'https://*.medrevenue.com',
      'https://*.dental-monitoring.com',
      ...medicalTrustedSources,
    ],
    
    // 允許載入的樣式
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
      'https://*.googleapis.com',
      'https://cdn.respond.io',
      'https://tagmanager.google.com',
      'https://cdn.jsdelivr.net',
      'https://cdnjs.cloudflare.com',
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
      // Facebook 和 Instagram API
      'https://graph.facebook.com',
      'https://api.instagram.com',
      'https://graph.instagram.com',
      'https://*.facebook.com',
      'https://connect.facebook.net',
      // oEmbed API 端點
      'https://www.facebook.com',
      'https://threads.net',
      // 醫療相關API
      'https://api.healthdata.tw',
      'https://api.dentaltw.com',
      'https://api.dentalcase.io',
      'https://api.medicalanalytics.com',
      'https://api.medicinenet.com',
      ...(isDev ? ['http://localhost:*'] : []),
      ...medicalTrustedSources,
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
      // Facebook 和 Instagram 圖片
      'https://*.facebook.com',
      'https://*.fbcdn.net',
      'https://*.instagram.com',
      'https://*.cdninstagram.com',
      // 圖像CDN服務
      'https://*.imgix.net',
      'https://*.cloudinary.com',
      'https://*.cloudfront.net',
      'https://*.twimg.com',
      'https://*.kfs.io',
      'https://images.prismic.io',
      // 醫療/牙科案例相關
      'https://*.vivo.com',
      'https://*.imgur.com',
      'https://*.pixnet.net',
      'https://*.pimg.tw',
      'https://*.dentist.com.tw',
      'https://*.health.gvm.com.tw',
      'https://*.cch.org.tw',
      'https://*.commonhealth.com.tw',
      'https://*.dent.com.tw',
      'https://*.doctorvoice.org',
      'https://*.kmuya.org',
      'https://*.meetjobs.com',
      'https://*.1111.com.tw',
      'https://*.job104.com.tw',
      'https://*.rootcanal.com.tw',
      'https://*.implant.com.tw', 
      'https://*.dentalx.tw',
      'https://*.dental-aesthetics.com.tw',
      'https://*.dentalcare.com.tw',
      'https://*.drwu.com.tw',
      'https://*.drwen.com.tw',
      'https://*.teacherlee.com',
      'https://*.medicalanalytics.com',
      ...medicalTrustedSources,
    ],
    
    // 允許載入字體的來源
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'https://*.gstatic.com',
      'https://cdn.respond.io',
      'https://cdn.jsdelivr.net',
      'https://use.typekit.net',
    ],
    
    // 允許載入音頻的來源
    'media-src': [
      "'self'",
      'https://*.respond.io',
      'https://player.vimeo.com',
      'https://*.cloudfront.net',
      'https://www.youtube.com',
      'https://*.ytimg.com',
      'https://*.dental-monitoring.com',
      ...medicalTrustedSources,
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
      'https://www.youtube.com',
      'https://player.vimeo.com',
      'https://embed.medicalmonk.com',
      ...medicalTrustedSources,
    ],
    
    // 禁止顯示此網頁於iframe中
    'frame-ancestors': ["'none'"],
    
    // 禁止表單提交到其他網站
    'form-action': ["'self'"],
    
    // 添加基本安全措施
    'base-uri': ["'self'"],
    'upgrade-insecure-requests': isDev ? [] : [],
    
    // 限制 manifest 來源
    'manifest-src': ["'self'"],
    
    // 字體和樣式來源
    'prefetch-src': ["'self'"],
    
    // 工作者腳本來源
    'worker-src': ["'self'", 'blob:'],
    
    // 醫療內容報告違規行為
    'report-uri': ['https://report.aideamed.com/csp-report'],
    'report-to': ['default'],
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