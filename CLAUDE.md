@AGENTS.md

# Valuation Checker

Stock valuation tool: enter a ticker, get a revenue-based DCF across 5 growth scenarios with a sensitivity matrix.

## Stack

- **Next.js 16.2.9** (App Router) — see AGENTS.md for version warnings
- **React 19.2.4**
- **Tailwind CSS v4** (PostCSS plugin, not the v3 CLI)
- **yahoo-finance2 ^3** — data source for market cap and revenue
- **Vitest 4** — unit tests (`npm test` / `npm run test:watch`)
- **Netlify** — deploy target (`@netlify/plugin-nextjs`)

## Project layout

```
src/
  app/
    page.tsx                  # Home: hero + SearchBox + popular tickers
    layout.tsx                # Root layout (fonts, Header, DisclaimerBanner, SiteFooter)
    globals.css               # Tailwind base + custom tokens (parchment, surface, etc.)
    robots.ts / sitemap.ts    # SEO
    faq/page.tsx
    how-it-works/page.tsx
    stock/[ticker]/page.tsx   # Stock detail page (fetches /api/valuation)
    api/
      valuation/route.ts      # GET ?ticker=&discountRate=&multiple=&horizon=
      search/route.ts         # GET ?q= — ticker autocomplete
      indices/route.ts        # Market index snapshot
  components/                 # All UI components (see below)
  lib/
    types.ts                  # All shared types and constants
    valuation.ts              # Pure DCF math (no I/O)
    yahoo.ts                  # yahoo-finance2 wrappers + DataError
    format.ts                 # Number/currency formatters
    valuation.test.ts         # Vitest unit tests
```

## Key types (`src/lib/types.ts`)

- `ValuationSettings` — `{ discountRate, exitMultiple, horizon }`
- `DEFAULT_SETTINGS` — `{ discountRate: 0.10, exitMultiple: 5, horizon: 10 }`
- `GROWTH_RATES` — `[0.05, 0.10, 0.20, 0.30, 0.50]`
- `ScenarioResult` — one row per growth rate
- `SensitivityCell` — one cell in the discount-rate × exit-multiple matrix
- `Fundamentals` — enriched ticker data including `dataQuality`
- `DataQuality` / `DataInconsistency` — cross-check flags (`REVENUE_SOURCE_MISMATCH`, `SUSPICIOUS_PS_RATIO`, `STALE_REVENUE`, etc.)

## Valuation model (`src/lib/valuation.ts`)

Pure functions, no side effects:
1. `projectRevenue(current, rate, years)` — compound growth
2. `calcExitValue(year10Revenue, multiple)` — terminal value via revenue multiple
3. `calcPresentValue(exitVal, discountRate, years)` — DCF discount
4. `runScenario(revenue, marketCap, rate, settings)` → `ScenarioResult`
5. `runAllScenarios(...)` — runs all 5 `GROWTH_RATES`
6. `buildSensitivityMatrix(...)` — 4×4 grid (discount rates × multiples), fixed 10% growth

## Data layer (`src/lib/yahoo.ts`)

- `getFundamentals(ticker)` — fetches via `quoteSummary` + `fundamentalsTimeSeries`; throws `DataError` on NOT_FOUND / NO_REVENUE / NO_MARKET_CAP
- `searchTickers(query)` — autocomplete, filters futures, returns up to 8 results
- Revenue source priority: `timeSeries.annualTotalRevenue` → `financialData.totalRevenue` fallback
- Cross-checks emit `DataInconsistency` codes; the API route converts these to user-facing `dataWarnings`

## API routes

| Route | Method | Params | Response |
|---|---|---|---|
| `/api/valuation` | GET | `ticker`, `discountRate`, `multiple`, `horizon` | `{ fundamentals, scenarios, sensitivity, settings, warnings, dataWarnings }` |
| `/api/search` | GET | `q` | `SearchResult[]` |
| `/api/indices` | GET | — | index snapshot |

Valuation route sets `Cache-Control: public, s-maxage=900, stale-while-revalidate=3600`.

## Dev commands

```bash
npm run dev        # local dev server
npm test           # vitest run (unit tests only)
npm run test:watch # vitest watch
npm run build      # production build
npm run lint       # eslint
```

## Conventions

- All shared types live in `src/lib/types.ts` — don't scatter type definitions into component files
- DCF math stays in `src/lib/valuation.ts` (pure) — keep it side-effect free so tests stay fast
- Data fetching (yahoo-finance2) stays in `src/lib/yahoo.ts`
- Components are in `src/components/` — one file per component, named exports
- `@/` alias resolves to `src/`
