import type { Metadata } from "next";
import { Inter, Roboto, Manrope } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { AuthContextProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/query-client";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { UnreadChatsProvider } from "@/context/UnreadChatsContext";
import { NavigationProvider } from "@/context/NavigationContext";
import { NavigationLoader } from "@/components/ui/NavigationLoader";
import { getServerCurrentUser } from "@/lib/server-auth";
import OpenGraphTags from "@/components/meta/OpenGraphTags";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Esviem Defence",
  description: "Weapon Marketplace",
  keywords: [
    "військовий маркетплейс",
    "платформа для військової амуніції",
    "маркетплейс тактичного спорядження",
    "товари для військових",
    "тактичний магазин онлайн",
    "тактичні рюкзаки",
    "військова форма",
    "спорядження для виживання",
    "бронежилети та каски",
    "військові аксесуари",
    "армійське взуття",
    "камуфляж та мілітарі-одяг",
    "платформа для продавців військових товарів",
    "розмістити товари військової тематики",
    "маркетплейс для виробників амуніції",
    "платформа для продавців військових товарів",
    "платформа для продажу тактичних товарів",
    "esviem",
    "esviem defence",
  ],
  robots: "index, follow",
  openGraph: {
    title: "Esviem Defence",
    description: "Weapon Marketplace",
    url: "https://www.esviem-defence.com",
    siteName: "esviem-defence.com",
    images: [
      {
        url: "https://www.esviem-defence.com/logo/esviem_defence_logo_2_2.png",
        width: 1200,
        height: 630,
        alt: "Esviem Defence",
      },
    ],
    locale: "uk_UA",
    type: "website",
  },
  icons: {
    icon: "https://www.esviem-defence.com/logo/esviem_defence_logo_2_3.png",
    apple: "https://www.esviem-defence.com/logo/esviem_defence_logo_2_3.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  // Загружаем данные пользователя на сервере для навбара
  // Явно сериализуем данные для передачи в клиентский компонент
  let initialUser = null;
  try {
    const userData = await getServerCurrentUser();
    initialUser = userData
      ? (JSON.parse(JSON.stringify(userData)) as typeof userData)
      : null;
  } catch (error) {
    console.error("[RootLayout] Error loading user data:", error);
    // Продолжаем работу без данных пользователя
  }

  return (
    <html lang={locale}>
    <head>
        <OpenGraphTags />
      </head>
      <body
        className={`${roboto.variable} ${inter.variable} ${manrope.variable} antialiased`}
      >
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <NavigationProvider>
              <AuthContextProvider>
                <UnreadChatsProvider>
                  <ConditionalLayout initialUser={initialUser}>
                    {children}
                  </ConditionalLayout>
                  <NavigationLoader />
                  <Toaster />
                </UnreadChatsProvider>
              </AuthContextProvider>
            </NavigationProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
