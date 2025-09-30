import type React from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import StateProvider from "@/wrappers/StateProvider";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from "@vercel/speed-insights/next"

import AnalyticsProvider from "@/wrappers/AnalyticsProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || "QanoonMate",
    template: "%s | QanoonMate"
  },
  description: "Legal access simplified. QanoonMate is Pakistan's leading legal tech platform that connects users with qualified lawyers and provides AI-driven legal solutions.",
  keywords: "legal advice Pakistan, lawyer consultation, Pakistan law, AI legal assistant, legal platform, case law, legal documents",
  authors: [{ name: "QanoonMate Team" }],
  creator: "QanoonMate",
  publisher: "QanoonMate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://qanoonmate.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://qanoonmate.com',
    siteName: 'QanoonMate',
    title: 'QanoonMate - AI-Powered Legal Platform for Pakistan',
    description: 'Legal access simplified. QanoonMate is Pakistan\'s leading legal tech platform that connects users with qualified lawyers and provides AI-driven legal solutions.',
    images: [
      {
        url: '/Pictures/main.jpeg',
        width: 1200,
        height: 630,
        alt: 'QanoonMate - Legal Tech Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QanoonMate - AI-Powered Legal Platform for Pakistan',
    description: 'Legal access simplified. Connect with qualified lawyers and get AI-driven legal solutions.',
    images: ['/Pictures/main.jpeg'],
    creator: '@qanoonmate',
    site: '@qanoonmate',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} bg-neutral text-foreground`}
        style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}
        suppressHydrationWarning={true}
      >
        <StateProvider>
          <AnalyticsProvider>
            <Toaster />
            {children}
          </AnalyticsProvider>
        </StateProvider>
        <GoogleAnalytics gaId={'G-FFX5P5E4Z7'} />
        <SpeedInsights />
      </body>
    </html>
  );
}
