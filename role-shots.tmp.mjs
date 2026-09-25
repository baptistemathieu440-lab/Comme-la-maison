import { chromium } from "playwright-core";
const dir = "/tmp/claude-0/-home-user-Comme-la-maison/f1ce638e-0329-54b8-846d-ed5ae9b913c5/scratchpad";
const [,, email, prefix, ...paths] = process.argv;
const mobile = prefix.startsWith("staff");
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const context = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3000/connexion");
await page.getByRole("textbox", { name: /Adresse email/ }).first().fill(email);
await page.getByLabel(/Mot de passe/).fill("motdepasse-dev-2026");
await page.getByRole("button", { name: "Se connecter" }).click();
await page.waitForURL(/\/(owner|staff)/);
console.log("landed", page.url());
for (const [i, p] of paths.entries()) {
  await page.goto(`http://localhost:3000${p}`);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${dir}/${prefix}-${i}.png`, fullPage: true });
  console.log(p, "->", page.url());
}
console.log(errors.length ? errors : "no errors");
await browser.close();
