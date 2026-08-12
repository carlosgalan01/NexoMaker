"use client";

import Link from "next/link";
import { Check, ShoppingBag, Star } from "lucide-react";
import { money, type Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { ProductIllustration } from "@/components/product-illustration";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, lastAddedId } = useCart();
  const justAdded = lastAddedId === product.id;

  return (
    <article className="product-card">
      <Link className="product-visual" href={`/producto/${product.id}`} aria-label={`Ver ${product.name}`}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <ProductIllustration type={product.visual} />
        <span className="quick-view">Ver ficha</span>
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link className="product-name" href={`/producto/${product.id}`}>
          {product.name}
        </Link>
        <p>{product.short}</p>
        <div className="compat-preview" aria-label="Compatibilidad destacada">
          {product.compatible.slice(0, 3).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="rating">
          <Star size={14} fill="currentColor" /> {product.rating} <span>({product.reviews})</span>
        </div>
        <div className="product-bottom">
          <strong>{money.format(product.price)}</strong>
          <button
            className={justAdded ? "added" : ""}
            onClick={() => addToCart(product)}
            aria-label={`Añadir ${product.name} a la cesta`}
          >
            {justAdded ? <Check size={17} /> : <ShoppingBag size={17} />}
            <span>{justAdded ? "Añadido" : "Añadir"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
