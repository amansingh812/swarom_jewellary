"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/server";

export interface ProductInput {
  id?: string;
  slug: string;
  name: string;
  modifier?: string;
  description?: string;
  collection_id?: string | null;
  category: "pendant" | "ring" | "bracelet" | "anklet" | "for-two";
  price: number;
  compare_at_price?: number | null;
  status: "draft" | "active" | "archived";
  meta?: string;
  image_main?: string;
  images?: string[];
  options?: Record<string, unknown>;
  inventory?: number | null;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function validate(p: ProductInput): string | null {
  if (!p.name.trim()) return "Name is required.";
  if (!p.slug.trim() || p.slug !== slugify(p.slug)) return "Slug must be lowercase, hyphenated, no spaces.";
  if (!(p.price >= 0)) return "Price must be a positive number.";
  if (p.compare_at_price != null && p.compare_at_price < p.price) {
    return "Compare-at price should be greater than or equal to price.";
  }
  return null;
}

export async function saveProduct(input: ProductInput) {
  await requireAdmin();
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const err = validate(input);
  if (err) return { ok: false, message: err };

  const supabase = createServerSupabaseClient();

  const row = {
    slug: input.slug.trim(),
    name: input.name.trim(),
    modifier: input.modifier?.trim() || null,
    description: input.description?.trim() || null,
    collection_id: input.collection_id || null,
    category: input.category,
    price: Math.round(input.price),
    compare_at_price: input.compare_at_price ?? null,
    status: input.status,
    meta: input.meta?.trim() || null,
    image_main: input.image_main || null,
    images: input.images ?? [],
    options: input.options ?? {},
    inventory: input.inventory ?? null,
  };

  if (input.id) {
    const { error } = await supabase
      .from("products")
      .update(row)
      .eq("id", input.id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(row)
      .select("id")
      .single();
    if (error) return { ok: false, message: error.message };
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { ok: true, id: data?.id as string };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${input.id}`);
  revalidatePath(`/product/${row.slug}`);
  revalidatePath("/shop");
  return { ok: true, id: input.id };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}
