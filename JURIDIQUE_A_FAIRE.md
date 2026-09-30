# Juridique : ce qu'il reste à faire — Comme à la Maison

Document de travail pour Baptiste et Simon. Mis à jour le 30 septembre 2026, après l'audit du site et de la
plateforme (détail technique : [`docs/audit-juridique.md`](docs/audit-juridique.md)).

> **À lire d'abord.** Ce document organise des démarches ; il ne remplace pas l'avis d'un avocat, d'un notaire,
> d'un expert-comptable ou de la CCI. Les couleurs 🔴 🟠 🟢 servent seulement à ordonner le travail : elles ne
> sont pas un avis juridique. Chaque fois qu'une règle peut avoir changé récemment, la source officielle est
> indiquée : **vérifiez la version en vigueur le jour où vous agissez.**
>
> Rien sur le site n'a été inventé : toute information manquante apparaît sous la forme
> `[À COMPLÉTER — …]` sur les pages légales. Le site ne sera pas « juridiquement terminé » tant que ces
> emplacements existent.

**Statuts** : `À FAIRE` · `EN COURS` · `FAIT`. Modifiez-les directement dans ce fichier.

---

## Sommaire

1. [La question n° 1 : loi Hoguet](#1-la-question-n-1--loi-hoguet)
2. [A — Avant le lancement](#a--avant-le-lancement)
3. [B — Avant le premier propriétaire](#b--avant-le-premier-propriétaire)
4. [C — Avant le premier voyageur](#c--avant-le-premier-voyageur)
5. [D — Régulièrement après le lancement](#d--régulièrement-après-le-lancement)
6. [Informations à compléter dans le site](#informations-à-compléter-dans-le-site)
7. [Contrat propriétaire : ce qu'il doit contenir](#contrat-propriétaire--ce-quil-doit-contenir)
8. [Questions à poser à l'avocat](#questions-à-poser-à-lavocat)
9. [Tableau des risques](#tableau-des-risques)
10. [Sources officielles](#sources-officielles)

---

## 1. La question n° 1 : loi Hoguet

**Pourquoi c'est la priorité.** La loi n° 70-9 du 2 janvier 1970 (dite loi Hoguet) réserve à des professionnels
titulaires d'une carte professionnelle (délivrée par la CCI), avec garantie financière et assurance, les
opérations portant sur les biens d'autrui, notamment « la location ou la sous-location, saisonnière ou non, en nu
ou en meublé » et « la gestion immobilière ». L'exercice sans carte d'une activité qui en relève est un délit.

**Ce que fait (ou annonce) Comme à la Maison aujourd'hui**, d'après le site et la plateforme :

| Prestation | Où elle apparaît | À qualifier ? |
| --- | --- | --- |
| Accueil, remise des clés, ménage, linge, box, suivi du logement | Nos offres, Tarifs | A priori services matériels ; à confirmer |
| Photos, estimation, étude du marché | Nos offres | A priori conseil ; à confirmer |
| **Création et mise à jour des annonces** | « Création de l'annonce » | **Oui** |
| **Fixation et ajustement des prix** | « Optimisation tarifaire : nous ajustons les prix » | **Oui** |
| **Gestion des réservations** (demandes, confirmations) | « Gestion des réservations », « Gestion complète de la location » | **Oui** |
| **Recueil de demandes de séjour de voyageurs pour le compte des propriétaires** | Page de chaque logement (`/nos-biens/…`) | **Oui — fonction fermée par précaution** |
| Communication avec les voyageurs | Nos offres | À confirmer |
| Encaissement des loyers | **Non** : le propriétaire encaisse directement | Point favorable, à écrire dans le contrat |
| **Règlement de la commission par la « part co-hôte » Airbnb** | Relevés (mode de règlement prévu dans la plateforme) | **Oui** : la plateforme verse alors directement une part du prix du séjour à la conciergerie |

**Ce qui a été fait dans le code, par précaution :**

- les demandes de séjour en ligne sont **fermées** (page du logement et serveur) tant que
  `stayRequestsValidated` vaut `false` dans `src/content/legal.ts` ;
- les pages légales affichent « Point en cours de vérification » tant que `hoguetStatus` vaut `"pending"` ;
- les textes « réservez en direct » ont été neutralisés.

**Ce qui n'a pas été modifié** (décision commerciale à prendre après l'avis juridique) : les textes des offres
dans `src/content/services.ts` et `src/content/offer.ts` (« Gestion complète », « Gestion des réservations »,
« Optimisation tarifaire », « Création de l'annonce »). Selon la réponse obtenue, il faudra soit les reformuler
(par exemple « assistance », « recommandations tarifaires validées par le propriétaire »), soit obtenir la carte.

**Démarche** : rendez-vous à la CCI Bordeaux Gironde (service formalités / cartes professionnelles) **et** avocat
en droit immobilier, avec la liste ci-dessus et un projet de contrat. Demandez une réponse écrite.

**Quand c'est tranché**, dans `src/content/legal.ts` :
- `hoguetStatus: "not-required"` (activité hors champ) ou `"card"` (carte obtenue, renseigner `professionalCard`,
  `financialGuarantee`) ;
- `stayRequestsValidated: true` seulement si le recueil de demandes de séjour a été validé.

---

## A — Avant le lancement

| # | Quoi faire | Pourquoi | Qui contacter | Document | Priorité | Oblig. / Reco. | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | Choisir la forme juridique (EI, SAS, SARL…) et le régime fiscal/social | Détermine TVA, charges, responsabilité, mentions légales | Expert-comptable, CCI | Étude comparative | 🔴 | Obligatoire | À FAIRE |
| A2 | Immatriculer l'entreprise sur le guichet unique | Obtenir SIREN/SIRET et l'inscription au RNE (et au RCS pour une société commerciale) | formalites.entreprises.gouv.fr | Statuts, justificatif de siège, pièce d'identité | 🔴 | Obligatoire | À FAIRE |
| A3 | Obtenir une réponse écrite sur la loi Hoguet (section 1) | Éviter l'exercice illégal d'une activité réglementée | CCI Bordeaux Gironde, avocat droit immobilier | Liste des prestations, projet de contrat | 🔴 | Obligatoire | À FAIRE |
| A4 | Si la carte est nécessaire : demande de carte (G et/ou T), garantie financière, RC pro | Condition d'exercice | CCI, garant financier, assureur | Dossier CCI, attestation de garantie, aptitude professionnelle | 🔴 | Obligatoire si applicable | À FAIRE |
| A5 | Souscrire une assurance responsabilité civile professionnelle adaptée (clés, codes d'accès, dommages chez les clients) | Couvrir les dommages causés aux propriétaires et aux tiers | Assureurs, courtier | Description précise de l'activité | 🔴 | Obligatoire si carte ; fortement recommandé sinon | À FAIRE |
| A6 | Vérifier les autres assurances utiles (véhicule professionnel, protection juridique, perte/vol des clés) | Risques propres à l'activité terrain | Courtier | — | 🟠 | Recommandé | À FAIRE |
| A7 | Ouvrir un compte bancaire professionnel | Séparer les flux ; obligatoire pour une société (dépôt du capital) | Banque | Statuts, Kbis | 🟠 | Obligatoire (société) | À FAIRE |
| A8 | Déterminer le régime de TVA (franchise ou assujettissement) et la mention à porter sur les factures | La commission est annoncée « TTC » : le taux et la mention doivent être exacts | Expert-comptable, service des impôts des entreprises | — | 🔴 | Obligatoire | À FAIRE |
| A9 | Renseigner l'identité légale dans `src/content/legal.ts` **et** dans le back-office (Paramètres) | Mentions légales du site (LCEN) et mentions obligatoires des factures | — | Kbis / avis INSEE | 🔴 | Obligatoire | À FAIRE |
| A10 | Choisir et adhérer à un médiateur de la consommation | Obligatoire dès qu'on vend des services à des particuliers | Liste des médiateurs agréés (CECMC) | Convention d'adhésion | 🔴 | Obligatoire (clients particuliers) | À FAIRE |
| A11 | Faire relire et compléter les conditions générales (`/conditions-generales-vente`) | Actuellement : projet avec emplacements, marqué « en cours de validation » | Avocat | Page actuelle | 🔴 | Obligatoire (information précontractuelle) | À FAIRE |
| A12 | Faire relire la politique de confidentialité, puis décider des durées de conservation | Les durées sont affichées `[À COMPLÉTER]` | Avocat ou conseil RGPD ; référentiel CNIL « gestion commerciale » | Page actuelle | 🟠 | Obligatoire | À FAIRE |
| A13 | Tenir un registre des traitements | Recenser les traitements (prospects, propriétaires, voyageurs, agents, comptes, avis) | Modèle CNIL | Inventaire de `docs/audit-juridique.md` §2 | 🟠 | Recommandé (fortement) | À FAIRE |
| A14 | Accepter les accords de traitement (DPA) de Netlify, Supabase et, s'il est utilisé, Resend | Encadrer les sous-traitants et transferts hors UE | Consoles des fournisseurs | DPA signés, archivés | 🟠 | Obligatoire | À FAIRE |
| A15 | Supabase : activer la protection contre les mots de passe compromis ; ramener la validité des codes/liens email sous 1 h | Signalés par le conseiller de sécurité Supabase | Tableau de bord Supabase > Authentication | — | 🟠 | Recommandé | À FAIRE |
| A16 | Netlify : vérifier la région d'exécution des fonctions (par défaut hors UE) ; si possible la placer en Europe | Limiter les transferts hors UE | Tableau de bord Netlify (selon l'offre) | — | 🟢 | Recommandé | À FAIRE |
| A17 | Documenter l'origine du logo et obtenir, si un tiers l'a créé, une cession écrite des droits | Le site revendique le logo ; la propriété n'est pas documentée | Créateur du logo | Contrat de cession de droits d'auteur | 🟠 | Recommandé | À FAIRE |
| A18 | Vérifier la disponibilité du nom « Comme à la Maison » et envisager un dépôt de marque | Risque de conflit avec une marque existante | INPI (base de marques) | Recherche d'antériorité | 🟠 | Recommandé | À FAIRE |
| A19 | Nom de domaine professionnel et adresse email à ce domaine | Crédibilité, envoi d'emails fiables (domaine vérifié chez Resend) | Registrar | — | 🟢 | Recommandé | À FAIRE |
| A20 | Mettre en place la comptabilité et la numérotation des factures | Les relevés-factures sont numérotés par la plateforme (préfixe CAM) ; vérifier la conformité | Expert-comptable | Paramètres de facturation | 🔴 | Obligatoire | À FAIRE |

## B — Avant le premier propriétaire

| # | Quoi faire | Pourquoi | Qui contacter | Document | Priorité | Oblig. / Reco. | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B1 | Faire rédiger le contrat propriétaire (voir section 7) | Seul document qui engage les parties ; aujourd'hui inexistant | Avocat | Trame de la section 7 | 🔴 | Obligatoire | À FAIRE |
| B2 | Prévoir le droit de rétractation de 14 jours et son formulaire pour un propriétaire particulier qui signe chez lui ou à distance | Code de la consommation (contrats hors établissement / à distance) | Avocat | Formulaire type de rétractation | 🔴 | Obligatoire (particuliers) | À FAIRE |
| B3 | Remettre avant signature les informations précontractuelles (prix, prestations, durée, médiateur) | Code de la consommation, art. L111-1 | — | CGV + contrat | 🔴 | Obligatoire | À FAIRE |
| B4 | Définir la liste des justificatifs demandés au propriétaire | Le propriétaire reste responsable de son logement ; vous devez pouvoir le démontrer | — | Liste : titre de propriété ou autorisation, déclaration/numéro d'enregistrement, autorisation de changement d'usage, règlement de copropriété, attestation d'assurance, DPE | 🔴 | Recommandé (fortement) | À FAIRE |
| B5 | Renseigner la fiche « Conformité du logement » de chaque bien (back-office) et déposer les justificatifs (Documents, catégorie « Conformité du logement ») | Suivi et preuve | — | Justificatifs de B4 | 🟠 | Recommandé | À FAIRE |
| B6 | Vérifier les règles de la commune du bien : Bordeaux et chacune des 27 autres communes de la métropole | Changement d'usage, compensation, limite de nuits et numéro d'enregistrement varient selon les communes | Mairie de la commune, Bordeaux Métropole | Délibérations municipales | 🔴 | Obligatoire (propriétaire) ; à vérifier par vous | À FAIRE |
| B7 | Limite de nuits : **Paramètres passés de 120 à 90 le 30/09/2026** (Bordeaux a voté 90 nuits pour les résidences principales à partir du 1er janvier 2026). Reste à confirmer auprès de la mairie de Bordeaux et à renseigner la limite propre à chaque autre commune sur la fiche du bien | Alerte de dépassement fiable | Mairie | Délibération | 🔴 | Recommandé | EN COURS |
| B8 | Vérifier l'obligation d'enregistrement national des meublés de tourisme (loi du 19 novembre 2024 : téléservice national, au plus tard le 20 mai 2026) et son état réel de mise en service | Le numéro doit figurer sur chaque annonce | service-public.fr, mairie | — | 🔴 | Obligatoire (propriétaire) | À FAIRE |
| B9 | Vérifier la règle DPE applicable aux meublés de tourisme (notamment ceux soumis à changement d'usage) | Critères énergétiques introduits par la loi du 19 novembre 2024 | Diagnostiqueur, mairie | DPE | 🟠 | Obligatoire selon le cas | À FAIRE |
| B10 | Exiger l'attestation d'assurance du propriétaire couvrant la location meublée de courte durée | Sinistre causé par un voyageur | Propriétaire | Attestation | 🟠 | Recommandé (fortement) | À FAIRE |
| B11 | Rappeler au propriétaire ses obligations fiscales (déclaration des revenus, régime micro-BIC/réel, CFE éventuelle) sans les prendre en charge | Éviter qu'il vous reproche un défaut de conseil | Expert-comptable du propriétaire | Fiche d'information | 🟢 | Recommandé | À FAIRE |
| B12 | Faire signer les contrats avec les prestataires (ménage, maintenance) : statut, assurance, SIRET, confidentialité des codes | Sous-traitance, risque de requalification, sécurité des accès | Avocat, expert-comptable | Contrat de prestation, attestation URSSAF de vigilance (au-delà de 5 000 € HT par an) | 🟠 | Obligatoire (vigilance) / Recommandé | À FAIRE |
| B13 | Si vous embauchez : contrat de travail, DPAE, registre du personnel, mutuelle, médecine du travail | Obligations d'employeur | URSSAF, expert-comptable | — | 🟠 | Obligatoire si salarié | À FAIRE |
| B14 | Décider qui est responsable du traitement des données des voyageurs (vous, le propriétaire, ou les deux) et l'écrire dans le contrat | Répartition des responsabilités RGPD | Avocat | Clause « données » | 🟠 | Obligatoire | À FAIRE |
| B15 | Recueillir l'accord écrit du propriétaire avant de publier son logement et ses photos sur le site ; faire céder les droits par le photographe | Droit à l'image des biens, droit d'auteur des photos | Photographe, propriétaire | Autorisation de publication, cession de droits | 🟠 | Recommandé (fortement) | À FAIRE |
| B16 | Mandat SEPA : si vous prélevez vos factures, faire signer un mandat SEPA (la plateforme prévoit une référence et une date) | Prélèvement de vos propres factures ; ne jamais encaisser les loyers | Banque | Mandat SEPA | 🟢 | Obligatoire si prélèvement | À FAIRE |

## C — Avant le premier voyageur

| # | Quoi faire | Pourquoi | Qui contacter | Document | Priorité | Oblig. / Reco. | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | Vérifier que chaque annonce affiche le numéro d'enregistrement | Code du tourisme ; la plateforme refuse désormais de publier un bien sur le site sans ce numéro | — | Fiche du bien | 🔴 | Obligatoire | À FAIRE |
| C2 | Vérifier la collecte de la taxe de séjour : par la plateforme (Airbnb, Booking) ou par le propriétaire (réservation directe) | Taxe due pour chaque nuitée ; le propriétaire en reste redevable | Bordeaux Métropole (taxe de séjour) | Délibération tarifaire | 🔴 | Obligatoire (propriétaire) | À FAIRE |
| C3 | Conditions d'annulation : choisir celles de la plateforme pour chaque annonce, et les écrire dans le contrat propriétaire | Éviter les litiges sur les remboursements | Propriétaire | Politique d'annulation | 🟠 | Recommandé | À FAIRE |
| C4 | Si les demandes de séjour directes sont ouvertes un jour : faire rédiger des conditions de séjour voyageurs (contrat de location saisonnière du propriétaire, état descriptif, prix, acompte, annulation) et définir qui encaisse | Aujourd'hui aucune réservation ni aucun paiement ne passe par le site ; à ne pas ouvrir sans validation (section 1) | Avocat | Contrat de location saisonnière | 🔴 | Obligatoire si ouverture | À FAIRE |
| C5 | Vérifier la capacité d'accueil déclarée et les équipements de sécurité (détecteur de fumée, etc.) | Sécurité des voyageurs ; responsabilité | Propriétaire | Checklist | 🟠 | Obligatoire (propriétaire) | À FAIRE |
| C6 | Livret d'accueil / guide : ne publier ni prix, ni note, ni horaire non sourcé ; garder les crédits photo | Règle du projet ; licences CC BY-SA (attribution, partage à l'identique des recadrages) | — | `docs/guide-voyageurs.md` | 🟢 | Recommandé | À FAIRE |
| C7 | Procédure en cas d'incident (dégât, voyageur problématique, intrusion) : qui prévenir, quelles preuves, quel délai | Déclaration de sinistre, preuves pour la plateforme (AirCover, etc.) | Assureur, propriétaire | Procédure écrite | 🟢 | Recommandé | À FAIRE |

## D — Régulièrement après le lancement

| # | Quoi faire | Pourquoi | Qui contacter | Document | Fréquence | Priorité | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D1 | Vérifier les nuits louées des résidences principales (tableau de bord et fiche du bien) | Limite annuelle | — | — | Mensuelle | 🔴 | À FAIRE |
| D2 | Relire les délibérations des communes (Bordeaux et métropole) et la réglementation nationale | Règles en évolution rapide depuis 2024 | Mairies, service-public.fr | — | Semestrielle | 🟠 | À FAIRE |
| D3 | Renouveler et archiver les attestations d'assurance (vous, propriétaires) | Couverture continue ; la fiche du bien alerte quand l'échéance est passée | Assureurs | Attestations | Annuelle | 🟠 | À FAIRE |
| D4 | Mettre à jour le registre des traitements et la politique de confidentialité à chaque nouvel outil | Transparence RGPD | — | Registre | À chaque changement | 🟠 | À FAIRE |
| D5 | **Avant d'ajouter un outil de mesure d'audience, un pixel, une vidéo ou un bouton social** : mettre à jour `/politique-cookies` et installer un recueil du consentement (accepter / refuser / paramétrer, refus aussi simple que l'acceptation, modifiable à tout moment) | Aujourd'hui aucun traceur soumis à consentement : aucun bandeau n'est nécessaire | CNIL (recommandations cookies) | — | À chaque ajout | 🟠 | À FAIRE |
| D6 | Appliquer les durées de conservation : supprimer prospects sans suite, anciennes demandes, comptes retirés ; décider d'une purge du journal d'activité | Aucune suppression automatique n'existe aujourd'hui ; le journal est conservé sans limite | Développeur | Durées décidées en A12 | Trimestrielle | 🟠 | À FAIRE |
| D7 | Supprimer les comptes de connexion des personnes qui n'ont plus d'accès (le retrait d'accès enlève le rôle mais laisse le compte d'authentification) | Minimisation des données, sécurité | Supabase > Authentication | — | Trimestrielle | 🟢 | À FAIRE |
| D8 | Sauvegardes : vérifier le plan Supabase (sauvegardes automatiques, restauration à un instant T) et tester une restauration | Continuité, obligation de sécurité (RGPD art. 32) | Supabase | — | Semestrielle | 🟠 | À FAIRE |
| D9 | Relancer le conseiller de sécurité Supabase et les tests `npm run test:e2e` (isolation par rôle) | Détecter une régression d'accès | Développeur | — | À chaque mise en production | 🟠 | À FAIRE |
| D10 | Conserver factures, relevés et pièces comptables 10 ans ; contrats 5 ans après leur fin (prescription de droit commun, à confirmer) | Obligations comptables, preuve | Expert-comptable | — | Continue | 🟠 | À FAIRE |
| D11 | Demandes RGPD (accès, effacement…) : répondre sous un mois | Droits des personnes | — | Modèle de réponse | À chaque demande | 🟠 | À FAIRE |
| D12 | En cas de fuite de données : notifier la CNIL sous 72 h si risque pour les personnes, et tenir un registre des violations | RGPD art. 33 | CNIL | Registre des violations | À chaque incident | 🔴 | À FAIRE |
| D13 | Déclarations fiscales et sociales de l'entreprise (TVA, CFE, résultats) | Obligations de l'entreprise | Expert-comptable | — | Selon calendrier | 🔴 | À FAIRE |
| D14 | Publier les avis clients uniquement avec l'accord écrit de leur auteur (la plateforme l'impose) ; ne jamais en inventer | Pratiques commerciales trompeuses | — | Accord de l'auteur | À chaque avis | 🟠 | À FAIRE |

---

## Informations à compléter dans le site

Fichier : `src/content/legal.ts` (site) — et **back-office > Paramètres** (factures PDF).

| Champ | Où le trouver | Affiché sur |
| --- | --- | --- |
| `company.legalName`, `legalForm`, `shareCapital`, `headOffice` | Statuts, Kbis | Mentions légales, confidentialité, CGV, pied de page |
| `company.siren`, `siret`, `registration` (RCS ou RNE) | Avis de situation INSEE, Kbis | Mentions légales, CGV, pied de page |
| `company.vatNumber` (ou mention de franchise) | Service des impôts / expert-comptable | Mentions légales, CGV |
| `company.publicationDirector` | Représentant légal | Mentions légales, confidentialité |
| `regulated.hoguetStatus`, `professionalCard`, `financialGuarantee` | Réponse CCI / avocat | Mentions légales, CGV |
| `regulated.liabilityInsurance` | Attestation d'assurance | Mentions légales, CGV |
| `regulated.consumerMediator` | Convention avec le médiateur | Mentions légales, CGV |
| `hosting.phone` | Netlify ne publie pas de téléphone : demander au support ou faire valider l'absence | Mentions légales |
| `privacy.postalAddress`, `privacy.dpo` (facultatif) | — | Confidentialité |
| `retention.*` | Décision (A12) | Confidentialité |
| `contract.*` (durée, préavis, paiement, pénalités, prestations complémentaires, tribunal) | Contrat validé (B1) | CGV |
| `stayRequestsValidated` | Réponse écrite (section 1) | Page de chaque logement |
| `site.contact.email` | Idéalement une adresse au nom de domaine de l'entreprise | Partout |

Les pages légales sont volontairement **non indexées** (`noindex`) et absentes du sitemap tant qu'elles contiennent
des emplacements à compléter. Une fois complètes, vous pouvez retirer `robots: { index: false … }` des quatre pages.

---

## Contrat propriétaire : ce qu'il doit contenir

Trame à remettre à l'avocat (elle ne remplace pas sa rédaction). Documents probablement nécessaires :
1. **Contrat de prestation de services de conciergerie** (conditions particulières par propriétaire et par bien) ;
2. **Conditions générales** (projet en ligne : `/conditions-generales-vente`) ;
3. **Annexes** : grille des prestations complémentaires, liste des justificatifs, formulaire de rétractation
   (particuliers), autorisation de publication des photos, clause ou accord sur les données personnelles.

Un **mandat** au sens de la loi Hoguet n'est à envisager que si l'avis juridique conclut qu'une carte est
nécessaire et obtenue.

Clauses à couvrir :
- Parties, bien concerné (adresse, référence), qualité du propriétaire (propriétaire ou locataire autorisé).
- Périmètre exact des prestations, **et ce que la conciergerie ne fait pas** (aucun encaissement de loyers ni de
  cautions, aucun engagement de revenu) ; qui crée et administre le compte de la plateforme ; qui accepte les
  réservations et fixe les prix (point Hoguet).
- Commission : 20 % TTC du prix des nuitées réellement perçu, après frais de plateforme ; frais de ménage et taxe
  de séjour hors base ; linge à la charge du propriétaire ; taux figé par réservation.
- Relevé mensuel valant facture ; ménage refacturé à l'identique ; frais avancés sur justificatif ; délai de
  paiement ; pénalités ; relevé finalisé non modifiable (régularisation sur le suivant).
- Durée, renouvellement, préavis, résiliation pour manquement, sort des réservations à venir, restitution des clés.
- Droit de rétractation (particulier, hors établissement ou à distance) et exécution anticipée sur demande expresse.
- Obligations du propriétaire : déclaration/enregistrement, changement d'usage, limite de nuits, copropriété,
  assurance, sécurité, DPE, fiscalité ; fourniture des justificatifs ; information en cas de changement.
- Garde des clés et codes : conservation, qui y accède, responsabilité en cas de perte.
- Responsabilité (obligation de moyens), exclusions raisonnables, assurances des deux parties.
- Données personnelles : rôle de chacun pour les données des voyageurs, confidentialité, sécurité.
- Photos : droits, autorisation de publication, retrait.
- Médiation de la consommation, droit applicable, juridiction.

---

## Questions à poser à l'avocat

1. Les prestations listées en section 1 (annonces, prix, acceptation des réservations, messages aux voyageurs,
   recueil de demandes de séjour directes) relèvent-elles de l'article 1er de la loi n° 70-9 du 2 janvier 1970 ?
   Quelles reformulations ou quel périmètre permettent de rester hors champ, le cas échéant ?
2. Le fait que le propriétaire encaisse seul les versements suffit-il, ou l'acceptation des réservations en son nom
   est-elle déterminante ? Le règlement de la commission par la « part co-hôte » Airbnb (versement direct de la
   plateforme à la conciergerie) change-t-il l'analyse ?
3. Faut-il un contrat de location saisonnière signé par le propriétaire pour les réservations directes, et qui peut
   le signer ?
4. Rôle RGPD pour les données des voyageurs : sous-traitant du propriétaire, responsable de traitement, ou
   responsables conjoints ?
5. Les conditions générales publiées et les clauses de responsabilité sont-elles adaptées (particuliers et
   professionnels) ?
6. Mentions obligatoires des relevés-factures (TVA, franchise, pénalités, indemnité de 40 € entre professionnels).
7. Durées de conservation à retenir pour chaque catégorie de données.

---

## Tableau des risques

Classement utilisé uniquement pour organiser le travail (🔴 critique · 🟠 important · 🟢 faible).

| Sujet | Risque identifié | Action | Priorité | Responsable | Statut |
| --- | --- | --- | --- | --- | --- |
| Loi Hoguet | Exercer sans carte une activité qui en relèverait (réservations, prix, annonces, demandes directes) | Avis écrit CCI + avocat ; demandes de séjour fermées en attendant | 🔴 | Baptiste & Simon + avocat | EN COURS (précautions techniques faites) |
| Identité de l'entreprise | Mentions légales et factures incomplètes | Immatriculer puis renseigner `legal.ts` et Paramètres | 🔴 | Baptiste & Simon | À FAIRE |
| Contrat propriétaire | Aucun cadre contractuel signé | Faire rédiger contrat + CGV | 🔴 | Avocat | À FAIRE |
| Rétractation | Contrat annulable / prolongation du délai si non informé | Clause + formulaire | 🔴 | Avocat | À FAIRE |
| Médiation | Obligation non remplie envers les particuliers | Adhérer à un médiateur | 🔴 | Baptiste & Simon | À FAIRE |
| Logements non conformes | Location d'un logement sans enregistrement, sans changement d'usage ou au-delà de la limite de nuits | Justificatifs, fiche conformité, publication bloquée sans numéro | 🔴 | Propriétaire (vous : vérification) | EN COURS (outil en place) |
| Limite de nuits | Limite appliquée différente de celle de la commune du bien | Paramètres passés à 90 (Bordeaux, à confirmer) ; limite propre à renseigner pour les autres communes | 🔴 | Baptiste & Simon | EN COURS |
| TVA | Mention « TTC » inexacte, facture non conforme | Décision avec l'expert-comptable | 🔴 | Expert-comptable | À FAIRE |
| Assurance RC pro | Dommage chez un client non couvert | Souscrire | 🔴 | Baptiste & Simon | À FAIRE |
| Durées de conservation | Données gardées sans limite (journal, prospects, comptes) | Décider puis appliquer | 🟠 | Baptiste & Simon + développeur | À FAIRE |
| Sous-traitants | Transferts hors UE non documentés | Accepter les DPA ; vérifier la région Netlify | 🟠 | Baptiste & Simon | À FAIRE |
| Sécurité des comptes | Mots de passe compromis acceptés ; liens email longs | Réglages Supabase (A15) | 🟠 | Baptiste & Simon | À FAIRE |
| Logo / marque | Droits non documentés, conflit de marque | Cession de droits, recherche INPI | 🟠 | Baptiste & Simon | À FAIRE |
| Photos | Publication sans accord ou droits du photographe | Autorisation + cession | 🟠 | Baptiste & Simon | À FAIRE |
| Cookies | Ajout futur d'un outil sans consentement | Règle D5 | 🟢 | Développeur | FAIT (aucun traceur soumis à consentement) |
| Isolation des données | Un propriétaire voit les données d'un autre | RLS vérifiée + tests d'isolation | 🟢 | Développeur | FAIT (à relancer à chaque version) |
| Prospection | Emails commerciaux sans consentement | Aucun aujourd'hui ; consentement + désinscription si ajout | 🟢 | Baptiste & Simon | FAIT (aucune prospection) |

---

## Sources officielles

À consulter dans leur version en vigueur (les liens pointent vers les textes, pas vers une version figée). Légifrance
refuse parfois l'ouverture directe d'un lien : recherchez alors l'intitulé du texte sur legifrance.gouv.fr.

**Activité réglementée**
- Loi n° 70-9 du 2 janvier 1970 (loi Hoguet), art. 1er et 3 — Légifrance :
  https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000512228
- Décret n° 72-678 du 20 juillet 1972 (application de la loi Hoguet) — Légifrance :
  https://www.legifrance.gouv.fr/loda/id/LEGITEXT000006061974
- CCI Bordeaux Gironde (cartes professionnelles) : https://www.bordeauxgironde.cci.fr

**Meublés de tourisme**
- Loi n° 2024-1039 du 19 novembre 2024 (régulation des meublés de tourisme) — Légifrance :
  https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000050612711
- Code du tourisme, art. L324-1 et suivants (déclaration, enregistrement, numéro sur les annonces) — Légifrance :
  https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006074073/LEGISCTA000006143189/
- Code de la construction et de l'habitation, art. L631-7 et suivants (changement d'usage) — Légifrance :
  https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006074096
- Ministère : « La location touristique meublée » et guide pratique 2025 :
  https://www.ecologie.gouv.fr/politiques-publiques/location-touristique-meublee
- economie.gouv.fr, règles pour sa résidence principale :
  https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/location-meublee-de-tourisme-quelles-sont-les-regles-respecter-pour-sa-residence
- Ville de Bordeaux, guide des propriétaires : https://www.bordeaux.fr/location-touristique-bordeaux--guide-proprietaires
- Ville de Bordeaux, séance du 8 juillet 2025 (limite de 90 jours) :
  https://www.bordeaux.fr/le-mag/seance-du-8-juillet-2025-la-location-saisonniere-limitee-a-90-jours-pour-soutenir-le
- Bordeaux Métropole (taxe de séjour, communes membres) : https://www.bordeaux-metropole.fr — et le site de chaque
  mairie pour les 27 autres communes.

**Entreprise, consommation, facturation**
- Guichet unique des formalités d'entreprises : https://formalites.entreprises.gouv.fr
- Code de la consommation (art. L111-1 information précontractuelle ; L221-18 et suivants rétractation ; L612-1
  médiation) — Légifrance : https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565
- Médiation de la consommation (liste des médiateurs, CECMC) : https://www.economie.gouv.fr/mediation-conso
- Code de commerce (L123-22 conservation comptable ; L441-9 et L441-10 factures et pénalités) — Légifrance :
  https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000005634379
- Code général des impôts (art. 293 B, franchise en base de TVA) — Légifrance :
  https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069577
- Service-Public Entreprendre (création, TVA, facturation) : https://entreprendre.service-public.fr

**Site internet et données personnelles**
- Loi n° 2004-575 du 21 juin 2004 (LCEN) : mentions obligatoires d'un site (identité de l'éditeur, directeur de la
  publication, hébergeur). La loi n° 2024-449 du 21 mai 2024 (SREN) a réorganisé certains articles : vérifier la
  numérotation en vigueur — Légifrance : https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164
- RGPD (règlement (UE) 2016/679) : https://eur-lex.europa.eu/eli/reg/2016/679/oj
- CNIL, cookies et autres traceurs : https://www.cnil.fr/fr/cookies-et-autres-traceurs
- CNIL, registre des traitements et modèles, référentiel « gestion commerciale » (durées de conservation), guide
  sécurité, notification des violations : https://www.cnil.fr (rubriques « Se mettre en conformité » et
  « Référentiels »)
- CNIL, plaintes : https://www.cnil.fr/fr/plaintes
- Hébergeur : politique de confidentialité de Netlify (identité, adresse, Data Privacy Framework) :
  https://www.netlify.com/privacy/
- Supabase, confidentialité et DPA : https://supabase.com/privacy

**Propriété intellectuelle**
- INPI (recherche et dépôt de marque) : https://www.inpi.fr
- Code de la propriété intellectuelle — Légifrance : https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069414
