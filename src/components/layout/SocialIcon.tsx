/** Pictogrammes des réseaux sociaux (Lucide ne fournit plus les logos de marques). */
export function SocialIcon({ network }: { network: "instagram" | "linkedin" | "facebook" }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "size-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (network === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (network === "linkedin") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 10.5V16M8 7.75v.01M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6 1.4 0 2.1.9 2.1 2.6V16" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M14.5 8H16V5h-2a3.5 3.5 0 0 0-3.5 3.5V11H8.5v3h2v7h3v-7H16l.5-3h-3V8.8a.8.8 0 0 1 .8-.8Z" />
    </svg>
  );
}
