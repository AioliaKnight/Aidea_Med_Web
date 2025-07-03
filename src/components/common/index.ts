/**
 * 共用組件導出文件
 * 集中導出所有通用UI組件，便於引用
 */

// 加載與等待指示器
export { default as Loading, Spinner } from './Loading';

// 品牌標誌
export { default as Logo } from './Logo';

// 圖片優化組件
export { default as OptimizedImage } from './OptimizedImage';

// 頁面標頭
export { default as PageHeader } from './PageHeader';

// 常見問題區塊
export { default as FAQSection } from './FAQSection';

// 呼籲行動區塊
export { default as CTASection } from './CTASection';

// 回到頂部按鈕
export { default as BackToTopButton } from './BackToTopButton';

// 錯誤邊界組件
export { 
  default as ErrorBoundary,
  CaseErrorBoundary,
  CaseDetailErrorBoundary 
} from './ErrorBoundary'

// 動畫區塊組件
export { default as AnimatedSection } from './AnimatedSection'

// Google Tag Manager初始化組件
export { default as GoogleTagManager } from './GoogleTagManager'

// Instagram Feed 組件
export { default as InstagramFeed } from './InstagramFeed'

// SEO 優化組件
export { default as SEOOptimizer } from './SEOOptimizer'
export { default as OGImageOptimizer } from './OGImageOptimizer'
export { default as BreadcrumbStructuredData } from './BreadcrumbStructuredData'
export { default as WebVitalsOptimizer } from './WebVitalsOptimizer'
export { default as FacebookSDK } from './FacebookSDK'
export { 
  FacebookLikeButton,
  FacebookComments,
  FacebookShareButton 
} from './FacebookLikeButton'
export { default as SocialMediaSection } from './SocialMediaSection'
export { default as SocialEmbed } from './SocialEmbed'

// 浮動CTA按鈕
export { default as FloatingCTA } from './FloatingCTA'

/**
 * 添加以下導出功能:
 * 1. 可以直接使用index匯出的方式 @/components/common
 * 2. 也保留直接引入特定路徑的兼容性 @/components/common/XXX
 * 
 * 建議使用方式:
 * import { PageHeader, OptimizedImage, Spinner } from '@/components/common';
 */ 