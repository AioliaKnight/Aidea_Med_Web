import React, { useEffect } from 'react';
import { optimizeFontLoading, optimizeLCP, deferTask } from '@/lib/performance';

interface PerformanceProviderProps {
  children: React.ReactNode;
}

/**
 * 性能優化 Provider
 * 
 * 功能：
 * 1. 自動優化字體加載
 * 2. 自動優化 LCP 元素
 * 3. 延遲加載非關鍵資源
 * 4. 優化腳本執行時序
 */
export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  // 只在客戶端執行優化
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 主要內容繪製完成後執行的任務
    const afterPaint = () => {
      // 優化字體加載
      optimizeFontLoading();
      
      // 延遲執行次要任務
      deferTask(() => {
        // 預連接可能需要的域名
        ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(href => {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = href;
          document.head.appendChild(link);
        });
        
        // 移除未使用的事件監聽器
        const cleanup = () => {
          // 實際清理邏輯可根據應用需求調整
        };
        
        cleanup();
      }, 1000);
    };

    // 使用 requestAnimationFrame 確保不阻礙渲染
    requestAnimationFrame(() => {
      // 優化 LCP 元素 - 針對主視覺區域的重要元素
      optimizeLCP('h1, img[fetchpriority="high"]');
      
      // 在下一個空閒時間執行其他優化
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(afterPaint);
      } else {
        setTimeout(afterPaint, 200);
      }
    });

    // 實現漸進式水合 (Progressive Hydration)
    const deferHydration = () => {
      const hydrationElements = document.querySelectorAll('[data-hydrate="defer"]');
      if (hydrationElements.length === 0) return;
      
      // 使用 IntersectionObserver 監測元素可見性
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // 觸發延遲水合
            el.setAttribute('data-hydrate', 'ready');
            observer.unobserve(el);
          }
        });
      }, { rootMargin: '200px' });
      
      hydrationElements.forEach(el => observer.observe(el));
    };
    
    // 在頁面完全加載後執行
    if (document.readyState === 'complete') {
      deferHydration();
    } else {
      window.addEventListener('load', deferHydration, { once: true });
    }
    
    // 監控長任務
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // 任務超過 50ms 記錄警告
          if (entry.duration > 50) {
            console.warn(`檢測到長任務: ${Math.round(entry.duration)}ms`, entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      
      return () => observer.disconnect();
    }
  }, []);

  return <>{children}</>;
};

export default PerformanceProvider; 