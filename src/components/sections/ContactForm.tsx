"use client";

import Link from "next/link";
import { ChevronDown, CircleAlert, CircleCheck } from "lucide-react";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";

import { submitContact } from "@/app/actions/contact";
import { recordLead } from "@/app/actions/lead";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import {
  NETLIFY_FORM_NAME,
  bedroomOptions,
  contactFields,
  directContactMessage,
  fieldLabels,
  initialContactState,
  propertyTypeOptions,
  readValues,
  requiredFields,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactState,
} from "@/lib/contact";

/**
 * Sur Netlify, les demandes sont reçues par Netlify Forms : le navigateur les envoie
 * au formulaire statique public/__forms.html. Ailleurs, l'action serveur les envoie par email.
 */
const useNetlifyForms = process.env.NEXT_PUBLIC_FORM_BACKEND === "netlify";

async function submitToNetlify(data: FormData) {
  const body = new URLSearchParams({ "form-name": NETLIFY_FORM_NAME });
  for (const field of [...contactFields, "website"]) body.set(field, String(data.get(field) ?? ""));
  try {
    const response = await fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    return response.ok;
  } catch {
    return false;
  }
}

const inputClass =
  "w-full rounded-[var(--radius-field)] border-[1.5px] border-line-strong bg-surface px-4 text-[1.0625rem] text-ink " +
  "placeholder:text-ink-soft/80 transition-colors focus-visible:border-maison " +
  "aria-invalid:border-2 aria-invalid:border-error";

function SelectWrap({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 size-[1.125rem] -translate-y-1/2 text-maison"
        strokeWidth={2}
      />
    </div>
  );
}

