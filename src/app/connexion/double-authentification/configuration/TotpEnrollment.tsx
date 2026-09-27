"use client";

import { useState, useTransition } from "react";

import { ActionForm, Field, Input, SubmitButton } from "@/components/app/form";
import { Button } from "@/components/ui/Button";

import { confirmTotpEnrollment, startTotpEnrollment } from "../../actions";

type Enrollment = { factorId: string; qrCode: string; secret: string };

export function TotpEnrollment() {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function start() {
    setError(null);
    startTransition(async () => {
      const result = await startTotpEnrollment();
      if (result.ok) setEnrollment(result);
      else setError(result.message);
    });
  }

  if (!enrollment) {
    return (
      <div className="flex flex-col gap-3">
        <Button onClick={start} size="sm" aria-disabled={pending || undefined}>
          {pending ? "Préparation…" : "Afficher le QR code"}
        </Button>
        {error ? (
          <p role="alert" className="text-small font-medium text-error">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <ol className="flex list-decimal flex-col gap-2 pl-5 text-small text-ink">
        <li>Dans l’application, ajoutez un compte en scannant ce QR code.</li>
        <li>Saisissez ensuite le code à 6 chiffres qu’elle affiche.</li>
      </ol>
      {/* eslint-disable-next-line @next/next/no-img-element -- QR code SVG généré par Supabase (data URL) */}
      <img
        src={enrollment.qrCode}
        alt="QR code à scanner avec votre application d’authentification"
        width={192}
        height={192}
        className="size-48 self-center rounded-xl border border-line bg-white p-2"
      />
      <details className="text-small">
        <summary className="cursor-pointer font-semibold text-maison">Impossible de scanner ? Saisir la clé</summary>
        <p className="mt-2 break-all rounded-lg bg-stone px-3 py-2 font-mono text-[0.875rem] text-ink">
          {enrollment.secret}
        </p>
      </details>
      <ActionForm action={confirmTotpEnrollment} className="flex flex-col gap-4">
        <input type="hidden" name="factorId" value={enrollment.factorId} />
        <Field name="code" label="Code à 6 chiffres" required>
          <Input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={7}
            required
            className="font-display text-[1.5rem] tracking-[0.3em] tabular-nums"
          />
        </Field>
        <div>
          <SubmitButton pendingLabel="Vérification…">Activer</SubmitButton>
        </div>
      </ActionForm>
    </div>
  );
}
