"use server";

import { revalidatePath } from "next/cache";
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/server";
import { slugify } from "@/lib/slug";

export interface CollectionInput {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  position?: number;
}

export interface CollectionResult {
  ok: boolean;
  id?: string;
  message?: string;
}

function validate(c: CollectionInput): string | null {
  if (!c.name.trim()) return "Name is required.";
  if (!c.slug.trim() || c.slug !== slugify(c.slug)) {
    return "Slug must be lowercase and hyphenated, with no spaces.";
  }
  return null;
}

function revalidate() {
  revalidatePath("/admin/collections");
  revalidatePath("/admin/products");
  revalidatePath("/collections");
  revalidatePath("/shop");
}

export async function saveCollection(
  input: CollectionInput
): Promise<CollectionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const err = validate(input);
  if (err) return { ok: false, message: err };

  const supabase = createServerSupabaseClient();
  const row = {
    slug: input.slug.trim(),
    name: input.name.trim(),
    description: input.description?.trim() || null,
    position: input.position ?? 0,
  };

  if (input.id) {
    const { error } = await supabase
      .from("collections")
      .update(row)
      .eq("id", input.id);
    if (error) return { ok: false, message: error.message };
    revalidate();
    return { ok: true, id: input.id };
  }

  const { data, error } = await supabase
    .from("collections")
    .insert(row)
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505")
      return { ok: false, message: "That slug is already taken." };
    return { ok: false, message: error.message };
  }
  revalidate();
  return { ok: true, id: data?.id as string };
}

/**
 * Deleting a collection does not delete its products — `collection_id`
 * is `on delete set null`, so they simply become uncategorised.
 */
export async function deleteCollection(id: string): Promise<CollectionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const supabase = createServerSupabaseClient();

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("collection_id", id);

  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidate();
  return {
    ok: true,
    message: count
      ? `Deleted. ${count} ${count === 1 ? "piece is" : "pieces are"} now uncategorised.`
      : "Deleted.",
  };
}

/** Persist a new running order. Accepts ids in their intended order. */
export async function reorderCollections(ids: string[]): Promise<CollectionResult> {
  await requireAdmin();
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const supabase = createServerSupabaseClient();
  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from("collections")
      .update({ position: i + 1 })
      .eq("id", ids[i]);
    if (error) return { ok: false, message: error.message };
  }
  revalidate();
  return { ok: true };
}
