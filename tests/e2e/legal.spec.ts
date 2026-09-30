import { expect, test } from "@playwright/test";

const legalPages = [
  { label: "Mentions légales", path: "/mentions-legales", heading: /Mentions légales/ },
  { label: "Politique de confidentialité", path: "/politique-confidentialite", heading: /Politique de confidentialité/ },
  { label: "Politique cookies", path: "/politique-cookies", heading: /Politique cookies/ },
  { label: "Conditions générales", path: "/conditions-generales-vente", heading: /Conditions générales de prestation de services/ },
];

test.describe("informations légales", () => {
  test("le pied de page mène à chaque document légal", async ({ page }) => {
    for (const { label, path, heading } of legalPages) {
      await page.goto("/");
      const link = page.getByRole("navigation", { name: "Informations légales" }).getByRole("link", { name: label });
      await expect(link).toHaveAttribute("href", path);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    }
  });

  test("les documents légaux sont servis, liés entre eux et non indexés", async ({ page }) => {
    for (const { path } of legalPages) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      const others = page.getByRole("navigation", { name: "Autres documents légaux" }).getByRole("link");
      await expect(others).toHaveCount(legalPages.length - 1);
    }
  });

  test("aucune information légale n'est inventée : les manques sont signalés", async ({ page }) => {
    await page.goto("/mentions-legales");
    for (const label of ["DÉNOMINATION SOCIALE", "SIRET", "ADRESSE DU SIÈGE", "RCS OU RNE", "NOM ET QUALITÉ"]) {
      await expect(page.getByText(`[À COMPLÉTER — ${label}]`).first()).toBeVisible();
    }
    // Hébergeur vérifié dans la configuration du projet.
    await expect(page.getByText("Netlify, Inc.").first()).toBeVisible();
    // Aucune activité réglementée présentée comme acquise.
    await expect(page.getByText("Point en cours de vérification")).toBeVisible();
  });

  test("le guide voyageurs donne accès aux documents légaux", async ({ page }) => {
    await page.goto("/guide");
    const nav = page.getByRole("contentinfo").getByRole("navigation", { name: "Informations légales" });
    await expect(nav.getByRole("link", { name: "Politique de confidentialité" })).toHaveAttribute("href", "/politique-confidentialite");
  });

  test("la page de connexion informe sur les données et le cookie de session", async ({ page }) => {
    await page.goto("/connexion");
    await expect(page.getByRole("link", { name: "politique de confidentialité" })).toHaveAttribute("href", "/politique-confidentialite");
    await expect(page.getByRole("link", { name: "politique cookies" })).toHaveAttribute("href", "/politique-cookies");
  });

  test("le site public ne dépose aucun cookie", async ({ page, context }) => {
    for (const path of ["/", "/nos-offres", "/tarifs", "/nos-biens", "/contact", "/guide", "/mentions-legales"]) {
      await page.goto(path);
    }
    expect(await context.cookies()).toEqual([]);
  });

  test("le formulaire d'estimation informe au moment de la collecte, sans case pré-cochée", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("form").filter({ has: page.getByRole("button", { name: /Estimer mon logement/ }) });
    await expect(form.locator('input[type="checkbox"]:checked')).toHaveCount(0);
    const notice = form.locator("#contact-privacy");
    await expect(notice).toContainText("mesures précontractuelles");
    await expect(notice).toContainText("effacer");
    await expect(notice.getByRole("link", { name: "politique de confidentialité" })).toHaveAttribute(
      "href",
      "/politique-confidentialite#conservation",
    );
  });

  test("une adresse inconnue renvoie une page 404", async ({ page }) => {
    const response = await page.goto("/cette-page-n-existe-pas");
    expect(response?.status()).toBe(404);
  });

  test("les pages légales restent lisibles sans défilement horizontal", async ({ page }) => {
    for (const { path } of legalPages) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
