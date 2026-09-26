import Image from "next/image";
import Link from "next/link";

import { ArrowLink } from "@/components/ui/Button";
import { Period, Section, SectionHeader } from "@/components/ui/Section";
import { serviceGroups } from "@/content/services";

/** Aperçu de nos offres : quatre familles, le détail est sur la page Nos offres. */
export function OffersPreview() {
  return (
    <Section tone="surface" labelledBy="offres-title" className="border-y border-line/50">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Nos offres"
          titleId="offres-title"
          title={
            <>
              Tout ce dont votre logement a besoin
              <Period />
            </>
          }
        />
        <ArrowLink href="/nos-offres" className="shrink-0 self-start md:self-end">
          Découvrir toutes nos offres
        </ArrowLink>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:mt-16 lg:grid-cols-4">
        {serviceGroups.map((group) => (
          <li key={group.id} className="reveal group relative flex flex-col gap-4">
            <div className="arch relative aspect-[3/4] bg-stone">
              <Image
                src={group.image.src}
                alt=""
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 18rem, 45vw"
                className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
              />
            </div>
            <h3 className="font-display text-[1.125rem] font-medium leading-snug text-maison sm:text-[1.3125rem]">
              <Link href={`/nos-offres#${group.id}`} className="after:absolute after:inset-0">
                {group.title}
              </Link>
            </h3>
            <p className="-mt-2 hidden text-small text-ink-soft sm:block">{group.summary}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
