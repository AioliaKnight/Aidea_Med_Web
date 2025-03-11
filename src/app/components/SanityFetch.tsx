'use client'

import { useState, useEffect } from 'react'
import { client, handleSanityError } from '@/lib/sanity'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity'
import Link from 'next/link'

type Post = {
  _id: string
  title: string
  slug: {
    current: string
  }
  mainImage?: any
  publishedAt: string
  excerpt?: string
}

/**
 * 展示如何從 Sanity 獲取資料的示例組件
 */
export default function SanityFetch() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 使用標準字符串而非 groq 模板字串
        const query = `*[_type == "post"] | order(publishedAt desc)[0...3] {
          _id,
          title,
          slug,
          mainImage,
          publishedAt,
          excerpt
        }`
        
        // 使用增強的選項
        const result = await client.fetch(query, {}, {
          cache: 'no-store',
          next: { revalidate: 300 } // 5分鐘重新驗證
        })
        
        setPosts(result)
        setLoading(false)
      } catch (err) {
        const errorMessage = handleSanityError(err);
        console.error('Error fetching demo posts:', err)
        setError(errorMessage)
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1 py-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-100">
        <h3 className="text-lg font-semibold text-red-800 mb-2">連接錯誤</h3>
        <p className="text-red-600">{error}</p>
        <div className="mt-4 p-3 bg-white rounded border border-red-200">
          <p className="text-sm text-gray-600">請檢查:</p>
          <ul className="list-disc ml-5 text-sm text-gray-600 mt-2">
            <li>Sanity 專案 ID 設定是否正確</li>
            <li>API Token 權限是否充足</li>
            <li>CORS 設定是否允許此網站</li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            <a 
              href="https://www.sanity.io/manage" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              前往 Sanity 管理頁面設定 →
            </a>
          </p>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">尚無內容</h3>
        <p className="text-yellow-700 mb-3">
          您的 Sanity 資料庫中尚未有任何文章。請前往 Sanity Studio 新增內容。
        </p>
        <a 
          href="/studio-entry"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          前往 Sanity Studio 新增文章 →
        </a>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">最新文章</h3>
      <p className="text-sm text-gray-600 mb-4">從 Sanity 載入的最新文章</p>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="flex space-x-4">
            {post.mainImage && (
              <div className="flex-shrink-0">
                <Image
                  src={urlForImage(post.mainImage)?.width(100)?.height(100)?.url() || '/images/placeholder.jpg'}
                  alt={post.title}
                  width={100}
                  height={100}
                  className="rounded object-cover"
                />
              </div>
            )}
            <div>
              <h4 className="font-medium">{post.title}</h4>
              <p className="text-sm text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString('zh-TW')}
              </p>
              {post.excerpt && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link href="/blog" className="text-blue-600 hover:underline text-sm">
          查看所有文章 →
        </Link>
      </div>
    </div>
  )
} 