"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const navItems = [
  { href: "/catalogo", label: "Productos" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/nexo-assist", label: "Nexo Assist", beta: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/catalogo?q=${encodeURIComponent(trimmed)}` : "/catalogo");
  }

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className={scrolled ? "site-header scrolled" : "site-header"}>
      <button
        className="mobile-menu"
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <Link className="logo" href="/" aria-label="NexoMaker, inicio">
        NEXO<span>MAKER</span>
        <i />
      </Link>
      <form className="header-search" onSubmit={submitSearch} role="search">
        <Search size={19} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar impresoras, materiales, sensores…"
          aria-label="Buscar en el catálogo"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda">
            <X size={17} />
          </button>
        )}
      </form>
      <div className="header-actions">
        <button className="icon-button desktop-only" aria-label="Favoritos">
          <Heart size={21} />
        </button>
        <button
          className="cart-button"
          onClick={() => setCartOpen(true)}
          aria-label={`Abrir cesta con ${cartCount} productos`}
        >
          <ShoppingBag size={21} />
          <span className="cart-label">Cesta</span>
          {cartCount > 0 && <b>{cartCount}</b>}
        </button>
      </div>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Navegación principal">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(item.href) ? "nav-link-active" : ""}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
            {item.beta && <span>beta</span>}
          </Link>
        ))}
        <button onClick={() => router.push("/nexo-assist")} className="nav-cta">
          <Sparkles size={15} /> ¿Qué construyes?
        </button>
      </nav>
    </header>
  );
}
