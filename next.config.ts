import type { NextConfig } from "next";

// next.config.js
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "concontown.blob.core.windows.net",
        pathname: "**", // 하위 경로 전체 허용
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // TS 에러 무시
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Lint 에러 무시
  },
  output: 'standalone',
};

export default nextConfig;
