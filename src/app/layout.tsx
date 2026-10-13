import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ScrollToTopComponent from "@/components/providers/ScrollToTop";

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
        <SmoothScrollProvider>
          {children}
          <ScrollToTopComponent />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
