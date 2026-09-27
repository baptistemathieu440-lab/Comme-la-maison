import type { Metadata } from "next";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { DataBadge } from "@/components/ui/DataBadge";
import { Container, Eyebrow, Period } from "@/components/ui/Section";
import type { DataNature } from "@/content/metrics";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "Olive pastel", role: "Primary", token: "olive", hex: "#B4BE9C", text: "text-ink" },
  { name: "Vert maison", role: "Primary Dark", token: "maison", hex: "#354943", text: "text-cream" },
  { name: "Olive brume", role: "Primary Light", token: "olive-light", hex: "#E4E8D8", text: "text-ink" },
  { name: "Crème", role: "Background", token: "cream", hex: "#F5F0E7", text: "text-ink" },
  { name: "Pierre blonde", role: "Background Secondary", token: "stone", hex: "#EDE4D3", text: "text-ink" },
  { name: "Blanc cassé", role: "Surface", token: "surface", hex: "#FBF8F2", text: "text-ink" },
  { name: "Encre", role: "Text", token: "ink", hex: "#23302B", text: "text-cream" },
  { name: "Gris sauge", role: "Text Secondary", token: "ink-soft", hex: "#56625C", text: "text-cream" },
  { name: "Lin", role: "Border", token: "line", hex: "#DDD3C1", text: "text-ink" },
  { name: "Terracotta", role: "Accent", token: "terra", hex: "#BB6C51", text: "text-surface" },
  { name: "Terracotta foncé", role: "Accent Text", token: "terra-text", hex: "#9E5139", text: "text-surface" },
  { name: "Brique", role: "Error", token: "error", hex: "#A33A2B", text: "text-surface" },
];

const bg: Record<string, string> = {
  olive: "bg-olive",
  maison: "bg-maison",
  "olive-light": "bg-olive-light",
  cream: "bg-cream",
  stone: "bg-stone",
  surface: "bg-surface",
  ink: "bg-ink",
  "ink-soft": "bg-ink-soft",
  line: "bg-line",
  terra: "bg-terra",
  "terra-text": "bg-terra-text",
  error: "bg-error",
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6 border-t border-line py-12">
      <h2 className="text-h3 text-maison">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <Container className="pb-24 pt-14">
      <Eyebrow>Page interne, non indexée</Eyebrow>
      <h1 className="text-h1 mt-5 text-maison">
        Design system
        <Period />
      </h1>
      <p className="text-lead mt-5 max-w-[40rem]">
        Les briques du site Comme à la Maison. Les tokens sont définis dans{" "}
        <code className="rounded bg-olive-light px-1.5">src/app/globals.css</code>.
      </p>

      <Block title="Logo">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid place-items-center rounded-[var(--radius-card)] border border-line bg-surface p-10">
            <Logo layout="vertical" title="Comme à la Maison" className="h-44 w-auto" />
          </div>
          <div className="grid place-items-center rounded-[var(--radius-card)] bg-maison p-10">
            <Logo layout="vertical" tone="dark" title="Comme à la Maison" className="h-44 w-auto" />
          </div>
          <div className="grid place-items-center rounded-[var(--radius-card)] bg-olive p-10">
            <Logo layout="horizontal" className="h-14 w-auto" />
          </div>
          <div className="flex items-end justify-center gap-8 rounded-[var(--radius-card)] border border-line bg-surface p-10 text-maison">
            <Logo layout="symbol" small className="size-4" />
            <Logo layout="symbol" small className="size-8" />
            <Logo layout="symbol" className="size-16" />
            <Logo layout="symbol" tone="mono" className="size-16" />
          </div>
        </div>
        <p className="text-small text-ink-soft">
          Fichiers SVG dans <code>public/brand/</code>. Le logo fourni écrit « maison » en minuscule ;
          la prop <code>capitalized</code> du composant Logo passe à « Maison ».
        </p>
      </Block>

      <Block title="Couleurs">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {colors.map((c) => (
            <li key={c.token} className="overflow-hidden rounded-[1.25rem] border border-line bg-surface">
              <div className={`${bg[c.token]} ${c.text} flex h-20 items-end p-3 text-caption`}>{c.role}</div>
              <div className="flex flex-col p-3 text-small">
                <span className="font-semibold">{c.name}</span>
                <span className="text-ink-soft">
                  {c.hex} · <code>{c.token}</code>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Typographie">
        <div className="flex flex-col gap-6">
          <p className="text-h1 text-maison">H1 · Votre logement</p>
          <p className="text-h2 text-maison">H2 · Vous louez. Nous gérons.</p>
          <p className="text-h3 text-maison">H3 · Une attention qui commence dès l’arrivée</p>
          <p className="text-lead">Lead · Conciergerie Airbnb et location courte durée à Bordeaux.</p>
          <p className="text-body max-w-[40rem]">
            Body · Votre logement mérite une attention particulière. Nous prenons en charge chaque étape
            de sa location courte durée.
          </p>
          <p className="text-small text-ink-soft">Small · Simulation indicative.</p>
          <p className="text-button text-maison">Button · Estimer mon logement</p>
          <p className="text-caption text-ink-soft">Caption · Notre accompagnement</p>
        </div>
      </Block>

      <Block title="Boutons">
        <div className="flex flex-wrap gap-3">
          <Button arrow>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Petite taille</Button>
        </div>
        <div className="flex flex-wrap gap-3 rounded-[var(--radius-card)] bg-maison p-6 on-dark">
          <Button variant="light" arrow>
            Light
          </Button>
          <Button variant="ghost-light">Ghost light</Button>
        </div>
        <p className="text-small text-ink-soft">
          Survol, clic et focus clavier (Tab) sont visibles sur chaque bouton.
        </p>
      </Block>

      <Block title="Nature des données">
        <div className="flex flex-wrap gap-3">
          {(["reel", "simulation", "estimation", "projection"] as DataNature[]).map((n) => (
            <DataBadge key={n} nature={n} />
          ))}
        </div>
      </Block>
    </Container>
  );
}
