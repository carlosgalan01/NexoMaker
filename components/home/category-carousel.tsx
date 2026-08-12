"use client";

import Link from "next/link";
import { Box, BrickWall, Cpu, Layers3, PackageCheck, Wrench, Zap } from "lucide-react";
import { categories } from "@/data/products";
import { Carousel } from "@/components/home/carousel";

const categoryIcons = {
  printer: Box,
  spool: BrickWall,
  cpu: Cpu,
  laser: Zap,
  tool: Wrench,
  kit: PackageCheck,
} as const;

const fallbackIcon = Layers3;

export function CategoryCarousel() {
  return (
    <section className="category-section" aria-labelledby="category-title">
      <div className="section-heading">
        <div>
          <span className="kicker">Encuentra tu punto de partida</span>
          <h2 id="category-title">Recorre las categorías</h2>
        </div>
        <Link className="text-link" href="/catalogo">
          Ver todo el catálogo
        </Link>
      </div>
      <Carousel ariaLabel="Categorías de producto" className="category-carousel">
        {categories.map((item) => {
          const Icon = categoryIcons[item.icon as keyof typeof categoryIcons] ?? fallbackIcon;
          return (
            <Link
              key={item.name}
              className="category-card"
              href={`/catalogo?cat=${encodeURIComponent(item.name)}`}
            >
              <span>
                <Icon size={26} />
              </span>
              <div>
                <strong>{item.name}</strong>
                <small>{item.note}</small>
              </div>
              <em className="category-go">Explorar</em>
            </Link>
          );
        })}
      </Carousel>
    </section>
  );
}
