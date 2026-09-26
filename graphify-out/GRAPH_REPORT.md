# Graph Report - Comme-la-maison  (2026-09-26)

## Corpus Check
- Corpus is ~1,935 words - fits in a single context window. You may not need a graph.

## Summary
- 53 nodes · 72 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.81)
- Token cost: 62,143 input · 0 output

## Community Hubs (Navigation)
- Startup Strategy Workflow
- Coding Conventions
- SEO & Server Rendering
- Quality Gate & Testing
- Workspace & Plugins
- Server-side Payments & APIs
- Trusted Server Boundaries
- MVP Validation
- Supabase Schema Management

## God Nodes (most connected - your core abstractions)
1. `product-stack Skill` - 18 edges
2. `startup-strategy Skill` - 9 edges
3. `quality-gate Skill` - 7 edges
4. `Definition of done` - 6 edges
5. `Comme la maison Workspace` - 5 edges
6. `Recommended Marketplace Plugins` - 5 edges
7. `Technical SEO` - 5 edges
8. `Playwright E2E testing` - 4 edges
9. `Core Web Vitals budget (LCP<2.5s, CLS<0.1, INP<200ms)` - 4 edges
10. `Pricing strategy` - 4 edges

## Surprising Connections (you probably didn't know these)
- `startup-strategy Skill` --semantically_similar_to--> `marketing plugin`  [INFERRED] [semantically similar]
  .claude/skills/startup-strategy/SKILL.md → CLAUDE.md
- `product-stack Skill` --implements--> `Stack: Next.js + TypeScript + Tailwind + Supabase + Stripe`  [INFERRED]
  .claude/skills/product-stack/SKILL.md → CLAUDE.md
- `Comme la maison Workspace` --references--> `product-stack Skill`  [EXTRACTED]
  CLAUDE.md → .claude/skills/product-stack/SKILL.md
- `Comme la maison Workspace` --references--> `quality-gate Skill`  [EXTRACTED]
  CLAUDE.md → .claude/skills/quality-gate/SKILL.md
- `Comme la maison Workspace` --references--> `startup-strategy Skill`  [EXTRACTED]
  CLAUDE.md → .claude/skills/startup-strategy/SKILL.md

## Hyperedges (group relationships)
- **Server-side trust boundary for secrets and payments** — _claude_skills_product_stack_skill_api_secret_proxy, _claude_skills_product_stack_skill_stripe_server_side_payments, _claude_skills_product_stack_skill_service_role_client, _claude_skills_product_stack_skill_stripe_webhooks_source_of_truth, _claude_skills_product_stack_skill_zod_boundary_validation [INFERRED 0.85]
- **Ship-readiness checks (definition of done)** — _claude_skills_quality_gate_skill_playwright_e2e, _claude_skills_quality_gate_skill_core_web_vitals, _claude_skills_quality_gate_skill_technical_seo, _claude_skills_quality_gate_skill_security_review_delegation, _claude_skills_quality_gate_skill_definition_of_done [EXTRACTED 1.00]
- **Idea-to-launch playbook sequence** — _claude_skills_startup_strategy_skill_market_research, _claude_skills_startup_strategy_skill_competitor_analysis, _claude_skills_startup_strategy_skill_business_model, _claude_skills_startup_strategy_skill_financial_model, _claude_skills_startup_strategy_skill_mvp_planning, _claude_skills_startup_strategy_skill_pricing, _claude_skills_startup_strategy_skill_go_to_market [EXTRACTED 1.00]

## Communities (9 total, 1 thin omitted)

### Community 0 - "Startup Strategy Workflow"
Cohesion: 0.18
Nodes (13): Business model, Competitor analysis, Financial model, Go-to-market, Jobs-to-be-Done framing, Launch sequence (waitlist/beta, soft, public), Lean Canvas, Market research (+5 more)

### Community 1 - "Coding Conventions"
Cohesion: 0.29
Nodes (8): Isolate flaky integrations (rate limits, partial failures), Mobile-first responsive styling, product-stack Skill, Supabase Row Level Security on every table, Tailwind design tokens over arbitrary values, Run tsc --noEmit / next build before done, TypeScript strict mode, unknown + narrowing, Zod validation at boundaries

### Community 2 - "SEO & Server Rendering"
Cohesion: 0.29
Nodes (7): App Router + Server Components by default, JSON-LD structured data, Next.js Metadata API (generateMetadata), Next.js performance culprits (next/image, next/script, Suspense), Server-rendered indexable content, sitemap.ts / robots.ts, Technical SEO

### Community 3 - "Quality Gate & Testing"
Cohesion: 0.48
Nodes (7): Core Web Vitals budget (LCP<2.5s, CLS<0.1, INP<200ms), Definition of done, Playwright E2E testing, Measure production build, not dev mode, quality-gate Skill, Role/label-based locators, Security review delegated to security-review skill

### Community 4 - "Workspace & Plugins"
Cohesion: 0.29
Nodes (7): Comme la maison Workspace, design plugin, engineering plugin, marketing plugin, Stack: Next.js + TypeScript + Tailwind + Supabase + Stripe, Recommended Marketplace Plugins, security-guidance plugin

### Community 5 - "Server-side Payments & APIs"
Cohesion: 0.67
Nodes (3): Proxy third-party API calls server-side, Server-side Stripe payment logic, Mock Stripe/Supabase in tests

### Community 6 - "Trusted Server Boundaries"
Cohesion: 0.67
Nodes (3): Server Actions / Route Handlers split, Service-role client only in trusted server contexts, Stripe webhooks as source of truth (signature-verified, idempotent)

### Community 7 - "MVP Validation"
Cohesion: 0.67
Nodes (3): Concierge / Wizard of Oz test, MVP planning, Riskiest assumption test

## Knowledge Gaps
- **9 isolated node(s):** `engineering plugin`, `design plugin`, `Next.js Metadata API (generateMetadata)`, `JSON-LD structured data`, `Jobs-to-be-Done framing` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 16 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `product-stack Skill` connect `Coding Conventions` to `SEO & Server Rendering`, `Quality Gate & Testing`, `Workspace & Plugins`, `Server-side Payments & APIs`, `Trusted Server Boundaries`, `Supabase Schema Management`?**
  _High betweenness centrality (0.515) - this node is a cross-community bridge._
- **Why does `startup-strategy Skill` connect `Startup Strategy Workflow` to `Workspace & Plugins`, `MVP Validation`?**
  _High betweenness centrality (0.497) - this node is a cross-community bridge._
- **Why does `Comme la maison Workspace` connect `Workspace & Plugins` to `Startup Strategy Workflow`, `Coding Conventions`, `Quality Gate & Testing`?**
  _High betweenness centrality (0.496) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `product-stack Skill` (e.g. with `Stack: Next.js + TypeScript + Tailwind + Supabase + Stripe` and `quality-gate Skill`) actually correct?**
  _`product-stack Skill` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `engineering plugin`, `design plugin`, `Next.js Metadata API (generateMetadata)` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._