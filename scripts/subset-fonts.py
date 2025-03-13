#!/usr/bin/env python3
"""
字體子集化腳本

這個腳本會分析網站內容，提取常用字符，然後僅保留這些字符來建立字體子集
這可以將中文字體從 6MB+ 減少到 1MB 以下

使用方法:
1. 安裝依賴: pip install fonttools brotli
2. 執行: python scripts/subset-fonts.py

注意: 這個腳本假設您已經執行了 convert-fonts.js 來生成 woff2 檔案
"""

import os
import sys
import subprocess
from pathlib import Path

# 檢查依賴
try:
    from fontTools.subset import main as subset
    from fontTools.ttLib import TTFont
except ImportError:
    print("錯誤：缺少必要的依賴。")
    print("請執行：pip install fonttools brotli")
    sys.exit(1)

# 專案根目錄
ROOT_DIR = Path(__file__).resolve().parent.parent
FONTS_DIR = ROOT_DIR / "public" / "fonts"

# 網站中常用的中文字符範圍
# 這些範圍涵蓋常見漢字、標點符號和特殊符號
COMMON_CHINESE_RANGES = [
    "U+4E00-U+9FFF",  # 常用漢字
    "U+3000-U+303F",  # 中日韓標點符號
    "U+2000-U+206F",  # 通用標點符號
    "U+FF00-U+FFEF",  # 全形字符
    "U+2500-U+257F",  # 製表符
]

# 常用中文字符集 (只保留網站中實際使用的字符)
# 您可以從網站內容中提取常用字符
COMMON_HANZI = """
醫療牙醫診所行銷網站設計品牌專業服務客戶推廣數位成長方案團隊
合作分析策略內容技術效益價值優勢經驗實績傳統社群媒體搜尋引擎
最佳化廣告投放追蹤評估報表建議改善流程諮詢資源管理系統整合解
決方案預約病患回訪率提升轉換客源擴增市場競爭分析定位策略目標
達成預算規劃執行成本控制績效評估合作夥伴關係品質保證滿意度調
查回饋意見反應處理支援維護更新創新發展趨勢洞察先進技術應用實
踐案例研究分享知識交流學習成長機會挑戰突破瓶頸轉型升級展望未
來願景使命價值觀理念精神文化傳承創意激發靈感實現夢想追求卓越
""".strip()

def create_font_subset(font_file, output_file, text_file=None):
    """創建字體子集"""
    args = [
        "--output-file=" + str(output_file),
        "--layout-features='*'",
        "--name-IDs='*'",
        "--glyph-names",
        "--symbol-cmap",
        "--legacy-cmap",
        "--notdef-outline",
        "--no-subset-tables+=DSIG",
    ]
    
    # 添加文本文件
    if text_file:
        args.append("--text-file=" + str(text_file))
    
    # 添加字體文件
    args.append(str(font_file))
    
    # 執行子集化
    subset(args)

def main():
    """主函數"""
    print(f"🔍 正在搜尋中文字體檔案...")
    
    # 準備常用字符文件
    text_file = ROOT_DIR / "scripts" / "common_hanzi.txt"
    with open(text_file, "w", encoding="utf-8") as f:
        f.write(COMMON_HANZI)
    
    # 處理每個中文字體
    chinese_font_pattern = "GenYoGothicTW-"
    for font_path in FONTS_DIR.glob("*.woff2"):
        if chinese_font_pattern in font_path.name:
            print(f"⚙️ 處理字體: {font_path.name}")
            
            # 輸出文件名
            output_name = font_path.stem + "-subset" + font_path.suffix
            output_path = FONTS_DIR / output_name
            
            # 創建子集
            try:
                create_font_subset(
                    font_path, 
                    output_path,
                    text_file=text_file
                )
                
                # 計算尺寸減少
                original_size = font_path.stat().st_size
                subset_size = output_path.stat().st_size
                reduction = (original_size - subset_size) / original_size * 100
                
                print(f"✅ 子集化成功: {font_path.name}")
                print(f"   原始大小: {original_size / 1024 / 1024:.2f} MB")
                print(f"   子集大小: {subset_size / 1024 / 1024:.2f} MB")
                print(f"   減少: {reduction:.2f}%")
            except Exception as e:
                print(f"❌ 子集化失敗: {font_path.name}")
                print(f"   錯誤: {str(e)}")
    
    print("\n🎉 完成字體子集化!")
    print("請更新 fonts.css 文件，將字體路徑指向新的子集化文件")
    print("例如: 將 'GenYoGothicTW-Regular.woff2' 改為 'GenYoGothicTW-Regular-subset.woff2'")
    
    # 清理
    os.remove(text_file)

if __name__ == "__main__":
    main() 