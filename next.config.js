const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : 'standalone',
  distDir: '.next',
  // 為 GitHub Pages 添加 basePath
  basePath: process.env.NODE_ENV === 'production' ? '/aidea-med-web' : '',
  // 設定資產前綴
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aidea-med-web/' : '',
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
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [], // 不推薦使用，建議使用 remotePatterns
    path: '/_next/image',
    loader: 'default',
    loaderFile: '',
    disableStaticImages: false,
    unoptimized: process.env.NODE_ENV === 'production', // GitHub Pages 需要將這個設為 true
  },
  // 開啟網域跨站優化 (使用 CDN 加速)
  crossOrigin: 'anonymous',
  // 開啟 HTTP 壓縮
  compress: true,
  // 開啟嚴格模式
  reactStrictMode: true,
  // 停用 X-Powered-By 頭
  poweredByHeader: false,
  // 設定環境變數
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://您的用戶名.github.io/aidea-med-web'
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
  // 自訂路徑重寫 (redirects)
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
  // 自訂路徑重寫 (rewrites)
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/health',
        destination: '/api/health',
      }
    ]
  },
  // 自訂 HTTP 標頭 (headers)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ]
  },
  // 自訂 webpack 配置
  webpack(config) {
    // SVG 載入器
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
}

module.exports = withPWA(nextConfig) 