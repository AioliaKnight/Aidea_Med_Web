import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 根據背景顏色自動選擇LOGO變體
export function getLogoVariant(bgColor: string): 'black' | 'white' | 'red' {
  // 這裡可以根據實際需求調整判斷邏輯
  if (bgColor.includes('bg-white') || bgColor.includes('bg-gray-50')) {
    return 'black'
  }
  if (bgColor.includes('bg-black') || bgColor.includes('bg-gray-900')) {
    return 'white'
  }
  return 'red'
} 