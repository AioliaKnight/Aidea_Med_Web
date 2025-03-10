'use client'

import { useState, useEffect, useCallback } from 'react'
import { PortableText, PortableTextComponentProps } from '@portabletext/react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/client'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import Link from 'next/link'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

// 文章型別定義
interface Post {
  _id: string
  title: string
  publishedAt: string
  updatedAt?: string
  excerpt: string
  mainImage?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
    caption?: string
  }
  categories: Array<{
    _id: string
    title: string
    description?: string
    slug: string
  }>
  author: {
    name: string
    image?: {
      _type: 'image'
      asset: {
        _ref: string
        _type: 'reference'
      }
    }
    bio?: string
  }
  content: any[]
  body?: any[] // 兼容舊的內容結構
  related?: Array<{
    _id: string
    title: string
    slug: string
    publishedAt: string
    excerpt: string
    mainImage?: {
      _type: 'image'
      asset: {
        _ref: string
        _type: 'reference'
      }
      alt?: string
      caption?: string
    }
    categories: Array<{
      title: string
    }>
  }>
  readingTime?: number
  status: 'draft' | 'published'
}

interface Props {
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
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-full max-h-full">
        <button 
          className="absolute -top-12 right-0 text-white hover:text-primary transition-colors p-2"
          onClick={onClose}
          aria-label="關閉圖片"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <motion.img 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          src={src} 
          alt={alt} 
          className="max-w-full max-h-[90vh] object-contain" 
          onClick={(e) => e.stopPropagation()}
        />
        {alt && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-center mt-2 text-sm"
          >
            {alt}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

// 文章導航組件
const ArticleNavigation = ({ 
  tableOfContents,
  activeId 
}: { 
  tableOfContents: Array<{ id: string, text: string, level: number }>
  activeId: string
}) => {
  return (
    <nav className="space-y-1 max-h-[30vh] overflow-y-auto pr-2 styled-scrollbar">
      {tableOfContents.map((item, index) => (
        <motion.a
          key={index}
          href={`#${item.id}`}
          className={`block py-1.5 border-l-2 pl-3 transition-all ${
            activeId === item.id ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
          } ${
            item.level === 1 ? 'font-medium' : item.level === 3 ? 'text-sm pl-4' : 'pl-4'
          }`}
          whileHover={{ x: 5 }}
        >
          {item.text}
        </motion.a>
      ))}
    </nav>
  );
};

// 閱讀進度條組件
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const readingProgress = (scrollTop / docHeight) * 100;
      setProgress(readingProgress);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
      <motion.div
        className="h-full bg-primary"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
};

// 分享按鈕組件
const ShareButton = ({ platform, url, title }: { platform: string, url: string, title: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const shareConfig = {
    facebook: {
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: 'M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z'
    },
    twitter: {
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      icon: 'M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z'
    },
    linkedin: {
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
    },
    line: {
      url: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
      icon: 'M52.62 103.78c-11.42.33-22.39-4.95-30.7-13.14-9.35-9.23-13.94-21.37-14.49-34.03-.55-12.63 3.36-25.46 12.18-34.93 8.51-9.15 20.69-14.79 32.96-15 13.23-.22 26.64 5.07 36.19 14.18 10.43 9.73 15.84 23.61 15.74 37.48-.1 13.69-5.28 27.36-15.22 37.27-8.9 8.84-20.97 13.14-32.69 13.44-1.32 0-2.64 0-3.97-.27z M39.86 47.53h-7.55c-1.12 0-2.03.9-2.03 2.01v16.08c0 1.11.91 2.02 2.03 2.02h7.55c1.12 0 2.03-.91 2.03-2.02V49.54c0-1.11-.91-2.01-2.03-2.01z M75.56 47.53h-7.55c-1.12 0-2.03.9-2.03 2.01v16.08c0 1.11.91 2.02 2.03 2.02h7.55c1.12 0 2.03-.91 2.03-2.02V49.54c0-1.11-.91-2.01-2.03-2.01z M66.45 56.19H59.2c-1.04.03-1.88.9-1.85 1.94-.03 1.04.81 1.91 1.85 1.94h7.25c1.05-.03 1.88-.9 1.85-1.94.04-1.04-.8-1.91-1.85-1.94-1.94-1.94z M50.19 47.53h-1.92c-1.12 0-2.03.9-2.03 2.01v7.17h5.99v-7.17c0-1.11-.92-2.01-2.04-2.01z M52.23 58.13h-5.99v7.49c0 1.11.91 2.02 2.03 2.02h1.92c1.12 0 2.04-.91 2.04-2.02v-7.49z'
    },
    copy: {
      url: url,
      icon: 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
    }
  };

  const handleShare = async () => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    } else {
      window.open(shareConfig[platform as keyof typeof shareConfig].url, '_blank');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="relative group"
      aria-label={platform === 'copy' ? '複製連結' : `分享到 ${platform}`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" stroke="currentColor" strokeWidth={platform === 'copy' ? 1.5 : 0}>
        <path d={shareConfig[platform as keyof typeof shareConfig].icon} />
      </svg>
      {isCopied && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded"
        >
          已複製連結
        </motion.span>
      )}
    </motion.button>
  );
};

// 回到頂部按鈕組件
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg z-40"
      aria-label="回到頂部"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </motion.button>
  );
};

