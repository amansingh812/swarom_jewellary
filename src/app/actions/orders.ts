"use server";

import { revalidatePath } from "next/cache";
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { getServerUser } from "@/lib/auth/server";
import type { CartLine } from "@/lib/cart/types";

export interface OrderAddress {
  full_name: string;
  phone: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface CreateOrderInput {
  lines: CartLine[];
  shipping_address: OrderAddress;
  notes?: string;
}

export interface CreateOrderResult {
  ok: boolean;
  orderId?: string;
  message?: string;
}

/**
 * Create an order from the current cart + an address.
 *
 * - Recomputes prices server-side from the products table to prevent tampering.
 * - Writes one row to `orders` + N rows to `order_items` in series.
 * - Returns the new orderId so the client can redirect to the success page.
 *
 * Status starts as `pending`. Razorpay flips it to `paid` via webhook later.
 * If Razorpay isn't configured yet, the order still exists in `pending` — the
 * admin can mark it paid manually from the dashboard.
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  if (!isSupabaseConfigured()) {
    // Dev fallback — simulate success without writing.
    return {
      ok: true,
      orderId: "dev-" + Math.random().toString(36).slice(2, 10),
    };
  }
  if (!input.lines.length) {
    return { ok: false, message: "Your bag is empty." };
  }

  const supabase = createServerSupabaseClient();
  const user = await getServerUser();

  // Recompute prices from DB so the client can't lie about price.
  const productIds = input.lines.map((l) => l.productId);
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id, name, modifier, image_main, price, status, enquiry_only")
    .in("id", productIds);
  if (prodErr || !products) {
    return { ok: false, message: prodErr?.message ?? "Could not load products." };
  }

  const priceMap = new Map(products.map((p) => [p.id as string, p]));

  let subtotal = 0;
  const itemRows: {
    product_id: string;
    name: string;
    modifier: string | null;
    image: string | null;
    unit_price: number;
    quantity: number;
    options: Record<string, string>;
  }[] = [];

  for (const line of input.lines) {
    const p = priceMap.get(line.productId);
    if (!p) {
      return {
        ok: false,
        message: `A piece in your bag is no longer available.`,
      };
    }
    if (p.status !== "active") {
      return {
        ok: false,
        message: `"${p.name}" is no longer available.`,
      };
    }
    // An enquiry-only piece has no confirmed weight or purity, so it has no
    // price. It must never reach an order, whatever the client sent.
    if (p.enquiry_only) {
      return {
        ok: false,
        message: `"${p.name}" is available on enquiry only. Please remove it and message us about it instead.`,
      };
    }
    const unit = p.price as number;
    if (!(unit > 0)) {
      return {
        ok: false,
        message: `"${p.name}" is not priced yet.`,
      };
    }
    subtotal += unit * line.quantity;
    itemRows.push({
      product_id: p.id as string,
      name: p.name as string,
      modifier: (p.modifier as string | null) ?? null,
      image: (p.image_main as string | null) ?? null,
      unit_price: unit,
      quantity: line.quantity,
      options: line.options ?? {},
    });
  }

  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  // Insert the order, capture the new ID.
  const { data: orderRow, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      email: input.shipping_address.email,
      phone: input.shipping_address.phone,
      status: "pending",
      subtotal,
      shipping,
      tax,
      total,
      currency: "INR",
      shipping_address: {
        full_name: input.shipping_address.full_name,
        phone: input.shipping_address.phone,
        email: input.shipping_address.email,
        line1: input.shipping_address.line1,
        line2: input.shipping_address.line2 ?? null,
        city: input.shipping_address.city,
        state: input.shipping_address.state,
        pincode: input.shipping_address.pincode,
        country: input.shipping_address.country ?? "India",
      },
      notes: input.notes ?? null,
    })
    .select("id")
    .single();

  if (orderErr || !orderRow) {
    return { ok: false, message: orderErr?.message ?? "Could not create order." };
  }

  const orderId = orderRow.id as string;

  const { error: itemsErr } = await supabase.from("order_items").insert(
    itemRows.map((r) => ({ ...r, order_id: orderId }))
  );
  if (itemsErr) {
    // Best-effort cleanup so we don't leave a phantom order.
    await supabase.from("orders").delete().eq("id", orderId);
    return { ok: false, message: itemsErr.message };
  }

  revalidatePath("/account/orders");
  revalidatePath("/admin/orders");

  // TODO when Razorpay live:
  //   const rzpOrder = await createRazorpayOrder({ amount: total * 100, currency: "INR", receipt: orderId });
  //   await supabase.from("orders").update({ razorpay_order_id: rzpOrder.id }).eq("id", orderId);

  return { ok: true, orderId };
}
