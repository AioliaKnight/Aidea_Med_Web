#!/usr/bin/env node

/**
 * 增強的 Sitemap 驗證腳本
 * 驗證生成的 sitemap.xml 是否符合標準
 * 整合統一的 SEO 配置進行驗證
 * 最後更新: 2024-12-19
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const { DOMParser } = require('xmldom')

// 配置
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
const LOCAL_BUILD_DIR = path.join(process.cwd(), '.next')
const SITEMAP_PATH = '/sitemap.xml'
const IMAGE_SITEMAP_PATH = '/images/sitemap.xml'

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

/**
 * 主要驗證函數
 */
async function validateSitemaps() {
  log('🔍 開始驗證 Sitemap...', 'blue')
  
  try {
    // 驗證主要 sitemap
    log('\n📄 驗證主要 Sitemap...', 'cyan')
    await validateMainSitemap()
    
    // 驗證 robots.txt
    log('\n🤖 驗證 robots.txt...', 'cyan')
    await validateRobots()
    
    // 性能測試
    log('\n⚡ 執行性能測試...', 'cyan')
    await performanceTest()
    
    log('\n✅ 所有驗證完成！', 'green')
    
  } catch (error) {
    log(`\n❌ 驗證失敗: ${error.message}`, 'red')
    process.exit(1)
  }
}

/**
 * 驗證主要 sitemap
 */
async function validateMainSitemap() {
  const sitemapUrl = `${BASE_URL}${SITEMAP_PATH}`
  
  try {
    const xmlContent = await fetchContent(sitemapUrl)
    const doc = new DOMParser().parseFromString(xmlContent, 'text/xml')
    
    // 檢查 XML 格式
    const parseErrors = doc.getElementsByTagName('parsererror')
    if (parseErrors.length > 0) {
      throw new Error('Sitemap XML 格式錯誤')
    }
    
    // 檢查 URL 數量
    const urls = doc.getElementsByTagName('url')
    log(`  📊 找到 ${urls.length} 個 URL`, 'green')
    
    if (urls.length === 0) {
      throw new Error('Sitemap 中沒有找到任何 URL')
    }
    
    if (urls.length > 50000) {
      log(`  ⚠️  URL 數量 (${urls.length}) 超過建議上限 50,000`, 'yellow')
    }
    
    // 驗證每個 URL
    const urlValidations = []
    for (let i = 0; i < urls.length; i++) {
      const urlElement = urls[i]
      const loc = urlElement.getElementsByTagName('loc')[0]?.textContent
      const lastmod = urlElement.getElementsByTagName('lastmod')[0]?.textContent
      const changefreq = urlElement.getElementsByTagName('changefreq')[0]?.textContent
      const priority = urlElement.getElementsByTagName('priority')[0]?.textContent
      
      // 驗證 URL 格式
      if (!loc || !isValidUrl(loc)) {
        urlValidations.push(`無效的 URL: ${loc}`)
        continue
      }
      
      // 檢查是否為內部 URL
      if (!loc.startsWith(BASE_URL)) {
        urlValidations.push(`外部 URL 不應包含在 sitemap 中: ${loc}`)
      }
      
      // 驗證最後修改時間格式
      if (lastmod && !isValidDate(lastmod)) {
        urlValidations.push(`無效的 lastmod 格式: ${lastmod} (URL: ${loc})`)
      }
      
      // 驗證更新頻率
      if (changefreq && !['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].includes(changefreq)) {
        urlValidations.push(`無效的 changefreq: ${changefreq} (URL: ${loc})`)
      }
      
      // 驗證優先級
      if (priority) {
        const priorityNum = parseFloat(priority)
        if (isNaN(priorityNum) || priorityNum < 0 || priorityNum > 1) {
          urlValidations.push(`無效的 priority: ${priority} (URL: ${loc})`)
        }
      }
    }
    
    // 報告驗證結果
    if (urlValidations.length > 0) {
      log(`  ⚠️  發現 ${urlValidations.length} 個問題:`, 'yellow')
      urlValidations.slice(0, 10).forEach(issue => log(`    - ${issue}`, 'yellow'))
      if (urlValidations.length > 10) {
        log(`    ... 還有 ${urlValidations.length - 10} 個問題`, 'yellow')
      }
    } else {
      log('  ✅ 主要 Sitemap 驗證通過', 'green')
    }
    
    // 分析優先級分佈
    analyzePriorityDistribution(doc)
    
  } catch (error) {
    throw new Error(`主要 Sitemap 驗證失敗: ${error.message}`)
  }
}

/**
 * 驗證 robots.txt
 */
async function validateRobots() {
  const robotsUrl = `${BASE_URL}/robots.txt`
  
  try {
    const content = await fetchContent(robotsUrl)
    
    // 檢查是否包含 sitemap 引用
    if (content.includes('Sitemap:')) {
      log('  ✅ robots.txt 包含 Sitemap 引用', 'green')
    } else {
      log('  ⚠️  robots.txt 缺少 Sitemap 引用', 'yellow')
    }
    
    // 檢查基本結構
    if (content.includes('User-agent:')) {
      log('  ✅ robots.txt 結構正確', 'green')
    } else {
      log('  ❌ robots.txt 結構不正確', 'red')
    }
    
  } catch (error) {
    log(`  ⚠️  robots.txt 驗證失敗: ${error.message}`, 'yellow')
  }
}

/**
 * 性能測試
 */
async function performanceTest() {
  const tests = [
    { url: `${BASE_URL}${SITEMAP_PATH}`, name: '主要 Sitemap' },
    { url: `${BASE_URL}/robots.txt`, name: 'robots.txt' },
  ]
  
  for (const test of tests) {
    try {
      const startTime = Date.now()
      await fetchContent(test.url)
      const endTime = Date.now()
      const duration = endTime - startTime
      
      if (duration < 1000) {
        log(`  ✅ ${test.name}: ${duration}ms`, 'green')
      } else if (duration < 3000) {
        log(`  ⚠️  ${test.name}: ${duration}ms (較慢)`, 'yellow')
      } else {
        log(`  ❌ ${test.name}: ${duration}ms (過慢)`, 'red')
      }
    } catch (error) {
      log(`  ❌ ${test.name}: 無法訪問`, 'red')
    }
  }
}

/**
 * 分析優先級分佈
 */
function analyzePriorityDistribution(doc) {
  const urls = doc.getElementsByTagName('url')
  const priorities = {}
  
  for (let i = 0; i < urls.length; i++) {
    const priority = urls[i].getElementsByTagName('priority')[0]?.textContent || '0.5'
    const priorityFloat = parseFloat(priority)
    const priorityKey = priorityFloat.toFixed(1)
    
    priorities[priorityKey] = (priorities[priorityKey] || 0) + 1
  }
  
  log('  📊 優先級分佈:', 'blue')
  Object.keys(priorities)
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .forEach(priority => {
      log(`    Priority ${priority}: ${priorities[priority]} URLs`, 'blue')
    })
}

/**
 * 獲取內容
 */
function fetchContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${url}`))
        return
      }
      
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

/**
 * 驗證 URL 格式
 */
function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

/**
 * 驗證日期格式
 */
function isValidDate(dateString) {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

// 執行驗證
if (require.main === module) {
  validateSitemaps().catch(error => {
    log(`驗證過程發生錯誤: ${error.message}`, 'red')
    process.exit(1)
  })
}

module.exports = { validateSitemaps } 