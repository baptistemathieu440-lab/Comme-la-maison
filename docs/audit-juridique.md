# Audit juridique et données personnelles — diagnostic

Audit réalisé le 30 septembre 2026 sur le code du dépôt (commit `170607b`), la configuration Netlify
(projet `comme-a-la-maison`) et le projet Supabase (`comme-a-la-maison`, région `eu-west-3`, Paris).

Ce document décrit **l'état constaté avant modification**. Les actions à mener par les dirigeants sont
dans [`JURIDIQUE_A_FAIRE.md`](../JURIDIQUE_A_FAIRE.md) à la racine du projet. Rien ici ne constitue un avis
juridique : les points d'interprétation sont signalés « à faire valider par un professionnel du droit ».

---

## 1. Ce que fait réellement le projet

| Brique | Rôle | Où |
| --- | --- | --- |
| Site public | Présentation, tarifs, simulateur, FAQ, logements publiés, contact | `src/app/(site)` |
| Guide voyageurs | Carnet d'adresses ouvert par QR code, carte, favoris | `src/app/(guide)/guide` |
| Back-office | CRM prospects, propriétaires, biens, réservations, calendriers, tâches, incidents, dépenses, relevés/factures, documents, avis, guide | `src/app/admin` |
| Espace propriétaire | Ses biens, réservations (prénom du voyageur seulement), calendrier, revenus, relevés, documents partagés | `src/app/owner` |
| Espace agents | Ses tâches du jour, codes d'accès le jour de la tâche, photos, signalements | `src/app/staff` |
| Tâches planifiées | Synchronisation iCal (horaire), automatisations (quotidien), relevés (mensuel) | `netlify/functions`, `src/app/api/cron` |

Il n'existe **ni paiement en ligne, ni compte voyageur, ni newsletter, ni outil marketing**.

## 2. Inventaire des données personnelles

