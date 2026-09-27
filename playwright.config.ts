import { existsSync } from "node:fs";

import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
// Pour tester le site en ligne : PLAYWRIGHT_BASE_URL=https://comme-a-la-maison.netlify.app npm run test:e2e
const remote = process.env.PLAYWRIGHT_BASE_URL;

// Les tests de la plateforme utilisent la base Supabase locale (npm run db:start) et .env.local.
if (!remote && existsSync(".env.local")) process.loadEnvFile(".env.local");
const platform = !remote && Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);

export default defineConfig({
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: remote ?? `http://localhost:${PORT}`,
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
    trace: "retain-on-failure",
    // Utile derrière un proxy d'entreprise qui réécrit les certificats.
    ignoreHTTPSErrors: process.env.PLAYWRIGHT_IGNORE_HTTPS_ERRORS === "1",
  },
  projects: [
    { name: "desktop", testDir: "./tests/e2e", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", testDir: "./tests/e2e", use: { ...devices["Pixel 7"] } },
    ...(platform
      ? [
          // Prépare les comptes de test (un par rôle) et leurs sessions.
          { name: "platform-setup", testDir: "./tests/platform", testMatch: /.*\.setup\.ts/ },
          {
            name: "platform",
            testDir: "./tests/platform",
            testMatch: /.*\.spec\.ts/,
            dependencies: ["platform-setup"],
            fullyParallel: false,
            use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
          },
        ]
      : []),
  ],
  // En local, le site est testé dans sa version de production.
  webServer: remote
    ? undefined
    : {
        command: `npm run build && npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
        env: { CONTACT_DELIVERY: "log", NEXT_TELEMETRY_DISABLED: "1", NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}` },
      },
});
