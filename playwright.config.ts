import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
// Pour tester le site en ligne : PLAYWRIGHT_BASE_URL=https://comme-a-la-maison.netlify.app npm run test:e2e
const remote = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: remote ?? `http://localhost:${PORT}`,
    locale: "fr-FR",
    trace: "retain-on-failure",
    // Utile derrière un proxy d'entreprise qui réécrit les certificats.
    ignoreHTTPSErrors: process.env.PLAYWRIGHT_IGNORE_HTTPS_ERRORS === "1",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // En local, le site est testé dans sa version de production.
  webServer: remote
    ? undefined
    : {
        command: `npm run build && npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
        env: { CONTACT_DELIVERY: "log", NEXT_TELEMETRY_DISABLED: "1" },
      },
});
