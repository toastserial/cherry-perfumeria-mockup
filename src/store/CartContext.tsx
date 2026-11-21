import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Perfume, Variant } from "../types";

export interface CartItem {
  key: string;
  perfumeId: string;
  slug: string;
  name: string;
  brand: string;
  family: string;
  image: string;
  variant: Variant;
  quantity: number;
}

interface CartValue {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  open: () => void;
  close: () => void;
  add: (perfume: Perfume, variant?: Variant) => void;
  remove: (key: string) => void;
  quantity: (key: string, value: number) => void;
  clear: () => void;
}

const KEY = "cherry-inquiry-cart";
const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [isOpen, setOpen] = useState(false);
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(items)), [items]);
  const add = (
    perfume: Perfume,
    variant = perfume.variants.find((v) => v.stock > 0) ?? perfume.variants[0],
  ) => {
    if (!variant || variant.stock <= 0) return;
    const key = `${perfume.id}:${variant.id}`;
    setItems((current) =>
      current.some((item) => item.key === key)
        ? current.map((item) =>
            item.key === key
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + 1, variant.stock),
                }
              : item,
          )
        : [
            ...current,
            {
              key,
              perfumeId: perfume.id,
              slug: perfume.slug,
              name: perfume.name,
              brand: perfume.brand,
              family: perfume.family,
              image: perfume.image,
              variant,
              quantity: 1,
            },
          ],
    );
    setOpen(true);
  };
  const value = useMemo<CartValue>(
    () => ({
      items,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      remove: (key) =>
        setItems((current) => current.filter((item) => item.key !== key)),
      quantity: (key, value) =>
        setItems((current) =>
          current.map((item) =>
            item.key === key
              ? {
                  ...item,
                  quantity: Math.max(1, Math.min(value, item.variant.stock)),
                }
              : item,
          ),
        ),
      clear: () => setItems([]),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce(
        (sum, item) =>
          sum + (item.variant.salePrice ?? item.variant.price) * item.quantity,
        0,
      ),
    }),
    [items, isOpen],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart debe utilizarse dentro de CartProvider");
  return value;
}
