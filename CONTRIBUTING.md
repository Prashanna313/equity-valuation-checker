# Contributing to Valuation Checker

Thanks for taking the time to contribute. This is a small, focused tool — contributions that keep it simple and correct are most welcome.

## Ways to contribute

- **Bug reports** — open an issue with a ticker that produces wrong/unexpected output
- **Data quality issues** — if a stock shows implausible numbers, report it with the ticker and what you expected
- **UI fixes** — layout bugs, accessibility, mobile issues
- **New features** — open an issue first to discuss before building

## Development setup

```bash
git clone https://github.com/prashanna313/equity-valuation-checker.git
cd equity-valuation-checker
npm ci
npm run dev
```

Requires Node.js 22+.

## Before submitting a PR

1. **Tests pass:** `npm test`
2. **Lint passes:** `npm run lint`
3. **Build succeeds:** `npm run build`
4. Keep PRs focused — one concern per PR
5. If you change the valuation math in `src/lib/valuation.ts`, add or update tests in `src/lib/valuation.test.ts`

## Project conventions

- All shared types live in `src/lib/types.ts`
- `src/lib/valuation.ts` is pure functions only — no I/O, no side effects
- `src/lib/yahoo.ts` owns all Yahoo Finance interaction
- Components go in `src/components/`, named exports, one file each
- `@/` alias resolves to `src/`
- No comments unless the *why* is non-obvious

## Commit style

Plain English imperative: `fix revenue fallback for ADRs`, `add sensitivity matrix to API response`. No ticket numbers or emoji required.

## Code of conduct

Be respectful. Critique code, not people.
