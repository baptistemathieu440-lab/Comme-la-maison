---
name: quality-gate
description: Use before shipping or reviewing a feature — end-to-end testing with Playwright, performance (Core Web Vitals), and technical SEO. Trigger on requests like "write a Playwright test", "check performance", "audit SEO", "is this ready to ship", or before marking a UI feature complete.
---

# Quality gate

Checks to run before treating a UI feature as done. Not every check applies to every change — pick what's relevant, but don't skip a category just because it's inconvenient.

## Playwright (E2E)
- Test user-visible behavior and outcomes, not implementation details — assert on what the user sees (text, visible state), not on internal component structure.
- Cover the golden path plus the 1–2 realistic edge cases (empty state, error from the API/payment provider, unauthenticated access) — not exhaustive permutations.
- Prefer role/label-based locators (`getByRole`, `getByLabel`) over CSS selectors or test-ids where possible — they double as an accessibility check.
- For anything touching Stripe or Supabase, mock/stub the external call in tests rather than hitting live test-mode services in CI, unless the test's explicit purpose is the integration itself.
- Run `npx playwright test` locally before calling a feature done; don't rely on "it looked right in the browser."

## Performance (Core Web Vitals)
- Budget mentally against LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Common Next.js culprits to check: unoptimized `<img>` (use `next/image`), client components that could be server components, missing `loading`/`Suspense` boundaries for slow data, large client-side bundles from unnecessary `"use client"` at a high tree level, blocking third-party scripts (load via `next/script` with an appropriate `strategy`).
- Check the production build (`next build` output, bundle size), not just dev mode — dev-mode perf is not representative.

## SEO (technical)
- Every public page has a unique `<title>` and meta description — use Next.js Metadata API (`generateMetadata`) rather than manual `<head>` tags.
- Semantic HTML and a single `<h1>` per page; heading hierarchy doesn't skip levels.
- Server-rendered content for anything that should be indexable — don't put primary content behind client-only rendering.
- `sitemap.xml` and `robots.txt` present (Next.js `sitemap.ts`/`robots.ts`) and kept in sync as routes are added.
- Structured data (JSON-LD) for pages where it matters (products, articles, FAQs) when the content type supports it.
- Images have meaningful `alt` text; this also serves accessibility.

## Security note
Security review of the diff itself (secrets, injection, auth checks, unsafe deserialization, OWASP-class issues) is handled by the `security-review` skill / the Security Guidance plugin, not duplicated here — use that before merging anything touching auth, payments, or user input.

## Definition of done
A feature is ready to ship when: the golden path has a Playwright test, `next build` is clean, no obvious CWV regression, public pages have title/description/sitemap coverage, and the security pass has run.
