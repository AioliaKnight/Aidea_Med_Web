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

      // 定期檢查更新 (每 30 分鐘)
      setInterval(() => {
        registration.update();
      }, 30 * 60 * 1000);

    } catch (error) {
      console.error('Service Worker 註冊失敗:', error);
    }
  }
};

// 顯示更新通知
const showUpdateNotification = (): void => {
  // 檢查是否支援通知 API
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('網站更新可用', {
      body: '新版本已準備就緒，重新載入頁面以獲得最佳體驗',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'app-update',
      renotify: false
    });
  } else {
    // 如果不支援通知，使用自定義 UI
    showCustomUpdateBanner();
  }
};

// 自定義更新橫幅
const showCustomUpdateBanner = (): void => {
  const banner = document.createElement('div');
  banner.id = 'update-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #e62733;
      color: white;
      padding: 12px;
      text-align: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    ">
      <span>🚀 新版本可用！</span>
      <button onclick="window.location.reload()" style="
        margin-left: 10px;
        background: white;
        color: #e62733;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
      ">更新</button>
      <button onclick="document.getElementById('update-banner').remove()" style="
        margin-left: 5px;
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
      ">稍後</button>
    </div>
  `;
  document.body.appendChild(banner);

  // 10 秒後自動移除
  setTimeout(() => {
    banner.remove();
  }, 10000);
};

// 監控網路狀態
export const monitorNetworkStatus = (): void => {
  let isOnline = navigator.onLine;

  const updateOnlineStatus = () => {
    const newStatus = navigator.onLine;
    if (newStatus !== isOnline) {
      isOnline = newStatus;
      
      if (isOnline) {
        showNetworkNotification('網路已恢復', '您現在可以正常使用所有功能');
        // 同步離線期間的數據
        syncOfflineData();
      } else {
        showNetworkNotification('網路連線中斷', '您正在離線模式，部分功能可能受限');
      }
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
};

// 網路狀態通知
const showNetworkNotification = (title: string, message: string): void => {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${navigator.onLine ? '#10b981' : '#f59e0b'};
    color: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 10001;
    max-width: 300px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
    <div style="font-size: 14px; opacity: 0.9;">${message}</div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
};

// 同步離線數據
const syncOfflineData = async (): Promise<void> => {
  try {
    // 檢查是否有離線期間收集的表單數據
    const offlineData = localStorage.getItem('offline-form-data');
    if (offlineData) {
      const data = JSON.parse(offlineData);
      
      // 嘗試提交數據
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        localStorage.removeItem('offline-form-data');
        showNetworkNotification('數據同步成功', '離線期間的表單已提交');
      }
    }
  } catch (error) {
    console.error('離線數據同步失敗:', error);
  }
};

// 預緩存關鍵資源
export const precacheResources = async (): Promise<void> => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('critical-resources-v1');
      
      const criticalResources = [
        '/',
        '/service',
        '/contact',
        '/team',
        '/manifest.json',
        '/icons/icon-192x192.png',
        '/images/logo-w.webp'
      ];

      await cache.addAll(criticalResources);
      console.log('關鍵資源預緩存完成');
    } catch (error) {
      console.error('預緩存失敗:', error);
    }
  }
};

// 監控緩存性能
export const monitorCachePerformance = (): void => {
  if ('performance' in window) {
    // 監控資源載入時間
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.transferSize === 0 && entry.decodedBodySize > 0) {
          // 從緩存載入
          console.log(`從緩存載入: ${entry.name} (${Math.round(entry.duration)}ms)`);
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }
};

// Web Vitals 追蹤
export const trackWebVitals = (): void => {
  // FCP (First Contentful Paint)
  const fcpObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log(`FCP: ${Math.round(entry.startTime)}ms`);
        // 可以發送到 Google Analytics
        trackCustomMetric('FCP', Math.round(entry.startTime));
      }
    }
  });

  try {
    fcpObserver.observe({ entryTypes: ['paint'] });
  } catch (error) {
    console.warn('Performance Observer 不支援 paint 類型');
  }

  // LCP (Largest Contentful Paint)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log(`LCP: ${Math.round(lastEntry.startTime)}ms`);
    trackCustomMetric('LCP', Math.round(lastEntry.startTime));
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (error) {
    console.warn('Performance Observer 不支援 largest-contentful-paint 類型');
  }
};

// 發送自定義指標
const trackCustomMetric = (metricName: string, value: number): void => {
  // 整合 Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metricName, {
      custom_parameter_1: value,
      event_category: 'Performance',
      event_label: metricName
    });
  }

  // 或發送到其他分析服務
  console.log(`📊 ${metricName}: ${value}ms`);
};

// 智能預載入
export const intelligentPreload = (): void => {
  // 監聽滑鼠懸停事件，預載入可能訪問的頁面
  const links = document.querySelectorAll('a[href^="/"]');
  
  links.forEach(link => {
    link.addEventListener('mouseenter', (event) => {
      const href = (event.target as HTMLAnchorElement).href;
      
      // 避免重複預載入
      if (!href || preloadedUrls.has(href)) return;
      
      // 只預載入內部連結
      if (href.startsWith(window.location.origin)) {
        preloadPage(href);
        preloadedUrls.add(href);
      }
    });
  });
};

const preloadedUrls = new Set<string>();

const preloadPage = async (url: string): Promise<void> => {
  try {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  } catch (error) {
    console.warn('頁面預載入失敗:', error);
  }
};

// 初始化所有功能
export const initializeServiceWorkerFeatures = (): void => {
  if (typeof window !== 'undefined') {
    registerServiceWorker();
    monitorNetworkStatus();
    precacheResources();
    monitorCachePerformance();
    trackWebVitals();
    
    // 頁面載入完成後啟用智能預載入
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', intelligentPreload);
    } else {
      intelligentPreload();
    }
  }
}; 