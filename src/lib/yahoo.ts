import YahooFinance from "yahoo-finance2";
import { DataInconsistency, DataQuality, Fundamentals, SearchResult } from "./types";

const yahooFinance = new YahooFinance();

export async function searchTickers(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 1) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await yahooFinance.search(query, {
    newsCount: 0,
    quotesCount: 8,
    enableFuzzyQuery: true,
  });
  const quotes: unknown[] = result?.quotes ?? [];
  return quotes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((q: any) => q?.isYahooFinance && q?.quoteType !== "FUTURE")
    .slice(0, 8)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((q: any) => ({
      symbol: q.symbol ?? "",
      shortname: q.shortname ?? q.longname ?? q.symbol ?? "",
      exchange: q.exchange ?? "",
      typeDisp: q.typeDisp ?? "",
    }));
}

export class DataError extends Error {
  constructor(
    public code: "NOT_FOUND" | "NO_REVENUE" | "NO_MARKET_CAP",
    message: string
  ) {
    super(message);
    this.name = "DataError";
  }
}

export async function getFundamentals(ticker: string): Promise<Fundamentals> {
  const upperTicker = ticker.toUpperCase();

  // Fetch price/market cap via quoteSummary (price + summaryDetail)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let summary: any;
  try {
    summary = await yahooFinance.quoteSummary(upperTicker, {
      modules: ["price", "summaryDetail", "financialData"],
    });
  } catch {
    throw new DataError("NOT_FOUND", `No data found for ticker "${upperTicker}"`);
  }

  const price = summary?.price;
  const marketCap: number | null =
    price?.marketCap ?? summary?.summaryDetail?.marketCap ?? null;

  if (!marketCap || marketCap === 0) {
    throw new DataError(
      "NO_MARKET_CAP",
      `Market cap data not available for "${upperTicker}"`
    );
  }

  // Fetch annual revenue via fundamentalsTimeSeries (replaces deprecated incomeStatementHistory)
  const now = new Date();
  const fiveYearsAgo = new Date(now);
  fiveYearsAgo.setFullYear(now.getFullYear() - 5);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeSeries: any[] = [];
  try {
    timeSeries = await yahooFinance.fundamentalsTimeSeries(upperTicker, {
      period1: fiveYearsAgo.toISOString().split("T")[0],
      type: "annual",
      module: "financials",
    }) as unknown as any[];
  } catch {
    // fallback: try financialData.totalRevenue from quoteSummary
  }

  // Sort descending so index 0 is most recent
  timeSeries.sort(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const latestEntry: any = timeSeries[0] ?? null;
  const timeSeriesRevenue: number | null = latestEntry?.annualTotalRevenue ?? null;
  const fallbackRevenue: number | null = summary?.financialData?.totalRevenue ?? null;
  const currentRevenue = timeSeriesRevenue ?? fallbackRevenue;

  if (!currentRevenue || currentRevenue === 0) {
    throw new DataError(
      "NO_REVENUE",
      `No revenue data available for "${upperTicker}"`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const latestNetIncome: number | null = latestEntry?.annualNetIncome ?? null;
  const netIncome: number | null =
    latestNetIncome ?? summary?.financialData?.netIncome ?? null;
  const isUnprofitable = netIncome !== null && netIncome < 0;

  // --- Cross-checks ---
  const inconsistencies: DataInconsistency[] = [];
  const revenueSource: DataQuality["revenueSource"] =
    timeSeriesRevenue !== null ? "timeSeries" : "financialData_fallback";
  const revenueDate: string | null = latestEntry?.date
    ? new Date(latestEntry.date).toISOString().split("T")[0]
    : null;

  // 1. Revenue source mismatch: both sources available but differ by >30%
  if (timeSeriesRevenue !== null && fallbackRevenue !== null && fallbackRevenue !== 0) {
    const divergence = Math.abs(timeSeriesRevenue - fallbackRevenue) / Math.abs(fallbackRevenue);
    if (divergence > 0.30) {
      inconsistencies.push("REVENUE_SOURCE_MISMATCH");
    }
  }

  // 2. Suspicious P/S ratio — likely unit or currency mismatch
  const psRatio = marketCap / currentRevenue;
  if (psRatio < 0.01 || psRatio > 10000) {
    inconsistencies.push("SUSPICIOUS_PS_RATIO");
  }

  // 3. Stale revenue — latest data is older than 18 months
  if (revenueDate) {
    const monthsOld =
      (Date.now() - new Date(revenueDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsOld > 18) {
      inconsistencies.push("STALE_REVENUE");
    }
  }

  const dataQuality: DataQuality = {
    inconsistencies,
    revenueDate,
    revenueSource,
    timeSeriesRevenue,
    fallbackRevenue,
  };

  return {
    symbol: upperTicker,
    longName: price?.longName ?? price?.shortName ?? upperTicker,
    exchangeName: price?.exchangeName ?? "",
    currency: price?.currency ?? "USD",
    currentRevenue,
    marketCap,
    netIncome,
    isUnprofitable,
    revenueHistoryLength: timeSeries.length,
    hasLimitedHistory: timeSeries.length < 2,
    dataQuality,
  };
}
