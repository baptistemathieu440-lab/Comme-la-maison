import QRCode from "qrcode";
import { Download } from "lucide-react";

import { CopyField } from "@/components/app/CopyField";
import { Notice, PageHeader, Panel, TextLink } from "@/components/app/ui";
import { Logo } from "@/components/brand/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { guide } from "@/content/guide/guide";
import { site } from "@/content/site";
import { adminContext } from "@/lib/auth/admin-context";

export const metadata = { title: "QR code du guide" };

/**
 * QR code à imprimer dans les logements. Il pointe toujours vers /guide :
 * le contenu du guide change depuis le back-office sans jamais réimprimer le code.
 */
export default async function GuideQrCodePage() {
  await adminContext();
  const url = `${site.url}/guide`;
  const options = { errorCorrectionLevel: "M" as const, margin: 2, color: { dark: "#354943", light: "#ffffff" } };
  const [svg, png] = await Promise.all([
    QRCode.toString(url, { ...options, type: "svg" }),
    QRCode.toDataURL(url, { ...options, width: 1200 }),
  ]);
  const svgHref = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const isLocal = url.startsWith("http://localhost");

  return (
    <>
      <PageHeader
        eyebrow={<TextLink href="/admin/guide">Guide voyageurs</TextLink>}
        title="QR code du guide"
        description="À imprimer dans chaque logement, dans le livret papier ou la box d’accueil, et à glisser dans les messages envoyés aux voyageurs."
      />

      {isLocal ? (
        <Notice tone="warning" title="Adresse de développement">
          Ce QR code pointe vers votre ordinateur. Générez-le depuis le site en ligne (ou renseignez NEXT_PUBLIC_SITE_URL) avant de l’imprimer.
        </Notice>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <Panel title="Carte à imprimer" id="carte">
          <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-line bg-cream p-6 text-center">
            <Logo layout="horizontal" className="h-10 w-auto" />
            <p className="font-display text-[1.375rem] leading-snug text-maison">{guide.tagline}</p>
            <div className="w-full max-w-[15rem] rounded-2xl bg-white p-2" dangerouslySetInnerHTML={{ __html: svg }} role="img" aria-label={`QR code vers ${url}`} />
            <p className="text-small text-ink-soft">Scannez avec l’appareil photo de votre téléphone</p>
            <p className="break-all text-small font-semibold text-maison">{url.replace(/^https?:\/\//, "")}</p>
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Télécharger" id="telecharger">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <a href={svgHref} download="qr-code-guide-comme-a-la-maison.svg" className={buttonClasses("primary", undefined, "sm")}>
                  <Download aria-hidden="true" className="size-4" />
                  SVG (impression, sans perte)
                </a>
                <a href={png} download="qr-code-guide-comme-a-la-maison.png" className={buttonClasses("secondary", undefined, "sm")}>
                  <Download aria-hidden="true" className="size-4" />
                  PNG 1200 px (messages, Canva)
                </a>
              </div>
              <CopyField label="Adresse du guide" value={url} hint="À coller dans les messages d’arrivée (Airbnb, Booking, SMS)." />
            </div>
          </Panel>
          <Panel title="Conseils d’impression" id="conseils">
            <ul className="flex list-disc flex-col gap-2 pl-5 text-small text-ink">
              <li>Imprimez le QR code à au moins 3 × 3 cm, sur fond clair, sans le déformer.</li>
              <li>Testez-le avec deux téléphones différents avant de l’installer dans un logement.</li>
              <li>Le code ne change jamais : modifiez les adresses ici, le guide se met à jour tout seul.</li>
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
