# Comme la maison

Workspace for building businesses and digital products. This repo currently holds Claude Code configuration only — no application code yet.

## Stack (when building a product here)
React + Next.js (App Router) + TypeScript + Tailwind CSS + Supabase + Stripe.

## Project skills (`.claude/skills/`)
- `startup-strategy` — market research, competitor analysis, business model, financial model, MVP planning, pricing, go-to-market.
- `product-stack` — coding conventions for the stack above (Next.js, Supabase RLS, Stripe webhooks, API integration).
- `quality-gate` — Playwright, Core Web Vitals, technical SEO checklist before shipping a feature.

These load automatically when the task matches; no need to invoke them by name.

## Recommended marketplace plugins
Not bundled in this repo — install from the claude.ai plugin catalog (`knowledge-work-plugins` marketplace) if useful:
- `engineering` (Anthropic) — code review, architecture, debugging, testing strategy.
- `design` (Anthropic) — design critique, design systems, UX copy, accessibility review.
- `marketing` (Anthropic) — competitive briefs, campaign planning, SEO audits.
- `security-guidance` (Anthropic) — automated security review on generated code.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
