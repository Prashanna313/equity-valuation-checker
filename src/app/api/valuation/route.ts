import { NextRequest, NextResponse } from "next/server";
import { getFundamentals, DataError } from "@/lib/yahoo";
import { runAllScenarios, buildSensitivityMatrix } from "@/lib/valuation";
import { ValuationSettings, DEFAULT_SETTINGS } from "@/lib/types";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const ticker = params.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "ticker is required" }, { status: 400 });
  }

  const settings: ValuationSettings = {
    discountRate: parseFloat(params.get("discountRate") ?? "") || DEFAULT_SETTINGS.discountRate,
    exitMultiple: parseFloat(params.get("multiple") ?? "") || DEFAULT_SETTINGS.exitMultiple,
    horizon: parseInt(params.get("horizon") ?? "") || DEFAULT_SETTINGS.horizon,
  };

  try {
    const fundamentals = await getFundamentals(ticker);
    const scenarios = runAllScenarios(
      fundamentals.currentRevenue,
      fundamentals.marketCap,
      settings
    );
    const sensitivity = buildSensitivityMatrix(
      fundamentals.currentRevenue,
      fundamentals.marketCap
    );

    const warnings: string[] = [];
    if (fundamentals.isUnprofitable) {
      warnings.push(
        "Revenue model may not be suitable — this company is currently unprofitable. Calculations shown with disclaimer."
      );
    }
    if (fundamentals.hasLimitedHistory) {
      warnings.push("Limited historical revenue data available.");
    }

    const { inconsistencies } = fundamentals.dataQuality;
    const dataWarnings: string[] = [];
    if (inconsistencies.includes("REVENUE_SOURCE_MISMATCH")) {
      dataWarnings.push("Revenue figures from two sources diverge >30% — data may be inconsistent.");
    }
    if (inconsistencies.includes("SUSPICIOUS_PS_RATIO")) {
      dataWarnings.push("Implied P/S ratio is implausible — possible unit or currency mismatch in source data.");
    }
    if (inconsistencies.includes("STALE_REVENUE")) {
      dataWarnings.push(`Revenue data may be stale (last filed: ${fundamentals.dataQuality.revenueDate}).`);
    }

    return NextResponse.json(
      { fundamentals, scenarios, sensitivity, settings, warnings, dataWarnings },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
        },
      }
    );
  } catch (err) {
    if (err instanceof DataError) {
      const statusMap = {
        NOT_FOUND: 404,
        NO_REVENUE: 422,
        NO_MARKET_CAP: 422,
      };
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: statusMap[err.code] }
      );
    }
    console.error("Valuation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
