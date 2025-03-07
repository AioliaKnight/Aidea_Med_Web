import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 檢查 Sanity CMS 連線狀態
    const sanityCheck = await client.fetch(`*[_type == "sanity.imageAsset"][0...1]`);
    
    // 檢查環境變數是否已設定
    const envCheck = {
      sanityProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      sanityDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
      sanityApiVersion: !!process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      baseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
    };
    
    return NextResponse.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      sanity: {
        status: 'connected',
        check: sanityCheck ? 'success' : 'failed'
      },
      env: envCheck,
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({ 
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 