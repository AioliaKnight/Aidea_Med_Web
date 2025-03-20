import { Viewport } from 'next'

/**
 * 全域 viewport 設定
 * 包含 PWA 相容性與響應式設計的最佳化配置
 * 
 * 說明：
 * - width: 'device-width' - 使網頁寬度與設備屏幕寬度一致
 * - initialScale: 1 - 設定初始縮放比例為 1
 * - minimumScale/maximumScale - 控制允許的縮放範圍
 * - userScalable - 允許用戶透過手勢縮放頁面
 * - themeColor - 瀏覽器 UI 顏色主題
 * - colorScheme - 偏好的色彩模式
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#ffffff',
  colorScheme: 'light',
  interactiveWidget: 'resizes-visual'
}

/**
 * 不允許縮放的 viewport 設定
 * 適用於特定互動頁面，如全屏遊戲或工具
 * 
 * 主要用途：
 * - 固定特定工具頁面的縮放比例
 * - 防止在操作精細互動元素時意外縮放
 * - 適用於需要精確手指操作的頁面
 */
export const fixedViewport: Viewport = {
  ...viewport,
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
} 