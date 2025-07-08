import { NextResponse } from 'next/server'

/**
 * 健康檢查 API 端點
 * 用於 Vercel Cron Jobs 和系統監控
 */
export async function GET() {
  try {
    const timestamp = new Date().toISOString()
    const startTime = Date.now()
    
    // 執行系統檢查
    const checks = await performHealthChecks()
    
    const responseTime = Date.now() - startTime
    
    // 執行基本的系統檢查
    const healthData = {
      status: checks.allPassed ? 'healthy' : 'degraded',
      timestamp,
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        arrayBuffers: Math.round(process.memoryUsage().arrayBuffers / 1024 / 1024)
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        environment: process.env.NODE_ENV,
        vercelRegion: process.env.VERCEL_REGION || 'unknown',
        vercelUrl: process.env.VERCEL_URL || 'localhost'
      },
      checks: {
        ...checks.details,
        environment_variables: checkEnvironmentVariables(),
        performance: {
          responseTime: responseTime < 1000 ? 'good' : responseTime < 3000 ? 'fair' : 'poor',
          memoryUsage: process.memoryUsage().heapUsed / process.memoryUsage().heapTotal < 0.8 ? 'good' : 'high'
        }
      },
      metadata: {
        version: '1.0.0',
        lastDeployment: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
        buildTime: process.env.BUILD_TIME || 'unknown'
      }
    }

    const statusCode = checks.allPassed ? 200 : 503

    return NextResponse.json(healthData, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
        'X-Health-Check': 'true',
        'X-Response-Time': `${responseTime}ms`
      }
    })
    
  } catch (error) {
    console.error('健康檢查失敗:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : '未知錯誤',
        checks: {
          system: false,
          environment: false,
          performance: false
        }
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
          'X-Health-Check': 'true'
        }
      }
    )
  }
}

/**
 * 執行詳細的系統健康檢查
 */
async function performHealthChecks() {
  const checks = {
    system: true,
    memory: true,
    environment: true,
    network: true,
    performance: true
  }

  try {
    // 記憶體檢查
    const memUsage = process.memoryUsage()
    const memoryUsageRatio = memUsage.heapUsed / memUsage.heapTotal
    checks.memory = memoryUsageRatio < 0.9 // 記憶體使用率低於90%

    // 環境變數檢查
    const requiredEnvVars = [
      'NEXT_PUBLIC_SITE_URL',
      'NEXT_PUBLIC_BASE_URL'
    ]
    checks.environment = requiredEnvVars.every(envVar => process.env[envVar])

    // 網路連接測試（基本檢查）
    try {
      // 這裡可以添加對外部服務的ping測試
      checks.network = true
    } catch {
      checks.network = false
    }

    // 性能檢查
    const startMemory = process.memoryUsage().heapUsed
    await new Promise(resolve => setTimeout(resolve, 10)) // 小延遲測試
    const endMemory = process.memoryUsage().heapUsed
    checks.performance = Math.abs(endMemory - startMemory) < 1024 * 1024 // 記憶體變化小於1MB

  } catch (error) {
    console.error('健康檢查過程中發生錯誤:', error)
    Object.keys(checks).forEach(key => {
      checks[key as keyof typeof checks] = false
    })
  }

  return {
    allPassed: Object.values(checks).every(Boolean),
    details: checks
  }
}

/**
 * 檢查重要的環境變數
 */
function checkEnvironmentVariables() {
  const requiredEnvVars = {
    'NEXT_PUBLIC_SITE_URL': process.env.NEXT_PUBLIC_SITE_URL,
    'NEXT_PUBLIC_BASE_URL': process.env.NEXT_PUBLIC_BASE_URL,
    'NEXT_PUBLIC_GA_MEASUREMENT_ID': process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    'NEXT_PUBLIC_GTM_ID': process.env.NEXT_PUBLIC_GTM_ID,
    'NODE_ENV': process.env.NODE_ENV,
    'VERCEL_ENV': process.env.VERCEL_ENV
  }

  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  return {
    status: missing.length === 0 ? 'complete' : 'missing',
    missing,
    count: {
      total: Object.keys(requiredEnvVars).length,
      present: Object.keys(requiredEnvVars).length - missing.length,
      missing: missing.length
    }
  }
} 