| Personnes | Données | Collecte | Stockage | Accès |
| --- | --- | --- | --- | --- |
| Prospects propriétaires | Prénom, nom, téléphone, email, commune, type de bien, chambres, capacité, message libre | Formulaire « Estimer mon logement » (`/contact`, accueil) | Netlify Forms (sur Netlify) **et** table `contacts` + `prospects` (Supabase Paris). Email Resend si configuré. | Administrateurs |
| Voyageurs (demande de séjour) | Prénom, nom, email, téléphone, dates, nb adultes/enfants, message | Formulaire de `/nos-biens/[slug]` | `contacts`, `guests`, `bookings` (statut « Demande »), notification admin | Administrateurs ; le propriétaire voit le prénom via la vue `owner_bookings` |
| Voyageurs (réservations plateformes) | Saisis à la main par l'équipe ; les calendriers iCal importés ne contiennent que des dates et un libellé | Back-office, iCal | `bookings`, `calendar_blocks` | Admin ; propriétaire : prénom uniquement |
| Propriétaires clients | Identité, coordonnées, adresse, société, n° TVA, **IBAN (chiffré AES-256-GCM, clé côté serveur)**, mandat SEPA (référence, date), contrats, relevés, factures, documents | Back-office | `contacts`, `owners`, `contracts`, `documents`, stockage privé | Admin ; le propriétaire lui-même |
| Biens | Adresse, codes d'accès, wifi, alarme, photos, n° d'enregistrement, statut résidence principale | Back-office | `properties`, `property_access` (table séparée), stockage privé `property-photos` | Admin ; agent affecté le jour de sa tâche ; propriétaire (sauf codes) |
| Agents / prestataires | Identité, coordonnées, métier, SIRET, photos de terrain, signalements | Back-office, application agent | `contacts`, `providers`, `task_photos`, `incident_photos` | Admin ; l'agent pour ses propres tâches |
| Comptes utilisateurs | Email, nom, téléphone, mot de passe (haché par Supabase Auth), facteur TOTP (admins) | Invitation | Supabase Auth, `profiles`, `user_roles` | La personne ; admin |
| Journal | Toutes les modifications (avec l'auteur), hors codes d'accès et IBAN chiffré | Déclencheurs | `audit_logs` (sans purge) | Admin |
| Auteurs d'avis | Nom affiché, texte, note, accord de publication | Back-office | `site_reviews` | Admin ; public si publié **et** accord confirmé |
| Visiteurs du guide | Favoris | Navigateur | `localStorage` du téléphone, jamais envoyé | La personne |

## 3. Services tiers qui reçoivent des données

| Service | Rôle | Localisation constatée | Garanties annoncées |
| --- | --- | --- | --- |
| Netlify, Inc. | Hébergement du site, fonctions serveur, Netlify Forms | Société américaine ; le site est servi par un CDN mondial. Région des fonctions non configurée dans le dépôt | Politique de confidentialité du 10/04/2026 : adhésion au EU-U.S. Data Privacy Framework |
| Supabase | Base de données, comptes, fichiers | Projet en `eu-west-3` (Paris) ; société hors UE | Politique : transferts encadrés par clauses contractuelles types |
| Resend | Emails (notifications, invitations, formulaire hors Netlify) | Société américaine ; **utilisé seulement si `RESEND_API_KEY` est renseignée** | À vérifier (DPA) |
| OpenStreetMap (tuiles) | Fond de carte du guide | Serveurs de la Fondation OpenStreetMap ; l'adresse IP du visiteur leur est transmise | Royaume-Uni : décision d'adéquation de la Commission |
| Airbnb, Booking, Abritel | Import/export de calendriers iCal | — | Aucune donnée personnelle échangée (dates et « Réservé ») |

Polices : auto-hébergées au build (`next/font`), aucun appel à Google pendant la visite.

## 4. Cookies et traceurs réellement présents

| Traceur | Où | Nature | Consentement |
| --- | --- | --- | --- |
| `sb-…-auth-token` (Supabase) | Uniquement `/connexion`, `/admin`, `/owner`, `/staff`, `/auth` | Session de connexion | Exempté (strictement nécessaire) |
| `localStorage` `cam-guide-favoris` | Guide voyageurs | Favoris demandés par l'utilisateur, jamais transmis | Exempté (fonctionnalité demandée) |
| Google Analytics, GTM, Meta Pixel, Hotjar, chat, vidéo, réseaux sociaux | — | **Aucun trouvé** | — |

Conclusion : **aucun bandeau de consentement n'est nécessaire en l'état**. Un bandeau serait à mettre en place
avant d'ajouter tout outil de mesure d'audience non exempté ou tout outil publicitaire.

## 5. Constats

### 🔴 Critiques
1. **Identité de l'entreprise absente** : dénomination, forme, siège, SIREN, RCS/RNE, TVA, directeur de la
   publication, responsable du traitement, médiateur : tout est à `null`. Les relevés/factures PDF affichent
   « à compléter » pour les mentions obligatoires.
2. **Qualification de l'activité au regard de la loi Hoguet non tranchée.** Le site annonce « Gestion complète
   de la location », « Gestion des réservations », « Optimisation tarifaire », et **la page Nos biens recueille
   des demandes de séjour de voyageurs pour le compte des propriétaires** (« réservez en direct »). Ce sont
   précisément les activités dont il faut vérifier si elles relèvent de l'article 1er de la loi n° 70-9 du
   2 janvier 1970 (location saisonnière pour autrui, gestion immobilière). Tant que ce n'est pas validé,
   le site ne doit pas présenter ces activités comme autorisées.
3. **Pas de conditions contractuelles publiées** pour les propriétaires (prix, durée, résiliation, droit de
   rétractation pour un particulier démarché ou signant hors établissement, médiation).

### 🟠 Importants
4. Politique de confidentialité limitée au formulaire d'estimation : ne couvre ni les voyageurs, ni les
   propriétaires clients, ni les agents, ni les comptes, ni Supabase/Resend/OpenStreetMap, ni les durées.
5. Mentions légales : propriété intellectuelle revendiquée sans vérification (logo redessiné à partir d'un PNG
   fourni, origine et cession de droits non documentées) ; crédits incomplets (EB Garamond, Source Sans 3,
   Leaflet, OpenStreetMap, TeX Gyre Heros absents) ; pas de clause de responsabilité ni d'information sur les
   logements.
6. Formulaires : information au moment de la collecte trop succincte (ni responsable, ni base légale, ni
   durée, ni droits).
7. Aucune fiche de conformité par logement : seuls le numéro d'enregistrement et un booléen « résidence
   principale » existent ; la limite de nuits par défaut (120) ne correspond plus à Bordeaux (limite de 90 nuits
   votée le 8 juillet 2025, applicable au 1er janvier 2026, à vérifier) et varie selon les communes.
8. Journal d'activité (`audit_logs`) conservé sans limite ; retrait d'accès d'un compte sans suppression du
   compte d'authentification : durées de conservation à définir.
9. Supabase (conseiller de sécurité) : protection contre les mots de passe compromis désactivée ; durée de
   validité des codes/liens email supérieure à une heure.

### 🟢 Faibles
10. Les routes de téléchargement (`/api/fichiers/document`, `/api/releves/…/pdf`) n'appliquaient pas
    l'obligation de changer un mot de passe provisoire (les pages, elles, l'appliquent).
11. Le guide voyageurs et la page de connexion n'offraient aucun lien vers les informations légales.
12. Les pages légales étaient indexées alors qu'elles contiennent des emplacements à compléter.

### Points vérifiés sans anomalie
- Règles d'accès (RLS) activées et forcées sur toutes les tables ; aucun accès anonyme ; admins soumis à la
  double authentification (`aal2`) jusque dans la base.
- Propriétaire : accès limité à ses biens via `app.current_owner_id()` ; relevés visibles seulement une fois
  finalisés ; voyageurs vus par une vue filtrée (prénom, sans coordonnées).
- Fonctions signalées par Supabase (`generate_statement`, `seed_demo_data`, etc.) : protégées en interne par
  `app.require_trusted_caller()` ou filtrées par rôle. Vues `SECURITY DEFINER` : volontaires et filtrées.
- Stockage : quatre espaces privés, liens signés courts ; photos publiques servies seulement si marquées
  publiques sur un bien publié.
- Clé de service Supabase uniquement côté serveur (`server-only`) ; IBAN chiffré ; codes d'accès et IBAN
  exclus du journal.
- Avis clients : publication impossible sans accord de l'auteur (contrainte en base).
- En-têtes de sécurité (`nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`).
- Emails : uniquement des emails de service (invitations, notifications, liens de connexion Supabase). Aucune
  prospection automatisée.
