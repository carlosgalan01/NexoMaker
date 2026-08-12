"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Product } from "@/data/products";

export type CartLine = { product: Product; quantity: number };

type CartContextValue = {
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  cartOpen: boolean;
  lastAddedId: number | null;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product) => void;
  addMany: (products: Product[]) => void;
  removeOne: (productId: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<number | null>(null);

  const addToCart = useCallback((product: Product) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    setLastAddedId(product.id);
    window.setTimeout(() => setLastAddedId((id) => (id === product.id ? null : id)), 1200);
  }, []);

  const addMany = useCallback((items: Product[]) => {
    setCart((current) => {
      const next = [...current];
      for (const product of items) {
        const existing = next.find((line) => line.product.id === product.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          next.push({ product, quantity: 1 });
        }
      }
      return next;
    });
    setCartOpen(true);
  }, []);

  const removeOne = useCallback((productId: number) => {
    setCart((current) =>
      current
        .map((line) =>
          line.product.id === productId ? { ...line, quantity: line.quantity - 1 } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const cartCount = cart.reduce((total, line) => total + line.quantity, 0);
    const cartTotal = cart.reduce((total, line) => total + line.product.price * line.quantity, 0);
    return {
      cart,
      cartCount,
      cartTotal,
      cartOpen,
      lastAddedId,
      setCartOpen,
      addToCart,
      addMany,
      removeOne,
    };
  }, [cart, cartOpen, lastAddedId, addToCart, addMany, removeOne]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