function Field({
  name,
  error,
  hint,
  children,
}: {
  name: ContactField;
  error?: string;
  hint?: string;
  children: (props: {
    id: string;
    name: ContactField;
    "aria-invalid"?: true;
    "aria-describedby"?: string;
    required?: boolean;
    "aria-required"?: true;
  }) => ReactNode;
}) {
  const id = `contact-${name}`;
  const required = requiredFields.includes(name);
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold text-ink">
        {fieldLabels[name]}
        {required ? (
          <span aria-hidden="true" className="text-terra-text">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-ink-soft"> (facultatif)</span>
        )}
      </label>
      {hint ? (
        <span id={`${id}-hint`} className="text-small text-ink-soft">
          {hint}
        </span>
      ) : null}
      {children({
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
        required: required || undefined,
        "aria-required": required ? true : undefined,
      })}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-2 text-small font-medium text-error">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [actionState, formAction, actionPending] = useActionState(submitContact, initialContactState);
  const [netlifyState, setNetlifyState] = useState<ContactState | null>(null);
  const [netlifyPending, setNetlifyPending] = useState(false);
  const state = netlifyState ?? actionState;
  const pending = actionPending || netlifyPending;
  const [clientErrors, setClientErrors] = useState<ContactErrors | null>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const serverErrors = state.status === "error" ? state.errors : {};
  const errors: ContactErrors = clientErrors ?? serverErrors;
  const values = state.status === "error" ? state.values : null;
  const errorList = contactFields.filter((f) => errors[f]);
  const serverMessage = state.status === "error" && !clientErrors ? state.message : null;

  // Heure d'affichage du formulaire, renseignée dans le navigateur (anti-robots).
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "error") summaryRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-olive-light p-6 outline-none sm:p-8"
      >
        <CircleCheck aria-hidden="true" className="size-9 text-maison" strokeWidth={1.5} />
        <h3 className="text-h3 text-maison">Merci {state.firstName}, votre demande est bien envoyée.</h3>
        <p className="text-ink">
          Baptiste ou Simon vous recontacte pour parler de votre logement et de son potentiel en location
          courte durée.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={(event) => {
        const found = validateContact(readValues(new FormData(event.currentTarget)));
        if (Object.keys(found).length > 0) {
          event.preventDefault();
          setClientErrors(found);
          requestAnimationFrame(() => summaryRef.current?.focus());
          return;
        }
        setClientErrors(null);
        if (useNetlifyForms) {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const values = readValues(data);
          setNetlifyPending(true);
          // Netlify Forms (notification) et CRM de la plateforme : la demande est reçue si l'un des deux l'enregistre.
          Promise.all([submitToNetlify(data), recordLead(data).catch(() => false)]).then(([sent, recorded]) => {
            const ok = sent || recorded;
            setNetlifyPending(false);
            setNetlifyState(
              ok
                ? { status: "success", firstName: values.firstName }
                : {
                    status: "error",
                    message: `Votre demande n’a pas pu être envoyée. Vérifiez votre connexion puis réessayez. ${directContactMessage()}`,
                    errors: {},
                    values,
                  },
            );
          });
        }
      }}
      onChange={(event) => {
        // Efface l'erreur d'un champ dès qu'il est modifié.
        const target = event.target as EventTarget;
        if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
        const name = target.name as ContactField;
        if (clientErrors?.[name]) {
          const next = { ...clientErrors };
          delete next[name];
          setClientErrors(next);
        }
      }}
      className="flex flex-col gap-6"
      aria-describedby="contact-required-note"
    >
      <div
        ref={summaryRef}
        tabIndex={-1}
        role={errorList.length > 0 || serverMessage ? "alert" : undefined}
        className="outline-none"
      >
        {errorList.length > 0 || serverMessage ? (
          <div className="flex flex-col gap-2 rounded-[var(--radius-field)] border-2 border-error bg-error-wash p-4 text-ink">
            <p className="flex items-center gap-2 font-semibold text-error">
              <CircleAlert aria-hidden="true" className="size-5 shrink-0" strokeWidth={2} />
              {errorList.length > 0
                ? `${errorList.length === 1 ? "Un champ est" : `${errorList.length} champs sont`} à corriger :`
                : serverMessage}
            </p>
            {errorList.length > 0 ? (
              <ul className="flex flex-col gap-1 pl-7 text-small">
                {errorList.map((field) => (
                  <li key={field}>
                    <a href={`#contact-${field}`} className="underline underline-offset-2 hover:text-maison">
                      {fieldLabels[field]} : {errors[field]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      <p id="contact-required-note" className="text-small text-ink-soft">
        Les champs marqués d’un astérisque (<span className="text-terra-text">*</span>) sont
        obligatoires.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="firstName" error={errors.firstName}>
          {(p) => (
            <input {...p} type="text" autoComplete="given-name" defaultValue={values?.firstName} className={cn(inputClass, "h-[3.25rem]")} />
          )}
        </Field>
        <Field name="lastName" error={errors.lastName}>
          {(p) => (
            <input {...p} type="text" autoComplete="family-name" defaultValue={values?.lastName} className={cn(inputClass, "h-[3.25rem]")} />
          )}
        </Field>
        <Field name="phone" error={errors.phone}>
          {(p) => (
            <input {...p} type="tel" inputMode="tel" autoComplete="tel" defaultValue={values?.phone} className={cn(inputClass, "h-[3.25rem]")} />
          )}
        </Field>
        <Field name="email" error={errors.email}>
          {(p) => (
            <input {...p} type="email" inputMode="email" autoComplete="email" spellCheck={false} defaultValue={values?.email} className={cn(inputClass, "h-[3.25rem]")} />
          )}
        </Field>
        <Field name="city" error={errors.city} hint="Bordeaux ou une commune de la métropole.">
          {(p) => (
            <>
              <input {...p} type="text" list="contact-communes" autoComplete="address-level2" defaultValue={values?.city} className={cn(inputClass, "h-[3.25rem]")} />
              <datalist id="contact-communes">
                {site.area.communes.map((commune) => (
                  <option key={commune} value={commune} />
                ))}
              </datalist>
            </>
          )}
        </Field>
        <Field name="propertyType" error={errors.propertyType}>
          {(p) => (
            <SelectWrap>
            <select {...p} defaultValue={values?.propertyType ?? ""} className={cn(inputClass, "h-[3.25rem] appearance-none pr-11")}>
              <option value="">Choisir…</option>
              {propertyTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            </SelectWrap>
          )}
        </Field>
        <Field name="bedrooms" error={errors.bedrooms}>
          {(p) => (
            <SelectWrap>
            <select {...p} defaultValue={values?.bedrooms ?? ""} className={cn(inputClass, "h-[3.25rem] appearance-none pr-11")}>
              <option value="">Choisir…</option>
              {bedroomOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            </SelectWrap>
          )}
        </Field>
        <Field name="capacity" error={errors.capacity} hint="Nombre de voyageurs que le logement peut accueillir.">
          {(p) => (
            <input {...p} type="number" inputMode="numeric" min={1} max={30} defaultValue={values?.capacity} className={cn(inputClass, "h-[3.25rem]")} />
          )}
        </Field>
      </div>

      <Field name="message" error={errors.message} hint="Adresse approximative, disponibilités, questions…">
        {(p) => <textarea {...p} rows={4} defaultValue={values?.message} className={cn(inputClass, "min-h-32 py-3")} />}
      </Field>

      {/* Pièges à robots, invisibles pour les personnes */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Ne pas remplir ce champ</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="0" />

      <div className="flex flex-col gap-4 pt-2">
        <Button type="submit" arrow disabled={pending} className="w-full sm:w-auto sm:self-start">
          {pending ? "Envoi en cours…" : "Estimer mon logement"}
        </Button>
        <p className="text-small text-ink-soft">
          Vos informations servent uniquement à vous recontacter au sujet de votre logement. Pour en
          savoir plus, consultez notre{" "}
          <Link href="/confidentialite" className="text-maison underline underline-offset-2">
            politique de confidentialité
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
