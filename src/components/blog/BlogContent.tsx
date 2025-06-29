'use client'

import React, { useEffect, useRef, memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { setupHeadingIds } from '@/lib/blog-utils'

interface BlogContentProps {
  content: string
  className?: string
}

// 抽離樣式常數，避免重複計算
const PROSE_STYLES = {
  base: "prose prose-lg max-w-none",
  text: "prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-5 sm:prose-p:mb-7 prose-p:text-base md:prose-p:text-lg prose-p:tracking-wide prose-p:leading-7",
  headings: "prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-gray-900 prose-headings:leading-tight",
  h2: "prose-h2:text-[1.5rem] sm:prose-h2:text-[1.75rem] prose-h2:font-bold prose-h2:mt-8 sm:prose-h2:mt-10 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:pb-2 sm:prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-gray-100",
  h3: "prose-h3:text-[1.25rem] sm:prose-h3:text-[1.5rem] prose-h3:font-semibold prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-3 sm:prose-h3:mb-4",
  images: "prose-img:rounded-2xl sm:prose-img:rounded-3xl prose-img:shadow-lg prose-img:mx-auto prose-img:my-6 sm:prose-img:my-10 prose-img:w-full prose-img:h-auto"
} as const

// 優化：使用 memo 來防止不必要的重渲染
const BlogContentMemo = memo<BlogContentProps>(({ content, className }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  
  // 優化：使用 useMemo 來避免重複計算樣式
  const combinedStyles = useMemo(() => cn(
    PROSE_STYLES.base,
    PROSE_STYLES.text,
    PROSE_STYLES.headings,
    PROSE_STYLES.h2,
    PROSE_STYLES.h3,
    PROSE_STYLES.images,
    // 其他現有樣式...
    "prose-h1:text-3xl sm:prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:font-bold prose-h1:mb-6 sm:prose-h1:mb-10 prose-h1:mt-8 sm:prose-h1:mt-10",
    className
  ), [className])

  // 優化：使用 useCallback 來避免重複創建函數
  const setupContentEnhancements = useCallback(() => {
    if (!contentRef.current) return

    // 使用 requestIdleCallback 來優化DOM操作時機
    const scheduleWork = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback, { timeout: 1000 })
      } else {
        setTimeout(callback, 0)
      }
    }

    scheduleWork(() => {
      if (!contentRef.current) return
      
      // 處理標題元素
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
      setupHeadingIds(headings)
      
      // 批量處理 div 元素以減少重排
      const divElements = contentRef.current.querySelectorAll('div')
      const fragment = document.createDocumentFragment()
      
      Array.from(divElements).forEach((div) => {
        if (div instanceof HTMLElement) {
          // 使用 CSS 類而非內聯樣式來提高性能
          div.classList.add('blog-content-div')
          applyStyleToInnerElements(div)
        }
      })
    })
  }, [])

  useEffect(() => {
    setupContentEnhancements()
  }, [content, setupContentEnhancements])

  // 抽離內部元素處理邏輯
  const applyStyleToInnerElements = useCallback((container: Element) => {
    // 使用 classList 操作代替 style 操作以提高性能
    const processElements = (selector: string, className: string) => {
      const elements = container.querySelectorAll(selector)
      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.classList.add(className)
        }
      })
    }

    processElements('h1, h2, h3, h4, h5, h6', 'blog-heading-enhanced')
    processElements('p', 'blog-paragraph-enhanced')
    processElements('ul, ol', 'blog-list-enhanced')
  }, [])

  return (
    <motion.div
      ref={contentRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={combinedStyles}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
})

BlogContentMemo.displayName = 'BlogContent'

/**
 * 部落格文章內容排版組件
 * 
 * 專注於:
 * 1. 優化閱讀體驗與排版設計
 * 2. 響應式字體大小與行距設計
 * 3. 支援各種內容元素樣式化
 * 4. 優化標題層級與視覺呈現
 * 5. 支援多種自定義區塊樣式
 */
