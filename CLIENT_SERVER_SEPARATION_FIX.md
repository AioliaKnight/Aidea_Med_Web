# 客戶端-服務器端分離修復報告

## 問題描述

出現錯誤：
```
Error: Attempted to call generateArticleStructuredData() from the server but generateArticleStructuredData is on the client.
```

**原因**：SEOOptimizer 組件被標記為 `'use client'`，但其中的 SEO 輔助函數 (`generateArticleStructuredData`, `generateServiceStructuredData`, `generateFAQStructuredData`) 需要在服務器端使用以生成靜態 metadata。

## 解決方案

### 1. 建立服務器端 SEO 工具函數庫

**新增檔案：`src/lib/seo-utils.ts`**
- 將所有 SEO 輔助函數從客戶端組件中分離
- 建立純函數，可在服務器端安全使用
- 提供完整的結構化數據生成功能

```typescript
// 主要函數
export function generateArticleStructuredData(article: {...})
export function generateServiceStructuredData(service: {...})
export function generateFAQStructuredData(faqs: Array<{...}>)
export function generateBreadcrumbData(pathname: string)
```

### 2. 更新客戶端 SEO 組件

**修改檔案：`src/components/common/SEOOptimizer.tsx`**
- 移除重複的輔助函數
- 保留純客戶端功能（動態 DOM 操作）
- 添加引導註釋說明函數新位置

### 3. 更新組件導出配置

**修改檔案：`src/components/common/index.ts`**
- 移除不再存在的函數導出
- 添加使用說明註釋

### 4. 更新頁面引用

**修改檔案：**
- `src/app/blog/[slug]/page.tsx`
- `src/app/service/medical-ad-compliance/page.tsx`

**更新引用方式：**
```typescript
// 之前
import { SEOOptimizer, generateArticleStructuredData } from '@/components/common'

// 現在
import { SEOOptimizer } from '@/components/common'
import { generateArticleStructuredData } from '@/lib/seo-utils'
```

## 技術改進

### ✅ 解決的問題
1. **客戶端-服務器端混用錯誤**：SEO 函數現在可以安全地在服務器端使用
2. **代碼重複**：消除了客戶端和服務器端的重複函數
3. **架構清晰性**：明確分離客戶端組件和服務器端工具函數

### ✅ 優化效果
1. **性能提升**：SEO 結構化數據在構建時生成，無需客戶端運行時處理
2. **SEO 增強**：確保搜尋引擎可以正確讀取靜態生成的結構化數據
3. **維護性**：清晰的代碼組織和責任分離

### ✅ 保持的功能
1. **動態 SEO 管理**：SEOOptimizer 組件仍可動態更新頁面 meta 資訊
2. **結構化數據**：完整保留所有 Schema.org 標記功能
3. **醫療內容優化**：保持 EEAT 優化和醫療專業性標記

## 使用指南

### 服務器端使用
```typescript
import { generateArticleStructuredData } from '@/lib/seo-utils'

export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug)
  const structuredData = generateArticleStructuredData({
    title: article.title,
    description: article.description,
    // ... 其他參數
  })
  
  return {
    // ... metadata 配置
    other: {
      'structured-data': JSON.stringify(structuredData)
    }
  }
}
```

### 客戶端使用
```typescript
import { SEOOptimizer } from '@/components/common'

export default function Page() {
  return (
    <>
      <SEOOptimizer
        title="頁面標題"
        description="頁面描述"
        canonicalUrl="https://example.com/page"
      />
      {/* 頁面內容 */}
    </>
  )
}
```

## 驗證結果

- ✅ 錯誤已解決
- ✅ 服務器端可正常生成結構化數據
- ✅ 客戶端 SEO 組件功能正常
- ✅ 架構清晰且易於維護

修復日期：2024年12月19日 