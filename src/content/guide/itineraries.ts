/**
 * Itinéraires « 24 h, 48 h, 72 h à Bordeaux ».
 *
 * Chaque journée reste dans un même secteur pour éviter les allers-retours :
 * jour 1 le centre historique à pied, jour 2 le nord (Chartrons, Bacalan,
 * Bassins à flot) en tram B, jour 3 une excursion à la journée.
 * `place` renvoie vers la fiche d'une adresse du guide (slug).
 */

export type ItineraryStep = { moment: string; title: string; text: string; place?: string };
export type ItineraryDay = { title: string; area: string; steps: ItineraryStep[] };
export type Itinerary = { slug: string; label: string; title: string; teaser: string; intro: string; days: ItineraryDay[] };

const day1: ItineraryDay = {
  title: "Le Bordeaux historique, à pied",
  area: "Centre historique et quais",
  steps: [
    {
      moment: "Matin",
      title: "Pey-Berland, la cathédrale et sa tour",
      text: "Café au Black List face à la cathédrale, visite de Saint-André puis montée à la tour Pey-Berland pour la vue sur les toits.",
      place: "tour-pey-berland",
    },
    {
      moment: "Fin de matinée",
      title: "La Grosse Cloche et le vieux Bordeaux",
      text: "Descendez par la rue Saint-James jusqu’à la Grosse Cloche, puis flânez dans le quartier Saint-Pierre jusqu’à la Porte Cailhau.",
      place: "grosse-cloche",
    },
    {
      moment: "Midi",
      title: "Déjeuner dans le quartier Saint-Pierre",
      text: "Un plateau iodé au Petit Commerce, ou des tartines en terrasse place du Parlement.",
      place: "le-petit-commerce",
    },
    {
      moment: "Après-midi",
      title: "Place de la Bourse et les quais",
      text: "Le Miroir d’eau, puis la promenade des quais vers le nord jusqu’au quartier des Chartrons et la rue Notre-Dame.",
      place: "place-de-la-bourse",
    },
    {
      moment: "Apéritif",
      title: "Un verre de bordeaux au Bar à Vin",
      text: "Sur le chemin du retour, le bar de la Maison du Vin sert des bordeaux au verre à prix doux.",
      place: "bar-a-vin-civb",
    },
    {
      moment: "Dîner",
      title: "Cuisine du Sud-Ouest",
      text: "La Brasserie Bordelaise, à cinq minutes à pied : produits du terroir et belle cave. Réservez.",
      place: "brasserie-bordelaise",
    },
    {
      moment: "Soirée",
      title: "Bordeaux illuminée",
      text: "Retour au Miroir d’eau à la nuit tombée, puis traversée du pont de Pierre pour la vue sur les façades éclairées.",
      place: "pont-de-pierre",
    },
  ],
};

const day2: ItineraryDay = {
  title: "Vin, art et bassins à flot",
  area: "Chartrons, Bacalan et Bassins à flot (tram B)",
  steps: [
    {
      moment: "Matin",
      title: "La Cité du Vin",
      text: "Arrivez à l’ouverture (tram B, arrêt La Cité du Vin) : la visite se termine par une dégustation au Belvédère.",
      place: "cite-du-vin",
    },
    {
      moment: "Midi",
      title: "Les Halles de Bacalan",
      text: "Juste en face : chacun choisit son stand, on partage une grande table.",
      place: "halles-de-bacalan",
    },
    {
      moment: "Après-midi",
      title: "Bassins des Lumières",
      text: "Une dizaine de minutes à pied : l’art numérique projeté dans l’ancienne base sous-marine.",
      place: "bassins-des-lumieres",
    },
    {
      moment: "Apéritif",
      title: "Un rooftop face à la Garonne",
      text: "Montez au 9ᵉ étage de Gina pour le coucher de soleil sur la Cité du Vin et le pont Chaban-Delmas.",
      place: "gina-rooftop",
    },
    {
      moment: "Dîner",
      title: "Un bistrot des Chartrons",
      text: "Redescendez en tram B jusqu’aux Chartrons pour dîner Chez Dupont.",
      place: "chez-dupont",
    },
    {
      moment: "Soirée",
      title: "Cocktails sur les quais",
      text: "Un dernier verre chez Symbiose, quai des Chartrons.",
      place: "symbiose",
    },
  ],
};

const day3: ItineraryDay = {
  title: "Une journée à Saint-Émilion",
  area: "Excursion (environ 50 min en voiture, ou train)",
  steps: [
    {
      moment: "Matin",
      title: "Saint-Émilion souterrain",
      text: "Commencez par la visite guidée de l’église monolithe et des catacombes (billets à l’office de tourisme).",
      place: "saint-emilion",
    },
    {
      moment: "Midi",
      title: "Déjeuner au village",
      text: "Déjeunez tôt dans le village, puis goûtez les macarons de Saint-Émilion.",
    },
    {
      moment: "Après-midi",
      title: "Un château dans les vignes",
      text: "Réservez une visite-dégustation dans un château (l’office de tourisme vous oriente), ou partez en excursion organisée si vous n’avez pas de voiture.",
      place: "excursion-vignoble-office-tourisme",
    },
    {
      moment: "Dîner",
      title: "Face aux quais illuminés",
      text: "De retour à Bordeaux, dîner au Café du Port, sur la rive droite, face aux façades éclairées.",
      place: "cafe-du-port",
    },
    {
      moment: "Soirée",
      title: "Guinguette (en saison)",
      text: "D’avril à octobre, finissez à la guinguette Chez Alriq, à quelques minutes à pied le long des quais.",
      place: "chez-alriq",
    },
  ],
};

export const itineraries: Itinerary[] = [
  {
    slug: "24h",
    label: "24 h",
    teaser: "L’essentiel du centre historique, à pied",
    title: "Vous avez seulement 24 h ?",
    intro: "L’essentiel du centre historique, entièrement à pied : de la cathédrale aux quais, jusqu’au Miroir d’eau de nuit.",
    days: [day1],
  },
  {
    slug: "48h",
    label: "48 h",
    teaser: "Le centre, puis le vin et les bassins à flot",
    title: "48 h à Bordeaux",
    intro: "Le centre historique le premier jour, puis le vin, l’art et les bassins à flot au nord de la ville.",
    days: [day1, day2],
  },
  {
    slug: "72h",
    label: "72 h",
    teaser: "Deux jours en ville, un jour dans les vignes",
    title: "72 h à Bordeaux",
    intro: "Deux jours en ville, puis une journée dans les vignes de Saint-Émilion. Envie d’océan plutôt ? Remplacez le jour 3 par la Dune du Pilat et Arcachon.",
    days: [day1, day2, day3],
  },
];
