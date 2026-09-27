import { expect, test, type Page } from "@playwright/test";

import { AUTH_DIR, serviceClient } from "./support";

/** La référence du bien (B-0xx) change à chaque remise à zéro des données de démonstration. */
async function selectProperty(page: Page, name: string) {
  const select = page.getByRole("combobox", { name: /^Bien/ });
  const value = await select.locator("option", { hasText: name }).getAttribute("value");
  await select.selectOption(value!);
}

test.describe("Parcours du back-office", () => {
  test.use({ storageState: `${AUTH_DIR}/admin.json` });

  test("une réservation calcule la commission sur les nuitées perçues et planifie le ménage", async ({ page }) => {
    await page.goto("/admin/reservations/nouvelle");
    await selectProperty(page, "Démo · Appartement Talence");
    await page.getByRole("combobox", { name: "Plateforme" }).selectOption("booking");
    await page.getByLabel(/^Arrivée/).fill("2027-03-10");
    await page.getByLabel(/^Départ/).fill("2027-03-13");
    await page.getByLabel("Prix des nuitées (€)").fill("300");
    await page.getByLabel("Frais de la plateforme (€)").fill("45");
    await page.getByLabel("Frais de ménage perçus (€)").fill("60");
    await page.getByRole("textbox", { name: "Prénom" }).fill("Test");

    // L'aperçu applique la même règle que la base.
    const preview = page.getByText("Calcul (aperçu)").locator("..");
    await expect(preview).toContainText("255,00 €");
    await expect(preview).toContainText("51,00 €");
    await expect(preview).toContainText("204,00 €");

    await page.getByRole("button", { name: "Enregistrer la réservation" }).click();
    await expect(page).toHaveURL(/\/admin\/reservations\/[0-9a-f-]{36}/);
    const amounts = page.locator("#montants");
    await expect(amounts).toContainText("255,00 €");
    await expect(amounts).toContainText("51,00 €");
    await expect(amounts).toContainText("204,00 €");
    await expect(page.locator("#taches")).toContainText("Ménage");

    // Deux réservations confirmées ne peuvent pas se chevaucher.
    await page.goto("/admin/reservations/nouvelle");
    await selectProperty(page, "Démo · Appartement Talence");
    await page.getByLabel(/^Arrivée/).fill("2027-03-12");
    await page.getByLabel(/^Départ/).fill("2027-03-15");
    await page.getByRole("button", { name: "Enregistrer la réservation" }).click();
    await expect(page.getByText(/Ces dates chevauchent une autre réservation/)).toBeVisible();
  });

  test("un relevé se finalise avec un numéro, un PDF et le verrouillage des réservations", async ({ page }) => {
    // Propriétaire dédié : aucun autre séjour non facturé ne s'ajoute au relevé (rattrapage).
    const service = serviceClient();
    const { data: contact } = await service.from("contacts").insert({ first_name: "Relevé", last_name: "Démo", is_demo: true }).select("id").single();
    const { data: newOwner } = await service.from("owners").insert({ contact_id: contact!.id, is_demo: true }).select("id").single();
    const { data: property } = await service
      .from("properties")
      .insert({ owner_id: newOwner!.id, name: "Démo · Test relevé", city: "Bordeaux", status: "active", is_demo: true })
      .select("id, owner_id")
      .single();
    await service.from("bookings").insert({
      property_id: property!.id,
      platform_id: "airbnb",
      status: "completed",
      check_in: "2027-05-03",
      check_out: "2027-05-06",
      nights_amount_cents: 30000,
      platform_fee_cents: 900,
      cleaning_fee_cents: 5000,
      is_demo: true,
    });
    const { data: statementId } = await service.rpc("generate_statement", { p_owner: property!.owner_id, p_month: "2027-05-01" });

    await page.goto(`/admin/releves/${statementId}`);
    await expect(page.getByText("Brouillon, recalculable")).toBeVisible();
    // 300 € − 9 € = 291 € perçus ; 20 % = 58,20 € ; + 50 € de ménage = 108,20 € à régler.
    await expect(page.getByText("291,00 €").first()).toBeVisible();
    await expect(page.getByText("108,20 €").first()).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Finaliser (facture)" }).click();
    await expect(page.getByText(/Facture DEMO-\d{4}-\d{4} · émise le/)).toBeVisible();
    await expect(page.getByText("Brouillon, recalculable")).toHaveCount(0);

    const pdf = await page.request.get(`/api/releves/${statementId}/pdf`);
    expect(pdf.status()).toBe(200);
    expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");

    const { data: locked } = await service.from("bookings").select("statement_id").eq("check_in", "2027-05-03").eq("property_id", property!.id).single();
    expect(locked!.statement_id).toBe(statementId);
    const { error } = await service.from("bookings").update({ nights_amount_cents: 1 }).eq("check_in", "2027-05-03").eq("property_id", property!.id);
    expect(error?.message).toContain("relevé finalisé");
  });

  test("chaque annonce exporte un calendrier iCal sans donnée personnelle", async ({ request }) => {
    const service = serviceClient();
    const { data: listing } = await service
      .from("listings")
      .select("ical_export_token, property:properties!inner(name)")
      .eq("platform_id", "airbnb")
      .eq("property.name", "Démo · T2 Chartrons")
      .single();
    const response = await request.get(`/api/ical/${listing!.ical_export_token}.ics`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/calendar");
    const body = await response.text();
    expect(body).toContain("BEGIN:VCALENDAR");
    expect(body).toContain("SUMMARY:Réservé");
    expect(body).not.toMatch(/Démo\s*$|@example\.com/m);
    expect((await request.get("/api/ical/0123456789abcdef0123456789abcdef.ics")).status()).toBe(404);
  });

  test("le formulaire du site crée un prospect dans le CRM", async ({ page }) => {
    const email = `prospect.${Date.now()}@example.com`;
    await page.goto("/contact#estimation");
    await page.getByRole("textbox", { name: "Prénom", exact: true }).fill("Camille");
    await page.getByRole("textbox", { name: "Nom", exact: true }).fill("Test");
    await page.getByRole("textbox", { name: "Téléphone", exact: true }).fill("06 12 34 56 78");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill(email);
    await page.getByRole("combobox", { name: "Ville du logement", exact: true }).fill("Talence");
    await page.waitForTimeout(2600);
    await page.locator("#estimation").getByRole("button", { name: "Estimer mon logement" }).click();
    await expect(page.getByText(/votre demande est bien envoyée/)).toBeVisible();

    const { data } = await serviceClient().from("contacts").select("id, prospects(status, source)").eq("email", email).single();
    expect(data!.prospects[0]).toMatchObject({ status: "new", source: "website" });
  });
});
