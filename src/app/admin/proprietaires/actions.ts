"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { encryptSecret, isEncryptionConfigured, normalizeIban } from "@/lib/crypto";
import { FormReader } from "@/lib/form-data";
import { inviteUser, passwordLink } from "@/server/invitations";

function readContact(form: FormReader) {
  const first = form.optional("first_name", 80) ?? "";
  const last = form.optional("last_name", 80) ?? "";
  const company = form.optional("company_name", 120);
  if (!first && !last && !company) form.errors.last_name = "Indiquez au moins un nom ou une société.";
  return {
    first_name: first,
    last_name: last,
    company_name: company,
    email: form.email("email"),
    phone: form.optional("phone", 40),
    address_line: form.optional("address_line", 200),
    postal_code: form.optional("postal_code", 10),
    city: form.optional("city", 80),
    notes: form.optional("contact_notes", 4000),
  };
}

function readOwner(form: FormReader) {
  return {
    status: form.choice("status", ["onboarding", "active", "inactive"] as const, "onboarding"),
    commission_rate_bps: form.bps("commission_rate"),
    billing_email: form.email("billing_email"),
    vat_number: form.optional("vat_number", 30),
    sepa_mandate_reference: form.optional("sepa_mandate_reference", 60),
    sepa_mandate_signed_on: form.date("sepa_mandate_signed_on"),
    notes: form.optional("notes", 4000),
  };
}

export async function createOwner(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const contact = readContact(form);
  const owner = readOwner(form);
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { data: created, error } = await supabase
    .from("contacts")
    .insert({ ...contact, created_by: session.userId })
    .select("id")
    .single();
  if (error) return fail(dbErrorMessage(error));
  const { data: newOwner, error: ownerError } = await supabase
    .from("owners")
    .insert({ ...owner, contact_id: created.id, created_by: session.userId })
    .select("id")
    .single();
  if (ownerError) {
    await supabase.from("contacts").delete().eq("id", created.id);
    return fail(dbErrorMessage(ownerError));
  }
  revalidatePath("/admin/proprietaires");
  redirect(`/admin/proprietaires/${newOwner.id}?cree=1`);
}

export async function updateOwner(ownerId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminContext();
  const form = new FormReader(formData);
  const contact = readContact(form);
  const owner = readOwner(form);
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);

  const { data: current } = await supabase.from("owners").select("contact_id").eq("id", ownerId).single();
  if (!current) return fail("Propriétaire introuvable.");
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("contacts").update(contact).eq("id", current.contact_id),
    supabase.from("owners").update(owner).eq("id", ownerId),
  ]);
  if (e1 || e2) return fail(dbErrorMessage(e1 ?? e2));
  revalidatePath(`/admin/proprietaires/${ownerId}`);
  return ok("Fiche enregistrée.");
}

