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
