import { mkdirSync, writeFileSync } from "node:fs";

import { expect, test as setup } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { generate } from "otplib";

import { AUTH_DIR, PASSWORD, accounts, serviceClient, totp, type AccountKey } from "./support";

/**
 * Remet la base locale dans un état connu : données de démonstration recréées,
 * un compte de test par rôle, double authentification du compte admin, puis
 * sessions enregistrées pour les tests.
 */
setup("prépare les données et les comptes de test", async ({ browser }) => {
  setup.setTimeout(120_000);
  mkdirSync(AUTH_DIR, { recursive: true });
  const service = serviceClient();

  // 1. Données de démonstration neuves.
  for (const { error } of [await service.rpc("purge_demo_data"), await service.rpc("seed_demo_data")]) {
    expect(error, error?.message).toBeNull();
  }

  // 2. Comptes de test recréés à chaque exécution.
  const { data: existing } = await service.auth.admin.listUsers({ perPage: 1000 });
  for (const user of existing?.users ?? []) {
    if (user.email?.endsWith(".e2e@example.com")) await service.auth.admin.deleteUser(user.id);
  }
  const ids: Record<string, string | null> = {};
  for (const key of Object.keys(accounts) as AccountKey[]) {
    const account = accounts[key];
    const { data, error } = await service.auth.admin.createUser({
      email: account.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: account.name },
    });
    expect(error, error?.message).toBeNull();
    const userId = data.user!.id;
    await service.from("profiles").update({ full_name: account.name }).eq("id", userId);
    await service.from("user_roles").insert({ user_id: userId, role: account.role });
    if ("ownerEmail" in account) {
      const { data: contact } = await service.from("contacts").select("id").eq("email", account.ownerEmail).single();
      await service.from("contacts").update({ profile_id: userId }).eq("id", contact!.id);
      const { data: owner } = await service.from("owners").select("id").eq("contact_id", contact!.id).single();
      ids[key] = owner!.id;
    }
    ids[`${key}User`] = userId;
  }

  // 3. Double authentification du compte admin.
  const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false },
  });
  await adminClient.auth.signInWithPassword({ email: accounts.admin.email, password: PASSWORD });
  const { data: factor, error: enrollError } = await adminClient.auth.mfa.enroll({ factorType: "totp", friendlyName: "e2e" });
  expect(enrollError, enrollError?.message).toBeNull();
  writeFileSync(`${AUTH_DIR}/totp.json`, JSON.stringify({ secret: factor!.totp.secret }));
  const { error: verifyError } = await adminClient.auth.mfa.challengeAndVerify({
    factorId: factor!.id,
    code: await generate({ secret: factor!.totp.secret }),
  });
  expect(verifyError, verifyError?.message).toBeNull();

  // 4. Repères : un bien et un relevé finalisé par propriétaire, une tâche du jour pour l'agent.
  const { data: propsA } = await service.from("properties").select("id").eq("owner_id", ids.ownerA!).order("name").limit(1);
  const { data: propsB } = await service.from("properties").select("id").eq("owner_id", ids.ownerB!).order("name").limit(1);
  const { data: draftB } = await service.from("owner_statements").select("id").eq("owner_id", ids.ownerB!).eq("status", "draft").limit(1).maybeSingle();
  if (draftB) await service.rpc("finalize_statement", { p_statement: draftB.id });
  const { data: finalA } = await service.from("owner_statements").select("id").eq("owner_id", ids.ownerA!).neq("status", "draft").limit(1).maybeSingle();

  const { data: chartrons } = await service.from("properties").select("id").eq("name", "Démo · T2 Chartrons").single();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
  const { data: tasks } = await service
    .from("tasks")
    .select("id")
    .eq("property_id", chartrons!.id)
    .eq("type", "cleaning")
    .order("due_date", { ascending: false })
    .limit(2);
  await service.from("tasks").update({ assignee_id: ids.staffUser, due_date: today, status: "todo" }).eq("id", tasks![0].id);
  await service.from("tasks").update({ assignee_id: null }).eq("id", tasks![1].id);

  writeFileSync(
    `${AUTH_DIR}/ids.json`,
    JSON.stringify({
      ownerA: ids.ownerA,
      ownerB: ids.ownerB,
      propertyA: propsA![0].id,
      propertyB: propsB![0].id,
      statementA: finalA?.id ?? null,
      statementB: draftB?.id ?? null,
      staffTask: tasks![0].id,
      otherTask: tasks![1].id,
    }),
  );

  // 5. Sessions navigateur de chaque rôle.
  for (const key of ["admin", "ownerA", "ownerB", "staff"] as const) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/connexion");
    await page.getByRole("textbox", { name: /Adresse email/ }).first().fill(accounts[key].email);
    await page.getByLabel(/Mot de passe/).fill(PASSWORD);
    await page.getByRole("button", { name: "Se connecter" }).click();
    if (key === "admin") {
      await page.waitForURL(/double-authentification/);
      await page.getByLabel(/Code à 6 chiffres/).fill(await totp());
      await page.getByRole("button", { name: "Valider" }).click();
      await page.waitForURL(/\/admin$/);
    } else {
      await page.waitForURL(key === "staff" ? /\/staff$/ : /\/owner$/);
    }
    await context.storageState({ path: `${AUTH_DIR}/${key}.json` });
    await context.close();
  }
});