// 訂閱表單組件
const SubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('請輸入有效的電子郵件地址');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmissionStatus('success');
      setEmail('');
    } catch (err) {
      setSubmissionStatus('error');
      setError('訂閱失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
    >
      <div className="max-w-md mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">訂閱我們的最新文章</h3>
        <p className="text-gray-200 mb-6">
          訂閱我們的電子報，獲取最新的數位行銷趨勢和牙醫診所經營策略
        </p>
        
        {submissionStatus === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/20 text-green-200 p-4 rounded-lg mb-6 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>感謝您的訂閱！我們將定期發送最新內容到您的信箱。</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="請輸入您的電子郵件地址"
                className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={isSubmitting}
              />
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-300 text-sm mt-1 text-left"
                >
                  {error}
                </motion.p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-white text-primary rounded-md font-medium hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  處理中...
                </span>
              ) : (
                '立即訂閱'
              )}
            </motion.button>
            
            <p className="text-xs text-gray-300 mt-2">
              訂閱即表示您同意接收我們的電子報。您可以隨時取消訂閱。
            </p>
          </form>
        )}
      </div>
    </motion.div>
  );
};

// 相關文章卡片組件
const RelatedArticleCard = ({ article }: { article: NonNullable<Post['related']>[number] }) => {
  const imageUrl = article.mainImage ? urlForImage(article.mainImage).width(400).height(240).url() : '/images/placeholder.jpg';
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link 
        href={`/blog/${article.slug}`} 
        className="flex flex-col h-full overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
      >
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {article.categories && article.categories[0] && (
            <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs px-2 py-1 rounded">
              {article.categories[0].title}
            </span>
          )}
        </div>
        
        <div className="flex-1 p-5 flex flex-col">
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {article.excerpt || '閱讀更多...'}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <time className="text-xs text-gray-500">
              {format(new Date(article.publishedAt), 'PPP', { locale: zhTW })}
            </time>
            
            <span className="text-primary text-sm font-medium flex items-center">
              閱讀更多
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// 修正 PortableText 組件的類型
const portableTextComponents = {
  types: {
    image: ({ value }: PortableTextComponentProps<any>) => {
      return (
        <div className="my-8">
          <Image
            src={urlForImage(value).url()}
            alt={value.alt || '文章圖片'}
            width={800}
            height={500}
            className="rounded-lg"
          />
          {value.caption && (
            <p className="text-sm text-gray-500 mt-2 text-center">{value.caption}</p>
          )}
        </div>
      );
    },
    code: ({ value }: PortableTextComponentProps<any>) => {
      return (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
          <code>{value.code}</code>
        </pre>
      );
    }
  },
  block: {
    h1: ({ children }: PortableTextComponentProps<any>) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: PortableTextComponentProps<any>) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: PortableTextComponentProps<any>) => (
      <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>
    ),
    normal: ({ children }: PortableTextComponentProps<any>) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    )
  }
} as const;

