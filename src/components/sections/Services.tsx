import { Period, Section, SectionHeader } from "@/components/ui/Section";
import { services } from "@/content/services";

export function Services() {
  return (
    <Section id="services" tone="olive-light" labelledBy="services-title">
      <SectionHeader
        eyebrow="Nos services"
        titleId="services-title"
        title={
          <>
            Douze services, un seul interlocuteur
            <Period />
          </>
        }
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:grid-cols-4">
        {services.map(({ title, text, icon: Icon }) => (
          <li
            key={title}
            className="reveal flex flex-col gap-4 rounded-[var(--radius-card)] bg-surface p-6 transition-[transform,box-shadow] duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-soft"
          >
            <span className="grid size-12 place-items-center rounded-full bg-olive-light text-maison">
              <Icon aria-hidden="true" className="size-[1.375rem]" strokeWidth={1.5} />
            </span>
            <h3 className="font-display text-[1.25rem] font-medium leading-tight tracking-[-0.01em] text-maison [font-stretch:92%]">
              {title}
            </h3>
            <p className="text-small text-ink-soft">{text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
