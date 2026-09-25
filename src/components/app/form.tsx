"use client";

import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
} from "react";

import { Button, type ButtonVariant } from "@/components/ui/Button";
import { CopyField } from "@/components/app/CopyField";
import { cn } from "@/lib/cn";
import type { ActionState } from "@/lib/action-state";

const FormStateContext = createContext<ActionState>({ status: "idle" });
const FormPendingContext = createContext(false);

/**
 * Formulaire relié à une action serveur. Les champs gardent leur saisie en cas
 * d'erreur (pas de réinitialisation automatique) ; les erreurs s'affichent sous
 * chaque champ et un message global est annoncé aux lecteurs d'écran.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  confirmMessage,
  ...props
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  confirmMessage?: string;
} & Omit<ComponentProps<"form">, "action" | "onSubmit" | "children">) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as ActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success" && resetOnSuccess) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    const data = new FormData(event.currentTarget, (event.nativeEvent as SubmitEvent).submitter);
    startTransition(() => formAction(data));
  }

  return (
    <FormStateContext.Provider value={state}>
      <FormPendingContext.Provider value={pending}>
        <form ref={formRef} onSubmit={onSubmit} aria-busy={pending} noValidate className={className} {...props}>
          {children}
          <FormMessage />
          {state.link ? (
            <div className="mt-4">
              <CopyField label="Lien à transmettre" value={state.link} hint="Valable 24 heures, utilisable une seule fois." />
            </div>
          ) : null}
        </form>
      </FormPendingContext.Provider>
    </FormStateContext.Provider>
  );
}

export function useFormState() {
  return useContext(FormStateContext);
}

function FormMessage() {
  const state = useFormState();
  if (state.status === "idle" || !state.message) return <p role="status" className="sr-only" />;
  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={cn(
        "mt-4 rounded-[var(--radius-field)] px-4 py-3 text-small font-medium",
        state.status === "error" ? "bg-error-wash text-error" : "bg-olive-light text-maison",
      )}
    >
      {state.message}
    </p>
  );
}

const FieldContext = createContext<{ id: string; name: string; describedBy?: string; invalid: boolean } | null>(null);

export function Field({
  name,
  label,
  hint,
  required,
  children,
  className,
}: {
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const uid = useId();
  const id = `${uid}-${name}`;
  const state = useFormState();
  const error = state.errors?.[name];
  const hintId = hint ? `${id}-aide` : undefined;
  const errorId = error ? `${id}-erreur` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldContext.Provider value={{ id, name, describedBy, invalid: Boolean(error) }}>
      <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
        <label htmlFor={id} className="text-[0.9375rem] font-semibold text-ink">
          {label}
          {required ? (
            <>
              <span aria-hidden="true" className="text-terra-text">
                {" "}
                *
              </span>
              <span className="sr-only"> (obligatoire)</span>
            </>
          ) : null}
        </label>
        {hint ? (
          <span id={hintId} className="-mt-1 text-[0.8125rem] text-ink-soft">
            {hint}
          </span>
        ) : null}
        {children}
        {error ? (
          <span id={errorId} className="text-[0.875rem] font-medium text-error">
            {error}
          </span>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

const control =
  "w-full min-h-11 rounded-[var(--radius-field)] border-[1.5px] border-line-strong bg-white px-3.5 py-2 text-[0.9375rem] text-ink " +
  "placeholder:text-ink-soft/70 focus-visible:border-maison aria-invalid:border-2 aria-invalid:border-error " +
  "disabled:bg-disabled-bg disabled:text-disabled-fg";

function useFieldProps(name?: string) {
  const field = useContext(FieldContext);
  return {
    id: field?.id,
    name: name ?? field?.name,
    "aria-describedby": field?.describedBy,
    "aria-invalid": field?.invalid ? true : undefined,
  } as const;
}

export function Input({ className, name, ...props }: ComponentProps<"input">) {
  const fieldProps = useFieldProps(name);
  return <input {...fieldProps} className={cn(control, className)} {...props} />;
}

export function Textarea({ className, name, rows = 4, ...props }: ComponentProps<"textarea">) {
  const fieldProps = useFieldProps(name);
  return <textarea {...fieldProps} rows={rows} className={cn(control, "py-2.5 leading-relaxed", className)} {...props} />;
}

export function Select({
  className,
  name,
  options,
  placeholder,
  ...props
}: ComponentProps<"select"> & { options: Array<{ value: string; label: string }>; placeholder?: string }) {
  const fieldProps = useFieldProps(name);
  return (
    <select {...fieldProps} className={cn(control, "pr-8", className)} {...props}>
      {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/** Case à cocher avec son libellé (hors Field). */
export function Checkbox({
  label,
  hint,
  className,
  ...props
}: Omit<ComponentProps<"input">, "type"> & { label: ReactNode; hint?: ReactNode }) {
  const uid = useId();
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        id={uid}
        type="checkbox"
        aria-describedby={hint ? `${uid}-aide` : undefined}
        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-maison"
        {...props}
      />
      <div className="flex flex-col gap-0.5">
        <label htmlFor={uid} className="cursor-pointer text-[0.9375rem] font-medium text-ink">
          {label}
        </label>
        {hint ? (
          <span id={`${uid}-aide`} className="text-[0.8125rem] text-ink-soft">
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
  pendingLabel = "Enregistrement…",
  name,
  value,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  pendingLabel?: string;
  name?: string;
  value?: string;
}) {
  const pending = useContext(FormPendingContext);
  return (
    <Button type="submit" variant={variant} size="sm" name={name} value={value} aria-disabled={pending || undefined}>
      {pending ? pendingLabel : children}
    </Button>
  );
}

export function FormActions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-6 flex flex-wrap items-center gap-3", className)}>{children}</div>;
}

export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
}

export function Fieldset({ legend, children, className }: { legend: string; children: ReactNode; className?: string }) {
  return (
    <fieldset className={cn("flex flex-col gap-4 border-t border-line pt-5 first:border-t-0 first:pt-0", className)}>
      <legend className="float-left mb-1 w-full font-display text-[1.125rem] font-medium text-maison [font-stretch:92%]">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}
