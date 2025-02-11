import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FacebookShareButton, LineShareButton, TwitterShareButton } from 'react-share'
import { FaFacebook, FaLine, FaTwitter } from 'react-icons/fa'
import { formatDate, getImageUrl, generateShareLinks } from '@/lib/utils'
import { BlogPostProps } from '@/types/blog'

// Portable Text 組件配置
const components = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <div className="relative aspect-video">
          <Image
            src={getImageUrl(value.asset.url, {
              width: 1200,
              height: 675,
            })}
            alt={value.alt || ''}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        {value.caption && (
          <p className="mt-2 text-center text-sm text-gray-500">{value.caption}</p>
        )}
      </div>
    ),
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-brand-red hover:underline"
        >
          {children}
        </a>
      )
    },
  },
}

export default function BlogPost({ post, relatedPosts }: BlogPostProps) {
  const [currentUrl, setCurrentUrl] = useState('')
  const shareLinks = generateShareLinks(currentUrl, post.title)

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  return (
    <article className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 文章標題 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
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
          </motion.div>

          {/* 作者資訊 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-between mb-8 pb-8 border-b"
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
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
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(post.publishedAt)}
                  <span className="mx-2">·</span>
                  {post.readingTime} 分鐘閱讀
                </p>
              </div>
            </div>

            {/* 社交分享 */}
            <div className="flex space-x-2">
              <FacebookShareButton url={currentUrl} quote={post.title}>
                <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <FaFacebook className="w-5 h-5 text-[#1877f2]" />
                </div>
              </FacebookShareButton>
              <LineShareButton url={currentUrl} title={post.title}>
                <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <FaLine className="w-5 h-5 text-[#00b900]" />
                </div>
              </LineShareButton>
              <TwitterShareButton url={currentUrl} title={post.title}>
                <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <FaTwitter className="w-5 h-5 text-[#1da1f2]" />
                </div>
              </TwitterShareButton>
            </div>
          </motion.div>

          {/* 主圖 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src={getImageUrl(post.mainImage.asset.url, {
                  width: 1200,
                  height: 675,
                })}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {post.mainImage.caption && (
              <p className="mt-2 text-center text-sm text-gray-500">
                {post.mainImage.caption}
              </p>
            )}
          </motion.div>

          {/* 文章內容 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <PortableText value={post.body} components={components} />
          </motion.div>

          {/* 作者簡介 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 p-6 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={getImageUrl(post.author.image.asset.url, {
                    width: 200,
                    height: 200,
                  })}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">{post.author.name}</h3>
                <p className="text-gray-600">{post.author.bio}</p>
              </div>
            </div>
          </motion.div>

          {/* 相關文章 */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold mb-6">相關文章</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost._id}
                    href={`/blog/${relatedPost.slug.current}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                      <div className="relative h-48">
                        <Image
                          src={getImageUrl(relatedPost.mainImage.asset.url, {
                            width: 800,
                            height: 400,
                          })}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-brand-red transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </article>
  )
} 