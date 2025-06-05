import { BlogMobileTableOfContents } from '@/components/blog'

const testContent = `
# 第一個標題

這是第一個段落的內容。

## 第二個標題

這是第二個段落的內容。

### 第三個標題

這是第三個段落的內容。

## 另一個第二級標題

更多內容。

### 另一個第三級標題

更多內容。

#### 第四級標題

第四級標題的內容。

## 最後一個標題

最後的內容。
`

export default function TestMobileTocPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">移動端目錄組件測試</h1>
        
        <article className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: testContent.replace(/\n/g, '<br>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^#### (.+)$/gm, '<h4>$1</h4>') }} />
        </article>
        
        {/* 移動端目錄組件 */}
        <BlogMobileTableOfContents content={testContent} />
      </div>
    </div>
  )
} 