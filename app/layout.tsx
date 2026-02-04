import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kentucky Holo | Digital Experience",
  description: "Interactive 3D holographic menu experience with AI-powered bedtime stories",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kentucky Holo",
  },
};

// NEW: Viewport config (including themeColor)
export const viewport: Viewport = {
  themeColor: "#e4002b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kentucky Holo" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}