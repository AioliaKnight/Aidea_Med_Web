import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'
import { projectId, dataset, apiVersion } from '@/sanity/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  const timestamp = new Date().toISOString()
  
  try {
    // 測試 Sanity 連接
    const query = '*[_type == "post"][0..1]{ _id, title }'
    const result = await client.fetch(query)
    
    // 成功回應
    return NextResponse.json({
      status: 'ok',
      timestamp,
      sanity: {
        status: 'connected',
        projectId,
        dataset,
        apiVersion,
        posts_count: Array.isArray(result) ? result.length : (result ? 1 : 0),
        first_post_id: Array.isArray(result) && result.length > 0 ? result[0]._id : null,
      },
      message: '成功連接到 Sanity API'
    })
    
  } catch (error) {
    // 錯誤回應
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      status: 'error',
      timestamp,
      sanity: {
        status: 'disconnected',
        projectId,
        dataset,
        apiVersion,
        error: errorMessage,
      },
      message: '無法連接到 Sanity API',
      help: `請確保在 Sanity 管理界面 (https://www.sanity.io/manage/project/${projectId}) 中已設置正確的 CORS 設定`
    }, { status: 500 })
  }
} 