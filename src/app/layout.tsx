import type { Metadata } from "next";
import { Inter, Roboto, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/landing/Footer";
import { AuthContextProvider } from "@/context/AuthContext";
import { ProviderSendBird } from "@/context/SendbirdProvider";
import { Toaster } from "@/components/ui/sonner";

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
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${inter.variable} ${outfit.variable} antialiased`}>
        <AuthContextProvider>
          <ProviderSendBird>
            <Navbar />
            {children}
            <Toaster />
            <Footer />
          </ProviderSendBird>
        </AuthContextProvider>
      </body>
    </html>
  );
}
