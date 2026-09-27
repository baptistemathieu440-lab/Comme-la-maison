"use server";

import { revalidatePath } from "next/cache";

import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { createUploadTicket, imageTypes, objectExists, removeObjects, type UploadTicket } from "@/lib/storage";

async function propertyOrNull(propertyId: string) {
  const { supabase, session } = await adminContext();
  const { data } = await supabase.from("properties").select("id, is_demo").eq("id", propertyId).maybeSingle();
  return { supabase, session, property: data };
}

export async function requestPropertyPhotoUpload(
  propertyId: string,
  file: { name: string; type: string; size: number },
): Promise<UploadTicket> {
  const { property } = await propertyOrNull(propertyId);
  if (!property) return { ok: false, message: "Bien introuvable." };
  return createUploadTicket("property-photos", propertyId, file.type, file.size, imageTypes);
}

export async function confirmPropertyPhotoUpload(
  propertyId: string,
  path: string,
  meta: { fields: Record<string, string> },
): Promise<{ ok: boolean; message?: string }> {
  const { supabase, session, property } = await propertyOrNull(propertyId);
  if (!property || !path.startsWith(`${propertyId}/`)) return { ok: false, message: "Emplacement invalide." };
  if (!(await objectExists("property-photos", path))) return { ok: false, message: "Fichier non reçu." };

  const { count } = await supabase.from("property_photos").select("id", { count: "exact", head: true }).eq("property_id", propertyId);
  const { error } = await supabase.from("property_photos").insert({
    property_id: propertyId,
    storage_path: path,
    caption: meta.fields.caption?.slice(0, 200) || null,
    position: count ?? 0,
    is_demo: property.is_demo,
    uploaded_by: session.userId,
  });
  if (error) return { ok: false, message: dbErrorMessage(error) };
  revalidatePath(`/admin/biens/${propertyId}/photos`);
  return { ok: true };
}

export async function updatePropertyPhoto(propertyId: string, photoId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await adminContext();
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 200) || null;
  const isPublic = formData.get("is_public") === "on";
  const position = Number(formData.get("position") ?? 0);
  const { error } = await supabase
    .from("property_photos")
    .update({ caption, is_public: isPublic, position: Number.isFinite(position) ? position : 0 })
    .eq("id", photoId)
    .eq("property_id", propertyId);
  if (error) return fail(dbErrorMessage(error));
  revalidatePath(`/admin/biens/${propertyId}/photos`);
  return ok("Photo mise à jour.");
}

export async function deletePropertyPhoto(propertyId: string, photoId: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { data: photo } = await supabase
    .from("property_photos")
    .select("storage_path")
    .eq("id", photoId)
    .eq("property_id", propertyId)
    .maybeSingle();
  if (!photo) return fail("Photo introuvable.");
  const { error } = await supabase.from("property_photos").delete().eq("id", photoId);
  if (error) return fail(dbErrorMessage(error));
  await removeObjects("property-photos", [photo.storage_path]);
  revalidatePath(`/admin/biens/${propertyId}/photos`);
  return ok("Photo supprimée.");
}
