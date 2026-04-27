"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types";

interface CartContextValue {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (product_id: string, variant_id: string | null) => void;
  update: (product_id: string, variant_id: string | null, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "hh_cart";

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }): JSX.Element {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const add = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        const existing = prev.find(
          (x) => x.product_id === item.product_id && x.variant_id === item.variant_id,
        );
        const next = existing
          ? prev.map((x) =>
              x.product_id === item.product_id && x.variant_id === item.variant_id
                ? { ...x, quantity: x.quantity + item.quantity }
                : x,
            )
          : [...prev, item];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const remove = useCallback(
    (product_id: string, variant_id: string | null) => {
      persist(items.filter((x) => !(x.product_id === product_id && x.variant_id === variant_id)));
    },
    [items, persist],
  );

  const update = useCallback(
    (product_id: string, variant_id: string | null, qty: number) => {
      if (qty <= 0) {
        remove(product_id, variant_id);
        return;
      }
      persist(
        items.map((x) =>
          x.product_id === product_id && x.variant_id === variant_id
            ? { ...x, quantity: qty }
            : x,
        ),
      );
    },
    [items, persist, remove],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const total = items.reduce((sum, x) => sum + x.price_cents * x.quantity, 0);
  const count = items.reduce((sum, x) => sum + x.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, update, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}
