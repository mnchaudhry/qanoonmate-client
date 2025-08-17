import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'qanoonmate.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com'
      },
      {
        protocol: 'https',
        hostname: 'courtingthelaw.com'
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // SEO and Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Enable experimental features for better SEO
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Headers for better SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ]
  },

  // Redirects for SEO (add common redirects here)
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Add more redirects as needed
    ]
  },

  // Proxy API to backend to make cookies first-party
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://qanoonmate-server.fly.dev'
    return {
      // Let Next's own routes (including /api/*) resolve first
      beforeFiles: [],
      // After filesystem routes, proxy any remaining /api/* to backend
      afterFiles: [
        {
          source: '/api/:path*',
          destination: `${backend}/api/:path*`,
        },
      ],
      fallback: [],
    }
  },
};

export default nextConfig;
