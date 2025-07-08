import { NextRequest, NextResponse } from 'next/server'

/**
 * 性能監控 API 端點
 * 用於收集 Web Vitals 和系統性能數據
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metric, url, timestamp, userAgent } = body
    
    // 驗證必要字段
    if (!metric || !metric.name || !metric.value) {
      return NextResponse.json(
        { error: 'Missing required metric data' },
        { status: 400 }
      )
    }
    
    // 性能數據結構
    const performanceData = {
      timestamp: timestamp || new Date().toISOString(),
      url: url || 'unknown',
      userAgent: userAgent || 'unknown',
      metric: {
        name: metric.name,
        value: metric.value,
        rating: metric.rating || getMetricRating(metric.name, metric.value),
        delta: metric.delta || 0,
        id: metric.id || generateMetricId(),
        entries: metric.entries || []
      },
      session: {
        region: request.headers.get('x-vercel-ip-country') || 'unknown',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        deployment: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
      }
    }
    
    // 記錄性能數據（在生產環境中，這裡會發送到分析服務）
    console.log('性能指標收集:', JSON.stringify(performanceData, null, 2))
    
    // 在這裡可以整合以下服務：
    // - Google Analytics 4
    // - Vercel Analytics
    // - 自定義分析服務
    // - 日誌聚合服務
    
    // 檢查性能是否符合標準
    const performanceStatus = analyzePerformance(metric)
    
    return NextResponse.json(
      {
        success: true,
        status: performanceStatus.status,
        recommendations: performanceStatus.recommendations,
        threshold: performanceStatus.threshold
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json'
        }
      }
    )
    
  } catch (error) {
    console.error('性能數據處理失敗:', error)
    
    return NextResponse.json(
      { error: 'Failed to process performance data' },
      { status: 500 }
    )
  }
}

/**
 * 獲取系統性能指標
 */
export async function GET() {
  try {
    const performanceMetrics = {
      timestamp: new Date().toISOString(),
      server: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          usage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
        },
        cpu: {
          platform: process.platform,
          arch: process.arch,
          version: process.version
        }
      },
      thresholds: {
        FCP: { good: 1800, needsImprovement: 3000 },
        LCP: { good: 2500, needsImprovement: 4000 },
        FID: { good: 100, needsImprovement: 300 },
        CLS: { good: 0.1, needsImprovement: 0.25 },
        TTFB: { good: 800, needsImprovement: 1800 },
        INP: { good: 200, needsImprovement: 500 }
      }
    }
    
    return NextResponse.json(performanceMetrics, {
      headers: {
        'Cache-Control': 'public, max-age=60',
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    console.error('獲取性能指標失敗:', error)
    
    return NextResponse.json(
      { error: 'Failed to get performance metrics' },
      { status: 500 }
    )
  }
}

/**
 * 根據指標名稱和值評定性能等級
 */
function getMetricRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, { good: number; needsImprovement: number }> = {
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    FID: { good: 100, needsImprovement: 300 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    TTFB: { good: 800, needsImprovement: 1800 },
    INP: { good: 200, needsImprovement: 500 }
  }
  
  const threshold = thresholds[name]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needs-improvement'
  return 'poor'
}

/**
 * 生成唯一的指標 ID
 */
function generateMetricId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 分析性能並提供建議
 */
function analyzePerformance(metric: any) {
  const { name, value, rating } = metric
  
  const analysis = {
    status: rating,
    threshold: getThresholdForMetric(name),
    recommendations: [] as string[]
  }
  
  // 根據不同指標提供優化建議
  switch (name) {
    case 'FCP':
      if (rating !== 'good') {
        analysis.recommendations.push('優化關鍵資源載入順序')
        analysis.recommendations.push('減少阻塞渲染的資源')
        analysis.recommendations.push('使用 CDN 加速靜態資源')
      }
      break
      
    case 'LCP':
      if (rating !== 'good') {
        analysis.recommendations.push('優化最大內容元素的載入')
        analysis.recommendations.push('使用圖片格式優化 (WebP/AVIF)')
        analysis.recommendations.push('實施懶載入策略')
      }
      break
      
    case 'FID':
      if (rating !== 'good') {
        analysis.recommendations.push('減少 JavaScript 執行時間')
        analysis.recommendations.push('使用 Web Workers 處理重型計算')
        analysis.recommendations.push('分割程式碼減少主執行緒阻塞')
      }
      break
      
    case 'CLS':
      if (rating !== 'good') {
        analysis.recommendations.push('為圖片和廣告設定尺寸屬性')
        analysis.recommendations.push('避免在現有內容上方插入內容')
        analysis.recommendations.push('使用 transform 動畫替代佈局變更')
      }
      break
  }
  
  return analysis
}

/**
 * 獲取指標的閾值設定
 */
function getThresholdForMetric(name: string) {
  const thresholds: Record<string, any> = {
    FCP: { good: '< 1.8s', needsImprovement: '1.8s - 3.0s', poor: '> 3.0s' },
    LCP: { good: '< 2.5s', needsImprovement: '2.5s - 4.0s', poor: '> 4.0s' },
    FID: { good: '< 100ms', needsImprovement: '100ms - 300ms', poor: '> 300ms' },
    CLS: { good: '< 0.1', needsImprovement: '0.1 - 0.25', poor: '> 0.25' },
    TTFB: { good: '< 800ms', needsImprovement: '800ms - 1.8s', poor: '> 1.8s' },
    INP: { good: '< 200ms', needsImprovement: '200ms - 500ms', poor: '> 500ms' }
  }
  
  return thresholds[name] || { good: 'N/A', needsImprovement: 'N/A', poor: 'N/A' }
} 