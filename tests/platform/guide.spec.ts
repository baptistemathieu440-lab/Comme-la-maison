import { expect, test } from "@playwright/test";

import { AUTH_DIR, anonymousClient, serviceClient, userClient } from "./support";

/**
 * Guide voyageurs : la table guide_places n'est lisible et modifiable que par les
 * administrateurs (double authentification). Le site public passe par le serveur.
 */
test.describe("Guide voyageurs (règles d'accès de la base)", () => {
  const slug = "e2e-test-adresse-guide";

  test.beforeAll(async () => {
    await serviceClient().from("guide_places").upsert(
      { slug, name: "Adresse de test E2E", kind: "restaurant", summary: "Test.", area: "Bordeaux", is_demo: true },
      { onConflict: "slug" },
    );
  });

  test.afterAll(async () => {
    await serviceClient().from("guide_places").delete().eq("slug", slug);
  });

  test("un visiteur anonyme, un propriétaire ou un agent ne lisent ni ne modifient le guide", async () => {
    const { data: anon } = await anonymousClient().from("guide_places").select("id").eq("slug", slug);
    expect(anon ?? []).toEqual([]);

    for (const account of ["ownerA", "staff"] as const) {
      const client = await userClient(account);
      const { data: read } = await client.from("guide_places").select("id").eq("slug", slug);
      expect(read ?? [], account).toEqual([]);
      const { data: updated } = await client.from("guide_places").update({ name: "Piraté" }).eq("slug", slug).select("id");
      expect(updated ?? [], account).toEqual([]);
      const { error } = await client
        .from("guide_places")
        .insert({ slug: `${slug}-${account}`, name: "Intrus", kind: "bar", summary: "x", area: "Bordeaux" });
      expect(error, account).not.toBeNull();
    }
  });

  test("un administrateur sans double authentification n'y a pas accès, avec elle oui", async () => {
    const withoutMfa = await userClient("admin", { mfa: false });
    const { data: blocked } = await withoutMfa.from("guide_places").select("id").eq("slug", slug);
    expect(blocked ?? []).toEqual([]);

    const admin = await userClient("admin");
    const { data: rows } = await admin.from("guide_places").select("id").eq("slug", slug);
    expect(rows).toHaveLength(1);
    const { data: updated } = await admin.from("guide_places").update({ tip: "Conseil E2E" }).eq("slug", slug).select("tip");
    expect(updated?.[0]?.tip).toBe("Conseil E2E");
  });

  test("une note ne peut pas être enregistrée sans sa source", async () => {
    const admin = await userClient("admin");
    const { error } = await admin.from("guide_places").update({ rating: 4.5, rating_source: null }).eq("slug", slug);
    expect(error).not.toBeNull();
  });
});

test.describe("Guide voyageurs (back-office)", () => {
  test.use({ storageState: `${AUTH_DIR}/admin.json` });

  test("la sélection s'importe, une modification apparaît aussitôt dans le guide public", async ({ page }) => {
    await page.goto("/admin/guide");
    const importButton = page.getByRole("button", { name: /^Importer \d+ adresse/ });
    if (await importButton.isVisible()) {
      page.once("dialog", (dialog) => dialog.accept());
      await importButton.click();
      // Une fois tout importé, le panneau d'import disparaît et les adresses sont listées.
      await expect(importButton).toBeHidden();
      await expect(page.getByRole("link", { name: "Miroir d’eau" })).toBeVisible();
    }
    await page.goto("/admin/guide?q=miroir");
    await page.getByRole("link", { name: "Miroir d’eau" }).click();
    await expect(page).toHaveURL(/\/admin\/guide\/[0-9a-f-]{36}/);

    const tip = `Conseil de test ${Date.now()}`;
    await page.getByLabel("Notre petit conseil").fill(tip);
    await page.getByRole("button", { name: "Enregistrer" }).first().click();
    await expect(page.getByText("Adresse enregistrée. Le guide est à jour.")).toBeVisible();

    await page.goto("/guide/adresse/miroir-d-eau");
    await expect(page.getByText(tip)).toBeVisible();

    // Une note sans source est refusée par le formulaire.
    await page.goto("/admin/guide?q=miroir");
    await page.getByRole("link", { name: "Miroir d’eau" }).click();
    await page.getByLabel("Note sur 5").fill("4,7");
    await page.getByRole("button", { name: "Enregistrer" }).first().click();
    await expect(page.getByText(/Indiquez d’où vient la note/)).toBeVisible();
  });

  test("le QR code pointe vers /guide", async ({ page }) => {
    await page.goto("/admin/guide/qr-code");
    await expect(page.getByRole("img", { name: /QR code vers .*\/guide$/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /SVG/ })).toHaveAttribute("download", /\.svg$/);
  });
});
