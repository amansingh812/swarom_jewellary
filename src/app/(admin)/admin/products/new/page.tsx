import { ProductEditor } from "../ProductEditor";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  let collections: { id: string; name: string }[] = [];
  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("collections").select("id, name").order("position");
    collections = (data as { id: string; name: string }[]) ?? [];
  }
  return <ProductEditor collections={collections} />;
}
