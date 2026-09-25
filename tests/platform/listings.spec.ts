import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { AUTH_DIR, serviceClient } from "./support";

const stamp = Date.now();
const SLUG = `studio-test-${stamp}`;
const TITLE = `Studio lumineux test ${stamp}`;
const INTERNAL = `Interne · Studio test ${stamp}`;

function isoIn(days: number) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  return results.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id} : ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`);
}

async function setPublished(page: Page, propertyId: string, published: boolean) {
  await page.goto(`/admin/biens/${propertyId}/modifier`);
  const checkbox = page.getByLabel("Afficher ce bien sur le site public");
  await checkbox.setChecked(published);
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.getByText("Modifications enregistrées.")).toBeVisible();
}

test.describe("Logements publiés sur le site", () => {
  test.use({ storageState: `${AUTH_DIR}/admin.json` });

  let propertyId: string;
  let ownerId: string;
  let ownerContactId: string;
  let demoId: string;

  test.beforeAll(async () => {
    const service = serviceClient();
    const { data: contact } = await service.from("contacts").insert({ first_name: "Propriétaire", last_name: "Dupuis-Privé" }).select("id").single();
    ownerContactId = contact!.id;
    const { data: owner } = await service.from("owners").insert({ contact_id: ownerContactId }).select("id").single();
    ownerId = owner!.id;
    const { data: property, error } = await service
      .from("properties")
      .insert({
        owner_id: ownerId,
        name: INTERNAL,
        status: "active",
        property_type: "studio",
        address_line: "12 rue confidentielle",
        city: "Bordeaux",
        capacity: 2,
        bedrooms: 0,
        beds: 1,
        public_title: TITLE,
        public_description: "Description publique du logement de test.",
        slug: SLUG,
        registration_number: "TEST-0001",
        visible_on_site: false,
      })
      .select("id")
      .single();
    expect(error, error?.message).toBeNull();
    propertyId = property!.id;
    await service.from("bookings").insert({
      property_id: propertyId,
      platform_id: "direct",
      status: "confirmed",
      check_in: isoIn(5),
      check_out: isoIn(8),
    });

    // Un bien de démonstration marqué « publié » ne doit jamais apparaître.
    const { data: demo } = await service.from("properties").select("id").eq("name", "Démo · T2 Chartrons").single();
    demoId = demo!.id;
    await service.from("properties").update({ visible_on_site: true, slug: `demo-chartrons-${stamp}` }).eq("id", demoId);
  });

  test.afterAll(async () => {
    const service = serviceClient();
    await service.from("properties").update({ visible_on_site: false, slug: null }).eq("id", demoId);
    const { data: bookings } = await service.from("bookings").select("id, guest_id").eq("property_id", propertyId);
    await service.from("notifications").delete().eq("kind", "booking.inquiry");
    await service.from("bookings").delete().eq("property_id", propertyId);
    for (const guestId of (bookings ?? []).map((b) => b.guest_id).filter((id): id is string => Boolean(id))) {
      const { data: guest } = await service.from("guests").select("contact_id").eq("id", guestId).single();
      await service.from("guests").delete().eq("id", guestId);
      if (guest) await service.from("contacts").delete().eq("id", guest.contact_id);
    }
    await service.from("properties").delete().eq("id", propertyId);
    await service.from("owners").delete().eq("id", ownerId);
    await service.from("contacts").delete().eq("id", ownerContactId);
  });

  test("un bien publié depuis le back-office a sa page, ses disponibilités et reçoit des demandes", async ({ page }) => {
    await setPublished(page, propertyId, true);

    // L'accueil le présente parmi « Nos biens ».
    await page.goto("/");
    await expect(page.getByRole("link", { name: TITLE })).toBeVisible();

    await page.goto("/nos-biens");
    await expect(page.getByRole("link", { name: TITLE })).toBeVisible();
    await expect(page.getByText(INTERNAL)).toHaveCount(0);
    await expect(page.getByText("Démo · T2 Chartrons")).toHaveCount(0);
    expect(await seriousViolations(page)).toEqual([]);

    await page.getByRole("link", { name: TITLE }).click();
    await expect(page).toHaveURL(new RegExp(`/nos-biens/${SLUG}$`));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(TITLE);
    await expect(page.getByText("TEST-0001")).toBeVisible();
    // Ni adresse, ni propriétaire.
    await expect(page.getByText("12 rue confidentielle")).toHaveCount(0);
    await expect(page.getByText("Dupuis-Privé")).toHaveCount(0);
    // La nuit réservée est annoncée indisponible.
    const [y, m, d] = isoIn(6).split("-").map(Number);
    const label = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
      new Date(Date.UTC(y, m - 1, d)),
    );
    await expect(page.getByText(`${label} : indisponible`)).toHaveCount(1);
    expect(await seriousViolations(page)).toEqual([]);

    const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Envoyer ma demande" }) });
    await form.getByLabel(/^Arrivée/).fill(isoIn(6));
    await form.getByLabel(/^Départ/).fill(isoIn(9));
    await form.getByLabel(/^Adultes/).fill("2");
    await form.getByLabel(/^Prénom/).fill("Camille");
    await form.getByLabel(/^Nom/).fill("Voyageuse");
    await form.getByLabel(/^Email/).fill(`voyageuse.${stamp}@example.com`);
    await form.getByLabel(/^Téléphone/).fill("06 12 34 56 78");
    await page.waitForTimeout(2600);
    await form.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(form.getByText(/Ces dates ne sont plus toutes disponibles/)).toBeVisible();

    await form.getByLabel(/^Adultes/).fill("3");
    await form.getByLabel(/^Arrivée/).fill(isoIn(20));
    await form.getByLabel(/^Départ/).fill(isoIn(23));
    await form.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(form.getByText(/accueille 2 personnes au maximum/)).toBeVisible();

    await form.getByLabel(/^Adultes/).fill("2");
    await form.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(form.getByText(/Merci Camille, votre demande est bien envoyée/)).toBeVisible();

    const service = serviceClient();
    const { data: inquiry } = await service
      .from("bookings")
      .select("id, status, source, check_in, check_out, adults")
      .eq("property_id", propertyId)
      .eq("status", "inquiry")
      .single();
    expect(inquiry).toMatchObject({ source: "website", check_in: isoIn(20), check_out: isoIn(23), adults: 2 });
    const { data: notes } = await service.from("notifications").select("link").eq("kind", "booking.inquiry");
    expect(notes?.some((n) => n.link === `/admin/reservations/${inquiry!.id}`)).toBe(true);

    // Retiré du site : la page n'existe plus et le bien disparaît de l'accueil et de Nos biens.
    await setPublished(page, propertyId, false);
    expect((await page.goto(`/nos-biens/${SLUG}`))?.status()).toBe(404);
    await page.goto("/");
    await expect(page.getByRole("link", { name: TITLE })).toHaveCount(0);
    await page.goto("/nos-biens");
    await expect(page.getByRole("link", { name: TITLE })).toHaveCount(0);
  });

  test("une photo non publique ou inconnue n'est pas servie", async ({ request }) => {
    expect((await request.get("/api/logements/photos/00000000-0000-0000-0000-000000000000")).status()).toBe(404);
    expect((await request.get("/api/logements/photos/pas-un-identifiant")).status()).toBe(404);
  });
});
