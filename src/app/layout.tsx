import type { Metadata } from "next";
import { JetBrains_Mono, Barlow_Condensed, Inter } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/Header";
import { IndexScroller } from "@/components/IndexScroller";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Stock Valuation Checker — Free DCF Valuation Tool",
    template: "%s | Stock Valuation Checker",
  },
  description:
    "Free stock valuation tool using Revenue-Based DCF with Exit Multiple model. Check if any stock (NSE, BSE, NYSE, NASDAQ) is overvalued or undervalued across 5 growth scenarios.",
  keywords: [
    "stock valuation",
    "DCF calculator",
    "fair value",
    "stock analysis",
    "NSE stocks",
    "BSE stocks",
    "overvalued undervalued",
    "revenue multiple",
    "free stock tool",
  ],
  openGraph: {
    title: "Stock Valuation Checker — Free DCF Valuation Tool",
    description:
      "Check if any stock is overvalued or undervalued using Revenue-Based DCF analysis across multiple growth scenarios.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Stock Valuation Checker",
  description:
    "Free stock valuation tool using Revenue-Based DCF with Exit Multiple model",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen font-sans">
        <Header />
        <IndexScroller />
        <DisclaimerBanner />
        {children}
        <SiteFooter />
        {publisherId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
