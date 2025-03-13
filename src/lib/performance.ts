/**
 * 性能優化相關工具函數
 */

// 延遲執行非關鍵任務
export const deferTask = (task: () => void, delay = 100): void => {
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => task());
    } else {
      setTimeout(task, delay);
    }
  }
};

// 分批處理大量操作，避免阻塞主執行緒
export const batchProcess = <T>(
  items: T[], 
  processItem: (item: T) => void, 
  batchSize = 5, 
  delayBetweenBatches = 16
): void => {
  let index = 0;

  const processBatch = () => {
    const end = Math.min(index + batchSize, items.length);
    for (let i = index; i < end; i++) {
      processItem(items[i]);
    }
    index = end;

    if (index < items.length) {
      setTimeout(processBatch, delayBetweenBatches);
    }
  };

  processBatch();
};

// 圖片預加載
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// 優化字體加載 (動態添加 font-display: swap)
export const optimizeFontLoading = (): void => {
  if (typeof document === 'undefined') return;

  // 檢查現有字體樣式表
  const styleSheets = Array.from(document.styleSheets);
  styleSheets.forEach(sheet => {
    try {
      if (!sheet.href || !sheet.href.includes('fonts')) return;
      const rules = Array.from(sheet.cssRules || []);
      rules.forEach(rule => {
        if (rule instanceof CSSFontFaceRule) {
          const style = rule.style;
          if (!style.fontDisplay) {
            style.fontDisplay = 'swap';
          }
        }
      });
    } catch (e) {
      // 跨域樣式表無法讀取 cssRules
      console.warn('無法讀取樣式表規則', e);
    }
  });
};

// 優化 LCP (最大內容繪製) 元素
export const optimizeLCP = (selector: string): void => {
  if (typeof document === 'undefined') return;

  // 使用 Intersection Observer 檢測 LCP 元素
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // 設置高優先級
        if (el instanceof HTMLImageElement) {
          el.fetchPriority = 'high';
          el.loading = 'eager';
        }
        
        // 添加預連接
        const imgSrc = el instanceof HTMLImageElement ? el.src : null;
        if (imgSrc) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = imgSrc;
          document.head.appendChild(link);
        }
        
        observer.disconnect();
      }
    });
  }, { threshold: 0 });

  // 觀察潛在的 LCP 元素
  document.querySelectorAll(selector).forEach(el => {
    observer.observe(el);
  });
};

// 主執行緒優化：減少長任務執行時間
export const avoidLongTasks = <T>(
  task: () => T, 
  fallback: T
): T => {
  try {
    // 使用 performance.now() 測量任務執行時間
    const start = performance.now();
    const result = task();
    const end = performance.now();
    
    // 如果任務執行時間超過 50ms，記錄警告
    if (end - start > 50) {
      console.warn(`長任務檢測: 任務執行時間為 ${Math.round(end - start)}ms，可能導致頁面不流暢`);
    }
    
    return result;
  } catch (error) {
    console.error('任務執行失敗', error);
    return fallback;
  }
}; 