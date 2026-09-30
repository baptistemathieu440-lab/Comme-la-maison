import Image from "next/image";
import { CalendarDays, Camera, MessageCircleHeart } from "lucide-react";

import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Period } from "@/components/ui/Section";
import { images, type SiteImage } from "@/content/images";
import { primaryCta } from "@/content/navigation";
import { site } from "@/content/site";

const promises = [
  { icon: Camera, text: "Photos et caractéristiques de chaque logement" },
  { icon: CalendarDays, text: "Disponibilités tenues à jour" },
  { icon: MessageCircleHeart, text: "Demande de séjour en direct, réponse personnelle" },
];

/**
 * Tant qu'aucun logement n'est publié depuis le back-office : une carte complète
 * (photo, ce que la page présentera, actions) plutôt qu'un bloc de texte isolé.
 * Aucun logement n'est inventé.
 */
export function ListingsEmptyState({
  titleId,
  headingLevel = "h2",
  image = images.linen,
}: {
  titleId: string;
  headingLevel?: "h2" | "h3";
  /** Photo d'ambiance : en choisir une qui n'apparaît pas juste à côté sur la page. */
  image?: SiteImage;
}) {
  const Heading = headingLevel;
  return (
    <div className="grid overflow-hidden rounded-[var(--radius-panel)] border border-line/80 bg-surface md:grid-cols-2">
      <div className="relative aspect-[16/10] md:aspect-auto md:min-h-full">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 768px) 38rem, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-5 p-6 sm:p-8 lg:p-10">
        <Heading id={titleId} className="text-h3 text-maison">
          Nos premiers logements arrivent bientôt
          <Period />
        </Heading>
        <p className="text-ink-soft">
          Aucun logement n’est encore présenté sur notre site. Cette page présentera les
          appartements et maisons que nous accompagnons à {site.area.city} et dans la métropole :
        </p>
        <ul className="flex flex-col gap-3">
          {promises.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-ink">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-olive-light text-maison">
                <Icon aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.5} />
              </span>
              {text}
            </li>
          ))}
        </ul>
        <p className="text-small text-ink-soft">Vous êtes propriétaire ? Votre bien pourrait être le premier présenté ici.</p>
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7">
          <ButtonLink href={primaryCta.href} arrow>
            {primaryCta.label}
          </ButtonLink>
          <ArrowLink href="/nos-offres">Découvrir nos offres</ArrowLink>
        </div>
      </div>
    </div>
  );
}
