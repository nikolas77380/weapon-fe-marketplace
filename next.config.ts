import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // 🚀 напрямую тянет с S3
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  productionBrowserSourceMaps: false,
  // Разрешаем iframe для видео платформ
  async headers() {
    return [
      {
        source: "/:path*\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, immutable",
            // 7 дней кэша (604800 секунд)
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
            // 1 год (Next генерирует уникальные хэши, поэтому безопасно)
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://vimeo.com;",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");
export default withNextIntl(nextConfig);
