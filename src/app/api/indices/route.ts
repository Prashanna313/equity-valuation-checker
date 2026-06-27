import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

const INDICES = [
  { symbol: "^GSPC", label: "S&P 500" },
  { symbol: "^IXIC", label: "NASDAQ" },
  { symbol: "^DJI", label: "Dow Jones" },
  { symbol: "^NSEI", label: "Nifty 50" },
  { symbol: "^BSESN", label: "Sensex" },
  { symbol: "^N225", label: "Nikkei 225" },
  { symbol: "^FTSE", label: "FTSE 100" },
  { symbol: "^HSI", label: "Hang Seng" },
  { symbol: "^GDAXI", label: "DAX" },
];

export interface IndexQuote {
  symbol: string;
  label: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
}

export async function GET() {
  const symbols = INDICES.map((i) => i.symbol);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let quotes: any[] = [];
  try {
    // quote() accepts an array of symbols
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (yahooFinance as any).quote(symbols);
    quotes = Array.isArray(result) ? result : [result];
  } catch {
    return NextResponse.json({ error: "Failed to fetch index data" }, { status: 502 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quoteBySymbol = new Map(quotes.map((q: any) => [q.symbol, q]));

  const data: IndexQuote[] = INDICES.map(({ symbol, label }) => {
    const q = quoteBySymbol.get(symbol);
    return {
      symbol,
      label,
      price: q?.regularMarketPrice ?? null,
      change: q?.regularMarketChange ?? null,
      changePct: q?.regularMarketChangePercent ?? null,
    };
  });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
