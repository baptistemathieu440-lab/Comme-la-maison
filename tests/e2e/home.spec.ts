import { expect, test } from "@playwright/test";

test.describe("Page d'accueil", () => {
  test("dit en quelques secondes qui, quoi, où, et comment nous contacter", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("[data-hero]");
    await expect(hero.getByText("Comme à la Maison", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Votre logement, soigné comme à la maison.");
    await expect(hero.getByText(/location courte durée à Bordeaux et dans sa métropole/)).toBeVisible();
    await expect(hero.getByRole("link", { name: "Découvrir nos offres" })).toHaveAttribute("href", "/nos-offres");
    await expect(hero.getByRole("link", { name: "Confier mon bien" })).toHaveAttribute("href", "/contact");
  });

  test("reste courte : promesse, offres, tarif, biens, pourquoi, avis, contact", async ({ page }) => {
    await page.goto("/");
    const titles = await page.locator("main h2").allTextContents();
    expect(titles.length).toBeLessThanOrEqual(8);
    await expect(page.getByRole("link", { name: "Découvrir toutes nos offres" })).toHaveAttribute("href", "/nos-offres");
    await expect(page.getByRole("link", { name: "Découvrir nos biens" })).toHaveAttribute("href", "/nos-biens");
    await expect(page.getByRole("link", { name: "Comprendre notre fonctionnement" })).toHaveAttribute("href", "/nos-offres#fonctionnement");
    await expect(page.getByText("20 %").first()).toBeVisible();
  });

  test("n'a qu'un seul H1 et une hiérarchie de titres continue", async ({ page }) => {
    for (const path of ["/", "/nos-offres", "/nos-biens", "/a-propos", "/contact"]) {
      await page.goto(path);
      await expect(page.locator("h1"), path).toHaveCount(1);
      const levels = await page.locator("main h1, main h2, main h3, main h4").evaluateAll((els) =>
        els.map((el) => Number(el.tagName.slice(1))),
      );
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1], `${path} : saut de niveau avant le titre n°${i + 1}`).toBeLessThanOrEqual(1);
      }
    }
  });

  test("les avis s'affichent en entier, et les exemples sont signalés comme tels", async ({ page }) => {
    await page.goto("/");
    const avis = page.locator("#avis");
    await expect(avis.getByRole("heading", { level: 2 })).toBeVisible();
    const cards = avis.locator("li figure");
    expect(await cards.count()).toBeGreaterThan(0);
    // Aucun texte tronqué : la citation tient dans sa carte.
    const clipped = await avis.locator("blockquote").evaluateAll((els) => els.some((el) => el.scrollHeight > el.clientHeight + 1));
    expect(clipped).toBe(false);
    const examples = await avis.getByText("Exemple", { exact: true }).count();
    if (examples > 0) expect(examples).toBe(await cards.count());
    await avis.getByRole("button", { name: "Voyageurs" }).click();
    await expect(avis.getByRole("button", { name: "Voyageurs" })).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("Pages du site", () => {
  test("la navigation principale mène aux quatre pages", async ({ page, isMobile }) => {
    test.skip(isMobile, "navigation du bureau");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navigation principale" });
    for (const [label, path] of [["Nos biens", "/nos-biens"], ["Nos offres", "/nos-offres"], ["À propos", "/a-propos"], ["Accueil", "/"]] as const) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path === "/" ? "/$" : path}`));
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
    }
  });

  test("Nos offres détaille la tarification, le ménage et le linge", async ({ page }) => {
    await page.goto("/nos-offres#fonctionnement");
    const tarifs = page.locator("#fonctionnement");
    await expect(tarifs.getByRole("heading", { name: /Une commission simple/ })).toBeVisible();
    await expect(tarifs.getByText("Box de bienvenue", { exact: true })).toBeVisible();
    await expect(tarifs.getByText(/réglé par les voyageurs/)).toBeVisible();
    await expect(tarifs.getByText(/Il reste à votre charge/)).toBeVisible();
    await expect(tarifs.getByText(/après déduction des frais prélevés par la plateforme/)).toBeVisible();
    await expect(tarifs.getByText(/versent le prix des séjours directement sur votre compte/)).toBeVisible();
    await expect(page.locator("#box-de-bienvenue").getByText("Box premium")).toBeVisible();
  });

  test("les accordéons de la FAQ s'ouvrent au clavier", async ({ page }) => {
    await page.goto("/nos-offres#faq");
    const question = page.locator("#faq summary", { hasText: "La box de bienvenue est-elle incluse ?" });
    await question.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/elle est incluse dans notre commission de 20 %/)).toBeVisible();
  });

  test("À propos présente Baptiste et Simon", async ({ page }) => {
    await page.goto("/a-propos");
    await expect(page.getByRole("heading", { name: "Baptiste", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Simon", exact: true })).toBeVisible();
  });

  test("Nos biens n'invente aucun logement", async ({ page }) => {
    await page.goto("/nos-biens");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("les anciennes adresses redirigent", async ({ page }) => {
    await page.goto("/logements");
    await expect(page).toHaveURL(/\/nos-biens$/);
    await page.goto("/confidentialite");
    await expect(page).toHaveURL(/\/politique-confidentialite$/);
  });

  test("n'invente aucun chiffre : la transparence annonce des données à venir", async ({ page }) => {
    await page.goto("/transparence");
    await expect(page.getByText("Nos données seront publiées ici au fur et à mesure que notre activité se développe.")).toBeVisible();
    await expect(page.getByText("Données à venir")).toHaveCount(7);
  });

  test("aucun défilement horizontal", async ({ page }) => {
    for (const path of ["/", "/nos-offres", "/nos-biens", "/a-propos", "/contact", "/transparence", "/mentions-legales", "/politique-confidentialite"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
