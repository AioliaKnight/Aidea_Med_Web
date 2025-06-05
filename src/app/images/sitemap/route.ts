import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * 圖片 Sitemap 生成器
 * 為 Google 圖片搜尋提供結構化的圖片資訊
 * 
 * 功能特點：
 * - 自動掃描 public/images 目錄
 * - 生成符合 Google 標準的圖片 sitemap
 * - 包含圖片的 alt 文字、標題、描述等資訊
 * - 支援多種圖片格式
 */

interface ImageInfo {
  url: string
  title: string
  caption?: string
  geoLocation?: string
  license?: string
}

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
    const publicDir = path.join(process.cwd(), 'public')
    const imagesDir = path.join(publicDir, 'images')
    
    // 支援的圖片格式
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg']
    
    // 掃描圖片目錄
    const images = await scanImagesDirectory(imagesDir, supportedFormats)
    
    // 生成圖片資訊
    const imageInfos: ImageInfo[] = images.map(imagePath => {
      const relativePath = imagePath.replace(publicDir, '').replace(/\\/g, '/')
      const url = `${baseUrl}${relativePath}`
      
      // 從檔案路徑推斷圖片資訊
      const pathSegments = relativePath.split('/')
      const fileName = path.basename(relativePath, path.extname(relativePath))
      
      let title = fileName.replace(/[-_]/g, ' ')
      let caption = ''
      
      // 根據目錄結構生成更好的標題和描述
      if (pathSegments.includes('blog')) {
        title = `${title} - 醫療行銷新知`
        caption = '專業醫療行銷內容配圖'
      } else if (pathSegments.includes('case')) {
        title = `${title} - 成功案例`
        caption = '醫療診所行銷成功案例展示'
      } else if (pathSegments.includes('team')) {
        title = `${title} - 專業團隊`
        caption = 'Aidea:Med 醫療行銷專業團隊'
      } else if (pathSegments.includes('service')) {
        title = `${title} - 服務項目`
        caption = '醫療行銷顧問服務內容'
      } else if (pathSegments.includes('testimonials')) {
        title = `${title} - 客戶見證`
        caption = '客戶滿意度與成功見證'
      } else if (pathSegments.includes('og')) {
        title = `${title} - 社交媒體分享圖`
        caption = '專為社交媒體分享優化的圖片'
      }
      
      return {
        url,
        title: title.charAt(0).toUpperCase() + title.slice(1),
        caption,
        geoLocation: '台灣', // 所有圖片都與台灣醫療市場相關
        license: `${baseUrl}/privacy` // 指向隱私政策頁面
      }
    })
    
    // 生成 XML sitemap
    const xmlContent = generateImageSitemapXML(imageInfos)
    
    return new NextResponse(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 快取 24 小時
      },
    })
    
  } catch (error) {
    console.error('Error generating image sitemap:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * 遞迴掃描圖片目錄
 */
async function scanImagesDirectory(dir: string, supportedFormats: string[]): Promise<string[]> {
  const images: string[] = []
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name)
      
      if (item.isDirectory()) {
        // 跳過某些不需要索引的目錄
        if (['temp', 'private', 'cache', '.git'].includes(item.name)) {
          continue
        }
        
        // 遞迴掃描子目錄
        const subImages = await scanImagesDirectory(fullPath, supportedFormats)
        images.push(...subImages)
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase()
        if (supportedFormats.includes(ext)) {
          images.push(fullPath)
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error)
  }
  
  return images
}

/**
 * 生成圖片 sitemap XML
 */
function generateImageSitemapXML(images: ImageInfo[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
  const urlsetClose = '</urlset>'
  
  // 按頁面分組圖片
  const pageGroups = groupImagesByPage(images)
  
  const urlEntries = Object.entries(pageGroups).map(([pageUrl, pageImages]) => {
    const imageEntries = pageImages.map(image => `
    <image:image>
      <image:loc>${escapeXml(image.url)}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
      ${image.caption ? `<image:caption>${escapeXml(image.caption)}</image:caption>` : ''}
      ${image.geoLocation ? `<image:geo_location>${escapeXml(image.geoLocation)}</image:geo_location>` : ''}
      ${image.license ? `<image:license>${escapeXml(image.license)}</image:license>` : ''}
    </image:image>`).join('')
    
    return `
  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>${imageEntries}
  </url>`
  }).join('')
  
  return `${xmlHeader}
${urlsetOpen}${urlEntries}
${urlsetClose}`
}

/**
 * 按頁面分組圖片
 */
function groupImagesByPage(images: ImageInfo[]): Record<string, ImageInfo[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
  const groups: Record<string, ImageInfo[]> = {}
  
  images.forEach(image => {
    // 根據圖片路徑推斷所屬頁面
    let pageUrl = baseUrl
    
    if (image.url.includes('/blog/')) {
      pageUrl = `${baseUrl}/blog`
    } else if (image.url.includes('/case/')) {
      pageUrl = `${baseUrl}/case`
    } else if (image.url.includes('/team/')) {
      pageUrl = `${baseUrl}/team`
    } else if (image.url.includes('/service/')) {
      pageUrl = `${baseUrl}/service`
    }
    
    if (!groups[pageUrl]) {
      groups[pageUrl] = []
    }
    
    groups[pageUrl].push(image)
  })
  
  return groups
}

/**
 * XML 特殊字符轉義
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
} 