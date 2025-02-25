import { Viewport } from 'next'

/**
 * 全域 viewport 設定
 * 包含 PWA 相容性與響應式設計的最佳化配置
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#ffffff',
  colorScheme: 'light dark',
  interactiveWidget: 'resizes-visual'
}

/**
 * 特定頁面的 viewport 設定
 * 例如：不允許縮放的頁面
 */
export const customViewport: Viewport = {
  ...viewport,
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
} 