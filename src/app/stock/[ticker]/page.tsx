import { Metadata } from "next";
import Link from "next/link";
import { getFundamentals, DataError } from "@/lib/yahoo";
import { runAllScenarios, buildSensitivityMatrix } from "@/lib/valuation";
import { DEFAULT_SETTINGS, ValuationSettings } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { VerdictHeader } from "@/components/VerdictHeader";
import { ScenarioRows } from "@/components/ScenarioRows";
import { SummaryTable } from "@/components/SummaryTable";
import { SensitivityMatrix } from "@/components/SensitivityMatrix";
import { AdvancedSettings } from "@/components/AdvancedSettings";
import { Warnings } from "@/components/Warnings";
import { AdSlot } from "@/components/AdSlot";
import { SearchBox } from "@/components/SearchBox";

interface Props {
  params: Promise<{ ticker: string }>;
  searchParams: Promise<{ discountRate?: string; multiple?: string; horizon?: string }>;
}

export async function generateMetadata({ params, searchParams: _ }: Props): Promise<Metadata> {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();
  try {
    const f = await getFundamentals(upper);
    const title = `${upper} (${f.longName}) — Stock Valuation`;
    return {
      title,
      description: `Is ${f.longName} (${upper}) overvalued or undervalued? Free DCF valuation using Revenue-Based Exit Multiple model. Market cap: ${formatCurrency(f.marketCap, f.currency)}.`,
      openGraph: { title, type: "website" },
    };
  } catch {
    return {
      title: `${upper} — Stock Valuation`,
      description: `Check ${upper} stock valuation with our free DCF calculator.`,
    };
  }
}

export default async function StockPage({ params, searchParams }: Props) {
  const { ticker } = await params;
  const sp = await searchParams;
  const upper = ticker.toUpperCase();

  const settings: ValuationSettings = {
    discountRate: parseFloat(sp.discountRate ?? "") || DEFAULT_SETTINGS.discountRate,
    exitMultiple: parseFloat(sp.multiple ?? "") || DEFAULT_SETTINGS.exitMultiple,
    horizon: parseInt(sp.horizon ?? "") || DEFAULT_SETTINGS.horizon,
  };

  let fundamentals;
  let errorMsg: string | null = null;

  try {
    fundamentals = await getFundamentals(upper);
  } catch (err) {
    errorMsg =
      err instanceof DataError
        ? err.message
        : `Could not load data for "${upper}". Please try again.`;
  }

  const searchBar = (
    <div className="border-b border-white/5 px-4 py-3">
      <div className="max-w-3xl mx-auto flex justify-end">
        <div className="w-full max-w-sm">
          <SearchBox />
        </div>
      </div>
    </div>
  );

  if (errorMsg || !fundamentals) {
    return (
      <main>
        {searchBar}
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="font-mono text-slate-400 text-sm mb-2">
            {upper}
          </p>
          <p className="text-parchment text-lg font-display font-bold mb-6">{errorMsg}</p>
          <Link
            href="/"
            className="text-xs font-mono text-slate-400 hover:text-parchment transition-colors uppercase tracking-widest"
          >
            Search another stock →
          </Link>
        </div>
      </main>
    );
  }

  const scenarios = runAllScenarios(
    fundamentals.currentRevenue,
    fundamentals.marketCap,
    settings
  );
  const sensitivity = buildSensitivityMatrix(
    fundamentals.currentRevenue,
    fundamentals.marketCap
  );

  const warnings: string[] = [];
  const dataWarnings: string[] = [];

  if (fundamentals.isUnprofitable) {
    warnings.push(
      "Revenue model may not be suitable — this company is currently unprofitable. Calculations shown for reference."
    );
  }
  if (fundamentals.hasLimitedHistory) {
    warnings.push("Limited historical revenue data available. Results should be treated with caution.");
  }

  const { inconsistencies, revenueDate, revenueSource, timeSeriesRevenue, fallbackRevenue } =
    fundamentals.dataQuality;

  if (inconsistencies.includes("REVENUE_SOURCE_MISMATCH")) {
    const ts = timeSeriesRevenue?.toLocaleString() ?? "—";
    const fb = fallbackRevenue?.toLocaleString() ?? "—";
    dataWarnings.push(
      `We apologise — the two revenue sources we cross-check disagree significantly for this ticker (annual income statement: ${ts} vs financial data feed: ${fb}). ` +
      `We used the income statement figure, but please verify the revenue number against ${upper}'s latest filing before relying on this valuation.`
    );
  }

  if (inconsistencies.includes("SUSPICIOUS_PS_RATIO")) {
    const ps = (fundamentals.marketCap / fundamentals.currentRevenue).toFixed(1);
    dataWarnings.push(
      `We apologise — the implied price-to-sales ratio (${ps}×) looks implausible, which may indicate a unit or currency mismatch in the data Yahoo Finance returned for ${upper}. ` +
      `Market cap and revenue may not be denominated in the same units. Cross-check both figures before using this valuation.`
    );
  }

  if (inconsistencies.includes("STALE_REVENUE")) {
    dataWarnings.push(
      `We apologise — the most recent revenue figure we could retrieve is from ${revenueDate ?? "an unknown date"}, which is over 18 months old. ` +
      `Yahoo Finance may not have up-to-date filings for ${upper}. Results may not reflect the company's current financial position.`
    );
  }

  if (revenueSource === "financialData_fallback" && inconsistencies.length === 0) {
    dataWarnings.push(
      `Revenue was sourced from Yahoo Finance's summary feed rather than the full annual income statement for ${upper} — the figure may be trailing-twelve-months rather than the latest full fiscal year.`
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${upper} Stock Valuation Analysis`,
    description: `DCF valuation of ${fundamentals.longName} (${upper}) using Revenue-Based Exit Multiple model`,
    keywords: `${upper}, ${fundamentals.longName}, stock valuation, DCF, fair value`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {searchBar}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Warnings warnings={warnings} dataWarnings={dataWarnings} />
        <VerdictHeader fundamentals={fundamentals} scenarios={scenarios} />

        <AdSlot slot="1234567890" format="leaderboard" className="mb-8" />

        <ScenarioRows
          scenarios={scenarios}
          currency={fundamentals.currency}
          marketCap={fundamentals.marketCap}
        />

        <SummaryTable
          scenarios={scenarios}
          currency={fundamentals.currency}
          currentRevenue={fundamentals.currentRevenue}
        />

        <AdSlot slot="0987654321" format="rectangle" className="mb-8" />

        <AdvancedSettings ticker={upper} current={settings} />

        <SensitivityMatrix matrix={sensitivity} currency={fundamentals.currency} />

        <section className="mb-10 p-5 border border-white/8 rounded bg-surface text-xs font-mono text-slate-500">
          <h2 className="text-slate-400 uppercase tracking-widest mb-3">Assumptions</h2>
          <ul className="space-y-1">
            <li>Discount rate: {(settings.discountRate * 100).toFixed(0)}% (annual)</li>
            <li>Exit multiple: {settings.exitMultiple}× (applied to Year {settings.horizon} revenue)</li>
            <li>Time horizon: {settings.horizon} years</li>
            <li>All calculations use annual compounding</li>
            <li>Revenue from latest annual income statement via Yahoo Finance</li>
          </ul>
        </section>

        <p className="mt-2 text-[11px] font-mono text-slate-600">
          <Link href="/" className="hover:text-slate-500 transition-colors">
            ← Search another stock
          </Link>
        </p>
      </div>
    </main>
  );
}
