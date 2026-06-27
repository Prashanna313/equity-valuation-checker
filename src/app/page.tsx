import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { AdSlot } from "@/components/AdSlot";

const POPULAR = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "RELIANCE.NS", name: "Reliance" },
  { symbol: "TCS.NS", name: "TCS" },
  { symbol: "INFY.NS", name: "Infosys" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "NVDA", name: "Nvidia" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-white/5 px-4 pt-16 pb-12">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs tracking-widest text-slate-500 uppercase mb-4">
            Revenue-Based DCF · Exit Multiple Model · 5 Growth Scenarios
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-parchment leading-tight mb-4">
            Is the market<br />
            <span className="text-slate-400">paying too much</span><br />
            for this stock?
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mb-10 leading-relaxed">
            Enter any ticker to see if the current market cap is justified
            across 5 growth-rate assumptions — from conservative 5% to
            aggressive 50%. Free. No sign-up.
          </p>

          <SearchBox />

          <div className="flex flex-wrap gap-2 mt-5">
            {POPULAR.map((s) => (
              <Link
                key={s.symbol}
                href={`/stock/${s.symbol}`}
                className="px-3 py-1 border border-white/10 rounded text-xs font-mono text-slate-400 hover:border-white/30 hover:text-parchment transition-colors"
              >
                {s.symbol}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdSlot slot="1111111111" format="leaderboard" className="my-8 px-4 max-w-3xl mx-auto" />

      {/* Links to detail pages */}
      <section className="px-4 py-12 border-b border-white/5">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/how-it-works"
            className="group border border-white/8 rounded p-6 bg-surface hover:border-white/20 transition-colors"
          >
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
              Methodology
            </p>
            <h2 className="font-display font-bold text-lg text-parchment mb-2 group-hover:text-white transition-colors">
              How it works
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Step-by-step walkthrough of the Revenue-Based DCF model — with a video explainer and worked example.
            </p>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">
              Read more →
            </span>
          </Link>

          <Link
            href="/faq"
            className="group border border-white/8 rounded p-6 bg-surface hover:border-white/20 transition-colors"
          >
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
              Questions
            </p>
            <h2 className="font-display font-bold text-lg text-parchment mb-2 group-hover:text-white transition-colors">
              FAQ
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              What does overvalued mean? Does it cover Indian stocks? Can I change the assumptions?
            </p>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">
              Read more →
            </span>
          </Link>
        </div>
      </section>

    </main>
  );
}
