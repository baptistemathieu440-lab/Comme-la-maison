import { ContactCta } from "@/components/sections/ContactCta";
import { Hero } from "@/components/sections/Hero";
import { FeaturedListings } from "@/components/sections/home/FeaturedListings";
import { OffersPreview } from "@/components/sections/home/OffersPreview";
import { PricingTeaser } from "@/components/sections/home/PricingTeaser";
import { OurPromise } from "@/components/sections/home/OurPromise";
import { Reviews } from "@/components/sections/home/Reviews";
import { WhyUs } from "@/components/sections/home/WhyUs";
import { JsonLd, homeJsonLd } from "@/lib/structured-data";
import { getPublishedReviews } from "@/server/reviews";

/**
 * Accueil : court et visuel. Qui, quoi, où, pourquoi, comment nous contacter ;
 * le détail vit sur les pages Nos offres, Nos biens et À propos.
 */
export default async function HomePage() {
  const reviews = await getPublishedReviews();
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <Hero />
      <OurPromise />
      <OffersPreview />
      <PricingTeaser />
      <FeaturedListings />
      <WhyUs />
      {/* Aucun avis inventé : la section n'apparaît qu'avec de vrais avis. */}
      {reviews.length > 0 ? <Reviews items={reviews} /> : null}
      <ContactCta />
    </>
  );
}
