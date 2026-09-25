import { chromium } from "playwright-core";
import { generate } from "otplib";
import fs from "fs";
export const dir = "/tmp/claude-0/-home-user-Comme-la-maison/f1ce638e-0329-54b8-846d-ed5ae9b913c5/scratchpad";
export async function adminPage({ width = 1440, height = 900 } = {}) {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
  const statePath = `${dir}/admin-state.json`;
  let context = await browser.newContext({ viewport: { width, height }, storageState: fs.existsSync(statePath) ? statePath : undefined });
  let page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("http://localhost:3000/admin");
  if (!page.url().endsWith("/admin")) {
    const secret = fs.readFileSync(`${dir}/totp-secret.txt`, "utf8").trim();
    if (!page.url().includes("/connexion?") && !page.url().endsWith("/connexion")) await page.goto("http://localhost:3000/connexion");
    await page.getByRole("textbox", { name: /Adresse email/ }).first().fill("baptiste.dev@example.com");
    await page.getByLabel(/Mot de passe/).fill("motdepasse-dev-2026");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.waitForURL(/double-authentification/);
    await page.getByLabel(/Code à 6 chiffres/).fill(await generate({ secret }));
    await page.getByRole("button", { name: "Valider" }).click();
    await page.waitForURL("http://localhost:3000/admin");
    await context.storageState({ path: statePath });
  }
  return { browser, page, errors };
}
