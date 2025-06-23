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

// 表單按鈕
export { default as SubmitButton } from './SubmitButton';

// 呼籲行動區塊
export { default as CTASection } from './CTASection';

// 回到頂部按鈕
export { default as BackToTopButton } from './BackToTopButton';

// 添加ErrorBoundary組件導出
export { 
  default as ErrorBoundary,
  CaseErrorBoundary,
  CaseDetailErrorBoundary 
} from './ErrorBoundary'

// 添加AnimatedSection組件導出
export { default as AnimatedSection } from './AnimatedSection'

// Google Tag Manager初始化組件
export { default as GoogleTagManager } from './GoogleTagManager'

// SEO 優化組件
export { default as SEOOptimizer } from './SEOOptimizer'
// 注意：SEO 輔助函數已移至 @/lib/seo-utils 以支援服務器端使用

// 性能監控組件
export { default as PerformanceMonitor } from './PerformanceMonitor'

// 新增通用組件
export { FAQSection } from './FAQSection'

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