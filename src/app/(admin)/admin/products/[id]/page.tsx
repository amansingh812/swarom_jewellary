import { notFound } from "next/navigation";
import { ProductEditor } from "../ProductEditor";
import {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Product } from "@/lib/supabase/types";

export const metadata = { title: "Edit product" };

interface PageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: PageProps) {
  if (!isSupabaseConfigured()) {
    return (
      <p className="swr-lede">
        Editing requires Supabase configured. Add your env vars to <code>.env.local</code>.
      </p>
    );
  }
  const supabase = createServerSupabaseClient();
  const [{ data: product }, { data: collections }] = await Promise.all([
    supabase.from("products").select("*").eq("id", params.id).single<Product>(),
    supabase.from("collections").select("id, name").order("position"),
  ]);
  if (!product) notFound();
  return (
    <ProductEditor
      product={product}
      collections={(collections as { id: string; name: string }[]) ?? []}
    />
  );
}
