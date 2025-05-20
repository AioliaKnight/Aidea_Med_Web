import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getBlogPost, getRelatedPosts } from '@/lib/blog-server'
import { generateBlogMetadata, type Post } from '@/lib/blog-utils'
import { BlogDetail } from '@/components/blog'
import { medicalContentViewport } from '@/app/viewport'

// 定義博客文章類型
interface BlogPostAuthor {
  name: string;
  title?: string;
  avatar?: string;
  bio?: string;
  credentials?: string;
  expertise?: string[];
  socialLinks?: string[];
  slug?: string;
}

interface BlogPostReviewer {
  name: string;
  url?: string;
  title?: string;
  description?: string;
}

interface Reference {
  authors?: string;
  title?: string;
  journal?: string;
  year?: string | number;
  doi?: string;
  url?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  readTime?: number;
  publishedAt: string;
  updatedAt?: string;
  lastReviewed?: string;
  coverImage: string;
  author: BlogPostAuthor;
  tags: string[];
  category?: string;
  specialty?: string;
  citations?: any[];
  reviewedBy?: BlogPostReviewer;
  audienceType?: string;
  references?: Reference[];
}

// 指定此頁面使用醫療內容優化的 viewport 設定
export const viewport = medicalContentViewport

// 生成元資料
export async function generateMetadata({ params }: { params: { slug: string } }) {
  // 先await params再使用其屬性
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: '找不到文章 | Aidea:Med 醫療行銷顧問'
    }
  }
  
  return generateBlogMetadata(post)
}

