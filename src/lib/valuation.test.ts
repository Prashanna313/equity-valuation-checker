import { describe, it, expect } from "vitest";
import {
  projectRevenue,
  calcExitValue,
  calcPresentValue,
  runScenario,
  runAllScenarios,
} from "./valuation";
import { DEFAULT_SETTINGS } from "./types";

// Spec's worked example: current = 100, 5% growth, 5x multiple, 10% discount, 10 years
const CURRENT = 100;
const MARKET_CAP = 400;

describe("projectRevenue", () => {
  it("5% over 10 years → ×1.629", () => {
    const result = projectRevenue(CURRENT, 0.05, 10);
    expect(result).toBeCloseTo(162.89, 1);
  });
  it("10% over 10 years → ×2.594", () => {
    expect(projectRevenue(CURRENT, 0.10, 10)).toBeCloseTo(259.37, 1);
  });
  it("50% over 10 years → ×57.67", () => {
    expect(projectRevenue(CURRENT, 0.50, 10)).toBeCloseTo(5767, 0);
  });
});

describe("calcExitValue", () => {
  it("5x multiple on 162.89 → 814.45", () => {
    expect(calcExitValue(162.89, 5)).toBeCloseTo(814.45, 1);
  });
});

describe("calcPresentValue", () => {
  it("PV factor for 10% over 10 years = 0.3855", () => {
    const factor = 1 / Math.pow(1.10, 10);
    expect(factor).toBeCloseTo(0.3855, 3);
    expect(calcPresentValue(814.45, 0.10, 10)).toBeCloseTo(814.45 * 0.3855, 1);
  });
  it("5% scenario: fair value ≈ 314.16", () => {
    expect(calcPresentValue(814.45, 0.10, 10)).toBeCloseTo(314.16, 0);
  });
});

describe("runScenario", () => {
  it("5% growth with marketCap=400 → OVERVALUED", () => {
    const r = runScenario(CURRENT, MARKET_CAP, 0.05, DEFAULT_SETTINGS);
    expect(r.status).toBe("OVERVALUED");
    expect(r.year10Revenue).toBeCloseTo(162.89, 1);
    expect(r.fairValue).toBeCloseTo(314.16, 0);
    expect(r.deltaPct).toBeCloseTo(-21.5, 0);
  });
  it("10% growth with marketCap=400 → UNDERVALUED", () => {
    const r = runScenario(CURRENT, MARKET_CAP, 0.10, DEFAULT_SETTINGS);
    expect(r.status).toBe("UNDERVALUED");
    expect(r.fairValue).toBeGreaterThan(400);
  });
  it("50% growth → very high fair value, UNDERVALUED", () => {
    const r = runScenario(CURRENT, MARKET_CAP, 0.50, DEFAULT_SETTINGS);
    expect(r.status).toBe("UNDERVALUED");
  });
});

describe("runAllScenarios", () => {
  it("returns 5 scenarios", () => {
    const results = runAllScenarios(CURRENT, MARKET_CAP, DEFAULT_SETTINGS);
    expect(results).toHaveLength(5);
    expect(results.map((r) => r.rate)).toEqual([0.05, 0.10, 0.20, 0.30, 0.50]);
  });
  it("5% overvalued, 10%+ undervalued for this example", () => {
    const results = runAllScenarios(CURRENT, MARKET_CAP, DEFAULT_SETTINGS);
    expect(results[0].status).toBe("OVERVALUED");
    expect(results[1].status).toBe("UNDERVALUED");
    expect(results[2].status).toBe("UNDERVALUED");
  });
});
