import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, BadgeCheck, ChevronRight, Star } from "lucide-react";
import { getProduct, money, products, relatedProducts } from "@/data/products";
import { ProductIllustration } from "@/components/product-illustration";
import { ProductBuy } from "@/components/product/product-buy";
import { ProductCard } from "@/components/product-card";

export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) return { title: "Producto no encontrado | NexoMaker" };
  return {
    title: `${product.name} | NexoMaker`,
    description: product.short,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) notFound();

  const related = relatedProducts(product);

  return (
    <main className="page product-page">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link href="/">Inicio</Link>
        <ChevronRight size={14} />
        <Link href={`/catalogo?cat=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <ChevronRight size={14} />
        <span>{product.name}</span>
      </nav>

      <div className="product-detail">
        <div className="detail-visual">
          {product.badge && <span className="product-badge">{product.badge}</span>}
          <ProductIllustration type={product.visual} />
        </div>
        <div className="detail-copy">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="rating">
            <Star size={15} fill="currentColor" /> {product.rating} <span>({product.reviews} opiniones)</span>
          </div>
          <p className="detail-short">{product.short}</p>
          <div className="detail-price">{money.format(product.price)}</div>

          <ProductBuy product={product} />

          <h2>Datos que importan</h2>
          <ul className="spec-list">
            {product.specs.map((spec) => (
              <li key={spec}>
                <BadgeCheck size={16} /> {spec}
              </li>
            ))}
          </ul>

          <h2>Compatibilidad declarada</h2>
          <div className="compat-tags">
            {product.compatible.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="related">
        <div className="section-heading">
          <div>
            <span className="kicker">Suele combinarse con</span>
            <h2>Compatibles y complementarios</h2>
          </div>
          <Link className="text-link" href="/catalogo">
            Ver catálogo
          </Link>
        </div>
        <div className="product-grid">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <Link className="back-link" href="/catalogo">
        <ArrowLeft size={16} /> Volver al catálogo
      </Link>
    </main>
  );
}
