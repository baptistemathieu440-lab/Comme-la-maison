import { site } from "@/content/site";
import { telHref } from "@/lib/format";

import { EmptyState } from "./ui";

/** Compte propriétaire sans fiche reliée (ou fiche retirée). */
export function OwnerNotLinked() {
  return (
    <EmptyState title="Votre espace n’est pas encore relié à votre fiche propriétaire.">
      Contactez{" "}
      {site.contact.phones.map((phone, index) => (
        <span key={phone.number}>
          {index > 0 ? " ou " : ""}
          {phone.name} au <a href={telHref(phone.number)} className="font-semibold text-maison underline">{phone.number}</a>
        </span>
      ))}
      .
    </EmptyState>
  );
}
