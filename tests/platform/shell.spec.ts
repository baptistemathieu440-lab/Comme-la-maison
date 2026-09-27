import { expect, test } from "@playwright/test";

import { AUTH_DIR } from "./support";

test.describe("Back-office : accès au site public", () => {
  test.use({ storageState: `${AUTH_DIR}/admin.json` });

  test("la barre du haut ouvre le site public dans un nouvel onglet", async ({ page, context }) => {
    await page.goto("/admin");
    const link = page.getByRole("banner").getByRole("link", { name: /Voir le site/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/");
    await expect(link).toHaveAttribute("target", "_blank");
    const [site] = await Promise.all([context.waitForEvent("page"), link.click()]);
    await site.waitForLoadState();
    await expect(site.getByRole("heading", { level: 1 })).toContainText("Votre logement");
  });
});
