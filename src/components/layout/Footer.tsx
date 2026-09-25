import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { footerNav, legalNav } from "@/content/navigation";
import { site } from "@/content/site";
import { telHref } from "@/lib/format";

import { SocialIcon } from "./SocialIcon";

const socialLabels = { instagram: "Instagram", linkedin: "LinkedIn", facebook: "Facebook" } as const;

const linkClass =
  "inline-flex min-h-10 items-center text-cream/85 underline-offset-4 transition-colors hover:text-cream hover:underline";

export function Footer() {
  const socials = (Object.keys(site.socials) as Array<keyof typeof site.socials>).filter(
    (key) => site.socials[key],
  );
  const { phones, email, availability } = site.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-maison text-cream">
      <div className="mx-auto w-full max-w-[76rem] px-5 pb-10 pt-16 sm:px-8 lg:px-12 lg:pt-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_1.4fr_1fr] lg:gap-10">
          <div className="flex flex-col gap-5">
            <Link href="/" aria-label="Comme à la Maison, retour à l’accueil" className="-m-1 self-start rounded-lg p-1">
              <Logo layout="horizontal" tone="dark" className="h-12 w-auto" />
            </Link>
            <p className="max-w-[20rem] text-cream/85">
              Conciergerie à {site.area.city} et sa métropole.
            </p>
            {socials.length > 0 ? (
              <ul className="flex gap-2">
                {socials.map((key) => (
                  <li key={key}>
                    <a
                      href={site.socials[key] ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${socialLabels[key]} (nouvel onglet)`}
                      className="inline-flex size-11 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:bg-cream/10"
                    >
                      <SocialIcon network={key} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Plan du site" className="flex flex-col gap-4">
            <h2 className="text-caption text-olive-light">Navigation</h2>
            <ul className="flex flex-col">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4">
            <h2 className="text-caption text-olive-light">Contact</h2>
            <ul className="flex flex-col">
              {phones.map((phone) => (
                <li key={phone.number}>
                  <a href={telHref(phone.number)} className={`${linkClass} gap-2.5`}>
                    <Phone aria-hidden="true" className="size-4 shrink-0 text-olive-light" strokeWidth={1.75} />
                    <span>
                      {phone.name} <span className="whitespace-nowrap">{phone.number}</span>
                    </span>
                  </a>
                </li>
              ))}
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className={`${linkClass} gap-2.5 break-words`}>
                    <Mail aria-hidden="true" className="size-4 shrink-0 text-olive-light" strokeWidth={1.75} />
                    {email}
                  </a>
                </li>
              ) : null}
              <li className="flex min-h-10 items-center gap-2.5 text-cream/85">
                <MapPin aria-hidden="true" className="size-4 shrink-0 text-olive-light" strokeWidth={1.75} />
                {site.area.city} et sa métropole
              </li>
            </ul>
            {availability ? <p className="text-small text-cream/75">{availability}</p> : null}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-caption text-olive-light">Informations</h2>
            <ul className="flex flex-col">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/connexion" className={linkClass}>
                  Espace propriétaire
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-cream/15 pt-8 text-small text-cream/70 md:flex-row md:items-center md:justify-between">
          <p>
            Zone d’intervention : {site.area.city} et les {site.area.communes.length} communes de{" "}
            {site.area.region}.
          </p>
          <p>
            © {year} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
