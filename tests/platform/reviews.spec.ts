import { expect, test } from "@playwright/test";

import { AUTH_DIR, anonymousClient, serviceClient, userClient } from "./support";

/**
 * Avis clients : la table site_reviews n'est lisible et modifiable que par les
 * administrateurs (double authentification). Le site public passe par le serveur,
 * et un avis ne peut être publié sans l'accord de son auteur.
 */
test.describe("Avis clients (règles d'accès de la base)", () => {
  const author = "Auteur de test E2E";

  test.beforeAll(async () => {
    await serviceClient().from("site_reviews").delete().eq("author_name", author);
    await serviceClient()
      .from("site_reviews")
      .insert({ author_name: author, category: "voyageur", rating: 5, body: "Avis de test automatique.", is_demo: true });
  });

  test.afterAll(async () => {
    await serviceClient().from("site_reviews").delete().eq("author_name", author);
  });

  test("un visiteur anonyme, un propriétaire ou un agent ne lisent ni ne modifient les avis", async () => {
    const { data: anon } = await anonymousClient().from("site_reviews").select("id").eq("author_name", author);
    expect(anon ?? []).toEqual([]);

    for (const account of ["ownerA", "staff"] as const) {
      const client = await userClient(account);
      const { data: read } = await client.from("site_reviews").select("id").eq("author_name", author);
      expect(read ?? [], account).toEqual([]);
      const { data: updated } = await client.from("site_reviews").update({ body: "Avis modifié par un intrus." }).eq("author_name", author).select("id");
      expect(updated ?? [], account).toEqual([]);
      const { error } = await client
        .from("site_reviews")
        .insert({ author_name: "Intrus", category: "client", rating: 5, body: "Faux avis ajouté par un intrus." });
      expect(error, account).not.toBeNull();
    }
  });

  test("un administrateur sans double authentification n'y a pas accès, avec elle oui", async () => {
    const withoutMfa = await userClient("admin", { mfa: false });
    const { data: blocked } = await withoutMfa.from("site_reviews").select("id").eq("author_name", author);
    expect(blocked ?? []).toEqual([]);

    const admin = await userClient("admin");
    const { data: rows } = await admin.from("site_reviews").select("id").eq("author_name", author);
    expect(rows).toHaveLength(1);
  });

  test("un avis ne peut pas être publié sans l'accord de son auteur", async () => {
    const admin = await userClient("admin");
    const { error } = await admin.from("site_reviews").update({ is_published: true, consent_confirmed: false }).eq("author_name", author);
    expect(error).not.toBeNull();
    const { error: withConsent } = await admin
      .from("site_reviews")
      .update({ is_published: true, consent_confirmed: true })
      .eq("author_name", author);
    expect(withConsent).toBeNull();
  });
});

test.describe("Avis clients (back-office)", () => {
  test.use({ storageState: `${AUTH_DIR}/admin.json` });
  const author = `Testeur ${Date.now()}`;

  test.afterAll(async () => {
    await serviceClient().from("site_reviews").delete().eq("author_name", author);
  });

  test("un avis saisi n'est publié qu'avec l'accord de l'auteur, puis apparaît sur l'accueil", async ({ page }) => {
    const text = `Un accompagnement attentif du début à la fin (${author}).`;
    await page.goto("/admin/avis/nouveau");
    await page.getByLabel("Texte de l’avis").fill(text);
    await page.getByLabel("Prénom affiché").fill(author);
    await page.getByLabel("Afficher sur l’accueil du site").check();
    await page.getByRole("button", { name: "Enregistrer l’avis" }).click();
    await expect(page.getByText("Cochez l’accord de l’auteur avant de publier l’avis.").first()).toBeVisible();

    await page.getByLabel("L’auteur a accepté que son avis soit publié sur le site").check();
    await page.getByRole("button", { name: "Enregistrer l’avis" }).click();
    await expect(page).toHaveURL(/\/admin\/avis\/[0-9a-f-]{36}/);
    await expect(page.getByText("Publié sur l’accueil").first()).toBeVisible();

    await page.goto("/");
    await expect(page.locator("#avis").getByText(text)).toBeVisible();

    await page.goBack();
    await page.getByRole("button", { name: "Retirer de l’accueil" }).click();
    await expect(page.getByText("Avis retiré de l’accueil.")).toBeVisible();
    await page.goto("/");
    await expect(page.getByText(text)).toHaveCount(0);
  });
});
