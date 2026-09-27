import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Eyebrow, Section } from "@/components/ui/Section";
import { collaborationSteps } from "@/content/offer";
import { site } from "@/content/site";
import { telHref } from "@/lib/format";

import { ContactForm } from "./ContactForm";

const reassurance = [
  { icon: MessageCircle, text: "Un échange direct avec Baptiste ou Simon" },
  { icon: MapPin, text: "Bordeaux et toute la métropole" },
];

export function Contact() {
  const { phones, email, availability } = site.contact;

  return (
    <Section id="estimation" spacing="flush-top" labelledBy="estimation-title">
      <div className="overflow-hidden rounded-[var(--radius-panel)] bg-surface shadow-soft lg:grid lg:grid-cols-[0.85fr_1.15fr]">
        <div className="on-dark flex flex-col gap-6 bg-maison p-6 text-cream sm:p-10 lg:p-12">
          <Eyebrow surface="dark">Estimation</Eyebrow>
          <h2 id="estimation-title" className="text-h2 text-cream">
            Présentez-nous votre logement
          </h2>
          <p className="text-lead text-cream/90">
            Quelques informations suffisent : nous revenons vers vous pour parler de son potentiel en
            location courte durée.
          </p>

          <ul className="mt-2 flex flex-col gap-3">
            {reassurance.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-cream/90">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream/10">
                  <Icon aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.75} />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-4 border-t border-cream/20 pt-6">
            <h3 className="text-caption text-olive-light">Et ensuite ?</h3>
            <ol className="flex flex-col gap-4">
              {collaborationSteps.slice(0, 3).map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-cream/40 text-[0.8125rem] font-semibold tabular-nums">
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-semibold text-cream">{step.title}</span>
                    <span className="text-small text-cream/80">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {phones.length > 0 || email ? (
            <div className="mt-auto flex flex-col gap-3 border-t border-cream/20 pt-6">
              <p className="text-caption text-olive-light">Nous joindre directement</p>
              {phones.map((phone) => (
                <a
                  key={phone.number}
                  href={telHref(phone.number)}
                  className="inline-flex min-h-11 items-center gap-3 font-medium text-cream underline-offset-4 hover:underline"
                >
                  <Phone aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} />
                  <span>
                    {phone.name} <span className="whitespace-nowrap">{phone.number}</span>
                  </span>
                </a>
              ))}
              {email ? (
                <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-3 break-all font-medium text-cream underline-offset-4 hover:underline">
                  <Mail aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} />
                  {email}
                </a>
              ) : null}
              {availability ? <p className="text-small text-cream/80">{availability}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
