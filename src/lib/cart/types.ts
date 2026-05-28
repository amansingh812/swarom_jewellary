export interface CartLine {
  /** Unique line key (productId + variants serialized). */
  key: string;
  productId: string;
  slug: string;
  name: string;
  modifier?: string;
  image: string;
  /** Price in rupees per unit. */
  price: number;
  quantity: number;
  /** Variant attributes — engraving text, chain length, etc. */
  options?: Record<string, string>;
}

export interface CartState {
  lines: CartLine[];
  ready: boolean;
}
