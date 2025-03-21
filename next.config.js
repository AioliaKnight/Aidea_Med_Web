const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
  runtimeCaching: [
    {
      // API 請求緩存策略
      urlPattern: ({ url }) => {
        const isSameOrigin = self.origin === url.origin;
        return isSameOrigin && url.pathname.startsWith('/api/');
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 // 1 小時
        },
        networkTimeoutSeconds: 10, // 10 秒網絡超時自動使用緩存
      }
    },
    {
      // 靜態頁面緩存策略
      urlPattern: ({ request, url }) => {
        const isSameOrigin = self.origin === url.origin;
        // HTML 請求但不包括 API 路徑
        return isSameOrigin && request.destination === 'document' && !url.pathname.startsWith('/api/');
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60 // 1 天
        }
      }
    },
    {
      // 圖片資源緩存策略 - 優先使用緩存
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|avif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 150, // 增加緩存數量
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 天
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // 字體資源緩存策略 - 優先使用緩存，長期有效
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 年
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // JS, CSS 資源緩存策略
      urlPattern: /\.(js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 70,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 天
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // 外部資源的緩存策略
      urlPattern: ({ url }) => {
        return !url.pathname.startsWith('/api/') && 
               !url.pathname.endsWith('.json') && 
               !url.pathname.endsWith('.xml') && 
               url.origin !== self.origin;
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'external-resources',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 // 1 天
        },
        networkTimeoutSeconds: 10
      }
    },
    {
      // 其他全部資源的備用緩存策略
      urlPattern: /.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'fallback-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60 // 1 天
        },
        networkTimeoutSeconds: 10
      }
    }
  ]
})

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.google.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24, // 增加到 1 天
    unoptimized: false,
  },
  experimental: {
    optimizeCss: true,
    webpackBuildWorker: true,
    optimizePackageImports: [
      'framer-motion',
      'react-icons',
      'react-intersection-observer',
      'react-hook-form',
      'tailwind-merge',
      'clsx',
      'cmdk',
      'date-fns',
      'lucide-react',
      'gsap',
      '@heroicons/react',
      '@phosphor-icons/react',
      'tailwind-merge'
    ],
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  // 增加資源壓縮
  compress: true,
  crossOrigin: 'anonymous',
  async redirects() {
    return [
      {
        source: '/services',
        destination: '/service',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/team',
        permanent: true,
      },
      {
        source: '/cases',
        destination: '/case',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/team',
        permanent: true,
      }
    ]
  },
  env: {
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV || 'development',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google.com *.googleapis.com *.gstatic.com; connect-src 'self' *.vercel-insights.com; img-src 'self' blob: data: *.google.com *.googleapis.com *.gstatic.com; style-src 'self' 'unsafe-inline' *.googleapis.com; font-src 'self' *.gstatic.com; frame-src 'self' *.google.com https://vercel.com https://vercel.live;"
          }
        ],
      },
      // 添加對靜態資源的快取頭
      {
        source: '/:path(.*)\.(jpg|jpeg|png|svg|webp|avif|ico|woff2|css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
    ]
  },
}

module.exports = withBundleAnalyzer(withPWA(nextConfig)) 