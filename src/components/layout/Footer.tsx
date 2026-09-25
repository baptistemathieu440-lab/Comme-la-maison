import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { legalNav, mainNav, primaryCta, type NavItem } from "@/content/navigation";
import { site } from "@/content/site";
import { telHref } from "@/lib/format";

import { SocialIcon } from "./SocialIcon";

const socialLabels = { instagram: "Instagram", linkedin: "LinkedIn", facebook: "Facebook" } as const;

export function Footer({ items = mainNav }: { items?: NavItem[] }) {
  const socials = (Object.keys(site.socials) as Array<keyof typeof site.socials>).filter(
    (key) => site.socials[key],
  );
  const { phones, email } = site.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-maison text-cream">
      <div className="mx-auto w-full max-w-[76rem] px-5 pb-12 pt-16 sm:px-8 lg:px-12 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
          <div className="flex flex-col gap-5">
            <Link href="/" aria-label="Comme à la Maison, retour à l’accueil" className="-m-1 self-start rounded-lg p-1">
              <Logo layout="horizontal" tone="dark" className="h-12 w-auto" />
            </Link>
            <p className="max-w-[22rem] text-cream/85">{site.summary}</p>
          </div>

          <nav aria-label="Plan du site" className="flex flex-col gap-4">
            <h2 className="text-caption text-olive-light">Navigation</h2>
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-10 items-center text-cream/90 underline-offset-4 hover:text-cream hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4">
            <h2 className="text-caption text-olive-light">Contact</h2>
            <ul className="flex flex-col gap-1">
              <li>
                <Link href={primaryCta.href} className="inline-flex min-h-10 items-center text-cream/90 underline-offset-4 hover:text-cream hover:underline">
                  {primaryCta.label}
                </Link>
              </li>
              {phones.map((phone) => (
                <li key={phone.number}>
                  <a href={telHref(phone.number)} className="inline-flex min-h-10 items-center gap-1.5 text-cream/90 underline-offset-4 hover:text-cream hover:underline">
                    <span className="text-cream/70">{phone.name}</span>
                    <span className="whitespace-nowrap">{phone.number}</span>
                  </a>
                </li>
              ))}
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className="inline-flex min-h-10 items-center break-all text-cream/90 underline-offset-4 hover:text-cream hover:underline">
                    {email}
                  </a>
                </li>
              ) : null}
            </ul>
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

          <div className="flex flex-col gap-4">
            <h2 className="text-caption text-olive-light">Informations</h2>
            <ul className="flex flex-col gap-1">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-10 items-center text-cream/90 underline-offset-4 hover:text-cream hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/20 pt-8 text-small text-cream/75 md:flex-row md:items-center md:justify-between">
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
