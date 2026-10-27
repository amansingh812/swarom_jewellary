/**
 * Database types — hand-rolled to match `supabase/schema.sql`.
 * Once the schema is live in Supabase, you can regenerate with:
 *   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 *
 * Each table is declared with three concrete shapes so the typed Supabase
 * client picks up Row / Insert / Update without falling through to `never`.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/* ─── Row shapes (what comes back from SELECT) ─────────────── */

export interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
}

export interface CollectionRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  position: number;
  created_at: string;
}

export type MetalKind =
  | "silver_925"
  | "gold_14k"
  | "gold_18k"
  | "gold_22k"
  | "gold_24k";

export interface MetalRateRow {
  id: string;
  metal: MetalKind;
  rate_per_gram: number;
  effective_from: string;
  note: string | null;
  created_at: string;
}

export interface StoreSettingRow {
  key: string;
  value: Json;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  modifier: string | null;
  description: string | null;
  collection_id: string | null;
  category:
    | "pendant"
    | "ring"
    | "bracelet"
    | "anklet"
    | "for-two"
    | "necklace"
    | "haram"
    | "earrings"
    | "bangle"
    | "mangalsutra";
  price: number;                // rupees — a CACHE when pricing_mode is weight_based
  compare_at_price: number | null;

  // ── gold line (migration 002) ────────────────────────────────
  metal: MetalKind;
  pricing_mode: "fixed" | "weight_based";
  gross_weight: number | null;  // grams, finished piece
  net_weight: number | null;    // grams of metal, excluding stones
  wastage_pct: number;
  making_charge_type: "per_gram" | "percentage" | "flat";
  making_charge_value: number;
  stone_charges: number;        // rupees
  stone_details: Json;          // [{ type, count, weight, unit }]
  hallmark_huid: string | null; // BIS HUID, per physical piece
  supplier_code: string | null;
  price_updated_at: string | null;
  status: "draft" | "active" | "archived";
  meta: string | null;          // "925 silver · engraved"
  image_main: string | null;
  images: string[];
  options: Json;                // engraving / chain length schema
  inventory: number | null;     // null = made-to-order
  created_at: string;
  updated_at: string;
}

export interface AddressRow {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface OrderRow {
  id: string;
  user_id: string | null;
  email: string;
  phone: string | null;
  status:
    | "pending"
    | "paid"
    | "in_production"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shipping_address: Json;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  modifier: string | null;
  image: string | null;
  unit_price: number;
  quantity: number;
  options: Json;

  // ── frozen at purchase, so a refund months later is unarguable ──
  metal: MetalKind | null;
  net_weight: number | null;
  rate_per_gram: number | null;
  price_breakdown: Json;
}

export interface WishlistRow {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface ReviewRow {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  approved: boolean;
  created_at: string;
}

export interface NewsletterRow {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}

/* ─── Database surface ───────────────────────────────────── */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: { id: string } & Partial<Omit<ProfileRow, "id">>;
        Update: Partial<Omit<ProfileRow, "id">>;
      };
      collections: {
        Row: CollectionRow;
        Insert: { slug: string; name: string } & Partial<Omit<CollectionRow, "slug" | "name">>;
        Update: Partial<Omit<CollectionRow, "id">>;
      };
      products: {
        Row: ProductRow;
        Insert: {
          slug: string;
          name: string;
          category: ProductRow["category"];
          price: number;
        } & Partial<Omit<ProductRow, "slug" | "name" | "category" | "price">>;
        Update: Partial<Omit<ProductRow, "id">>;
      };
      metal_rates: {
        Row: MetalRateRow;
        Insert: {
          metal: MetalKind;
          rate_per_gram: number;
        } & Partial<Omit<MetalRateRow, "metal" | "rate_per_gram">>;
        Update: Partial<Omit<MetalRateRow, "id">>;
      };
      store_settings: {
        Row: StoreSettingRow;
        Insert: { key: string; value: Json } & Partial<StoreSettingRow>;
        Update: Partial<StoreSettingRow>;
      };
      addresses: {
        Row: AddressRow;
        Insert: {
          user_id: string;
          full_name: string;
          phone: string;
          line1: string;
          city: string;
          state: string;
          pincode: string;
        } & Partial<Omit<AddressRow, "user_id" | "full_name" | "phone" | "line1" | "city" | "state" | "pincode">>;
        Update: Partial<Omit<AddressRow, "id">>;
      };
      orders: {
        Row: OrderRow;
        Insert: {
          email: string;
          subtotal: number;
          total: number;
          shipping_address: Json;
        } & Partial<Omit<OrderRow, "email" | "subtotal" | "total" | "shipping_address">>;
        Update: Partial<Omit<OrderRow, "id">>;
      };
      order_items: {
        Row: OrderItemRow;
        Insert: {
          order_id: string;
          product_id: string;
          name: string;
          unit_price: number;
          quantity: number;
        } & Partial<Omit<OrderItemRow, "order_id" | "product_id" | "name" | "unit_price" | "quantity">>;
        Update: Partial<Omit<OrderItemRow, "id">>;
      };
      wishlist: {
        Row: WishlistRow;
        Insert: { user_id: string; product_id: string } & Partial<Omit<WishlistRow, "user_id" | "product_id">>;
        Update: Partial<Omit<WishlistRow, "id">>;
      };
      reviews: {
        Row: ReviewRow;
        Insert: {
          product_id: string;
          user_id: string;
          rating: number;
        } & Partial<Omit<ReviewRow, "product_id" | "user_id" | "rating">>;
        Update: Partial<Omit<ReviewRow, "id">>;
      };
      newsletter: {
        Row: NewsletterRow;
        Insert: { email: string } & Partial<Omit<NewsletterRow, "email">>;
        Update: Partial<Omit<NewsletterRow, "id">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

/* ─── Convenience aliases (used throughout the app) ──────── */
export type Product = ProductRow;
export type Collection = CollectionRow;
export type Order = OrderRow;
export type OrderItem = OrderItemRow;
export type Address = AddressRow;
export type Profile = ProfileRow;
