import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCta } from "@/components/layout/StickyCta";

/** Structure du site public : en-tête, contenu, pied de page et bouton d'estimation mobile. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
