import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
  devIndicators: {
    // appIsrStatus: false, // Removed invalid property
  },

  // Configure webpack to ignore the external folder
  webpack: (config: any) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/Chinesename.club/**', '**/node_modules/**'],
    };
    return config;
  },

  // 添加 turbopack 配置（最简单的解决方案）
  turbopack: {
    // 这里可以留空，或者添加对应的 Turbopack 配置
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;