"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CartLine, CartState } from "./types";

interface CartContextValue extends CartState {
  /** Open/close the bag drawer. */
  open: boolean;
  setOpen: (v: boolean) => void;

  add: (line: Omit<CartLine, "key"> & { key?: string }) => void;
  updateQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;

  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "swarom_cart_v1";

function makeKey(line: Omit<CartLine, "key">): string {
  const opts = line.options
    ? Object.entries(line.options)
        .sort()
        .map(([k, v]) => `${k}=${v}`)
        .join("|")
    : "";
  return `${line.productId}::${opts}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines, ready]);

  const add = useCallback<CartContextValue["add"]>((line) => {
    const key = line.key ?? makeKey(line);
    setLines((prev) => {
      const i = prev.findIndex((l) => l.key === key);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + line.quantity };
        return next;
      }
      return [...prev, { ...line, key }];
    });
    setOpen(true);
  }, []);

  const updateQty = useCallback<CartContextValue["updateQty"]>((key, qty) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, quantity: qty } : l))
    );
  }, []);

  const remove = useCallback<CartContextValue["remove"]>((key) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback<CartContextValue["clear"]>(() => setLines([]), []);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.price * l.quantity, 0),
    [lines]
  );
  const count = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines]
  );

  const value: CartContextValue = {
    lines,
    ready,
    open,
    setOpen,
    add,
    updateQty,
    remove,
    clear,
    subtotal,
    count,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
