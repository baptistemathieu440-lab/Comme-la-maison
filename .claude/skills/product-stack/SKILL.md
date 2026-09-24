---
name: product-stack
description: Use when writing or reviewing application code for this project's stack — React, Next.js, TypeScript, Tailwind CSS, Supabase, third-party API integration, or Stripe. Trigger whenever the user asks to build a page/component, set up auth or the database, add an API integration, or wire up payments, and whenever code in these technologies is being written or reviewed.
---

# Product stack conventions

Default conventions for building on React + Next.js + TypeScript + Tailwind + Supabase + Stripe. Apply these unless the project's own code already established a different, consistent pattern — match existing conventions over this file when they conflict.

## Next.js / React
- App Router by default. Server Components unless a component needs interactivity/state/browser APIs — then mark it `"use client"` and keep it as small and as low in the tree as possible.
- Data fetching happens in Server Components or Route Handlers, not in client-side `useEffect` calls, unless the data is genuinely client-only (e.g. depends on browser state).
- Mutations go through Server Actions for form-like flows; use Route Handlers for webhooks and third-party callbacks (Stripe, OAuth).
- Colocate a route's components under its `app/` segment; only promote to `components/` once reused elsewhere.

## TypeScript
- `strict: true`. No `any` without a comment explaining why it's unavoidable. Prefer `unknown` + narrowing at boundaries (API responses, form input, webhook payloads).
- Derive types from a single source of truth: generate Supabase types (`supabase gen types typescript`) rather than hand-writing DB row types; derive Zod schemas → types for form/API validation rather than duplicating.

## Tailwind CSS
- Use design tokens (theme colors/spacing/radius) over arbitrary values (`bg-[#1a2b3c]`) — arbitrary values are a signal the design system is missing a token.
- Compose repeated utility clusters into a component, not into `@apply` — `@apply` hides the utility list from tooling and diffs worse.
- Mobile-first: base classes target the smallest breakpoint, `sm:`/`md:`/`lg:` layer up.

## Supabase
- Row Level Security is on by default for every table — never ship a table with RLS disabled to "get it working," even temporarily.
- Use the server client (with the user's session) for anything gated by RLS; use the service-role client only in trusted server contexts (webhooks, cron/edge functions), never expose it to the client bundle.
- Migrations are files, not dashboard edits — every schema change goes through `supabase/migrations` so it's reproducible.

## API integration
- Never call third-party APIs with secret keys from the client — proxy through a Route Handler or Server Action.
- Validate and narrow every external response at the boundary (Zod) before it flows into app logic — don't trust the third party's TypeScript types as runtime truth.
- Handle rate limits and partial failures explicitly; don't let one flaky integration take down an unrelated page (isolate with try/catch + fallback UI, not a top-level crash).

## Stripe
- All payment-mutating logic lives server-side. The client only creates a Checkout Session / PaymentIntent via a server endpoint and redirects/confirms — it never touches secret keys.
- Webhooks are the source of truth for order/subscription state, not the client-side redirect result — verify the webhook signature, then update the DB from the event, idempotently (Stripe can retry/deliver out of order).
- Use Stripe's test mode + CLI (`stripe listen --forward-to`) for local webhook development; never hardcode a webhook secret.

## Before calling it done
Run the project's typecheck/lint/build (`tsc --noEmit`, `next build`) before considering a change finished — a change that doesn't type-check or build isn't done, regardless of how the diff looks.
