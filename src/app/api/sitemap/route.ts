import { NextResponse } from 'next/server';
import { caseStudies } from '@/components/pages/CasePage';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 每小時重新驗證一次

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aideamed.com';
  
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

    // 處理案例頁面
    const caseSitemap = caseStudies.map(caseItem => ({
      loc: `${baseUrl}/case/${caseItem.id}`,
      lastmod: caseItem.updatedDate || new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7',
    }));
    
    // 靜態部落格文章 (之後可以從實際資料源動態獲取)
    const blogArticles = [
      {
        slug: 'digital-marketing-for-dental-clinics',
        updatedAt: '2024-03-01T00:00:00Z',
      },
      {
        slug: 'social-media-strategies-for-doctors',
        updatedAt: '2024-03-15T00:00:00Z',
      },
      {
        slug: 'website-optimization-for-medical-practices',
        updatedAt: '2024-03-20T00:00:00Z',
      }
    ];
    
    // 將部落格文章添加到 sitemap
    const blogSitemap = blogArticles.map(post => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt,
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