# Comme à la Maison

Site officiel de Comme à la Maison, conciergerie Airbnb et location courte durée à Bordeaux et dans sa métropole (associés : Baptiste et Simon).

@AGENTS.md

## Stack
Next.js 16 (App Router) + TypeScript strict + Tailwind CSS v4 + Lucide, hébergé sur Netlify.
Plateforme de gestion : Supabase (Postgres, comptes, stockage privé, règles d'accès par ligne), région Paris.
- Site public : groupe de routes `src/app/(site)`, pages statiques, fonctionne sans base.
- Espaces connectés : `/admin` (Baptiste et Simon, double authentification obligatoire), `/owner` (propriétaires), `/staff` (agents).
- Schéma versionné dans `supabase/migrations` (jamais de modification à la main) ; types générés dans `src/lib/supabase/database.types.ts`.

## Commandes
- `npm run dev` : développement sur http://localhost:3000
- `npm run lint` · `npm run typecheck` · `npm run build`
- `npm run test:e2e` : tests Playwright du site public (desktop et mobile) et, si la base locale tourne, de la plateforme (`tests/platform` : isolation des données par rôle, accès, parcours, accessibilité axe WCAG 2.2 AA)
- `npm run db:start` · `npm run db:stop` : base Supabase locale (Docker) ; `npm run db:reset` réapplique toutes les migrations ; `npm run db:types` régénère les types

## Où modifier quoi
- Textes, tarifs, FAQ, services, coordonnées : `src/content/*.ts` (jamais dans les composants)
- Photos : `src/content/images.ts` + `src/assets/images/` (les photos actuelles sont provisoires, CC0)
- Chiffres de la page Transparence : `src/content/metrics.ts`
- Informations légales : `src/content/legal.ts` (null = « À compléter » affiché)
- Design system (couleurs, typographie, motifs) : `src/app/globals.css`, documenté dans `docs/design-system.md`
- Logo : `src/components/brand/` (composant) et `public/brand/` (fichiers SVG)
- Plateforme : pages dans `src/app/admin`, `src/app/owner`, `src/app/staff` ; actions serveur à côté des pages (`actions.ts`, chacune commence par `adminContext()` / `ownerContext()` / `staffContext()`) ; kit d'interface dans `src/components/app` ; libellés des statuts dans `src/lib/labels.ts`
- Logique serveur : `src/server` (synchronisation iCal, automatisations, notifications, relevés PDF, invitations, emails)
- Site public : pages `/`, `/nos-biens`, `/nos-offres`, `/a-propos`, `/contact` ; sections dans `src/components/sections` (`home/` pour l'accueil, `offers/` pour Nos offres) ; avis dans `src/content/reviews.ts` (jamais d'avis inventé : les exemples restent signalés « Exemple »)
- Logements publics (`/nos-biens`) : lecture filtrée dans `src/server/public-listings.ts` (biens actifs, publiés, hors démo ; jamais d'adresse ni de propriétaire), demande de séjour dans `src/app/actions/stay-request.ts`
- Page « Mon compte » des trois espaces : `src/components/app/AccountPage.tsx` et `src/app/account-actions.ts` ; mot de passe provisoire (`user_metadata.must_change_password`) imposé par `requireSession()`
- Mise en service, usage et règles de calcul : `docs/plateforme-exploitation.md`
- Guide voyageurs (`/guide`, QR code des logements) : pages dans `src/app/(guide)/guide`, composants dans `src/components/guide`, vocabulaire et types dans `src/lib/guide`, lecture des adresses dans `src/server/guide.ts` (table `guide_places`, sinon sélection initiale `src/content/guide/places.ts`), rubriques dans `src/content/guide/themes.ts`, itinéraires dans `src/content/guide/itineraries.ts`, back-office dans `src/app/admin/guide`. Documentation : `docs/guide-voyageurs.md`. Jamais de note, de prix ou d'horaire sans source vérifiée ; jamais d'image générée pour représenter un lieu réel.

## Règles absolues
- Ne jamais inventer de données : clients, avis, chiffres, revenus, taux d'occupation, logements, partenaires, témoignages. Utiliser des emplacements vides.
- Toute donnée publiée porte sa nature (réel, simulation, estimation, projection), sa source et sa période.
- Aucune formulation qui garantit un niveau de revenu.
- La commission est de 20 % TTC du prix des nuitées réellement perçu par le propriétaire, c'est-à-dire après les frais prélevés par la plateforme. Frais de ménage (payés par les voyageurs, perçus par le propriétaire puis refacturés à l'identique) et taxe de séjour hors base. Le linge est à la charge du propriétaire.
- Le propriétaire encaisse les versements des plateformes ; Comme à la Maison lui adresse chaque mois un relevé valant facture (commission, ménage refacturé, frais avancés). La conciergerie ne manie pas les fonds des propriétaires.
- Montants en centimes (entiers), taux en points de base (2000 = 20 %). Le taux est figé sur chaque réservation ; un relevé finalisé ne se modifie plus.
- Un propriétaire ne doit jamais voir les données d'un autre : toute nouvelle table a ses règles d'accès (RLS) et un test d'isolation. La clé de service Supabase reste côté serveur (`src/lib/supabase/admin.ts`, `server-only`).
- Aucune intégration simulée : une synchronisation, un email ou un paiement non configuré s'affiche « non connecté » avec ce qu'il manque.
- Données de démonstration : toujours `is_demo = true`, « Démo » dans les libellés, supprimables en un clic.
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
