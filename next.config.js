const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 增加到 5 MB
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
          maxEntries: 200, // 增加緩存數量
          maxAgeSeconds: 60 * 24 * 60 * 60 // 增加到 60 天
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // 背景圖片專用緩存策略 - 更積極的緩存
      urlPattern: /bgline-w.*\.(png|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'background-images-cache',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 90 * 24 * 60 * 60 // 90天
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
  enabled: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { 
    optimizeCss: true,
    // 啟用部分預渲染功能 (PPR)
    ppr: true,
    // 應用目錄增強渲染優化
    optimizePackageImports: ['lucide-react', '@phosphor-icons/react', 'react-icons', 'framer-motion', '@heroicons/react'],
    // 增強型圖片優化
    optimisticClientCache: true,
    // 性能指標
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'INP', 'TTFB'],
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    // 啟用React Compiler (React Forget)
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    // 更詳細的Emotion配置
    emotion: {
      // 啟用Emotion的自動標籤功能，使開發者工具中更容易調試
      autoLabel: 'dev-only',
      // 使用文件名和組件名生成標籤
      labelFormat: '[local]',
      // 啟用源碼映射，以便於調試
      sourceMap: process.env.NODE_ENV !== 'production'
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.aideamed.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      // 醫療/牙科相關網站
      {
        protocol: 'https',
        hostname: '*.vivo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.pixnet.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.pimg.tw',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.dentist.com.tw',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cch.org.tw',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.commonhealth.com.tw',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.dent.com.tw',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
    // 根據環境使用不同的尺寸配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 啟用壓縮優化，提高性能
    disableStaticImages: false,
    // 優化圖片加載
    loader: 'default',
    loaderFile: '',
  },
  // 將 serverComponentsExternalPackages 移至 serverExternalPackages
  serverExternalPackages: [],
  compress: true,
  crossOrigin: 'anonymous',
  bundlePagesRouterDependencies: process.env.NODE_ENV === 'production',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      // 將非www網域重定向到www網域
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'aideamed.com',
          },
        ],
        destination: 'https://www.aideamed.com/:path*',
        permanent: true,
      },
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
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://tagmanager.google.com https://cdn.respond.io",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.googleapis.com https://cdn.respond.io https://tagmanager.google.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
              "font-src 'self' https://fonts.gstatic.com https://*.gstatic.com data:",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.respond.io wss://api.respond.io https://cdn.respond.io",
              "frame-src 'self' https://www.youtube.com https://youtube.com https://www.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
        ]
      },
      // 針對靜態資源的快取優化
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 針對字體的快取優化
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 針對 sitemap 和 robots 的快取設定
      {
        source: '/(sitemap.xml|robots.txt)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      // 針對搜尋引擎驗證檔案的快取設定
      {
        source: '/(BingSiteAuth.xml|baidu_verify_*.html|yandex_*.html|google*.html)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ]
  },
  webpack: (config, { dev, isServer }) => {
    // 優化圖片載入
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp)$/i,
      use: [
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 65,
            },
            optipng: {
              enabled: !dev,
            },
            pngquant: {
              quality: [0.65, 0.90],
              speed: 4,
            },
            gifsicle: {
              interlaced: false,
            },
            webp: {
              quality: 75,
            },
          },
        },
      ],
    });
    return config;
  },
}

module.exports = withBundleAnalyzer(withPWA(nextConfig)) 