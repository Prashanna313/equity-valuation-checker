import { ScenarioResult } from "@/lib/types";
import { ValuationGapBar } from "./ValuationGapBar";

interface ScenarioRowsProps {
  scenarios: ScenarioResult[];
  currency: string;
  marketCap: number;
}

export function ScenarioRows({ scenarios, currency, marketCap }: ScenarioRowsProps) {
  const maxFairValue = Math.max(...scenarios.map((s) => s.fairValue));
  return (
    <section className="mb-10">
      <h2 className="text-xs font-mono tracking-widest uppercase text-slate-500 mb-4">
        Valuation Scenarios
      </h2>
      {scenarios.map((scenario) => (
        <ValuationGapBar
          key={scenario.rate}
          scenario={scenario}
          currency={currency}
          marketCap={marketCap}
          maxFairValue={maxFairValue}
        />
      ))}
    </section>
  );
}
