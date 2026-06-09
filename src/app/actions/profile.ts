"use server";

import { revalidatePath } from "next/cache";
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { getServerUser } from "@/lib/auth/server";

export interface ProfileInput {
  full_name: string;
  phone: string;
}

export async function updateProfile(input: ProfileInput) {
  const user = await getServerUser();
  if (!user) return { ok: false, message: "Please sign in." };
  if (!isSupabaseConfigured())
    return { ok: false, message: "Database not connected." };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.full_name.trim() || null,
      phone: input.phone.trim() || null,
    })
    .eq("id", user.id);
  if (error) return { ok: false, message: error.message };

  // Also update auth.users metadata so the friendly name shows in OAuth lookups.
  await supabase.auth.updateUser({
    data: { full_name: input.full_name.trim() },
  });

  revalidatePath("/account/settings");
  revalidatePath("/account");
  return { ok: true, message: "Saved." };
}
