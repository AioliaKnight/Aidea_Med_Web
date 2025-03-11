'use client'

import { useState, useEffect, useCallback } from 'react'
import { PortableText, PortableTextComponentProps } from '@portabletext/react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import Link from 'next/link'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Post } from '@/types/blog'
import { BackToTop } from '../common/blog/BackToTop'

// 文章內容閱讀時間預估函數
function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200; // 假設平均閱讀速度為每分鐘200字
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// 提取文章純文本內容（用於計算閱讀時間）
function extractTextFromContent(content: any[]): string {
  if (!content || !Array.isArray(content)) return '';
  
  return content.map(block => {
    // 針對不同類型的內容塊提取文本
    if (block._type === 'block' && block.children) {
      return block.children.map((child: any) => child.text || '').join(' ');
    }
    return '';
  }).join(' ');
}

interface BlogArticleProps {
  post: Post
}

// 圖片查看器組件
interface ImageViewerProps {
  src: string
  alt: string
  onClose: () => void
}

const ImageViewer = ({ src, alt, onClose }: ImageViewerProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative max-w-5xl max-h-[90vh]">
        <Image 
          src={src} 
          alt={alt} 
          width={1920}
          height={1080}
          className="max-w-full max-h-[80vh] object-contain"
        />
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          aria-label="關閉"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function BlogArticle({ post }: BlogArticleProps) {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showToc, setShowToc] = useState(false);
  
  // 計算閱讀時間
  const readingTime = post.readingTime || 
    estimateReadingTime(extractTextFromContent(post.content || []));
  
  // 字體大小切換
  const changeFontSize = (size: 'sm' | 'md' | 'lg') => {
    setFontSize(size);
  };

  // 獲取文章目錄
  const getTableOfContents = useCallback(() => {
    if (!post.content) return [];
    
    return post.content
      .filter((block: any) => 
        block._type === 'block' && 
        ['h2', 'h3'].includes(block.style) && 
        block.children && 
        block.children.length > 0
      )
      .map((block: any) => ({
        text: block.children.map((child: any) => child.text).join(''),
        level: block.style === 'h2' ? 2 : 3,
        id: block.children.map((child: any) => child.text).join('').toLowerCase().replace(/\s+/g, '-')
      }));
  }, [post.content]);

  // 目錄導航
  const TableOfContents = () => {
    const toc = getTableOfContents();
    
    if (toc.length === 0) return null;
    
    return (
      <nav className="p-4 mb-6 text-sm bg-gray-50 rounded-lg">
        <h3 className="text-md font-semibold mb-2">文章目錄</h3>
        {toc.map((item: any, index: number) => (
          <motion.a 
            key={index}
            href={`#${item.id}`}
            className={`block mb-1 ${
              item.level === 2 ? '' : 'pl-4'
            } hover:text-primary text-gray-700`}
            whileHover={{ x: 5 }}
          >
            {item.text}
          </motion.a>
        ))}
      </nav>
    );
  };

  // Portable Text 組件配置
  const components = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        
        try {
          const imageUrl = urlForImage(value);
          const url = typeof imageUrl === 'string' 
            ? imageUrl 
            : typeof imageUrl.url === 'function' ? imageUrl.url() : '';
            
          if (!url) return null;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="my-8"
            >
              <div className="relative">
                <Image
                  src={url}
                  alt={value.alt || ''}
                  width={1200}
                  height={675}
                  className="w-full rounded-lg shadow-lg cursor-pointer"
                  onClick={() => setSelectedImage({ src: url, alt: value.alt || '' })}
                />
              </div>
              {value.caption && (
                <p className="text-center text-gray-600 mt-2">{value.caption}</p>
              )}
            </motion.div>
          );
        } catch (error) {
          console.error('圖片渲染錯誤:', error);
          return <div className="text-red-500">圖片載入失敗</div>;
        }
      },
      // ...其他自定義組件設定...
    },
    marks: {
      link: ({ value, children }: any) => {
        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
        return (
          <a
            href={value?.href}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className="text-primary hover:underline"
          >
            {children}
          </a>
        );
      },
      // ...其他自定義標記設定...
    },
    block: {
      h2: ({ children }: any) => {
        const id = children.join('').toLowerCase().replace(/\s+/g, '-');
        return (
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            id={id}
            className="text-2xl font-bold mt-8 mb-4"
          >
            {children}
          </motion.h2>
        );
      },
      h3: ({ children }: any) => {
        const id = children.join('').toLowerCase().replace(/\s+/g, '-');
        return (
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            id={id}
            className="text-xl font-bold mt-6 mb-3"
          >
            {children}
          </motion.h3>
        );
      },
      // ...其他區塊元素設定...
    }
  };

  return (
    <ErrorBoundary>
      <article className={`max-w-4xl mx-auto px-4 sm:px-6 relative ${
        fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
      }`}>
        {/* 閱讀時間與發布日期 */}
        <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>閱讀時間約 {readingTime} 分鐘</span>
          </div>
          <div>
            <time dateTime={post.publishedAt}>
              {format(new Date(post.publishedAt), 'PP', { locale: zhTW })}
            </time>
          </div>
        </div>

        {/* 目錄 */}
        <TableOfContents />

        {/* 正文內容 */}
        <div className="prose prose-lg max-w-none">
          <PortableText
            value={post.content || []}
            components={components}
          />
        </div>

        {/* 圖片查看器 */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ImageViewer
                src={selectedImage.src}
                alt={selectedImage.alt}
                onClose={() => setSelectedImage(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 文章控制選項 */}
        <div className="flex items-center justify-between fixed bottom-4 right-4 z-30">
          <div className="flex space-x-2 bg-white rounded-full shadow-lg p-2">
            {/* 字體大小控制 */}
            <div className="relative group">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                aria-label="字體大小"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </motion.button>
              
              <div className="absolute invisible group-hover:visible bottom-12 right-0 bg-white rounded-lg shadow-lg p-3 w-auto">
                <div className="flex flex-col space-y-3">
                  <span className="text-sm text-gray-500">字體大小</span>
                  <div className="flex space-x-2">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => changeFontSize('sm')}
                      className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                        fontSize === 'sm' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label="小字體"
                    >
                      <span className="text-xs">小</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => changeFontSize('md')}
                      className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                        fontSize === 'md' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label="中字體"
                    >
                      <span className="text-sm">中</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => changeFontSize('lg')}
                      className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                        fontSize === 'lg' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label="大字體"
                    >
                      <span className="text-base">大</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 回到頂部按鈕 */}
        <BackToTop />
      </article>
    </ErrorBoundary>
  );
} 