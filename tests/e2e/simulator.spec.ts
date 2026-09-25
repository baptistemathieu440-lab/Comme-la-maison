import { expect, test } from "@playwright/test";

test.describe("Simulateur", () => {
  test("reprend l'exemple du brief : 100 € × 20 nuits", async ({ page }) => {
    await page.goto("/nos-offres#simulateur");
    const results = page.locator("#simulateur dl");
    await expect(results).toContainText("2 000 €");
    await expect(results).toContainText("400 €");
    await expect(results).toContainText("1 600 €");
    await expect(page.getByText(/Simulation indicative\./)).toBeVisible();
  });

  test("recalcule quand on change les valeurs", async ({ page }) => {
    await page.goto("/nos-offres#simulateur");
    await page.getByLabel("Prix moyen par nuit", { exact: true }).fill("150");
    await page.getByLabel("Nombre de nuits louées par mois", { exact: true }).fill("10");
    const results = page.locator("#simulateur dl");
    await expect(results).toContainText("1 500 €");
    await expect(results).toContainText("300 €");
    await expect(results).toContainText("1 200 €");
  });

  test("déduit les frais de plateforme avant d'appliquer les 20 %", async ({ page }) => {
    await page.goto("/nos-offres#simulateur");
    await page.getByLabel("Frais prélevés par la plateforme", { exact: true }).fill("15");
    const results = page.locator("#simulateur dl");
    // 100 € × 20 nuits = 2 000 € ; 15 % de frais = 300 € ; perçu 1 700 € ; commission 340 € ; reste 1 360 €.
    await expect(results).toContainText("2 000 €");
    await expect(results).toContainText("300 €");
    await expect(results).toContainText("1 700 €");
    await expect(results).toContainText("340 €");
    await expect(results).toContainText("1 360 €");
  });

  test("explique une saisie invalide", async ({ page }) => {
    await page.goto("/nos-offres#simulateur");
    const nights = page.getByLabel("Nombre de nuits louées par mois", { exact: true });
    await nights.fill("45");
    await expect(page.getByText("Indiquez un nombre entier de nuits entre 0 et 31.")).toBeVisible();
    await expect(nights).toHaveAttribute("aria-invalid", "true");
  });
});
