// 主要品牌色系
export const colors = {
  primary: '#DC2626', // 主要色調：優雅紅
  primaryDark: '#B91C1C', // 深紅色
  secondary: '#111827', // 次要色調：深邃黑
  light: '#FFFFFF', // 白色
  gray: '#F8FAFC', // 淺灰色背景
  grayDark: '#E5E7EB', // 深灰色
  textDark: '#1F2937', // 深色文字
  textLight: '#4B5563', // 淺色文字
  accent: '#FEF2F2', // 強調色（淺紅）
} as const;

// 確保顏色對比度符合 WCAG 標準
export const contrastColors = {
  onPrimary: colors.light, // 在主色上的文字顏色
  onSecondary: colors.light, // 在次要色上的文字顏色
  onLight: colors.textDark, // 在淺色背景上的文字顏色
  onDark: colors.light, // 在深色背景上的文字顏色
} as const; 