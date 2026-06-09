import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { getServerUser } from "@/lib/auth/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AddressesClient } from "./AddressesClient";
import type { Address } from "@/lib/supabase/types";

export const metadata = { title: "Addresses" };

export default async function AddressesPage() {
  const user = await getServerUser();
  let addresses: Address[] = [];

  if (user && isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    addresses = data ?? [];
  }

  return (
    <div className="flex flex-col gap-6">
      <Eyebrow>Addresses</Eyebrow>
      <p className="swr-lede max-w-[460px]">
        Save a default shipping address so checkout is one tap.
      </p>
      <AddressesClient initial={addresses} />
    </div>
  );
}
