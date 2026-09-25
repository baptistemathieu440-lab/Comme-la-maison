import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCta } from "@/components/layout/StickyCta";
import { siteNav } from "@/content/navigation";
import { hasPublicListings } from "@/server/public-listings";

/** Structure du site public : en-tête, contenu, pied de page et bouton d'estimation mobile. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  // Le lien « Logements » n'apparaît que si au moins un bien est publié depuis le back-office.
  const items = siteNav(await hasPublicListings());
  return (
    <>
      <Header items={items} />
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer items={items} />
      <StickyCta />
    </>
  );
}
