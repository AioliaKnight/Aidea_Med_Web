'use client'

import dynamic from "next/dynamic";

const TinaCMS = dynamic(() => import("tinacms"), { ssr: false });

export default function AdminPage() {
  return <TinaCMS />
}

// 設定頁面為管理後台
export const metadata = {
  title: '部落格管理後台 | Aidea:Med',
  description: '內容管理系統',
  robots: 'noindex, nofollow', // 禁止搜尋引擎索引
} 