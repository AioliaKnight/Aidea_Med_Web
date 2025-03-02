# 圖片處理工具命令列介面 (CLI)

圖片處理工具提供了多種命令和選項，以便靈活地處理各種圖片處理需求。

## 基本語法

```bash
image-tools <命令> [選項] [檔案/目錄]
```

## 可用命令

以下是所有可用的命令及其功能說明：

### `convert`

將圖片轉換為不同尺寸和/或格式。

```bash
image-tools convert [選項] <圖片檔案>
```

選項：
- `--profile=<配置名>`: 使用特定的配置設定檔 (例如: caseStudy, hero, thumbnail)
- `--sizes=<尺寸列表>`: 指定要生成的尺寸 (例如: sm,md,lg)
- `--quality=<數值>`: 指定圖片品質 (1-100)
- `--force`: 強制覆寫已存在的檔案
- `--out=<目錄>`: 指定輸出目錄
- `--formats=<格式列表>`: 指定輸出格式 (例如: jpg,png,webp)
- `--smart`: 啟用智能模式 (根據檔案名稱選擇配置)
- `--no-smart`: 關閉智能模式

### `webp`

將圖片轉換為 WebP 格式。

```bash
image-tools webp [選項] <圖片檔案>
```

選項：
- `--quality=<數值>`: 指定 WebP 品質 (1-100)
- `--out=<目錄>`: 指定輸出目錄
- `--force`: 強制覆寫已存在的檔案

### `favicon`

從源圖片生成 favicon 和相關 touch icon。

```bash
image-tools favicon [選項] <源圖片>
```

選項：
- `--out=<目錄>`: 指定輸出目錄
- `--force`: 強制覆寫已存在的檔案
- `--ico`: 包含 .ico 格式
- `--no-ico`: 排除 .ico 格式

### `icons`

從源圖片生成 PWA 圖標。

```bash
image-tools icons [選項] <源圖片>
```

選項：
- `--out=<目錄>`: 指定輸出目錄
- `--force`: 強制覆寫已存在的檔案
- `--maskable`: 生成 maskable 圖標
- `--no-maskable`: 不生成 maskable 圖標

### `batch`

批量處理目錄中的圖片。

```bash
image-tools batch [選項]
```

選項：
- `--dir=<目錄>`: 指定來源目錄
- `--out=<目錄>`: 指定輸出目錄
- `--recursive`: 處理子目錄中的圖片
- `--no-recursive`: 不處理子目錄
- `--profile=<配置名>`: 使用特定的配置設定檔
- `--smart`: 啟用智能模式
- `--no-smart`: 關閉智能模式
- `--force`: 強制覆寫已存在的檔案
- `--formats=<格式列表>`: 指定要處理的圖片格式 (例如: jpg,png,gif)
- `--exclude=<格式列表>`: 指定要排除的圖片格式

### `list-profiles`

列出所有可用的圖片處理配置設定檔。

```bash
image-tools list-profiles
```

## 全域選項

以下選項適用於所有命令：

- `--help`: 顯示幫助訊息
- `--version`: 顯示版本資訊
- `--verbose`: 顯示詳細執行資訊
- `--quiet`: 只顯示錯誤訊息
- `--log=<檔案路徑>`: 將日誌寫入檔案

## 選項詳解

### 輸出品質控制

`--quality=<數值>` 選項讓你可以控制圖片的壓縮程度：

- 較高的值 (90-100) 產生高品質圖片，但檔案較大
- 中等值 (70-85) 在品質和大小之間取得平衡
- 較低的值 (50-65) 產生較小的檔案，但品質較低

```bash
# 高品質 WebP 轉換
image-tools webp --quality=90 image.jpg

# 平衡品質與大小
image-tools convert --quality=80 photo.png

# 最大壓縮
image-tools batch --dir=./images --quality=60
```

### 尺寸設定

`--sizes=<尺寸列表>` 選項讓你可以指定要生成的圖片尺寸：

```bash
# 只生成小型和中型尺寸
image-tools convert --sizes=sm,md hero.jpg

# 生成特定配置中的所有尺寸
image-tools convert --profile=product --sizes=all product.jpg
```

每個配置設定檔中定義的尺寸可能不同，通常包括：

