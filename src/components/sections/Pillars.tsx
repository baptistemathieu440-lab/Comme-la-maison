import { Section, SectionHeader } from "@/components/ui/Section";
import { pillars } from "@/content/offer";

export function Pillars() {
  return (
    <Section labelledBy="pourquoi-title">
      <SectionHeader
        eyebrow="Pourquoi nous"
        titleId="pourquoi-title"
        title="Pourquoi Comme à la Maison ?"
      />
      <ul className="mt-12 grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {pillars.map(({ title, text, icon: Icon }) => (
          <li key={title} className="reveal flex gap-5 border-t border-line-strong/40 py-8">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-olive text-maison">
              <Icon aria-hidden="true" className="size-[1.375rem]" strokeWidth={1.5} />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-caption text-maison">{title}</h3>
              <p className="text-ink">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
