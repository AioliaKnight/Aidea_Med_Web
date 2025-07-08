/**
 * Service Worker 輔助函數
 * 提供離線功能和性能監控
 */

// 註冊 Service Worker
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // 始終檢查更新
      });

      // 監聽更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 有新版本可用
              showUpdateNotification();
            }
          });
        }
      });

      // 檢查是否有活躍的 Service Worker
      if (registration.active) {
        console.log('Service Worker 已註冊並運行');
      }

      // 設定性能監控
      setupPerformanceMonitoring();

    } catch (error) {
      console.error('Service Worker 註冊失敗:', error);
    }
  }
};

// 顯示更新通知
export const showUpdateNotification = (): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Aidea:Med 有新版本', {
      body: '網站已更新，請重新載入頁面以獲得最佳體驗',
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });
  } else {
    // 降級方案：使用簡單的 confirm 對話框
    if (confirm('網站有新版本可用，是否要重新載入頁面？')) {
      window.location.reload();
    }
  }
};

// 檢查網路狀態
export const checkNetworkStatus = (): void => {
  const updateNetworkStatus = () => {
    const status = navigator.onLine ? 'online' : 'offline';
    document.body.setAttribute('data-network-status', status);
    
    // 發送網路狀態事件
    window.dispatchEvent(new CustomEvent('networkStatusChange', {
      detail: { status }
    }));

    if (!navigator.onLine) {
      showOfflineNotification();
    }
  };

  // 初始檢查
  updateNetworkStatus();

  // 監聽網路狀態變化
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
};

// 顯示離線通知
export const showOfflineNotification = (): void => {
  const notification = document.createElement('div');
  notification.className = 'offline-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #e62733;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      text-align: center;
    ">
      🔌 目前處於離線狀態，某些功能可能無法使用
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // 3秒後自動移除通知
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 3000);
};

// 設定性能監控
export const setupPerformanceMonitoring = (): void => {
  // 監控 Web Vitals
  if (typeof window !== 'undefined') {
    import('web-vitals').then((webVitals) => {
      // 收集 Core Web Vitals
      if (webVitals.onCLS) webVitals.onCLS(sendToAnalytics);
      if (webVitals.onFCP) webVitals.onFCP(sendToAnalytics);
      if (webVitals.onLCP) webVitals.onLCP(sendToAnalytics);
      if (webVitals.onTTFB) webVitals.onTTFB(sendToAnalytics);
      if (webVitals.onINP) webVitals.onINP(sendToAnalytics);
    }).catch((error) => {
      console.warn('Web Vitals 載入失敗:', error);
    });
  }

  // 監控記憶體使用
  if (typeof window !== 'undefined' && 'performance' in window && performance.memory) {
    monitorMemoryUsage();
  }

  // 監控長時間任務
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // 長於 50ms 的任務
            console.warn('長時間任務檢測到:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
          }
        });
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('長時間任務監控設定失敗:', error);
    }
  }
};

// 發送分析數據到後端
export const sendToAnalytics = (metric: any): void => {
  try {
    const analyticsData = {
      metric,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: getConnectionInfo()
    };

    // 現在只記錄到控制台，不發送到後端
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance metrics:', analyticsData);
    }
    
    // 可選：發送到第三方分析服務
    // 例如：Google Analytics、Vercel Analytics 等
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        metric_name: metric.name,
        metric_value: metric.value,
        page_path: window.location.pathname
      });
    }
  } catch (error) {
    console.error('性能數據處理失敗:', error);
  }
};

// 獲取網路連接資訊
export const getConnectionInfo = (): any => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false
    };
  }
  return { effectiveType: 'unknown' };
};

// 監控記憶體使用情況
export const monitorMemoryUsage = (): void => {
  const checkMemory = () => {
    if (typeof window !== 'undefined' && 'performance' in window && performance.memory) {
      const memory = performance.memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
      const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
      
      console.log(`記憶體使用量: ${usedMB}MB / ${totalMB}MB`);
      
      if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
        console.warn('記憶體使用量過高！');
      }
    }
  };

  // 每30秒檢查一次記憶體
  setInterval(checkMemory, 30000);
};

// 智能預載入功能
export const setupIntelligentPreloading = (): void => {
  let preloadTimer: NodeJS.Timeout;

  const preloadLink = (href: string) => {
    // 檢查是否已經預載入
    if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  };

  // 為所有內部連結添加 hover 預載入
  document.addEventListener('mouseover', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.hostname === window.location.hostname) {
      clearTimeout(preloadTimer);
      preloadTimer = setTimeout(() => {
        preloadLink(link.href);
      }, 100); // 100ms 延遲避免過度預載入
    }
  });

  // 清除預載入計時器
  document.addEventListener('mouseout', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    
    if (link) {
      clearTimeout(preloadTimer);
    }
  });
};

// 初始化所有 Service Worker 功能
export const initializeServiceWorkerFeatures = (): void => {
  // 註冊 Service Worker
  registerServiceWorker();
  
  // 檢查網路狀態
  checkNetworkStatus();
  
  // 設定智能預載入
  setupIntelligentPreloading();
  
  // 設定性能監控（在 registerServiceWorker 中已包含）
  console.log('Service Worker 功能已初始化');
}; 