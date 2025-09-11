import type { Metadata } from "next";
import { Inter, Roboto, Outfit } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { AuthContextProvider } from "@/context/AuthContext";
import { ProviderSendBird } from "@/context/SendbirdProvider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/query-client";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

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

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
  return (
    <html lang={locale}>
      <body
        className={`${roboto.variable} ${inter.variable} ${outfit.variable} antialiased`}
      >
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <AuthContextProvider>
              <ProviderSendBird>
                <ConditionalLayout>{children}</ConditionalLayout>
                <Toaster />
              </ProviderSendBird>
            </AuthContextProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
