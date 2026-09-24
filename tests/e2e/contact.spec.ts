import { expect, test } from "@playwright/test";

test.describe("Formulaire d'estimation", () => {
  test("liste les champs obligatoires manquants", async ({ page }) => {
    await page.goto("/#estimation");
    await page.locator("#estimation").getByRole("button", { name: "Estimer mon logement" }).click();
    const alert = page.locator("#estimation [role=alert]");
    await expect(alert).toContainText("5 champs sont à corriger");
    await expect(page.getByRole("textbox", { name: "Prénom", exact: true })).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#contact-email-error")).toContainText("Indiquez votre adresse email.");
  });

  test("signale un email incomplet de façon précise", async ({ page }) => {
    await page.goto("/#estimation");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill("baptiste@");
    await page.locator("#estimation").getByRole("button", { name: "Estimer mon logement" }).click();
    await expect(page.locator("#contact-email-error")).toContainText("Exemple : prenom@domaine.fr");
  });

  test("envoie une demande complète", async ({ page }) => {
    await page.goto("/#estimation");
    await page.getByRole("textbox", { name: "Prénom", exact: true }).fill("Camille");
    await page.getByRole("textbox", { name: "Nom", exact: true }).fill("Durand");
    await page.getByRole("textbox", { name: "Téléphone", exact: true }).fill("06 12 34 56 78");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill("camille@example.com");
    await page.getByRole("combobox", { name: "Ville du logement", exact: true }).fill("Mérignac");
    await page.getByLabel(/^Type de logement/).selectOption("Appartement");
    await page.getByLabel(/^Nombre de chambres/).selectOption("2");
    await page.getByLabel(/^Capacité/).fill("4");
    // Le serveur ignore les envois plus rapides que 2,5 s (anti-robots).
    await page.waitForTimeout(2800);
    await page.locator("#estimation").getByRole("button", { name: "Estimer mon logement" }).click();
    await expect(page.getByRole("status")).toContainText("Merci Camille, votre demande est bien envoyée.");
  });
});
