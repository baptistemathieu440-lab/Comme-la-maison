# Guide voyageurs : « Votre carnet de bonnes adresses bordelaises »

Le livret d'accueil digital de Comme à la Maison, ouvert par les voyageurs depuis le QR code des logements.
Adresse : **`/guide`** (aussi `/guide-voyageur`, `/guide-voyageurs` et `/livret`, redirigées). Le QR code pointe toujours vers `/guide` : le contenu change depuis le back-office sans jamais réimprimer le code.

## 1. Analyse de l'existant (septembre 2026)

- **Site** : Next.js 16 (App Router) + TypeScript strict + Tailwind v4 + Lucide, hébergé sur Netlify. Le guide est une extension du site (même dépôt, même déploiement).
- **DA reprise telle quelle** (`src/app/globals.css`, `docs/design-system.md`) : olive pastel `#B4BE9C`, vert maison `#354943`, crème `#F5F0E7`, pierre `#EDE4D3`, terracotta `#BB6C51` en ponctuation ; Playfair Display (titres du site public, classe `.site-theme`) et Hanken Grotesk (texte) ; rayons `--radius-card` / `--radius-panel` ; boutons en pilule (`Button`, `buttonClasses`) ; motifs de l'arche et de la poignée (point terracotta des sur-titres `Eyebrow`) ; apparitions CSS sans JavaScript et `prefers-reduced-motion`.
- **Composants réutilisés** : `Logo`, `Eyebrow`, `buttonClasses`, `JsonLd`, polices `next/font` ; côté back-office : `PageHeader`, `Panel`, `DataTable`, `FilterBar`, `StatCard`, `Badge`, `Notice`, formulaires `ActionForm`/`Field`/`Checkbox`, `FileUploader`, `CopyField`, `adminContext()`.
- **Back-office** : Supabase (RLS partout, admin avec double authentification), actions serveur à côté des pages, migrations versionnées.

## 2. Architecture

