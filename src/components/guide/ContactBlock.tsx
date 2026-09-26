import { Mail, MessageCircle, Phone } from "lucide-react";

import { guide } from "@/content/guide/guide";
import { site } from "@/content/site";
import { buttonClasses } from "@/components/ui/Button";
import { telHref } from "@/lib/format";

function smsHref(number: string) {
  return telHref(number).replace("tel:", "sms:");
}

/** « Besoin d'un conseil ? » : le guide comme porte d'entrée vers l'équipe. */
export function ContactBlock() {
  const { phones, email } = site.contact;
  return (
    <section id="contact" aria-labelledby="contact-titre" className="on-dark rounded-[var(--radius-panel)] bg-maison px-6 py-9 text-cream sm:px-10 sm:py-12">
      <div className="flex max-w-[40rem] flex-col gap-5">
        <h2 id="contact-titre" className="text-h2 text-cream">
          {guide.help.title}
        </h2>
        <ul className="flex flex-col gap-1.5 text-lead text-cream/90">
          {guide.help.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
        <p className="font-display text-[1.375rem] leading-snug text-cream">{guide.help.cta}</p>
        <ul className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {phones.map((phone) => (
            <li key={phone.number} className="flex flex-wrap gap-2">
              <a href={smsHref(phone.number)} className={buttonClasses("light", "min-w-[11rem]")}>
                <MessageCircle aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.9} />
                Écrire à {phone.name}
              </a>
              <a href={telHref(phone.number)} className={buttonClasses("ghost-light")} aria-label={`Appeler ${phone.name} au ${phone.number}`}>
                <Phone aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.9} />
                <span className="whitespace-nowrap">{phone.number}</span>
              </a>
            </li>
          ))}
          {email ? (
            <li>
              <a href={`mailto:${email}?subject=${encodeURIComponent("Un conseil pour mon séjour à Bordeaux")}`} className={buttonClasses("ghost-light")}>
                <Mail aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.9} />
                Par email
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}
