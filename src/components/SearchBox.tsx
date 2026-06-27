"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SearchResult } from "@/lib/types";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data: SearchResult[] = await res.json();
      setResults(data);
      setOpen(data.length > 0);
      setActiveIdx(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const select = (symbol: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/stock/${symbol}`);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      select(results[activeIdx].symbol);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search ticker or company — AAPL, RELIANCE.NS…"
          aria-label="Search for a stock"
          aria-autocomplete="list"
          aria-expanded={open}
          className="w-full bg-surface border border-white/15 rounded px-4 py-3 text-parchment placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-white/40 transition-colors"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
            …
          </span>
        )}
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-surface border border-white/15 rounded shadow-2xl overflow-hidden"
        >
          {results.map((r, i) => (
            <li
              key={r.symbol}
              role="option"
              aria-selected={i === activeIdx}
              onClick={() => select(r.symbol)}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                i === activeIdx ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <div>
                <span className="font-mono font-bold text-parchment text-sm">{r.symbol}</span>
                <span className="ml-3 text-slate-400 text-xs">{r.shortname}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                <span>{r.exchange}</span>
                {r.typeDisp && <span className="text-slate-700">·</span>}
                <span>{r.typeDisp}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
