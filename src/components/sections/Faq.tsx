import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Section } from "@/components/ui/Section";
import { faq, type FaqItem } from "@/content/faq";

/**
 * Questions et réponses dépliables (<details> natif : clavier et lecteurs d'écran
 * sans JavaScript). « group » : une seule réponse ouverte à la fois dans le groupe.
 */
export function FaqAccordion({
  items,
  group = "faq",
  openFirst = false,
  headingLevel,
}: {
  items: FaqItem[];
  group?: string;
  openFirst?: boolean;
  /** Niveau de titre des questions, quand la liste suit un titre de page. */
  headingLevel?: "h3";
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <details
          key={item.question}
          name={group}
          className="accordion group rounded-[1.125rem] border border-line bg-surface transition-colors open:border-line-strong/50"
          open={openFirst && i === 0}
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-[1.125rem] px-5 py-3.5 text-maison sm:px-6 [&::-webkit-details-marker]:hidden">
            {headingLevel ? (
              <h3 className="font-display text-[1.1875rem] font-semibold leading-snug sm:text-[1.25rem]">{item.question}</h3>
            ) : (
              <span className="font-display text-[1.1875rem] font-semibold leading-snug sm:text-[1.25rem]">{item.question}</span>
            )}
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-olive-light transition-transform duration-300 ease-soft group-open:rotate-180">
              <ChevronDown aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </span>
          </summary>
          <div className="flex max-w-[44rem] flex-col gap-3 px-5 pb-5 text-ink sm:px-6">
            <p>{item.answer[0]}</p>
            {item.list ? (
              <ul className="flex flex-col gap-1.5 pl-1">
                {item.list.map((entry) => (
                  <li key={entry} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-olive-deep" />
                    <span>{entry}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {item.answer.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {item.link ? (
              <Link href={item.link.href} className="group/more inline-flex min-h-11 items-center gap-2 self-start text-button text-maison">
                <span className="border-b border-current/35 pb-1 group-hover/more:border-current">{item.link.label}</span>
                <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </Link>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}

/** Section FAQ : quelques questions et un renvoi vers la page FAQ complète. */
export function Faq({
  items = faq,
  title = "Questions fréquentes",
  moreHref = "/faq",
}: {
  items?: FaqItem[];
  title?: string;
  moreHref?: string;
}) {
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-title" className="text-h2 text-maison">
            {title}
          </h2>
          <p className="max-w-[26rem] text-ink">
            Vous ne trouvez pas votre réponse ? Posez-nous directement votre question, nous vous
            répondons personnellement.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={moreHref} variant="ghost" size="sm">
              Toutes les questions
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" size="sm" className="border-transparent">
              Nous écrire
            </ButtonLink>
          </div>
        </div>

        <FaqAccordion items={items} openFirst />
      </div>
    </Section>
  );
}
