"use server";

import { revalidatePath } from "next/cache";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { createUploadTicket, documentTypes, objectExists, removeObjects, type UploadTicket } from "@/lib/storage";

const categories = ["contract", "invoice", "statement", "receipt", "identity", "insurance", "diagnostic", "inventory", "photo", "other"] as const;

export async function requestDocumentUpload(file: { name: string; type: string; size: number }): Promise<UploadTicket> {
  await adminContext();
  return createUploadTicket("documents", `admin/${new Date().toISOString().slice(0, 7)}`, file.type, file.size, documentTypes);
}

export async function confirmDocumentUpload(
  path: string,
  meta: { name: string; type: string; size: number; fields: Record<string, string> },
): Promise<{ ok: boolean; message?: string }> {
  const { session, supabase } = await adminContext();
  if (!path.startsWith("admin/")) return { ok: false, message: "Emplacement invalide." };
  const stored = await objectExists("documents", path);
  if (!stored) return { ok: false, message: "Fichier non reçu." };
  const fields = meta.fields;
  const uuid = /^[0-9a-f-]{36}$/i;
  const propertyId = uuid.test(fields.property_id ?? "") ? fields.property_id : null;
  const ownerId = uuid.test(fields.owner_id ?? "") ? fields.owner_id : null;
  const category = (categories as readonly string[]).includes(fields.category) ? fields.category : "other";

  let isDemo = false;
  if (propertyId) isDemo = (await supabase.from("properties").select("is_demo").eq("id", propertyId).single()).data?.is_demo ?? false;
  else if (ownerId) isDemo = (await supabase.from("owners").select("is_demo").eq("id", ownerId).single()).data?.is_demo ?? false;

  const { error } = await supabase.from("documents").insert({
    title: (fields.title || meta.name).slice(0, 200),
    category,
    storage_path: path,
    mime_type: meta.type,
    size_bytes: stored.size || meta.size,
    owner_id: ownerId,
    property_id: propertyId,
    visible_to_owner: fields.visible_to_owner === "on",
    uploaded_by: session.userId,
    is_demo: isDemo,
  });
  if (error) {
    await removeObjects("documents", [path]);
    return { ok: false, message: dbErrorMessage(error) };
  }
  revalidatePath("/admin/documents");
  return { ok: true };
}

export async function toggleDocumentVisibility(id: string, visible: boolean, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase.from("documents").update({ visible_to_owner: visible }).eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath("/admin/documents");
  return ok(visible ? "Document partagé avec le propriétaire." : "Document retiré de l’espace propriétaire.");
}

export async function deleteDocument(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: document } = await supabase.from("documents").select("storage_path").eq("id", id).single();
  if (!document) return fail("Document introuvable.");
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  await removeObjects("documents", [document.storage_path]);
  revalidatePath("/admin/documents");
  return ok("Document supprimé.");
}
