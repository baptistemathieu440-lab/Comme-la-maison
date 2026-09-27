import { expect, test } from "@playwright/test";

test("le pied de page mène à la connexion des espaces", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("contentinfo").getByRole("link", { name: "Connexion à votre espace" });
  await expect(link).toHaveAttribute("href", "/connexion");
  await link.click();
  await expect(page).toHaveURL(/\/connexion$/);
});
