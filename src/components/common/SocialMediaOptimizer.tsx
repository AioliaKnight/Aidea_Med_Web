'use client'

import React from 'react'
import Head from 'next/head'

interface SocialMediaOptimizerProps {
  title: string
  description: string
  url: string
  image?: string
  imageAlt?: string
  siteName?: string
  type?: 'website' | 'article' | 'video' | 'music'
  locale?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  author?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterSite?: string
  twitterCreator?: string
}

/**
 * 社交媒體優化組件
 * 統一管理各種社交媒體平台的分享優化 meta tags
 * 包含 Open Graph (Facebook)、Twitter Cards、LinkedIn 等
 */
export default function SocialMediaOptimizer({
  title,
  description,
  url,
  image,
  imageAlt,
  siteName = 'Aidea:Med 醫療行銷顧問',
  type = 'website',
  locale = 'zh_TW',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  author,
  twitterCard = 'summary_large_image',
  twitterSite = '@aideamed',
  twitterCreator = '@aideamed'
}: SocialMediaOptimizerProps) {
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aideamed.com'
  const defaultImage = `${baseUrl}/og-image.jpg`
  const optimizedImage = image?.startsWith('http') ? image : `${baseUrl}${image || '/og-image.jpg'}`
  
  return (
    <Head>
      {/* 基本 Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image" content={optimizedImage} />
      <meta property="og:image:alt" content={imageAlt || title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      
      {/* 文章特定的 Open Graph */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={optimizedImage} />
      <meta name="twitter:image:alt" content={imageAlt || title} />
      
      {/* LinkedIn 優化 */}
      <meta property="og:image:secure_url" content={optimizedImage} />
      
      {/* 微信/WeChat 優化 */}
      <meta property="wx:card" content="summary" />
      <meta property="wx:image" content={optimizedImage} />
      
      {/* 額外的社交媒體優化 */}
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Pinterest Rich Pins */}
      <meta property="og:rich_attachment" content="true" />
      
      {/* WhatsApp 優化 */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* 通用社交媒體優化 */}
      <meta name="theme-color" content="#4A6CF7" />
      <meta name="msapplication-TileColor" content="#4A6CF7" />
      
      {/* 結構化數據支援社交分享 */}
      {type === 'article' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: title,
              description: description,
              image: optimizedImage,
              url: url,
              datePublished: publishedTime,
              dateModified: modifiedTime,
              author: {
                '@type': 'Person',
                name: author || 'Aidea:Med 團隊',
                url: `${baseUrl}/team`
              },
              publisher: {
                '@type': 'Organization',
                name: siteName,
                logo: {
                  '@type': 'ImageObject',
                  url: `${baseUrl}/logo.png`
                }
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': url
              }
            })
          }}
        />
      )}
    </Head>
  )
} 