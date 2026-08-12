"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

const sortOptions = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "rating", label: "Mejor valorados" },
];

const filterList = ["Todo", ...categories.map((item) => item.name)];

export function CatalogView() {
  const params = useSearchParams();
  const initialCat = params.get("cat");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(
    initialCat && filterList.includes(initialCat) ? initialCat : "Todo",
  );
  const [sort, setSort] = useState("relevance");

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatches = category === "Todo" || product.category === category;
      const queryMatches =
        !normalized ||
        `${product.name} ${product.category} ${product.short} ${product.compatible.join(" ")}`
          .toLowerCase()
          .includes(normalized);
      return categoryMatches && queryMatches;
    });

    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [category, query, sort]);

  return (
    <main className="page catalog-page">
      <header className="page-head">
        <span className="kicker">Catálogo completo</span>
        <h1>Todo lo que encaja, en un solo lugar</h1>
        <p>Filtra por categoría, busca por compatibilidad y ordena según lo que te importa.</p>
      </header>

      <div className="catalog-toolbar">
        <div className="catalog-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, material o compatibilidad…"
            aria-label="Buscar en el catálogo"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda">
              <X size={16} />
            </button>
          )}
        </div>
        <label className="catalog-sort">
          <SlidersHorizontal size={16} />
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar productos">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-row" role="tablist" aria-label="Filtrar por categoría">
        {filterList.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={category === item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="result-count" aria-live="polite">
        {visibleProducts.length} {visibleProducts.length === 1 ? "producto" : "productos"}
        {category !== "Todo" ? ` en ${category}` : ""}
      </p>

      {visibleProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={30} />
          <h3>No encontramos esa combinación</h3>
          <p>Prueba con un material, una tecnología o una compatibilidad distinta.</p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("Todo");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </main>
  );
}
