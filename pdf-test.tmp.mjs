import { adminPage, dir } from "./admin-session.tmp.mjs";
import fs from "fs";
const { browser, page } = await adminPage();
const res = await page.request.get("http://localhost:3000/api/releves/d947082a-3642-4e0d-8cbe-d27eb5c17d9c/pdf");
console.log(res.status(), res.headers()["content-type"]);
fs.writeFileSync(`${dir}/releve.pdf`, await res.body());
await page.goto("http://localhost:3000/admin/releves/d947082a-3642-4e0d-8cbe-d27eb5c17d9c");
await page.screenshot({ path: `${dir}/releve.png`, fullPage: true });
await browser.close();
