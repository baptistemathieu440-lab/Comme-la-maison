import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isPlatformConfigured, supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Rafraîchit la session Supabase avant le rendu des espaces connectés.
 * Le site public n'y passe pas : il reste statique.
 * Les droits sont vérifiés dans chaque page et chaque action (src/lib/auth),
 * et par les règles d'accès de la base : ce proxy n'est pas une barrière de sécurité.
 */
export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  if (!isPlatformConfigured()) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request: { headers: requestHeaders } });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers ?? {})) response.headers.set(key, value);
      },
    },
  });

  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/owner/:path*", "/staff/:path*", "/connexion/:path*", "/auth/:path*", "/api/fichiers/:path*"],
};
