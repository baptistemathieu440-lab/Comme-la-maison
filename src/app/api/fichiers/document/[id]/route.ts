import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";
import { signedUrl } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

/**
 * Téléchargement d'un document privé : la ligne est lue avec la session de
 * l'utilisateur (un propriétaire ne voit que ses documents partagés), puis un lien
 * signé valable une minute est délivré.
 */
export async function GET(_request: Request, { params }: RouteContext<"/api/fichiers/document/[id]">) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return new Response("Connexion requise.", { status: 401 });
  const supabase = await createClient();
  const { data: document } = await supabase.from("documents").select("storage_path, title, mime_type").eq("id", id).maybeSingle();
  if (!document) return new Response("Document introuvable.", { status: 404 });

  const extension = document.storage_path.split(".").pop();
  const filename = `${document.title.replace(/[^\p{L}\p{N} ._-]/gu, "").slice(0, 80) || "document"}.${extension}`;
  const url = await signedUrl("documents", document.storage_path, 60, filename);
  if (!url) return new Response("Fichier indisponible.", { status: 404 });
  return NextResponse.redirect(url, { status: 302, headers: { "Cache-Control": "private, no-store" } });
}
