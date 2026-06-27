import { MetadataRoute } from "next";

const SEED_TICKERS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "BRK-B",
  "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS",
  "WIPRO.NS", "HINDUNILVR.NS", "BAJFINANCE.NS", "ADANIENT.NS", "LT.NS",
  "JPM", "V", "JNJ", "WMT", "PG", "MA", "HD",
];

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://valuationchecker.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const stockUrls: MetadataRoute.Sitemap = SEED_TICKERS.map((ticker) => ({
    url: `${BASE}/stock/${ticker}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1.0 },
    ...stockUrls,
  ];
}
