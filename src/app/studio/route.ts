import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export function GET() {
  return NextResponse.redirect(new URL('/studio-entry', process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com'))
} 