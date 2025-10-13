import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");
export default withNextIntl(nextConfig);
