'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Post, formatDate, filterPostsByCategory } from '@/lib/blog-utils'

interface BlogListProps {
  initialPosts: Post[]
}

// 定義博客文章類別
const categories = [
  { id: null, name: '全部文章' },
  { id: 'dental', name: '牙醫行銷' },
  { id: 'digital', name: '數位行銷' },
  { id: 'branding', name: '品牌策略' },
  { id: 'technology', name: 'AI與科技' }
]

const BlogList: React.FC<BlogListProps> = ({ initialPosts }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 處理類別變更
  useEffect(() => {
    const filtered = filterPostsByCategory(initialPosts, activeCategory)
    setPosts(filtered)
  }, [activeCategory, initialPosts])

  return (
    <div className="container mx-auto py-12 px-4">
      {/* 分類標籤 */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.id || 'all'}
            onClick={() => setActiveCategory(category.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === category.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 文章列表 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-500"
                  />
                  {post.category && (
                    <span className="absolute top-4 left-4 bg-white/90 text-primary text-xs font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {post.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {post.author.avatar && (
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={28}
                          height={28}
                          className="rounded-full mr-2 border border-white"
                        />
                      )}
                      <span className="text-xs text-gray-500">
                        {post.author.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 無結果顯示 */}
      {posts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">找不到相關文章</h3>
          <p className="text-gray-600">嘗試選擇不同的分類或返回全部文章</p>
          <button
            onClick={() => setActiveCategory(null)}
            className="mt-6 px-8 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            查看全部文章
          </button>
        </div>
      )}
    </div>
  )
}

export default BlogList 