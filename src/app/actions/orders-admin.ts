"use server";

import { revalidatePath } from "next/cache";
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/server";
import type { Order } from "@/lib/supabase/types";

const VALID: Order["status"][] = [
  "pending",
  "paid",
  "in_production",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  await requireAdmin();
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };
  if (!VALID.includes(status))
    return { ok: false, message: "Invalid status." };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/account/orders/${orderId}`);
  revalidatePath("/account/orders");
  return { ok: true };
}

export async function updateOrderNote(orderId: string, notes: string) {
  await requireAdmin();
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({ notes: notes.trim() || null })
    .eq("id", orderId);
  if (error) return { ok: false, message: error.message };

  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}
