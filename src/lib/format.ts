export function formatCurrency(
  value: number,
  currency: string,
  compact = true
): string {
  if (currency === "INR") {
    return formatINR(value, compact);
  }
  return formatGeneric(value, currency, compact);
}

function formatINR(value: number, compact: boolean): string {
  if (!compact) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  }
  const crore = 1e7;
  const lakh = 1e5;
  const thousand = 1e3;
  if (value >= crore * 1000) {
    return `₹${(value / (crore * 1000)).toFixed(2)}L Cr`;
  }
  if (value >= crore) {
    return `₹${(value / crore).toFixed(2)} Cr`;
  }
  if (value >= lakh) {
    return `₹${(value / lakh).toFixed(2)} L`;
  }
  if (value >= thousand) {
    return `₹${(value / thousand).toFixed(2)} K`;
  }
  return `₹${value.toFixed(2)}`;
}

function formatGeneric(value: number, currency: string, compact: boolean): string {
  if (!compact) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  }
  const trillion = 1e12;
  const billion = 1e9;
  const million = 1e6;
  const symbol = getCurrencySymbol(currency);
  if (value >= trillion) return `${symbol}${(value / trillion).toFixed(2)}T`;
  if (value >= billion) return `${symbol}${(value / billion).toFixed(2)}B`;
  if (value >= million) return `${symbol}${(value / million).toFixed(2)}M`;
  return `${symbol}${value.toFixed(2)}`;
}

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    INR: "₹",
    CAD: "C$",
    AUD: "A$",
    CHF: "Fr",
    KRW: "₩",
    HKD: "HK$",
    SGD: "S$",
  };
  return symbols[currency] ?? currency + " ";
}

export function formatPct(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}
