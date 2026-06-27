# Valuation Checker

A free, open-source stock valuation tool. Enter any ticker and instantly see whether its current market cap is justified — modelled across **5 growth-rate scenarios** using a revenue-based DCF with an exit multiple.

**Live:** [valuationchecker.com](https://valuationchecker.com) · No sign-up. No paywall.

---

## How it works

1. Fetches the latest annual revenue and market cap from Yahoo Finance
2. Projects revenue forward 10 years at five assumed growth rates (5%, 10%, 20%, 30%, 50%)
3. Applies a terminal exit multiple to year-10 revenue
4. Discounts back to present value
5. Compares the fair value to today's market cap — **UNDERVALUED / FAIRLY VALUED / OVERVALUED**

Default assumptions (all adjustable in the UI):
- Discount rate: **10%**
- Exit multiple: **5×**
- Time horizon: **10 years**

A 4×4 sensitivity matrix shows how the verdict shifts across different discount rates and multiples.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [yahoo-finance2](https://github.com/gadicc/node-yahoo-finance2) for market data
- [Vitest](https://vitest.dev) for unit tests
- [Netlify](https://netlify.com) for hosting

## Getting started

**Prerequisites:** Node.js 22+

```bash
git clone https://github.com/prashanna313/equity-valuation-checker.git
cd equity-valuation-checker
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

```bash
npm run dev          # start development server
npm test             # run unit tests (vitest)
npm run test:watch   # vitest in watch mode
npm run build        # production build
npm run lint         # eslint
```

Or via Make:

```bash
make dev
make test
make build
make lint
```

## Project structure

```
src/
├── app/
│   ├── page.tsx                # Home page
│   ├── layout.tsx              # Root layout
│   ├── stock/[ticker]/page.tsx # Stock detail page
│   ├── faq/page.tsx
│   ├── how-it-works/page.tsx
│   └── api/
│       ├── valuation/route.ts  # GET /api/valuation?ticker=AAPL
│       ├── search/route.ts     # GET /api/search?q=apple
│       └── indices/route.ts
├── components/                 # UI components
└── lib/
    ├── types.ts                # Shared types and constants
    ├── valuation.ts            # Pure DCF math
    ├── yahoo.ts                # Yahoo Finance data layer
    └── format.ts               # Number/currency formatters
```

## API

### `GET /api/valuation`

| Param | Type | Default | Description |
|---|---|---|---|
| `ticker` | string | required | Stock ticker (e.g. `AAPL`, `RELIANCE.NS`) |
| `discountRate` | number | `0.10` | Annual discount rate |
| `multiple` | number | `5` | Exit revenue multiple |
| `horizon` | number | `10` | Projection years |

Response: `{ fundamentals, scenarios, sensitivity, settings, warnings, dataWarnings }`

Responses are cached for 15 minutes (`s-maxage=900, stale-while-revalidate=3600`).

### `GET /api/search`

| Param | Type | Description |
|---|---|---|
| `q` | string | Ticker or company name |

Response: `SearchResult[]` (up to 8 results, futures excluded)

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)

## Disclaimer

This tool is for **educational and informational purposes only**. It is not financial advice. The DCF model uses simplifying assumptions and public data that may be inaccurate or stale. Do your own research before making any investment decisions.
