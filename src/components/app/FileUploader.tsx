"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { Upload } from "lucide-react";

import { createBrowserSupabase } from "@/lib/supabase/browser";
import { cn } from "@/lib/cn";

type Ticket = { ok: true; bucket: string; path: string; token: string } | { ok: false; message: string };

/** Réduit une photo à 2 000 px de côté (JPEG) avant l'envoi : plus rapide sur le terrain. */
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/png") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 2_500_000) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    return blob ? new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }) : file;
  } catch {
    return file;
  }
}

/**
 * Envoi de fichiers : le serveur vérifie les droits et délivre une adresse d'envoi
 * signée, le navigateur envoie le fichier directement dans le stockage privé,
 * puis le serveur enregistre la ligne correspondante.
 */
export function FileUploader({
  requestUpload,
  confirmUpload,
  accept,
  label,
  hint,
  multiple = true,
  compress = true,
  capture,
  extraFields,
}: {
  requestUpload: (file: { name: string; type: string; size: number }) => Promise<Ticket>;
  confirmUpload: (path: string, meta: { name: string; type: string; size: number; fields: Record<string, string> }) => Promise<{ ok: boolean; message?: string }>;
  accept: string;
  label: string;
  hint?: string;
  multiple?: boolean;
  compress?: boolean;
  capture?: "environment" | "user";
  extraFields?: React.ReactNode;
}) {
  const id = useId();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [progress, setProgress] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("fichiers") as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) {
      setStatus({ tone: "error", text: "Choisissez au moins un fichier." });
      return;
    }
    const fields = Object.fromEntries(
      Array.from(new FormData(form).entries()).filter(([key, value]) => key !== "fichiers" && typeof value === "string"),
    ) as Record<string, string>;

    startTransition(async () => {
      const supabase = createBrowserSupabase();
      let done = 0;
      const failures: string[] = [];
      for (const original of files) {
        setProgress(`Envoi de ${original.name} (${done + 1}/${files.length})…`);
        const file = compress ? await compressImage(original) : original;
        const ticket = await requestUpload({ name: file.name, type: file.type, size: file.size });
        if (!ticket.ok) {
          failures.push(`${original.name} : ${ticket.message}`);
          continue;
        }
        const { error } = await supabase.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, file, {
          contentType: file.type,
        });
        if (error) {
          failures.push(`${original.name} : envoi interrompu.`);
          continue;
        }
        const saved = await confirmUpload(ticket.path, { name: original.name, type: file.type, size: file.size, fields });
        if (!saved.ok) failures.push(`${original.name} : ${saved.message ?? "non enregistré."}`);
        else done += 1;
      }
      setProgress(null);
      form.reset();
      setStatus(
        failures.length
          ? { tone: "error", text: `${done} fichier(s) enregistré(s). ${failures.join(" ")}` }
          : { tone: "ok", text: `${done} fichier(s) enregistré(s).` },
      );
      router.refresh();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-3" aria-busy={pending}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-[0.9375rem] font-semibold text-ink">
          {label}
        </label>
        {hint ? <span className="-mt-1 text-[0.8125rem] text-ink-soft">{hint}</span> : null}
        <input
          id={id}
          name="fichiers"
          type="file"
          accept={accept}
          multiple={multiple}
          capture={capture}
          className="block w-full rounded-[var(--radius-field)] border-[1.5px] border-dashed border-line-strong bg-white px-3 py-3 text-[0.9375rem] file:mr-3 file:rounded-full file:border-0 file:bg-olive-light file:px-4 file:py-2 file:font-semibold file:text-maison"
        />
      </div>
      {extraFields}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          aria-disabled={pending || undefined}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-full bg-maison px-5 text-[0.9375rem] font-semibold text-cream hover:bg-maison-hover",
            pending && "opacity-70",
          )}
        >
          <Upload aria-hidden="true" className="size-4" />
          {pending ? "Envoi…" : "Envoyer"}
        </button>
        <span role="status" className="text-small text-ink-soft">
          {progress}
        </span>
      </div>
      {status ? (
        <p role={status.tone === "error" ? "alert" : "status"} className={cn("text-small font-medium", status.tone === "error" ? "text-error" : "text-maison")}>
          {status.text}
        </p>
      ) : null}
    </form>
  );
}
