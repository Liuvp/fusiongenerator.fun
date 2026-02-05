import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true, // Enable gzip compression

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "v3b.fal.media",
      },
      {
        protocol: "https",
        hostname: "fal.media",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "dragonball-api.com",
      },
      {
        protocol: "https",
        hostname: "images.weserv.nl",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "xrapzfknlfdqlnmkulmj.supabase.co",
      },
    ],
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // Cache images for 1 year
    qualities: [75, 85, 90],
  },

  devIndicators: {
    // appIsrStatus: false, // Removed invalid property
  },

  // Configure webpack to ignore the external folder and enable optimizations
  webpack: (config: any, { dev, isServer }: any) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/Chinesename.club/**', '**/node_modules/**'],
    };

    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      };
    }

    return config;
  },

  // 添加 turbopack 配置（最简单的解决方案）
  turbopack: {
    // 这里可以留空，或者添加对应的 Turbopack 配置
  },

  // Experimental features for performance
  experimental: {
    optimizeCss: true, // Re-enabled for performance optimization
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js', 'date-fns'],
  },

  // Configure compiler for modern browsers (works with .browserslistrc)
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Set browser targets to modern browsers (ES2020+) to reduce polyfills
  // This supports Chrome 90+, Safari 14+, Firefox 88+, Edge 90+ (last 2 years)
  transpilePackages: [],

  // Configure cache headers for static assets
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;