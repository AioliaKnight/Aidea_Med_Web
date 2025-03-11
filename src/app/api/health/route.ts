import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { projectId, dataset, apiVersion } from '@/sanity/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  try {
    // 測試 Sanity 連接
    await client.fetch('*[_type == "post"][0]');
    
    // 成功回應
    return NextResponse.json({
      status: 'ok',
      timestamp,
      sanity: {
        status: 'connected',
        check: 'success',
      },
      env: {
        sanityProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        sanityDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
        sanityApiVersion: !!process.env.NEXT_PUBLIC_SANITY_API_VERSION,
        baseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      },
      version: {
        node: process.version,
        nextjs: '14.2.24',
      }
    });
  } catch (error) {
    // 錯誤回應
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      status: 'error',
      timestamp,
      sanity: {
        status: 'disconnected',
        error: errorMessage,
      },
      env: {
        sanityProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        sanityDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
        sanityApiVersion: !!process.env.NEXT_PUBLIC_SANITY_API_VERSION,
        baseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      },
      config: {
        projectId,
        dataset,
        apiVersion,
      }
    }, { status: 500 });
  }
} 