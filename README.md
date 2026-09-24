# Comme à la Maison

Site officiel de **Comme à la Maison**, conciergerie Airbnb et location courte durée à Bordeaux et dans sa métropole.

> Votre logement, notre savoir-faire.
> 20 % TTC des revenus locatifs, pour une gestion complète de votre location courte durée.

## Pages

| Adresse | Contenu |
|---|---|
| `/` | Page d'accueil : hero, promesse, sans / avec conciergerie, accompagnement (avant, pendant, après), 12 services, tarification, simulateur, box de bienvenue, 6 piliers, qui sommes-nous, transparence, FAQ, formulaire d'estimation |
| `/transparence` | Nos chiffres, en toute transparence (vides tant qu'aucune donnée vérifiable n'est publiée) |
| `/mentions-legales` | Mentions légales, avec repères « À compléter » |
| `/confidentialite` | Politique de confidentialité |
| `/styleguide` | Design system (page interne, non indexée) |

## Démarrer

```bash
npm install
npm run dev          # http://localhost:3000
```

Vérifications avant de publier :

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e     # Playwright : parcours, simulateur, formulaire, accessibilité (axe), mobile et desktop
```

## Modifier le contenu

Tout le contenu se trouve dans `src/content/`. Aucun composant n'est à toucher pour changer un texte.

| Fichier | Contenu |
|---|---|
| `site.ts` | Nom, référencement, commission, **téléphone, email, réseaux sociaux**, communes |
| `offer.ts` | Ce qui est inclus, précisions ménage / linge, piliers, étapes de la collaboration |
| `services.ts` | Les 12 services et le parcours avant / pendant / après |
| `faq.ts` | Questions fréquentes |
| `about.ts` | Texte « Qui sommes-nous », Baptiste et Simon (photos à ajouter ici) |
| `images.ts` | Photographies et textes alternatifs |
| `metrics.ts` | Chiffres de la page Transparence |
| `legal.ts` | Informations légales (raison sociale, SIREN, hébergeur…) |

Une valeur `null` n'est pas encore connue : le site masque l'élément (téléphone, réseaux sociaux) ou affiche « À compléter » (pages légales).

### Remplacer les photos

Les photos actuelles sont **provisoires** (domaine public, licence CC0). Pour mettre les vôtres :

1. déposer le fichier dans `src/assets/images/` (JPEG ou PNG, 2000 px de large suffisent) ;
2. changer l'import correspondant dans `src/content/images.ts` ;
3. réécrire le texte `alt` (ce que montre la photo) et passer `placeholder` à `false`.

Next.js génère automatiquement les versions AVIF et WebP à la bonne taille.

Pour les photos de Baptiste et Simon : même principe dans `src/content/about.ts` (champ `photo`). En attendant, une initiale s'affiche dans l'arche.

### Publier des chiffres (page Transparence)

Dans `src/content/metrics.ts`, remplir `points`, `source` et `period` d'un indicateur. Une série sans source ou sans période ne s'affiche pas : c'est volontaire. Chaque indicateur porte une nature (`reel`, `simulation`, `estimation`, `projection`) qui change son badge et son style de graphique.

## Formulaire d'estimation

Les demandes sont envoyées par email via [Resend](https://resend.com). Copier `.env.example` en `.env.local` et renseigner :

- `RESEND_API_KEY` : clé API Resend ;
- `CONTACT_TO_EMAIL` : adresse(s) de réception ;
- `CONTACT_FROM_EMAIL` : expéditeur (domaine vérifié dans Resend).

Sans ces variables : en développement, la demande s'affiche dans le terminal ; en production, le visiteur voit un message indiquant que l'envoi n'est pas encore activé. Anti-spam : champ invisible et délai minimal de remplissage, sans CAPTCHA ni cookie.

## Mise en ligne

Déploiement recommandé : [Vercel](https://vercel.com) (import du dépôt GitHub, aucune configuration nécessaire). Ajouter les variables d'environnement ci-dessus et, une fois le domaine choisi, `NEXT_PUBLIC_SITE_URL`.

## Technique

- Next.js 16 (App Router), toutes les pages générées à l'avance
- TypeScript strict, Tailwind CSS v4 (tokens dans `src/app/globals.css`), icônes Lucide
- Polices Instrument Sans et Hanken Grotesk, auto-hébergées (aucun appel à Google pendant la visite)
- Aucune bibliothèque d'animation ou de graphiques : animations CSS, graphiques SVG générés côté serveur
- Référencement : métadonnées, Open Graph, sitemap, robots, données structurées (ProfessionalService, FAQPage, WebSite)
- Accessibilité : WCAG 2.2 AA vérifié par axe, navigation au clavier, `prefers-reduced-motion`

Mesures Lighthouse (build de production, en local) : 100 / 100 / 100 / 100 sur desktop ; accessibilité, bonnes pratiques et SEO à 100 sur mobile, performance entre 94 et 97.

## Design system

Voir [`docs/design-system.md`](docs/design-system.md) et la page `/styleguide`.
