# 網站效能優化腳本

這個目錄包含用於優化網站效能的各種腳本，特別是針對大型字體檔案和圖片。

## 主要優化問題

根據效能分析，網站存在以下主要問題：

1. **極高的 LCP 時間 (127,200 毫秒)**：主要由轉譯延遲造成
2. **大型字體檔案**：中文字體檔案 (GenYoGothicTW) 每個超過 6MB
3. **圖片尺寸可優化**：部分圖片可以減少 17KB+
4. **總體網路資源過大**：總酬載超過 25MB

## 優化腳本

### 1. 字體格式轉換 (convert-fonts.js)

將 TTF 字體轉換為更高效的 WOFF2 格式，可減少 70-80% 的檔案大小。

```bash
# 安裝依賴
npm install ttf2woff2

# 執行轉換
node scripts/convert-fonts.js
```

### 2. 字體子集化 (subset-fonts.py)

進一步優化中文字體，只保留網站實際使用的字符。

```bash
# 安裝依賴
pip install fonttools brotli

# 執行子集化
python scripts/subset-fonts.py
```

這個腳本需要先執行 `convert-fonts.js` 來生成 WOFF2 檔案。

## 網站設定更新

完成字體優化後，您需要：

1. **更新 fonts.css**：使用新生成的 WOFF2 和子集化字體
   ```css
   @font-face {
     font-family: 'GenYoGothicTW';
     font-style: normal;
     font-weight: 400;
     font-display: swap;
     src: local('GenYoGothicTW-Regular'), 
          url('/fonts/GenYoGothicTW-Regular-subset.woff2') format('woff2');
     unicode-range: U+4E00-U+9FFF, U+3000-U+303F;
   }
   ```

2. **更新 next.config.js**：已更新圖片設定和性能優化選項

## 預期效果

完成這些優化後，您應該會看到：

- **大幅減少網頁載入時間**：LCP 應從 2 分鐘以上降至 2-3 秒
- **節省頻寬**：網路酬載從 25MB 減少到約 3-5MB
- **提高響應速度**：更快的互動和導航體驗

## 注意事項

- 子集化字體可能不包含所有中文字符，如果您的網站內容經常變化，您可能需要周期性地更新字體子集
- 更新字體後，請測試所有頁面以確保顯示正常
- 這些優化主要針對初始載入速度，不影響 JavaScript 渲染邏輯 