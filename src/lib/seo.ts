import { Metadata } from "next";

export const defaultSEO: Metadata = {
  title: {
    default: "Esviem Defence - Global Arms and Ammunition Marketplace",
    template: "%s | Esviem Defence",
  },
  description:
    "Global marketplace for weapons, ammunition, and military equipment. Connect buyers and sellers worldwide. Secure transactions, verified sellers, comprehensive catalog.",
  keywords: [
    "weapons marketplace",
    "ammunition marketplace",
    "military equipment",
    "arms trading",
    "weapon sales",
    "military gear",
    "defense equipment",
    "tactical gear",
    "firearms marketplace",
    "military surplus",
    "weapon parts",
    "tactical accessories",
    "military clothing",
    "defense industry",
    "arms dealer",
    "weapon collector",
    "military hardware",
    "tactical equipment",
    "defense contractor",
    "military supplier",
  ],
  authors: [{ name: "Esviem Defence" }],
  creator: "Esviem Defence",
  publisher: "Esviem Defence",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://esviem-defence.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en",
    alternateLocale: "ua",
    url: "https://esviem-defence.com",
    title: "Esviem Defence - Global Arms and Ammunition Marketplace",
    description:
      "Global marketplace for weapons, ammunition, and military equipment. Connect buyers and sellers worldwide.",
    siteName: "Esviem Defence",
    images: [
      {
        url: "/landing/hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Esviem Defence Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Esviem Defence - Global Arms and Ammunition Marketplace",
    description:
      "Global marketplace for weapons, ammunition, and military equipment.",
    images: ["/landing/hero-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export function generatePageSEO(
  title: string,
  description: string,
  keywords: string[] = [],
  path: string = "/"
): Metadata {
  return {
    title,
    description,
    keywords: [...(defaultSEO.keywords as string[]), ...keywords],
    openGraph: {
      ...defaultSEO.openGraph,
      title,
      description,
      url: `https://esviem-defence.com${path}`,
    },
    twitter: {
      ...defaultSEO.twitter,
      title,
      description,
    },
    alternates: {
      canonical: `https://esviem-defence.com${path}`,
    },
  };
}
