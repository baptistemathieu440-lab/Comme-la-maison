import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Guide voyageurs", () => {
  test("l'accueil accueille le voyageur et mène aux rubriques", async ({ page }) => {
    await page.goto("/guide");
    await expect(page.getByRole("heading", { level: 1, name: /Bienvenue à Bordeaux/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nos incontournables" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Besoin d’un conseil ?" })).toBeVisible();
    await expect(page.getByText(/Informations vérifiées le/)).toBeVisible();
    await page.getByRole("link", { name: "Manger", exact: true }).click();
    await expect(page).toHaveURL(/\/guide\/restaurants-bordeaux$/);
    await expect(page.getByRole("heading", { level: 1, name: "Où manger à Bordeaux" })).toBeVisible();
  });

  test("la barre d'onglets reste accessible au pouce sur téléphone", async ({ page, isMobile }) => {
    test.skip(!isMobile, "barre du bas réservée aux petits écrans");
    await page.goto("/guide");
    const nav = page.getByRole("navigation", { name: "Navigation du guide" }).last();
    await expect(nav).toBeInViewport();
    await nav.getByRole("link", { name: "Explorer" }).click();
    await expect(page).toHaveURL(/\/guide\/explorer/);
  });

  test("une fiche donne l'essentiel et un lien Google Maps", async ({ page }) => {
    await page.goto("/guide/adresse/cite-du-vin");
    await expect(page.getByRole("heading", { level: 1, name: "La Cité du Vin" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pourquoi on vous le recommande" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Notre petit conseil" })).toBeVisible();
    const maps = page.getByRole("link", { name: /Voir sur Google Maps/ });
    await expect(maps).toHaveAttribute("href", /google\.com\/maps/);
    await expect(page.getByText(/Informations vérifiées le/)).toBeVisible();
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(JSON.parse(jsonLd ?? "{}")["@type"]).toBe("TouristAttraction");
  });

  test("les filtres réduisent la liste et restent dans l'adresse", async ({ page }) => {
    await page.goto("/guide/explorer");
    const status = page.getByRole("status").filter({ hasText: /adresses?$/ }).first();
    const total = Number((await status.textContent())?.match(/\d+/)?.[0]);
    await page.getByRole("button", { name: /Il pleut/ }).click();
    await expect(page).toHaveURL(/meteo=pluie/);
    const rainy = Number((await status.textContent())?.match(/\d+/)?.[0]);
    expect(rainy).toBeGreaterThan(0);
    expect(rainy).toBeLessThan(total);
    await page.getByRole("button", { name: /^Filtres/ }).click();
    const dialog = page.getByRole("dialog", { name: "Filtrer" });
    await dialog.getByRole("button", { name: "Gratuit" }).click();
    await expect(page).toHaveURL(/budget=0/);
    await dialog.getByRole("button", { name: /^Voir \d+ adresse/ }).click();
    await expect(dialog).toBeHidden();
    await page.reload();
    await expect(page.getByRole("button", { name: /Il pleut/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("les favoris sont gardés sur le téléphone, sans compte", async ({ page }) => {
    await page.goto("/guide/adresse/miroir-d-eau");
    await page.getByRole("button", { name: /Ajouter Miroir d’eau à mes favoris/ }).click();
    await page.goto("/guide/favoris");
    await expect(page.getByRole("heading", { name: "Miroir d’eau" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Miroir d’eau" })).toBeVisible();
    await page.getByRole("button", { name: /Retirer Miroir d’eau de mes favoris/ }).click();
    await expect(page.getByText(/Touchez le cœur/)).toBeVisible();
  });

  test("les itinéraires renvoient vers des fiches", async ({ page }) => {
    await page.goto("/guide/itineraires");
    await expect(page.getByRole("heading", { name: "Vous avez seulement 24 h ?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "72 h à Bordeaux" })).toBeVisible();
    await page.getByRole("link", { name: "Voir la fiche" }).first().click();
    await expect(page).toHaveURL(/\/guide\/adresse\//);
  });

  test("la carte se charge avec ses marqueurs", async ({ page }) => {
    await page.goto("/guide/carte");
    await expect(page.locator(".guide-marker").first()).toBeAttached({ timeout: 15_000 });
    await expect(page.getByText(/adresses sur la carte/)).toBeVisible();
  });

  test("adresses courtes pour le QR code et rubrique inconnue", async ({ page }) => {
    await page.goto("/guide-voyageur");
    await expect(page).toHaveURL(/\/guide$/);
    const missing = await page.goto("/guide/rubrique-qui-n-existe-pas");
    expect(missing?.status()).toBe(404);
  });

  for (const path of ["/guide", "/guide/explorer", "/guide/restaurants-bordeaux", "/guide/adresse/saint-emilion", "/guide/itineraires", "/guide/favoris"]) {
    test(`accessibilité (axe, WCAG 2.2 AA) : ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.addStyleTag({ content: ".reveal,.hero-in{animation:none!important}" });
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id} : ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`)).toEqual([]);
    });
  }
});
