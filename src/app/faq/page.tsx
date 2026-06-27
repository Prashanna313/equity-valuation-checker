import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — Stock Valuation Checker",
  description:
    "Frequently asked questions about the Stock Valuation Checker — how DCF valuation works, coverage of Indian stocks, what overvalued/undervalued means, and more.",
};

const faqs = [
  {
    q: "What is a Revenue-Based DCF valuation?",
    a: "Revenue-Based DCF (Discounted Cash Flow) projects a company's revenue growth over 10 years, applies an exit multiple to Year 10 revenue, then discounts that back to today's value using a discount rate (usually 10%). This gives a 'fair value' that you compare to the current market cap.",
  },
  {
    q: "Is this tool free?",
    a: "Yes, completely free. Stock data is sourced from Yahoo Finance (public). No sign-up required.",
  },
  {
    q: "Does this tool cover Indian stocks (NSE/BSE)?",
    a: "Yes. Search NSE stocks by appending .NS (e.g. RELIANCE.NS, TCS.NS) or BSE stocks by appending .BO. You can also search by company name.",
  },
  {
    q: "What does overvalued mean?",
    a: "Overvalued means the market cap is higher than the fair value calculated by the model — the market is paying more than the model says the company is worth under that growth assumption. Undervalued means the opposite.",
  },
  {
    q: "Does this tool factor in sector trends or news?",
    a: "No. This tool is purely math-based on reported financial numbers — revenue, market cap, and your assumptions for growth rate, discount rate, and exit multiple. It does not consider sectoral performance data, competitive dynamics, management quality, or latest news. Think of it as one quantitative lens, not a complete investment thesis.",
  },
  {
    q: "Can I change the assumptions?",
    a: "Yes. On any stock's page, open the Advanced Settings panel to adjust the discount rate, exit multiple, and time horizon. The sensitivity matrix shows how fair value shifts across different combinations.",
  },
  {
    q: "Why does the model not work well for banks or insurance companies?",
    a: "Banks and insurers use leverage as a core part of their business model, so revenue alone is not a meaningful proxy for value. For these companies the tool will flag a warning, but you should use a different valuation approach (e.g. Price-to-Book or dividend discount model).",
  },
  {
    q: "Where does the revenue data come from?",
    a: "All financial data is pulled from Yahoo Finance's public endpoints — specifically the latest annual income statement. No API key is required.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-parchment mb-3">
          Frequently asked questions
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xl">
          Everything you need to know about how this tool works and what it can (and can&apos;t) tell you.
        </p>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-white/5 pb-6">
              <h2 className="text-sm font-semibold text-parchment mb-2">{faq.q}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-4 text-xs font-mono">
          <Link href="/how-it-works" className="text-slate-400 hover:text-parchment transition-colors uppercase tracking-widest">
            How it works →
          </Link>
          <Link href="/" className="text-slate-400 hover:text-parchment transition-colors uppercase tracking-widest">
            Check a stock →
          </Link>
        </div>
      </div>

    </main>
  );
}
