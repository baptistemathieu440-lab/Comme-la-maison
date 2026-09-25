import { ContactCta } from "@/components/sections/ContactCta";
import { Hero } from "@/components/sections/Hero";
import { FeaturedListings } from "@/components/sections/home/FeaturedListings";
import { OffersPreview } from "@/components/sections/home/OffersPreview";
import { PricingTeaser } from "@/components/sections/home/PricingTeaser";
import { OurPromise } from "@/components/sections/home/OurPromise";
import { Reviews } from "@/components/sections/home/Reviews";
import { WhyUs } from "@/components/sections/home/WhyUs";
import { publishedReviews } from "@/content/reviews";
import { JsonLd, homeJsonLd } from "@/lib/structured-data";

/**
 * Accueil : court et visuel. Qui, quoi, où, pourquoi, comment nous contacter ;
 * le détail vit sur les pages Nos offres, Nos biens et À propos.
 */
export default function HomePage() {
  const { items, examples } = publishedReviews();
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <Hero />
      <OurPromise />
      <OffersPreview />
      <PricingTeaser />
      <FeaturedListings />
      <WhyUs />
      <Reviews items={items} examples={examples} />
      <ContactCta />
    </>
  );
}
