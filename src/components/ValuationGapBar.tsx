"use client";

import { useEffect, useRef } from "react";
import { ScenarioResult } from "@/lib/types";
import { formatCurrency, formatPct } from "@/lib/format";

interface ValuationGapBarProps {
  scenario: ScenarioResult;
  currency: string;
  marketCap: number;
  maxFairValue: number;
}

const STATUS_COLORS = {
  UNDERVALUED: { bar: "#3D9970", text: "text-emerald-400", label: "UNDERVALUED" },
  OVERVALUED: { bar: "#D64545", text: "text-red-400", label: "OVERVALUED" },
  FAIRLY_VALUED: { bar: "#D9A441", text: "text-amber-400", label: "FAIRLY VALUED" },
};

export function ValuationGapBar({ scenario, currency, marketCap, maxFairValue }: ValuationGapBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const colors = STATUS_COLORS[scenario.status];
  const scale = Math.max(maxFairValue, marketCap) * 1.05;
  const fairPct = Math.min((scenario.fairValue / scale) * 100, 100);
  const mktPct = Math.min((marketCap / scale) * 100, 100);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      bar.style.width = `${fairPct}%`;
      return;
    }
    bar.style.width = "0%";
    const raf = requestAnimationFrame(() => {
      bar.style.transition = "width 0.7s cubic-bezier(0.16, 1, 0.3, 1)";
      bar.style.width = `${fairPct}%`;
    });
    return () => cancelAnimationFrame(raf);
  }, [fairPct]);

  return (
    <div className="py-4 border-b border-white/5 last:border-0">
      <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-parchment tabular-nums">
            {(scenario.rate * 100).toFixed(0)}% growth
          </span>
          <span className={`text-xs font-mono tracking-wider ${colors.text}`}>
            {colors.label}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 tabular-nums">
          <span>
            Fair: <span className={`font-semibold ${colors.text}`}>
              {formatCurrency(scenario.fairValue, currency)}
            </span>
          </span>
          <span className={`font-semibold ${colors.text}`}>
            {formatPct(scenario.deltaPct)}
          </span>
        </div>
      </div>

      <div className="relative h-6 bg-white/5 rounded overflow-hidden">
        {/* Fair value bar */}
        <div
          ref={barRef}
          className="absolute top-0 left-0 h-full rounded"
          style={{ backgroundColor: colors.bar, opacity: 0.85, width: 0 }}
        />
        {/* Market cap reference line */}
        <div
          className="absolute top-0 h-full w-0.5 bg-parchment/60"
          style={{ left: `${mktPct}%` }}
          title={`Market Cap: ${formatCurrency(marketCap, currency)}`}
        />
      </div>

      <div className="flex justify-between text-xs font-mono text-slate-600 mt-1">
        <span>0</span>
        <span>
          Mkt Cap ({formatCurrency(marketCap, currency)})
        </span>
      </div>
    </div>
  );
}
