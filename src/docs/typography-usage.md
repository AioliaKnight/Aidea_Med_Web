# 字體使用指南

本文件提供關於專案中字體的使用指南，幫助開發人員正確且一致地使用字體。

## 字體設定

專案使用以下字體：

1. **GenYoGothicTW（台灣圓體）**
   - 用於中文內容
   - 支援多種字重：Light (300)、Regular (400)、Medium (500)、Bold (700)、Heavy (900)

2. **Century Gothic**
   - 用於英文內容
   - 支援標準字重：Regular (400)、Bold (700)，以及對應的斜體版本

3. **Bageo**
   - 特殊風格字體
   - 用於特殊標題或強調元素

## Tailwind 類別

專案在 tailwind.config.js 中定義了以下字體類別：

- `font-sans`：默認字體，結合 Century Gothic（英文）和 GenYoGothicTW（中文）
- `font-gothic`：僅使用 Century Gothic，適用於純英文內容
- `font-tw`：僅使用 GenYoGothicTW，適用於純中文內容
- `font-display`：使用 Bageo 作為第一選擇，適用於標題和特殊文字

## 使用建議

### 標題元素

```jsx
// 大標題（使用 Display 字體）
<h1 className="font-display text-4xl font-bold">專業服務項目</h1>

// 次級標題
<h2 className="font-display text-3xl font-bold">核心服務</h2>

// 小標題
<h3 className="font-display text-xl font-bold">常見問題</h3>
```

### 內文元素

```jsx
// 一般段落（中文優先）
<p className="font-tw text-base">我們提供全方位的牙醫診所行銷解決方案</p>

// 中英混合內容（使用預設 sans 字體）
<p className="text-base">我們的 Marketing 策略能提升您的競爭力</p>

// 純英文內容
<p className="font-gothic text-base">Digital Marketing Solutions</p>
```

### 按鈕和導航

```jsx
// 主要按鈕
<button className="font-gothic font-medium">開始使用</button>

// 導航項目
<nav className="font-gothic">...</nav>
```

## 字重指南

- `font-light` (300)：用於輔助性文字或小型文字
- `font-normal` (400)：用於一般內文
- `font-medium` (500)：用於次要強調和按鈕
- `font-bold` (700)：用於標題和重要強調
- `font-black` (900)：用於極度強調的元素，謹慎使用

## 響應式建議

針對不同螢幕尺寸，建議調整字體大小：

```jsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-display">響應式標題</h1>
<p className="text-sm md:text-base lg:text-lg">響應式段落</p>
```

## 最佳實踐

1. 保持字體一致性，避免在同一頁面中使用過多字體變化
2. 使用語義化的字重，確保層次分明
3. 確保適當的對比度，提高可讀性
4. 中文字體使用台灣圓體，保持視覺一致性
5. 標題優先使用 Display 字體，增強品牌識別 