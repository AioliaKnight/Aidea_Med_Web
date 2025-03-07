'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { urlForImage } from '@/lib/sanity/client'
import { Post } from '@/types/blog'
import { ImageViewer } from '@/components/common/blog/ImageViewer'
import { ShareButtons } from '@/components/common/blog/ShareButtons'
import { BackToTop } from '@/components/common/blog/BackToTop'
import Image from 'next/image'

interface BlogPostProps {
  post: Post
}

export const BlogPost = ({ post }: BlogPostProps) => {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

  const components = {
    types: {
      image: ({ value }: any) => {
        const imageUrl = urlForImage(value).url()
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="my-8"
          >
            <div className="relative">
              <Image
                src={imageUrl}
                alt={value.alt || ''}
                width={1200}
                height={675}
                className="w-full rounded-lg shadow-lg cursor-pointer"
                onClick={() => setSelectedImage({ src: imageUrl, alt: value.alt || '' })}
              />
            </div>
            {value.caption && (
              <p className="text-center text-gray-600 mt-2">{value.caption}</p>
            )}
          </motion.div>
        )
      },
    },
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* 標題區塊 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-center space-x-4 text-gray-600">
            <span>{format(new Date(post.publishedAt), 'PPP', { locale: zhTW })}</span>
            {post.updatedAt && (
              <>
                <span>•</span>
                <span>更新於 {format(new Date(post.updatedAt), 'PPP', { locale: zhTW })}</span>
              </>
            )}
          </div>
        </div>

        {/* 主圖 */}
        {post.mainImage && (
          <div className="relative aspect-video mb-8">
            <Image
              src={urlForImage(post.mainImage).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        )}

        {/* 作者資訊 */}
        <div className="flex items-center space-x-4">
          {post.author?.image && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={urlForImage(post.author.image).url()}
                alt={post.author.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          )}
          <div>
            <h2 className="font-medium">{post.author.name}</h2>
            {post.author.bio && (
              <p className="text-gray-600 text-sm">{post.author.bio}</p>
            )}
          </div>
        </div>

        {/* 分類標籤 */}
        <div className="flex flex-wrap gap-2">
          {post.categories.map((category) => (
            <span
              key={category._id}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {category.title}
            </span>
          ))}
        </div>

        {/* 摘要 */}
        <div className="text-gray-600 text-lg">{post.excerpt}</div>

        {/* 內容 */}
        <div className="prose prose-lg max-w-none">
          <PortableText value={post.content} components={components} />
        </div>

        {/* 分享按鈕 */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-medium mb-4">分享文章</h3>
          <ShareButtons url={window.location.href} title={post.title} />
        </div>

        {/* 相關文章 */}
        {post.related && post.related.length > 0 && (
          <div className="border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">相關文章</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {post.related.map((relatedPost) => (
                <motion.div
                  key={relatedPost._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  {relatedPost.mainImage && (
                    <div className="relative aspect-video mb-4">
                      <Image
                        src={urlForImage(relatedPost.mainImage).url()}
                        alt={relatedPost.mainImage.alt || relatedPost.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-medium mb-2">{relatedPost.title}</h4>
                    <p className="text-gray-600 text-sm">{relatedPost.excerpt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* 圖片檢視器 */}
      {selectedImage && (
        <ImageViewer
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* 回到頂部按鈕 */}
      <BackToTop />
    </article>
  )
} 