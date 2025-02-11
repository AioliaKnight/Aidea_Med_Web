'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDate, buildBlogUrl, getImageUrl } from '@/lib/utils'
import { BlogProps } from '@/types/blog'
import Pagination from '@/components/ui/Pagination'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

export default function Blog({ 
  posts, 
  categories,
  currentPage,
  totalPages,
  searchQuery = '',
  selectedCategory = '',
  sortBy = 'latest'
}: BlogProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const router = useRouter()

  // 搜尋處理
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('search') as string
    router.push(buildBlogUrl({ search: query }))
  }

  // 分類篩選處理
  const handleCategoryChange = (categoryId: string) => {
    router.push(buildBlogUrl({ category: categoryId }))
  }

  // 排序處理
  const handleSortChange = (sort: 'latest' | 'popular') => {
    router.push(buildBlogUrl({ sort }))
  }

  // 創建分頁 URL
  const createPaginationUrl = (page: number) => {
    return buildBlogUrl({
      page: page.toString(),
      category: selectedCategory,
      search: searchQuery,
      sort: sortBy,
    })
  }

  return (
    <section className="py-20 bg-gray-50" ref={ref} id="blog">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-7xl mx-auto"
        >
          {/* 標題區塊 */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-red to-brand-red/80 bg-clip-text text-transparent">
              專業知識分享
            </h2>
            <p className="text-xl text-gray-600">
              深入探討牙醫行銷趨勢與實務經驗
            </p>
          </motion.div>

          {/* 搜尋和篩選區塊 */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* 搜尋表單 */}
              <form onSubmit={handleSearch} className="w-full md:w-auto">
                <div className="relative">
                  <input
                    type="search"
                    name="search"
                    placeholder="搜尋文章..."
                    defaultValue={searchQuery}
                    className="w-full md:w-80 px-4 py-2 rounded-full border focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </form>

              {/* 分類選擇 */}
              <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === ''
                      ? 'bg-brand-red text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  全部
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === category._id
                        ? 'bg-brand-red text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>

              {/* 排序選擇 */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as 'latest' | 'popular')}
                className="px-4 py-2 rounded-full border focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white"
              >
                <option value="latest">最新發布</option>
                <option value="popular">最多閱讀</option>
              </select>
            </div>
          </motion.div>

          {/* 文章列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <motion.article
                key={post._id}
                variants={itemVariants}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <Link href={`/blog/${post.slug.current}`}>
                  {/* 文章圖片 */}
                  <div className="relative h-48">
                    <Image
                      src={getImageUrl(post.mainImage.asset.url, {
                        width: 800,
                        height: 400,
                      })}
                      alt={post.mainImage.alt || post.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* 文章內容 */}
                  <div className="p-6">
                    {/* 分類標籤 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.map((category) => (
                        <span
                          key={category.title}
                          className="px-3 py-1 text-sm rounded-full"
                          style={{
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                          }}
                        >
                          {category.title}
                        </span>
                      ))}
                    </div>

                    {/* 標題 */}
                    <h3 className="text-xl font-bold mb-2 hover:text-brand-red transition-colors">
                      {post.title}
                    </h3>

                    {/* 摘要 */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* 作者與資訊 */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={getImageUrl(post.author.image.asset.url, {
                              width: 100,
                              height: 100,
                            })}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {post.author.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <time dateTime={post.publishedAt}>
                          {formatDate(post.publishedAt)}
                        </time>
                        <span className="mx-2">·</span>
                        <span>{post.readingTime} 分鐘</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* 分頁 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            createUrl={createPaginationUrl}
          />

          {/* 無結果提示 */}
          {posts.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 text-gray-500"
            >
              <p className="text-xl">沒有找到相關文章</p>
              <button
                onClick={() => {
                  router.push('/blog')
                }}
                className="mt-4 text-brand-red hover:underline"
              >
                查看所有文章
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
} 