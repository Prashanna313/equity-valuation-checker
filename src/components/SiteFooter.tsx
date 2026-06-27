export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 mt-12 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-3 text-[11px] font-mono text-slate-600">
        <p>
          <strong className="text-slate-500">Note:</strong>{" "}
          This tool is purely math-based on reported financial numbers. It does not factor in
          sectoral performance data, industry trends, competitive dynamics, or latest news.
          It is a valuation lens — not a buy/sell signal.
        </p>
        <p>
          Stock data via Yahoo Finance and may be delayed or inaccurate. For educational
          purposes only. Not financial advice. Always do your own research before investing.
        </p>
        <p>
          NSE stocks: append <span className="text-slate-500">.NS</span> · BSE stocks: append{" "}
          <span className="text-slate-500">.BO</span>
        </p>
      </div>
    </footer>
  );
}
