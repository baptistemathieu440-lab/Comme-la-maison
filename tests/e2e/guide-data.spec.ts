import { expect, test } from "@playwright/test";

import { itineraries } from "../../src/content/guide/itineraries";
import { BUDGET_TO_CONFIRM, seedPlaces } from "../../src/content/guide/places";
import { themes } from "../../src/content/guide/themes";
import { fromSeed } from "../../src/lib/guide/place";

/**
 * Cohérence de la sélection initiale du guide (sans navigateur).
 * Règle : aucune donnée inventée. Une note ne vient que du back-office, avec sa source.
 */
test.describe("Guide voyageurs : sélection initiale", () => {
  test.skip(({ isMobile }) => isMobile, "vérifié une seule fois");
  const places = seedPlaces.map((seed, index) => fromSeed(seed, index));

  test("identifiants uniques et bien formés", () => {
    const slugs = places.map((place) => place.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  test("chaque adresse est datée, sourcée, sans note inventée", () => {
    for (const place of places) {
      expect(place.verifiedOn, place.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(place.sources.length, place.slug).toBeGreaterThan(0);
      expect(place.rating, place.slug).toBeNull();
      expect(place.summary.length, place.slug).toBeGreaterThan(40);
      if (place.websiteUrl) expect(place.websiteUrl, place.slug).toMatch(/^https:\/\//);
    }
  });

  test("les coordonnées sont en Gironde ou dans les Landes voisines", () => {
    for (const place of places.filter((p) => p.lat !== null)) {
      expect(place.lat!, place.slug).toBeGreaterThan(44.3);
      expect(place.lat!, place.slug).toBeLessThan(45.7);
      expect(place.lng!, place.slug).toBeGreaterThan(-1.4);
      expect(place.lng!, place.slug).toBeLessThan(0);
    }
  });

  test("les renvois (budgets à confirmer, itinéraires) désignent des adresses existantes", () => {
    const slugs = new Set(places.map((place) => place.slug));
    for (const slug of BUDGET_TO_CONFIRM) expect(slugs.has(slug), slug).toBe(true);
    for (const itinerary of itineraries)
      for (const day of itinerary.days)
        for (const step of day.steps) if (step.place) expect(slugs.has(step.place), step.place).toBe(true);
  });

  test("chaque rubrique a des adresses, et les volumes demandés sont atteints", () => {
    for (const theme of themes) expect(places.filter(theme.match).length, theme.slug).toBeGreaterThan(0);
    const count = (slug: string) => places.filter(themes.find((t) => t.slug === slug)!.match).length;
    expect(count("incontournables-bordeaux")).toBeGreaterThanOrEqual(15);
    expect(count("restaurants-bordeaux")).toBeGreaterThanOrEqual(20);
    expect(count("bars-bordeaux")).toBeGreaterThanOrEqual(10);
    expect(count("vignobles-bordeaux")).toBeGreaterThanOrEqual(10);
    expect(count("plages-bordeaux")).toBeGreaterThanOrEqual(10);
    expect(count("bordeaux-quand-il-pleut")).toBeGreaterThanOrEqual(10);
    expect(count("coups-de-coeur")).toBeGreaterThanOrEqual(8);
    for (const slug of ["bordeaux-en-famille", "bordeaux-en-couple", "bordeaux-entre-amis"]) {
      expect(count(slug), slug).toBeGreaterThanOrEqual(10);
      expect(count(slug), `${slug} doit rester une sélection`).toBeLessThanOrEqual(30);
    }
  });
});