| Adresse | Rôle |
|---|---|
| `/guide` | Accueil : bienvenue, grille des rubriques, incontournables, itinéraires, « il pleut », coups de cœur, contact |
| `/guide/explorer` | Toutes les adresses avec recherche et filtres (dans l'URL, partageable) |
| `/guide/carte` | Carte interactive filtrable ; `?lieu=<slug>` centre sur une adresse |
| `/guide/favoris` | Favoris enregistrés sur le téléphone (localStorage, sans compte) |
| `/guide/itineraires` | 24 h, 48 h, 72 h |
| `/guide/<rubrique>` | Pages thématiques (SEO), voir ci-dessous |
| `/guide/adresse/<slug>` | Fiche d'une adresse |
| `/admin/guide` | Back-office « Guide voyageurs » (liste, filtres, import, QR code) |

Navigation : en-tête léger + **barre d'onglets fixe en bas** sur téléphone (Accueil · Explorer · Carte · Favoris), les mêmes onglets dans l'en-tête sur ordinateur. Toutes les rubriques sont à 1 clic de l'accueil, toutes les fiches à 2 clics.

Rendu : pages statiques pré-générées (ISR), régénérées au plus tard toutes les 10 minutes et **immédiatement** après chaque modification dans le back-office (`updateTag("guide-places")` + `revalidatePath("/guide", "layout")`).

Source des données (`src/server/guide.ts`) : la table `guide_places` (adresses publiées, hors démo, non fermées définitivement). Tant que la base n'est pas branchée ou que la sélection n'y est pas importée, le guide affiche la **sélection initiale** (`src/content/guide/places.ts`) : le QR code fonctionne dès le premier jour.

### Rubriques

| Rubrique | URL | Adresses (sélection initiale) |
|---|---|---|
| Les incontournables de Bordeaux | `/guide/incontournables-bordeaux` | 20 |
| Où manger à Bordeaux | `/guide/restaurants-bordeaux` | 21 |
| Où boire un verre à Bordeaux | `/guide/bars-bordeaux` | 10 |
| Culture et musées à Bordeaux | `/guide/culture-musees-bordeaux` | 10 |
| Bordeaux en famille | `/guide/bordeaux-en-famille` | 20 |
| Bordeaux en amoureux | `/guide/bordeaux-en-couple` | 19 |
| Bordeaux entre amis | `/guide/bordeaux-entre-amis` | 18 |
| Sortir à Bordeaux | `/guide/sortir-bordeaux` | 9 |
| Nature et plein air | `/guide/nature-bordeaux` | 10 |
| Activités à Bordeaux | `/guide/activites-bordeaux` | 11 |
| Découvrir les vins de Bordeaux | `/guide/vignobles-bordeaux` | 18 |
| Une envie d’océan ? | `/guide/plages-bordeaux` | 11 |
| Une journée autour de Bordeaux | `/guide/autour-de-bordeaux` | 25 |
| Bordeaux à petit budget | `/guide/bordeaux-petit-budget` | 65 |
| Pas de chance, il pleut ? | `/guide/bordeaux-quand-il-pleut` | 49 |
| Les coups de cœur de Comme à la Maison | `/guide/coups-de-coeur` | 12 |
| Shopping, marchés et spécialités | `/guide/shopping-bordeaux` | 10 |

Total : 114 adresses uniques.

« En famille », « En couple » et « Entre amis » sont des **sélections éditoriales** (étiquettes « Sélection … » cochées dans le back-office). Les autres rubriques se remplissent automatiquement selon la catégorie, le budget (petit budget = gratuit ou €), l'intérieur/extérieur (il pleut) ou les étiquettes (incontournable, vin, océan). Définition : `src/content/guide/themes.ts`.

### Filtres (explorateur)

- **Budget** : Gratuit · € (moins de 15 €) · €€ (15–30 €) · €€€ (30–60 €) · €€€€ (expérience premium) — indicatifs, par personne.
- **Type** : Patrimoine, Culture, Restaurant, Bar, Activité, Nature, Shopping, Sortie, Excursion (« Patrimoine » ajouté pour les monuments).
- **Pour qui ?** : Solo, Couple, Famille, Enfants, Adolescents, Amis (les fiches affichent aussi Fêtards et Épicuriens).
- **Distance** : Bordeaux centre, Bordeaux Métropole, moins de 30 min, 30–60 min, 1 h–2 h.
- **Météo** : Beau temps (extérieur ou mixte), Quand il pleut (intérieur ou mixte).
- Recherche texte (sans accents), rubrique en cours ; tout est dans l'URL (`?budget=0,1&pour=famille&meteo=pluie`).

## 3. Modèle de données : `guide_places`

Migration : `supabase/migrations/20260926000100_guide_places.sql`.

| Groupe | Champs |
|---|---|
| Identité | `slug` (unique, URL), `name`, `kind`, `subcategory`, `wine_region`, `status` (ouvert, saisonnier, fermé temporairement, fermé), `is_published`, `is_favorite` (coup de cœur), `position` |
| Classement | `tags[]`, `audiences[]`, `budget` (0–4), `price_note` (prix vérifié en clair), `zone`, `setting` (intérieur / extérieur / mixte) |
| Textes | `summary` (pourquoi on vous le recommande), `tip` (notre petit conseil), `good_to_know`, `highlights` (à voir), `where_to_eat` |
| Pratique | `area`, `address`, `lat`/`lng`, `hours`, `booking` (non / conseillée / obligatoire), `travel_time`, `duration`, `best_period`, `transport`, `car_needed` |
| Liens | `website_url`, `booking_url` (bouton « Réserver »), `maps_url` (sinon recherche Google Maps sur nom + adresse) |
| Note | `rating`, `rating_count`, `rating_source` — une note ne peut pas exister sans sa source (contrainte en base) |
| Photo | `photo_path` (espace de stockage public `guide-photos`), `photo_alt`, `photo_credit` |
| Vérification | `verified_on` (« Informations vérifiées le … »), `sources[]`, `internal_notes` (jamais affichées) |

Règles d'accès : administrateurs uniquement (double authentification). Aucun accès anonyme : le site lit la table côté serveur, colonnes choisies. Journal d'activité (`app.audit`) et `updated_at` automatiques. Test d'isolation : `tests/platform/guide.spec.ts`.

## 4. Composants

- Public (`src/components/guide/`) : `GuideNav` (onglets bas + en-tête), `PlaceCard` (ligne compacte ou tuile), `PlaceVisual` (photo ou illustration de marque), `badges` (budget, note avec source), `FavoriteButton`, `ExplorerView` + `filters.ts`, `GuideMap` (Leaflet), `FavoritesView`, `ContactBlock`, `layout.tsx` (conteneur, en-têtes de section, « vérifié le »).
- Données : `src/lib/guide/taxonomy.ts` (vocabulaire), `place.ts` (types, conversion, lien Maps), `summary.ts` (version allégée envoyée au téléphone), `favorites.ts` (localStorage).
- Back-office (`src/app/admin/guide/`) : liste avec compteurs et filtres (catégorie, visibilité, « à revérifier » au-delà de 180 jours, « budget à confirmer »), fiche complète, actions rapides (marquer vérifiée aujourd'hui, masquer/afficher), photo, suppression, import de la sélection initiale, page QR code (SVG et PNG).

## 5. Dépendances ajoutées

- `leaflet` (~40 Ko compressé) : carte, chargée uniquement sur `/guide/carte`, après l'affichage. Fond OpenStreetMap avec attribution ; pour un trafic important, passer à un fournisseur de tuiles via `NEXT_PUBLIC_MAP_TILES_URL` et `NEXT_PUBLIC_MAP_TILES_ATTRIBUTION`.
- `qrcode` : génération du QR code côté serveur, dans le back-office uniquement.

## 6. Méthode de sélection et de vérification

Vérification du 26 septembre 2026, pour chaque adresse :
1. existence, adresse et coordonnées via OpenStreetMap (Nominatim) ;
2. établissement ouvert en 2026 : site officiel (chaque lien a été testé), Bordeaux Tourisme, guide Michelin (article du 29/07/2026 pour les étoilés), presse locale récente ;
3. horaires et prix **uniquement** quand une source datée les donnait ; sinon le guide invite à consulter le site officiel ;
4. sources enregistrées dans `sources` pour chaque fiche.

Écartés faute de certitude : l'Iboat (fermé en février 2026, repris sous le nom Ublo, ouverture non confirmée), Les Berthom (deux adresses contradictoires selon les sources), le Parc floral (introuvable dans OpenStreetMap), la Maison des vins de l'Entre-deux-Mers (adresse non confirmée).

**Notes Google/Tripadvisor : aucune n'est saisie.** Elles ne peuvent pas être relevées de façon fiable automatiquement ; elles se renseignent dans le back-office (note, nombre d'avis, source) lors de la vérification sur place ou en ligne. Tant qu'une note est vide, rien ne s'affiche.

**Budgets** : fixés à partir d'une source quand elle existait (prix d'entrée, menu, fourchette). Les adresses marquées * dans la liste ci-dessous ont un budget estimé : l'import les annote « Budget estimé, à confirmer » (filtre dédié dans le back-office).

