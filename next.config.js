const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    }
  ]
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '**.vivo.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 增加到一週，提高緩存效率
    dangerouslyAllowSVG: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    path: '/_next/image',
    loader: 'default',
  },
  crossOrigin: 'anonymous',
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // 優化編譯設定
  swcMinify: true, // 使用 SWC 縮小代碼
  compiler: {
    // 移除 console 和 debugger 語句
    removeConsole: process.env.NODE_ENV === 'production',
    // 啟用 JIT 編譯
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // 啟用增量式靜態重新生成
    optimizeCss: true,    // 優化 CSS
    optimizeServerReact: true, // 優化服務器端 React
    optimizePackageImports: ['react', 'react-dom', 'framer-motion', '@radix-ui/react-slot'],  // 修改為陣列
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aideamed.com',
  },
  async redirects() {
    return [
      {
        source: '/blog/page/1',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/team',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/service',
        permanent: true,
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/health',
        destination: '/api/health',
      },
      {
        source: '/sanity-check',
        destination: '/api/sanity-check',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // 添加快取控制，延長靜態資源快取時間
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    
    // 優化圖片處理
    config.module.rules.push({
      test: /\.(jpe?g|png|webp|avif)$/i,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024 // 10kb
        }
      }
    });
    
    return config;
  },
}

module.exports = withPWA(nextConfig) 