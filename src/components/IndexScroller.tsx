"use client";

import { useEffect, useState } from "react";
import type { IndexQuote } from "@/app/api/indices/route";

function fmt(price: number | null, symbol: string): string {
  if (price === null) return "—";
  const isLargeIndex = ["^N225", "^BSESN"].includes(symbol);
  return price.toLocaleString("en-US", {
    minimumFractionDigits: isLargeIndex ? 0 : 2,
    maximumFractionDigits: isLargeIndex ? 0 : 2,
  });
}

function IndexItem({ q }: { q: IndexQuote }) {
  const up = (q.changePct ?? 0) >= 0;
  const color = up ? "text-emerald-400" : "text-red-400";
  const arrow = up ? "▲" : "▼";
  const pct = q.changePct !== null ? Math.abs(q.changePct).toFixed(2) : "—";

  return (
    <span className="inline-flex items-baseline gap-2 px-6 border-r border-white/8 last:border-r-0 whitespace-nowrap">
      <span className="text-slate-500 text-[11px] font-mono uppercase tracking-widest">
        {q.label}
      </span>
      <span className="text-parchment text-[11px] font-mono tabular-nums">
        {fmt(q.price, q.symbol)}
      </span>
      <span className={`text-[10px] font-mono tabular-nums ${color}`}>
        {arrow} {pct}%
      </span>
    </span>
  );
}

export function IndexScroller() {
  const [quotes, setQuotes] = useState<IndexQuote[]>([]);

  async function load() {
    try {
      const res = await fetch("/api/indices");
      if (res.ok) setQuotes(await res.json());
    } catch {
      // silently ignore — stale data stays displayed
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  if (quotes.length === 0) return null;

  return (
    <div className="border-b border-white/5 bg-surface/60 overflow-hidden h-8 flex items-center select-none">
      <div className="animate-marquee flex">
        {[...quotes, ...quotes].map((q, i) => (
          <IndexItem key={`${q.symbol}-${i}`} q={q} />
        ))}
      </div>
    </div>
  );
}