**Photos** : aucune photo d'établissement n'est publiée pour l'instant. Sans photo, chaque carte affiche une illustration aux couleurs de la marque (l'arche du logo et l'icône de la catégorie). Ajouter uniquement des photos dont Comme à la Maison a les droits (photos maison, photos officielles avec autorisation écrite, banques d'images libres), jamais d'image générée pour représenter un lieu réel ; renseigner le crédit.

## 7. Sélection initiale

Répartition visée : les grands classiques (20 incontournables étiquetés, plus les musées et excursions phares), des adresses locales (marchés, bistrots, bars de quartier) et des expériences moins connues (Cité Frugès, parc de Majolan, rooftop de l'UCPA, phare de Cordouan, Utopia…).

### Patrimoine (14)

| Adresse | Sous-catégorie | Zone | Budget | Rubriques clés |
|---|---|---|---|---|
| Place de la Bourse | — | Centre | Gratuit | Incontournable |
| Miroir d’eau | — | Centre | Gratuit | Incontournable |
| Grand Théâtre (Opéra National de Bordeaux) | Monument et spectacles | Centre | Gratuit | Incontournable |
| Grosse Cloche | — | Centre | Gratuit | Incontournable |
| Porte Cailhau | — | Centre | Gratuit | Incontournable |
| Cathédrale Saint-André | — | Centre | Gratuit | Incontournable, Il pleut |
| Tour Pey-Berland | — | Centre | € | Incontournable |
| Pont de Pierre | — | Centre | Gratuit | Incontournable |
| Quartier Saint-Pierre et place du Parlement | — | Centre | Gratuit | Incontournable |
| Basilique et flèche Saint-Michel | — | Centre | Gratuit | Incontournable |
| Esplanade des Quinconces et monument aux Girondins | — | Centre | Gratuit | Incontournable |
| Quartier des Chartrons | Quartier | Centre | Gratuit | Incontournable |
| Basilique Saint-Seurin | — | Centre | Gratuit | Il pleut |
| Pont Jacques Chaban-Delmas | — | Centre | Gratuit | — |

### Culture & musées (10)

| Adresse | Sous-catégorie | Zone | Budget | Rubriques clés |
|---|---|---|---|---|
| La Cité du Vin | Musée | Centre | €€ | Incontournable, Vin, Il pleut |
| Bassins des Lumières | Art numérique | Centre | €€ | Incontournable, Il pleut |
| Musée d’Aquitaine | Musée | Centre | € | Il pleut |
| Musée des Beaux-Arts | Musée | Centre | € | Il pleut |
| CAPC, musée d’art contemporain | Musée | Centre | € | Il pleut |
| Cap Sciences | Sciences | Centre | € | Il pleut |
| Musée Mer Marine | Musée | Centre | €€ | Il pleut |
| madd, musée des Arts décoratifs et du Design | Musée | Centre | € | Il pleut |
| Muséum de Bordeaux – sciences et nature | Sciences | Centre | € | Il pleut |
| Cinéma Utopia | Cinéma | Centre | € | Coup de cœur, Il pleut |

### Restaurants (21)

| Adresse | Sous-catégorie | Zone | Budget | Rubriques clés |
|---|---|---|---|---|
| La Tupina | Cuisine bordelaise | Centre | €€€€ | Coup de cœur, Il pleut |
| La Brasserie Bordelaise | Cuisine bordelaise | Centre | €€€ * | Vin, Il pleut |
| Le Petit Commerce | Poissons et fruits de mer | Centre | €€€ * | — |
| L’Entrecôte | Bon rapport qualité/prix | Centre | €€ | Il pleut |
| Chez Dupont | Bistrot | Centre | €€ * | Il pleut |
| Le Café du Port | Terrasse avec vue | Centre | €€€ | Coup de cœur |
| Chez Jean-Mi, aux Capucins | Petit budget | Centre | € | Coup de cœur, Il pleut |
| Magasin Général (Darwin) | Street-food et cantine | Centre | € * | — |
| Les Halles de Bacalan | Street-food et cantine | Centre | €€ * | Il pleut |
| Mamacam | Végétarien | Centre | € | Il pleut |
| Dis Leur | Végétarien | Centre | €€ * | Il pleut |
| Palatino | Italien | Centre | €€ * | Il pleut |
| Madame Pang | Asiatique | Centre | €€ * | Il pleut |
| Kokomo | Burgers et street-food | Centre | €€ * | Il pleut |
| Black List Café | Brunch et café | Centre | € * | Il pleut |
| Le Tchanqué (rooftop) | Brunch et café | Centre | €€€ * | — |
| Le 7, restaurant panoramique de la Cité du Vin | Restaurant avec vue | Centre | €€€ * | Vin, Il pleut |
| Le Pressoir d’Argent – Gordon Ramsay | Gastronomique | Centre | €€€€ * | Il pleut |
| Maison Nouvelle – Philippe Etchebest | Gastronomique | Centre | €€€€ * | Il pleut |
| Soléna | Gastronomique | Centre | €€€€ * | Il pleut |
| Cent33 | Gastronomique | Centre | €€€€ * | Vin, Il pleut |

### Bars & apéros (10)

| Adresse | Sous-catégorie | Zone | Budget | Rubriques clés |
|---|---|---|---|---|
| Le Bar à Vin du CIVB | Bar à vin | Centre | € | Coup de cœur, Vin, Il pleut |
| L’Autre Petit Bois | Bar à vin | Centre | € | — |
| Symbiose | Bar à cocktails | Centre | €€ * | Il pleut |
| Le Point Rouge | Bar à cocktails | Centre | €€ * | Vin, Il pleut |
| La Comtesse | Bar insolite | Centre | € * | Il pleut |
| Vintage Bar | Bar animé | Centre | € * | Il pleut |
| The Frog & Rosbif | Bar à bières | Centre | € * | Il pleut |
| Rooftop du Mama Shelter | Rooftop | Centre | €€ * | — |
| Gina, rooftop de l’hôtel Renaissance | Rooftop | Centre | €€€ * | — |
| Night Beach, toit du Grand Hôtel | Rooftop | Centre | €€€€ * | — |

### Sorties (7)

| Adresse | Sous-catégorie | Zone | Budget | Rubriques clés |
|---|---|---|---|---|
| La Guinguette Chez Alriq | Guinguette et concerts | Centre | € | Coup de cœur |
| La Marelle Comedy Club | Comedy club | Centre | € * | Il pleut |
| Le Rocher de Palmer | Concerts | Métropole | €€ | Il pleut |
| Rock School Barbey | Concerts | Centre | €€ | Il pleut |
| Arkéa Arena | Grands concerts et spectacles | Métropole | €€€ | Il pleut |
| Théâtre Femina | Spectacles | Centre | €€€ | Il pleut |
| Place de la Victoire | Quartier festif | Centre | € | — |

### Activités (11)

| Adresse | Sous-catégorie | Zone | Budget | Rubriques clés |
|---|---|---|---|---|
| Darwin Écosystème | Lieu alternatif | Centre | Gratuit | Incontournable, Coup de cœur |
| Piste cyclable Roger-Lapébie | Vélo | < 30 min | Gratuit | — |
| Traverser la Garonne en BAT³ | Balade en bateau | Centre | € | Coup de cœur |
| Croisière apéritive sur la Garonne | Balade en bateau | Centre | €€€ * | Vin |
| Zoo de Bordeaux Pessac | Animaux | Métropole | €€ | — |
| Clock Escape | Escape game | Centre | €€ * | Il pleut |
| Kart System (karting et bowling) | Bowling et karting | Métropole | € | Il pleut |
| UCPA Sport Station (rooftop mini-golf) | Sport et loisirs | Centre | €€ * | — |
| École du Vin de Bordeaux | Atelier dégustation | Centre | €€€ | Vin, Il pleut |
| Château Pape Clément | Visite de château | Métropole | €€€ | Vin |
| Château Smith Haut Lafitte et Les Sources de Caudalie | Expérience premium | < 30 min | €€€€ * | Vin |

### Nature & plein air (9)

| Adresse | Sous-catégorie | Zone | Budget | Rubriques clés |
|---|---|---|---|---|
| Les quais de Garonne | Balade | Centre | Gratuit | Incontournable, Coup de cœur |
| Jardin Public | Parc | Centre | Gratuit | Coup de cœur |
| Parc Bordelais | Parc | Centre | Gratuit | — |
| Plage du Lac de Bordeaux | Baignade | Métropole | Gratuit | — |
| Parc aux Angéliques | Balade | Centre | Gratuit | — |
| Jardin botanique de la Bastide | Jardin | Centre | Gratuit | — |
| Bois de Bordeaux | Parc | Métropole | Gratuit | — |
| Parc de l’Ermitage (Lormont) | Parc | < 30 min | Gratuit | — |
| Parc de Majolan (Blanquefort) | Parc | < 30 min | Gratuit | — |

### Shopping (10)

| Adresse | Sous-catégorie | Zone | Budget | Rubriques clés |
|---|---|---|---|---|
| Triangle d’Or | Shopping premium | Centre | €€€ | Incontournable |
| Marché des Capucins | Marché | Centre | € | Incontournable, Il pleut |
| Rue Sainte-Catherine | Grandes enseignes | Centre | €€ | — |
| Galerie Bordelaise | Boutiques | Centre | Gratuit | Il pleut |
| Antiquaires de la rue Notre-Dame | Brocante et antiquités | Centre | Gratuit | — |
| Marché des Chartrons (dimanche matin) | Marché | Centre | € | — |
| Brocante et puces de Saint-Michel | Brocante et antiquités | Centre | Gratuit | — |
| Cadiot-Badie | Spécialités et souvenirs | Centre | €€ | Coup de cœur, Il pleut |
| Canelés Baillardran | Spécialités et souvenirs | Centre | € | Il pleut |
| L’Intendant | Cave à vin | Centre | €€ | Vin, Il pleut |

### Excursions (22)

| Adresse | Sous-catégorie | Zone | Budget | Rubriques clés |
|---|---|---|---|---|
| Excursions dans le vignoble avec l’office de tourisme | Excursion organisée | Centre | €€€€ | Vin |
| Château Lynch-Bages et le village de Bages | Visite de château | 1 h–2 h | €€€ * | Vin |
| Château Guiraud et Le Cercle Guiraud | Château et table étoilée | 30–60 min | €€€€ * | Vin |
| Saint-Émilion | Village et vignoble | 30–60 min | €€ | Incontournable, Vin |
| Cité Frugès – Le Corbusier | Architecture | Métropole | Gratuit | Coup de cœur |
| Bouliac et son belvédère | Village et panorama | < 30 min | Gratuit | — |
| Citadelle de Blaye | Patrimoine | 30–60 min | Gratuit | Vin |
| Bourg et les Côtes de Bourg | Village et vignoble | 30–60 min | € | Vin |
| Abbaye de La Sauve-Majeure | Patrimoine | 30–60 min | € | Vin |
| Château des ducs d’Épernon (Cadillac) | Patrimoine | 30–60 min | € | Il pleut |
| Château de Roquetaillade | Patrimoine | 30–60 min | €€ | — |
| Dune du Pilat | Site naturel | 1 h–2 h | € | Incontournable, Océan |
| Arcachon et la Ville d’Hiver | Station balnéaire | 30–60 min | €€ | Océan |
| Tour de l’île aux Oiseaux en bateau | Balade en bateau | 30–60 min | €€ | Océan |
| Cap Ferret | Presqu’île | 1 h–2 h | €€€ | Océan |
| Plage du Petit Nice | Plage océane | 1 h–2 h | Gratuit | Océan |
| Le Porge Océan | Plage océane | 30–60 min | Gratuit | Océan |
| Lacanau-Océan | Station balnéaire | 1 h–2 h | € | Océan |
| Carcans-Plage | Plage océane | 1 h–2 h | Gratuit | Océan |
| Soulac-sur-Mer | Station balnéaire | 1 h–2 h | € | Océan |
| Phare de Cordouan | Patrimoine en mer | 1 h–2 h | €€€ | Océan |
| Biscarrosse-Plage | Station balnéaire | 1 h–2 h | € | Océan |


\* Budget estimé, à confirmer.

## 8. Mise en service

1. **Appliquer la migration** `20260926000100_guide_places.sql` sur le projet Supabase (comme les précédentes : `supabase db push`, ou SQL Editor du tableau de bord). Sans elle, le guide public fonctionne avec la sélection initiale, mais le back-office affiche « Le guide n'est pas encore installé ».
2. Redéployer le site (Netlify).
3. Back-office > **Guide voyageurs** > « Importer la sélection initiale ».
4. Pour chaque adresse, lors d'un premier passage : ajouter la note Google (et sa source), confirmer les budgets marqués « à confirmer », ajouter une photo si vous en avez les droits, puis « Marquer comme vérifiée aujourd'hui ».
5. Back-office > Guide voyageurs > **QR code** : télécharger le SVG (impression) ou le PNG (messages), tester avec deux téléphones, imprimer à 3 × 3 cm minimum.

## 9. Entretien

- Revérifier chaque adresse au moins tous les 6 mois (filtre « À revérifier »), et avant chaque saison pour les adresses saisonnières (guinguette, rooftops, Cordouan, plages).
- Une adresse qui ferme pour un temps : statut « Fermé temporairement » ou « Masquer du guide » ; définitivement : statut « Fermé » (elle disparaît du guide) ou suppression.
- Les itinéraires (`src/content/guide/itineraries.ts`) et les textes d'accueil (`src/content/guide/guide.ts`) se modifient dans le code.
