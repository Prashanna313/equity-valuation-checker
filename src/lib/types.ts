export type DataInconsistency =
  | "REVENUE_SOURCE_MISMATCH"   // timeSeries and financialData revenues differ >30%
  | "SUSPICIOUS_PS_RATIO"       // P/S < 0.01 or > 10000 — likely unit/currency mismatch
  | "STALE_REVENUE"             // latest revenue date is >18 months old
  | "REVENUE_CURRENCY_MISMATCH" // revenue and market cap may be in different currencies
  | "ZERO_OR_NEGATIVE_REVENUE"; // revenue ≤ 0 after fetch (should have thrown, belt-and-suspenders)

export interface DataQuality {
  inconsistencies: DataInconsistency[];
  revenueDate: string | null;       // ISO date of the revenue period used
  revenueSource: "timeSeries" | "financialData_fallback";
  timeSeriesRevenue: number | null; // raw value from timeSeries (for display)
  fallbackRevenue: number | null;   // raw value from financialData (for display)
}

export interface Fundamentals {
  symbol: string;
  longName: string;
  exchangeName: string;
  currency: string;
  currentRevenue: number;
  marketCap: number;
  netIncome: number | null;
  revenueHistoryLength: number;
  isUnprofitable: boolean;
  hasLimitedHistory: boolean;
  dataQuality: DataQuality;
}

export interface ValuationSettings {
  discountRate: number;
  exitMultiple: number;
  horizon: number;
}

export const DEFAULT_SETTINGS: ValuationSettings = {
  discountRate: 0.10,
  exitMultiple: 5,
  horizon: 10,
};

export const GROWTH_RATES = [0.05, 0.10, 0.20, 0.30, 0.50];

export type ValuationStatus = "UNDERVALUED" | "OVERVALUED" | "FAIRLY_VALUED";

export interface ScenarioResult {
  rate: number;
  year10Revenue: number;
  exitValue: number;
  fairValue: number;
  status: ValuationStatus;
  deltaPct: number;
}

export interface SensitivityCell {
  discountRate: number;
  multiple: number;
  fairValue: number;
  status: ValuationStatus;
  deltaPct: number;
}

export interface ValuationResult {
  fundamentals: Fundamentals;
  scenarios: ScenarioResult[];
  sensitivity: SensitivityCell[][];
  settings: ValuationSettings;
  warnings: string[];
}

export interface SearchResult {
  symbol: string;
  shortname: string;
  exchange: string;
  typeDisp: string;
}
