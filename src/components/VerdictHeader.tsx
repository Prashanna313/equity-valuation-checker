import { Fundamentals, ScenarioResult } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

interface VerdictHeaderProps {
  fundamentals: Fundamentals;
  scenarios: ScenarioResult[];
}

function getOverallVerdict(scenarios: ScenarioResult[]) {
  const under = scenarios.filter((s) => s.status === "UNDERVALUED").length;
  const over = scenarios.filter((s) => s.status === "OVERVALUED").length;
  if (under === 5) return { label: "UNDERVALUED ACROSS ALL SCENARIOS", cls: "text-emerald-400" };
  if (over === 5) return { label: "OVERVALUED ACROSS ALL SCENARIOS", cls: "text-red-400" };
  if (under > over) return { label: "UNDERVALUED IN MOST SCENARIOS", cls: "text-emerald-400" };
  if (over > under) return { label: "OVERVALUED IN MOST SCENARIOS", cls: "text-red-400" };
  return { label: "VERDICT DEPENDS ON GROWTH RATE", cls: "text-amber-400" };
}

export function VerdictHeader({ fundamentals, scenarios }: VerdictHeaderProps) {
  const verdict = getOverallVerdict(scenarios);
  return (
    <div className="border-b border-white/10 pb-8 mb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xs tracking-widest text-slate-400 uppercase">
              {fundamentals.exchangeName}
            </span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-xs tracking-widest text-slate-400 uppercase">
              {fundamentals.currency}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-parchment tracking-tight leading-none">
            {fundamentals.symbol}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">{fundamentals.longName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">
            Market Cap
          </p>
          <p className="text-2xl font-mono font-semibold text-parchment tabular-nums">
            {formatCurrency(fundamentals.marketCap, fundamentals.currency)}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <p className={`text-xs font-mono tracking-widest uppercase mb-1 ${verdict.cls}`}>
          Verdict
        </p>
        <p className={`text-xl font-display font-bold ${verdict.cls}`}>{verdict.label}</p>
      </div>
    </div>
  );
}