// 生成結構化資料 Schema.org - 優化版本
function generateBlogStructuredData(post: BlogPost) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
  const postUrl = `${baseUrl}/blog/${post.slug}`

  // 處理文章內容，移除HTML標籤以用於結構化資料
  const cleanContent = post.content.replace(/<[^>]*>/g, '')
  
  // 計算閱讀時間，如果沒有提供則使用一個估算
  const readingTime = post.readTime || Math.ceil(cleanContent.split(/\s+/).length / 200)
  
  // 擷取關鍵段落作為文章摘錄
  const excerpt = post.summary || cleanContent.substring(0, 150) + '...'
  
  // 從內容中提取前三個段落，用於articleBody
  const firstParagraphs = cleanContent
    .split(/(?:\r?\n){2,}/)
    .slice(0, 3)
    .join('\n\n')

  // 獲取或創建醫療專業標籤
  const medicalTags = post.tags.filter((tag: string) => 
    ['醫療專業知識', '牙醫臨床案例', '醫療行銷策略', '醫學研究', '牙科專業知識', '衛教資訊']
    .includes(tag)
  );

  // 如果作者有專業認證，添加該信息
  const authorCredentials = post.author.credentials || '醫療行銷專家';
  const authorExpertise = post.author.expertise || ['醫療行銷', '診所品牌策略'];
  
  // 分析內容中的FAQ區塊
  const faqMatch = post.content.match(/<div class="faq-section">([\s\S]*?)<\/div>/);
  let faqItems = [];
  
  if (faqMatch) {
    // 匹配每個問答對
    const questionMatches = faqMatch[1].matchAll(/<div class="faq-item">\s*<h[34]>(.*?)<\/h[34]>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g);
    
    for (const match of questionMatches) {
      if (match && match.length >= 3) {
        faqItems.push({
          "@type": "Question",
          "name": match[1].trim().replace(/<[^>]*>/g, ''),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": match[2].trim().replace(/<[^>]*>/g, '')
          }
        });
      }
    }
  }
  
  // 分析內容中的HowTo區塊
  const howToMatch = post.content.match(/<div class="step-guide">([\s\S]*?)<\/div>/);
  let howToData = null;
  
  if (howToMatch) {
    const titleMatch = howToMatch[1].match(/<h[23][^>]*>(.*?)<\/h[23]>/);
    const howToTitle = titleMatch ? titleMatch[1].trim().replace(/<[^>]*>/g, '') : '操作指南';
    
    const descriptionMatch = howToMatch[1].match(/<p class="intro">([\s\S]*?)<\/p>/);
    const howToDescription = descriptionMatch ? descriptionMatch[1].trim().replace(/<[^>]*>/g, '') : '';
    
    // 匹配所有步驟
    const stepMatches = howToMatch[1].matchAll(/<li[^>]*>\s*<h\d[^>]*>(.*?)<\/h\d>\s*<p>([\s\S]*?)<\/p>[\s\S]*?<\/li>/g);
    const steps = [];
    
    let stepNumber = 1;
    for (const match of stepMatches) {
      if (match && match.length >= 3) {
        steps.push({
          "@type": "HowToStep",
          "url": `${postUrl}#step-${stepNumber}`,
          "name": match[1].trim().replace(/<[^>]*>/g, ''),
          "text": match[2].trim().replace(/<[^>]*>/g, ''),
          "position": stepNumber
        });
        stepNumber++;
      }
    }
    
    if (steps.length > 0) {
      howToData = {
        "@type": "HowTo",
        "name": howToTitle,
        "description": howToDescription,
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "TWD",
          "value": "0"
        },
        "totalTime": `PT${steps.length * 15}M`,
        "step": steps
      };
    }
  }

  // 定義結構化資料類型，包含動態屬性
  interface BlogStructuredData {
    '@context': string;
    '@type': string;
    '@id': string;
    headline: string;
    name: string;
    description: string;
    abstract?: string;
    image: {
      '@type': string;
      url: string;
      width: number;
      height: number;
    };
    datePublished: string;
    dateModified: string;
    author: {
      '@type': string;
      name: string;
      url: string;
      image?: string;
      jobTitle?: string;
      description?: string;
      knowsAbout?: string[];
      sameAs?: string[];
    };
    publisher: {
      '@type': string;
      name: string;
      url: string;
      logo: {
        '@type': string;
        url: string;
        width: number;
        height: number;
      };
    };
    mainEntityOfPage: {
      '@type': string;
      '@id': string;
    };
    keywords: string;
    articleSection: string;
    articleBody: string;
    wordCount: number;
    timeRequired: string;
    inLanguage: string;
    isAccessibleForFree: boolean;
    creativeWorkStatus: string;
    speakable: {
      '@type': string;
      cssSelector: string[];
    };
    potentialAction: {
      '@type': string;
      target: string[];
    };
    about?: {
      '@type': string;
      name: string;
      description: string;
    };
    specialty?: string;
    accountablePerson: {
      '@type': string;
      name: string;
      url: string;
    };
    citation: any[];
    reviewedBy?: {
      '@type': string;
      name: string;
      url: string;
      jobTitle?: string;
      description?: string;
    };
    lastReviewed: string;
    educationalUse?: string;
    audience: {
      '@type': string;
      audienceType: string;
    };
    mainEntity?: {
      '@type': string;
      mainEntity: any[];
    };
    [key: string]: any; // 允許額外的動態屬性
  }

  const structuredData: BlogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    headline: post.title,
    name: post.title,
    description: excerpt,
    abstract: post.summary,
    image: {
      '@type': 'ImageObject',
      url: post.coverImage.startsWith('http') ? post.coverImage : `${baseUrl}${post.coverImage}`,
      width: 1200,
      height: 630
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${baseUrl}/team`,
      image: post.author.avatar ? 
        (post.author.avatar.startsWith('http') ? post.author.avatar : `${baseUrl}${post.author.avatar}`) : 
        undefined,
      jobTitle: post.author.title || '醫療行銷專家',
      description: post.author.bio || `${post.author.name}是專業的${authorCredentials}，專精於${authorExpertise.join('、')}等領域。`,
      knowsAbout: authorExpertise,
      sameAs: post.author.socialLinks || []
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aidea:Med 醫療行銷顧問',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 600,
        height: 60
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    },
    keywords: post.tags.join(', '),
    articleSection: post.category || '醫療行銷',
    articleBody: firstParagraphs,
    wordCount: cleanContent.split(/\s+/).length,
    timeRequired: `PT${readingTime}M`,
    inLanguage: 'zh-TW',
    isAccessibleForFree: true,
    creativeWorkStatus: 'Published',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.article-summary', 'h2', 'p']
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: [postUrl]
    },
    // 新增專業性證明資料
    about: medicalTags.length > 0 ? {
      '@type': 'MedicalEntity',
      name: post.category || '醫療行銷',
      description: `關於${post.category || '醫療行銷'}的專業知識與最佳實踐`
    } : undefined,
    // 專業性與權威性指標
    specialty: post.specialty || '醫療行銷與溝通',
    accountablePerson: {
      '@type': 'Person',
      name: post.author.name,
      url: `${baseUrl}/team/${post.author.slug || ''}`
    },
    // 文章引用或參考資料
    citation: post.citations || [],
    // 專業審閱信息
    reviewedBy: post.reviewedBy ? {
      '@type': 'Person',
      name: post.reviewedBy.name,
      url: post.reviewedBy.url || `${baseUrl}/team`,
      jobTitle: post.reviewedBy.title || '醫療專業顧問',
      description: post.reviewedBy.description || '負責審閱本文內容的醫療專業人士'
    } : undefined,
    // 增強文章更新信息
    lastReviewed: post.lastReviewed || post.updatedAt || post.publishedAt,
    // 教育內容指標
    educationalUse: medicalTags.length > 0 ? 'Professional Training' : undefined,
    // 適用受眾資訊
    audience: {
      '@type': 'Audience',
      audienceType: post.audienceType || '醫療專業人士與診所經營者'
    }
  };
  
  // 如果有FAQ區塊，添加到結構化資料
  if (faqItems.length > 0) {
    structuredData['mainEntity'] = {
      '@type': 'FAQPage',
      mainEntity: faqItems
    };
  }
  
  // 如果有HowTo區塊，添加到結構化資料
  if (howToData) {
    // 由於一個頁面不能有多個主要實體，我們將HowTo添加為附加資料
    const fullStructuredData = [
      structuredData,
      howToData
    ];
    return fullStructuredData;
  }
  
  return structuredData;
}

function BlogDetailSkeleton() {
  return (
    <div className="container mx-auto py-12">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-60 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 添加 AuthorCredentials 組件顯示作者專業資格
function AuthorCredentials({ author }: { author: BlogPostAuthor }) {
  if (!author.credentials && !author.expertise) return null;
  
  return (
    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      {author.credentials && (
        <div className="flex items-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{author.credentials}</span>
        </div>
      )}
      
      {author.expertise && author.expertise.length > 0 && (
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          <span>專精: {author.expertise.join('、')}</span>
        </div>
      )}
    </div>
  );
}

// 添加 ReferencesSection 組件顯示參考文獻
function ReferencesSection({ references }: { references?: Reference[] }) {
  if (!references || !references.length) return null;
  
  return (
    <section className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4">參考文獻</h2>
      <ol className="list-decimal pl-5 space-y-2">
        {references.map((reference: Reference, index: number) => (
          <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
            {reference.authors && <span className="font-medium">{reference.authors}. </span>}
            {reference.title && <span className="italic">{reference.title}. </span>}
            {reference.journal && <span>{reference.journal}, </span>}
            {reference.year && <span>{reference.year}. </span>}
            {reference.doi && (
              <a 
                href={`https://doi.org/${reference.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                DOI: {reference.doi}
              </a>
            )}
            {reference.url && !reference.doi && (
              <a 
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                連結
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

// 添加 ExpertReviewBadge 組件顯示專業審閱信息
function ExpertReviewBadge({ reviewedBy, lastReviewed }: { reviewedBy?: BlogPostReviewer, lastReviewed?: string }) {
  if (!reviewedBy) return null;
  
  return (
    <div className="flex items-center p-4 my-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-primary">
      <div className="flex-shrink-0 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div>
        <p className="font-medium text-sm">
          本文已由
          <span className="font-bold text-primary"> {reviewedBy.name} </span>
          <span className="font-medium">({reviewedBy.title})</span>
          專業審核
        </p>
        {lastReviewed && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            最後審核日期: {new Date(lastReviewed).toLocaleDateString('zh-TW')}
          </p>
        )}
      </div>
    </div>
  );
}

// 修改博客文章組件，加入相關文章數據
function BlogPost({ post, relatedPosts }: { post: BlogPost, relatedPosts: Post[] }) {
  return (
    <BlogDetail post={post as unknown as Post} relatedPosts={relatedPosts} />
  );
}

export default async function Page({ params }: { params: { slug: string } }) {
  // 先await params再使用其屬性
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);
  
  // 若文章不存在則返回404
  if (!post) {
    notFound()
  }
  
  // 獲取相關文章
  const relatedPosts = await getRelatedPosts(post, 3)
  
  // 確保post具有id屬性以符合BlogPost類型
  const blogPost: BlogPost = {
    ...post,
    id: post.slug, // 使用slug作為id
  };
  
  // 生成結構化資料
  const structuredData = generateBlogStructuredData(blogPost)
  
  return (
    <>
      {/* Schema.org 結構化資料 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <Suspense fallback={<BlogDetailSkeleton />}>
        <BlogPost post={blogPost} relatedPosts={relatedPosts} />
      </Suspense>
    </>
  )
} 