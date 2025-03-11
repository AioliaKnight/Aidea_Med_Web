'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import { urlForImage } from '@/lib/sanity/client'
import { Post } from '@/types/blog'
import { ImageViewer } from '@/components/common/blog/ImageViewer'
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
      code: ({ value }: any) => (
        <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-4">
          <code className="text-sm font-mono">{value.code}</code>
        </pre>
      ),
      callout: ({ value }: any) => (
        <div className={`p-4 rounded-lg my-4 ${
          value.type === 'info' 
            ? 'bg-blue-50 border-l-4 border-blue-500' 
            : value.type === 'warning'
            ? 'bg-yellow-50 border-l-4 border-yellow-500'
            : value.type === 'error'
            ? 'bg-red-50 border-l-4 border-red-500'
            : 'bg-gray-50 border-l-4 border-gray-500'
        }`}>
          <p className="text-sm">{value.text}</p>
        </div>
      ),
    },
    marks: {
      link: ({ value, children }: any) => {
        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
        return (
          <a
            href={value?.href}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className="text-primary hover:underline"
          >
            {children}
          </a>
        )
      },
      highlight: ({ children }: any) => (
        <span className="bg-yellow-100 px-1 rounded">{children}</span>
      ),
    },
    block: {
      h2: ({ children }: any) => (
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mt-8 mb-4"
        >
          {children}
        </motion.h2>
      ),
      h3: ({ children }: any) => (
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold mt-6 mb-3"
        >
          {children}
        </motion.h3>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-gray-700">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside space-y-2 my-4">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside space-y-2 my-4">
          {children}
        </ol>
      ),
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm p-6 md:p-8"
    >
      {/* 摘要 */}
      <div className="text-gray-600 text-lg border-l-4 border-primary pl-4 italic mb-8">
        {post.excerpt}
      </div>

      {/* 內容 */}
      <div className="prose prose-lg max-w-none">
        <PortableText value={post.content} components={components} />
      </div>

      {/* 圖片檢視器 */}
      {selectedImage && (
        <ImageViewer
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </motion.div>
  )
} 