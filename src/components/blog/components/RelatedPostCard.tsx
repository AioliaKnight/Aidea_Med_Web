/**
 * 相關文章卡片組件
 * 用於顯示相關文章的卡片式佈局
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Post, formatDate } from '@/lib/blog-utils'
import { trackRelatedBlogClick } from '@/lib/analytics'
import { BLOG_STYLES, BLOG_ANIMATIONS } from '../types'

interface RelatedPostCardProps {
  post: Post
  index: number
  originPostId?: string
}

const RelatedPostCard: React.FC<RelatedPostCardProps> = ({ post, index, originPostId }) => {
  // 處理點擊事件
  const handleClick = () => {
    if (originPostId) {
      trackRelatedBlogClick(originPostId, post.slug, post.title, index + 1)
    }
  }

  return (
    <motion.div
      initial={BLOG_ANIMATIONS.FADE_IN.initial}
      animate={BLOG_ANIMATIONS.FADE_IN.animate}
      transition={{ 
        ...BLOG_ANIMATIONS.FADE_IN.transition,
        delay: 0.1 + (index * 0.1)
      }}
      className={BLOG_STYLES.CARD_BASE}
    >
      <Link href={`/blog/${post.slug}`} className="block" onClick={handleClick}>
        <div className="relative h-40 sm:h-48 w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform hover:scale-105 duration-500"
          />
          {post.category && (
            <span className="absolute top-3 left-3 bg-white/90 text-primary text-xs font-medium px-2 py-1 rounded-full">
              {post.category}
            </span>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 leading-tight line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatDate(post.publishedAt)}</span>
            {post.readTime && <span>{post.readTime} 分鐘閱讀</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default RelatedPostCard 