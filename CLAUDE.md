# Comme à la Maison

Site officiel de Comme à la Maison, conciergerie Airbnb et location courte durée à Bordeaux et dans sa métropole (associés : Baptiste et Simon).

@AGENTS.md

## Stack
Next.js 16 (App Router, pages statiques) + TypeScript strict + Tailwind CSS v4 + Lucide. Pas de base de données ni de paiement pour l'instant (Supabase et Stripe restent la stack de référence si un produit en a besoin).

## Commandes
- `npm run dev` : développement sur http://localhost:3000
- `npm run lint` · `npm run typecheck` · `npm run build`
- `npm run test:e2e` : tests Playwright (parcours, simulateur, formulaire, accessibilité axe WCAG 2.2 AA), sur desktop et mobile

## Où modifier quoi
- Textes, tarifs, FAQ, services, coordonnées : `src/content/*.ts` (jamais dans les composants)
- Photos : `src/content/images.ts` + `src/assets/images/` (les photos actuelles sont provisoires, CC0)
- Chiffres de la page Transparence : `src/content/metrics.ts`
- Informations légales : `src/content/legal.ts` (null = « À compléter » affiché)
- Design system (couleurs, typographie, motifs) : `src/app/globals.css`, documenté dans `docs/design-system.md`
- Logo : `src/components/brand/` (composant) et `public/brand/` (fichiers SVG)

## Règles absolues
- Ne jamais inventer de données : clients, avis, chiffres, revenus, taux d'occupation, logements, partenaires, témoignages. Utiliser des emplacements vides.
- Toute donnée publiée porte sa nature (réel, simulation, estimation, projection), sa source et sa période.
- Aucune formulation qui garantit un niveau de revenu.
- La commission est de 20 % TTC des revenus locatifs ; les frais de ménage sont payés par les voyageurs (hors base) ; le linge est à la charge du propriétaire.
- Orthographe de la marque dans les textes : « Comme à la Maison ». Le logo fourni écrit « maison » en minuscule.
- Accessibilité WCAG 2.2 AA : contrastes documentés, jamais la couleur seule pour porter une information, `prefers-reduced-motion` respecté.
- Tailwind : ne pas passer via `className` des classes qui entrent en conflit avec celles d'un composant (taille, affichage) ; utiliser les props prévues (`size`, `variant`).

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