export async function saveIban(ownerId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminContext();
  if (!isEncryptionConfigured()) {
    return fail("Le chiffrement n’est pas configuré (IBAN_ENCRYPTION_KEY manquante) : l’IBAN ne peut pas être enregistré.");
  }
  const raw = String(formData.get("iban") ?? "");
  const holder = String(formData.get("iban_holder") ?? "").trim().slice(0, 120) || null;
  if (!raw.trim()) {
    const { error } = await supabase.from("owners").update({ iban_encrypted: null, iban_last4: null, iban_holder: null }).eq("id", ownerId);
    if (error) return fail(dbErrorMessage(error));
    revalidatePath(`/admin/proprietaires/${ownerId}`);
    return ok("IBAN effacé.");
  }
  const iban = normalizeIban(raw);
  if (!iban) return fail("Cet IBAN n’est pas valide (clé de contrôle incorrecte).", { iban: "IBAN invalide." });

  const { error } = await supabase
    .from("owners")
    .update({ iban_encrypted: encryptSecret(iban), iban_last4: iban.slice(-4), iban_holder: holder })
    .eq("id", ownerId);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/proprietaires/${ownerId}`);
  return ok(`IBAN enregistré et chiffré (se termine par ${iban.slice(-4)}).`);
}

export type InviteState = ActionState;

export async function inviteOwner(ownerId: string, _prev: InviteState, formData: FormData): Promise<InviteState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const email = form.email("email", true);
  if (!form.ok || !email) return fail("Indiquez l’adresse email du propriétaire.", form.errors);

  const { data: owner } = await supabase.from("owners").select("id, contact:contacts!inner(first_name, last_name)").eq("id", ownerId).single();
  if (!owner) return fail("Propriétaire introuvable.");

  const result = await inviteUser({
    email,
    fullName: `${owner.contact.first_name} ${owner.contact.last_name}`.trim(),
    role: "owner",
    ownerId,
    invitedBy: session.userId,
  });
  if (!result.ok) return fail(result.message);
  revalidatePath(`/admin/proprietaires/${ownerId}`);
  if (result.existing) return { ...ok("Ce compte existait déjà : l’accès à l’espace propriétaire est ouvert."), link: null };
  return {
    ...ok(
      result.emailed
        ? "Invitation envoyée par email. Le lien ci-dessous est valable 24 heures."
        : "Accès créé. Aucun service d’email n’est configuré : transmettez ce lien (valable 24 heures) au propriétaire.",
    ),
    link: result.link,
  };
}

export async function newPasswordLinkForOwner(ownerId: string, _prev: InviteState): Promise<InviteState> {
  const { supabase } = await adminContext();
  const { data: owner } = await supabase
    .from("owners")
    .select("contact:contacts!inner(profile:profiles!contacts_profile_id_fkey(email))")
    .eq("id", ownerId)
    .single();
  const email = owner?.contact.profile?.email;
  if (!email) return fail("Ce propriétaire n’a pas encore de compte.");
  const link = await passwordLink(email);
  return link ? { ...ok("Nouveau lien créé, valable 24 heures."), link } : fail("Le lien n’a pas pu être créé.");
}

export async function revokeOwnerAccess(ownerId: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: owner } = await supabase.from("owners").select("contact_id, contact:contacts!inner(profile_id)").eq("id", ownerId).single();
  const profileId = owner?.contact.profile_id;
  if (!owner || !profileId) return fail("Aucun accès à retirer.");
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("contacts").update({ profile_id: null }).eq("id", owner.contact_id),
    supabase.from("user_roles").delete().eq("user_id", profileId).eq("role", "owner"),
  ]);
  if (e1 || e2) return fail(dbErrorMessage(e1 ?? e2));
  revalidatePath(`/admin/proprietaires/${ownerId}`);
  return ok("Accès à l’espace propriétaire retiré.");
}

export async function deleteOwner(ownerId: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { count } = await supabase.from("properties").select("id", { count: "exact", head: true }).eq("owner_id", ownerId);
  if ((count ?? 0) > 0) return fail("Ce propriétaire a des biens : passez-le plutôt en statut « Inactif ».");
  const { data: owner } = await supabase.from("owners").select("contact_id").eq("id", ownerId).single();
  const { error } = await supabase.from("owners").delete().eq("id", ownerId);
  if (error) return fail(dbErrorMessage(error));
  if (owner) await supabase.from("contacts").delete().eq("id", owner.contact_id);
  revalidatePath("/admin/proprietaires");
  redirect("/admin/proprietaires");
}

export async function saveContract(ownerId: string, contractId: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = {
    property_id: form.id("property_id"),
    reference: form.optional("reference", 60),
    status: form.choice("status", ["draft", "active", "ended"] as const, "draft"),
    start_date: form.date("start_date"),
    end_date: form.date("end_date"),
    signed_on: form.date("signed_on"),
    commission_rate_bps: form.bps("commission_rate"),
    notes: form.optional("notes", 2000),
  };
  if (!form.ok) return fail("Vérifiez les champs indiqués.", form.errors);
  const { data: owner } = await supabase.from("owners").select("is_demo").eq("id", ownerId).single();
  const { error } = contractId
    ? await supabase.from("contracts").update(values).eq("id", contractId).eq("owner_id", ownerId)
    : await supabase.from("contracts").insert({ ...values, owner_id: ownerId, created_by: session.userId, is_demo: owner?.is_demo ?? false });
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/proprietaires/${ownerId}`);
  return ok(contractId ? "Contrat mis à jour." : "Contrat ajouté. Le document signé peut être déposé dans les documents.");
}