const BlogContent: React.FC<BlogContentProps> = ({ content, className }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // 確保所有 div 元素和其內容能夠正確顯示，並為標題添加 ID
  useEffect(() => {
    if (contentRef.current) {
      // 處理標題元素，為它們添加 ID 以支援目錄導覽
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      setupHeadingIds(headings);
      
      // 處理保留原始div結構和類別名稱
      const divElements = contentRef.current.querySelectorAll('div');
      
      Array.from(divElements).forEach((div) => {
        // 不添加內聯樣式，依賴CSS樣式
        
        // 檢查是否為我們支援的自定義樣式區塊
        const checkAndApplyStyle = (className: string) => {
          if (div.classList.contains(className)) {
            // 添加必要的標記類別
            div.classList.add('preserve-div');
            div.classList.add('custom-content-block');
            
            // 確保區塊內部元素都能正確顯示
            applyStyleToInnerElements(div);
            
            // 返回 true 表示找到了匹配的樣式
            return true;
          }
          return false;
        };
        
        // 處理特定樣式的 div
        const customClassNames = [
          'stat-highlight', 'response-model', 'action-checklist', 
          'case-study', 'pro-tip', 'action-plan', 'cta-section',
          'warning-box', 'info-box', 'note-box', 'image-gallery',
          'expert-quote', 'product-recommendation', 'timeline',
          'step-guide', 'legal-note', 'faq-section', 'faq-item',
          'expert-credentials', 'problem-analysis',
          'service-overview', 'service-item', 'service-details',
          'research-note', 'results-section', 'results-grid',
          'advantages-section', 'advantage-item', 'data-verification',
          'series-note', 'key-insight', 'example-box', 'insight-box',
          'application-tips', 'format-examples', 'case-image',
          'before-after', 'before', 'after', 'results', 'key-takeaway',
          'model-progress', 'stage-goal', 'next-preview', 'service-highlights',
          'service-card', 'case-studies', 'key-takeaways', 'company-advantages',
          'advantage-highlight', 'cta-buttons', 'article-footer'
        ];
        
        // 檢查是否是任何一個自定義樣式類別
        customClassNames.some(className => checkAndApplyStyle(className));
        

      });
    }
  }, [content]);
  
  // 新函數：應用樣式到內部元素
  function applyStyleToInnerElements(container: Element) {
    // 依賴CSS樣式，不添加內聯樣式
    // 只確保必要的類別已被添加
    container.classList.add('blog-content-container');
  }

  return (
    <motion.div
      ref={contentRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        // 基礎文章排版
        "prose prose-lg max-w-none",
        
        // 正文排版優化 - 增強移動端可讀性
        "prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-5 sm:prose-p:mb-7 prose-p:text-base md:prose-p:text-lg",
        "prose-p:tracking-wide prose-p:leading-7",
        
        // 設定字體
        "prose-headings:font-heading",
        
        // 標題基本樣式 - 更好的移動端間距
        "prose-headings:tracking-tight prose-headings:text-gray-900 prose-headings:leading-tight",
        
        // 根據原始style標籤調整標題樣式
        "prose-h2:text-[1.5rem] sm:prose-h2:text-[1.75rem] prose-h2:font-bold prose-h2:mt-8 sm:prose-h2:mt-10 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:pb-2 sm:prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-gray-100",
        "prose-h3:text-[1.25rem] sm:prose-h3:text-[1.5rem] prose-h3:font-semibold prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-3 sm:prose-h3:mb-4",
        
        // 標題視覺層次增強
        "[&>h2]:relative [&>h2]:inline-block",
        "[&>h2]:after:content-[''] [&>h2]:after:absolute [&>h2]:after:bottom-0 [&>h2]:after:left-0 [&>h2]:after:h-[3px] [&>h2]:after:w-full [&>h2]:after:origin-bottom-right [&>h2]:after:scale-x-0 [&>h2]:after:bg-gradient-to-r [&>h2]:after:from-primary/60 [&>h2]:after:to-primary/30 [&>h2]:after:transition-transform [&>h2]:after:duration-300 [&>h2]:after:ease-out",
        "[&>h2]:hover:after:origin-bottom-left [&>h2]:hover:after:scale-x-100",
        
        // H1 標題 - 優化移動端大小
        "prose-h1:text-3xl sm:prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:font-bold prose-h1:mb-6 sm:prose-h1:mb-10 prose-h1:mt-8 sm:prose-h1:mt-10",
        "prose-h1:relative prose-h1:pb-3 sm:prose-h1:pb-4",
        "prose-h1:after:content-[''] prose-h1:after:absolute prose-h1:after:bottom-0 prose-h1:after:left-0 prose-h1:after:h-[2px] prose-h1:after:w-full prose-h1:after:bg-gradient-to-r prose-h1:after:from-gray-300 prose-h1:after:to-white",
        
        // 圖片優化 - 調整移動端間距
        "prose-img:rounded-2xl sm:prose-img:rounded-3xl prose-img:shadow-lg prose-img:mx-auto prose-img:my-6 sm:prose-img:my-10",
        "prose-img:w-full prose-img:h-auto",
        "[&>img+em]:block [&>img+em]:text-center [&>img+em]:text-sm [&>img+em]:text-gray-500 [&>img+em]:mt-2 [&>img+em]:mb-6 sm:[&>img+em]:mb-8",
        
        // 列表樣式優化
        "prose-ul:my-5 sm:prose-ul:my-8 prose-ul:list-disc prose-ul:pl-5 sm:prose-ul:pl-8",
        "prose-ol:my-5 sm:prose-ol:my-8 prose-ol:list-decimal prose-ol:pl-5 sm:prose-ol:pl-8",
        "prose-li:mb-2 sm:prose-li:mb-3 prose-li:text-gray-700",
        
        // 引用區塊優化 - 改進移動端顯示
        "prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg prose-blockquote:py-2 sm:prose-blockquote:py-3 prose-blockquote:my-6 sm:prose-blockquote:my-10 prose-blockquote:text-gray-600",
        "prose-blockquote:text-[1rem] sm:prose-blockquote:text-[1.125rem] prose-blockquote:leading-relaxed",
        
        // 代碼塊優化
        "prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:my-6 sm:prose-pre:my-10 prose-pre:p-4 sm:prose-pre:p-6 prose-pre:overflow-x-auto",
        "prose-code:text-primary prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
        
        // 表格優化 - 增強移動端可訪問性
        "prose-table:border-collapse prose-table:w-full prose-table:my-6 sm:prose-table:my-10 prose-table:text-sm sm:prose-table:text-base",
        "prose-thead:bg-gray-100 prose-thead:text-left",
        "prose-th:p-2 sm:prose-th:p-4 prose-th:font-semibold prose-th:border-b-2 prose-th:border-gray-200",
        "prose-td:p-2 sm:prose-td:p-4 prose-td:border-b prose-td:border-gray-200",
        
        // 水平線優化
        "prose-hr:my-8 sm:prose-hr:my-14 prose-hr:border-gray-200",
        
        // 超連結樣式優化
        "prose-a:text-primary prose-a:font-medium prose-a:transition-colors prose-a:duration-200 hover:prose-a:text-primary/80 prose-a:no-underline hover:prose-a:underline",
        
        // 行動裝置優化
        "px-1 sm:px-0",
        
        // 行文段落首行縮進
        "[&>p:not(:first-of-type)]:first-line:pl-0 sm:[&>p:not(:first-of-type)]:first-line:pl-4",
        
        // 強化 div 元素顯示
        "[&>div]:block [&>div]:relative [&>div]:w-full [&>div]:my-6 sm:[&>div]:my-8",
        "[&_div_h1],[&_div_h2],[&_div_h3],[&_div_h4],[&_div_h5],[&_div_h6]:block [&_div_h1],[&_div_h2],[&_div_h3],[&_div_h4],[&_div_h5],[&_div_h6]:mb-2",
        "[&_div_p]:block [&_div_p]:mb-2",
        "[&_div_ul],[&_div_ol]:block [&_div_ul],[&_div_ol]:pl-4 sm:[&_div_ul],[&_div_ol]:pl-5 [&_div_ul],[&_div_ol]:my-2",
        "[&_div_li]:block [&_div_li]:my-1",
        "[&_div_a]:inline-block",
        
        // ---------- 基本區塊樣式 - 移動端增強 ----------
        
        // stat-highlight 統計數據區塊 - 根據原始style優化
        "[&_.stat-highlight]:block [&_.stat-highlight]:bg-gray-50 [&_.stat-highlight]:rounded-xl [&_.stat-highlight]:p-6 [&_.stat-highlight]:my-8 [&_.stat-highlight]:border-l-4 [&_.stat-highlight]:border-l-blue-500 [&_.stat-highlight]:shadow-sm",
        "[&_.stat-highlight_h4]:text-blue-800 [&_.stat-highlight_h4]:font-semibold [&_.stat-highlight_h4]:mb-4 [&_.stat-highlight_h4]:block",
        "[&_.stat-highlight_ul]:mt-3 [&_.stat-highlight_ul]:pl-6 [&_.stat-highlight_ul]:block",
        "[&_.stat-highlight_li]:mb-2 [&_.stat-highlight_li]:block",
        
        // response-model 回應範例區塊 - 根據原始style優化
        "[&_.response-model]:block [&_.response-model]:bg-white [&_.response-model]:border [&_.response-model]:border-gray-200 [&_.response-model]:rounded-lg [&_.response-model]:p-5 [&_.response-model]:my-6 [&_.response-model]:shadow-sm [&_.response-model]:italic",
        "[&_.response-model_p]:block [&_.response-model_p]:mb-0",
        
        // action-checklist 檢查清單區塊 - 根據原始style優化
        "[&_.action-checklist]:block [&_.action-checklist]:bg-blue-50 [&_.action-checklist]:p-5 [&_.action-checklist]:rounded-lg [&_.action-checklist]:my-6",
        "[&_.action-checklist_ul]:list-none [&_.action-checklist_ul]:pl-2 [&_.action-checklist_ul]:block",
        "[&_.action-checklist_li]:mb-2 [&_.action-checklist_li]:block",
        
        // case-study 案例研究區塊 - 根據原始style優化
        "[&_.case-study]:block [&_.case-study]:bg-green-50 [&_.case-study]:p-6 [&_.case-study]:rounded-xl [&_.case-study]:my-8 [&_.case-study]:border [&_.case-study]:border-green-100",
        "[&_.case-study_h4]:text-green-800 [&_.case-study_h4]:font-semibold [&_.case-study_h4]:mb-4 [&_.case-study_h4]:block",
        "[&_.case-study_p]:mb-4 [&_.case-study_p]:block",
        "[&_.case-study_ul]:ml-4 [&_.case-study_ul]:block",
        "[&_.case-study_li]:mb-2 [&_.case-study_li]:block",
        
        // pro-tip 專業提示區塊 - 根據原始style優化
        "[&_.pro-tip]:block [&_.pro-tip]:bg-amber-50 [&_.pro-tip]:p-5 [&_.pro-tip]:rounded-lg [&_.pro-tip]:my-6 [&_.pro-tip]:border [&_.pro-tip]:border-amber-100",
        "[&_.pro-tip_h4]:text-amber-800 [&_.pro-tip_h4]:font-semibold [&_.pro-tip_h4]:mb-3 [&_.pro-tip_h4]:block",
        "[&_.pro-tip_p]:block [&_.pro-tip_p]:mb-2",
        
        // action-plan 行動計畫區塊 - 根據原始style優化
        "[&_.action-plan]:block [&_.action-plan]:bg-gray-50 [&_.action-plan]:p-6 [&_.action-plan]:rounded-xl [&_.action-plan]:my-8 [&_.action-plan]:border [&_.action-plan]:border-gray-200",
        "[&_.action-plan_ol]:pl-6 [&_.action-plan_ol]:block",
        "[&_.action-plan_li]:mb-3 [&_.action-plan_li]:block",
        
        // cta-section 號召行動區塊 - 根據原始style優化
        "[&_.cta-section]:block [&_.cta-section]:bg-blue-50 [&_.cta-section]:p-8 [&_.cta-section]:rounded-xl [&_.cta-section]:my-12 [&_.cta-section]:text-center",
        "[&_.cta-section_h3]:text-blue-800 [&_.cta-section_h3]:font-semibold [&_.cta-section_h3]:text-xl [&_.cta-section_h3]:mb-4 [&_.cta-section_h3]:block",
        "[&_.cta-section_p]:block [&_.cta-section_p]:mb-4",
        "[&_.cta-button]:inline-block [&_.cta-button]:bg-blue-600 [&_.cta-button]:text-white [&_.cta-button]:px-8 [&_.cta-button]:py-3 [&_.cta-button]:rounded-lg [&_.cta-button]:font-semibold [&_.cta-button]:mt-4 [&_.cta-button:hover]:bg-blue-700 [&_.cta-button]:no-underline",
        
        // ---------- 新增特殊區塊樣式 ----------
        
        // warning-box 警告提示區塊
        "[&_.warning-box]:block [&_.warning-box]:bg-red-50 [&_.warning-box]:border-l-4 [&_.warning-box]:border-l-red-500 [&_.warning-box]:p-6 [&_.warning-box]:rounded-lg [&_.warning-box]:my-8",
        "[&_.warning-box_h4]:text-red-800 [&_.warning-box_h4]:font-semibold [&_.warning-box_h4]:mb-3 [&_.warning-box_h4]:flex [&_.warning-box_h4]:items-center",
        "[&_.warning-box_h4:before]:content-['⚠️'] [&_.warning-box_h4:before]:mr-2",
        "[&_.warning-box_p]:mb-2 [&_.warning-box_p]:text-red-700",
        
        // info-box 資訊提示區塊
        "[&_.info-box]:block [&_.info-box]:bg-blue-50 [&_.info-box]:border-l-4 [&_.info-box]:border-l-blue-500 [&_.info-box]:p-6 [&_.info-box]:rounded-lg [&_.info-box]:my-8",
        "[&_.info-box_h4]:text-blue-800 [&_.info-box_h4]:font-semibold [&_.info-box_h4]:mb-3 [&_.info-box_h4]:flex [&_.info-box_h4]:items-center",
        "[&_.info-box_h4:before]:content-['ℹ️'] [&_.info-box_h4:before]:mr-2",
        "[&_.info-box_p]:mb-2 [&_.info-box_p]:text-blue-700",
        
        // note-box 注意事項區塊
        "[&_.note-box]:block [&_.note-box]:bg-yellow-50 [&_.note-box]:border [&_.note-box]:border-yellow-200 [&_.note-box]:border-dashed [&_.note-box]:p-5 [&_.note-box]:rounded-lg [&_.note-box]:my-8",
        "[&_.note-box_h4]:text-yellow-800 [&_.note-box_h4]:font-medium [&_.note-box_h4]:mb-3 [&_.note-box_h4]:flex [&_.note-box_h4]:items-center",
        "[&_.note-box_h4:before]:content-['📝'] [&_.note-box_h4:before]:mr-2",
        "[&_.note-box_p]:mb-2 [&_.note-box_p]:text-yellow-800",
        
        // image-gallery 圖片集合區塊
        "[&_.image-gallery]:grid [&_.image-gallery]:grid-cols-1 [&_.image-gallery]:sm:grid-cols-2 [&_.image-gallery]:gap-4 [&_.image-gallery]:my-8",
        "[&_.image-gallery_figure]:m-0 [&_.image-gallery_figure]:relative",
        "[&_.image-gallery_img]:rounded-lg [&_.image-gallery_img]:shadow-md [&_.image-gallery_img]:w-full [&_.image-gallery_img]:h-auto",
        "[&_.image-gallery_figcaption]:text-center [&_.image-gallery_figcaption]:text-sm [&_.image-gallery_figcaption]:text-gray-500 [&_.image-gallery_figcaption]:mt-2",
        
        // expert-quote 專家觀點區塊
        "[&_.expert-quote]:block [&_.expert-quote]:relative [&_.expert-quote]:bg-gray-50 [&_.expert-quote]:p-6 [&_.expert-quote]:pt-10 [&_.expert-quote]:rounded-xl [&_.expert-quote]:my-10 [&_.expert-quote]:shadow-sm",
        "[&_.expert-quote]:before:content-['❝'] [&_.expert-quote]:before:absolute [&_.expert-quote]:before:top-4 [&_.expert-quote]:before:left-4 [&_.expert-quote]:before:text-5xl [&_.expert-quote]:before:text-primary/30 [&_.expert-quote]:before:opacity-50",
        "[&_.expert-quote_blockquote]:border-0 [&_.expert-quote_blockquote]:p-0 [&_.expert-quote_blockquote]:mb-4 [&_.expert-quote_blockquote]:italic [&_.expert-quote_blockquote]:text-gray-700 [&_.expert-quote_blockquote]:relative [&_.expert-quote_blockquote]:z-10",
        "[&_.expert-quote_cite]:block [&_.expert-quote_cite]:text-right [&_.expert-quote_cite]:font-semibold [&_.expert-quote_cite]:text-gray-900 [&_.expert-quote_cite]:not-italic",
        
        // legal-note 法規依據區塊
        "[&_.legal-note]:block [&_.legal-note]:bg-gray-50 [&_.legal-note]:border-l-4 [&_.legal-note]:border-l-gray-500 [&_.legal-note]:p-5 [&_.legal-note]:rounded-lg [&_.legal-note]:my-6",
        "[&_.legal-note_h4]:text-gray-800 [&_.legal-note_h4]:font-semibold [&_.legal-note_h4]:mb-3 [&_.legal-note_h4]:flex [&_.legal-note_h4]:items-center",
        "[&_.legal-note_h4:before]:content-['⚖️'] [&_.legal-note_h4:before]:mr-2",
        "[&_.legal-note_p]:block [&_.legal-note_p]:text-gray-700 [&_.legal-note_p]:mb-2",
        "[&_.legal-note_ul]:list-disc [&_.legal-note_ul]:pl-6 [&_.legal-note_ul]:mt-2 [&_.legal-note_ul]:block",
        "[&_.legal-note_li]:text-gray-700 [&_.legal-note_li]:mb-1 [&_.legal-note_li]:block",
        
        // faq-section FAQ問答區塊
        "[&_.faq-section]:block [&_.faq-section]:bg-white [&_.faq-section]:border [&_.faq-section]:border-gray-200 [&_.faq-section]:rounded-xl [&_.faq-section]:p-0 [&_.faq-section]:my-10 [&_.faq-section]:shadow-sm [&_.faq-section]:overflow-hidden",
        "[&_.faq-section_h3]:bg-primary/10 [&_.faq-section_h3]:text-primary [&_.faq-section_h3]:p-4 [&_.faq-section_h3]:font-bold [&_.faq-section_h3]:text-lg [&_.faq-section_h3]:mb-0 [&_.faq-section_h3]:block",
        
        // faq-item 問答項目區塊
        "[&_.faq-item]:block [&_.faq-item]:border-b [&_.faq-item]:border-gray-200 [&_.faq-item]:p-6 [&_.faq-item]:last:border-b-0",
        "[&_.faq-item_h4]:text-lg [&_.faq-item_h4]:font-semibold [&_.faq-item_h4]:text-primary [&_.faq-item_h4]:mb-3 [&_.faq-item_h4]:block",
        "[&_.faq-item_p]:block [&_.faq-item_p]:text-gray-700 [&_.faq-item_p]:mb-0",
        "[&_.faq-item_ul]:list-disc [&_.faq-item_ul]:pl-6 [&_.faq-item_ul]:mt-2 [&_.faq-item_ul]:block",
        "[&_.faq-item_li]:text-gray-700 [&_.faq-item_li]:mb-1 [&_.faq-item_li]:block",
        
        // product-recommendation 產品推薦區塊
        "[&_.product-recommendation]:block [&_.product-recommendation]:bg-white [&_.product-recommendation]:border [&_.product-recommendation]:border-gray-200 [&_.product-recommendation]:rounded-xl [&_.product-recommendation]:overflow-hidden [&_.product-recommendation]:shadow-md [&_.product-recommendation]:my-10",
        "[&_.product-recommendation_h4]:bg-primary/10 [&_.product-recommendation_h4]:text-primary [&_.product-recommendation_h4]:p-4 [&_.product-recommendation_h4]:m-0 [&_.product-recommendation_h4]:font-bold",
        "[&_.product-recommendation_div]:p-4 [&_.product-recommendation_div]:flex [&_.product-recommendation_div]:flex-col [&_.product-recommendation_div]:sm:flex-row [&_.product-recommendation_div]:gap-4",
        "[&_.product-recommendation_img]:w-full [&_.product-recommendation_img]:sm:w-1/3 [&_.product-recommendation_img]:rounded-lg [&_.product-recommendation_img]:object-cover",
        "[&_.product-recommendation_p]:mb-3 [&_.product-recommendation_p:last-child]:mb-0",
        "[&_.product-recommendation_a]:inline-block [&_.product-recommendation_a]:bg-primary [&_.product-recommendation_a]:text-white [&_.product-recommendation_a]:px-4 [&_.product-recommendation_a]:py-2 [&_.product-recommendation_a]:rounded-lg [&_.product-recommendation_a]:font-medium [&_.product-recommendation_a]:text-center [&_.product-recommendation_a:hover]:bg-primary/90 [&_.product-recommendation_a]:no-underline [&_.product-recommendation_a]:mt-2",
        
        // timeline 時間線區塊
        "[&_.timeline]:block [&_.timeline]:relative [&_.timeline]:pl-8 [&_.timeline]:py-4 [&_.timeline]:my-8 [&_.timeline]:border-l-2 [&_.timeline]:border-l-gray-300",
        "[&_.timeline]:before:content-[''] [&_.timeline]:before:absolute [&_.timeline]:before:left-[-5px] [&_.timeline]:before:top-0 [&_.timeline]:before:w-8 [&_.timeline]:before:h-8 [&_.timeline]:before:border-2 [&_.timeline]:before:border-primary [&_.timeline]:before:rounded-full [&_.timeline]:before:bg-white",
        "[&_.timeline]:after:content-[''] [&_.timeline]:after:absolute [&_.timeline]:after:left-[-5px] [&_.timeline]:after:bottom-0 [&_.timeline]:after:w-8 [&_.timeline]:after:h-8 [&_.timeline]:after:border-2 [&_.timeline]:after:border-primary [&_.timeline]:after:rounded-full [&_.timeline]:after:bg-white",
        "[&_.timeline-item]:relative [&_.timeline-item]:mb-8 [&_.timeline-item:last-child]:mb-0",
        "[&_.timeline-item]:before:content-[''] [&_.timeline-item]:before:absolute [&_.timeline-item]:before:left-[-36px] [&_.timeline-item]:before:top-2 [&_.timeline-item]:before:w-6 [&_.timeline-item]:before:h-6 [&_.timeline-item]:before:bg-primary [&_.timeline-item]:before:rounded-full",
        "[&_.timeline-item_h4]:text-lg [&_.timeline-item_h4]:font-bold [&_.timeline-item_h4]:mb-2 [&_.timeline-item_h4]:text-primary",
        "[&_.timeline-item_p]:mb-0",
        
        // step-guide 步驟指南區塊
        "[&_.step-guide]:flex [&_.step-guide]:my-10 [&_.step-guide]:flex-col [&_.step-guide]:gap-6",
        "[&_.step]:relative [&_.step]:bg-white [&_.step]:rounded-lg [&_.step]:border [&_.step]:border-gray-200 [&_.step]:shadow-md [&_.step]:p-6 [&_.step]:pl-16",
        "[&_.step]:before:content-[attr(data-step)] [&_.step]:before:absolute [&_.step]:before:left-4 [&_.step]:before:top-4 [&_.step]:before:w-8 [&_.step]:before:h-8 [&_.step]:before:bg-primary [&_.step]:before:text-white [&_.step]:before:rounded-full [&_.step]:before:flex [&_.step]:before:items-center [&_.step]:before:justify-center [&_.step]:before:font-bold",
        "[&_.step_h4]:text-lg [&_.step_h4]:font-bold [&_.step_h4]:mb-2 [&_.step_h4]:text-primary",
        "[&_.step_p]:mb-2 [&_.step_p:last-child]:mb-0",
        
        // ---------- 簡化醫療專業區塊基本樣式 ----------
        
        // 通用自定義區塊的基本可見性
        "[&_.expert-credentials]:block [&_.expert-credentials]:visible [&_.expert-credentials]:opacity-100",
        "[&_.problem-analysis]:block [&_.problem-analysis]:visible [&_.problem-analysis]:opacity-100",

        "[&_.service-overview]:block [&_.service-overview]:visible [&_.service-overview]:opacity-100",
        "[&_.service-item]:block [&_.service-item]:visible [&_.service-item]:opacity-100",
        "[&_.service-details]:block [&_.service-details]:visible [&_.service-details]:opacity-100",
        "[&_.research-note]:block [&_.research-note]:visible [&_.research-note]:opacity-100",
        "[&_.results-section]:block [&_.results-section]:visible [&_.results-section]:opacity-100",
        "[&_.results-grid]:block [&_.results-grid]:visible [&_.results-grid]:opacity-100",

        "[&_.advantages-section]:block [&_.advantages-section]:visible [&_.advantages-section]:opacity-100",
        "[&_.advantage-item]:block [&_.advantage-item]:visible [&_.advantage-item]:opacity-100",
        "[&_.data-verification]:block [&_.data-verification]:visible [&_.data-verification]:opacity-100",
        
        className
      )}
      dangerouslySetInnerHTML={{ __html: enhanceHtmlContent(content) }}
    />
  )
}

// 增強 HTML 內容，確保 div 標籤與內容正確顯示
function enhanceHtmlContent(content: string): string {
  // 保持原始HTML結構，不添加內聯樣式，依賴CSS樣式
  return content;
}

export default BlogContent 