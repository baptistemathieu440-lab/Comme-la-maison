"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { reviewCategoryKeys } from "@/content/reviews";
import { dbErrorMessage, fail, ok, type ActionState } from "@/lib/action-state";
import { adminContext } from "@/lib/auth/admin-context";
import { FormReader } from "@/lib/form-data";
import type { Database } from "@/lib/supabase/database.types";
import { REVIEWS_TAG } from "@/server/reviews";

type Insert = Database["public"]["Tables"]["site_reviews"]["Insert"];

/** L'accueil se met à jour aussitôt (cache et page régénérés). */
function refreshReviews(id?: string) {
  updateTag(REVIEWS_TAG);
  revalidatePath("/");
  revalidatePath("/admin/avis");
  if (id) revalidatePath(`/admin/avis/${id}`);
}

const CONSENT_MESSAGE = "Cochez l’accord de l’auteur avant de publier l’avis.";

function read(form: FormReader) {
  const body = form.text("body", "Recopiez le texte de l’avis.", 1200);
  if (body && body.length < 10) form.errors.body = "10 caractères au minimum.";
  const authorName = form.text("author_name", "Indiquez le prénom de l’auteur.", 60);
  if (authorName && authorName.length < 2) form.errors.author_name = "2 caractères au minimum.";

  const consent = form.bool("consent_confirmed");
  const published = form.bool("is_published");
  if (published && !consent) form.errors.consent_confirmed = CONSENT_MESSAGE;

  const values: Omit<Insert, "created_by"> = {
    author_name: authorName,
    city: form.optional("city", 60),
    category: form.choice("category", reviewCategoryKeys, "proprietaire"),
    rating: Number(form.choice("rating", ["1", "2", "3", "4", "5"] as const, "5")),
    body,
    source: form.optional("source", 60),
    received_on: form.date("received_on"),
    consent_confirmed: consent,
    is_published: published,
    position: form.int("position", { min: 0, max: 100000 }) ?? 0,
    internal_notes: form.optional("internal_notes", 2000),
  };
  return values;
}

export async function saveReview(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { session, supabase } = await adminContext();
  const form = new FormReader(formData);
  const values = read(form);
  // Sans accord de l'auteur, le message principal le dit (la case n'a pas de message sous elle).
  if (!form.ok) return fail(form.errors.consent_confirmed ?? "Vérifiez les champs indiqués.", form.errors);

  if (id) {
    const { error } = await supabase.from("site_reviews").update(values).eq("id", id);
    if (error) return fail(dbErrorMessage(error));
    refreshReviews(id);
    return ok(values.is_published ? "Avis enregistré. Il est visible sur l’accueil." : "Avis enregistré (non publié).");
  }

  const { data, error } = await supabase
    .from("site_reviews")
    .insert({ ...values, created_by: session.userId })
    .select("id")
    .single();
  if (error) return fail(dbErrorMessage(error));
  refreshReviews();
  redirect(`/admin/avis/${data.id}`);
}

export async function setReviewPublished(id: string, published: boolean, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  if (published) {
    const { data } = await supabase.from("site_reviews").select("consent_confirmed").eq("id", id).maybeSingle();
    if (!data) return fail("Avis introuvable.");
    if (!data.consent_confirmed) return fail(CONSENT_MESSAGE);
  }
  const { error } = await supabase.from("site_reviews").update({ is_published: published }).eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  refreshReviews(id);
  return ok(published ? "Avis publié sur l’accueil." : "Avis retiré de l’accueil.");
}

export async function deleteReview(id: string, _prev: ActionState): Promise<ActionState> {
  const { supabase } = await adminContext();
  const { error } = await supabase.from("site_reviews").delete().eq("id", id);
  if (error) return fail(dbErrorMessage(error));
  refreshReviews();
  redirect("/admin/avis");
}
