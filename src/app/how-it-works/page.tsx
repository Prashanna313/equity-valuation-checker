import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works — Revenue-Based DCF Valuation",
  description:
    "Learn how the Stock Valuation Checker calculates fair value using a Revenue-Based DCF model with Exit Multiple. Step-by-step breakdown with a worked example.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-parchment mb-3">
          How it works
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xl">
          A plain-English walkthrough of the Revenue-Based DCF model used to calculate fair value.
        </p>

        {/* YouTube embed */}
        <div className="mb-12">
          <div className="relative w-full pb-[56.25%]">
            <iframe
              className="absolute inset-0 w-full h-full rounded border border-white/8"
              src="https://www.youtube.com/embed/xbnStieZ0ks"
              title="How DCF Valuation Works"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Steps */}
        <section className="mb-12">
          <h2 className="font-display font-bold text-xl text-parchment mb-6">
            The four steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                step: "1. Revenue fetch",
                body: "We pull the company's latest annual revenue and current market cap from Yahoo Finance — no API key required.",
              },
              {
                step: "2. 10-year projection",
                body: "Revenue is compounded over 10 years at each of 5 growth rates: 5%, 10%, 20%, 30%, and 50%.",
              },
              {
                step: "3. Exit value",
                body: "Year 10 revenue is multiplied by a 5× exit multiple — the price a buyer might pay for the business.",
              },
              {
                step: "4. Discount to today",
                body: "That exit value is discounted back to today using a 10% annual discount rate, giving a fair present value.",
              },
            ].map(({ step, body }) => (
              <div key={step} className="border border-white/8 rounded p-5 bg-surface">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
                  {step}
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-12">
          <h2 className="font-display font-bold text-xl text-parchment mb-4">
            Methodology
          </h2>
          <div className="text-sm text-slate-400 leading-relaxed space-y-4 max-w-2xl">
            <p>
              The model is a simplified Revenue-Based Discounted Cash Flow (DCF) with an Exit Multiple.
              It does not model margins, capex, or free cash flow — it treats revenue as the proxy for
              the company&apos;s future earning power, which is most appropriate for high-growth companies
              where margins are expected to expand over time.
            </p>
            <p>
              <strong className="text-parchment">Formula:</strong>{" "}
              Fair Value = (Current Revenue × (1 + g)^10 × 5) / (1.10)^10
            </p>
            <p>
              Default assumptions: 10% discount rate, 5× exit multiple, 10-year horizon.
              You can adjust all three in the Advanced Settings panel on any stock&apos;s page.
              The sensitivity matrix shows how the fair value changes across different combinations.
            </p>
            <p>
              <strong className="text-parchment">Limitations:</strong> This is a valuation lens, not
              a buy/sell signal. Companies with negative or zero revenue, or those where revenue is
              not a meaningful proxy for value (e.g. banks, insurance), are flagged with warnings.
              Always do your own research.
            </p>
          </div>
        </section>

        {/* Worked example */}
        <section className="mb-12">
          <h2 className="font-display font-bold text-xl text-parchment mb-6">
            Worked example
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse min-w-[500px]">
              <caption className="text-left text-slate-500 text-[11px] mb-3">
                Hypothetical company · Current revenue: ₹100 Cr · Market cap: ₹400 Cr · Discount rate: 10% · Exit multiple: 5×
              </caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-500 py-2 pr-4 font-normal">Growth</th>
                  <th className="text-right text-slate-500 py-2 px-4 font-normal">Yr10 Revenue</th>
                  <th className="text-right text-slate-500 py-2 px-4 font-normal">Exit Value</th>
                  <th className="text-right text-slate-500 py-2 px-4 font-normal">Fair Value</th>
                  <th className="text-center text-slate-500 py-2 pl-4 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { g: "5%", y10: "₹162.9 Cr", exit: "₹814.5 Cr", fair: "₹314.2 Cr", status: "OVERVALUED", cls: "text-red-400 bg-red-950/40" },
                  { g: "10%", y10: "₹259.4 Cr", exit: "₹1,297 Cr", fair: "₹500.2 Cr", status: "UNDERVALUED", cls: "text-emerald-400 bg-emerald-950/40" },
                  { g: "20%", y10: "₹619.2 Cr", exit: "₹3,096 Cr", fair: "₹1,194 Cr", status: "UNDERVALUED", cls: "text-emerald-400 bg-emerald-950/40" },
                  { g: "30%", y10: "₹1,379 Cr", exit: "₹6,895 Cr", fair: "₹2,657 Cr", status: "UNDERVALUED", cls: "text-emerald-400 bg-emerald-950/40" },
                  { g: "50%", y10: "₹5,767 Cr", exit: "₹28,835 Cr", fair: "₹11,116 Cr", status: "UNDERVALUED", cls: "text-emerald-400 bg-emerald-950/40" },
                ].map((row) => (
                  <tr key={row.g} className="border-b border-white/5">
                    <td className="py-2 pr-4 text-parchment font-semibold tabular-nums">{row.g}</td>
                    <td className="py-2 px-4 text-right text-slate-300 tabular-nums">{row.y10}</td>
                    <td className="py-2 px-4 text-right text-slate-300 tabular-nums">{row.exit}</td>
                    <td className="py-2 px-4 text-right text-parchment font-semibold tabular-nums">{row.fair}</td>
                    <td className="py-2 pl-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-bold ${row.cls}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            At 5% growth the stock is overvalued — the market is pricing in faster growth.
            At 10%+, the stock is undervalued at its current market cap.
          </p>
        </section>

        <div className="flex gap-4 text-xs font-mono">
          <Link href="/faq" className="text-slate-400 hover:text-parchment transition-colors uppercase tracking-widest">
            FAQ →
          </Link>
          <Link href="/" className="text-slate-400 hover:text-parchment transition-colors uppercase tracking-widest">
            Check a stock →
          </Link>
        </div>
      </div>

    </main>
  );
}
