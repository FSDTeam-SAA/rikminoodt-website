import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ScrollToTopComponent from "@/components/providers/ScrollToTop";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Boekerello",
  description: "Their Imagination. Their Adventure. Their Story.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <SmoothScrollProvider>
            <LanguageProvider>
              {children}
              <ScrollToTopComponent />
            </LanguageProvider>
          </SmoothScrollProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
