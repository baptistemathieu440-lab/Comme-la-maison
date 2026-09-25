import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Period } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu" tabIndex={-1} className="flex-1 bg-cream outline-none">
        <Container className="flex flex-col items-center gap-6 py-24 text-center sm:py-32">
          <Logo layout="symbol" className="size-20" />
          <h1 className="text-h2 text-maison">
            Cette page n’existe pas
            <Period />
          </h1>
          <p className="max-w-[30rem] text-ink">
            Le lien est peut-être incomplet, ou la page a été déplacée. Revenez à l’accueil pour
            trouver ce que vous cherchez.
          </p>
          <ButtonLink href="/" arrow>
            Retour à l’accueil
          </ButtonLink>
        </Container>
      </main>
      <Footer />
    </>
  );
}
