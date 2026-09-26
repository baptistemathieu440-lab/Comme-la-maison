import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCta } from "@/components/layout/StickyCta";

/** Structure du site public : en-tête, contenu, pied de page et bouton « Confier mon bien » sur mobile. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="site-theme flex flex-1 flex-col">
      <Header />
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
}
