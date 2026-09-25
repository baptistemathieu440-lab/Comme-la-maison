import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { AUTH_DIR } from "./support";

async function audit(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  return results.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id} : ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`);
}

test("accessibilité : page de connexion", async ({ page }) => {
  await page.goto("/connexion");
  expect(await audit(page)).toEqual([]);
});

test.describe("accessibilité : back-office", () => {
  test.use({ storageState: `${AUTH_DIR}/admin.json` });
  for (const path of ["/admin", "/admin/calendrier", "/admin/reservations", "/admin/reservations/nouvelle", "/admin/biens", "/admin/prospects", "/admin/finances", "/admin/releves", "/admin/taches", "/admin/parametres", "/admin/compte"]) {
    test(path, async ({ page }) => {
      await page.goto(path);
      expect(await audit(page)).toEqual([]);
    });
  }
});

test.describe("accessibilité : espace propriétaire", () => {
  test.use({ storageState: `${AUTH_DIR}/ownerA.json` });
  for (const path of ["/owner", "/owner/reservations", "/owner/revenus", "/owner/calendrier", "/owner/compte"]) {
    test(path, async ({ page }) => {
      await page.goto(path);
      expect(await audit(page)).toEqual([]);
    });
  }
});

test.describe("accessibilité : espace agent sur téléphone", () => {
  test.use({ storageState: `${AUTH_DIR}/staff.json`, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  for (const path of ["/staff", "/staff/planning", "/staff/incidents", "/staff/compte"]) {
    test(path, async ({ page }) => {
      await page.goto(path);
      expect(await audit(page)).toEqual([]);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