- `xs`: 超小型 (例如 240px 寬)
- `sm`: 小型 (例如 480px 寬)
- `md`: 中型 (例如 768px 寬)
- `lg`: 大型 (例如 1024px 寬)
- `xl`: 超大型 (例如 1280px 寬)
- `xxl`: 特大型 (例如 1920px 寬)

### 智能模式

智能模式可以根據檔案名稱自動選擇適合的配置設定檔：

```bash
# 啟用智能模式
image-tools batch --dir=./images --smart

# 關閉智能模式並指定特定配置
image-tools batch --dir=./images --no-smart --profile=thumbnail
```

檔案名稱模式與配置的對應：

- 包含 `hero`、`banner`、`cover` 的檔案 → `hero` 配置
- 包含 `caseStudy`、`case-study`、`case_study` 的檔案 → `caseStudy` 配置
- 包含 `team`、`profile`、`avatar` 的檔案 → `teamMember` 配置
- 包含 `product`、`item` 的檔案 → `product` 配置
- 包含 `thumb`、`thumbnail` 的檔案 → `thumbnail` 配置
- 包含 `blog`、`article` 的檔案 → `blogImage` 配置

### 檔案格式控制

`--formats=<格式列表>` 選項讓你可以控制要生成的圖片格式：

```bash
# 同時生成 JPG 和 WebP 格式
image-tools convert --formats=jpg,webp photo.png

# 只生成 WebP 格式
image-tools batch --dir=./images --formats=webp
```

支援的格式包括：`jpg`、`jpeg`、`png`、`webp`、`avif`

### 輸出目錄控制

`--out=<目錄>` 選項讓你可以指定處理後的圖片存放位置：

```bash
# 將輸出存放在特定目錄
image-tools convert --out=./public/images photo.jpg

# 批量處理並輸出到特定目錄
image-tools batch --dir=./raw-images --out=./optimized-images
```

如果不指定輸出目錄，處理後的檔案將存放在原始檔案所在的目錄中。

## 使用範例

### 基本範例

```bash
# 轉換單一圖片
image-tools convert photo.jpg

# 將圖片轉換為 WebP
image-tools webp photo.jpg

# 生成 favicon
image-tools favicon logo.png

# 生成 PWA 圖標
image-tools icons logo.png

# 批量處理目錄
image-tools batch --dir=./images
```

### 進階範例

```bash
# 使用特定配置，指定尺寸和品質
image-tools convert --profile=hero --sizes=md,lg --quality=85 hero-banner.jpg

# 批量處理遞迴目錄，使用智能模式，並指定輸出格式
image-tools batch --dir=./assets --recursive --smart --formats=webp,jpg --out=./public/images

# 生成 favicon 並指定輸出目錄
image-tools favicon --out=./public logo.png --force

# 使用智能模式處理特定目錄，但排除某些格式
image-tools batch --dir=./uploads --smart --exclude=gif,svg --out=./processed
```

## 錯誤處理

工具會在遇到問題時輸出明確的錯誤訊息：

```
錯誤: 找不到檔案 'missing-image.jpg'
錯誤: 無法建立目錄 './output'
錯誤: 轉換失敗: 不支援的圖片格式 '.bmp'
```

大多數錯誤訊息都會包含解決建議：

```
錯誤: 轉換失敗: 不支援的圖片格式 '.bmp'
建議: 請使用 jpg, png, webp, svg 或 gif 格式的圖片
```

## 環境變數

工具支援以下環境變數：

- `IMAGE_TOOLS_OUT_DIR`: 默認輸出目錄
- `IMAGE_TOOLS_QUALITY`: 默認圖片品質
- `IMAGE_TOOLS_DEFAULT_PROFILE`: 默認配置設定檔
- `IMAGE_TOOLS_VERBOSE`: 啟用詳細輸出 (設為 1)

範例：

```bash
# 設定環境變數
export IMAGE_TOOLS_OUT_DIR=./public/images
export IMAGE_TOOLS_QUALITY=85

# 使用環境變數設定
image-tools convert photo.jpg
# 相當於
image-tools convert --out=./public/images --quality=85 photo.jpg
```

## 退出代碼

工具使用以下退出代碼：

- `0`: 成功
- `1`: 一般錯誤
- `2`: 命令行參數錯誤
- `3`: 檔案讀寫錯誤
- `4`: 圖片處理錯誤 