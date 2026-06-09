"use server";

import { revalidatePath } from "next/cache";
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { getServerUser } from "@/lib/auth/server";

export interface AddressInput {
  id?: string;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  is_default?: boolean;
}

const INDIAN_PIN = /^[1-9]\d{5}$/;
const PHONE_RX = /^\+?[0-9\s-]{7,15}$/;

function validate(a: AddressInput): string | null {
  if (!a.full_name.trim()) return "Name is required.";
  if (!PHONE_RX.test(a.phone)) return "Please enter a valid phone number.";
  if (!a.line1.trim()) return "Address line 1 is required.";
  if (!a.city.trim()) return "City is required.";
  if (!a.state.trim()) return "State is required.";
  if (!INDIAN_PIN.test(a.pincode)) return "Please enter a valid 6-digit pincode.";
  return null;
}

export async function saveAddress(input: AddressInput) {
  const user = await getServerUser();
  if (!user) return { ok: false, message: "Please sign in." };
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const err = validate(input);
  if (err) return { ok: false, message: err };

  const supabase = createServerSupabaseClient();

  const row = {
    user_id: user.id,
    full_name: input.full_name.trim(),
    phone: input.phone.trim(),
    line1: input.line1.trim(),
    line2: input.line2?.trim() || null,
    city: input.city.trim(),
    state: input.state.trim(),
    pincode: input.pincode.trim(),
    country: input.country?.trim() || "India",
    is_default: input.is_default ?? false,
  };

  // If marking default, clear other defaults first.
  if (row.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  if (input.id) {
    const { error } = await supabase
      .from("addresses")
      .update(row)
      .eq("id", input.id)
      .eq("user_id", user.id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase.from("addresses").insert(row);
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { ok: true, message: "Saved." };
}

export async function deleteAddress(id: string) {
  const user = await getServerUser();
  if (!user) return { ok: false, message: "Please sign in." };
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { ok: true, message: "Removed." };
}

export async function setDefaultAddress(id: string) {
  const user = await getServerUser();
  if (!user) return { ok: false, message: "Please sign in." };
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const supabase = createServerSupabaseClient();
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id);
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { ok: true, message: "Default updated." };
}
