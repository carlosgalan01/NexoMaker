"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { money } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { ProductIllustration } from "@/components/product-illustration";

export function CartDrawer() {
  const router = useRouter();
  const { cart, cartCount, cartTotal, cartOpen, setCartOpen, addToCart, removeOne } = useCart();

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="overlay" onMouseDown={() => setCartOpen(false)}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-label="Tu cesta"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-head">
          <div>
            <span>Tu cesta</span>
            <strong>
              {cartCount} {cartCount === 1 ? "producto" : "productos"}
            </strong>
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Cerrar cesta">
            <X />
          </button>
        </div>
        {cart.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={35} />
            <h3>La cesta está vacía</h3>
            <p>Explora el catálogo o deja que Nexo Assist prepare una configuración.</p>
            <button
              className="primary"
              onClick={() => {
                setCartOpen(false);
                router.push("/nexo-assist");
              }}
            >
              Probar Nexo Assist
            </button>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {cart.map((line) => (
                <div className="cart-line" key={line.product.id}>
                  <div className="mini-visual">
                    <ProductIllustration type={line.product.visual} />
                  </div>
                  <div>
                    <strong>{line.product.name}</strong>
                    <small>{money.format(line.product.price)}</small>
                    <div className="quantity">
                      <button onClick={() => removeOne(line.product.id)} aria-label="Quitar una unidad">
                        <Minus size={14} />
                      </button>
                      <span>{line.quantity}</span>
                      <button onClick={() => addToCart(line.product)} aria-label="Añadir una unidad">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>{money.format(cartTotal)}</strong>
              </div>
              <small>Impuestos incluidos. El envío se calcula en el siguiente paso.</small>
              <button className="primary" disabled>
                Finalizar compra · Demo
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
