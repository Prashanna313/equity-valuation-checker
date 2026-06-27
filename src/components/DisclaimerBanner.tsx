export function DisclaimerBanner() {
  return (
    <div className="border-b border-amber-500/15 bg-amber-950/10 px-4 py-2">
      <p className="max-w-3xl mx-auto text-[11px] font-mono text-amber-400/70 leading-relaxed">
        <strong className="text-amber-400/90 font-semibold">Note:</strong>{" "}
        This tool is purely math-based on reported financial numbers. It does not factor in sectoral
        performance data, industry trends, competitive dynamics, or latest news. It is a valuation
        lens — not a buy/sell signal.
      </p>
    </div>
  );
}
