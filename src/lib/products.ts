import type { Product } from "@/lib/supabase/types";

/**
 * Mock product catalog used when Supabase isn't configured yet.
 * Real data lives in the `products` table — see `supabase/schema.sql`.
 *
 * Once env vars are set, `getProducts()` / `getProduct()` swap over.
 */

const now = new Date().toISOString();

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p-pendant-hand",
    slug: "pendant-in-your-hand",
    name: "Pendant",
    modifier: "in your hand",
    description:
      "A small silver droplet on a fine cable chain. Engrave a name, a word, a date — whatever you carry.",
    collection_id: "c-everyday",
    category: "pendant",
    price: 4800,
    compare_at_price: null,
    status: "active",
    meta: "925 silver · engraved",
    image_main: "/products/real-pendant.png",
    images: ["/products/real-pendant.png", "/products/real-bracelet.png", "/products/real-ring.png"],
    options: {
      engraving: { type: "text", max: 12, label: "Engraving" },
      chain: {
        type: "select",
        label: "Chain length",
        choices: ["14″", "16″", "18″", "20″"],
        default: "16″",
      },
    },
    inventory: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: "p-ring-second",
    slug: "ring-for-the-second-one",
    name: "Ring",
    modifier: "for the second one",
    description:
      "A slim band you'd notice on a hand. Inside the band, a date that's yours.",
    collection_id: "c-everyday",
    category: "ring",
    price: 6200,
    compare_at_price: null,
    status: "active",
    meta: "925 silver · date",
    image_main: "/products/real-ring.png",
    images: ["/products/real-ring.png", "/products/real-pendant.png"],
    options: {
      engraving: { type: "text", max: 10, label: "Date or initials" },
      size: {
        type: "select",
        label: "Ring size",
        choices: ["10", "12", "14", "16", "18", "20"],
        default: "14",
      },
    },
    inventory: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: "p-bracelet-charm",
    slug: "bracelet-with-a-charm",
    name: "Bracelet",
    modifier: "with a charm",
    description:
      "A delicate chain with one engraved charm. The kind that lives on a wrist and feels heavier than it weighs.",
    collection_id: "c-everyday",
    category: "bracelet",
    price: 5400,
    compare_at_price: null,
    status: "active",
    meta: "925 silver · initial",
    image_main: "/products/real-bracelet.png",
    images: ["/products/real-bracelet.png", "/products/real-pendant.png"],
    options: {
      engraving: { type: "text", max: 3, label: "Initial" },
      length: {
        type: "select",
        label: "Wrist size",
        choices: ["6″", "6.5″", "7″", "7.5″"],
        default: "6.5″",
      },
    },
    inventory: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: "p-pendant-two",
    slug: "pendant-for-two",
    name: "Pendant",
    modifier: "for two",
    description:
      "Two droplets on one chain. Two names, two dates, two halves of one thing.",
    collection_id: "c-for-two",
    category: "for-two",
    price: 7200,
    compare_at_price: null,
    status: "active",
    meta: "925 silver · double",
    image_main: "/products/real-pendant.png",
    images: ["/products/real-pendant.png", "/products/real-bracelet.png"],
    options: {
      engraving_a: { type: "text", max: 10, label: "First name" },
      engraving_b: { type: "text", max: 10, label: "Second name" },
      chain: {
        type: "select",
        label: "Chain length",
        choices: ["16″", "18″", "20″"],
        default: "18″",
      },
    },
    inventory: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: "p-pendant-letter",
    slug: "pendant-letter",
    name: "Pendant",
    modifier: "your letter",
    description: "A single letter, cast in silver, traced in your handwriting.",
    collection_id: "c-letters",
    category: "pendant",
    price: 3900,
    compare_at_price: null,
    status: "active",
    meta: "925 silver · letter",
    image_main: "/products/real-pendant.png",
    images: ["/products/real-pendant.png"],
    options: {
      engraving: { type: "text", max: 1, label: "Letter" },
      chain: {
        type: "select",
        label: "Chain length",
        choices: ["16″", "18″"],
        default: "16″",
      },
    },
    inventory: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: "p-anklet",
    slug: "anklet-with-a-name",
    name: "Anklet",
    modifier: "with a name",
    description: "A whisper of silver at the ankle, with a name you'd whisper too.",
    collection_id: "c-everyday",
    category: "anklet",
    price: 4200,
    compare_at_price: null,
    status: "active",
    meta: "925 silver · name",
    image_main: "/products/real-anklet.png",
    images: ["/products/real-anklet.png"],
    options: {
      engraving: { type: "text", max: 8, label: "Name" },
      length: {
        type: "select",
        label: "Length",
        choices: ["9″", "10″", "11″"],
        default: "10″",
      },
    },
    inventory: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: "p-ring-stack",
    slug: "ring-stacker",
    name: "Ring",
    modifier: "to stack",
    description: "A pair of slim bands you wear with the others. Hand-finished, never sized down.",
    collection_id: "c-everyday",
    category: "ring",
    price: 5800,
    compare_at_price: null,
    status: "active",
    meta: "925 silver · pair",
    image_main: "/products/real-ring.png",
    images: ["/products/real-ring.png"],
    options: {
      engraving: { type: "text", max: 6, label: "Word or word" },
      size: {
        type: "select",
        label: "Ring size",
        choices: ["10", "12", "14", "16", "18"],
        default: "14",
      },
    },
    inventory: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: "p-pendant-keepsake",
    slug: "pendant-keepsake",
    name: "Pendant",
    modifier: "the keepsake",
    description: "A locket that opens. A photograph inside, or a date, or nothing at all.",
    collection_id: "c-keepsake",
    category: "pendant",
    price: 8900,
    compare_at_price: null,
    status: "active",
    meta: "925 silver · locket",
    image_main: "/products/real-pendant.png",
    images: ["/products/real-pendant.png"],
    options: {
      engraving: { type: "text", max: 16, label: "On the back" },
      chain: {
        type: "select",
        label: "Chain length",
        choices: ["18″", "20″", "22″"],
        default: "20″",
      },
    },
    inventory: null,
    created_at: now,
    updated_at: now,
  },
];

export const COLLECTIONS = [
  { slug: "everyday", name: "The Everyday", description: "What you wear every day, with a name hidden where only you can find it." },
  { slug: "letters", name: "Letters", description: "One letter, cast in silver, traced in your handwriting." },
  { slug: "for-two", name: "For Two", description: "Two halves of one thing — for a friend, a sister, a love." },
  { slug: "keepsake", name: "Keepsake", description: "Pieces that open, that hold, that carry." },
] as const;

/* ─── Data accessors ───────────────────────────────────── */

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR-PROJECT")
  );
}

export async function getProducts(opts?: {
  category?: string;
  collection?: string;
  limit?: number;
}): Promise<Product[]> {
  if (!supabaseConfigured()) {
    let list = [...MOCK_PRODUCTS];
    if (opts?.category && opts.category !== "all") {
      list = list.filter((p) => p.category === opts.category);
    }
    if (opts?.collection) {
      list = list.filter((p) =>
        (p.collection_id ?? "").endsWith(opts.collection!)
      );
    }
    if (opts?.limit) list = list.slice(0, opts.limit);
    return list;
  }
  // Real Supabase fetch — added when DB is live.
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (opts?.category && opts.category !== "all")
    query = query.eq("category", opts.category);
  if (opts?.limit) query = query.limit(opts.limit);
  const { data, error } = await query;
  if (error) {
    console.error("getProducts error", error);
    return [];
  }
  return data ?? [];
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!supabaseConfigured()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  if (error) {
    console.error("getProduct error", error);
    return null;
  }
  return data;
}
