import { expect, test } from "@playwright/test";

import { anonymousClient, readIds, userClient } from "./support";

/**
 * Règle absolue : un propriétaire ne voit jamais les données d'un autre, même en
 * modifiant une requête. Ces tests interrogent directement l'API de la base avec
 * la session de chaque rôle (sans passer par l'interface).
 */
test.describe("Isolation des données (règles d'accès de la base)", () => {
  test("un propriétaire ne lit que ses biens, réservations, relevés et documents", async () => {
    const ids = readIds();
    const owner = await userClient("ownerA");

    const { data: properties } = await owner.from("properties").select("id, owner_id");
    expect(properties!.length).toBeGreaterThan(0);
    expect(properties!.every((p) => p.owner_id === ids.ownerA)).toBe(true);

    // Accès direct au bien d'un autre propriétaire par son identifiant : rien.
    const { data: other } = await owner.from("properties").select("id").eq("id", ids.propertyB);
    expect(other).toEqual([]);

    // La table des réservations (coordonnées, notes internes) est fermée ; la vue filtrée ne montre que ses biens.
    const { data: rawBookings } = await owner.from("bookings").select("id");
    expect(rawBookings).toEqual([]);
    const { data: bookings } = await owner.from("owner_bookings").select("property_id, guest_first_name");
    const own = new Set(properties!.map((p) => p.id));
    expect(bookings!.length).toBeGreaterThan(0);
    expect(bookings!.every((b) => own.has(b.property_id!))).toBe(true);

    // Relevés : les siens, jamais les brouillons, jamais ceux d'un autre.
    const { data: statements } = await owner.from("owner_statements").select("id, owner_id, status");
    expect(statements!.every((s) => s.owner_id === ids.ownerA && s.status !== "draft")).toBe(true);
    const { data: otherStatement } = await owner.from("owner_statements").select("id").eq("id", ids.statementB!);
    expect(otherStatement).toEqual([]);
    const { data: otherLines } = await owner.from("statement_lines").select("id").eq("statement_id", ids.statementB!);
    expect(otherLines).toEqual([]);

    // Coordonnées des autres personnes, voyageurs, prospects, paramètres, journal : rien.
    for (const table of ["guests", "prospects", "settings", "audit_logs", "property_access", "invitations", "domain_events"] as const) {
      const { data } = await owner.from(table).select("*").limit(5);
      expect(data ?? [], table).toEqual([]);
    }
    const { data: contacts } = await owner.from("contacts").select("id");
    expect(contacts!.length).toBe(1);

    // Statistiques et recherche : limitées à ses biens.
    const { data: stats } = await owner.rpc("stats_property_months", { p_from: "2026-01-01", p_to: "2026-12-01" });
    expect(stats!.every((s) => s.owner_id === ids.ownerA)).toBe(true);
    const { data: search } = await owner.rpc("search_global", { p_query: "démo" });
    expect(search).toEqual([]);
  });

  test("un propriétaire ne peut rien modifier ni lancer d'action d'administration", async () => {
    const ids = readIds();
    const owner = await userClient("ownerA");

    const { data: updated } = await owner.from("properties").update({ name: "Piraté" }).eq("id", ids.propertyA).select("id");
    expect(updated ?? []).toEqual([]);
    const { error: insertError } = await owner.from("expenses").insert({ label: "x", amount_cents: 100, property_id: ids.propertyB });
    expect(insertError).not.toBeNull();
    for (const call of [
      owner.rpc("seed_demo_data"),
      owner.rpc("purge_demo_data"),
      owner.rpc("generate_statement", { p_owner: ids.ownerB, p_month: "2026-08-01" }),
      owner.rpc("finalize_statement", { p_statement: ids.statementB! }),
    ]) {
      const { error } = await call;
      expect(error?.code).toBe("42501");
    }
  });

  test("un agent ne voit que ses tâches et les codes du jour de sa tâche", async () => {
    const ids = readIds();
    const staff = await userClient("staff");

    const { data: tasks } = await staff.from("tasks").select("id");
    expect(tasks!.map((t) => t.id)).toEqual([ids.staffTask]);
    const { data: view } = await staff.from("staff_tasks").select("id, guest_first_name");
    expect(view!.map((t) => t.id)).toEqual([ids.staffTask]);

    const { data: bookings } = await staff.from("bookings").select("id");
    expect(bookings).toEqual([]);
    const { data: access } = await staff.from("property_access").select("*");
    expect(access).toEqual([]);

    const { data: codes } = await staff.rpc("staff_task_access", { p_task: ids.staffTask });
    expect(codes!.length).toBe(1);
    const { data: otherCodes } = await staff.rpc("staff_task_access", { p_task: ids.otherTask });
    expect(otherCodes).toEqual([]);

    const { error } = await staff.rpc("staff_update_task", { p_task: ids.otherTask, p_status: "done" });
    expect(error).not.toBeNull();
    // Un agent ne peut pas valider lui-même sa tâche.
    const { error: validateError } = await staff.rpc("staff_update_task", { p_task: ids.staffTask, p_status: "validated" });
    expect(validateError).not.toBeNull();
  });

  test("sans double authentification, un administrateur n'a aucun accès aux données", async () => {
    const adminWithoutMfa = await userClient("admin", { mfa: false });
    const { data } = await adminWithoutMfa.from("properties").select("id");
    expect(data).toEqual([]);
    const admin = await userClient("admin");
    const { data: all } = await admin.from("properties").select("id");
    expect(all!.length).toBeGreaterThanOrEqual(5);
  });

  test("un visiteur anonyme n'accède à aucune table", async () => {
    const anon = anonymousClient();
    for (const table of ["properties", "bookings", "owners", "contacts", "owner_statements"] as const) {
      const { data } = await anon.from(table).select("id").limit(1);
      expect(data ?? [], table).toEqual([]);
    }
    const { data: view } = await anon.from("owner_bookings").select("id").limit(1);
    expect(view ?? []).toEqual([]);
  });
});
