import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProduct, homeRails } from "@/data/products";
import { Carousel } from "@/components/home/carousel";
import { ProductCard } from "@/components/product-card";

export function ProductRails() {
  return (
    <section className="rails-section" aria-labelledby="rails-title">
      <div className="section-heading">
        <div>
          <span className="kicker">Selección NexoMaker</span>
          <h2 id="rails-title">Productos que se explican bien</h2>
          <p>No mostramos todo el catálogo aquí: estas son entradas por objetivo.</p>
        </div>
        <Link className="text-link" href="/catalogo">
          Ir al catálogo completo <ArrowRight size={17} />
        </Link>
      </div>

      <div className="rails-list">
        {homeRails.map((rail) => {
          const items = rail.productIds.map(getProduct).filter(Boolean);
          return (
            <div className="rail" key={rail.id}>
              <div className="rail-head">
                <div>
                  <h3>{rail.title}</h3>
                  <p>{rail.note}</p>
                </div>
              </div>
              <Carousel ariaLabel={rail.title} className="rail-carousel">
                {items.map((product) => (
                  <div className="rail-item" key={product!.id}>
                    <ProductCard product={product!} />
                  </div>
                ))}
              </Carousel>
            </div>
          );
        })}
      </div>
    </section>
  );
}
