import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { loadStatementDocument } from "@/server/statements/load";
import { renderStatementPdf, statementFileName } from "@/server/statements/pdf";

/**
 * PDF d'un relevé. L'accès est vérifié avec la session de l'utilisateur :
 * un administrateur voit tous les relevés, un propriétaire uniquement ses relevés
 * finalisés (règles d'accès de la base). Un relevé finalisé est servi depuis son
 * archive ; un brouillon est généré à la volée.
 */
export async function GET(_request: Request, { params }: RouteContext<"/api/releves/[id]/pdf">) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return new Response("Connexion requise.", { status: 401 });
  if (session.roles.includes("admin") && session.aal !== "aal2") return new Response("Double authentification requise.", { status: 403 });

  const supabase = await createClient();
  const { data: allowed } = await supabase.from("owner_statements").select("id, pdf_path").eq("id", id).maybeSingle();
  if (!allowed) return new Response("Relevé introuvable.", { status: 404 });

  const admin = createAdminClient();
  const document = await loadStatementDocument(admin, id);
  if (!document) return new Response("Relevé introuvable.", { status: 404 });

  let body: Buffer | Uint8Array | null = null;
  if (allowed.pdf_path) {
    const { data } = await admin.storage.from("statements").download(allowed.pdf_path);
    if (data) body = new Uint8Array(await data.arrayBuffer());
  }
  body ??= await renderStatementPdf(document);

  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${statementFileName(document)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
