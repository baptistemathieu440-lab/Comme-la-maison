import { NextResponse } from "next/server";

import { signedUrl } from "@/lib/storage";
import { publicPhotoPath } from "@/server/public-listings";

/**
 * Photo d'un logement publié sur le site. Les photos restent dans un espace de
 * stockage privé : seule une photo marquée publique, d'un bien publié, obtient
 * un lien signé d'une heure.
 */
export async function GET(_request: Request, { params }: RouteContext<"/api/logements/photos/[id]">) {
  const { id } = await params;
  const path = await publicPhotoPath(id);
  if (!path) return new Response("Photo introuvable.", { status: 404 });
  const url = await signedUrl("property-photos", path, 3600);
  if (!url) return new Response("Photo indisponible.", { status: 404 });
  return NextResponse.redirect(url, { status: 302, headers: { "Cache-Control": "public, max-age=1800" } });
}
