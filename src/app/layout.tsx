import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ScrollToTopComponent from "@/components/providers/ScrollToTop";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Boekerello - Gepersonaliseerde Kinderboeken",
  description: "Hun Verbeelding. Hun Avontuur. Hun Verhaal. Maak een magisch gepersonaliseerd kinderboek waarin jouw kind de held van het verhaal is.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>
        <NextAuthProvider>
          <LanguageProvider>
            <Suspense fallback={children}>
              <SmoothScrollProvider>
                {children}
                <ScrollToTopComponent />
              </SmoothScrollProvider>
            </Suspense>
          </LanguageProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
