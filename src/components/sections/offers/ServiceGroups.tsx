import Image from "next/image";

import { Period, Section } from "@/components/ui/Section";
import { serviceGroups } from "@/content/services";
import { cn } from "@/lib/cn";

/** Nos offres en détail : chaque famille, sa photo et ses services. */
export function ServiceGroups() {
  return (
    <Section id="services" spacing="flush-top" labelledBy="services-title">
      <h2 id="services-title" className="sr-only">
        Nos services
      </h2>
      <div className="flex flex-col gap-20 lg:gap-28">
        {serviceGroups.map((group, index) => (
          <article
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-title`}
            className="grid items-center gap-10 md:grid-cols-[0.75fr_1fr] lg:gap-20"
          >
            <div className={cn("reveal mx-auto w-full max-w-[22rem] md:max-w-none", index % 2 === 1 && "md:order-2")}>
              <div className="arch relative aspect-[3/4]">
                <Image
                  src={group.image.src}
                  alt={group.image.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 26rem, (min-width: 768px) 38vw, 80vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-caption text-terra-text">{String(index + 1).padStart(2, "0")}</p>
              <h3 id={`${group.id}-title`} className="text-h2 -mt-2 text-maison">
                {group.title}
                <Period />
              </h3>
              <p className="text-lead max-w-[32rem] text-ink-soft">{group.summary}</p>
              <ul className="mt-2 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {group.services.map(({ title, text, icon: Icon }) => (
                  <li key={title} className="flex flex-col gap-2 border-t border-line pt-5">
                    <Icon aria-hidden="true" className="size-6 text-olive-deep" strokeWidth={1.25} />
                    <h4 className="font-semibold text-maison">{title}</h4>
                    <p className="text-small text-ink-soft">{text}</p>
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
