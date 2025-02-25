'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { Spinner } from '@/components/common/Spinner'
import Link from 'next/link'

interface Post {
  title: string
  publishedAt: string
  excerpt: string
  mainImage?: {
    asset: {
      _ref: string
    }
  }
  categories: Array<{
    title: string
    description?: string
  }>
  content: any[]
  related?: Array<{
    title: string
    slug: string
    publishedAt: string
    excerpt: string
    mainImage?: {
      asset: {
        _ref: string
      }
    }
    categories: Array<{
      title: string
    }>
  }>
}

interface Props {
  post: Post
}

const PortableImage = ({ value }: { value: any }) => {
  const [loading, setLoading] = useState(true)
  return (
    <div className="relative aspect-w-16 aspect-h-9 my-8">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Spinner />
        </div>
      )}
      <Image
        src={urlForImage(value).url()}
        alt={value.alt || ''}
        fill
        className="object-cover rounded-lg"
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  )
}

export default function BlogPost({ post }: Props) {
  const [isImageLoading, setIsImageLoading] = useState(true)

  return (
    <ErrorBoundary>
      <article className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          {/* 文章標題區 */}
          <header className="max-w-4xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              {post.categories.map((category) => (
                <span
                  key={category.title}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {category.title}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            <time className="text-gray-500">
              {format(new Date(post.publishedAt), 'PPP', { locale: zhTW })}
            </time>
          </header>

          {/* 主要圖片 */}
          {post.mainImage && (
            <div className="max-w-4xl mx-auto mb-12">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden relative">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Spinner />
                  </div>
                )}
                <Image
                  src={urlForImage(post.mainImage).url()}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                  onLoadingComplete={() => setIsImageLoading(false)}
                />
              </div>
            </div>
          )}

          {/* 文章內容 */}
          <div className="max-w-4xl mx-auto prose prose-lg">
            <PortableText
              value={post.content}
              components={{
                types: {
                  image: PortableImage,
                  code: ({ value }) => (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{value.code}</code>
                    </pre>
                  ),
                },
              }}
            />
          </div>

          {/* 相關文章 */}
          {post.related && post.related.length > 0 && (
            <div className="max-w-4xl mx-auto mt-16">
              <h2 className="text-3xl font-bold text-center mb-8">相關文章</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {post.related.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow">
                      <div className="aspect-w-16 aspect-h-9 relative">
                        {relatedPost.mainImage ? (
                          <Image
                            src={urlForImage(relatedPost.mainImage).url()}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          {relatedPost.categories.map((category) => (
                            <span
                              key={category.title}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                            >
                              {category.title}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <time className="text-sm text-gray-500">
                          {format(new Date(relatedPost.publishedAt), 'PPP', {
                            locale: zhTW,
                          })}
                        </time>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 分享與訂閱區 */}
          <div className="max-w-4xl mx-auto mt-16 p-8 bg-gray-50 rounded-2xl">
            <h2 className="text-2xl font-bold text-center mb-6">
              喜歡這篇文章嗎？
            </h2>
            <p className="text-center text-gray-600 mb-8">
              訂閱我們的電子報，獲取更多醫療行銷相關的專業內容。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="請輸入您的電子郵件"
                className="flex-1 px-6 py-3 rounded-full border border-gray-300"
              />
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
                訂閱
              </button>
            </div>
          </div>
        </div>
      </article>
    </ErrorBoundary>
  )
} 