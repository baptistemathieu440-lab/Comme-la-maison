import type { ReactNode } from "react";

export function AuthHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <h1 className="font-display text-[1.75rem] font-medium leading-tight text-maison [font-stretch:92%]">{title}</h1>
      {children ? <div className="text-small text-ink-soft">{children}</div> : null}
    </div>
  );
}
