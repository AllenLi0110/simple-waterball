import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 如果需要使用根目录的 assets，取消下面的注释
  // 但建议保持图片在 public/images/ 目录（Next.js 标准做法）
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     '@assets': path.resolve(__dirname, '../assets'),
  //   };
  //   return config;
  // },
};

export default nextConfig;
