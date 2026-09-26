# Comme à la maison : plan de lancement

> Fichier généré depuis `roadmap-data.js` (version 2026-09-26). 264 tâches, 29 catégories.
> La version interactive (cases à cocher, dépendances, tableau de bord) est `index.html`.

Légende : **P0** bloque le lancement · **P1** haute · **P2** moyenne · **P3** plus tard. Échéance en jours après le démarrage (J+n). Une tâche ne peut commencer que lorsque ses prérequis sont terminés.

## Les 10 priorités absolues

1. **STR-03 · Trancher le modèle d'exploitation : sans ou avec carte G (loi Hoguet)** : Sans ou avec carte G : tout le reste en dépend.
2. **REG-01 · Fiche réglementaire par commune** : Savoir quels logements vous avez le droit de gérer à Bordeaux.
3. **STR-06 · Fixer la grille tarifaire** : Le prix fixe la rentabilité et le discours.
4. **JUR-06 · Immatriculer la société (guichet unique INPI)** : Le Kbis débloque banque, assurance, plateformes et contrats.
5. **ASS-01 · Souscrire la RC Professionnelle** : Aucune clé ne doit être remise sans RC Pro.
6. **LEG-03 · Contrat propriétaire (prestations et mandat)** : Le contrat propriétaire est votre actif principal.
7. **CHN-01 · Choisir le channel manager / PMS** : Le channel manager est la colonne vertébrale de l'exploitation.
8. **OPS-16 · Recruter le réseau de prestataires ménage** : Sans prestataires ménage fiables, pas de qualité ni de croissance.
9. **ACQ-01 · Activer le réseau personnel** : Le réseau personnel apporte le premier client le plus vite.
10. **TST-05 · Test de bout en bout sur logement pilote** : Le test pilote révèle tout ce qui manque avant un vrai client.

## Timeline 30 / 60 / 90 jours

### J1 → J30 : Fondations

Société immatriculée, décisions structurantes prises, contrats rédigés, outils choisis, premiers rendez-vous.

- Modèle juridique tranché (J7)
- Statuts signés (J12)
- Kbis (≈ J20)
- RC Pro souscrite (J28)
- Channel manager choisi (J22)
- 20 premiers contacts prospects

### J31 → J60 : Mise en ordre de marche

Contrats validés, back-office relié, prestataires recrutés, test pilote réussi, site officiel en ligne.

- Relecture avocat (J45)
- Site en production (J40)
- Réseau ménage sous contrat (J40)
- Premier propriétaire signé (J50)
- Test pilote (J58)
- Go / No-Go (J60)

### J61 → J90 : Lancement et premiers logements

Lancement public, 3 à 5 logements actifs, premiers avis, premier relevé, process corrigés.

- Annonce du lancement (J61)
- Premier logement en ligne (J64)
- Premier séjour (≈ J75)
- Premier relevé et avis Google (J90)
- 5 logements actifs (J90)

### J90 et + : Structuration et croissance

Montée à 10 puis 25 logements, premier recrutement, IA et réservation directe.

- Revue trimestrielle
- Déclencheur d'embauche suivi
- Nouveaux services
- Extension géographique étudiée

## Phase 1 : Fondations (J1 → J30)

### STR · Cadrage & décisions structurantes

_Les décisions qui conditionnent tout le reste : associés, modèle juridique, zone, prix. À trancher la première semaine._

- [ ] **STR-01 · Vérifier la disponibilité du nom « Comme à la maison »**
  - Recherche d'antériorité INPI (data.inpi.fr) et EUIPO (TMview) en classes 35, 36, 37, 43 ; recherche sur societe.com / annuaire des entreprises ; disponibilité du nom de domaine (.fr et .com) et des identifiants réseaux. Choisir une orthographe unique (le dépôt Git s'appelle « Comme la maison » : harmoniser).
  - Pourquoi : Un nom déjà protégé peut vous obliger à tout renommer (site, logo, supports) après le lancement.
  - P0 Critique · Facile · 2 h · J+2 · Responsable : Moi
  - Prérequis : aucun
  - Outils : data.inpi.fr, TMview, registrar (OVH, Gandi) · Coût : 0 €
  - Livrable : Capture des recherches + décision sur l'orthographe officielle
- [ ] **STR-02 · Rédiger l'accord entre associés (Moi & Simon)**
  - Répartition du capital, rôles et temps consacré, rémunération, prise de décision, clause de non-concurrence, sortie d'un associé (good/bad leaver), vesting éventuel, gestion des désaccords. D'abord une note de principe, puis le pacte d'associés signé après immatriculation.
  - Pourquoi : C'est la première cause d'échec des sociétés à deux fondateurs. Il se négocie quand tout va bien.
  - P0 Critique · Moyenne · 1 j · J+5 · Responsable : Les deux
  - Prérequis : aucun
  - Outils : Google Docs, avocat (optionnel) · Coût : 0 à 800 €
  - Livrable : Note de principe signée par les deux associés
- [ ] **STR-03 · Trancher le modèle d'exploitation : sans ou avec carte G (loi Hoguet)**
  - Option A (recommandée pour démarrer) : le propriétaire reste titulaire de ses annonces et encaisse lui-même via les plateformes ; vous êtes co-hôte et facturez une commission de prestation de services. Aucune manipulation de fonds pour le compte du propriétaire. Option B : carte professionnelle « gestion immobilière » (CCI), garantie financière, compte séquestre, registre des mandats : vous encaissez et reversez. Faire valider le montage par un avocat ou un juriste spécialisé (zone grise sur l'« entremise »).
  - Pourquoi : Ce choix détermine les statuts, la banque, les assurances, les contrats et les flux financiers. Une erreur expose à des sanctions pénales.
  - P0 Critique · Difficile · 2 j · J+7 · Responsable : Les deux
  - Prérequis : aucun
  - Outils : Avocat / juriste immobilier, CCI Bordeaux Gironde · Coût : 150 à 500 € (consultation)
  - Livrable : Note de décision A ou B validée par un professionnel du droit
- [ ] **STR-04 · Délimiter la zone et la cible**
  - Communes et quartiers couverts (Bordeaux centre, Chartrons, Saint-Pierre, Saint-Michel, Bastide, Caudéran, Mérignac, Talence, Pessac, Bègles, Le Bouscat…), temps de trajet maximum, types de biens acceptés (studio → maison), cibles prioritaires (investisseurs LMNP, résidences secondaires, expatriés, résidence principale ponctuelle).
  - Pourquoi : La densité géographique fait la marge : chaque trajet non facturé mange la commission.
  - P1 Haute · Facile · 0,5 j · J+5 · Responsable : Les deux
  - Prérequis : aucun
  - Outils : Google Maps, AirDNA / PriceLabs Market Dashboard · Coût : 0 à 40 €
  - Livrable : Carte de la zone + fiche cible
- [ ] **STR-05 · Étude concurrentielle locale**
  - Lister 15 conciergeries actives à Bordeaux (nationales et locales) : commission, frais d'entrée, engagement, services inclus, note et nombre d'avis Google, promesse, faiblesses relevées dans les avis négatifs.
  - Pourquoi : Vous positionner sur les faiblesses réelles du marché, pas sur des suppositions.
  - P1 Haute · Facile · 1 j · J+8 · Responsable : Simon
  - Prérequis : STR-04
  - Outils : Google Maps, sites concurrents, skill startup-strategy · Coût : 0 €
  - Livrable : Tableau comparatif + 3 angles de différenciation
- [ ] **STR-06 · Fixer la grille tarifaire**
  - Commission sur revenus (repère Bordeaux : 18 à 25 % TTC), frais de mise en service, ménage refacturé au voyageur via les frais de ménage, linge, welcome box, interventions hors forfait, photos. Définir 2 ou 3 formules (ex. Essentiel / Sérénité / Premium), durée d'engagement et préavis.
  - Pourquoi : Le prix conditionne la rentabilité, le discours commercial et le prévisionnel.
  - P0 Critique · Moyenne · 1 j · J+10 · Responsable : Les deux
  - Prérequis : STR-03, STR-05
  - Outils : Tableur, prévisionnel · Coût : 0 €
  - Livrable : Grille tarifaire v1 (PDF + tableur)
- [ ] **STR-07 · Écrire la proposition de valeur**
  - Trois messages clés, les preuves associées, une garantie éventuelle (sans engagement, préavis 1 mois, rapport mensuel transparent), et la phrase qui explique l'offre en 10 secondes.
  - Pourquoi : Tout le marketing et la vente en découlent.
  - P1 Haute · Facile · 0,5 j · J+10 · Responsable : Les deux
  - Prérequis : STR-05
  - Outils : Google Docs · Coût : 0 €
  - Livrable : Message clé + argumentaire d'une page
- [ ] **STR-08 · Plan de capacité**
  - Combien de logements vous pouvez gérer à deux avec des prestataires de ménage externalisés (repère : 15 à 25 logements par personne opérationnelle), seuils d'embauche, rotations maximum par jour de pointe (samedi).
  - Pourquoi : Évite de signer plus que ce que vous pouvez livrer, cause principale des mauvais avis.
  - P2 Moyenne · Facile · 2 h · J+20 · Responsable : Les deux
  - Prérequis : STR-06
  - Outils : Tableur · Coût : 0 €
  - Livrable : Seuils de capacité et déclencheurs d'embauche

**Vérifications avant de clore la catégorie**

- [ ] Le rôle de chacun (Moi / Simon) est écrit et accepté
- [ ] Le modèle d'exploitation (sans carte G ou avec carte G) est tranché et validé par un juriste
- [ ] La grille tarifaire est chiffrée et cohérente avec le prévisionnel
- [ ] Le nom est disponible (INPI, domaine, réseaux) et orthographié de la même façon partout

**Erreurs fréquentes**

- Démarrer sans accord écrit entre associés : les désaccords arrivent au moment où l'activité décolle.
- Encaisser les loyers des voyageurs pour le compte des propriétaires sans carte professionnelle : c'est de l'exercice illégal de la loi Hoguet.
- Casser les prix pour signer les premiers : une commission trop basse est très difficile à remonter.

**Optimisations**

- Un modèle « propriétaire titulaire de ses comptes + conciergerie co-hôte facturant une commission » permet de démarrer vite sans carte G.
- Limiter la zone de départ à 20-30 minutes de trajet : la densité fait la rentabilité.

### JUR · Création juridique

_De la forme sociale au Kbis, puis la protection de la marque._

- [ ] **JUR-01 · Choisir la forme sociale**
  - SAS (recommandée à deux : souplesse, président assimilé salarié) ou SARL (gérant majoritaire TNS, charges plus basses). Comparer protection sociale, coût de rémunération, fiscalité des dividendes, entrée future d'un associé.
  - Pourquoi : Change le coût de votre rémunération pour des années.
  - P0 Critique · Moyenne · 0,5 j · J+9 · Responsable : Les deux
  - Prérequis : STR-02, STR-03, CPT-01
  - Outils : Expert-comptable, simulateur URSSAF · Coût : Inclus lettre de mission
  - Livrable : Forme sociale choisie et justifiée
- [ ] **JUR-02 · Choisir le siège social**
  - Domicile d'un dirigeant (autorisé, vérifier bail / règlement de copropriété) ou société de domiciliation (20 à 40 €/mois). Obtenir le justificatif.
  - Pourquoi : Obligatoire pour l'immatriculation ; l'adresse apparaîtra sur Google et les factures.
  - P0 Critique · Facile · 1 h · J+8 · Responsable : Moi
  - Prérequis : aucun
  - Outils : — · Coût : 0 à 40 €/mois
  - Livrable : Justificatif de siège
- [ ] **JUR-03 · Rédiger les statuts**
  - Objet social large : conciergerie, prestations de services aux propriétaires et aux voyageurs, gestion d'annonces, ménage, blanchisserie, maintenance, photographie, conseil, vente de produits (welcome box), et gestion immobilière si option B. Clauses d'agrément, d'exclusion, gouvernance, date de clôture du premier exercice.
  - Pourquoi : Les statuts fixent ce que la société a le droit de faire et comment vous décidez à deux.
  - P0 Critique · Moyenne · 1 j · J+12 · Responsable : Les deux
  - Prérequis : JUR-01, JUR-02, STR-01, CPT-08
  - Outils : Avocat, Legalstart / Captain Contrat, ou modèle expert-comptable · Coût : 0 à 1 500 €
  - Livrable : Statuts signés
- [ ] **JUR-04 · Déposer le capital social**
  - Virement de chaque associé sur un compte bloqué ouvert au nom de la société en formation ; obtenir le certificat de dépôt des fonds.
  - Pourquoi : Pièce obligatoire du dossier d'immatriculation.
  - P0 Critique · Facile · 1 à 3 j · J+14 · Responsable : Les deux
  - Prérequis : JUR-03, BNK-01
  - Outils : Banque pro · Coût : Capital libre (≥ 1 €)
  - Livrable : Certificat de dépôt des fonds
- [ ] **JUR-05 · Publier l'annonce légale**
  - Publication dans un journal d'annonces légales de Gironde (tarif forfaitaire fixé par arrêté pour une SAS / SARL).
  - Pourquoi : Obligatoire avant l'immatriculation.
  - P0 Critique · Facile · 1 h · J+14 · Responsable : Moi
  - Prérequis : JUR-03
  - Outils : Plateforme d'annonces légales · Coût : ≈ 150 à 200 €
  - Livrable : Attestation de parution
- [ ] **JUR-06 · Immatriculer la société (guichet unique INPI)**
  - Dossier sur formalites.entreprises.gouv.fr : statuts, certificat de dépôt, attestation de parution, justificatif de siège, pièces d'identité, déclaration de non-condamnation, bénéficiaires effectifs, régime fiscal et TVA choisis.
  - Pourquoi : Sans Kbis, pas de banque définitive, pas d'assurance, pas de Stripe, pas de contrat.
  - P0 Critique · Moyenne · 1 j + 1 à 3 sem. de délai · J+20 · Responsable : Moi
  - Prérequis : JUR-04, JUR-05, FIS-01, FIN-05
  - Outils : formalites.entreprises.gouv.fr · Coût : ≈ 40 € de frais de greffe
  - Livrable : Kbis, SIREN, code APE
- [ ] **JUR-07 · Contrôler le code APE**
  - Vérifier le code attribué par l'INSEE (ex. 68.32A si gestion immobilière, sinon un code de services selon l'activité principale). Demander une rectification si incohérent.
  - Pourquoi : Le code APE influence la convention collective présumée et certaines assurances.
  - P2 Moyenne · Facile · 30 min · J+25 · Responsable : Moi
  - Prérequis : JUR-06
  - Outils : INSEE (avis de situation SIRENE) · Coût : 0 €
  - Livrable : Code APE validé
- [ ] **JUR-08 · Signer le pacte d'associés définitif**
  - Transformer la note de principe (STR-02) en pacte d'associés signé par la société constituée.
  - Pourquoi : Sécurise les cas de départ, blocage et levée de fonds.
  - P1 Haute · Moyenne · 0,5 j · J+30 · Responsable : Les deux
  - Prérequis : JUR-06
  - Outils : Avocat ou modèle · Coût : 0 à 800 €
  - Livrable : Pacte signé
- [ ] **JUR-09 · Déposer la marque à l'INPI**
  - Dépôt du nom et/ou du logo en classes 35 (gestion), 36 (immobilier), 37 (nettoyage, maintenance), 43 (hébergement temporaire). Surveillance possible ensuite.
  - Pourquoi : Protège votre nom si l'activité grandit ou si un concurrent s'en approche.
  - P2 Moyenne · Facile · 2 h · J+45 · Responsable : Moi
  - Prérequis : STR-01, COM-01
  - Outils : procedures.inpi.fr · Coût : 190 € (1 classe) + 40 € par classe supplémentaire
  - Livrable : Récépissé de dépôt
- [ ] **JUR-10 · Obtenir la carte professionnelle G (option B uniquement)** _(option B : carte G uniquement)_
  - Demande à la CCI Bordeaux Gironde : justificatif d'aptitude professionnelle, attestation de garantie financière, RCP, attestation d'ouverture du compte séquestre, Kbis.
  - Pourquoi : Obligatoire si vous encaissez des fonds pour le compte des propriétaires.
  - P0 Critique · Difficile · 1 j + délai CCI · J+40 · Responsable : Moi
  - Prérequis : JUR-06, ASS-02, BNK-06
  - Outils : CCI Bordeaux Gironde · Coût : ≈ 120 € + garantie financière
  - Livrable : Carte professionnelle

**Vérifications avant de clore la catégorie**

- [ ] Kbis reçu et informations exactes (objet social, adresse, dirigeants)
- [ ] Code APE cohérent avec l'activité réelle
- [ ] Bénéficiaires effectifs déclarés
- [ ] Marque déposée ou décision écrite de la déposer plus tard

**Erreurs fréquentes**

- Un objet social trop étroit (« conciergerie » seul) qui empêche plus tard de vendre ameublement, home staging ou location moyenne durée.
- Oublier les aides chômage (ARCE / maintien ARE) : certaines démarches doivent être faites avant l'immatriculation.

**Optimisations**

- La SAS offre le plus de souplesse à deux associés ; faites comparer charges sociales et dividendes par l'expert-comptable avant de signer.
- Un premier exercice long (jusqu'à 24 mois max) peut éviter un bilan quasi vide.

### ADM · Administratif

_Les comptes et inscriptions obligatoires une fois la société créée._

- [ ] **ADM-01 · Créer l'espace professionnel impots.gouv**
  - Création de l'espace, réception du code par courrier, activation, adhésion aux services (TVA, IS, CFE, messagerie). Vérifier le numéro de TVA intracommunautaire.
  - Pourquoi : Indispensable pour déclarer et payer TVA, IS, CFE.
  - P0 Critique · Facile · 1 h + 1 à 2 sem. de courrier · J+22 · Responsable : Moi
  - Prérequis : JUR-06
  - Outils : impots.gouv.fr · Coût : 0 €
  - Livrable : Espace pro actif
- [ ] **ADM-02 · URSSAF, net-entreprises et régime social des dirigeants**
  - Vérifier l'affiliation, créer le compte net-entreprises (DSN dès qu'un dirigeant est rémunéré), demander l'ACRE si éligible dans les délais.
  - Pourquoi : Évite les régularisations et pénalités.
  - P0 Critique · Moyenne · 2 h · J+25 · Responsable : Moi
  - Prérequis : JUR-06
  - Outils : urssaf.fr, net-entreprises.fr · Coût : 0 €
  - Livrable : Comptes sociaux actifs
- [ ] **ADM-03 · Adhérer à un médiateur de la consommation**
  - Obligatoire dès que vous vendez à des consommateurs (propriétaires particuliers, voyageurs en direct). Choisir un médiateur référencé (CECMC), afficher ses coordonnées dans les CGV et sur le site.
  - Pourquoi : Obligation légale souvent oubliée par les conciergeries.
  - P0 Critique · Facile · 1 h · J+28 · Responsable : Moi
  - Prérequis : JUR-06
  - Outils : Liste des médiateurs agréés (economie.gouv.fr) · Coût : ≈ 50 à 150 €/an
  - Livrable : Convention de médiation
- [ ] **ADM-04 · Ouvrir les registres légaux**
  - Registre des décisions des associés, registre des mouvements de titres (SAS), procès-verbaux. Version dématérialisée possible.
  - Pourquoi : Obligatoires et demandés en cas de contrôle ou de cession.
  - P2 Moyenne · Facile · 1 h · J+35 · Responsable : Moi
  - Prérequis : JUR-06
  - Outils : Registres dématérialisés · Coût : 0 à 50 €
  - Livrable : Registres ouverts
- [ ] **ADM-05 · Organiser l'archivage documentaire**
  - Arborescence partagée : Société, Comptabilité, Assurances, Contrats propriétaires, Logements (1 dossier par logement), Prestataires, RH, Marketing. Règle de nommage des fichiers.
  - Pourquoi : Vous retrouverez un contrat ou une attestation en 30 secondes, même à 50 logements.
  - P2 Moyenne · Facile · 2 h · J+20 · Responsable : Moi
  - Prérequis : GOO-01
  - Outils : Google Drive · Coût : Inclus Workspace
  - Livrable : Arborescence + règle de nommage
- [ ] **ADM-06 · Encadrer l'usage des véhicules**
  - Véhicule personnel avec indemnités kilométriques (tenir un journal de trajets) ou véhicule de société. Stationnement à Bordeaux : budget, abonnements, zones.
  - Pourquoi : Les trajets entre logements sont un poste de coût important et doivent être justifiés.
  - P2 Moyenne · Facile · 1 h · J+30 · Responsable : Simon
  - Prérequis : CPT-01
  - Outils : Application de suivi km · Coût : Variable
  - Livrable : Règle frais de déplacement

**Vérifications avant de clore la catégorie**

- [ ] Accès actifs : impots.gouv pro, URSSAF, net-entreprises
- [ ] Médiateur de la consommation désigné et cité dans les CGV
- [ ] Registres légaux de la société ouverts
- [ ] Arborescence documentaire partagée en place

**Erreurs fréquentes**

- Attendre le code d'activation de l'espace professionnel impots.gouv envoyé par courrier : lancez la demande le jour du Kbis.
- Oublier le médiateur de la consommation alors que vos clients propriétaires sont des particuliers (amende administrative possible).

**Optimisations**

- Scannez et classez chaque document dès réception : l'expert-comptable, la banque et l'assureur vous redemanderont les mêmes pièces.

### BNK · Banque & paiements

_Compte professionnel, moyens de paiement et organisation de la trésorerie._

- [ ] **BNK-01 · Ouvrir le compte bancaire professionnel**
  - Comparer néobanques (Qonto, Shine…) et banques traditionnelles : dépôt de capital, cartes multiples, virements instantanés, dépôt d'espèces ou chèques, TPE, sous-comptes, connexion comptable, relation pour un futur prêt.
  - Pourquoi : Nécessaire au dépôt de capital puis à toute l'activité.
  - P0 Critique · Facile · 0,5 j · J+11 · Responsable : Moi
  - Prérequis : JUR-01
  - Outils : Banque / néobanque · Coût : 10 à 30 €/mois
  - Livrable : Compte ouvert (en formation puis définitif)
