import type { Metadata } from "next";
import CONFIG from '~/portfolio.config';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: CONFIG.seo.title,
  description: CONFIG.seo.description,
  metadataBase: new URL(CONFIG.seo.siteURL), // needed for absolute OG image URLs
  openGraph: {
    title: CONFIG.seo.title,
    description: CONFIG.seo.description,
    images: [{ url: CONFIG.seo.imageURL }],
  },
  twitter: {
    card: 'summary_large_image',
    title: CONFIG.seo.title,
    description: CONFIG.seo.description,
    images: [CONFIG.seo.imageURL],
  },
  // PWA manifest link is auto-handled by next-pwa
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      {CONFIG.googleAnalytics.id && (
        <GoogleAnalytics gaId={CONFIG.googleAnalytics.id} />
      )}
    </html>
  );
}
