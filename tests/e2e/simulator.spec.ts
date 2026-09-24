import { expect, test } from "@playwright/test";

test.describe("Simulateur", () => {
  test("reprend l'exemple du brief : 100 € × 20 nuits", async ({ page }) => {
    await page.goto("/#simulateur");
    const results = page.locator("#simulateur dl");
    await expect(results).toContainText("2 000 €");
    await expect(results).toContainText("400 €");
    await expect(results).toContainText("1 600 €");
    await expect(page.getByText(/Simulation indicative\./)).toBeVisible();
  });

  test("recalcule quand on change les valeurs", async ({ page }) => {
    await page.goto("/#simulateur");
    await page.getByLabel("Prix moyen par nuit", { exact: true }).fill("150");
    await page.getByLabel("Nombre de nuits louées par mois", { exact: true }).fill("10");
    const results = page.locator("#simulateur dl");
    await expect(results).toContainText("1 500 €");
    await expect(results).toContainText("300 €");
    await expect(results).toContainText("1 200 €");
  });

  test("explique une saisie invalide", async ({ page }) => {
    await page.goto("/#simulateur");
    const nights = page.getByLabel("Nombre de nuits louées par mois", { exact: true });
    await nights.fill("45");
    await expect(page.getByText("Indiquez un nombre entier de nuits entre 0 et 31.")).toBeVisible();
    await expect(nights).toHaveAttribute("aria-invalid", "true");
  });
});
