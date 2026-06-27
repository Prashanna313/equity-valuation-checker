import { SensitivityCell } from "@/lib/types";
import { formatCurrency, formatPct } from "@/lib/format";

interface SensitivityMatrixProps {
  matrix: SensitivityCell[][];
  currency: string;
  discountRates?: number[];
  multiples?: number[];
}

const DISCOUNT_RATES = [0.08, 0.10, 0.12, 0.15];
const MULTIPLES = [3, 5, 7, 10];

const cellStyle = {
  UNDERVALUED: "bg-emerald-950/50 text-emerald-300",
  OVERVALUED: "bg-red-950/50 text-red-300",
  FAIRLY_VALUED: "bg-amber-950/50 text-amber-300",
};

export function SensitivityMatrix({
  matrix,
  currency,
  discountRates = DISCOUNT_RATES,
  multiples = MULTIPLES,
}: SensitivityMatrixProps) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-mono tracking-widest uppercase text-slate-500 mb-1">
        Sensitivity Analysis
      </h2>
      <p className="text-xs text-slate-600 mb-4">
        Fair value at 10% assumed growth rate, across different discount rates and exit multiples.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr>
              <th className="text-left text-slate-500 py-2 pr-4 font-normal">
                Discount ↓ / Multiple →
              </th>
              {multiples.map((m) => (
                <th key={m} className="text-right text-slate-500 py-2 px-2 font-normal">
                  {m}×
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, ri) => (
              <tr key={ri} className="border-t border-white/5">
                <td className="py-2 pr-4 text-slate-400 tabular-nums">
                  {(discountRates[ri] * 100).toFixed(0)}%
                </td>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`py-2 px-2 text-right rounded tabular-nums ${cellStyle[cell.status]}`}
                  >
                    <span className="block font-semibold">
                      {formatCurrency(cell.fairValue, currency)}
                    </span>
                    <span className="text-[10px] opacity-70">{formatPct(cell.deltaPct)}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
