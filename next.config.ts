import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "weapon-be-marketplace.onrender.com",
        pathname: "/**",
      },
    ],
    // Отключаем оптимизацию для внешних изображений
    unoptimized: true,
  },
};

export default nextConfig;
