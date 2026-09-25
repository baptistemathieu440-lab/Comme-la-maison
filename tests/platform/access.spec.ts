import { expect, test } from "@playwright/test";

import { AUTH_DIR, readIds } from "./support";

test.describe("Accès aux espaces (interface)", () => {
  test("un visiteur non connecté est renvoyé vers la connexion", async ({ page }) => {
    for (const path of ["/admin", "/owner", "/staff/planning"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/connexion/);
    }
    const pdf = await page.request.get(`/api/releves/${readIds().statementA}/pdf`);
    expect(pdf.status()).toBe(401);
  });

  test.describe("propriétaire", () => {
    test.use({ storageState: `${AUTH_DIR}/ownerA.json` });

    test("ne peut ni entrer dans le back-office ni ouvrir les données d'un autre propriétaire", async ({ page }) => {
      const ids = readIds();
      await page.goto("/admin");
      await expect(page).toHaveURL(/\/owner$/);
      await page.goto("/staff");
      await expect(page).toHaveURL(/\/owner$/);

      const foreign = await page.goto(`/owner/releves/${ids.statementB}`);
      expect(foreign?.status()).toBe(404);
      const foreignProperty = await page.goto(`/owner/biens/${ids.propertyB}`);
      expect(foreignProperty?.status()).toBe(404);
      const foreignPdf = await page.request.get(`/api/releves/${ids.statementB}/pdf`);
      expect(foreignPdf.status()).toBe(404);

      const ownPdf = await page.request.get(`/api/releves/${ids.statementA}/pdf`);
      expect(ownPdf.status()).toBe(200);
      expect(ownPdf.headers()["content-type"]).toBe("application/pdf");
    });

    test("voit ses séjours avec le seul prénom des voyageurs", async ({ page }) => {
      await page.goto("/owner/reservations");
      await expect(page.getByRole("heading", { name: "Réservations", level: 1 })).toBeVisible();
      await expect(page.getByText("@example.com")).toHaveCount(0);
      await expect(page.locator("table").getByText(/Démo · (T2 Chartrons|Studio Saint-Pierre)/).first()).toBeVisible();
      await expect(page.getByText("Maison Caudéran")).toHaveCount(0);
    });
  });

  test.describe("agent", () => {
    test.use({ storageState: `${AUTH_DIR}/staff.json` });

    test("ne peut ouvrir ni le back-office ni la tâche d'un autre", async ({ page }) => {
      await page.goto("/admin/reservations");
      await expect(page).toHaveURL(/\/staff$/);
      const other = await page.goto(`/staff/taches/${readIds().otherTask}`);
      expect(other?.status()).toBe(404);
    });
  });

  test.describe("administrateur", () => {
    test.use({ storageState: `${AUTH_DIR}/admin.json` });

    test("accède au tableau de bord et à la recherche", async ({ page }) => {
      await page.goto("/admin");
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Bonjour");
      await page.goto("/admin/recherche?q=chartrons");
      await expect(page.getByRole("link", { name: "Démo · T2 Chartrons" }).first()).toBeVisible();
    });
  });
});
