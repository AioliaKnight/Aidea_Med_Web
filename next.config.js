const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
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
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    path: '/_next/image',
    loader: 'default',
  },
  crossOrigin: 'anonymous',
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
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
      }
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
    return config;
  },
}

module.exports = withPWA(nextConfig) 