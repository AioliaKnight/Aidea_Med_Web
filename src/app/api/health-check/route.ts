import { NextResponse } from 'next/server'

/**
 * 健康檢查 API 端點
 * 用於 Vercel Cron Jobs 和系統監控
 */
export async function GET() {
  try {
    const timestamp = new Date().toISOString()
    
    // 執行基本的系統檢查
    const healthData = {
      status: 'healthy',
      timestamp,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV,
      // 檢查重要環境變數
      checks: {
        database: true, // 可以添加實際的資料庫檢查
        cache: true,    // 可以添加緩存檢查
        external_apis: true // 可以添加外部 API 檢查
      }
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    console.error('健康檢查失敗:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : '未知錯誤'
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json'
        }
      }
    )
  }
} 