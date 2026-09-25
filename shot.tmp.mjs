import { adminPage, dir } from "./admin-session.tmp.mjs";
const [,, path = "/admin", out = "shot", width = "1440", height = "900"] = process.argv;
const { browser, page, errors } = await adminPage({ width: Number(width), height: Number(height) });
await page.goto(`http://localhost:3000${path}`);
await page.waitForLoadState("networkidle");
await page.screenshot({ path: `${dir}/${out}.png`, fullPage: true });
console.log(page.url(), errors.length ? errors : "no errors");
await browser.close();
