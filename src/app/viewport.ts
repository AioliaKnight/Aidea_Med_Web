import { Viewport } from 'next'

/**
 * 全域 viewport 設定
 * 包含 PWA 相容性與響應式設計的最佳化配置
 * 
 * 配置詳解：
 * - width: 'device-width' - 使網頁寬度與設備屏幕寬度一致，確保響應式設計
 * - initialScale: 1 - 設定初始縮放比例為 1，內容不會預先縮放
 * - minimumScale: 1 - 限制最小縮放比例，防止內容過小難以閱讀
 * - maximumScale: 5 - 允許放大到原始大小的5倍，增強可訪問性
 * - userScalable: true - 允許用戶透過手勢縮放頁面，提升可訪問性體驗
 * - viewportFit: 'cover' - 確保內容填滿整個螢幕，適用於全屏瀏覽和PWA
 * - themeColor - 瀏覽器UI顏色主題，使用CSS變數從主題系統動態獲取
 * - colorScheme - 指示頁面支援的顏色方案
 * - interactiveWidget - 控制互動式小工具的行為方式
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'var(--color-primary)' },
    { media: '(prefers-color-scheme: dark)', color: 'var(--color-primary-dark, #191919)' }
  ],
  colorScheme: 'light dark',
  interactiveWidget: 'resizes-visual'
}

/**
 * 針對移動裝置優化的 viewport 設定
 * 特別調整了縮放相關參數，確保在各種尺寸的移動設備上有良好體驗
 * 
 * 適用場景：
 * - 需要精確控制移動端顯示效果的頁面
 * - 具有高密度交互元素的頁面
 * - 需要確保一致閱讀體驗的內容頁面
 */
export const mobileOptimizedViewport: Viewport = {
  ...viewport,
  initialScale: 1,
  minimumScale: 0.8, // 允許略微縮小以查看更多內容
  maximumScale: 3,   // 限制最大縮放以防止過度放大導致排版混亂
  userScalable: true,
  viewportFit: 'cover'
}

/**
 * 不允許縮放的 viewport 設定
 * 適用於特定互動頁面，如全屏遊戲或工具
 * 
 * 主要用途：
 * - 固定特定工具頁面的縮放比例
 * - 防止在操作精細互動元素時意外縮放
 * - 適用於需要精確手指操作的頁面
 * 
 * 注意：使用此設定會影響可訪問性，僅應用於特定工具型頁面
 */
export const fixedViewport: Viewport = {
  ...viewport,
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

/**
 * PWA全屏模式優化的 viewport 設定
 * 針對以應用形式安裝到主屏的PWA體驗進行優化
 * 
 * 特點：
 * - 全屏顯示，最大化利用設備屏幕空間
 * - 針對PWA特定的交互模式進行調整
 * - 添加了安全區域適配，適合異形屏幕設備
 */
export const pwaViewport: Viewport = {
  ...viewport,
  viewportFit: 'cover', // 確保內容填滿整個屏幕
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'var(--color-primary)' },
    { media: '(prefers-color-scheme: dark)', color: 'var(--color-primary-dark, #191919)' }
  ],
  colorScheme: 'light dark' // 同時支援淺色和深色模式
}

/**
 * 深色模式優化的 viewport 設定
 * 當用戶設定為深色模式時提供更舒適的瀏覽體驗
 */
export const darkModeViewport: Viewport = {
  ...viewport,
  themeColor: 'var(--color-primary-dark, #191919)',
  colorScheme: 'dark'
}

/**
 * 適用於摺疊螢幕設備的 viewport 設定
 * 針對 Galaxy Fold、Surface Duo 等折疊螢幕設備優化
 * 
 * 特點：
 * - 適應螢幕折疊狀態變化
 * - 優化雙屏顯示模式
 * - 保持內容在折疊處的連續性
 */
export const foldableViewport: Viewport = {
  ...viewport,
  viewportFit: 'cover',
  interactiveWidget: 'overlays-content', // 折疊螢幕上互動元素更適合覆蓋模式
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'var(--color-primary)' },
    { media: '(prefers-color-scheme: dark)', color: 'var(--color-primary-dark, #191919)' }
  ]
}

/**
 * 大螢幕設備優化的 viewport 設定
 * 適用於平板、桌面和大型觸控螢幕
 * 
 * 特點：
 * - 利用更大的螢幕空間展示更多內容
 * - 保持互動元素的可訪問性
 * - 優化多窗口和分屏模式
 */
export const largeScreenViewport: Viewport = {
  ...viewport,
  initialScale: 1,
  minimumScale: 0.6, // 允許更大範圍的縮小以查看全局佈局
  maximumScale: 2,   // 限制最大縮放以維持佈局完整性
  userScalable: true,
  interactiveWidget: 'resizes-content' // 在大螢幕上調整交互內容大小
} 