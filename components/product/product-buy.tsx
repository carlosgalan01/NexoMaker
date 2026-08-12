"use client";

import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";

export function ProductBuy({ product }: { product: Product }) {
  const { addToCart, setCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [done, setDone] = useState(false);

  function add(openDrawer: boolean) {
    for (let i = 0; i < quantity; i += 1) addToCart(product);
    setDone(true);
    window.setTimeout(() => setDone(false), 1400);
    if (openDrawer) setCartOpen(true);
  }

  return (
    <div className="buy-block">
      <div className="qty-stepper" aria-label="Cantidad">
        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Restar unidad">
          <Minus size={16} />
        </button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity((q) => Math.min(20, q + 1))} aria-label="Sumar unidad">
          <Plus size={16} />
        </button>
      </div>
      <button className="primary buy-main" onClick={() => add(true)}>
        {done ? <Check size={18} /> : <ShoppingBag size={18} />}
        {done ? "Añadido a la cesta" : "Añadir a la cesta"}
      </button>
      <button className="secondary" onClick={() => add(false)}>
        Seguir comprando
      </button>
    </div>
  );
}
