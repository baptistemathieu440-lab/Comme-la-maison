# Design system Comme à la Maison

Direction artistique : **« La porte ouverte »**. Le logo montre une porte en arche découpée dans un disque, avec une poignée terracotta. Le site reprend ces formes et y ajoute les couleurs d'un intérieur bordelais lumineux.

Tokens : `src/app/globals.css`. Page de démonstration : `/styleguide`.

## Logo

| Élément | Mesure (diamètre du disque = 100) |
|---|---|
| Disque | cercle plein, vert `#354943` |
| Porte | largeur 36, du haut (32) au bas (80,8) ; l'arche est un demi-cercle de rayon 18 **centré sur le centre du disque** |
| Poignée | cercle terracotta `#BB6C51`, rayon 3,4, en (61,2 ; 66,8) |
| Wordmark | « Comme à la maison », grotesque type Helvetica, 2,45 × le diamètre |
| Baseline | « Votre conciergerie », terracotta, environ 0,6 × la taille du wordmark |

Fichiers (`public/brand/`) : `logo-vertical.svg`, `logo-vertical-fond-fonce.svg`, `logo-horizontal.svg`, `logo-horizontal-fond-fonce.svg`, `symbole.svg`, `symbole-monochrome.svg`. Favicon : `src/app/icon.svg` et `favicon.ico` (porte et poignée agrandies pour rester lisibles à 16 px).

Le symbole a été redessiné à partir du PNG d'origine (`brand/source/logo-original.png`) ; le texte a été vectorisé avec TeX Gyre Heros (équivalent libre d'Helvetica, licence GUST), calé sur les contours de l'original.

Règles :
- zone de protection : 18 % du diamètre du symbole sur les quatre côtés ;
- tailles minimales : symbole 24 px, logo horizontal 140 px de large, logo vertical 120 px ;
- sur fond vert : disque crème, porte de la couleur du fond, poignée `#D4896B`, baseline `#E0A48A` ;
- ne pas déformer, ne pas recolorer hors variantes, ne pas poser sur une photo chargée.

## Couleurs

| Rôle | Nom | Hex | Token Tailwind | Usage |
|---|---|---|---|---|
| Primary | Olive pastel | `#B4BE9C` | `olive` | grandes surfaces, bouton secondaire |
| Primary Dark | Vert maison (logo) | `#354943` | `maison` | titres, boutons, footer |
| Primary Light | Olive brume | `#E4E8D8` | `olive-light` | pastilles d'icônes, survols |
| Background | Crème (logo) | `#F5F0E7` | `cream` | fond principal |
| Background Secondary | Pierre blonde | `#EDE4D3` | `stone` | sections alternées |
| Surface | Blanc cassé | `#FBF8F2` | `surface` | cartes, champs |
| Text | Encre | `#23302B` | `ink` | texte courant |
| Text Secondary | Gris sauge | `#56625C` | `ink-soft` | légendes, aides |
| Border | Lin | `#DDD3C1` | `line` | séparateurs |
| Border (champs) | — | `#7F8A83` | `line-strong` | contour des champs |
| Accent | Terracotta (logo) | `#BB6C51` | `terra` | poignée, points, grands chiffres |
| Accent Text | Terracotta foncé | `#9E5139` | `terra-text` | terracotta en petit texte |
| Accent Deep | Terracotta profond | `#8F482F` | `terra-deep` | texte des badges « en attente » sur `terra-wash` (5,3:1) |
| Error | Brique | `#A33A2B` | `error` | erreurs, toujours avec icône et texte |

Proportions indicatives sur une page : crème 45 %, olive 25 %, vert 18 %, pierre 10 %, terracotta 2 %.

### Contrastes (WCAG 2.2)

| Combinaison | Ratio | Règle |
|---|---|---|
| Encre sur crème | 12,1:1 | texte courant |
| Vert maison sur crème | 8,5:1 | titres, liens |
| Crème sur vert maison | 8,5:1 | bouton principal, footer |
| Encre sur olive | 7,1:1 | seul texte courant autorisé sur olive |
| Vert maison sur olive | 4,9:1 | titres sur olive |
| Gris sauge sur crème | 5,6:1 | textes secondaires |
| Terracotta foncé sur crème | 5,0:1 | petit texte terracotta |
| Terracotta sur crème | 3,4:1 | **grand texte (≥ 24 px) ou élément graphique uniquement** |
| Bordure de champ sur blanc cassé | 3,4:1 | critère 1.4.11 |
| Gris sauge sur olive | 3,3:1 | **interdit** |

## Typographie

- **Titres** : Instrument Sans, graisse 500, largeur 92 %, interlettrage négatif.
- **Texte et interface** : Hanken Grotesk.

Les deux sont des grotesques, dans la lignée de l'Helvetica du logo. Elles sont auto-hébergées par `next/font`.

| Style | Utilitaire | Taille (mobile → desktop) |
|---|---|---|
| H1 | `text-h1` | 42 → 72 px, interligne 1,04 |
| H2 | `text-h2` | 32 → 52 px, interligne 1,08 |
| H3 | `text-h3` | 21 → 26 px, interligne 1,2 |
| Lead | `text-lead` | 18 → 21 px |
| Body | `text-body` | 17 → 18 px, interligne 1,65 |
| Small | `text-small` | 15 px |
| Button | `text-button` | 16 px, graisse 600 |
| Caption | `text-caption` | 13 px, capitales, +14 % |
| Chiffre clé | `text-display` | 88 → 152 px (tarif uniquement) |

« savoir‑faire » s'écrit avec un trait d'union insécable (U+2011) dans les titres.

## Motifs

1. **L'arche** (`arch`, `arch-flat`) : la porte du logo, format 3:4, cadre les photos clés.
2. **La poignée** : le point terracotta. Il termine les grands titres (`<Period />`), précède les sur-titres, marque la page active. Un ou deux par écran.
3. **Les aplats olive** : sections et cartes clés, jamais pour du petit texte.
4. **Le disque** : boutons en pilule, pastilles d'icônes rondes.

Le premier écran reproduit le logo en grand : un disque olive, une porte en arche (46 % × 60 %, arc centré sur le disque) qui laisse voir la photo, et sa poignée.

## Composants

- **Boutons** (`Button`, `ButtonLink`) : `primary`, `secondary`, `ghost`, `light`, `ghost-light` ; tailles `md` (50 px de haut) et `sm` (44 px). États : survol, clic (légère réduction), focus clavier (contour 2 px décalé de 3 px), désactivé.
- **Sections** (`Section`, `SectionHeader`, `Eyebrow`, `Period`) : prop `surface` (`light`, `olive`, `dark`) pour garder des contrastes conformes.
- **Nature des données** (`DataBadge`) : réel (plein), simulation (hachuré), estimation (contour), projection (pointillés). Forme + icône + libellé, jamais la couleur seule.
- **Graphiques** (`MetricCard`, `MetricChart`) : SVG côté serveur, une série par graphique, info-bulle au survol, tableau des données consultable, source et période obligatoires.

## Mouvement

- Apparition au défilement en CSS (`.reveal`, `animation-timeline: view()`), sans JavaScript.
- Ouverture douce des accordions, flèche des boutons qui avance au survol, chiffres du simulateur qui défilent.
- `prefers-reduced-motion: reduce` coupe toutes les animations et transitions.
