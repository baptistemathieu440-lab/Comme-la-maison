import "server-only";

import { randomUUID } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";

export type Bucket = "property-photos" | "field-photos" | "documents" | "statements";

export const imageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const documentTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
] as const;

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/plain": "txt",
  "text/csv": "csv",
};

export const limits: Record<Bucket, number> = {
  "property-photos": 10 * 1024 * 1024,
  "field-photos": 10 * 1024 * 1024,
  documents: 20 * 1024 * 1024,
  statements: 5 * 1024 * 1024,
};

export type UploadTicket = { ok: true; bucket: Bucket; path: string; token: string } | { ok: false; message: string };

/**
 * Prépare l'envoi direct d'un fichier depuis le navigateur vers le stockage privé,
 * sans passer par le serveur (photos de téléphone volumineuses).
 * À n'appeler qu'après avoir vérifié les droits de l'utilisateur sur l'élément concerné.
 */
export async function createUploadTicket(
  bucket: Bucket,
  folder: string,
  mime: string,
  size: number,
  allowed: readonly string[],
): Promise<UploadTicket> {
  if (!allowed.includes(mime)) return { ok: false, message: "Format de fichier non accepté." };
  if (!Number.isFinite(size) || size <= 0 || size > limits[bucket]) {
    return { ok: false, message: `Fichier trop lourd (${Math.round(limits[bucket] / 1024 / 1024)} Mo au maximum).` };
  }
  const path = `${folder}/${randomUUID()}.${extensions[mime] ?? "bin"}`;
  const { data, error } = await createAdminClient().storage.from(bucket).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, message: "L’envoi n’a pas pu être préparé. Réessayez." };
  return { ok: true, bucket, path: data.path, token: data.token };
}

/** Vérifie qu'un fichier a bien été envoyé à l'emplacement prévu. */
export async function objectExists(bucket: Bucket, path: string) {
  const slash = path.lastIndexOf("/");
  const folder = path.slice(0, slash);
  const name = path.slice(slash + 1);
  const { data } = await createAdminClient().storage.from(bucket).list(folder, { search: name, limit: 1 });
  const file = data?.find((item) => item.name === name);
  return file ? { size: Number(file.metadata?.size ?? 0), mime: String(file.metadata?.mimetype ?? "") } : null;
}

/** Liens temporaires (5 minutes par défaut) vers des fichiers privés. */
export async function signedUrls(bucket: Bucket, paths: string[], expiresIn = 300) {
  if (paths.length === 0) return new Map<string, string>();
  const { data } = await createAdminClient().storage.from(bucket).createSignedUrls(paths, expiresIn);
  return new Map((data ?? []).filter((item) => item.signedUrl && item.path).map((item) => [item.path as string, item.signedUrl]));
}

export async function signedUrl(bucket: Bucket, path: string, expiresIn = 300, download?: string) {
  const { data } = await createAdminClient()
    .storage.from(bucket)
    .createSignedUrl(path, expiresIn, download ? { download } : undefined);
  return data?.signedUrl ?? null;
}

export async function removeObjects(bucket: Bucket, paths: string[]) {
  if (paths.length === 0) return;
  await createAdminClient().storage.from(bucket).remove(paths);
}