export default function BlogPost({ post }: Props) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [coverViewerOpen, setCoverViewerOpen] = useState(false);
  const [fontSize, setFontSize] = useState('md');
  const [activeId, setActiveId] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
    
    const content = post.content || post.body || [];
    const textContent = extractTextFromContent(content);
    setReadingTime(estimateReadingTime(textContent));

    const savedFontSize = localStorage.getItem('blog-font-size');
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }

    // 設置 Intersection Observer 來追蹤標題
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -80% 0px',
        threshold: 0.1
      }
    );

    // 觀察所有標題元素
    document.querySelectorAll('h1, h2, h3').forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      document.querySelectorAll('h1, h2, h3').forEach((heading) => {
        observer.unobserve(heading);
      });
    };
  }, [post]);

  const changeFontSize = (size: string) => {
    setFontSize(size);
    localStorage.setItem('blog-font-size', size);
  };

  const getTableOfContents = () => {
    const content = post.content || post.body || [];
    if (!content || !Array.isArray(content)) return [];
    
    return content
      .filter(block => block._type === 'block' && ['h1', 'h2', 'h3'].includes(block.style))
      .map(block => ({
        text: block.children.map((child: any) => child.text).join(''),
        level: block.style === 'h1' ? 1 : block.style === 'h2' ? 2 : 3,
        id: `heading-${block.children.map((child: any) => child.text).join('').toLowerCase().replace(/\s+/g, '-')}`
      }));
  };
  
  const tableOfContents = getTableOfContents();

  const coverImageUrl = post.mainImage ? 
    urlForImage(post.mainImage)
      .auto('format')
      .width(1200)
      .quality(85)
      .url() 
    : null;
    
  const coverThumbnailUrl = post.mainImage ? 
    urlForImage(post.mainImage)
      .auto('format')
      .width(30)
      .blur(10)
      .quality(30)
      .url() 
    : null;

  const openCoverViewer = useCallback(() => {
    setCoverViewerOpen(true);
  }, []);

  const closeCoverViewer = useCallback(() => {
    setCoverViewerOpen(false);
  }, []);

  return (
    <ErrorBoundary>
      <article className="min-h-screen bg-gray-50/50" data-url={currentUrl}>
        <ReadingProgress />
        
        <div className="container mx-auto px-4 py-10 md:py-20">
          {/* 文章標題區 */}
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-4 sm:p-8 mb-6 sm:mb-10"
          >
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 justify-center">
              {post.categories && post.categories.length > 0 ? (
                post.categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/blog?category=${category.slug}`}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {category.title}
                  </Link>
                ))
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  診所經營
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 text-center leading-tight">
              {post.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 text-center leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center text-gray-500 text-sm gap-3 sm:gap-6 border-t border-gray-100 pt-4 sm:pt-6">
              <time className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {format(new Date(post.publishedAt), 'PPP', { locale: zhTW })}
              </time>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                閱讀時間約 {readingTime} 分鐘
              </span>
            </div>
          </motion.header>

          {/* 主題標語 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-6 sm:mb-10 text-center"
          >
            <div className="bg-primary/5 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-primary mb-2">
                讓診所與醫生專注醫療服務，讓我們專注行銷
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                專業的醫療行銷團隊，為您的診所打造最佳品牌形象
              </p>
            </div>
          </motion.div>

          {/* 主要封面圖片 */}
          {post.mainImage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-5xl mx-auto mb-6 sm:mb-10 relative group"
            >
              <div 
                className="rounded-lg sm:rounded-xl overflow-hidden shadow-md relative cursor-zoom-in transform transition-transform hover:shadow-lg"
                onClick={openCoverViewer}
              >
                {coverThumbnailUrl && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-md opacity-60"
                    style={{ backgroundImage: `url(${coverThumbnailUrl})` }}
                    aria-hidden="true"
                  />
                )}
                
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}
                
                <div className="aspect-w-16 aspect-h-9">
                  <Image
                    src={coverImageUrl || ''}
                    alt={post.title}
                    fill
                    className={`object-cover transition-opacity duration-500 ${
                      isImageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
                </div>
                
                <div className="absolute bottom-4 right-4 bg-white/90 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              
              <AnimatePresence>
                {coverViewerOpen && (
                  <ImageViewer
                    src={urlForImage(post.mainImage).auto('format').quality(100).url()}
                    alt={post.title}
                    onClose={closeCoverViewer}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* 內容區域與側邊欄 */}
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-8">
            {/* 側邊欄 */}
            <motion.aside 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:w-72 md:sticky md:top-20 md:self-start space-y-4 sm:space-y-6 order-2 md:order-1"
            >
              {/* 閱讀設置 */}
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-base sm:text-lg mb-3 flex items-center text-gray-800">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2m-18 0v14a2 2 0 002 2h14a2 2 0 002-2V7H3z"/>
                  </svg>
                  閱讀體驗
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">字體大小</span>
                  <div className="flex space-x-1 sm:space-x-2">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => changeFontSize('sm')}
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded transition-colors ${
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
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded transition-colors ${
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
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded transition-colors ${
                        fontSize === 'lg' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label="大字體"
                    >
                      <span className="text-base">大</span>
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* 目錄 */}
              {tableOfContents.length > 0 && (
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold text-base sm:text-lg mb-3 flex items-center text-gray-800">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    文章大綱
                  </h3>
                  <ArticleNavigation 
                    tableOfContents={tableOfContents}
                    activeId={activeId}
                  />
                </div>
              )}
              
              {/* 分享按鈕 */}
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-base sm:text-lg mb-3 flex items-center text-gray-800">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  分享文章
                </h3>
                <div className="flex space-x-3 sm:space-x-4 text-gray-600">
                  <ShareButton platform="facebook" url={currentUrl} title={post.title} />
                  <ShareButton platform="twitter" url={currentUrl} title={post.title} />
                  <ShareButton platform="linkedin" url={currentUrl} title={post.title} />
                  <ShareButton platform="line" url={currentUrl} title={post.title} />
                  <ShareButton platform="copy" url={currentUrl} title={post.title} />
                </div>
              </div>
            </motion.aside>

            {/* 文章內容 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`md:flex-1 order-1 md:order-2 bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-10`}
            >
              <div className={`prose ${
                fontSize === 'sm' ? 'prose-sm' : 
                fontSize === 'lg' ? 'prose-xl' : 'prose-base'
              } max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:my-4 sm:prose-img:my-8`}>
                {post.content ? (
                  <PortableText
                    value={post.content}
                    components={portableTextComponents}
                  />
                ) : post.body ? (
                  <PortableText
                    value={post.body}
                    components={portableTextComponents}
                  />
                ) : (
                  <div className="p-6 bg-yellow-50 rounded-lg my-8">
                    <p className="text-yellow-700">這篇文章尚未添加內容。</p>
                  </div>
                )}
              </div>
              
              {/* 文章標籤 */}
              {post.categories && post.categories.length > 0 && (
                <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm sm:text-base text-gray-500">相關主題:</span>
                    {post.categories.map((category) => (
                      <Link 
                        href={`/blog?category=${category.slug}`} 
                        key={category._id}
                        className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-full text-xs sm:text-sm transition-colors"
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* 訂閱表單 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto mt-8 sm:mt-16"
          >
            <div className="bg-primary rounded-lg p-4 sm:p-8 text-center">
              <SubscriptionForm />
            </div>
          </motion.div>
          
          {/* 相關文章 */}
          {post.related && post.related.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-4xl mx-auto mt-8 sm:mt-16"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-gray-800">
                更多診所經營指南
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                {post.related.map((relatedPost) => (
                  <RelatedArticleCard key={relatedPost._id} article={relatedPost} />
                ))}
              </div>
            </motion.div>
          )}

          {/* 返回文章列表 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center mt-8 sm:mt-12"
          >
            <Link
              href="/blog"
              className="flex items-center text-primary hover:bg-primary/5 py-2 px-4 rounded-full transition-colors text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回診所經營專欄
            </Link>
          </motion.div>
        </div>
        
        {/* 功能按鈕區 */}
        <div className="fixed bottom-4 sm:bottom-8 left-4 sm:left-8 z-10 no-print">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.print()}
            className="bg-white text-gray-700 p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="列印文章"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </motion.button>
        </div>
        
        {/* 回到頂部按鈕 */}
        <BackToTop />
      </article>
      
      {/* 自定義滾動條樣式 */}
      <style jsx global>{`
        .styled-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .styled-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .styled-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        
        .styled-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </ErrorBoundary>
  );
} 