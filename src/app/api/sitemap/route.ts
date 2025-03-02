import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 每小時重新驗證一次

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aidea-med.vercel.app';
  
  try {
    // 靜態頁面
    const staticPages = [
      {
        loc: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '1.0',
      },
      {
        loc: `${baseUrl}/service`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.8',
      },
      {
        loc: `${baseUrl}/case`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.8',
      },
      {
        loc: `${baseUrl}/team`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.7',
      },
      {
        loc: `${baseUrl}/blog`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.9',
      },
      {
        loc: `${baseUrl}/contact`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.6',
      },
    ];

    // 從 Sanity 獲取部落格文章
    const blogQuery = groq`
      *[_type == "post"] {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }
    `;
    
    const blogPosts = await client.fetch(blogQuery);
    
    // 從 Sanity 獲取案例
    const caseQuery = groq`
      *[_type == "case"] {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }
    `;
    
    const cases = await client.fetch(caseQuery);
    
    // 將部落格文章添加到 sitemap
    const blogSitemap = blogPosts.map((post: any) => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: new Date(post._updatedAt || post.publishedAt).toISOString(),
      changefreq: 'monthly',
      priority: '0.7',
    }));
    
    // 將案例添加到 sitemap
    const caseSitemap = cases.map((caseItem: any) => ({
      loc: `${baseUrl}/case/${caseItem.slug}`,
      lastmod: new Date(caseItem._updatedAt || caseItem.publishedAt).toISOString(),
      changefreq: 'monthly',
      priority: '0.7',
    }));
    
    // 組合所有頁面
    const allPages = [...staticPages, ...blogSitemap, ...caseSitemap];
    
    // 生成 XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;
    
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // 發生錯誤時，至少返回靜態頁面的站點地圖
    const staticPagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    
    return new NextResponse(staticPagesXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
} 