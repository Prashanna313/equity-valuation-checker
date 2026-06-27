import { ScenarioResult } from "@/lib/types";
import { formatCurrency, formatPct } from "@/lib/format";

interface SummaryTableProps {
  scenarios: ScenarioResult[];
  currency: string;
  currentRevenue: number;
}

const statusStyle = {
  UNDERVALUED: "text-emerald-400 bg-emerald-950/40",
  OVERVALUED: "text-red-400 bg-red-950/40",
  FAIRLY_VALUED: "text-amber-400 bg-amber-950/40",
};

const statusLabel = {
  UNDERVALUED: "Undervalued",
  OVERVALUED: "Overvalued",
  FAIRLY_VALUED: "Fair",
};

export function SummaryTable({ scenarios, currency, currentRevenue }: SummaryTableProps) {
  return (
    <section className="mb-10 overflow-x-auto">
      <h2 className="text-xs font-mono tracking-widest uppercase text-slate-500 mb-4">
        Summary — All Scenarios
      </h2>
      <table className="w-full text-xs font-mono border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-slate-500 py-2 pr-4 font-normal">Growth Rate</th>
            <th className="text-right text-slate-500 py-2 px-4 font-normal">Yr10 Revenue</th>
            <th className="text-right text-slate-500 py-2 px-4 font-normal">Exit Value (5×)</th>
            <th className="text-right text-slate-500 py-2 px-4 font-normal">Fair Value</th>
            <th className="text-right text-slate-500 py-2 pl-4 font-normal">vs Market Cap</th>
            <th className="text-center text-slate-500 py-2 pl-4 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s) => (
            <tr key={s.rate} className="border-b border-white/5 hover:bg-white/3 transition-colors">
              <td className="py-2.5 pr-4 text-parchment font-semibold tabular-nums">
                {(s.rate * 100).toFixed(0)}%
              </td>
              <td className="py-2.5 px-4 text-right text-slate-300 tabular-nums">
                {formatCurrency(s.year10Revenue, currency)}
              </td>
              <td className="py-2.5 px-4 text-right text-slate-300 tabular-nums">
                {formatCurrency(s.exitValue, currency)}
              </td>
              <td className="py-2.5 px-4 text-right text-parchment font-semibold tabular-nums">
                {formatCurrency(s.fairValue, currency)}
              </td>
              <td className={`py-2.5 pl-4 text-right font-semibold tabular-nums ${
                s.status === "UNDERVALUED" ? "text-emerald-400" :
                s.status === "OVERVALUED" ? "text-red-400" : "text-amber-400"
              }`}>
                {formatPct(s.deltaPct)}
              </td>
              <td className="py-2.5 pl-4 text-center">
                <span className={`px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-bold ${statusStyle[s.status]}`}>
                  {statusLabel[s.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-white/10">
            <td colSpan={6} className="pt-2 text-slate-600 text-[10px]">
              Current revenue: {formatCurrency(currentRevenue, currency)} · Exit multiple: 5× · Discount rate: 10% · Horizon: 10yr
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
