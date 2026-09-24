import { Calculator, Check, TrendingUp } from "lucide-react";

import { natureInfo, type DataNature } from "@/content/metrics";
import { cn } from "@/lib/cn";

/**
 * Badge de nature de donnée. Chaque nature se distingue par sa forme
 * (plein, hachuré, contour, pointillés), son icône et son libellé :
 * jamais par la couleur seule.
 */
export function DataBadge({
  nature,
  onDark = false,
  className,
}: {
  nature: DataNature;
  onDark?: boolean;
  className?: string;
}) {
  const styles: Record<DataNature, string> = {
    reel: onDark ? "bg-cream text-maison" : "bg-maison text-cream",
    simulation: "hatch text-ink",
    estimation: onDark
      ? "border-[1.5px] border-cream/80 text-cream"
      : "border-[1.5px] border-ink-soft bg-surface text-ink",
    projection: onDark
      ? "border-[1.5px] border-dashed border-cream/80 text-cream"
      : "border-[1.5px] border-dashed border-ink-soft bg-surface text-ink",
  };

  const icon = {
    reel: <Check aria-hidden="true" className="size-3.5" strokeWidth={2.25} />,
    simulation: <Calculator aria-hidden="true" className="size-3.5" strokeWidth={2} />,
    estimation: (
      <span aria-hidden="true" className="text-[0.95rem] leading-none">
        ≈
      </span>
    ),
    projection: <TrendingUp aria-hidden="true" className="size-3.5" strokeWidth={2} />,
  }[nature];

  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-2 rounded-full px-3 py-1.5 text-[0.8125rem] font-semibold leading-none tracking-[0.02em]",
        styles[nature],
        className,
      )}
    >
      {icon}
      {natureInfo[nature].label}
    </span>
  );
}
