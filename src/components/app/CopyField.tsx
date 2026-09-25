"use client";

import { Check, Copy } from "lucide-react";
import { useId, useState } from "react";

/** Champ en lecture seule avec bouton « Copier » (adresse de calendrier, lien d'invitation). */
export function CopyField({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const id = useId();
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.875rem] font-semibold text-ink">
        {label}
      </label>
      {hint ? <span className="-mt-1 text-[0.8125rem] text-ink-soft">{hint}</span> : null}
      <div className="flex gap-2">
        <input
          id={id}
          readOnly
          value={value}
          onFocus={(event) => event.currentTarget.select()}
          className="min-h-11 w-full min-w-0 rounded-[var(--radius-field)] border-[1.5px] border-line-strong bg-stone/50 px-3 font-mono text-[0.8125rem] text-ink"
        />
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          }}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-maison px-4 text-[0.875rem] font-semibold text-maison hover:bg-olive-light"
        >
          {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
          {copied ? "Copié" : "Copier"}
        </button>
        <span role="status" className="sr-only">
          {copied ? "Adresse copiée" : ""}
        </span>
      </div>
    </div>
  );
}
