import Image from "next/image";

import { Section } from "@/components/ui/Section";
import { serviceGroups } from "@/content/services";
import { cn } from "@/lib/cn";

/**
 * Nos offres en détail : une carte par famille. La photo occupe toute la hauteur de la
 * carte (pas de grande arche isolée), le texte et les services se lisent d'un bloc.
 */
export function ServiceGroups() {
  return (
    <Section id="services" spacing="flush-top" labelledBy="services-title">
      <h2 id="services-title" className="sr-only">
        Nos services
      </h2>
      <div className="flex flex-col gap-6 lg:gap-8">
        {serviceGroups.map((group, index) => (
          <article
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-title`}
            className={cn(
              "reveal grid overflow-hidden rounded-[var(--radius-panel)] border border-line/80 bg-surface",
              index % 2 === 1 ? "md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]" : "md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]",
            )}
          >
            <div className={cn("relative aspect-[16/9] md:aspect-auto md:min-h-full", index % 2 === 1 && "md:order-2")}>
              <Image
                src={group.image.src}
                alt={group.image.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1216px) 30rem, (min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-4 p-6 sm:p-8 lg:p-10">
              <div className="flex items-baseline gap-3">
                <span aria-hidden="true" className="font-display text-[1.5rem] leading-none text-terra-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 id={`${group.id}-title`} className="text-h2 text-maison">
                  {group.title}
                </h3>
              </div>
              <p className="text-lead max-w-[34rem] text-ink-soft">{group.summary}</p>
              <ul className="mt-2 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {group.services.map(({ title, text, icon: Icon }) => (
                  <li key={title} className="flex gap-3.5 border-t border-line pt-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-olive-light text-maison">
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-semibold leading-snug text-maison">{title}</h4>
                      <p className="text-small text-ink-soft">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
