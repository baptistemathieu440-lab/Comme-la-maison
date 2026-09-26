import { ChevronDown } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Section } from "@/components/ui/Section";
import { faq } from "@/content/faq";

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-title" className="text-h2 text-maison">
            Questions fréquentes
          </h2>
          <p className="max-w-[26rem] text-ink">
            Vous ne trouvez pas votre réponse ? Posez-nous directement votre question, nous vous
            répondons personnellement.
          </p>
          <ButtonLink href="/contact" variant="ghost" className="self-start">
            Nous écrire
          </ButtonLink>
        </div>

        <div className="flex flex-col gap-3">
          {faq.map((item, i) => (
            <details
              key={item.question}
              name="faq"
              className="accordion group rounded-[1.25rem] border border-line bg-surface transition-colors open:border-line-strong/50"
              open={i === 0}
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-[1.25rem] px-5 py-4 font-display text-[1.1875rem] font-medium leading-snug tracking-[-0.005em] text-maison [font-stretch:92%] sm:px-6 [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-olive-light transition-transform duration-300 ease-soft group-open:rotate-180">
                  <ChevronDown aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.75} />
                </span>
              </summary>
              <div className="flex max-w-[44rem] flex-col gap-3 px-5 pb-6 text-ink sm:px-6">
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
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
