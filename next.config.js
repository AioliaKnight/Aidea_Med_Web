const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 增加到 8 MB
  buildExcludes: [/middleware-manifest\.json$/], // 排除不必要的文件
  scope: '/', // 設定服務範圍
  sw: 'sw.js', // 指定 Service Worker 文件名
  runtimeCaching: [
    {
      // 首頁和重要頁面 - 優先網路，快速回退緩存
      urlPattern: ({ url, request }) => {
        const isSameOrigin = self.origin === url.origin;
        const isImportantPage = ['/', '/service', '/contact', '/team'].includes(url.pathname);
        return isSameOrigin && request.destination === 'document' && isImportantPage;
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'important-pages',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 2 * 60 * 60 // 2 小時
        },
        networkTimeoutSeconds: 3, // 快速回退
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // Blog 文章 - 較長緩存，內容相對穩定
      urlPattern: ({ url, request }) => {
        const isSameOrigin = self.origin === url.origin;
        return isSameOrigin && request.destination === 'document' && url.pathname.startsWith('/blog/');
      },
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'blog-pages',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 天
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // API 請求 - 智能緩存策略
      urlPattern: ({ url }) => {
        const isSameOrigin = self.origin === url.origin;
        return isSameOrigin && url.pathname.startsWith('/api/');
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 60 // 30 分鐘
        },
        networkTimeoutSeconds: 5,
        cacheableResponse: {
          statuses: [0, 200]
        },
        // 添加請求/回應處理插件
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              // 只緩存成功的 API 回應
              return response.status === 200 ? response : null;
            },
            cacheKeyWillBeUsed: async ({ request }) => {
              // 標準化 API 請求的緩存鍵
              const url = new URL(request.url);
              return `${url.pathname}${url.search}`;
            }
          }
        ]
      }
    },
    {
      // 圖片資源 - 三層緩存策略
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|avif|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 300, // 增加緩存數量
          maxAgeSeconds: 90 * 24 * 60 * 60, // 90 天
          purgeOnQuotaError: true // 配額不足時自動清理
        },
        cacheableResponse: {
          statuses: [0, 200]
        },
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }) => {
              // 圖片緩存鍵優化
              const url = new URL(request.url);
              return url.href.split('?')[0]; // 忽略查詢參數
            }
          }
        ]
      }
    },
    {
      // 關鍵背景圖片 - 最高優先級緩存
      urlPattern: /bgline-w.*\.(png|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'critical-images',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 180 * 24 * 60 * 60 // 180 天
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // Google Fonts - 永久緩存策略
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 年
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // JS, CSS 資源 - 版本化緩存
      urlPattern: /\.(js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 天
        },
        cacheableResponse: {
          statuses: [0, 200]
        },
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }) => {
              // 包含版本號的資源使用完整 URL
              const url = new URL(request.url);
              return url.href;
            }
          }
        ]
      }
    },
    {
      // 社群媒體和 CDN 資源
      urlPattern: ({ url }) => {
        const cdnHosts = [
          'cdn.jsdelivr.net',
          'unpkg.com', 
          'cdnjs.cloudflare.com',
          'images.unsplash.com'
        ];
        return cdnHosts.some(host => url.hostname.includes(host));
      },
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'cdn-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 天
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // 外部分析和追蹤腳本 - 網路優先
      urlPattern: ({ url }) => {
        const analyticsHosts = [
          'www.googletagmanager.com',
          'www.google-analytics.com',
          'analytics.google.com'
        ];
        return analyticsHosts.some(host => url.hostname.includes(host));
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'analytics-cache',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 // 1 小時
        },
        networkTimeoutSeconds: 3
      }
    },
    {
      // 其他文檔資源 - 智能緩存
      urlPattern: ({ request, url }) => {
        const isSameOrigin = self.origin === url.origin;
        return isSameOrigin && request.destination === 'document';
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 80,
          maxAgeSeconds: 24 * 60 * 60 // 1 天
        },
        networkTimeoutSeconds: 5,
        plugins: [
          {
            cacheWillUpdate: async ({ response, request }) => {
              // 只緩存成功的頁面回應
              if (response && response.status === 200) {
                const contentType = response.headers.get('content-type');
                return contentType && contentType.includes('text/html') ? response : null;
              }
              return null;
            }
          }
        ]
      }
    },
    {
      // 備用緩存策略 - 處理所有其他請求
      urlPattern: /.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'fallback-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 12 * 60 * 60 // 12 小時
        },
        networkTimeoutSeconds: 8
      }
    }
  ]
})

// 條件性載入 bundle analyzer，避免生產環境錯誤
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({
      enabled: true,
    })
  : (config) => config // 如果不需要分析，返回配置不變

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { 
    optimizeCss: true,
    // 暫時禁用部分預渲染功能 (PPR) - 需要 canary 版本
    // ppr: true,
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
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 年
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 設備尺寸優化
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 啟用圖片優化
    unoptimized: false,
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