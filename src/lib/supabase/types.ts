/**
 * Database types — hand-rolled stub matching `supabase/schema.sql`.
 * Once the schema is live in Supabase, regenerate with:
 *   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: "customer" | "admin";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      collections: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          position: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["collections"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["collections"]["Row"]>;
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          modifier: string | null;
          description: string | null;
          collection_id: string | null;
          category: "pendant" | "ring" | "bracelet" | "anklet" | "for-two";
          price: number;          // rupees
          compare_at_price: number | null;
          status: "draft" | "active" | "archived";
          meta: string | null;    // "925 silver · engraved"
          image_main: string | null;
          images: string[];
          options: Json;          // schema for engraving / chain length etc
          inventory: number | null; // null = made-to-order, no cap
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["products"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
      };
      addresses: {
        Row: {
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
        };
        Insert: Omit<
          Database["public"]["Tables"]["addresses"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Row"]>;
      };
      orders: {
        Row: {
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
        };
        Insert: Omit<
          Database["public"]["Tables"]["orders"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          name: string;
          modifier: string | null;
          image: string | null;
          unit_price: number;
          quantity: number;
          options: Json;          // engraving + chain length
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Row"]>;
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["wishlist"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["wishlist"]["Row"]>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string | null;
          body: string | null;
          approved: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["reviews"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
      };
      newsletter: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["newsletter"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["newsletter"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience aliases
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Collection = Database["public"]["Tables"]["collections"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
