// 主要品牌色系
export const colors = {
  primary: '#E61E25', // 品牌紅色
  primaryDark: '#CC1A20', // 深紅色
  secondary: '#1A1A1A', // 深黑色
  light: '#FFFFFF', // 白色
  gray: '#F5F5F5', // 淺灰色背景
  grayDark: '#E0E0E0', // 深灰色
  textDark: '#2A2A2A', // 深色文字
  textLight: '#666666', // 淺色文字
  accent: '#FFD700', // 強調色（金色）
} as const;

// 確保顏色對比度符合 WCAG 標準
export const contrastColors = {
  onPrimary: colors.light, // 在主色上的文字顏色
  onSecondary: colors.light, // 在次要色上的文字顏色
  onLight: colors.textDark, // 在淺色背景上的文字顏色
  onDark: colors.light, // 在深色背景上的文字顏色
} as const; 