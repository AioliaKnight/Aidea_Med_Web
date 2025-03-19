import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合併Tailwind CSS類名，處理衝突的類名
 * 使用clsx和tailwind-merge處理多個類名組合
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期為本地字符串
 * @param date 要格式化的日期
 * @param locale 地區設置，默認為zh-TW
 */
export function formatDate(date: Date | string, locale: string = 'zh-TW'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 防抖函數：限制函數在一段時間內只執行一次
 * @param fn 要執行的函數
 * @param delay 延遲時間（毫秒）
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * 節流函數：限制函數在一段時間內最多執行一次
 * @param fn 要執行的函數
 * @param limit 時間限制（毫秒）
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return function(...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastCall >= limit) {
      fn(...args)
      lastCall = now
    }
  }
}

/**
 * 安全地從對象中獲取深層屬性值
 * @param obj 源對象
 * @param path 屬性路徑，例如 'user.profile.name'
 * @param defaultValue 如果路徑不存在時的默認值
 */
export function getNestedValue<T = any>(
  obj: Record<string, any>,
  path: string,
  defaultValue: T | null = null
): T | null {
  const keys = path.split('.')
  let result = obj
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue
    }
    result = result[key]
  }
  
  return (result === undefined ? defaultValue : result) as T
}

/**
 * 將字符串首字母大寫
 * @param str 輸入字符串
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 生成指定範圍內的隨機整數
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 將數組分割成指定大小的塊
 * @param array 要分割的數組
 * @param chunkSize 每個塊的大小
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (!array.length || chunkSize <= 0) return []
  
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  
  return chunks
} 