import {
  GROWTH_RATES,
  ScenarioResult,
  SensitivityCell,
  ValuationSettings,
  ValuationStatus,
  DEFAULT_SETTINGS,
} from "./types";

export function projectRevenue(current: number, rate: number, years: number): number {
  return current * Math.pow(1 + rate, years);
}

export function calcExitValue(year10Revenue: number, multiple: number): number {
  return year10Revenue * multiple;
}

export function calcPresentValue(exitVal: number, discountRate: number, years: number): number {
  return exitVal / Math.pow(1 + discountRate, years);
}

function classifyStatus(fairValue: number, marketCap: number): ValuationStatus {
  const ratio = Math.abs(fairValue - marketCap) / marketCap;
  if (ratio <= 0.05) return "FAIRLY_VALUED";
  return fairValue > marketCap ? "UNDERVALUED" : "OVERVALUED";
}

function calcDeltaPct(fairValue: number, marketCap: number): number {
  return ((fairValue - marketCap) / marketCap) * 100;
}

export function runScenario(
  currentRevenue: number,
  marketCap: number,
  rate: number,
  settings: ValuationSettings = DEFAULT_SETTINGS
): ScenarioResult {
  const year10Revenue = projectRevenue(currentRevenue, rate, settings.horizon);
  const exitValue = calcExitValue(year10Revenue, settings.exitMultiple);
  const fairValue = calcPresentValue(exitValue, settings.discountRate, settings.horizon);
  const status = classifyStatus(fairValue, marketCap);
  const deltaPct = calcDeltaPct(fairValue, marketCap);
  return { rate, year10Revenue, exitValue, fairValue, status, deltaPct };
}

export function runAllScenarios(
  currentRevenue: number,
  marketCap: number,
  settings: ValuationSettings = DEFAULT_SETTINGS
): ScenarioResult[] {
  return GROWTH_RATES.map((rate) => runScenario(currentRevenue, marketCap, rate, settings));
}

export function buildSensitivityMatrix(
  currentRevenue: number,
  marketCap: number,
  discountRates: number[] = [0.08, 0.10, 0.12, 0.15],
  multiples: number[] = [3, 5, 7, 10],
  horizon = 10
): SensitivityCell[][] {
  return discountRates.map((discountRate) =>
    multiples.map((multiple) => {
      const settings: ValuationSettings = { discountRate, exitMultiple: multiple, horizon };
      const year10Revenue = projectRevenue(currentRevenue, 0.10, horizon);
      const exitValue = calcExitValue(year10Revenue, multiple);
      const fairValue = calcPresentValue(exitValue, discountRate, horizon);
      const status = classifyStatus(fairValue, marketCap);
      const deltaPct = calcDeltaPct(fairValue, marketCap);
      return { discountRate, multiple, fairValue, status, deltaPct };
    })
  );
}
