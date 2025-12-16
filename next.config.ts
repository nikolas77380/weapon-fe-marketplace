import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // 🚀 напрямую тянет с S3/CDN
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Добавляем remotePatterns для безопасности и поддержки внешних изображений
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
    // Минимальные размеры для оптимизации загрузки
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
        // Кэширование статических изображений из public
        source: "/:path*\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
            // 1 год для статических изображений (immutable)
          },
        ],
      },
      {
        // Кэширование Next.js статики (CSS, JS, шрифты)
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
        // Кэширование CSS файлов
        source: "/_next/static/css/:path*\\.css",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Кэширование для изображений из _next/image
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
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
            value: [
              "default-src 'self'",
              "script-src 'self' https://challenges.cloudflare.com",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://vimeo.com https://challenges.cloudflare.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");
export default withNextIntl(nextConfig);
