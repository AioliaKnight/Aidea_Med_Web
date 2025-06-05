const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images')

// 圖片優化配置
const OPTIMIZATION_CONFIG = {
  jpeg: { quality: 85, progressive: true },
  png: { quality: 85, compressionLevel: 9 },
  webp: { quality: 85, effort: 6 },
  avif: { quality: 75, effort: 9 }
}

// 需要優化的圖片尺寸
const SIZES = [
  { suffix: '_sm', width: 640 },
  { suffix: '_md', width: 1200 },
  { suffix: '_lg', width: 1920 }
]

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath))
  const ext = path.extname(inputPath).toLowerCase()
  
  // 檢查是否已經優化過
  const placeholderPath = path.join(outputDir, `${filename}_placeholder.jpg`)
  if (fs.existsSync(placeholderPath)) {
    console.log(`⏭️  跳過已優化: ${filename}`)
    return
  }
  
  console.log(`🔄 正在優化: ${filename}`)
  
  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()
    
    if (!metadata.width || !metadata.height) {
      console.log(`⚠️  跳過無效圖片: ${filename}`)
      return
    }
    
    // 生成不同尺寸的圖片
    for (const size of SIZES) {
      if (metadata.width > size.width) {
        try {
          // JPEG
          await image
            .resize(size.width)
            .jpeg(OPTIMIZATION_CONFIG.jpeg)
            .toFile(path.join(outputDir, `${filename}${size.suffix}.jpg`))
          
          // WebP
          await image
            .resize(size.width)
            .webp(OPTIMIZATION_CONFIG.webp)
            .toFile(path.join(outputDir, `${filename}${size.suffix}.webp`))
          
          // AVIF
          await image
            .resize(size.width)
            .avif(OPTIMIZATION_CONFIG.avif)
            .toFile(path.join(outputDir, `${filename}${size.suffix}.avif`))
            
        } catch (sizeError) {
          console.warn(`⚠️  尺寸 ${size.suffix} 優化失敗 ${filename}:`, sizeError.message)
        }
      }
    }
    
    // 生成 placeholder (64px 寬度)
    try {
      await image
        .resize(64)
        .jpeg({ quality: 60 })
        .toFile(path.join(outputDir, `${filename}_placeholder.jpg`))
    } catch (placeholderError) {
      console.warn(`⚠️  Placeholder 生成失敗 ${filename}:`, placeholderError.message)
    }
    
    console.log(`✅ 完成優化: ${filename}`)
    
  } catch (error) {
    console.error(`❌ 優化失敗 ${filename}:`, error.message)
  }
}

async function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const filePath = path.join(dir, file)
      
      try {
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          console.log(`📁 處理子目錄: ${file}`)
          await processDirectory(filePath)
        } else if (/\.(jpg|jpeg|png)$/i.test(file) && !/_sm|_md|_lg|_placeholder/.test(file)) {
          await optimizeImage(filePath, dir)
        }
      } catch (fileError) {
        console.warn(`⚠️  跳過檔案 ${file}:`, fileError.message)
      }
    }
  } catch (dirError) {
    console.error(`❌ 處理目錄失敗 ${dir}:`, dirError.message)
  }
}

async function main() {
  console.log('🚀 開始圖片優化...')
  console.log(`📁 處理目錄: ${IMAGES_DIR}`)
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('❌ 圖片目錄不存在')
    process.exit(1)
  }
  
  try {
    await processDirectory(IMAGES_DIR)
    console.log('✨ 圖片優化完成！')
  } catch (error) {
    console.error('❌ 優化過程發生錯誤:', error)
    process.exit(1)
  }
}

main().catch(console.error) 