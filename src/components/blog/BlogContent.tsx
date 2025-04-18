'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BlogContentProps {
  content: string
  className?: string
}

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

  // 確保所有 div 元素和其內容能夠正確顯示
  useEffect(() => {
    if (contentRef.current) {
      // 處理保留原始div結構和類別名稱
      const divElements = contentRef.current.querySelectorAll('div');
      
      Array.from(divElements).forEach((div) => {
        // 確保所有 div 都能正確顯示
        div.style.display = 'block';
        div.style.visibility = 'visible';
        div.style.opacity = '1';
        div.style.minHeight = '20px'; // 添加最小高度確保可見
        
        // 處理特定樣式的 div
        if (div.classList.contains('stat-highlight') || 
            div.classList.contains('response-model') || 
            div.classList.contains('action-checklist') || 
            div.classList.contains('case-study') || 
            div.classList.contains('pro-tip') || 
            div.classList.contains('action-plan') || 
            div.classList.contains('cta-section') ||
            div.classList.contains('warning-box') ||
            div.classList.contains('info-box') ||
            div.classList.contains('note-box') ||
            div.classList.contains('image-gallery') ||
            div.classList.contains('expert-quote') ||
            div.classList.contains('product-recommendation') ||
            div.classList.contains('timeline') ||
            div.classList.contains('step-guide')) {
        
          // 添加額外的類別標記
          div.classList.add('preserve-div');
          div.classList.add('custom-content-block');
          
          // 確保內部元素也能正確顯示
          const children = div.querySelectorAll('*');
          children.forEach((child) => {
            if (child instanceof HTMLElement) {
              child.style.display = '';
              child.style.visibility = 'visible';
              child.style.opacity = '1';
            }
          });
          
          // 確保標題元素能正確顯示
          const headings = div.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headings.forEach((heading) => {
            if (heading instanceof HTMLElement) {
              heading.style.display = 'block';
              heading.style.visibility = 'visible';
              heading.style.marginBottom = '0.5rem';
            }
          });
          
          // 確保段落元素能正確顯示
          const paragraphs = div.querySelectorAll('p');
          paragraphs.forEach((p) => {
            if (p instanceof HTMLElement) {
              p.style.display = 'block';
              p.style.visibility = 'visible';
              p.style.marginBottom = '0.5rem';
            }
          });
          
          // 確保列表元素能正確顯示
          const lists = div.querySelectorAll('ul, ol');
          lists.forEach((list) => {
            if (list instanceof HTMLElement) {
              list.style.display = 'block';
              list.style.visibility = 'visible';
              list.style.marginTop = '0.5rem';
              list.style.paddingLeft = '1.5rem';
            }
          });
        }
      });
    }
  }, [content]);

  return (
    <motion.div
      ref={contentRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        // 基礎文章排版
        "prose prose-lg max-w-none",
        
        // 正文排版優化
        "prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-7 prose-p:text-base md:prose-p:text-lg",
        "prose-p:tracking-wide prose-p:leading-7",
        
        // 設定字體
        "prose-headings:font-heading",
        
        // 標題基本樣式
        "prose-headings:tracking-tight prose-headings:text-gray-900 prose-headings:leading-tight",
        
        // 根據原始style標籤調整標題樣式
        "prose-h2:text-[1.75rem] prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-gray-100",
        "prose-h3:text-[1.5rem] prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4",
        
        // 標題視覺層次增強 - 添加漸變背景與滑鼠懸停效果
        "[&>h2]:relative [&>h2]:inline-block",
        "[&>h2]:after:content-[''] [&>h2]:after:absolute [&>h2]:after:bottom-0 [&>h2]:after:left-0 [&>h2]:after:h-[3px] [&>h2]:after:w-full [&>h2]:after:origin-bottom-right [&>h2]:after:scale-x-0 [&>h2]:after:bg-gradient-to-r [&>h2]:after:from-primary/60 [&>h2]:after:to-primary/30 [&>h2]:after:transition-transform [&>h2]:after:duration-300 [&>h2]:after:ease-out",
        "[&>h2]:hover:after:origin-bottom-left [&>h2]:hover:after:scale-x-100",
        
        // H1 標題 - 大型主要標題
        "prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:font-bold prose-h1:mb-10 prose-h1:mt-10",
        "prose-h1:relative prose-h1:pb-4",
        "prose-h1:after:content-[''] prose-h1:after:absolute prose-h1:after:bottom-0 prose-h1:after:left-0 prose-h1:after:h-[2px] prose-h1:after:w-full prose-h1:after:bg-gradient-to-r prose-h1:after:from-gray-300 prose-h1:after:to-white",
        
        // 圖片優化 - 根據原始style優化
        "prose-img:rounded-3xl prose-img:shadow-lg prose-img:mx-auto prose-img:my-10",
        "prose-img:w-full prose-img:h-auto",
        "[&>img+em]:block [&>img+em]:text-center [&>img+em]:text-sm [&>img+em]:text-gray-500 [&>img+em]:mt-2 [&>img+em]:mb-8",
        
        // 列表樣式優化
        "prose-ul:my-8 prose-ul:list-disc prose-ul:pl-8",
        "prose-ol:my-8 prose-ol:list-decimal prose-ol:pl-8",
        "prose-li:mb-3 prose-li:text-gray-700",
        
        // 引用區塊優化 - 根據原始style優化
        "prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg prose-blockquote:py-3 prose-blockquote:my-10 prose-blockquote:text-gray-600",
        "prose-blockquote:text-[1.125rem] prose-blockquote:leading-7",
        
        // 代碼塊優化
        "prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:my-10 prose-pre:p-6 prose-pre:overflow-x-auto",
        "prose-code:text-primary prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
        
        // 表格優化
        "prose-table:border-collapse prose-table:w-full prose-table:my-10",
        "prose-thead:bg-gray-100 prose-thead:text-left",
        "prose-th:p-4 prose-th:font-semibold prose-th:border-b-2 prose-th:border-gray-200",
        "prose-td:p-4 prose-td:border-b prose-td:border-gray-200",
        
        // 水平線優化
        "prose-hr:my-14 prose-hr:border-gray-200",
        
        // 超連結樣式優化
        "prose-a:text-primary prose-a:font-medium prose-a:transition-colors prose-a:duration-200 hover:prose-a:text-primary/80 prose-a:no-underline hover:prose-a:underline",
        
        // 行動裝置優化
        "px-1 sm:px-0",
        
        // 行文段落首行縮進
        "[&>p:not(:first-of-type)]:first-line:pl-4",
        
        // 強化 div 元素顯示
        "[&>div]:block [&>div]:relative [&>div]:w-full [&>div]:my-8",
        "[&_div_h1],[&_div_h2],[&_div_h3],[&_div_h4],[&_div_h5],[&_div_h6]:block [&_div_h1],[&_div_h2],[&_div_h3],[&_div_h4],[&_div_h5],[&_div_h6]:mb-2",
        "[&_div_p]:block [&_div_p]:mb-2",
        "[&_div_ul],[&_div_ol]:block [&_div_ul],[&_div_ol]:pl-5 [&_div_ul],[&_div_ol]:my-2",
        "[&_div_li]:block [&_div_li]:my-1",
        "[&_div_a]:inline-block",
        
        // ---------- 基本區塊樣式 ----------
        
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
        
        // 傳入的自訂 className
        className
      )}
      dangerouslySetInnerHTML={{ __html: enhanceHtmlContent(content) }}
    />
  )
}

// 增強 HTML 內容，確保 div 標籤與內容正確顯示
function enhanceHtmlContent(content: string): string {
  // 確保每個 div 開始標籤有完整的樣式
  const enhancedContent = content
    // 針對特定類型的 div，增強它們的行內樣式
    .replace(/<div class="([^"]*)">/g, (match, className) => {
      return `<div class="${className}" style="display:block !important; visibility:visible !important; opacity:1 !important; min-height:20px;">`;
    })
    // 為所有其他 div 添加基本樣式
    .replace(/<div([^>]*)>/g, (match, attributes) => {
      if (!match.includes('style=')) {
        return `<div${attributes} style="display:block !important; visibility:visible !important; opacity:1 !important;">`;
      }
      return match;
    });
  
  return enhancedContent;
}

export default BlogContent 