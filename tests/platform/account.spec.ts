import { expect, test } from "@playwright/test";

import { serviceClient } from "./support";

const EMAIL = "premiere-connexion.e2e@example.com";
const TEMPORARY = "Provisoire-2026-abc";
const CHOSEN = "Personnel-2026-xyz";
const LATER = "Nouveau-2026-uvw";

test.describe("Compte créé avec un mot de passe provisoire", () => {
  let userId: string;

  test.beforeAll(async () => {
    const service = serviceClient();
    const { data: users } = await service.auth.admin.listUsers({ perPage: 1000 });
    const previous = users?.users.find((user) => user.email === EMAIL);
    if (previous) await service.auth.admin.deleteUser(previous.id);
    const { data, error } = await service.auth.admin.createUser({
      email: EMAIL,
      password: TEMPORARY,
      email_confirm: true,
      user_metadata: { full_name: "Agent Provisoire", must_change_password: true },
    });
    expect(error, error?.message).toBeNull();
    userId = data.user!.id;
    await service.from("user_roles").insert({ user_id: userId, role: "staff" });
  });

  test.afterAll(async () => {
    if (userId) await serviceClient().auth.admin.deleteUser(userId);
  });

  test("doit choisir son mot de passe avant d'entrer, puis le gère depuis Mon compte", async ({ page }) => {
    await page.goto("/connexion");
    await page.getByRole("textbox", { name: /Adresse email/ }).first().fill(EMAIL);
    await page.getByLabel(/Mot de passe/).fill(TEMPORARY);
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page).toHaveURL(/\/connexion\/nouveau-mot-de-passe$/);
    await expect(page.getByRole("heading", { name: "Choisissez votre mot de passe" })).toBeVisible();

    // Aucun espace n'est accessible tant que le mot de passe provisoire n'est pas remplacé.
    await page.goto("/staff");
    await expect(page).toHaveURL(/\/connexion\/nouveau-mot-de-passe$/);

    await page.getByLabel(/^Nouveau mot de passe/).fill(CHOSEN);
    await page.getByLabel(/^Confirmez le mot de passe/).fill(CHOSEN);
    await page.getByRole("button", { name: "Enregistrer et continuer" }).click();
    await expect(page).toHaveURL(/\/staff$/);

    const { data } = await serviceClient().auth.admin.getUserById(userId);
    expect(data.user?.user_metadata.must_change_password).toBe(false);

    // Mon compte : nom et téléphone.
    await page.goto("/staff/compte");
    await expect(page.getByRole("heading", { name: "Mon compte", level: 1 })).toBeVisible();
    const infos = page.locator("#informations");
    await infos.getByLabel(/^Nom affiché/).fill("Agent Choisi");
    await infos.getByLabel("Téléphone").fill("06 11 22 33 44");
    await infos.getByRole("button", { name: "Enregistrer" }).click();
    await expect(infos.getByText("Vos informations sont enregistrées.")).toBeVisible();
    const { data: profile } = await serviceClient().from("profiles").select("full_name, phone").eq("id", userId).single();
    expect(profile).toEqual({ full_name: "Agent Choisi", phone: "06 11 22 33 44" });

    // Mot de passe : l'actuel est vérifié.
    const password = page.locator("#mot-de-passe");
    await password.getByLabel(/^Mot de passe actuel/).fill("pas-le-bon-1");
    await password.getByLabel(/^Nouveau mot de passe/).fill(LATER);
    await password.getByLabel(/^Confirmez le nouveau mot de passe/).fill(LATER);
    await password.getByRole("button", { name: "Changer le mot de passe" }).click();
    await expect(password.getByText("Le mot de passe actuel est incorrect.")).toBeVisible();

    await password.getByLabel(/^Mot de passe actuel/).fill(CHOSEN);
    await password.getByRole("button", { name: "Changer le mot de passe" }).click();
    await expect(password.getByText(/Votre mot de passe est modifié/)).toBeVisible();

    // La session en cours reste ouverte ; le nouveau mot de passe fonctionne.
    await page.goto("/staff");
    await expect(page).toHaveURL(/\/staff$/);
    const check = await page.request.post("/auth/deconnexion");
    expect(check.status()).toBeLessThan(400);
    await page.goto("/connexion");
    await page.getByRole("textbox", { name: /Adresse email/ }).first().fill(EMAIL);
    await page.getByLabel(/Mot de passe/).fill(LATER);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/staff$/);
  });
});