- [ ] **BNK-02 · Cartes et règles de dépenses**
  - Une carte par associé (et plus tard par salarié), plafonds, catégories autorisées, justificatif photographié à chaque paiement.
  - Pourquoi : Traçabilité des achats de linge, consommables et petites réparations.
  - P2 Moyenne · Facile · 1 h · J+25 · Responsable : Moi
  - Prérequis : JUR-06
  - Outils : Application bancaire · Coût : Inclus
  - Livrable : Cartes actives + règles écrites
- [ ] **BNK-03 · Mettre en place les encaissements clients**
  - Stripe (vérification KYC avec Kbis) pour frais de mise en service, welcome box et prestations ponctuelles ; mandat SEPA (Stripe SEPA ou GoCardless) pour les commissions mensuelles ; liens de paiement.
  - Pourquoi : Être payé automatiquement et à l'heure.
  - P1 Haute · Moyenne · 0,5 j · J+30 · Responsable : Moi
  - Prérequis : BNK-01, JUR-06
  - Outils : Stripe, GoCardless · Coût : ≈ 1,5 % + 0,25 € par carte ; SEPA ≈ 0,35 €
  - Livrable : Compte Stripe vérifié + modèle de mandat SEPA
- [ ] **BNK-04 · Connecter la banque au logiciel comptable**
  - Synchronisation automatique des transactions et rapprochement des justificatifs.
  - Pourquoi : Supprime la saisie et les oublis de justificatifs.
  - P1 Haute · Facile · 1 h · J+30 · Responsable : Moi
  - Prérequis : BNK-01, CPT-02
  - Outils : Logiciel comptable · Coût : Inclus
  - Livrable : Flux bancaire synchronisé
- [ ] **BNK-05 · Organiser la trésorerie en sous-comptes**
  - Exploitation / provision TVA et impôts / réserve de sécurité (objectif 3 mois de charges fixes).
  - Pourquoi : Évite de dépenser l'argent de l'État ou de manquer de trésorerie en basse saison (janvier-février).
  - P2 Moyenne · Facile · 30 min · J+35 · Responsable : Moi
  - Prérequis : BNK-01
  - Outils : Application bancaire · Coût : 0 €
  - Livrable : Sous-comptes créés + règle de virement mensuel
- [ ] **BNK-06 · Ouvrir un compte séquestre (option B uniquement)** _(option B : carte G uniquement)_
  - Compte spécial affecté aux fonds des mandants, adossé à la garantie financière.
  - Pourquoi : Obligatoire sous loi Hoguet.
  - P0 Critique · Moyenne · 1 j · J+35 · Responsable : Moi
  - Prérequis : JUR-06
  - Outils : Banque compatible · Coût : Variable
  - Livrable : Attestation d'ouverture

**Vérifications avant de clore la catégorie**

- [ ] Compte pro actif, cartes pour chaque associé
- [ ] Prélèvement SEPA des commissions opérationnel
- [ ] Flux bancaire connecté au logiciel comptable
- [ ] Réserve de trésorerie isolée

**Erreurs fréquentes**

- Mélanger dépenses personnelles et professionnelles dès le début.
- Option B : utiliser le compte courant pour les fonds des propriétaires au lieu d'un compte séquestre.

**Optimisations**

- Prélever la commission par SEPA le 5 du mois suivant supprime presque toutes les relances d'impayés.

### ASS · Assurances

_Couvrir la société, les associés, et vérifier que propriétaires et prestataires sont couverts._

- [ ] **ASS-01 · Souscrire la RC Professionnelle**
  - Couvre les dommages causés aux propriétaires, voyageurs et tiers dans le cadre des prestations, la perte ou le vol de clés, l'erreur de gestion. Vérifier plafonds, franchises, exclusions (dégâts des eaux, vol sans effraction).
  - Pourquoi : Un seul sinistre non couvert peut coûter plus qu'une année de chiffre d'affaires.
  - P0 Critique · Moyenne · 0,5 j · J+28 · Responsable : Moi
  - Prérequis : JUR-06, STR-03
  - Outils : Assureurs spécialisés, courtier · Coût : ≈ 400 à 1 200 €/an
  - Livrable : Attestation RC Pro
- [ ] **ASS-02 · Garantie financière + RCP Hoguet (option B uniquement)** _(option B : carte G uniquement)_
  - Souscription auprès d'une société de caution (ex. Galian, SO.CA.F).
  - Pourquoi : Condition de délivrance de la carte G.
  - P0 Critique · Moyenne · 1 j · J+35 · Responsable : Moi
  - Prérequis : JUR-06
  - Outils : Galian, SO.CA.F · Coût : ≈ 500 à 1 500 €/an
  - Livrable : Attestation de garantie
- [ ] **ASS-03 · Assurance du véhicule en usage professionnel**
  - Déclarer l'usage professionnel (trajets entre logements, transport de linge et matériel).
  - Pourquoi : Un accident en usage non déclaré peut entraîner un refus de prise en charge.
  - P1 Haute · Facile · 1 h · J+30 · Responsable : Simon
  - Prérequis : ADM-06
  - Outils : Assureur auto · Coût : Variable
  - Livrable : Avenant usage pro
- [ ] **ASS-04 · Multirisque professionnelle (si stock ou local)**
  - Couvre le stock de linge, consommables et matériel stockés.
  - Pourquoi : Le stock de linge atteint vite plusieurs milliers d'euros.
  - P2 Moyenne · Facile · 1 h · J+60 · Responsable : Moi
  - Prérequis : OPS-18
  - Outils : Assureur · Coût : ≈ 150 à 400 €/an
  - Livrable : Attestation multirisque
- [ ] **ASS-05 · Protection juridique professionnelle**
  - Prise en charge des frais de litige avec propriétaires, voyageurs, prestataires.
  - Pourquoi : Les litiges sur dégâts et reversements sont fréquents.
  - P2 Moyenne · Facile · 1 h · J+45 · Responsable : Moi
  - Prérequis : ASS-01
  - Outils : Assureur · Coût : ≈ 150 à 400 €/an
  - Livrable : Contrat protection juridique
- [ ] **ASS-06 · Prévoyance et mutuelle des dirigeants**
  - Arrêt de travail, invalidité, décès, frais de santé. Adapter au régime social choisi.
  - Pourquoi : À deux, l'indisponibilité de l'un met l'activité en danger.
  - P2 Moyenne · Facile · 2 h · J+60 · Responsable : Les deux
  - Prérequis : ADM-02
  - Outils : Courtier · Coût : Variable
  - Livrable : Contrats souscrits
- [ ] **ASS-07 · Assurance cyber-risques**
  - Piratage de comptes plateformes, fuite de données voyageurs, rançongiciel.
  - Pourquoi : Un compte Airbnb piraté bloque tous les logements d'un coup.
  - P3 Plus tard · Facile · 1 h · J+90 · Responsable : Moi
  - Prérequis : ASS-01
  - Outils : Assureur · Coût : ≈ 200 à 600 €/an
  - Livrable : Devis ou contrat
- [ ] **ASS-08 · Règle d'assurance des propriétaires**
  - Exiger à l'onboarding : assurance habitation ou PNO couvrant explicitement la location saisonnière, attestation annuelle ; expliquer AirCover et ses limites.
  - Pourquoi : La plupart des litiges graves viennent d'un logement mal assuré.
  - P0 Critique · Facile · 1 h · J+35 · Responsable : Simon
  - Prérequis : LEG-03
  - Outils : Checklist onboarding · Coût : 0 €
  - Livrable : Clause contractuelle + pièce obligatoire dans l'onboarding
- [ ] **ASS-09 · Contrôle d'assurance des prestataires**
  - Attestation RC pro + attestation URSSAF (devoir de vigilance tous les 6 mois dès 5 000 € HT de prestations annuelles).
  - Pourquoi : Vous êtes solidairement responsable des cotisations d'un sous-traitant non déclaré.
  - P1 Haute · Facile · 30 min par prestataire · J+40 · Responsable : Simon
  - Prérequis : LEG-05
  - Outils : Dossier prestataire · Coût : 0 €
  - Livrable : Dossier prestataire complet

**Vérifications avant de clore la catégorie**

- [ ] Attestation RC Pro reçue avant la première remise de clés
- [ ] Garanties couvrant : perte de clés, dommages chez le propriétaire, erreur de gestion
- [ ] Chaque propriétaire a fourni une attestation d'assurance compatible location saisonnière
- [ ] Chaque prestataire a fourni RC pro et attestation URSSAF

**Erreurs fréquentes**

- Compter sur AirCover comme une assurance : c'est une garantie de la plateforme avec délais et exclusions (déclaration dans les 14 jours).
- Un contrat habitation du propriétaire qui exclut la location saisonnière : en cas de sinistre, rien n'est couvert.

**Optimisations**

- Demandez deux devis auprès d'assureurs spécialisés en conciergerie : les garanties « perte de clés » et « biens confiés » varient beaucoup.

### CPT · Comptabilité

_Expert-comptable, logiciel, facturation conforme et relevés propriétaires._

- [ ] **CPT-01 · Choisir l'expert-comptable**
  - En ligne ou local, forfait mensuel, périmètre (bilan, liasse, TVA, social, juridique annuel), connaissance de la conciergerie et du LMNP, réactivité. Le consulter avant les statuts.
  - Pourquoi : Il conseille forme sociale, TVA et rémunération dès le départ.
  - P0 Critique · Facile · 0,5 j · J+6 · Responsable : Moi
  - Prérequis : aucun
  - Outils : Devis comparés · Coût : ≈ 100 à 250 €/mois
  - Livrable : Lettre de mission signée
