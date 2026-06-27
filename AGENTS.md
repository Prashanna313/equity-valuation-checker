<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project runs **Next.js 16.2.9** with **React 19** and **Tailwind CSS v4**. All three have breaking changes from what most training data covers. Read the relevant guide before writing code:

```
node_modules/next/dist/docs/01-app/     # App Router APIs and conventions
node_modules/next/dist/docs/03-architecture/
```

## Known breaking changes to watch for

**Next.js 16 / App Router**
- `generateMetadata` is the API for page metadata — no `<Head>` component
- Route handlers use `NextRequest` / `NextResponse` — no `req`/`res` from pages
- Server Components are the default — use `"use client"` only when you need browser APIs or hooks
- `next/image` and `next/font` APIs may differ from v13/v14 docs

**React 19**
- `use()` hook for promises and context
- Actions / `useActionState` / `useFormStatus` replace many form patterns
- `ref` is now a plain prop on function components — no `forwardRef` needed

**Tailwind CSS v4**
- Config is in CSS (`@theme` in `globals.css`), not `tailwind.config.js`
- `@apply` still works but the utility API has changed in places
- PostCSS plugin is `@tailwindcss/postcss`, not `tailwindcss` directly

**yahoo-finance2 v3**
- `fundamentalsTimeSeries` replaces deprecated `incomeStatementHistory`
- The API is instantiated (`new YahooFinance()`) not used as a static module
- Heed any deprecation notices logged at runtime

Heed deprecation notices printed during `npm run dev` or `npm run build` — they indicate APIs that will break.
<!-- END:nextjs-agent-rules -->
