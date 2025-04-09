# Aidea:Med UI 元件庫

這個目錄包含了Aidea:Med網站使用的統一UI元件，提供一致的設計風格和優化的使用體驗。

## 使用方式

從UI元件庫中導入所需元件：

```tsx
import { Button, Input, Card, CardTitle, CardContent } from '@/components/ui';
```

## 元件列表

### Button

統一的按鈕元件，支援多種樣式變體和狀態。

```tsx
<Button 
  variant="primary" // 變體：primary, secondary, white, black, outline-white, outline-red, outline-black, flat-primary, flat-white, flat-black
  size="md" // 尺寸：sm, md, lg, xl
  isLoading={false} // 載入狀態
  loadingText="處理中..." // 載入時的文字
  icon={<Icon />} // 圖標元素
  iconPosition="left" // 圖標位置：left, right
  fullWidth={false} // 是否全寬
  animation="basic" // 動畫效果：basic, flat, none
  href="/some-link" // 如果提供href，則渲染為<a>標籤
  disabled={false} // 禁用狀態
  className="custom-class" // 自定義類
>
  按鈕文字
</Button>
```

### Input

統一的輸入框元件，支援標籤、錯誤提示和輔助文字。

```tsx
<Input
  label="用戶名" // 輸入框標籤
  error="此欄位為必填" // 錯誤訊息
  icon={<Icon />} // 圖標元素
  iconPosition="left" // 圖標位置：left, right
  helperText="請輸入您的用戶名" // 輔助文字
  animate={false} // 是否使用動畫效果
  containerClassName="custom-container" // 容器類名
  labelClassName="custom-label" // 標籤類名
  inputClassName="custom-input" // 輸入框類名
  errorClassName="custom-error" // 錯誤訊息類名
  helperClassName="custom-helper" // 輔助文字類名
  // 支援所有HTML input屬性
  type="text" 
  placeholder="請輸入" 
  disabled={false}
  required
  // ...其他HTML input屬性
/>
```

### Card 系列元件

卡片元件提供一致的容器樣式，支援多種變體和效果。

```tsx
<Card
  variant="default" // 變體：default, flat, modern, accent, primary, dark, stat, stat-primary, stat-dark, stat-light
  hoverEffect="lift" // 懸停效果：lift, border, shadow, none
  isClickable={false} // 可點擊狀態
  animate={false} // 是否使用動畫效果
  as="article" // 渲染的HTML元素
  className="custom-card" // 自定義類
>
  <CardTitle as="h3" className="custom-title">
    卡片標題
  </CardTitle>
  
  <CardContent className="custom-content">
    卡片內容
  </CardContent>
  
  <CardFooter className="custom-footer">
    卡片頁腳
  </CardFooter>
</Card>
```

#### 特殊用例 - 統計卡片

用於展示數據統計的特殊卡片組件：

```tsx
<Card variant="stat-primary">
  <CardStat
    value="85%" 
    label="轉換率提升"
    trend="up" // 趨勢：up, down, neutral
    trendValue="15%" // 趨勢值
  />
</Card>
```

## 整合現有代碼

為了與現有代碼整合，我們應該逐步替換現有的重複UI實現，改用統一元件，以減少代碼重複並確保設計一致性。

### 整合示例

改造前：
```tsx
<button
  className="bg-primary text-white px-6 py-3 hover:bg-primary-dark transition-colors"
  disabled={isLoading}
>
  {isLoading ? '提交中...' : '發送'}
</button>
```

改造後：
```tsx
<Button
  variant="primary"
  size="lg"
  isLoading={isLoading}
  loadingText="提交中..."
>
  發送
</Button>
```

## 貢獻與擴展

新增元件時，請遵循以下原則：
1. 使用TypeScript類型定義
2. 支援className屬性用於自定義樣式
3. 使用forwardRef支援引用傳遞
4. 提供合理的默認值
5. 元件命名與導出方式保持一致
6. 更新index.ts文件導出新元件 