- [ ] **CPT-08 · Fixer la date de clôture du premier exercice**
  - Premier exercice long possible (jusqu'à 24 mois). Éviter une clôture en pleine saison.
  - Pourquoi : Donne du temps avant le premier bilan et simplifie la première année.
  - P1 Haute · Facile · 30 min · J+8 · Responsable : Moi
  - Prérequis : CPT-01
  - Outils : Expert-comptable · Coût : 0 €
  - Livrable : Date de clôture inscrite aux statuts
- [ ] **CPT-02 · Choisir le logiciel de facturation et comptabilité**
  - Connexion bancaire, factures et devis, relances, conformité facturation électronique via une plateforme agréée (PA), accès expert-comptable, export. Vérifier la compatibilité avec votre back-office.
  - Pourquoi : Obligation de réception des factures électroniques déjà en vigueur ; émission obligatoire dans un an.
  - P0 Critique · Moyenne · 0,5 j · J+25 · Responsable : Moi
  - Prérequis : CPT-01
  - Outils : Pennylane, Tiime, Indy… · Coût : 0 à 50 €/mois
  - Livrable : Logiciel paramétré
- [ ] **CPT-03 · Créer des modèles de factures conformes**
  - Mentions : identité et SIREN, numéro de TVA ou « TVA non applicable, art. 293 B du CGI », numérotation continue, date, désignation, prix, conditions de paiement, pénalités de retard, indemnité forfaitaire de 40 € (clients professionnels).
  - Pourquoi : Une facture non conforme est sanctionnable et fragilise le recouvrement.
  - P0 Critique · Facile · 2 h · J+28 · Responsable : Moi
  - Prérequis : CPT-02, FIS-01
  - Outils : Logiciel de facturation · Coût : 0 €
  - Livrable : Modèles facture, avoir, devis
- [ ] **CPT-04 · Définir le relevé mensuel propriétaire**
  - Contenu : nuits réservées, revenus par plateforme, commission, frais de ménage, linge, achats refacturés avec justificatifs, solde. Format PDF clair, envoyé avant le 5 du mois.
  - Pourquoi : La transparence du relevé est ce qui fidélise le propriétaire.
  - P0 Critique · Moyenne · 0,5 j · J+35 · Responsable : Moi
  - Prérequis : CPT-03, STR-06
  - Outils : Back-office, tableur · Coût : 0 €
  - Livrable : Modèle de relevé validé
- [ ] **CPT-05 · Process notes de frais et justificatifs**
  - Photo du ticket à l'achat, envoi automatique au logiciel, frais kilométriques mensuels.
  - Pourquoi : Chaque justificatif perdu est une charge non déductible.
  - P2 Moyenne · Facile · 1 h · J+35 · Responsable : Moi
  - Prérequis : CPT-02
  - Outils : Application bancaire / comptable · Coût : 0 €
  - Livrable : Procédure écrite
- [ ] **CPT-06 · Comptabilité analytique par logement**
  - Suivre commission, coût de ménage, linge, déplacements et temps passé par logement.
  - Pourquoi : Identifie les logements non rentables à renégocier ou à quitter.
  - P2 Moyenne · Moyenne · 2 h · J+60 · Responsable : Moi
  - Prérequis : CPT-02, BO-01
  - Outils : Logiciel comptable, back-office · Coût : 0 €
  - Livrable : Axes analytiques créés
- [ ] **CPT-07 · Calendrier des échéances**
  - TVA (si assujetti), acomptes d'IS, CFE (décembre), liasse fiscale, approbation des comptes (6 mois après clôture), dépôt au greffe, DSN.
  - Pourquoi : Les pénalités de retard sont évitables à 100 %.
  - P1 Haute · Facile · 1 h · J+30 · Responsable : Moi
  - Prérequis : FIS-01, FIS-02
  - Outils : Google Agenda · Coût : 0 €
  - Livrable : Calendrier partagé avec rappels

**Vérifications avant de clore la catégorie**

- [ ] Lettre de mission signée
- [ ] Factures conformes (mentions obligatoires, numérotation continue)
- [ ] Réception des factures électroniques opérationnelle
- [ ] Relevé mensuel propriétaire testé sur un cas réel
- [ ] Calendrier fiscal et social rempli

**Erreurs fréquentes**

- Ignorer la réforme de la facturation électronique : réception obligatoire pour toutes les entreprises depuis le 1er septembre 2026, émission obligatoire pour les TPE-PME au 1er septembre 2027.
- Refacturer des achats au propriétaire sans justificatif ni règle écrite : source n°1 de conflits.

**Optimisations**

- Choisissez un expert-comptable qui connaît le LMNP : vous pourrez le recommander à vos propriétaires (partenariat, apport d'affaires).

### FIS · Fiscalité

_TVA, impôt sur les sociétés, CFE, taxe de séjour et information fiscale des propriétaires._

- [ ] **FIS-01 · Choisir le régime de TVA**
  - Franchise en base (seuils pour les prestations de services : à confirmer pour 2026 avec l'expert-comptable, le dispositif a été discuté en loi de finances) ou option pour la TVA (récupération sur linge et matériel). Vos clients étant des particuliers, la franchise rend l'offre plus compétitive au départ.
  - Pourquoi : Impacte directement vos prix et votre marge.
  - P0 Critique · Moyenne · 1 h · J+12 · Responsable : Moi
  - Prérequis : CPT-01, STR-06
  - Outils : Expert-comptable · Coût : 0 €
  - Livrable : Décision TVA déclarée à l'immatriculation
- [ ] **FIS-02 · Régime d'imposition et politique de rémunération**
  - IS (taux réduit de 15 % jusqu'à 42 500 € de bénéfice, 25 % au-delà) ou option IR temporaire ; arbitrage salaire / dividendes.
  - Pourquoi : Optimise ce qu'il vous reste réellement.
  - P1 Haute · Moyenne · 1 h · J+15 · Responsable : Les deux
  - Prérequis : JUR-01
  - Outils : Expert-comptable · Coût : 0 €
  - Livrable : Choix écrit du régime
- [ ] **FIS-03 · Déclaration initiale de CFE**
  - Formulaire 1447-C-SD avant le 31 décembre de l'année de création (exonération la première année civile).
  - Pourquoi : Oubli fréquent, taxation d'office ensuite.
  - P1 Haute · Facile · 30 min · J+60 · Responsable : Moi
  - Prérequis : ADM-01
  - Outils : impots.gouv.fr · Coût : 0 €
  - Livrable : Déclaration déposée
- [ ] **FIS-04 · Cartographier la taxe de séjour**
  - Qui collecte pour chaque canal : Airbnb collecte et reverse pour Bordeaux Métropole ; vérifier Booking et Vrbo logement par logement ; réservations directes : collecte par le loueur ou l'intermédiaire et déclaration sur la plateforme de Bordeaux Métropole. Taux selon classement.
  - Pourquoi : Oubli = rappel de taxe + amende, et c'est votre nom qui apparaît.
  - P0 Critique · Moyenne · 2 h · J+30 · Responsable : Moi
  - Prérequis : REG-01
  - Outils : Site taxe de séjour Bordeaux Métropole · Coût : 0 €
  - Livrable : Tableau canal / collecteur / déclarant
- [ ] **FIS-05 · Paramétrer la TVA dans tous les outils**
  - Facturation, Stripe, channel manager (frais de ménage), relevés propriétaires, mentions des factures.
  - Pourquoi : Une incohérence entre outils fausse toute la comptabilité.
  - P1 Haute · Facile · 1 h · J+30 · Responsable : Moi
  - Prérequis : FIS-01, CPT-02
  - Outils : Stripe, logiciel de facturation · Coût : 0 €
  - Livrable : Paramétrage vérifié
- [ ] **FIS-06 · Fiche d'information fiscale propriétaire**
  - Rappel des régimes (micro-BIC : meublé de tourisme non classé abattement 30 % jusqu'à 15 000 € ; classé 50 % jusqu'à 77 700 € ; régime réel LMNP), transmission des revenus par les plateformes (DAC7). Renvoyer vers un expert-comptable partenaire.
  - Pourquoi : Rassure et crée un argument commercial (classement, partenariat), sans risque de conseil fiscal non autorisé.
  - P2 Moyenne · Facile · 2 h · J+50 · Responsable : Moi
  - Prérequis : FIS-01
  - Outils : Google Docs · Coût : 0 €
  - Livrable : Fiche PDF d'une page
- [ ] **FIS-07 · Déclaration DAS2 des commissions versées**
  - Si vous rémunérez des apporteurs d'affaires au-delà de 1 200 € par an et par bénéficiaire, déclaration annuelle obligatoire.
  - Pourquoi : Oubli sanctionné par une amende proportionnelle.
  - P3 Plus tard · Facile · 1 h/an · J+120 · Responsable : Moi
  - Prérequis : ACQ-07
  - Outils : Expert-comptable · Coût : 0 €
  - Livrable : DAS2 déposée

**Vérifications avant de clore la catégorie**

- [ ] Régime de TVA choisi et appliqué dans les factures
- [ ] Déclaration initiale CFE faite avant le 31 décembre
- [ ] Circuit de la taxe de séjour clarifié pour chaque canal de réservation
- [ ] Aucun conseil fiscal personnalisé donné aux propriétaires sans professionnel

**Erreurs fréquentes**

- Dépasser le seuil de franchise de TVA sans anticiper : la TVA devient due immédiatement et vos prix TTC ne bougent pas.
- Réservations directes : oublier de collecter et reverser la taxe de séjour (les plateformes ne le font que pour leurs propres réservations).

**Optimisations**

- Construisez vos prix « TVA comprise » dès le départ : le jour où vous devenez assujetti, votre marge baisse mais vos clients ne voient pas de hausse.

### REG · Réglementation location courte durée (Bordeaux Métropole)

_Le risque juridique n°1 d'une conciergerie : gérer un logement qui n'a pas le droit d'être loué. Bordeaux fait partie des villes les plus strictes._

- [ ] **REG-01 · Fiche réglementaire par commune**
  - Pour Bordeaux et chaque commune couverte : numéro d'enregistrement (téléservice local puis national prévu par la loi Le Meur), plafond de nuitées pour les résidences principales (120 nuits, abaissable à 90 par délibération : vérifier), autorisation de changement d'usage et compensation pour les résidences secondaires, exigences DPE pour les nouvelles autorisations, zones et quotas éventuels.
  - Pourquoi : Base de toute la qualification des logements et de vos contrats.
  - P0 Critique · Difficile · 1 à 2 j · J+10 · Responsable : Moi
  - Prérequis : aucun
  - Outils : bordeaux.fr, sites des communes, service-public.fr, legifrance.gouv.fr · Coût : 0 €
  - Livrable : Une fiche par commune, datée et sourcée
- [ ] **REG-02 · Checklist d'éligibilité d'un logement**
  - Statut (résidence principale / secondaire), propriétaire ou locataire autorisé, numéro d'enregistrement, changement d'usage, DPE, règlement de copropriété, assurance, équipements de sécurité. À remplir avant toute signature.
  - Pourquoi : Filtre les logements à risque avant d'y investir du temps.
  - P0 Critique · Moyenne · 0,5 j · J+14 · Responsable : Les deux
  - Prérequis : REG-01
  - Outils : Formulaire back-office · Coût : 0 €
  - Livrable : Formulaire d'éligibilité
- [ ] **REG-03 · Suivi du plafond de nuitées (résidences principales)**
  - Vérifier si la plateforme bloque automatiquement ; sinon compteur par logement tous canaux confondus, alerte à 100 nuits, blocage du calendrier.
  - Pourquoi : Le dépassement expose le propriétaire à une amende et vous à la rupture du contrat.
  - P1 Haute · Moyenne · 0,5 j · J+45 · Responsable : Moi
  - Prérequis : REG-01, BO-01
  - Outils : Back-office, channel manager · Coût : 0 €
  - Livrable : Compteur + alerte automatiques
- [ ] **REG-04 · Fiche individuelle de police (voyageurs étrangers)**
  - Obligation pour les loueurs de meublés : faire remplir une fiche aux clients de nationalité étrangère, la conserver 6 mois et la remettre aux autorités sur demande. Collecte minimale, conforme RGPD.
  - Pourquoi : Obligation légale souvent ignorée.
  - P1 Haute · Facile · 2 h · J+45 · Responsable : Moi
  - Prérequis : REG-01
  - Outils : Chekin ou formulaire back-office · Coût : 0 à 5 €/logement/mois
  - Livrable : Process de collecte automatisé
- [ ] **REG-05 · Checklist de mise en conformité du logement**
  - Détecteur de fumée (obligatoire), détecteur de monoxyde si appareil à combustion, extincteur, trousse de secours, consignes d'urgence affichées, sécurité piscine le cas échéant, installation électrique sans danger apparent.
  - Pourquoi : Sécurité des voyageurs et responsabilité en cas d'accident.
  - P1 Haute · Facile · 2 h · J+30 · Responsable : Simon
  - Prérequis : REG-02
  - Outils : Checklist · Coût : ≈ 60 à 150 € par logement (à la charge du propriétaire)
  - Livrable : Checklist intégrée à l'onboarding
- [ ] **REG-06 · Offre de classement meublé de tourisme**
  - Accompagner le propriétaire (organisme accrédité, 1 à 5 étoiles, valable 5 ans) : préparation, visite, dossier.
  - Pourquoi : Avantage fiscal pour le propriétaire, service facturable pour vous.
  - P2 Moyenne · Moyenne · 1 j · J+75 · Responsable : Simon
  - Prérequis : REG-01
  - Outils : Organismes accrédités · Coût : ≈ 150 à 250 € par visite (propriétaire)
  - Livrable : Offre et process de classement
- [ ] **REG-07 · Veille réglementaire mensuelle**
  - Alertes Google, délibérations de Bordeaux Métropole, newsletters professionnelles, textes d'application de la loi Le Meur. Mettre à jour les fiches.
  - Pourquoi : La réglementation évolue chaque année.
  - P2 Moyenne · Facile · 1 h/mois · J+60 · Responsable : Moi
  - Prérequis : REG-01
  - Outils : Google Alerts, IA de synthèse · Coût : 0 €
  - Livrable : Note de veille mensuelle

**Vérifications avant de clore la catégorie**

- [ ] Fiche réglementaire à jour pour chaque commune couverte
- [ ] Aucun logement signé sans checklist d'éligibilité complète
- [ ] Numéro d'enregistrement affiché sur chaque annonce
- [ ] Suivi du plafond de nuitées actif pour chaque résidence principale

**Erreurs fréquentes**

- Accepter une résidence secondaire à Bordeaux sans autorisation de changement d'usage : amende civile jusqu'à 100 000 € par logement pour le propriétaire, et votre réputation.
- Gérer un appartement loué par un locataire qui sous-loue sans accord écrit du bailleur.
- Ignorer le règlement de copropriété qui interdit la location meublée touristique.

**Optimisations**

- Faites de la conformité un argument commercial : « on vérifie tout avant la mise en ligne ».
- Proposez le classement meublé de tourisme : il améliore la fiscalité du propriétaire et crée un service facturable.

### LEG · Légal : contrats, CGV, RGPD

_Tous les documents juridiques côté site, propriétaires, prestataires et voyageurs._

- [ ] **LEG-01 · Mentions légales du site**
  - Dénomination, forme, capital, siège, RCS, TVA, directeur de la publication, hébergeur, contact, médiateur ; carte G si option B.
  - Pourquoi : Obligation LCEN.
  - P0 Critique · Facile · 1 h · J+30 · Responsable : Moi
  - Prérequis : JUR-06, ADM-03
  - Outils : — · Coût : 0 €
  - Livrable : Page mentions légales
- [ ] **LEG-02 · Conditions générales de prestations (propriétaires)**
  - Services, tarifs, durée, résiliation, responsabilités, obligations du propriétaire (conformité, assurance), médiateur, droit de rétractation (14 jours hors établissement ou à distance) avec formulaire type et demande expresse pour démarrer avant la fin du délai.
  - Pourquoi : Cadre juridique de toute la relation client.
  - P0 Critique · Difficile · 1 j · J+32 · Responsable : Moi
  - Prérequis : STR-06, ADM-03
  - Outils : Avocat recommandé · Coût : Voir LEG-12
  - Livrable : CGV v1
- [ ] **LEG-03 · Contrat propriétaire (prestations et mandat)**
  - Option A : contrat de prestations + autorisation d'agir comme co-hôte. Option B : mandat de gestion écrit, numéroté au registre. Clauses : durée, préavis, exclusivité, accès aux comptes, fixation des prix, plafond de dépenses sans accord (ex. 150 €), gestion des dégâts et de la caution, inventaire, reversements, RGPD, fin de contrat.
  - Pourquoi : Le document le plus important de votre entreprise.
  - P0 Critique · Difficile · 1 à 2 j · J+32 · Responsable : Les deux
  - Prérequis : STR-03, STR-06
  - Outils : Avocat · Coût : Voir LEG-12
  - Livrable : Contrat type
- [ ] **LEG-04 · Annexes au contrat propriétaire**
  - Fiche logement, inventaire et état des lieux photo, grille tarifaire, mandat SEPA, attestation d'assurance, déclaration de conformité réglementaire (statut, numéro d'enregistrement, autorisation), liste des équipements requis.
  - Pourquoi : Transforme les engagements du contrat en preuves.
  - P0 Critique · Moyenne · 0,5 j · J+35 · Responsable : Simon
  - Prérequis : LEG-03, REG-02
  - Outils : Google Docs / back-office · Coût : 0 €
  - Livrable : Pack d'annexes
- [ ] **LEG-05 · Contrats prestataires (ménage, linge, artisans)**
  - Contrat de sous-traitance avec cahier des charges, tarifs par prestation, délais, confidentialité, gestion des clés, pénalités qualité, devoir de vigilance. Laisser au prestataire l'organisation de son travail pour éviter la requalification en salariat.
  - Pourquoi : Protège contre la requalification et la solidarité financière URSSAF.
  - P0 Critique · Moyenne · 0,5 j · J+30 · Responsable : Simon
  - Prérequis : STR-06
  - Outils : Avocat / modèle · Coût : Voir LEG-12
  - Livrable : Contrat prestataire type
- [ ] **LEG-06 · Politique de confidentialité**
  - Finalités, bases légales, durées de conservation, destinataires et sous-traitants (hébergeur, Supabase, Stripe, channel manager, Google), transferts hors UE, droits et contact.
  - Pourquoi : Obligation RGPD ; vous traitez des données de propriétaires et de voyageurs.
  - P0 Critique · Moyenne · 0,5 j · J+30 · Responsable : Moi
  - Prérequis : OUT-01
  - Outils : Modèles CNIL · Coût : 0 €
  - Livrable : Page politique de confidentialité
- [ ] **LEG-07 · Bandeau et politique cookies**
  - Aucun traceur non essentiel avant consentement, bouton « Refuser » aussi visible qu'« Accepter », preuve du consentement, Consent Mode v2 pour Google.
  - Pourquoi : Sanctions CNIL fréquentes sur ce point.
  - P0 Critique · Moyenne · 2 h · J+32 · Responsable : Moi
  - Prérequis : LEG-06
  - Outils : Axeptio, Didomi, tarteaucitron.js · Coût : 0 à 30 €/mois
  - Livrable : Bandeau conforme en production
- [ ] **LEG-08 · Registre des traitements et accords de sous-traitance**
  - Lister chaque traitement (prospects, propriétaires, voyageurs, prestataires, salariés) ; signer ou accepter les DPA de chaque outil.
  - Pourquoi : Première pièce demandée en cas de contrôle CNIL.
  - P1 Haute · Moyenne · 0,5 j · J+45 · Responsable : Moi
  - Prérequis : LEG-06
  - Outils : Modèle de registre CNIL · Coût : 0 €
  - Livrable : Registre à jour
- [ ] **LEG-09 · Règlement intérieur voyageurs**
  - Nombre maximum de personnes, fêtes interdites, horaires de calme, tabac, animaux, horaires d'arrivée et départ, déchets, pénalités, caution.
  - Pourquoi : Base pour refuser, sanctionner et réclamer en cas d'abus.
  - P1 Haute · Facile · 2 h · J+30 · Responsable : Simon
  - Prérequis : aucun
  - Outils : Google Docs · Coût : 0 €
  - Livrable : Règlement FR / EN
- [ ] **LEG-10 · Conditions des réservations directes**
  - CGV voyageurs, politique d'annulation, dépôt de garantie (empreinte bancaire), collecte de la taxe de séjour.
  - Pourquoi : Nécessaire avant d'ouvrir la réservation directe.
  - P3 Plus tard · Moyenne · 0,5 j · J+120 · Responsable : Moi
  - Prérequis : LEG-02, FIS-04
  - Outils : Avocat, Swikly · Coût : Voir LEG-12
  - Livrable : CGV voyageurs
- [ ] **LEG-11 · Contrat d'apporteur d'affaires**
  - Rémunération (forfait ou pourcentage de la première année), conditions de versement, durée, confidentialité. Pas de rémunération d'un agent immobilier sans cadre écrit.
  - Pourquoi : Sécurise vos partenariats d'acquisition.
  - P1 Haute · Moyenne · 2 h · J+40 · Responsable : Moi
  - Prérequis : STR-06
  - Outils : Modèle / avocat · Coût : Voir LEG-12
  - Livrable : Contrat type
- [ ] **LEG-12 · Relecture globale par un avocat**
  - Pack : CGV, contrat propriétaire et annexes, contrat prestataire, apporteur d'affaires. Demander un forfait.
  - Pourquoi : Un contrat mal rédigé coûte bien plus cher qu'une relecture.
  - P1 Haute · Moyenne · 1 à 2 sem. de délai · J+45 · Responsable : Moi
  - Prérequis : LEG-02, LEG-03, LEG-05, LEG-11
  - Outils : Avocat droit immobilier / consommation · Coût : ≈ 800 à 2 500 €
  - Livrable : Documents validés

**Vérifications avant de clore la catégorie**

- [ ] Mentions légales, CGV, politique de confidentialité et cookies en ligne
- [ ] Contrat propriétaire et annexes relus par un professionnel du droit
- [ ] Droit de rétractation traité pour les contrats signés à distance ou à domicile
- [ ] Registre des traitements RGPD et accords de sous-traitance signés
- [ ] Règlement intérieur voyageurs intégré aux annonces

**Erreurs fréquentes**

- Signer chez le propriétaire sans formulaire de rétractation de 14 jours : le contrat peut être annulé.
- Partager les identifiants Airbnb du propriétaire au lieu d'utiliser l'accès co-hôte.
- Contrat sans plafond de dépenses autorisées : chaque petite réparation devient un litige.

**Optimisations**

- Prévoyez une clause de sortie propre (préavis, restitution des accès, transfert du calendrier) : elle rassure en rendez-vous et accélère la signature.

### SEC · Sécurité

_Mots de passe, double authentification, sauvegardes, clés physiques et sécurité applicative._

- [ ] **SEC-01 · Gestionnaire de mots de passe partagé**
  - Coffres séparés : société, plateformes, logements (codes, wifi, alarmes). Mots de passe uniques et longs.
  - Pourquoi : Fondation de toute la sécurité ; indispensable pour partager sans exposer.
  - P0 Critique · Facile · 2 h · J+3 · Responsable : Moi
  - Prérequis : aucun
  - Outils : Bitwarden, 1Password · Coût : ≈ 4 à 8 €/utilisateur/mois
  - Livrable : Coffres créés, accès des deux associés
- [ ] **SEC-02 · Double authentification partout**
  - Google, banque, Stripe, Airbnb, Booking, channel manager, registrar, hébergeur, Supabase, réseaux sociaux. Codes de secours dans le gestionnaire.
  - Pourquoi : Bloque l'essentiel des prises de contrôle de comptes.
  - P0 Critique · Facile · 2 h · J+25 · Responsable : Les deux
  - Prérequis : SEC-01
  - Outils : Application d'authentification, clés FIDO · Coût : 0 à 50 €
  - Livrable : Liste des comptes avec 2FA cochée
- [ ] **SEC-03 · Accès délégués aux plateformes**
  - Utiliser l'accès co-hôte Airbnb et les utilisateurs de l'extranet Booking plutôt que les identifiants des propriétaires ; permissions minimales.
  - Pourquoi : Traçabilité, révocation simple en fin de contrat, aucun mot de passe de propriétaire en circulation.
  - P0 Critique · Facile · 1 h · J+40 · Responsable : Moi
  - Prérequis : CHN-02
  - Outils : Airbnb, Booking extranet · Coût : 0 €
  - Livrable : Procédure d'accès délégué
- [ ] **SEC-04 · Sauvegardes (règle 3-2-1)**
  - Sauvegardes Supabase (quotidiennes ou PITR selon plan), export hebdomadaire de la base et des fichiers hors Supabase, sauvegarde Google Workspace, test de restauration.
  - Pourquoi : Perdre le back-office un samedi de rotation paralyse tout.
  - P1 Haute · Moyenne · 0,5 j · J+45 · Responsable : Moi
  - Prérequis : BO-01
  - Outils : Supabase, stockage externe · Coût : 0 à 25 €/mois
  - Livrable : Plan de sauvegarde + restauration testée
- [ ] **SEC-05 · Gestion physique des clés**
  - Clés codifiées sans adresse, registre des sorties, boîtes à clés sécurisées ou serrures connectées, code changé à chaque séjour, double conservé dans un lieu sûr.
  - Pourquoi : La perte d'une clé identifiable impose de changer la serrure.
  - P0 Critique · Facile · 2 h · J+30 · Responsable : Simon
  - Prérequis : aucun
  - Outils : Registre, boîtes à clés · Coût : ≈ 30 à 80 € par boîte
  - Livrable : Procédure clés
- [ ] **SEC-06 · Sécurité applicative du back-office**
  - RLS activée sur toutes les tables, rôles testés, secrets hors du code, clé service_role uniquement côté serveur, codes d'accès chiffrés, advisors Supabase sans alerte, dépendances à jour.
  - Pourquoi : Le back-office contient adresses, codes d'accès et données personnelles.
  - P0 Critique · Difficile · 1 j · J+35 · Responsable : Moi
  - Prérequis : BO-01
  - Outils : Supabase advisors, skill product-stack · Coût : 0 €
  - Livrable : Rapport de revue de sécurité
- [ ] **SEC-07 · Authentification du domaine e-mail**
  - SPF, DKIM, DMARC (commencer en p=none puis durcir), vérification de délivrabilité.
  - Pourquoi : Évite que vos e-mails aux propriétaires tombent en spam et que quelqu'un usurpe votre domaine.
  - P0 Critique · Moyenne · 1 h · J+10 · Responsable : Moi
  - Prérequis : GOO-01
  - Outils : DNS, mail-tester.com · Coût : 0 €
  - Livrable : Enregistrements DNS valides
- [ ] **SEC-08 · Procédures d'arrivée, départ et incident**
  - Donner et retirer les accès d'un collaborateur ou prestataire ; que faire en cas de compte piraté, clé perdue, téléphone volé.
  - Pourquoi : Réagir en minutes plutôt qu'en jours.
  - P2 Moyenne · Facile · 2 h · J+60 · Responsable : Moi
  - Prérequis : SEC-01
  - Outils : Wiki interne · Coût : 0 €
  - Livrable : Procédures écrites
- [ ] **SEC-09 · Sensibilisation aux arnaques**
  - Faux e-mails de plateformes, demandes de paiement hors plateforme, faux voyageurs, faux prestataires.
  - Pourquoi : Les conciergeries sont une cible connue.
  - P2 Moyenne · Facile · 1 h · J+45 · Responsable : Les deux
  - Prérequis : aucun
  - Outils : — · Coût : 0 €
  - Livrable : Fiche réflexes

**Vérifications avant de clore la catégorie**

- [ ] 100 % des comptes critiques protégés par 2FA
- [ ] Aucun mot de passe partagé hors du gestionnaire
- [ ] Sauvegarde testée par une restauration réelle
- [ ] RLS active et testée sur toutes les tables Supabase
- [ ] SPF, DKIM et DMARC valides

**Erreurs fréquentes**

- Écrire l'adresse du logement sur le porte-clés.
- Garder le même code de boîte à clés pour tous les séjours.
- Utiliser la clé service_role de Supabase côté navigateur.

**Optimisations**

- Un faux message « Airbnb » demandant de vous reconnecter est l'arnaque la plus courante : ne cliquez jamais, passez par l'application.

### FIN · Finance

_Budget de lancement, prévisionnel, trésorerie, seuil de rentabilité et financements._

- [ ] **FIN-05 · Vérifier les aides avant l'immatriculation**
  - ACRE, ARCE ou maintien de l'ARE si l'un de vous est demandeur d'emploi (France Travail), prêt d'honneur (Initiative Gironde, Réseau Entreprendre), BPI. Certaines conditions se jouent avant la création.
  - Pourquoi : Plusieurs milliers d'euros en jeu.
  - P0 Critique · Moyenne · 0,5 j · J+7 · Responsable : Les deux
  - Prérequis : aucun
  - Outils : France Travail, URSSAF, Initiative Gironde · Coût : 0 €
  - Livrable : Liste des aides éligibles + démarches datées
- [ ] **FIN-01 · Budget de lancement**
  - Juridique, assurances, outils, marketing, matériel (photo, boîtes à clés, kit ménage), stock tampon, déplacements, réserve de sécurité. Voir l'onglet Finance.
  - Pourquoi : Savoir combien il faut avant de dépenser.
  - P0 Critique · Facile · 0,5 j · J+12 · Responsable : Moi
  - Prérequis : STR-06
  - Outils : Tableur · Coût : 0 €
  - Livrable : Budget de lancement
- [ ] **FIN-02 · Prévisionnel 36 mois**
  - Hypothèses : logements signés par mois, revenu moyen par logement, commission, taux de départ, charges, rémunérations, embauches.
  - Pourquoi : Base des décisions et de tout financement.
  - P0 Critique · Moyenne · 1 j · J+15 · Responsable : Moi
  - Prérequis : FIN-01
  - Outils : Tableur, skill startup-strategy · Coût : 0 €
  - Livrable : Prévisionnel validé
- [ ] **FIN-03 · Plan de trésorerie mensuel**
  - Encaissements réels (date de versement des plateformes + délai de prélèvement de la commission) et décaissements.
  - Pourquoi : On meurt de trésorerie, pas de rentabilité.
  - P0 Critique · Moyenne · 0,5 j · J+18 · Responsable : Moi
  - Prérequis : FIN-02
  - Outils : Tableur · Coût : 0 €
  - Livrable : Plan de trésorerie 12 mois
- [ ] **FIN-04 · Seuil de rentabilité**
  - Nombre de logements nécessaires pour couvrir charges fixes puis rémunérations (calculateur dans l'onglet Finance).
  - Pourquoi : Donne l'objectif commercial concret.
  - P0 Critique · Facile · 1 h · J+18 · Responsable : Moi
  - Prérequis : FIN-02
  - Outils : Calculateur · Coût : 0 €
  - Livrable : Objectif de logements chiffré
- [ ] **FIN-06 · Politique de rémunération des fondateurs**
  - Quand et combien vous vous rémunérez, compatible avec les aides et la trésorerie.
  - Pourquoi : Évite les tensions entre associés et les mauvaises surprises sociales.
  - P1 Haute · Moyenne · 1 h · J+30 · Responsable : Les deux
  - Prérequis : FIN-02, FIS-02
  - Outils : Expert-comptable · Coût : 0 €
  - Livrable : Règle écrite
- [ ] **FIN-07 · Prix des refacturations**
  - Linge par séjour, welcome box, consommables, interventions : coût réel + marge, règle écrite.
  - Pourquoi : Souvent vendus à perte par oubli des coûts cachés (trajets, temps de préparation).
  - P1 Haute · Facile · 2 h · J+40 · Responsable : Les deux
  - Prérequis : STR-06, OPS-14
  - Outils : Tableur · Coût : 0 €
  - Livrable : Grille de refacturation
- [ ] **FIN-08 · Revue financière mensuelle**
  - Chaque début de mois : réel vs prévisionnel, marge par logement, trésorerie à 90 jours, décisions.
  - Pourquoi : Pilotage régulier = pas de mauvaise surprise.
  - P1 Haute · Facile · 1 h/mois · J+60 · Responsable : Les deux
  - Prérequis : FIN-03
  - Outils : Onglet Tableau de bord · Coût : 0 €
  - Livrable : Compte rendu mensuel

**Vérifications avant de clore la catégorie**

- [ ] Budget de lancement chiffré et financé
- [ ] Prévisionnel 36 mois partagé avec l'expert-comptable
- [ ] Seuil de rentabilité connu en nombre de logements
- [ ] Démarches d'aides faites dans les délais

**Erreurs fréquentes**

- Sous-estimer le décalage de trésorerie : les commissions arrivent après les séjours alors que linge et équipements sont achetés avant.
- Oublier la saisonnalité bordelaise : janvier-février sont faibles, printemps-été et grands événements sont forts.

**Optimisations**

- Faites financer le premier stock de linge par le propriétaire (pack d'entrée) : c'est la norme du marché.

## Phase 2 : Outils & opérations (J10 → J60)

### OUT · Outils (stack logicielle)

_Choisir et relier les outils. Le channel manager est traité dans la catégorie Plateformes._

- [ ] **OUT-01 · Cartographier la stack cible**
  - Tableau : besoin, outil retenu, alternative, coût mensuel, qui administre, connexions (API, webhook, iCal, Make).
  - Pourquoi : Évite les doublons et les trous entre outils.
  - P0 Critique · Moyenne · 0,5 j · J+15 · Responsable : Moi
  - Prérequis : STR-06
  - Outils : Tableur, schéma · Coût : 0 €
  - Livrable : Schéma de la stack
- [ ] **OUT-02 · Ligne téléphonique et messagerie pro**
  - Numéro dédié (mobile pro ou téléphonie cloud partagée), WhatsApp Business, messagerie vocale, transfert pour l'astreinte.
  - Pourquoi : Le numéro sera sur Google, les annonces et les cartes : il doit être définitif.
  - P0 Critique · Facile · 1 h · J+7 · Responsable : Simon
  - Prérequis : aucun
  - Outils : Opérateur mobile, Aircall / Ringover / Onoff · Coût : ≈ 10 à 30 €/mois
  - Livrable : Numéro pro actif
- [ ] **OUT-03 · Tarification dynamique**
  - Outil connecté au channel manager, prix de base et minimum par logement, règles événements bordelais (Vinexpo, Fête du Vin, matchs, concerts), revue hebdomadaire.
  - Pourquoi : +10 à 20 % de revenus en moyenne par rapport à un prix fixe.
  - P1 Haute · Moyenne · 0,5 j · J+55 · Responsable : Moi
  - Prérequis : CHN-05
  - Outils : PriceLabs, Beyond, Wheelhouse · Coût : ≈ 20 €/logement/mois
  - Livrable : Pricing actif sur chaque logement
- [ ] **OUT-04 · Outil de gestion des ménages**
  - Module du back-office ou du channel manager, ou outil dédié : mission créée à chaque départ, checklist photo, validation.
  - Pourquoi : Le ménage est l'étape qui fait la note voyageur.
  - P1 Haute · Moyenne · 0,5 j · J+45 · Responsable : Simon
  - Prérequis : CHN-01, BO-01
  - Outils : Back-office, Turno, Breezeway · Coût : 0 à 10 €/logement/mois
  - Livrable : Outil choisi et paramétré
- [ ] **OUT-05 · Serrures connectées et boîtes à clés**
  - Standard par type de logement : serrure connectée (codes générés par réservation), boîte à clés à code, ou point relais de clés.
  - Pourquoi : Permet le check-in autonome et supprime les rendez-vous tardifs.
  - P1 Haute · Moyenne · 0,5 j · J+40 · Responsable : Simon
  - Prérequis : SEC-05
  - Outils : Nuki, Igloohome, boîtes à code, KeyNest · Coût : ≈ 50 à 300 € par logement (propriétaire)
  - Livrable : Standard d'accès par type de logement
- [ ] **OUT-06 · Livret d'accueil digital**
  - Livret multilingue par logement : accès, wifi, équipements, règles, tri des déchets, transports (tram), bonnes adresses.
  - Pourquoi : Réduit fortement les questions des voyageurs.
  - P1 Haute · Facile · 1 j · J+45 · Responsable : Simon
  - Prérequis : OPS-10
  - Outils : Page du back-office, Touch Stay, Hostfully · Coût : 0 à 10 €/logement/mois
  - Livrable : Modèle de livret + 1 exemple complet
- [ ] **OUT-07 · Check-in en ligne**
  - Vérification d'identité, fiche de police, taxe de séjour (réservations directes), dépôt de garantie.
  - Pourquoi : Conformité et sécurité sans effort manuel.
  - P2 Moyenne · Moyenne · 0,5 j · J+60 · Responsable : Moi
  - Prérequis : REG-04
  - Outils : Chekin · Coût : ≈ 2 à 5 €/logement/mois
  - Livrable : Check-in en ligne actif
- [ ] **OUT-08 · Signature électronique**
  - Envoi du contrat, des annexes et du mandat SEPA en un seul parcours ; archivage.
  - Pourquoi : Signer le jour du rendez-vous, sans impression.
  - P0 Critique · Facile · 1 h · J+35 · Responsable : Moi
  - Prérequis : LEG-03
  - Outils : Yousign · Coût : ≈ 10 à 30 €/mois
  - Livrable : Modèle de parcours de signature
- [ ] **OUT-09 · Outils de contenu**
  - Canva (templates), retouche photo, bibliothèque de visuels.
  - Pourquoi : Supports cohérents produits vite.
  - P2 Moyenne · Facile · 1 h · J+30 · Responsable : Simon
  - Prérequis : COM-02
  - Outils : Canva Pro, Lightroom · Coût : ≈ 12 à 25 €/mois
  - Livrable : Comptes et kit de marque importé
- [ ] **OUT-10 · Capteurs de bruit (option)**
  - Capteurs de décibels et d'occupation sans micro ni caméra, conformes RGPD, proposés aux propriétaires.
  - Pourquoi : Prévient les fêtes, argument rassurant pour les propriétaires.
  - P3 Plus tard · Facile · 1 h · J+90 · Responsable : Simon
  - Prérequis : CHN-05
  - Outils : Minut · Coût : ≈ 10 €/logement/mois
  - Livrable : Offre capteur

**Vérifications avant de clore la catégorie**

- [ ] Schéma de la stack à jour (outil, usage, coût, compte propriétaire, connexions)
- [ ] Chaque outil est sur un compte au nom de la société, avec 2FA
- [ ] Ligne téléphonique pro joignable 7 j/7

**Erreurs fréquentes**

- Multiplier les outils avant d'avoir des logements : chaque abonnement se paie tous les mois.

**Optimisations**

- Vérifiez que chaque outil a une API ou des webhooks : c'est la condition pour l'automatiser et le brancher au back-office.

### GOO · Google

_Workspace, Business Profile, Analytics, Tag Manager, Search Console, Maps et avis._

- [ ] **GOO-01 · Nom de domaine et Google Workspace**
  - Domaine définitif, Workspace, adresses nominatives + alias (contact@, proprietaires@, voyageurs@, factures@) ou groupes partagés.
  - Pourquoi : Crédibilité et séparation claire des flux.
  - P0 Critique · Facile · 2 h · J+5 · Responsable : Moi
  - Prérequis : STR-01
  - Outils : Registrar, Google Workspace · Coût : ≈ 7 à 14 €/utilisateur/mois + domaine ≈ 10 €/an
  - Livrable : Boîtes mail actives
- [ ] **GOO-02 · Signature e-mail**
  - Nom, rôle, téléphone, site, logo léger, lien de prise de rendez-vous ; identique pour les deux associés.
  - Pourquoi : Chaque e-mail devient un support commercial.
  - P1 Haute · Facile · 30 min · J+15 · Responsable : Moi
  - Prérequis : GOO-01, COM-01
  - Outils : Gmail · Coût : 0 €
  - Livrable : Signatures en place
- [ ] **GOO-03 · Google Business Profile**
  - Entreprise de services avec zone desservie (Bordeaux Métropole), adresse masquée si domicile, catégorie principale la plus proche de « service de conciergerie », services détaillés avec prix, photos, horaires, lien RDV, validation (souvent par vidéo).
  - Pourquoi : Premier canal de prospects entrants locaux, gratuit.
  - P0 Critique · Facile · 2 h + délai de validation · J+30 · Responsable : Simon
  - Prérequis : JUR-06, COM-01, OUT-02
  - Outils : business.google.com · Coût : 0 €
  - Livrable : Fiche validée et complète
- [ ] **GOO-04 · Google Tag Manager + Consent Mode v2**
  - Conteneur installé, déclenchement conditionné au consentement, variables et déclencheurs pour les conversions.
  - Pourquoi : Mesure fiable et conforme.
  - P0 Critique · Moyenne · 2 h · J+34 · Responsable : Moi
  - Prérequis : LEG-07
  - Outils : Google Tag Manager · Coût : 0 €
  - Livrable : Conteneur publié
- [ ] **GOO-05 · Google Analytics 4**
  - Propriété, flux web, événements clés (demande d'estimation, clic téléphone, clic WhatsApp, RDV pris), exclusion du trafic interne, liaison Search Console.
  - Pourquoi : Savoir quels canaux apportent des propriétaires.
  - P0 Critique · Moyenne · 2 h · J+36 · Responsable : Moi
  - Prérequis : GOO-04
  - Outils : GA4 · Coût : 0 €
  - Livrable : Conversions visibles dans GA4
- [ ] **GOO-06 · Google Search Console**
  - Validation par DNS (propriété domaine), sitemap soumis, inspection des pages clés, suivi Core Web Vitals.
  - Pourquoi : Indexation et diagnostic SEO.
  - P0 Critique · Facile · 1 h · J+36 · Responsable : Moi
  - Prérequis : SIT-06
  - Outils : Search Console · Coût : 0 €
  - Livrable : Propriété validée + sitemap
- [ ] **GOO-07 · Prise de rendez-vous en ligne**
  - Page de réservation « Estimation gratuite » (Google Agenda ou Cal.com), créneaux des deux associés, rappel automatique.
  - Pourquoi : Supprime les allers-retours pour fixer un RDV.
  - P1 Haute · Facile · 1 h · J+20 · Responsable : Simon
  - Prérequis : GOO-01
  - Outils : Google Agenda, Cal.com, Calendly · Coût : 0 à 12 €/mois
  - Livrable : Lien de RDV actif
- [ ] **GOO-08 · Google Maps Platform (si utilisé sur le site)**
  - Clé API restreinte au domaine, budget et alertes de facturation, chargement différé de la carte.
  - Pourquoi : Évite une facture surprise et une page lente.
  - P2 Moyenne · Moyenne · 1 h · J+40 · Responsable : Moi
  - Prérequis : SIT-06
  - Outils : Google Cloud Console · Coût : Crédit mensuel gratuit puis à l'usage
  - Livrable : Clé restreinte + alerte budget
- [ ] **GOO-09 · Process de collecte d'avis Google**
  - Lien court et QR code, message type, moment de demande (après le premier relevé ou un premier mois réussi), réponse à chaque avis sous 48 h.
  - Pourquoi : Les avis déterminent le classement local et la confiance.
  - P1 Haute · Facile · 1 h · J+45 · Responsable : Simon
  - Prérequis : GOO-03
  - Outils : GBP, automatisation · Coût : 0 €
  - Livrable : Process + message type

**Vérifications avant de clore la catégorie**

- [ ] Adresses pro fonctionnelles en envoi et réception
- [ ] Fiche Google Business Profile validée et complète
- [ ] GA4 reçoit les conversions (formulaire, appel, RDV) après consentement
- [ ] Search Console : sitemap soumis, aucune erreur d'indexation bloquante

**Erreurs fréquentes**

- Mettre une adresse de domicile visible sur Google Business Profile : choisissez « zone desservie » et masquez l'adresse.
- Mots-clés dans le nom de la fiche Google (« Comme à la maison conciergerie Airbnb Bordeaux ») : motif de suspension.

**Optimisations**

- Les avis Google des propriétaires sont votre meilleur levier SEO local : demandez-les systématiquement au premier relevé réussi.

### CHN · Plateformes & channel manager (Airbnb, Booking, Abritel)

_Le cœur technique de l'exploitation. Point clé : l'API Airbnb n'est ouverte qu'aux éditeurs partenaires. Votre back-office se connecte donc au channel manager, pas directement à Airbnb._

- [ ] **CHN-01 · Choisir le channel manager / PMS**
  - Critères : connexion API officielle Airbnb, Booking et Vrbo ; messagerie unifiée ; automatisations ; gestion des ménages ; portail propriétaire ; API et webhooks pour votre back-office ; prix par logement ; support en français. Faire 2 ou 3 démos et un essai.
  - Pourquoi : Choix structurant, coûteux à changer après 20 logements.
  - P0 Critique · Moyenne · 2 à 3 j · J+22 · Responsable : Moi
  - Prérequis : OUT-01
  - Outils : Hostaway, Guesty, Smoobu, Lodgify, Beds24, Hospitable · Coût : ≈ 10 à 40 €/logement/mois
  - Livrable : Outil choisi + grille de comparaison
- [ ] **CHN-02 · Compte Airbnb de la conciergerie et co-hôte**
  - Profil soigné (photos des associés, présentation, identité vérifiée), procédure d'invitation co-hôte par le propriétaire, niveaux de permission, répartition des versements au co-hôte si disponible.
  - Pourquoi : Base du modèle sans carte G.
  - P0 Critique · Facile · 2 h · J+25 · Responsable : Moi
  - Prérequis : JUR-06
  - Outils : Airbnb · Coût : 0 €
  - Livrable : Compte vérifié + procédure co-hôte
- [ ] **CHN-03 · Compte Booking.com**
  - Compte gestionnaire multi-établissements ou via le channel manager, vérification d'identité et bancaire, paramètres de paiement, commission (≈ 15 à 18 %).
  - Pourquoi : Clientèle différente (affaires, internationale) et hors-saison.
  - P1 Haute · Moyenne · 0,5 j + délai de validation · J+45 · Responsable : Moi
  - Prérequis : JUR-06
  - Outils : Booking extranet · Coût : Commission sur réservation
  - Livrable : Compte actif
- [ ] **CHN-04 · Compte Abritel / Vrbo**
  - Via le channel manager, paramètres de paiement et de caution.
  - Pourquoi : Clientèle familiale et longues durées ; utile pour les maisons.
  - P2 Moyenne · Facile · 2 h · J+75 · Responsable : Moi
  - Prérequis : CHN-01, JUR-06
  - Outils : Vrbo · Coût : Commission sur réservation
  - Livrable : Compte actif
- [ ] **CHN-05 · Connecter Airbnb au channel manager**
  - Connexion API, import des annonces existantes (sans recréation), mapping des tarifs et des règles.
  - Pourquoi : Condition de la synchronisation et des automatisations.
  - P0 Critique · Moyenne · 0,5 j · J+30 · Responsable : Moi
  - Prérequis : CHN-01, CHN-02
  - Outils : Channel manager · Coût : Inclus
  - Livrable : Connexion active
- [ ] **CHN-06 · Connecter Booking et Vrbo au channel manager**
  - Mapping des types de chambre, tarifs, restrictions, politique d'annulation.
  - Pourquoi : Diffusion multi-canal sans double saisie.
  - P1 Haute · Moyenne · 0,5 j · J+50 · Responsable : Moi
  - Prérequis : CHN-05, CHN-03
  - Outils : Channel manager · Coût : Inclus
  - Livrable : Connexions actives
- [ ] **CHN-07 · Tester la synchronisation des calendriers**
  - Réserver ou bloquer sur un canal, vérifier le blocage sur les autres ; tester annulation et modification ; mesurer le délai.
  - Pourquoi : Le surbooking est l'erreur la plus coûteuse (relogement, pénalités, avis).
  - P0 Critique · Moyenne · 2 h · J+35 · Responsable : Les deux
  - Prérequis : CHN-05
  - Outils : Channel manager · Coût : 0 €
  - Livrable : Procès-verbal de test
- [ ] **CHN-08 · Standard d'annonce « Comme à la maison »**
  - Structure de titre, description, points forts, règles, équipements, informations d'arrivée, traductions, numéro d'enregistrement, ordre des photos.
  - Pourquoi : Qualité homogène et optimisation du classement.
  - P1 Haute · Moyenne · 1 j · J+35 · Responsable : Simon
  - Prérequis : STR-07, LEG-09
  - Outils : Google Docs, IA de rédaction · Coût : 0 €
  - Livrable : Modèle d'annonce + checklist
- [ ] **CHN-09 · Messages automatiques voyageurs**
  - Confirmation, J-3 instructions, jour J codes et accès, lendemain « tout va bien ? », veille du départ, après départ remerciement et avis. FR et EN minimum.
  - Pourquoi : Réponse rapide et homogène sans être collé au téléphone.
  - P0 Critique · Facile · 0,5 j · J+38 · Responsable : Simon
  - Prérequis : CHN-01, OPS-06
  - Outils : Channel manager · Coût : Inclus
  - Livrable : Séquence de messages active
- [ ] **CHN-10 · Paramètres de réservation types**
  - Délai de préavis, durée minimum, réservation instantanée, politique d'annulation, frais de ménage, voyageurs supplémentaires, réductions semaine et mois.
  - Pourquoi : Ces réglages pèsent autant que le prix sur le taux d'occupation.
  - P1 Haute · Facile · 2 h · J+35 · Responsable : Moi
  - Prérequis : STR-06
  - Outils : Channel manager · Coût : 0 €
  - Livrable : Paramètres par défaut documentés
- [ ] **CHN-11 · Réservation directe**
  - Moteur de réservation du channel manager ou du site, paiement Stripe, caution, CGV voyageurs, taxe de séjour.
  - Pourquoi : Supprime la commission plateforme pour les voyageurs qui reviennent.
  - P3 Plus tard · Difficile · 2 j · J+150 · Responsable : Moi
  - Prérequis : LEG-10, BNK-03
  - Outils : Channel manager, Stripe · Coût : Variable
  - Livrable : Réservation directe en ligne

**Vérifications avant de clore la catégorie**

- [ ] Test de surbooking réussi : une réservation sur un canal bloque les autres en moins de 5 minutes
- [ ] Messages automatiques testés de la confirmation à la demande d'avis
- [ ] Chaque annonce affiche le numéro d'enregistrement
- [ ] Aucune annonce existante recréée (avis conservés)

**Erreurs fréquentes**

- Recréer l'annonce d'un propriétaire qui a déjà des avis : il perd son historique et son classement.
- Synchroniser par iCal entre plateformes : délai de 30 minutes à plusieurs heures, donc risque de double réservation.
- Démarcher des hôtes via la messagerie Airbnb : interdit par les conditions de la plateforme.

**Optimisations**

- Commencez par Airbnb seul sur les premiers logements, puis ajoutez Booking une fois les process rodés.

### BO · Back-office

_Vérifier que le back-office couvre le fonctionnement réel, qu'il est sécurisé et relié aux autres outils._

- [ ] **BO-01 · Inventaire des fonctionnalités vs processus**
  - Pour chaque étape de la cartographie (OPS-01) : existe dans le back-office, existe dans le channel manager, manquant. Prioriser les manques.
  - Pourquoi : Éviter de découvrir un trou le jour du premier voyageur.
  - P0 Critique · Moyenne · 1 j · J+25 · Responsable : Moi
  - Prérequis : OPS-01
  - Outils : Back-office, tableur · Coût : 0 €
  - Livrable : Matrice de couverture + backlog priorisé
- [ ] **BO-02 · Rôles et permissions**
  - Admin, opérations (Simon), prestataire (ses missions uniquement), propriétaire (ses logements en lecture). Tester chaque rôle avec un compte réel.
  - Pourquoi : Un prestataire ne doit jamais voir les codes des autres logements.
  - P0 Critique · Difficile · 1 j · J+38 · Responsable : Moi
  - Prérequis : BO-01, SEC-06
  - Outils : Supabase RLS · Coût : 0 €
  - Livrable : Matrice des droits testée
- [ ] **BO-03 · Connexion au channel manager**
  - API ou webhooks : réservations, annulations, calendrier, voyageurs. En attendant : import iCal en lecture seule.
  - Pourquoi : Supprime la double saisie et les oublis de ménage.
  - P0 Critique · Difficile · 2 à 4 j · J+40 · Responsable : Moi
  - Prérequis : CHN-01, BO-01
  - Outils : API du channel manager, Supabase Edge Functions · Coût : 0 €
  - Livrable : Réservations synchronisées
- [ ] **BO-04 · Fiche logement complète**
  - Accès et codes (chiffrés), wifi, compteurs, poubelles et jours de collecte, équipements, photos de référence du rangement, inventaire, contacts d'urgence, particularités.
  - Pourquoi : Un remplaçant doit pouvoir intervenir sans appeler personne.
  - P0 Critique · Moyenne · 1 j · J+35 · Responsable : Simon
  - Prérequis : BO-01
  - Outils : Back-office · Coût : 0 €
  - Livrable : Modèle de fiche + 1 fiche remplie
- [ ] **BO-05 · Relevés et factures propriétaires automatiques**
  - Génération PDF mensuelle à partir des réservations et dépenses, validation, envoi, prélèvement.
  - Pourquoi : Tâche la plus chronophage et la plus sensible à 30 logements.
  - P0 Critique · Difficile · 2 à 3 j · J+55 · Responsable : Moi
  - Prérequis : CPT-04, BO-03
  - Outils : Back-office, logiciel de facturation · Coût : 0 €
  - Livrable : Relevé généré sur données de test
- [ ] **BO-06 · Planning ménage automatique**
  - Départ → mission → prestataire notifié → checklist photo → validation → logement « prêt ». Alerte si non validé 2 h avant l'arrivée suivante.
  - Pourquoi : Aucun voyageur ne doit arriver dans un logement non préparé.
  - P0 Critique · Difficile · 2 j · J+45 · Responsable : Moi
  - Prérequis : BO-03, OPS-02
  - Outils : Back-office · Coût : 0 €
  - Livrable : Flux ménage fonctionnel
- [ ] **BO-07 · Incidents et maintenance**
  - Ticket avec photos, priorité, coût, accord du propriétaire au-delà du plafond, suivi jusqu'à clôture, historique par logement.
  - Pourquoi : Traçabilité des dépenses refacturées.
  - P1 Haute · Moyenne · 1 j · J+50 · Responsable : Moi
  - Prérequis : BO-01
  - Outils : Back-office · Coût : 0 €
  - Livrable : Module incidents
- [ ] **BO-08 · Environnement de test et données de démo**
  - Base de staging séparée, données fictives, aucune donnée réelle en test.
  - Pourquoi : Tester sans risquer la production.
  - P1 Haute · Moyenne · 0,5 j · J+35 · Responsable : Moi
  - Prérequis : BO-01
  - Outils : Supabase branches / projet séparé · Coût : 0 à 25 €/mois
  - Livrable : Staging opérationnel
- [ ] **BO-09 · Journal d'audit et droits RGPD**
  - Historique des modifications sensibles, export des données d'une personne, suppression.
  - Pourquoi : Litiges et demandes RGPD.
  - P2 Moyenne · Moyenne · 1 j · J+75 · Responsable : Moi
  - Prérequis : BO-02
  - Outils : Back-office · Coût : 0 €
  - Livrable : Audit log + export
- [ ] **BO-10 · Espace propriétaire**
  - Calendrier, revenus, relevés, documents, demandes.
  - Pourquoi : Moins d'appels « où en est mon logement ? », image professionnelle.
  - P2 Moyenne · Moyenne · 2 j · J+90 · Responsable : Moi
  - Prérequis : BO-05
  - Outils : Back-office · Coût : 0 €
  - Livrable : Portail propriétaire
- [ ] **BO-11 · Tableau de bord KPI dans le back-office**
  - Reprendre les KPI de l'onglet Tableau de bord, alimentés automatiquement.
  - Pourquoi : Pilotage sans ressaisie.
  - P2 Moyenne · Moyenne · 1 j · J+90 · Responsable : Moi
  - Prérequis : BO-03
  - Outils : Back-office · Coût : 0 €
  - Livrable : Dashboard automatique

**Vérifications avant de clore la catégorie**

- [ ] Chaque processus de la cartographie a son écran ou son automatisation
- [ ] Chaque rôle ne voit que ses données (testé avec de vrais comptes)
- [ ] Environnement de test séparé de la production
- [ ] Relevés propriétaires générés sans retouche manuelle

**Erreurs fréquentes**

- Développer des fonctions que le channel manager fait déjà : concentrez le back-office sur ce qui vous différencie (propriétaires, qualité, relevés, pilotage).

**Optimisations**

- Ajoutez un journal d'audit dès maintenant : en cas de litige, vous saurez qui a fait quoi et quand.

### OPS · Organisation, process & guides

_Tout ce qui permet de gérer 50 logements sans désorganisation : processus écrits, checklists et guides._

- [ ] **OPS-01 · Cartographier les processus**
  - Cycle séjour (réservation → messages → ménage → arrivée → séjour → départ → contrôle → avis), cycle propriétaire (prospect → onboarding → mise en ligne → suivi → fin), incidents, facturation.
  - Pourquoi : Base du back-office, des automatisations et des guides.
  - P0 Critique · Moyenne · 1 j · J+15 · Responsable : Les deux
  - Prérequis : STR-03
  - Outils : Miro, Whimsical, papier · Coût : 0 €
  - Livrable : Schéma des processus
- [ ] **OPS-02 · Checklist ménage**
  - Par pièce, points de contrôle, photos obligatoires, contrôle du stock de consommables, signalement des dégâts, durée cible par type de logement.
  - Pourquoi : La propreté est le premier critère des avis.
  - P0 Critique · Facile · 0,5 j · J+25 · Responsable : Simon
  - Prérequis : OPS-01
  - Outils : Back-office · Coût : 0 €
  - Livrable : Checklist ménage
- [ ] **OPS-03 · Checklist arrivée**
  - Veille de l'arrivée (ménage validé, code généré, message envoyé), jour J (vérification, accueil physique si prévu), après l'arrivée.
  - Pourquoi : Le check-in raté est la deuxième source de mauvais avis.
  - P0 Critique · Facile · 2 h · J+25 · Responsable : Simon
  - Prérequis : OPS-01
  - Outils : Back-office · Coût : 0 €
  - Livrable : Checklist arrivée
- [ ] **OPS-04 · Checklist départ**
  - Vérification de l'état, photos, objets oubliés, dégâts, déclaration à la plateforme dans les délais (AirCover : 14 jours), compteur de consommables.
  - Pourquoi : Sans preuve datée, pas d'indemnisation.
  - P0 Critique · Facile · 2 h · J+25 · Responsable : Simon
  - Prérequis : OPS-01
  - Outils : Back-office · Coût : 0 €
  - Livrable : Checklist départ
- [ ] **OPS-05 · Checklist maintenance préventive**
  - Mensuelle : détecteurs, ampoules, joints, bouchons, piles. Trimestrielle : électroménager, filtres, literie. Annuelle : chaudière, peinture, remplacement du linge.
  - Pourquoi : Évite les pannes pendant un séjour.
  - P1 Haute · Facile · 2 h · J+45 · Responsable : Simon
  - Prérequis : OPS-01
  - Outils : Back-office · Coût : 0 €
  - Livrable : Checklist + planning
- [ ] **OPS-06 · Bibliothèque de messages voyageurs**
  - Messages types FR/EN : avant séjour, accès, wifi, retard, départ tardif, problème, plainte, remerciement ; FAQ voyageurs.
  - Pourquoi : Temps de réponse court et ton homogène.
  - P0 Critique · Facile · 0,5 j · J+30 · Responsable : Simon
  - Prérequis : OPS-01
  - Outils : Channel manager · Coût : 0 €
  - Livrable : Bibliothèque de messages
- [ ] **OPS-07 · Procédures d'urgence**
  - Dégât des eaux, panne électrique, serrure bloquée, voyageur bloqué dehors, fête ou nuisance, plainte de voisin, vol, blessure, voyageur qui refuse de partir. Qui appeler, dans quel ordre, avec quels numéros.
  - Pourquoi : Garder son calme à 23 h un samedi.
  - P0 Critique · Moyenne · 0,5 j · J+35 · Responsable : Les deux
  - Prérequis : OPS-01, OPS-17
  - Outils : Wiki · Coût : 0 €
  - Livrable : Fiches réflexes
- [ ] **OPS-08 · Organisation de l'astreinte**
  - Planning (qui répond quand), objectif de temps de réponse (< 15 min de 8 h à 22 h), urgences la nuit, relais pendant les congés.
  - Pourquoi : Le temps de réponse conditionne le classement et les avis.
  - P0 Critique · Facile · 1 h · J+35 · Responsable : Les deux
  - Prérequis : OUT-02
  - Outils : Agenda partagé · Coût : 0 €
  - Livrable : Planning d'astreinte
- [ ] **OPS-09 · Guide propriétaire**
  - Comment on travaille, ce qui est inclus ou non, préparer le logement, équipements requis, calendrier et blocages, relevés, fiscalité (orientation), fin de contrat.
  - Pourquoi : Aligne les attentes dès le départ.
  - P1 Haute · Facile · 1 j · J+45 · Responsable : Simon
  - Prérequis : LEG-03, OPS-13
  - Outils : Google Docs / Canva · Coût : 0 €
  - Livrable : Guide PDF
- [ ] **OPS-10 · Guide voyageur (contenu)**
  - Arrivée, accès, wifi, équipements, règles, tri des déchets de Bordeaux Métropole, transports (tram, V3), parking, bonnes adresses, urgences.
  - Pourquoi : Contenu du livret d'accueil digital.
  - P0 Critique · Facile · 1 j · J+35 · Responsable : Simon
  - Prérequis : LEG-09
  - Outils : Google Docs · Coût : 0 €
  - Livrable : Modèle de guide FR / EN
- [ ] **OPS-11 · Guide prestataire**
  - Standards de qualité, checklists, application, photos, clés, paiement, comportement, confidentialité.
  - Pourquoi : Qualité homogène quel que soit le prestataire.
  - P1 Haute · Facile · 0,5 j · J+40 · Responsable : Simon
  - Prérequis : OPS-02, LEG-05
  - Outils : Google Docs, vidéos · Coût : 0 €
  - Livrable : Guide prestataire
- [ ] **OPS-12 · Guide employé**
  - Accueil, outils, accès, processus, astreinte, règles internes. Prêt avant la première embauche.
  - Pourquoi : Divise par deux le temps de formation.
  - P3 Plus tard · Facile · 1 j · J+120 · Responsable : Moi
  - Prérequis : OPS-19
  - Outils : Wiki · Coût : 0 €
  - Livrable : Guide employé
- [ ] **OPS-13 · Standard d'équipement d'un logement**
  - Literie et protège-matelas, 3 jeux de linge par lit, serviettes, cuisine, consommables de départ, produits d'accueil, kit de secours, adaptateurs. Liste chiffrée pour le propriétaire.
  - Pourquoi : Qualité homogène et moins de pannes « il manque… ».
  - P0 Critique · Facile · 0,5 j · J+25 · Responsable : Simon
  - Prérequis : STR-06
  - Outils : Tableur · Coût : Payé par le propriétaire
  - Livrable : Liste d'équipement chiffrée
- [ ] **OPS-14 · Organisation du linge**
  - Lavage interne, blanchisserie professionnelle bordelaise ou location de linge ; stock tampon ; traçabilité par logement ; coût par séjour.
  - Pourquoi : Poste logistique le plus lourd après le ménage.
  - P0 Critique · Moyenne · 1 j · J+35 · Responsable : Simon
  - Prérequis : OPS-13
  - Outils : Devis blanchisseries · Coût : ≈ 8 à 20 € par set et par séjour
  - Livrable : Fournisseur choisi + coût par séjour
- [ ] **OPS-15 · Welcome Box**
  - Contenu (produits locaux, canelés, café, eau, mot de bienvenue), fournisseurs, coût, stockage, refacturation ou inclusion.
  - Pourquoi : Effet « waouh » dans les avis pour un coût maîtrisé.
  - P2 Moyenne · Facile · 0,5 j · J+50 · Responsable : Simon
  - Prérequis : COM-02
  - Outils : Fournisseurs locaux · Coût : ≈ 5 à 15 € par séjour
  - Livrable : Composition + fournisseurs
- [ ] **OPS-16 · Recruter le réseau de prestataires ménage**
  - Au moins 2 par zone + 1 remplaçant ; entretien, ménage test payé, contrat, formation sur checklist, tarif par type de logement.
  - Pourquoi : Sans prestataires fiables, pas de croissance.
  - P0 Critique · Moyenne · 1 à 2 sem. · J+40 · Responsable : Simon
  - Prérequis : LEG-05, OPS-02
  - Outils : Indeed, réseaux locaux, bouche-à-oreille · Coût : ≈ 20 à 30 € de l'heure ou forfait par ménage
  - Livrable : Réseau de prestataires sous contrat
- [ ] **OPS-17 · Réseau d'artisans**
  - Plombier, électricien, serrurier, bricoleur, vitrier : tarifs négociés, délai d'intervention, disponibilité le week-end.
  - Pourquoi : Réactivité en cas de panne pendant un séjour.
  - P1 Haute · Facile · 1 sem. · J+30 · Responsable : Simon
  - Prérequis : STR-04
  - Outils : Annuaire interne · Coût : 0 €
  - Livrable : Annuaire artisans
- [ ] **OPS-18 · Stock et logistique**
  - Lieu de stockage (cave, garage, box), consommables, kit de dépannage par logement, réassort, véhicule.
  - Pourquoi : Évite les allers-retours inutiles.
  - P1 Haute · Facile · 0,5 j · J+45 · Responsable : Simon
  - Prérequis : OPS-13
  - Outils : Tableur ou back-office · Coût : 0 à 100 €/mois
  - Livrable : Stock organisé + seuils de réassort
- [ ] **OPS-19 · Documentation centralisée**
  - Wiki unique (procédures, checklists, guides, vidéos), datée, avec propriétaire de chaque page et revue trimestrielle.
  - Pourquoi : Une seule source de vérité.
  - P1 Haute · Facile · 1 j · J+50 · Responsable : Moi
  - Prérequis : OPS-02, OPS-07
  - Outils : Notion, Google Drive · Coût : 0 à 10 €/mois
  - Livrable : Wiki en ligne
- [ ] **OPS-20 · Gestion des avis et des dommages**
  - Réponse à chaque avis sous 48 h, analyse des avis négatifs, plan d'action ; procédure de réclamation de dommages (preuves, délais, AirCover, Booking).
  - Pourquoi : Protège la note et la relation propriétaire.
  - P1 Haute · Facile · 2 h · J+45 · Responsable : Simon
  - Prérequis : OPS-04
  - Outils : Channel manager · Coût : 0 €
  - Livrable : Procédure avis et dommages

**Vérifications avant de clore la catégorie**

- [ ] Chaque processus a un responsable, une checklist et un modèle de message
- [ ] Au moins 2 prestataires ménage par zone + 1 remplaçant
- [ ] Procédures d'urgence testées
- [ ] Documentation centralisée, datée et accessible sur mobile

**Erreurs fréquentes**

- Tout garder en tête : ça tient jusqu'à 5 logements, puis tout casse.
- Un seul prestataire ménage : le jour où il est malade, vous faites les ménages vous-mêmes.
- Pas de photos de référence du rangement : chaque ménage laisse le logement différemment.

**Optimisations**

- Filmez chaque procédure en 2 minutes sur téléphone : c'est la formation la plus rapide pour les prestataires.

### AUT · Automatisations

_Automatiser tout ce qui est répétitif, avec une supervision humaine et une alerte en cas d'échec._

- [ ] **AUT-01 · Réservation → mission de ménage**
  - Nouvelle réservation ou modification : création ou mise à jour de la mission, notification au prestataire, rappel la veille.
  - Pourquoi : Aucun ménage oublié.
  - P0 Critique · Moyenne · 0,5 j · J+48 · Responsable : Moi
  - Prérequis : BO-06
  - Outils : Back-office, webhooks · Coût : 0 €
  - Livrable : Automatisation active
- [ ] **AUT-02 · Réservation → codes d'accès et messages**
  - Génération d'un code unique valable pendant le séjour, envoi au bon moment, révocation au départ.
  - Pourquoi : Sécurité et check-in autonome.
  - P1 Haute · Moyenne · 0,5 j · J+50 · Responsable : Moi
  - Prérequis : CHN-09, OUT-05
  - Outils : Channel manager, API serrure · Coût : 0 €
  - Livrable : Automatisation active
- [ ] **AUT-03 · Lead du site → CRM → rappel**
  - Formulaire : fiche CRM créée, accusé de réception au prospect, notification immédiate, tâche de rappel sous 2 h.
  - Pourquoi : Un prospect rappelé dans l'heure signe beaucoup plus souvent.
  - P0 Critique · Moyenne · 2 h · J+38 · Responsable : Moi
  - Prérequis : SIT-07, VEN-02
  - Outils : Back-office, Make / n8n · Coût : 0 à 10 €/mois
  - Livrable : Automatisation active
- [ ] **AUT-04 · Fin de mois → relevé, facture, prélèvement**
  - Génération, validation humaine en un clic, envoi, prélèvement SEPA, relance si échec.
  - Pourquoi : Zéro retard de facturation.
  - P1 Haute · Difficile · 1 j · J+60 · Responsable : Moi
  - Prérequis : BO-05, BNK-03
  - Outils : Back-office, Stripe · Coût : 0 €
  - Livrable : Automatisation active
- [ ] **AUT-05 · Départ → demande d'avis + satisfaction**
  - Message de remerciement, demande d'avis, formulaire de satisfaction interne pour capter les problèmes avant l'avis public.
  - Pourquoi : Plus d'avis, moins de mauvaises surprises.
  - P1 Haute · Facile · 2 h · J+45 · Responsable : Simon
  - Prérequis : CHN-09
  - Outils : Channel manager · Coût : 0 €
  - Livrable : Automatisation active
- [ ] **AUT-06 · Ménage validé → logement prêt → alerte si retard**
  - Statut « prêt » après validation des photos ; alerte si non prêt 2 h avant l'arrivée.
  - Pourquoi : Filet de sécurité avant chaque arrivée.
  - P1 Haute · Moyenne · 2 h · J+50 · Responsable : Moi
  - Prérequis : AUT-01
  - Outils : Back-office · Coût : 0 €
  - Livrable : Alerte active
- [ ] **AUT-07 · Alertes de pilotage**
  - Message voyageur sans réponse depuis 30 min, note inférieure à 4, surbooking détecté, plafond de nuitées proche, paiement échoué.
  - Pourquoi : Voir les problèmes avant le propriétaire.
  - P1 Haute · Moyenne · 0,5 j · J+60 · Responsable : Moi
  - Prérequis : BO-03, REG-03
  - Outils : Back-office, channel manager · Coût : 0 €
  - Livrable : Alertes actives
- [ ] **AUT-08 · Relances commerciales automatiques**
  - Séquence J+2, J+7, J+21, J+60 selon l'étape du pipeline, arrêt automatique dès réponse.
  - Pourquoi : La majorité des signatures arrive après plusieurs relances.
  - P1 Haute · Facile · 2 h · J+45 · Responsable : Moi
  - Prérequis : VEN-02, VEN-04
  - Outils : CRM · Coût : 0 €
  - Livrable : Séquences actives
- [ ] **AUT-09 · Supervision des automatisations**
  - Journal des exécutions, alerte en cas d'échec, revue mensuelle, documentation de chaque scénario.
  - Pourquoi : Une automatisation silencieusement cassée est pire qu'aucune.
  - P0 Critique · Moyenne · 2 h · J+55 · Responsable : Moi
  - Prérequis : AUT-01, AUT-03
  - Outils : Make / n8n, logs · Coût : 0 €
  - Livrable : Tableau des automatisations

**Vérifications avant de clore la catégorie**

- [ ] Chaque automatisation a un responsable et une alerte en cas d'échec
- [ ] Journal d'exécution consultable
- [ ] Test de bout en bout réalisé sur le logement pilote

**Erreurs fréquentes**

- Automatiser un processus pas encore stabilisé : vous automatisez les erreurs. Faites-le 10 fois à la main d'abord.

**Optimisations**

- Préférez les automatisations natives du channel manager ; utilisez Make ou n8n uniquement pour relier ce qu'il ne fait pas.

## Phase 3 : Visibilité (J10 → J60)

### SIT · Site internet (derniers réglages)

_Le site est presque fini : il reste à le rendre conforme, rapide, mesurable et à le mettre en production proprement._

- [ ] **SIT-01 · Audit fonctionnel complet**
  - Tous les liens, formulaires, e-mails transactionnels, page 404, affichage mobile et navigateurs, textes et fautes.
  - Pourquoi : Première impression d'un propriétaire.
  - P0 Critique · Facile · 0,5 j · J+10 · Responsable : Moi
  - Prérequis : aucun
  - Outils : Skill quality-gate, Playwright · Coût : 0 €
  - Livrable : Liste de corrections
- [ ] **SIT-02 · Contenus finaux**
  - Pages services, tarifs transparents, pages communes et quartiers, à propos avec photos et histoire, FAQ propriétaires, processus en étapes, témoignages dès qu'ils existent.
  - Pourquoi : Le contenu convertit et référence.
  - P0 Critique · Moyenne · 2 j · J+25 · Responsable : Les deux
  - Prérequis : STR-06, STR-07
  - Outils : CMS / code · Coût : 0 €
  - Livrable : Contenus validés en ligne
- [ ] **SIT-03 · Simulateur d'estimation de revenus**
  - Hypothèses réalistes par commune et type de bien (données marché), fourchette prudente, capture du lead et proposition de RDV.
  - Pourquoi : Votre meilleur générateur de leads, si les chiffres sont crédibles.
  - P0 Critique · Moyenne · 1 j · J+25 · Responsable : Moi
  - Prérequis : STR-06
  - Outils : AirDNA / PriceLabs Market Dashboard · Coût : 0 à 40 €/mois
  - Livrable : Simulateur calibré
- [ ] **SIT-04 · Performance (Core Web Vitals)**
  - Images WebP/AVIF dimensionnées, next/image, polices optimisées, scripts tiers différés, cache, rendu serveur.
  - Pourquoi : Vitesse = conversion + SEO.
  - P0 Critique · Moyenne · 1 j · J+30 · Responsable : Moi
  - Prérequis : SIT-02
  - Outils : Lighthouse, PageSpeed Insights · Coût : 0 €
  - Livrable : Rapport Lighthouse ≥ 90 mobile
- [ ] **SIT-05 · Accessibilité**
  - Contrastes, textes alternatifs, navigation clavier, libellés de formulaires, focus visible (niveau WCAG AA).
  - Pourquoi : Qualité, SEO, et public plus âgé parmi les propriétaires.
  - P1 Haute · Moyenne · 0,5 j · J+35 · Responsable : Moi
  - Prérequis : SIT-02
  - Outils : axe DevTools, Lighthouse · Coût : 0 €
  - Livrable : Corrections appliquées
- [ ] **SIT-06 · Domaine, HTTPS et environnements**
  - Domaine de production, redirection unique (www ou non), HTTPS forcé, HSTS, variables d'environnement de production, previews non indexées.
  - Pourquoi : Évite contenu dupliqué et failles.
  - P0 Critique · Moyenne · 2 h · J+20 · Responsable : Moi
  - Prérequis : GOO-01
  - Outils : Hébergeur (Vercel / Netlify), DNS · Coût : 0 à 20 €/mois
  - Livrable : Production sur le domaine final
- [ ] **SIT-07 · Formulaires robustes**
  - Anti-spam (honeypot, Turnstile), enregistrement en base, notification immédiate, accusé de réception au prospect, consentement RGPD.
  - Pourquoi : Aucun lead perdu.
  - P0 Critique · Moyenne · 0,5 j · J+32 · Responsable : Moi
  - Prérequis : SIT-06, LEG-06
  - Outils : Back-office, Turnstile · Coût : 0 €
  - Livrable : Formulaires testés
- [ ] **SIT-08 · Intégrer les pages légales**
  - Mentions légales, CGV, confidentialité, cookies dans le pied de page ; lien de gestion du consentement.
  - Pourquoi : Obligatoire avant ouverture.
  - P0 Critique · Facile · 1 h · J+34 · Responsable : Moi
  - Prérequis : LEG-01, LEG-02, LEG-06, LEG-07
  - Outils : Site · Coût : 0 €
  - Livrable : Pages en ligne
- [ ] **SIT-09 · Monitoring**
  - Surveillance de disponibilité, suivi des erreurs, alerte e-mail ou téléphone.
  - Pourquoi : Savoir que le site est tombé avant un prospect.
  - P1 Haute · Facile · 1 h · J+35 · Responsable : Moi
  - Prérequis : SIT-06
  - Outils : UptimeRobot / Better Stack, Sentry · Coût : 0 €
  - Livrable : Alertes actives
- [ ] **SIT-10 · Version anglaise des pages clés**
  - Pour les propriétaires expatriés ou étrangers : accueil, services, tarifs, contact.
  - Pourquoi : Cible à fort potentiel à Bordeaux.
  - P3 Plus tard · Facile · 1 j · J+90 · Responsable : Moi
  - Prérequis : SIT-11
  - Outils : i18n Next.js, IA + relecture · Coût : 0 €
  - Livrable : Pages EN
- [ ] **SIT-11 · Mise en production officielle**
  - Validation finale : tests passés, pages légales, analytics, Search Console, sitemap, monitoring.
  - Pourquoi : Le site devient un outil commercial.
  - P0 Critique · Facile · 2 h · J+40 · Responsable : Moi
  - Prérequis : SIT-01, SIT-03, SIT-04, SIT-07, SIT-08, SEO-02, GOO-05, TST-01
  - Outils : Checklist · Coût : 0 €
  - Livrable : Site officiel en ligne

**Vérifications avant de clore la catégorie**

- [ ] Lighthouse mobile ≥ 90 en performance, accessibilité, bonnes pratiques et SEO
- [ ] LCP < 2,5 s, INP < 200 ms, CLS < 0,1 sur les pages clés
- [ ] Chaque formulaire testé de bout en bout (base, e-mail, notification)
- [ ] Pages légales en ligne et liées dans le pied de page
- [ ] Monitoring et alertes actifs

**Erreurs fréquentes**

- Un simulateur de revenus trop optimiste : il attire des prospects qui seront déçus et partiront.
- Aucune photo de vous deux : une conciergerie vend de la confiance, montrez les visages.

**Optimisations**

- Une page par service et par commune couverte fait plus pour le SEO local qu'une longue page unique.

### SEO · Référencement (SEO)

_SEO technique, local et contenu, ciblé sur les propriétaires de Bordeaux Métropole._

- [ ] **SEO-01 · Recherche de mots-clés**
  - Conciergerie Airbnb Bordeaux, gestion location courte durée Bordeaux, conciergerie Mérignac / Talence / Pessac…, rentabilité Airbnb Bordeaux, réglementation. Un mot-clé principal par page.
  - Pourquoi : Écrire pour ce que les propriétaires cherchent vraiment.
  - P0 Critique · Facile · 0,5 j · J+15 · Responsable : Moi
  - Prérequis : STR-04
  - Outils : Search Console, Google Keyword Planner, outil SEO · Coût : 0 à 50 €
  - Livrable : Plan mot-clé → page
- [ ] **SEO-02 · SEO technique**
  - Titles et metas uniques, un H1 par page, sitemap.xml, robots.txt, canonicals, données structurées (LocalBusiness, Service, FAQPage, BreadcrumbList), Open Graph, 404 propre, pas de page de preview indexée.
  - Pourquoi : Fondation de la visibilité.
  - P0 Critique · Moyenne · 1 j · J+30 · Responsable : Moi
  - Prérequis : SEO-01, SIT-06
  - Outils : Next.js metadata, test des résultats enrichis · Coût : 0 €
  - Livrable : Audit technique sans erreur bloquante
- [ ] **SEO-03 · Pages locales**
  - Une page par commune ou quartier prioritaire, contenu unique : marché local, réglementation, profils de biens, estimation type.
  - Pourquoi : Capte les recherches locales.
  - P1 Haute · Moyenne · 2 j · J+50 · Responsable : Moi
  - Prérequis : SEO-01, REG-01
  - Outils : Site, IA + relecture · Coût : 0 €
  - Livrable : 5 pages locales
- [ ] **SEO-04 · 10 premiers articles**
  - Réglementation Bordeaux, rentabilité, LMNP, classement meublé, préparer son logement, choisir sa conciergerie, fiscalité, erreurs de débutant…
  - Pourquoi : Trafic durable et crédibilité d'expert.
  - P2 Moyenne · Moyenne · 5 j étalés · J+90 · Responsable : Moi
  - Prérequis : SEO-01
  - Outils : IA + relecture humaine · Coût : 0 €
  - Livrable : 10 articles publiés
- [ ] **SEO-05 · Cohérence NAP et annuaires**
  - Nom, adresse, téléphone identiques : Google, Apple Plans, Bing Places, PagesJaunes, annuaires locaux.
  - Pourquoi : Signal fort pour le SEO local.
  - P1 Haute · Facile · 0,5 j · J+45 · Responsable : Simon
  - Prérequis : GOO-03
  - Outils : Annuaires · Coût : 0 €
  - Livrable : Liste des inscriptions
- [ ] **SEO-06 · Netlinking local**
  - Partenaires (artisans, agents, déco), CCI, associations, presse locale, blogs de voyage bordelais.
  - Pourquoi : Les liens locaux renforcent l'autorité.
  - P2 Moyenne · Moyenne · Continu · J+90 · Responsable : Les deux
  - Prérequis : SIT-11
  - Outils : — · Coût : 0 €
  - Livrable : 10 liens obtenus
- [ ] **SEO-07 · Suivi SEO mensuel**
  - Positions, clics, pages qui progressent, requêtes à cibler.
  - Pourquoi : Ajuster les contenus.
  - P2 Moyenne · Facile · 1 h/mois · J+70 · Responsable : Moi
  - Prérequis : GOO-06
  - Outils : Search Console · Coût : 0 €
  - Livrable : Note mensuelle

**Vérifications avant de clore la catégorie**

- [ ] Chaque page a un mot-clé principal, un title et une meta description uniques
- [ ] Données structurées valides (test des résultats enrichis)
- [ ] Nom, adresse, téléphone identiques partout
- [ ] Pages indexées dans Search Console

**Erreurs fréquentes**

- Dupliquer la même page en changeant juste le nom de la commune : Google l'ignore ou la pénalise.

**Optimisations**

- Les requêtes « réglementation Airbnb Bordeaux » et « combien rapporte un Airbnb à Bordeaux » attirent exactement vos prospects : écrivez les meilleurs articles sur ces sujets.

### COM · Communication & identité

_Logo, charte, supports commerciaux et templates._

- [ ] **COM-01 · Finaliser le logo**
  - Version couleur, monochrome, favicon, avatar réseaux ; fichiers SVG et PNG.
  - Pourquoi : Nécessaire pour Google, réseaux, cartes, annonces.
  - P0 Critique · Moyenne · 1 j · J+10 · Responsable : Simon
  - Prérequis : STR-01
  - Outils : Designer / Figma / Canva · Coût : 0 à 800 €
  - Livrable : Pack logo
- [ ] **COM-02 · Charte graphique**
  - Couleurs, typographies, style photo, ton de voix (tutoiement ou vouvoiement), exemples à faire et à éviter.
  - Pourquoi : Cohérence et reconnaissance.
  - P1 Haute · Facile · 0,5 j · J+15 · Responsable : Simon
  - Prérequis : COM-01
  - Outils : Canva / Figma · Coût : 0 €
  - Livrable : Charte PDF
- [ ] **COM-03 · Plaquette commerciale propriétaires**
  - 4 à 8 pages : problème du propriétaire, services, formules et prix, processus, conformité, qui êtes-vous, preuves, contact. PDF + petit tirage.
  - Pourquoi : Support des rendez-vous et des partenaires.
  - P0 Critique · Moyenne · 1 j · J+25 · Responsable : Simon
  - Prérequis : COM-02, STR-06, STR-07
  - Outils : Canva · Coût : ≈ 50 à 150 € d'impression
  - Livrable : Plaquette PDF + imprimée
- [ ] **COM-04 · Cartes de visite**
  - Une par associé, QR code vers l'estimation gratuite.
  - Pourquoi : Indispensable sur le terrain et chez les partenaires.
  - P1 Haute · Facile · 1 h · J+20 · Responsable : Simon
  - Prérequis : COM-02, OUT-02
  - Outils : Imprimeur en ligne · Coût : ≈ 30 à 80 €
  - Livrable : Cartes imprimées
- [ ] **COM-05 · Templates**
  - Présentation de rendez-vous, proposition commerciale, relevé propriétaire, e-mails, posts réseaux, stories.
  - Pourquoi : Produire vite, toujours au même niveau.
  - P1 Haute · Facile · 1 j · J+30 · Responsable : Simon
  - Prérequis : COM-02
  - Outils : Canva, Google Slides · Coût : 0 €
  - Livrable : Bibliothèque de templates
- [ ] **COM-06 · Supports d'accueil physiques**
  - Carte de bienvenue, étiquettes, affichettes (wifi, règles, déchets), présentation de la welcome box.
  - Pourquoi : L'identité est visible par chaque voyageur.
  - P2 Moyenne · Facile · 0,5 j · J+50 · Responsable : Simon
  - Prérequis : COM-02
  - Outils : Canva · Coût : ≈ 50 €
  - Livrable : Kit imprimable
- [ ] **COM-07 · Portraits des fondateurs**
  - Photos professionnelles pour le site, LinkedIn, Google, plaquette.
  - Pourquoi : La confiance passe par des visages.
  - P1 Haute · Facile · 0,5 j · J+20 · Responsable : Les deux
  - Prérequis : aucun
  - Outils : Photographe · Coût : ≈ 0 à 300 €
  - Livrable : 10 portraits retouchés
- [ ] **COM-08 · Process photo des logements**
  - Matériel (grand-angle, trépied, lumière), liste de plans, préparation (home staging léger), retouche, ou brief pour photographe partenaire.
  - Pourquoi : Les photos sont le premier facteur de clic sur une annonce.
  - P1 Haute · Moyenne · 1 j · J+35 · Responsable : Simon
  - Prérequis : COM-02
  - Outils : Appareil / smartphone récent, Lightroom · Coût : ≈ 150 à 400 € par shooting externe
  - Livrable : Brief photo + exemple
- [ ] **COM-09 · Flyers et boîtage**
  - Flyer A5 ciblé propriétaires, zones à forte densité d'annonces, affiches chez les commerçants partenaires.
  - Pourquoi : Canal terrain peu coûteux.
  - P2 Moyenne · Facile · 0,5 j · J+45 · Responsable : Simon
  - Prérequis : COM-02
  - Outils : Canva, imprimeur · Coût : ≈ 80 à 200 € pour 2 000 flyers
  - Livrable : Flyer imprimé

**Vérifications avant de clore la catégorie**

- [ ] Logo en SVG, PNG, favicon et avatar carré
- [ ] Tous les supports utilisent la même charte
- [ ] Plaquette relue par une personne extérieure

**Erreurs fréquentes**

- Imprimer 1 000 plaquettes avant d'avoir testé le discours en rendez-vous : imprimez 50.

**Optimisations**

- Des photos avant/après d'un vrai logement valent plus que n'importe quel visuel de banque d'images.

### RS · Réseaux sociaux

_Instagram, Facebook, LinkedIn en priorité ; TikTok et Pinterest si vous avez la capacité de produire._

- [ ] **RS-01 · Réserver les identifiants**
  - Même identifiant sur Instagram, Facebook, LinkedIn, TikTok, Pinterest, YouTube.
  - Pourquoi : Évite qu'un tiers prenne votre nom.
  - P0 Critique · Facile · 1 h · J+3 · Responsable : Simon
  - Prérequis : STR-01
  - Outils : Réseaux · Coût : 0 €
  - Livrable : Comptes réservés
- [ ] **RS-02 · Instagram professionnel**
  - Bio claire, lien vers l'estimation, stories à la une (Services, Avant/Après, Avis, Bordeaux), 9 premiers posts.
  - Pourquoi : Vitrine visuelle et preuve sociale.
  - P1 Haute · Facile · 0,5 j · J+25 · Responsable : Simon
  - Prérequis : COM-01, RS-01
  - Outils : Instagram, Canva · Coût : 0 €
  - Livrable : Compte prêt
- [ ] **RS-03 · Page Facebook et groupes locaux**
  - Page entreprise, présence utile dans les groupes de propriétaires, investisseurs et expatriés bordelais, sans spam.
  - Pourquoi : Nombreux propriétaires actifs dans ces groupes.
  - P1 Haute · Facile · 2 h · J+25 · Responsable : Simon
  - Prérequis : COM-01, RS-01
  - Outils : Facebook · Coût : 0 €
  - Livrable : Page prête + liste de groupes
- [ ] **RS-04 · LinkedIn**
  - Profils des deux associés optimisés, page entreprise, posts réguliers ; cibles : investisseurs, agents, notaires, CGP, RH (mobilité).
  - Pourquoi : Canal B2B et partenaires.
  - P1 Haute · Facile · 0,5 j · J+25 · Responsable : Les deux
  - Prérequis : COM-07, RS-01
  - Outils : LinkedIn · Coût : 0 €
  - Livrable : Profils et page prêts
- [ ] **RS-05 · Ligne éditoriale et calendrier**
  - 3 posts par semaine : preuve (résultats, avis), pédagogie (règles, rentabilité), coulisses (ménage, préparation). Banque d'idées.
  - Pourquoi : Régularité = visibilité.
  - P1 Haute · Facile · 0,5 j · J+35 · Responsable : Simon
  - Prérequis : RS-02, COM-05
  - Outils : Notion, IA · Coût : 0 €
  - Livrable : Calendrier 4 semaines
- [ ] **RS-06 · Outil de planification**
  - Programmation et statistiques.
  - Pourquoi : Gain de temps.
  - P2 Moyenne · Facile · 1 h · J+40 · Responsable : Simon
  - Prérequis : RS-05
  - Outils : Meta Business Suite, Buffer · Coût : 0 à 15 €/mois
  - Livrable : Outil connecté
- [ ] **RS-07 · TikTok (optionnel)**
  - Avant/après, coulisses, conseils en format court.
  - Pourquoi : Portée organique forte si production régulière.
  - P3 Plus tard · Moyenne · Continu · J+90 · Responsable : Simon
  - Prérequis : RS-05
  - Outils : TikTok · Coût : 0 €
  - Livrable : 10 vidéos
- [ ] **RS-08 · Pinterest (optionnel)**
  - Épingles déco et aménagement de logements : utile surtout si vous vendez du home staging.
  - Pourquoi : Faible priorité pour trouver des propriétaires.
  - P3 Plus tard · Facile · 2 h · J+120 · Responsable : Simon
  - Prérequis : RS-01
  - Outils : Pinterest · Coût : 0 €
  - Livrable : Tableaux créés

**Vérifications avant de clore la catégorie**

- [ ] Identifiants identiques réservés partout
- [ ] Bio, lien, visuels cohérents avec la charte
- [ ] Calendrier éditorial rempli sur 4 semaines

**Erreurs fréquentes**

- Ouvrir 5 réseaux et publier sur aucun. Mieux vaut 2 réseaux bien tenus.

**Optimisations**

- Les propriétaires regardent LinkedIn et les groupes Facebook ; les voyageurs regardent Instagram. Choisissez selon la cible de chaque post.

## Phase 4 : Commercial (J20 → J90)

### VEN · Vente : processus commercial

_De la prospection au suivi : CRM, pipeline, scripts, objections, signature et onboarding._

- [ ] **VEN-01 · Cartographier le processus commercial**
  - Lead → qualification → RDV / visite → proposition → signature → onboarding → mise en ligne → suivi → fidélisation → parrainage. Durée cible et responsable par étape.
  - Pourquoi : Structure du CRM et des scripts.
  - P0 Critique · Facile · 0,5 j · J+15 · Responsable : Les deux
  - Prérequis : STR-07
  - Outils : Schéma · Coût : 0 €
  - Livrable : Schéma du processus
- [ ] **VEN-02 · CRM et pipeline**
  - Étapes du pipeline, champs (source, commune, type, statut réglementaire, estimation, prochaine action, relance), vues par associé.
  - Pourquoi : Aucun prospect oublié.
  - P0 Critique · Facile · 0,5 j · J+20 · Responsable : Moi
  - Prérequis : VEN-01
  - Outils : Back-office, HubSpot gratuit, Pipedrive, Notion · Coût : 0 à 20 €/mois
  - Livrable : CRM opérationnel
- [ ] **VEN-03 · Grille de qualification**
  - Éligibilité réglementaire, zone, type et standing, potentiel de revenu minimum, attentes et disponibilité du propriétaire, signaux d'alerte.
  - Pourquoi : Passer du temps sur les bons dossiers.
  - P0 Critique · Facile · 2 h · J+18 · Responsable : Les deux
  - Prérequis : REG-02, VEN-01
  - Outils : CRM · Coût : 0 €
  - Livrable : Grille de qualification
- [ ] **VEN-04 · Scripts téléphone, e-mail, SMS, LinkedIn**
  - Appel sortant, appel entrant, e-mail de prospection, e-mail après RDV, SMS de relance, message LinkedIn, message au réseau personnel. Exemples dans la Boîte à outils.
  - Pourquoi : Discours clair et répétable.
  - P0 Critique · Facile · 0,5 j · J+18 · Responsable : Simon
  - Prérequis : STR-07
  - Outils : Google Docs · Coût : 0 €
  - Livrable : Scripts v1
- [ ] **VEN-05 · Traitement des objections**
  - Prix, « je peux le faire moi-même », confiance et clés, dégâts, déjà une conciergerie, réglementation, engagement, rentabilité. Réponses dans la Boîte à outils.
  - Pourquoi : Les objections sont prévisibles : préparez-les.
  - P0 Critique · Facile · 2 h · J+20 · Responsable : Simon
  - Prérequis : VEN-04
  - Outils : Google Docs · Coût : 0 €
  - Livrable : Fiche objections
- [ ] **VEN-06 · Trame du premier rendez-vous**
  - 45 minutes : découverte (objectifs, contraintes), visite et audit du logement, estimation, présentation, prochaines étapes datées. Formulaire d'audit.
  - Pourquoi : Le rendez-vous est le moment de la décision.
  - P0 Critique · Facile · 2 h · J+22 · Responsable : Les deux
  - Prérequis : VEN-03
  - Outils : Formulaire back-office · Coût : 0 €
  - Livrable : Trame + formulaire d'audit
- [ ] **VEN-07 · Proposition commerciale type**
  - Estimation en fourchette, formule recommandée, prix, investissements recommandés, planning de mise en ligne, conditions.
  - Pourquoi : Envoyée dans les 24 h après le rendez-vous.
  - P0 Critique · Facile · 0,5 j · J+32 · Responsable : Simon
  - Prérequis : COM-05, SIT-03
  - Outils : Canva / Google Slides · Coût : 0 €
  - Livrable : Modèle de proposition
- [ ] **VEN-08 · Parcours de signature**
  - Contrat, annexes et mandat SEPA en signature électronique ; formulaire de rétractation ; demande expresse de démarrage anticipé.
  - Pourquoi : Signer vite, proprement.
  - P0 Critique · Moyenne · 2 h · J+46 · Responsable : Moi
  - Prérequis : LEG-12, LEG-04, OUT-08
  - Outils : Yousign · Coût : Inclus
  - Livrable : Parcours testé
- [ ] **VEN-09 · Onboarding propriétaire (J0 → J14)**
  - Questionnaire, remise des clés, inventaire, mise en conformité, achats (linge, équipement, welcome), shooting photo, annonce, connexion channel manager, prix, mise en ligne, appel à J+7.
  - Pourquoi : Plus l'onboarding est rapide, plus vite vous encaissez.
  - P0 Critique · Moyenne · 1 j · J+46 · Responsable : Simon
  - Prérequis : VEN-08, OPS-13, BO-04
  - Outils : Checklist back-office · Coût : 0 €
  - Livrable : Checklist d'onboarding
- [ ] **VEN-10 · Suivi et fidélisation**
  - Relevé mensuel commenté, revue trimestrielle de performance, NPS propriétaire, programme de parrainage.
  - Pourquoi : Garder un propriétaire coûte moins cher qu'en trouver un.
  - P1 Haute · Facile · 2 h · J+60 · Responsable : Simon
  - Prérequis : VEN-09
  - Outils : CRM · Coût : 0 €
  - Livrable : Rituel de suivi
- [ ] **VEN-11 · Objectifs commerciaux hebdomadaires**
  - Ex. 30 contacts, 5 rendez-vous, 1 à 2 signatures par semaine ; revue chaque lundi.
  - Pourquoi : Ce qui se mesure progresse.
  - P1 Haute · Facile · 30 min/sem. · J+25 · Responsable : Les deux
  - Prérequis : VEN-02
  - Outils : Tableau de bord · Coût : 0 €
  - Livrable : Objectifs et revue hebdo

**Vérifications avant de clore la catégorie**

- [ ] Chaque lead est dans le CRM avec une prochaine action datée
- [ ] Scripts testés sur au moins 10 appels réels et ajustés
- [ ] Parcours de signature testé de bout en bout
- [ ] Onboarding propriétaire réalisable en moins de 14 jours

**Erreurs fréquentes**

- Promettre un revenu précis : donnez une fourchette prudente et documentée.
- Signer un logement hors zone ou non conforme parce que c'est le premier.
- Ne pas relancer : la majorité des signatures se fait après la 3e relance.

**Optimisations**

- Un rendez-vous chez le propriétaire avec un mini-audit gratuit (photos, prix, annonce actuelle) convertit beaucoup mieux qu'un appel.

### MKT · Marketing

_Personas, plan à 90 jours, offre de lancement, contenus et publicité._

- [ ] **MKT-01 · Personas propriétaires**
  - Investisseur LMNP, propriétaire d'une résidence secondaire, expatrié, résident qui voyage souvent, héritier, hôte débordé. Besoins, peurs, canaux.
  - Pourquoi : Un message qui parle à chacun.
  - P1 Haute · Facile · 2 h · J+15 · Responsable : Les deux
  - Prérequis : STR-04
  - Outils : Google Docs · Coût : 0 €
  - Livrable : 5 fiches personas
- [ ] **MKT-02 · Plan marketing 90 jours**
  - Canaux, actions, budget, calendrier, KPI, responsables.
  - Pourquoi : Cohérence et budget maîtrisé.
  - P1 Haute · Moyenne · 0,5 j · J+20 · Responsable : Les deux
  - Prérequis : MKT-01, FIN-01
  - Outils : Tableur · Coût : 0 €
  - Livrable : Plan 90 jours
- [ ] **MKT-03 · Offre de lancement**
  - Ex. frais de mise en service offerts pour les 10 premiers propriétaires, sans baisser la commission.
  - Pourquoi : Crée l'urgence sans détruire le prix.
  - P1 Haute · Facile · 1 h · J+20 · Responsable : Les deux
  - Prérequis : STR-06
  - Outils : — · Coût : Manque à gagner maîtrisé
  - Livrable : Offre écrite
- [ ] **MKT-04 · Guide téléchargeable (lead magnet)**
  - « Louer en courte durée à Bordeaux : règles et rentabilité » contre e-mail, relié au CRM.
  - Pourquoi : Capte les propriétaires en phase de réflexion.
  - P2 Moyenne · Facile · 1 j · J+60 · Responsable : Moi
  - Prérequis : REG-01, SIT-11
  - Outils : Canva, IA · Coût : 0 €
  - Livrable : Guide PDF + page de capture
- [ ] **MKT-05 · Newsletter propriétaires**
  - Mensuelle : marché, réglementation, conseils, résultats. Consentement RGPD.
  - Pourquoi : Garde le contact avec les prospects non mûrs.
  - P2 Moyenne · Facile · 2 h/mois · J+75 · Responsable : Moi
  - Prérequis : MKT-04
  - Outils : Brevo · Coût : 0 à 25 €/mois
  - Livrable : Première newsletter
- [ ] **MKT-06 · Preuves sociales et cas clients**
  - Avis Google des propriétaires, avant/après chiffré, captures de notes voyageurs, témoignages vidéo.
  - Pourquoi : La confiance accélère la signature.
  - P1 Haute · Facile · Continu · J+90 · Responsable : Simon
  - Prérequis : LAN-05
  - Outils : Téléphone, Canva · Coût : 0 €
  - Livrable : 3 cas clients
- [ ] **MKT-07 · Google Ads (test)**
  - Campagne locale sur les requêtes à forte intention, budget test, suivi des conversions, pages d'atterrissage dédiées.
  - Pourquoi : Leads rapides, mesurables.
  - P2 Moyenne · Moyenne · 1 j + suivi · J+60 · Responsable : Moi
  - Prérequis : GOO-05, SIT-11, AUT-03
  - Outils : Google Ads · Coût : ≈ 300 à 600 €/mois de test
  - Livrable : Campagne active + coût par lead
- [ ] **MKT-08 · Meta Ads (test)**
  - Ciblage propriétaires et investisseurs de la métropole, reciblage des visiteurs du site.
  - Pourquoi : Complément à Google.
  - P3 Plus tard · Moyenne · 0,5 j + suivi · J+90 · Responsable : Moi
  - Prérequis : MKT-07
  - Outils : Meta Ads · Coût : ≈ 200 à 400 €/mois de test
  - Livrable : Campagne test
- [ ] **MKT-09 · Relations presse locales**
  - Communiqué de lancement, angle local (réglementation, emploi), contacts presse et blogs bordelais.
  - Pourquoi : Notoriété et liens.
  - P3 Plus tard · Facile · 0,5 j · J+75 · Responsable : Les deux
  - Prérequis : LAN-02
  - Outils : — · Coût : 0 €
  - Livrable : Communiqué envoyé

**Vérifications avant de clore la catégorie**

- [ ] Chaque action marketing a un objectif et un KPI
- [ ] Coût par lead suivi par canal
- [ ] Offre de lancement limitée dans le temps ou en nombre

**Erreurs fréquentes**

- Lancer de la publicité payante avant que le site convertisse (formulaire testé, tracking OK, rappel sous 2 h).

**Optimisations**

- Un cas client chiffré (« +38 % de revenus en 3 mois ») est votre meilleur contenu marketing : documentez dès le premier logement.

### ACQ · Acquisition & partenariats

_Toutes les sources de propriétaires : réseau, terrain, digital, partenaires prescripteurs._

- [ ] **ACQ-01 · Activer le réseau personnel**
  - Message personnalisé à 100 contacts (famille, amis, anciens collègues) : lancement + demande de recommandation.
  - Pourquoi : Source la plus rapide du premier client.
  - P0 Critique · Facile · 0,5 j · J+22 · Responsable : Les deux
  - Prérequis : VEN-04
  - Outils : WhatsApp, e-mail, LinkedIn · Coût : 0 €
  - Livrable : 100 messages envoyés, réponses suivies
- [ ] **ACQ-02 · Liste de propriétaires cibles**
  - Annonces actives de la zone gérées par des particuliers (peu d'avis, photos amateur, calendrier vide) ; retrouver les propriétaires par des canaux autorisés (boîtage, réseaux, recommandation).
  - Pourquoi : Ces propriétaires ont un besoin visible.
  - P1 Haute · Moyenne · 1 j · J+30 · Responsable : Simon
  - Prérequis : VEN-03
  - Outils : Observation du marché, CRM · Coût : 0 €
  - Livrable : Liste de 100 cibles
- [ ] **ACQ-03 · Agents immobiliers**
  - Agences qui vendent à des investisseurs : proposer une estimation de revenus pour leurs ventes, apport d'affaires réciproque.
  - Pourquoi : Flux régulier d'investisseurs LMNP.
  - P1 Haute · Moyenne · Continu · J+50 · Responsable : Simon
  - Prérequis : COM-03, LEG-11
  - Outils : Plaquette, cartes · Coût : Commission d'apport
  - Livrable : 5 agences partenaires
- [ ] **ACQ-04 · Notaires, CGP, courtiers**
  - Successions, investisseurs, clients patrimoniaux : présentation, fiche partenaire, rendez-vous.
  - Pourquoi : Prescripteurs de confiance.
  - P1 Haute · Moyenne · Continu · J+60 · Responsable : Moi
  - Prérequis : COM-03
  - Outils : LinkedIn, plaquette · Coût : 0 €
  - Livrable : 10 rendez-vous prescripteurs
- [ ] **ACQ-05 · Architectes, décorateurs, home stagers, artisans**
  - Ils rénovent ou meublent des biens destinés à la location : recommandation croisée.
  - Pourquoi : Propriétaires en phase de mise en location.
  - P2 Moyenne · Facile · Continu · J+75 · Responsable : Simon
  - Prérequis : COM-03
  - Outils : — · Coût : 0 €
  - Livrable : 5 partenaires
- [ ] **ACQ-06 · Photographes, gestionnaires, syndics, conciergeries saturées**
  - Photographes immobiliers, gestionnaires de biens et syndics (clients avec résidences secondaires), conciergeries hors zone ou saturées (sous-traitance).
  - Pourquoi : Sources complémentaires.
  - P2 Moyenne · Moyenne · Continu · J+90 · Responsable : Simon
  - Prérequis : COM-03
  - Outils : — · Coût : 0 €
  - Livrable : Liste de contacts + premiers échanges
- [ ] **ACQ-07 · Programme apporteurs d'affaires et parrainage**
  - Forfait par logement signé (ex. 150 à 300 €) ou pourcentage de la première année ; parrainage propriétaire (ex. un mois de commission offert).
  - Pourquoi : Transforme chaque contact en commercial.
  - P1 Haute · Facile · 2 h · J+45 · Responsable : Les deux
  - Prérequis : LEG-11
  - Outils : Contrat, CRM · Coût : Variable
  - Livrable : Programme écrit
- [ ] **ACQ-08 · Actions terrain**
  - Boîtage ciblé, commerçants partenaires, salons immobiliers, clubs d'investisseurs, réseaux d'affaires, événements CCI.
  - Pourquoi : Visibilité locale.
  - P2 Moyenne · Facile · Continu · J+50 · Responsable : Simon
  - Prérequis : COM-09
  - Outils : Flyers, cartes · Coût : ≈ 100 à 300 €/mois
  - Livrable : Planning terrain mensuel
- [ ] **ACQ-09 · Entreprises et mobilité**
  - Salariés expatriés ou en mobilité qui libèrent leur logement, services RH, relocation.
  - Pourquoi : Logements disponibles de longue durée.
  - P3 Plus tard · Moyenne · Continu · J+120 · Responsable : Moi
  - Prérequis : RS-04
  - Outils : LinkedIn · Coût : 0 €
  - Livrable : 5 contacts RH
- [ ] **ACQ-10 · Annuaires de co-hôtes**
  - Inscription aux programmes ou annuaires de co-hôtes des plateformes lorsqu'ils sont disponibles à Bordeaux, et annuaires spécialisés.
  - Pourquoi : Leads entrants de propriétaires déjà sur Airbnb.
  - P2 Moyenne · Facile · 2 h · J+60 · Responsable : Moi
  - Prérequis : CHN-02
  - Outils : Airbnb, annuaires · Coût : 0 €
  - Livrable : Inscriptions faites
- [ ] **ACQ-11 · Reprise de portefeuille**
  - Identifier les conciergeries ou hôtes multi-logements qui arrêtent ; proposer une reprise.
  - Pourquoi : Accélérateur de croissance.
  - P3 Plus tard · Difficile · Continu · J+180 · Responsable : Les deux
  - Prérequis : CRO-01
  - Outils : Réseau · Coût : Variable
  - Livrable : Opportunités identifiées

**Vérifications avant de clore la catégorie**

- [ ] Chaque source a un suivi dans le CRM (champ « source »)
- [ ] Contrat d'apporteur signé avec chaque partenaire rémunéré
- [ ] Au moins 3 canaux testés avant d'en abandonner un

**Erreurs fréquentes**

- Démarcher les hôtes via la messagerie Airbnb : interdit, risque de suspension du compte.
- Rémunérer un apporteur sans contrat ni facture.

**Optimisations**

- Le réseau personnel et les agents immobiliers qui vendent à des investisseurs LMNP sont les deux sources les plus rapides pour les 5 premiers logements.

## Phase 5 : Tests & lancement (J40 → J90)

### TST · Tests

_Tester absolument tout avant le premier voyageur, puis le process complet sur un logement pilote._

- [ ] **TST-01 · Tests automatisés du site**
  - Parcours : accueil → estimation → formulaire → confirmation ; prise de RDV ; pages légales ; mobile et desktop ; Chrome, Safari, Firefox.
  - Pourquoi : Garantit que les leads arrivent.
  - P0 Critique · Moyenne · 1 j · J+36 · Responsable : Moi
  - Prérequis : SIT-07, SIT-08
  - Outils : Playwright, skill quality-gate · Coût : 0 €
  - Livrable : Suite de tests verte
- [ ] **TST-02 · Tests du back-office par rôle**
  - Chaque rôle avec un vrai compte : ce qu'il voit, ce qu'il peut modifier, ce qui lui est interdit.
  - Pourquoi : Sécurité des données et des codes d'accès.
  - P0 Critique · Moyenne · 0,5 j · J+40 · Responsable : Moi
  - Prérequis : BO-02
  - Outils : Comptes de test · Coût : 0 €
  - Livrable : Procès-verbal
- [ ] **TST-03 · Tests e-mails et délivrabilité**
  - Chaque e-mail automatique reçu, lisible sur mobile, hors spam (score ≥ 9/10).
  - Pourquoi : Un e-mail en spam est un message non lu.
  - P0 Critique · Facile · 2 h · J+36 · Responsable : Moi
  - Prérequis : SEC-07, SIT-07
  - Outils : mail-tester.com · Coût : 0 €
  - Livrable : Procès-verbal
- [ ] **TST-04 · Tests paiements**
  - Stripe en mode test puis paiement réel de 1 €, prélèvement SEPA, échec, remboursement, facture générée.
  - Pourquoi : Être payé sans incident.
  - P0 Critique · Facile · 2 h · J+35 · Responsable : Moi
  - Prérequis : BNK-03
  - Outils : Stripe · Coût : 0 €
  - Livrable : Procès-verbal
- [ ] **TST-05 · Test de bout en bout sur logement pilote**
  - Réservation → messages → code d'accès → mission de ménage → check-list → arrivée → départ → relevé → facture. Idéalement un vrai séjour.
  - Pourquoi : Le test qui révèle tout ce qui manque.
  - P0 Critique · Difficile · 2 à 3 j · J+58 · Responsable : Les deux
  - Prérequis : CHN-07, AUT-01, CHN-09, OPS-02, OPS-03, OPS-04, BO-05
  - Outils : Tous les outils · Coût : Coût d'un séjour éventuel
  - Livrable : Procès-verbal + liste de correctifs
- [ ] **TST-06 · Exercice d'urgence**
  - Simuler : serrure en panne à 22 h, ménage non fait 2 h avant une arrivée, prestataire malade un samedi.
  - Pourquoi : Vérifier que les procédures marchent vraiment.
  - P1 Haute · Facile · 2 h · J+50 · Responsable : Les deux
  - Prérequis : OPS-07, OPS-16
  - Outils : Procédures · Coût : 0 €
  - Livrable : Débrief
- [ ] **TST-07 · Simulation d'un samedi chargé**
  - 6 départs et 6 arrivées le même jour : planning, trajets, linge, prestataires.
  - Pourquoi : Valider la capacité avant de signer davantage.
  - P1 Haute · Moyenne · 0,5 j · J+55 · Responsable : Simon
  - Prérequis : OPS-14, OPS-16
  - Outils : Planning · Coût : 0 €
  - Livrable : Planning type + goulots identifiés
- [ ] **TST-08 · Test de restauration de sauvegarde**
  - Restaurer la base sur un environnement de test et vérifier les données.
  - Pourquoi : Une sauvegarde jamais restaurée n'est pas une sauvegarde.
  - P1 Haute · Moyenne · 2 h · J+50 · Responsable : Moi
  - Prérequis : SEC-04
  - Outils : Supabase · Coût : 0 €
  - Livrable : Procès-verbal

**Vérifications avant de clore la catégorie**

- [ ] Chaque test a un procès-verbal (date, testeur, résultat, correctifs)
- [ ] Aucun défaut bloquant ouvert
- [ ] Test pilote réalisé avec un vrai séjour

**Erreurs fréquentes**

- Faire le premier test sur le logement du premier client. Utilisez un logement pilote : le vôtre, celui d'un proche ou un séjour fictif.

**Optimisations**

- Faites tester le parcours propriétaire par quelqu'un qui ne vous connaît pas : il verra ce que vous ne voyez plus.

### LAN · Lancement : du premier client aux 5 logements

_Go/No-Go, annonce, premier propriétaire, premier séjour, premier relevé._

- [ ] **LAN-01 · Go / No-Go pré-lancement**
  - Revue de la checklist pré-lancement (onglet Checklists) : tout est vert ou le risque est accepté par écrit.
  - Pourquoi : Ne pas ouvrir avec un trou juridique ou opérationnel.
  - P0 Critique · Facile · 2 h · J+60 · Responsable : Les deux
  - Prérequis : ASS-01, LEG-12, SIT-11, TST-05, CHN-07, OPS-16, SEC-02, REG-02
  - Outils : Checklist · Coût : 0 €
  - Livrable : Décision Go signée
- [ ] **LAN-02 · Annonce du lancement**
  - LinkedIn, Instagram, Facebook, post Google, e-mail au réseau et aux partenaires, offre de lancement.
  - Pourquoi : Faire savoir que vous êtes ouverts.
  - P0 Critique · Facile · 0,5 j · J+61 · Responsable : Les deux
  - Prérequis : LAN-01, RS-02, RS-04, MKT-03
  - Outils : Réseaux, e-mail · Coût : 0 €
  - Livrable : Annonces publiées
- [ ] **LAN-03 · Premier propriétaire signé**
  - Qualification, rendez-vous, proposition, signature électronique, SEPA.
  - Pourquoi : La preuve que l'offre se vend.
  - P0 Critique · Moyenne · Variable · J+50 · Responsable : Les deux
  - Prérequis : VEN-08, VEN-06
  - Outils : CRM, Yousign · Coût : 0 €
  - Livrable : Contrat signé
- [ ] **LAN-04 · Onboarding et mise en ligne du premier logement**
  - Checklist d'onboarding complète, photos, annonce, prix, messages, ménage planifié.
  - Pourquoi : Premier revenu.
  - P0 Critique · Moyenne · 7 à 14 j · J+64 · Responsable : Les deux
  - Prérequis : LAN-03, VEN-09, LAN-01
  - Outils : Tous · Coût : 0 €
  - Livrable : Annonce en ligne
- [ ] **LAN-05 · Premier séjour sous contrôle renforcé**
  - Présence au check-in ou disponibilité immédiate, contrôle du ménage sur place, message J+1, débrief après départ.
  - Pourquoi : Le premier avis compte double.
  - P0 Critique · Moyenne · Durée du séjour · J+75 · Responsable : Les deux
  - Prérequis : LAN-04
  - Outils : — · Coût : 0 €
  - Livrable : Avis 5 étoiles + débrief
- [ ] **LAN-06 · Premier relevé et première facture**
  - Relevé envoyé à l'heure, commenté par téléphone, prélèvement réussi, demande d'avis Google au propriétaire.
  - Pourquoi : Installe la confiance pour la suite.
  - P0 Critique · Facile · 2 h · J+90 · Responsable : Moi
  - Prérequis : LAN-05, BO-05
  - Outils : Back-office · Coût : 0 €
  - Livrable : Relevé + facture + avis Google
- [ ] **LAN-07 · Rétrospective J+30 après le premier séjour**
  - Ce qui a marché, ce qui a coincé, correctifs de process, mise à jour des checklists.
  - Pourquoi : Amélioration continue dès le premier cas.
  - P1 Haute · Facile · 2 h · J+90 · Responsable : Les deux
  - Prérequis : LAN-05
  - Outils : Wiki · Coût : 0 €
  - Livrable : Compte rendu + actions
- [ ] **LAN-08 · Atteindre 5 logements actifs**
  - Montée en charge par paliers : 1 → 3 → 5, avec rétrospective à chaque palier.
  - Pourquoi : Premier palier de crédibilité et de rentabilité opérationnelle.
  - P1 Haute · Moyenne · 30 à 60 j · J+90 · Responsable : Les deux
  - Prérequis : LAN-04
  - Outils : CRM · Coût : 0 €
  - Livrable : 5 logements en ligne

**Vérifications avant de clore la catégorie**

- [ ] Checklist pré-lancement validée à 100 %
- [ ] Premier séjour suivi en présence renforcée
- [ ] Rétrospective réalisée et correctifs planifiés

**Erreurs fréquentes**

- Signer 10 logements la même semaine au lancement : la qualité s'effondre. Montez en charge par paliers.

**Optimisations**

- Faites les premiers ménages et check-ins vous-mêmes : vous écrirez des procédures beaucoup plus justes.

## Phase 6 : Croissance (J90 et +)

### IA · Intelligence artificielle

_Les tâches où l'IA fait gagner du temps. Règle : l'IA propose, un humain valide, surtout pour ce qui part vers un client._

- [ ] **IA-01 · Rédaction et traduction des annonces**
  - Titres, descriptions, traductions EN / ES / DE à partir de la fiche logement ; relecture humaine.
  - Pourquoi : Qualité et temps gagné sur chaque onboarding.
  - P2 Moyenne · Facile · 2 h · J+45 · Responsable : Simon
  - Prérequis : CHN-08
  - Outils : Claude · Coût : ≈ 20 €/mois
  - Livrable : Prompt type validé
- [ ] **IA-02 · Brouillons de réponses voyageurs**
  - Réponses proposées à partir de la base de connaissance du logement, validées avant envoi.
  - Pourquoi : Temps de réponse réduit, ton homogène.
  - P2 Moyenne · Moyenne · 1 j · J+75 · Responsable : Moi
  - Prérequis : BO-04, OPS-06
  - Outils : Channel manager avec IA, Claude · Coût : Variable
  - Livrable : Flux de brouillons
- [ ] **IA-03 · Analyse des avis**
  - Synthèse mensuelle des avis : irritants récurrents, points forts, actions.
  - Pourquoi : Amélioration continue fondée sur les données.
  - P2 Moyenne · Facile · 1 h/mois · J+90 · Responsable : Simon
  - Prérequis : OPS-20
  - Outils : Claude · Coût : Inclus
  - Livrable : Synthèse mensuelle
- [ ] **IA-04 · Contenus SEO et réseaux**
  - Plans d'articles, premiers jets, calendrier éditorial, déclinaisons de posts ; relecture et ajout d'expérience réelle.
  - Pourquoi : Régularité de publication.
  - P2 Moyenne · Facile · Continu · J+45 · Responsable : Moi
  - Prérequis : SEO-01, RS-05
  - Outils : Claude · Coût : Inclus
  - Livrable : Process de production
- [ ] **IA-05 · Préparation des rendez-vous**
  - Synthèse du bien et de l'annonce existante, estimation argumentée, points d'amélioration, objections probables.
  - Pourquoi : Rendez-vous mieux préparés en 10 minutes.
  - P2 Moyenne · Facile · 2 h · J+45 · Responsable : Les deux
  - Prérequis : VEN-06
  - Outils : Claude · Coût : Inclus
  - Livrable : Prompt de préparation
- [ ] **IA-06 · Veille réglementaire assistée**
  - Résumé des nouveaux textes et délibérations, impact sur vos logements.
  - Pourquoi : Rester à jour sans y passer des heures.
  - P2 Moyenne · Facile · 1 h/mois · J+60 · Responsable : Moi
  - Prérequis : REG-07
  - Outils : Claude, Google Alerts · Coût : Inclus
  - Livrable : Note de veille
- [ ] **IA-07 · Assistant interne de procédures**
  - Questions en langage naturel sur votre wiki : « que faire si la chaudière tombe en panne ? ».
  - Pourquoi : Autonomie des prestataires et futurs salariés.
  - P3 Plus tard · Moyenne · 1 j · J+120 · Responsable : Moi
  - Prérequis : OPS-19
  - Outils : Claude (projet avec documents) · Coût : Inclus
  - Livrable : Assistant opérationnel
- [ ] **IA-08 · Contrôle qualité des photos de ménage**
  - Détection d'oublis sur les photos de fin de ménage (lit, salle de bain, poubelles).
  - Pourquoi : Contrôle qualité à grande échelle.
  - P3 Plus tard · Difficile · 2 j · J+180 · Responsable : Moi
  - Prérequis : BO-06
  - Outils : API Claude (vision) · Coût : Variable
  - Livrable : Prototype
- [ ] **IA-09 · Rapport de performance propriétaire**
  - Commentaire automatique du relevé : occupation, prix moyen, comparaison marché, recommandations.
  - Pourquoi : Valeur perçue du relevé mensuel.
  - P3 Plus tard · Moyenne · 1 j · J+120 · Responsable : Moi
  - Prérequis : BO-05
  - Outils : API Claude · Coût : Variable
  - Livrable : Commentaire généré et validé

**Vérifications avant de clore la catégorie**

- [ ] Aucune donnée personnelle sensible envoyée à un outil IA sans cadre (DPA, anonymisation)
- [ ] Chaque usage IA a une validation humaine définie
- [ ] Gain de temps mesuré

**Erreurs fréquentes**

- Laisser une IA répondre seule aux voyageurs : une information fausse (code, horaire, règle) crée un incident.

**Optimisations**

- Construisez une base de connaissance par logement (fiche logement du back-office) : c'est elle qui rend l'IA fiable.

### RH · RH : préparer le premier recrutement

_Tout ce qu'il faut savoir le jour où vous recrutez._

- [ ] **RH-01 · Définir le déclencheur d'embauche**
  - Ex. plus de 20 à 25 logements, ou plus de 45 h opérationnelles par semaine chacun pendant 4 semaines.
  - Pourquoi : Recruter au bon moment.
  - P3 Plus tard · Facile · 1 h · J+90 · Responsable : Les deux
  - Prérequis : STR-08
  - Outils : Tableau de bord · Coût : 0 €
  - Livrable : Règle écrite
- [ ] **RH-02 · Choisir le statut du premier renfort**
  - Sous-traitance, CDD, CDI à temps partiel, alternance, stage : coût complet et contraintes.
  - Pourquoi : Le bon statut dépend du besoin réel.
  - P3 Plus tard · Moyenne · 2 h · J+100 · Responsable : Moi
  - Prérequis : RH-01
  - Outils : Expert-comptable · Coût : 0 €
  - Livrable : Comparatif
- [ ] **RH-03 · Obligations employeur**
  - DPAE, contrat écrit, registre unique du personnel, médecine du travail, mutuelle obligatoire (≥ 50 % employeur), prévoyance selon convention, convention collective applicable, affichages obligatoires, document unique d'évaluation des risques (produits ménagers, port de charges), logiciel de paie.
  - Pourquoi : Éviter tout redressement.
  - P3 Plus tard · Difficile · 1 j · J+110 · Responsable : Moi
  - Prérequis : RH-02
  - Outils : Expert-comptable, URSSAF · Coût : Paie ≈ 20 à 50 €/salarié/mois
  - Livrable : Checklist employeur
- [ ] **RH-04 · Fiche de poste et recrutement**
  - Assistant(e) opérations ou gouvernant(e) : missions, profil, test pratique, grille d'entretien.
  - Pourquoi : Recruter juste du premier coup.
  - P3 Plus tard · Moyenne · 0,5 j · J+110 · Responsable : Les deux
  - Prérequis : RH-02
  - Outils : Indeed, France Travail, LinkedIn · Coût : 0 à 300 €
  - Livrable : Fiche de poste + annonce
- [ ] **RH-05 · Aides à l'embauche**
  - Apprentissage, aides France Travail, contrats aidés selon profil.
  - Pourquoi : Réduit le coût du premier poste.
  - P3 Plus tard · Facile · 1 h · J+100 · Responsable : Moi
  - Prérequis : RH-02
  - Outils : France Travail · Coût : 0 €
  - Livrable : Liste des aides
- [ ] **RH-06 · Onboarding du premier salarié**
  - Guide employé, accès, formation terrain en binôme, point à J+7, J+30, fin de période d'essai.
  - Pourquoi : Réussir la première embauche.
  - P3 Plus tard · Moyenne · 1 sem. · J+130 · Responsable : Les deux
  - Prérequis : OPS-12, RH-03
  - Outils : Guide employé · Coût : 0 €
  - Livrable : Plan d'intégration

**Vérifications avant de clore la catégorie**

- [ ] Déclencheur d'embauche défini et suivi
- [ ] Obligations employeur listées et outil de paie choisi
- [ ] Guide employé prêt

**Erreurs fréquentes**

- Faire travailler un « auto-entrepreneur » comme un salarié (horaires imposés, un seul client, outils fournis) : requalification et rappel de cotisations.
- Recruter trop tard, quand vous êtes déjà épuisés et que la qualité baisse.

**Optimisations**

- L'alternance en gestion ou en hôtellerie est un premier recrutement souvent adapté, avec des aides à l'embauche.

### CRO · Croissance & structuration

_Passer de 5 à 50 logements sans désorganisation._

- [ ] **CRO-01 · Plan de croissance 10 → 25 → 50 logements**
  - Objectifs par trimestre, recrutements, prestataires, outils, trésorerie.
  - Pourquoi : Croissance préparée plutôt que subie.
  - P2 Moyenne · Moyenne · 1 j · J+100 · Responsable : Les deux
  - Prérequis : LAN-08, FIN-08
  - Outils : Prévisionnel · Coût : 0 €
  - Livrable : Plan de croissance
- [ ] **CRO-02 · Contrôle qualité aléatoire**
  - Une visite surprise par logement et par mois, grille de notation, retour au prestataire.
  - Pourquoi : La qualité se contrôle, elle ne se suppose pas.
  - P2 Moyenne · Facile · 2 h/sem. · J+100 · Responsable : Simon
  - Prérequis : LAN-08
  - Outils : Back-office · Coût : 0 €
  - Livrable : Grille + planning
- [ ] **CRO-03 · Nouveaux services**
  - Classement meublé, home staging, ameublement clé en main, location moyenne durée (bail mobilité), shooting photo seul.
  - Pourquoi : Revenus complémentaires sur la même clientèle.
  - P3 Plus tard · Moyenne · Continu · J+150 · Responsable : Les deux
  - Prérequis : LAN-08
  - Outils : — · Coût : Variable
  - Livrable : 1 nouveau service lancé
- [ ] **CRO-04 · Fidélisation voyageurs et réservation directe**
  - Base clients (consentement), offre retour, réservation directe.
  - Pourquoi : Réduit la dépendance aux plateformes.
  - P3 Plus tard · Moyenne · Continu · J+180 · Responsable : Moi
  - Prérequis : CHN-11
  - Outils : Brevo, site · Coût : Variable
  - Livrable : Programme de fidélité
- [ ] **CRO-05 · Extension géographique**
  - Étudier Bassin d'Arcachon, Saint-Émilion, Cap Ferret (forte saisonnalité, forte valeur) une fois Bordeaux rentable.
  - Pourquoi : Relais de croissance.
  - P3 Plus tard · Moyenne · 2 j · J+180 · Responsable : Les deux
  - Prérequis : CRO-01
  - Outils : Données marché, skill startup-strategy · Coût : 0 €
  - Livrable : Étude d'opportunité
- [ ] **CRO-06 · Revue stratégique trimestrielle**
  - Prix, marge par logement, départs de propriétaires, NPS, qualité, capacité, trésorerie.
  - Pourquoi : Garder le cap.
  - P2 Moyenne · Facile · 0,5 j/trimestre · J+90 · Responsable : Les deux
  - Prérequis : FIN-08
  - Outils : Tableau de bord · Coût : 0 €
  - Livrable : Compte rendu trimestriel
- [ ] **CRO-07 · Anticiper le passage à la TVA**
  - Suivre le chiffre d'affaires cumulé vs le seuil de franchise, simuler l'impact sur la marge, préparer les outils.
  - Pourquoi : Éviter un rappel de TVA non facturée.
  - P2 Moyenne · Facile · 1 h/mois · J+90 · Responsable : Moi
  - Prérequis : FIS-01, FIN-08
  - Outils : Tableau de bord · Coût : 0 €
  - Livrable : Alerte à 80 % du seuil

**Vérifications avant de clore la catégorie**

- [ ] Revue trimestrielle réalisée
- [ ] Marge par logement suivie et logements non rentables traités
- [ ] Contrôle qualité aléatoire en place

**Erreurs fréquentes**

- Accepter tous les logements pour grossir : un logement mal situé ou mal tenu coûte plus qu'il ne rapporte.
- Oublier le seuil de TVA en pleine croissance.

**Optimisations**

- Visez des grappes de logements proches : 10 logements dans le même quartier se gèrent comme 5 dispersés.

## Checklists

### Pré-lancement

Tout doit être validé avant d'ouvrir (Go / No-Go).

**Juridique & administratif**

- [ ] Kbis reçu
- [ ] Modèle juridique validé par un professionnel du droit
- [ ] Médiateur de la consommation désigné
- [ ] Espace impots.gouv et URSSAF actifs
- [ ] Compte bancaire pro opérationnel

**Assurances**

- [ ] RC Pro active (attestation reçue)
- [ ] Véhicule assuré en usage pro
- [ ] Règle d'assurance des propriétaires dans le contrat

**Contrats**

- [ ] Contrat propriétaire + annexes relus par un avocat
- [ ] CGV avec rétractation et médiateur
- [ ] Contrat prestataire signé avec chaque prestataire
- [ ] Parcours de signature électronique testé

**Réglementation**

- [ ] Fiches réglementaires par commune à jour
- [ ] Checklist d'éligibilité intégrée au processus commercial
- [ ] Circuit de la taxe de séjour clarifié

**Outils & plateformes**

- [ ] Channel manager connecté à Airbnb
- [ ] Test de surbooking réussi
- [ ] Messages automatiques actifs
- [ ] Back-office : rôles testés, sauvegardes actives
- [ ] 2FA sur tous les comptes critiques

**Opérations**

- [ ] 2 prestataires ménage par zone + 1 remplaçant
- [ ] Checklists ménage, arrivée, départ en place
- [ ] Linge : fournisseur et stock tampon
- [ ] Procédures d'urgence et astreinte
- [ ] Test pilote de bout en bout réussi

**Visibilité**

- [ ] Site en production avec pages légales
- [ ] Analytics et Search Console actifs
- [ ] Google Business Profile validé
- [ ] Plaquette, cartes de visite, signature mail prêtes

### Jour J

Le jour de l'ouverture officielle.

**Matin**

- [ ] Vérifier que le site, le formulaire et la prise de RDV fonctionnent
- [ ] Vérifier la réception des notifications de leads sur les deux téléphones
- [ ] Publier l'annonce de lancement sur LinkedIn (les deux profils)
- [ ] Publier sur Instagram et Facebook
- [ ] Publier un post sur Google Business Profile

**Journée**

- [ ] Envoyer le message au réseau personnel (liste préparée)
- [ ] Envoyer l'e-mail aux partenaires et prescripteurs
- [ ] Appeler les 10 prospects les plus chauds
- [ ] Répondre à chaque message dans l'heure
- [ ] Noter chaque contact dans le CRM

**Soir**

- [ ] Faire le point à deux : leads, RDV fixés, problèmes
- [ ] Vérifier l'astreinte de la nuit
- [ ] Préparer les relances du lendemain

### Première semaine

Transformer l'attention du lancement en rendez-vous.

**Commercial**

- [ ] Relancer tous les contacts du jour J (J+2)
- [ ] Tenir au moins 5 rendez-vous propriétaires
- [ ] Envoyer chaque proposition sous 24 h
- [ ] Rencontrer 3 prescripteurs (agents, notaires, CGP)
- [ ] Suivre les objectifs hebdomadaires dans le tableau de bord

**Opérations**

- [ ] Vérifier chaque automatisation (journal d'exécution)
- [ ] Ajuster les scripts selon les objections entendues
- [ ] Confirmer les disponibilités des prestataires pour les 4 prochaines semaines

**Visibilité**

- [ ] Publier 3 posts
- [ ] Demander 5 avis Google (réseau, partenaires ayant testé)
- [ ] Vérifier l'indexation du site dans Search Console

**Pilotage**

- [ ] Revue du vendredi : leads, RDV, signatures, incidents
- [ ] Mettre à jour la roadmap (tâches terminées, blocages)

### Premier mois

Premiers logements, premiers séjours, premiers ajustements.

**Objectifs**

- [ ] 3 à 5 propriétaires signés
- [ ] Premier logement en ligne
- [ ] Premier séjour réalisé avec une note de 5 étoiles
- [ ] Taux de réponse voyageurs à 100 %, délai < 15 min

**Qualité**

- [ ] Contrôle sur place de chaque premier ménage
- [ ] Débrief avec chaque propriétaire à J+7 de la mise en ligne
- [ ] Rétrospective des process et mise à jour des checklists

**Finance**

- [ ] Premier relevé propriétaire envoyé à l'heure
- [ ] Rapprochement bancaire complet
- [ ] Réel vs prévisionnel comparé
- [ ] Trésorerie à 90 jours vérifiée

**Croissance**

- [ ] Canaux d'acquisition classés par coût et conversion
- [ ] Programme apporteurs lancé
- [ ] Plan du mois 2 fixé

## Tableau de bord : KPI

| Indicateur | Groupe | Calcul | Fréquence | M1 | M3 | M6 | M12 |
|---|---|---|---|---:|---:|---:|---:|
| Propriétaires contactés | Commercial | Nombre de premiers contacts qualifiés | Semaine | 80 | 100 | 120 | 120 |
| Rendez-vous réalisés | Commercial | RDV ou visites tenus | Semaine | 12 | 15 | 20 | 20 |
| Taux contact → RDV | Commercial | RDV ÷ contacts | Mois | 15 % | 15 % | 17 % | 17 % |
| Logements signés (mois) | Commercial | Contrats signés dans le mois | Mois | 3 | 4 | 5 | 6 |
| Taux RDV → signature | Commercial | Signatures ÷ RDV | Mois | 25 % | 30 % | 30 % | 35 % |
| Coût d'acquisition | Commercial | Dépenses marketing ÷ logements signés | Mois | 150 € | 150 € | 200 € | 200 € |
| Logements actifs | Exploitation | Logements en ligne en fin de mois | Mois | 3 | 10 | 25 | 50 |
| Taux d'occupation | Exploitation | Nuits réservées ÷ nuits disponibles | Mois | 60 % | 65 % | 70 % | 72 % |
| Prix moyen par nuit (ADR) | Exploitation | Revenus hébergement ÷ nuits réservées | Mois | 90 € | 95 € | 100 € | 100 € |
| RevPAR | Exploitation | Revenus hébergement ÷ nuits disponibles | Mois | 55 € | 62 € | 70 € | 72 € |
| Note moyenne voyageurs | Qualité | Moyenne des notes reçues | Mois | 4,8 /5 | 4,8 /5 | 4,85 /5 | 4,85 /5 |
| Temps de réponse moyen | Qualité | Délai moyen de première réponse | Semaine | 15 min | 15 min | 10 min | 10 min |
| Incidents pour 100 séjours | Qualité | Incidents ÷ séjours × 100 | Mois | 5 | 4 | 3 | 3 |
| NPS propriétaires | Qualité | % promoteurs − % détracteurs | Trimestre | 50 | 50 | 60 | 60 |
| Propriétaires perdus (mois) | Qualité | Contrats résiliés dans le mois | Mois | 0 | 0 | 1 | 1 |
| Revenus locatifs gérés | Finance | Somme des revenus hébergement des logements gérés | Mois | 5 000 € | 18 000 € | 45 000 € | 90 000 € |
| Chiffre d'affaires conciergerie | Finance | Commissions + refacturations + services | Mois | 1 200 € | 4 200 € | 10 500 € | 21 000 € |
| Résultat du mois | Finance | CA − charges du mois | Mois | -1 500 € | 0 € | 3 000 € | 8 000 € |
| Trésorerie disponible | Finance | Solde bancaire hors provisions | Semaine | 8 000 € | 8 000 € | 12 000 € | 20 000 € |

## Budget de lancement (estimations HT)

| Poste | Bas | Haut |
|---|---:|---:|
| Création société (annonce légale, greffe, statuts) | 250 € | 1 800 € |
| Avocat : validation du modèle + relecture des contrats | 950 € | 3 000 € |
| Dépôt de marque INPI (3 classes) | 270 € | 270 € |
| Expert-comptable (3 premiers mois) | 300 € | 750 € |
| Assurances (acompte annuel) | 600 € | 2 000 € |
| Outils (3 premiers mois) | 450 € | 1 200 € |
| Channel manager + pricing (3 premiers mois, 5 logements) | 300 € | 900 € |
| Identité et supports (logo, plaquette, cartes, flyers) | 150 € | 1 200 € |
| Matériel (photo, kit ménage de contrôle, boîtes à clés de dépannage) | 300 € | 1 200 € |
| Marketing de lancement (tests pub, impression, événements) | 500 € | 2 000 € |
| Déplacements et stationnement (3 mois) | 300 € | 900 € |
| Réserve de sécurité | 3 000 € | 6 000 € |
| **Total** | **7 370 €** | **21 220 €** |

## Scripts commerciaux

### Appel sortant (prospect recommandé)

```text
Bonjour [Prénom], [Votre prénom] de Comme à la maison, conciergerie de location courte durée à Bordeaux. [Nom du contact] m'a dit que vous louiez votre appartement de [quartier] sur Airbnb. Je vous appelle pour une question simple : aujourd'hui, combien de temps y passez-vous par mois ?
→ Écouter.
Nous gérons tout de A à Z : annonce, prix, voyageurs, ménage, linge, et vous recevez chaque mois un relevé clair. Je vous propose de passer voir le logement 30 minutes cette semaine et de vous laisser une estimation de revenus chiffrée, sans engagement. Mardi 18 h ou jeudi 12 h ?
```

### Appel entrant (lead du site)

```text
1. Remercier et reformuler la demande.
2. Qualifier : adresse et commune, résidence principale ou secondaire, numéro d'enregistrement, déjà en location ou non, objectifs, calendrier.
3. Vérifier l'éligibilité réglementaire avant de promettre quoi que ce soit.
4. Proposer la visite-audit gratuite avec deux créneaux précis.
5. Envoyer la confirmation par SMS et e-mail dans la foulée.
```

### E-mail de prospection

```text
Objet : Votre logement à [quartier] : combien pourrait-il vous rapporter ?

Bonjour [Prénom],

Nous sommes [Moi] et Simon, fondateurs de Comme à la maison, conciergerie de location courte durée à Bordeaux Métropole.

Nous prenons en charge l'annonce, les prix, les voyageurs, le ménage, le linge et la maintenance. Vous gardez la main sur votre calendrier et recevez un relevé détaillé chaque mois.

Je vous propose une estimation gratuite de vos revenus, chiffrée à partir des données du marché bordelais : [lien RDV].

Belle journée,
[Signature]
```

### E-mail après rendez-vous

```text
Objet : Votre estimation et notre proposition pour [adresse]

Bonjour [Prénom],

Merci pour votre accueil. Comme convenu, vous trouverez ci-joint :
• l'estimation de revenus (fourchette prudente et haute),
• la formule que nous recommandons et son prix,
• les petits investissements qui feront la différence,
• le planning de mise en ligne (environ 10 jours).

Je vous appelle [jour] pour répondre à vos questions. Si tout vous convient, la signature se fait en ligne en 5 minutes.

[Signature]
```

### SMS de relance

```text
Bonjour [Prénom], c'est [Prénom] de Comme à la maison. Avez-vous pu regarder la proposition pour votre logement de [quartier] ? Je peux répondre à vos questions en 5 minutes par téléphone quand vous voulez.
```

### Message LinkedIn (prescripteur)

```text
Bonjour [Prénom], je lance avec Simon Comme à la maison, conciergerie de location courte durée à Bordeaux. Beaucoup de vos clients investisseurs se demandent combien leur bien rapporterait en courte durée et s'il est éligible. Nous faisons ces estimations gratuitement, avec vérification réglementaire. Un café de 20 minutes la semaine prochaine pour voir si nous pouvons être utiles à vos clients ?
```

### Message au réseau personnel

```text
Bonne nouvelle : avec Simon, nous lançons Comme à la maison, une conciergerie pour les propriétaires qui louent en courte durée à Bordeaux et autour. Si tu connais quelqu'un qui loue (ou voudrait louer) un appartement ou une maison sur Airbnb, je serais ravi que tu lui transmettes mon contact : [téléphone] / [site]. Merci !
```

## Réponses aux objections

**« Votre commission est trop chère. »**

Comparez le revenu net, pas la commission : un prix dynamique et une annonce optimisée augmentent souvent le revenu plus que ce que coûte la commission. Montrez l'estimation avec et sans conciergerie, et le temps libéré (souvent 10 à 15 heures par mois).

**« Je peux le faire moi-même. »**

Oui, et beaucoup le font au début. La question est le temps et la disponibilité : messages à 23 h, ménage le samedi, remplaçant quand vous partez en vacances. Proposez un essai sans engagement long, avec préavis d'un mois.

**« Je n'ose pas confier mes clés. »**

Montrez la procédure : clés codifiées sans adresse, serrure connectée ou boîte à code changée à chaque séjour, RC Pro, prestataires sous contrat et vérifiés, historique des accès.

**« Et si un voyageur abîme mon logement ? »**

Expliquez l'état des lieux photo à chaque départ, la déclaration dans les délais aux plateformes, le dépôt de garantie en réservation directe, et l'assurance adaptée que vous vérifiez à l'onboarding.

**« J'ai déjà une conciergerie. »**

Demandez ce qui pourrait être mieux (relevés, réactivité, avis). Proposez un audit gratuit de l'annonce actuelle : c'est souvent là que se voit la différence. Notez la date de fin de préavis dans le CRM.

**« Je ne sais pas si j'ai le droit de louer. »**

C'est justement votre point fort : vous vérifiez statut, numéro d'enregistrement, changement d'usage, copropriété et DPE avant toute mise en ligne. Vous refusez les logements non conformes.

**« Je ne veux pas m'engager. »**

Contrat sans durée minimum ou avec préavis court, frais de mise en service transparents, sortie propre prévue (restitution des accès, avis conservés).

**« Combien je vais gagner exactement ? »**

Donnez une fourchette basée sur des logements comparables et la saisonnalité bordelaise, jamais un chiffre garanti. Engagez-vous sur des moyens (réactivité, qualité, transparence), pas sur un résultat.

---

Les montants, seuils et règles cités sont indicatifs (septembre 2026). Faites valider les points juridiques, fiscaux et réglementaires par un avocat, l'expert-comptable et les mairies concernées.
