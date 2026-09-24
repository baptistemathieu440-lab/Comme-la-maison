import { expect, test } from "@playwright/test";

test.describe("Page d'accueil", () => {
  test("dit en quelques secondes qui, quoi, où, combien et comment contacter", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Conciergerie Airbnb à Bordeaux");
    await expect(h1).toContainText("Votre logement, notre savoir‑faire.");
    await expect(page.getByText("Conciergerie Airbnb et location courte durée à Bordeaux et dans sa métropole.")).toBeVisible();
    const hero = page.locator("[data-hero]");
    await expect(hero.getByText("20 % TTC des revenus locatifs")).toBeVisible();
    await expect(page.getByRole("link", { name: "Estimer mon logement" }).first()).toHaveAttribute("href", "/#estimation");
  });

  test("n'a qu'un seul H1 et une hiérarchie de titres continue", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    const levels = await page.locator("main h1, main h2, main h3").evaluateAll((els) =>
      els.map((el) => Number(el.tagName.slice(1))),
    );
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1], `saut de niveau avant le titre n°${i + 1}`).toBeLessThanOrEqual(1);
    }
  });

  test("affiche la tarification et la mention sur le ménage et le linge", async ({ page }) => {
    await page.goto("/#tarifs");
    const tarifs = page.locator("#tarifs");
    await expect(tarifs.getByRole("heading", { name: /Une commission simple/ })).toBeVisible();
    await expect(tarifs.getByText("Box de bienvenue")).toBeVisible();
    await expect(tarifs.getByText(/réglé par les voyageurs/)).toBeVisible();
    await expect(tarifs.getByText(/Il reste à votre charge/)).toBeVisible();
  });

  test("les accordéons de la FAQ s'ouvrent au clavier", async ({ page }) => {
    await page.goto("/#faq");
    const question = page.locator("#faq summary", { hasText: "La box de bienvenue est-elle incluse ?" });
    await question.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/elle est incluse dans notre commission de 20 %/)).toBeVisible();
  });

  test("n'invente aucun chiffre : la transparence annonce des données à venir", async ({ page }) => {
    await page.goto("/transparence");
    await expect(page.getByText("Nos données seront publiées ici au fur et à mesure que notre activité se développe.")).toBeVisible();
    await expect(page.getByText("Données à venir")).toHaveCount(7);
  });

  test("aucun défilement horizontal", async ({ page }) => {
    for (const path of ["/", "/transparence", "/mentions-legales", "/confidentialite"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
