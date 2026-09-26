"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { ActionForm, Field, FormGrid, Input, SubmitButton, Textarea } from "@/components/app/form";
import type { ActionState } from "@/lib/action-state";

/**
 * Demande de séjour depuis la page d'un logement. Les dates et le nombre de
 * voyageurs sont contrôlés à nouveau par le serveur, avec les disponibilités.
 */
export function StayRequestForm({
  action,
  capacity,
  today,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  capacity: number | null;
  today: string;
}) {
  const startedAtRef = useRef<HTMLInputElement>(null);

  // Heure d'affichage du formulaire, renseignée dans le navigateur (anti-robots).
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  return (
    <ActionForm action={action} resetOnSuccess className="flex flex-col gap-4">
      <FormGrid>
        <Field name="check_in" label="Arrivée" required>
          <Input type="date" min={today} required />
        </Field>
        <Field name="check_out" label="Départ" required>
          <Input type="date" min={today} required />
        </Field>
        <Field name="adults" label="Adultes" required>
          <Input type="number" min={1} max={capacity ?? undefined} defaultValue={2} inputMode="numeric" required />
        </Field>
        <Field name="children" label="Enfants">
          <Input type="number" min={0} max={capacity ?? undefined} defaultValue={0} inputMode="numeric" />
        </Field>
        <Field name="first_name" label="Prénom" required>
          <Input autoComplete="given-name" maxLength={60} required />
        </Field>
        <Field name="last_name" label="Nom" required>
          <Input autoComplete="family-name" maxLength={80} required />
        </Field>
        <Field name="email" label="Email" required>
          <Input type="email" autoComplete="email" inputMode="email" maxLength={120} required />
        </Field>
        <Field name="phone" label="Téléphone" required>
          <Input type="tel" autoComplete="tel" inputMode="tel" required />
        </Field>
      </FormGrid>
      <Field name="message" label="Message" hint="Heure d’arrivée prévue, questions, besoins particuliers…">
        <Textarea rows={4} maxLength={2000} />
      </Field>

      {/* Pièges à robots, invisibles pour les personnes */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="sejour-website">Ne pas remplir ce champ</label>
        <input id="sejour-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="0" />

      <div className="flex flex-col gap-3 pt-1">
        <div>
          <SubmitButton pendingLabel="Envoi…">Envoyer ma demande</SubmitButton>
        </div>
        <p className="text-small text-ink-soft">
          Rien n’est réservé ni payé à ce stade : nous vous recontactons pour confirmer la disponibilité et le tarif. Vos
          informations servent uniquement à répondre à votre demande (
          <Link href="/politique-confidentialite" className="text-maison underline underline-offset-2">
            politique de confidentialité
          </Link>
          ).
        </p>
      </div>
    </ActionForm>
  );
}
