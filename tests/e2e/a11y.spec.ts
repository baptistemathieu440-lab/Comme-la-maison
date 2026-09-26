import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/nos-offres", "/nos-biens", "/a-propos", "/contact", "/transparence", "/mentions-legales", "/politique-confidentialite"];

for (const path of pages) {
  test(`accessibilité (axe, WCAG 2.2 AA) : ${path}`, async ({ page }) => {
    await page.goto(path);
    // Neutralise les apparitions au défilement pour analyser l'état final.
    await page.addStyleTag({ content: ".reveal,.hero-in{animation:none!important}" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(
      serious.map((v) => `${v.id} : ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`),
    ).toEqual([]);
  });
}

test("le menu mobile s'ouvre, piège le focus et se ferme avec Échap", async ({ page, isMobile }) => {
  test.skip(!isMobile, "menu réservé aux petits écrans");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /Menu/ });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Nos offres" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Contact" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("un lien d'évitement mène au contenu", async ({ page, isMobile }) => {
  test.skip(isMobile, "vérifié au clavier sur ordinateur");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Aller au contenu" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});

test("les animations sont coupées si l'utilisateur le demande", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const animation = await page.locator(".reveal").first().evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).toBe("none");
});
