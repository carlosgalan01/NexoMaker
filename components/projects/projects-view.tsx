"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, PackageCheck, ShoppingBag } from "lucide-react";
import { money, products } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { ProductIllustration } from "@/components/product-illustration";

const projectPaths = [
  { title: "Automatización del hogar", note: "Sensores, ESP32 y control por WiFi.", cat: "Electrónica" },
  { title: "Piezas funcionales resistentes", note: "Materiales técnicos y máquina cerrada.", cat: "Materiales" },
  { title: "Cartelería y grabado", note: "Corte y grabado con láser y CNC.", cat: "CNC y láser" },
  { title: "Puesta a punto del taller", note: "Herramientas y medición fiable.", cat: "Herramientas" },
];

export function ProjectsView() {
  const { addToCart, lastAddedId } = useCart();
  const kits = products.filter((product) => product.category === "Kits de proyecto");

  return (
    <main className="page projects-page">
      <header className="page-head">
        <span className="kicker">Compra por proyecto</span>
        <h1>Una caja. Todas las piezas. Una guía que sí se entiende.</h1>
        <p>
          Los kits eliminan la parte más frustrante de empezar: descubrir demasiado tarde que falta un
          cable, un adaptador o una fuente adecuada.
        </p>
      </header>

      <section className="kit-list" aria-label="Kits de proyecto">
        {kits.map((kit) => {
          const justAdded = lastAddedId === kit.id;
          return (
            <article className="kit-card" key={kit.id}>
              <div className="kit-visual">
                {kit.badge && <span className="product-badge">{kit.badge}</span>}
                <ProductIllustration type={kit.visual} />
              </div>
              <div className="kit-body">
                <div className="kit-head">
                  <PackageCheck size={18} />
                  <span>Proyecto completo</span>
                </div>
                <h2>{kit.name}</h2>
                <p>{kit.short}</p>
                <ul className="kit-includes">
                  {kit.specs.map((spec) => (
                    <li key={spec}>
                      <BadgeCheck size={15} /> {spec}
                    </li>
                  ))}
                </ul>
                <div className="kit-compat">
                  {kit.compatible.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="kit-foot">
                  <strong>{money.format(kit.price)}</strong>
                  <div className="kit-actions">
                    <Link className="secondary" href={`/producto/${kit.id}`}>
                      Ver ficha
                    </Link>
                    <button className={justAdded ? "primary added" : "primary"} onClick={() => addToCart(kit)}>
                      {justAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
                      {justAdded ? "Añadido" : "Añadir kit"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="project-paths">
        <div className="section-heading">
          <div>
            <span className="kicker">¿Prefieres montarlo tú?</span>
            <h2>Empieza por el tipo de proyecto</h2>
          </div>
        </div>
        <div className="paths-grid">
          {projectPaths.map((path) => (
            <Link key={path.title} className="path-card" href={`/catalogo?cat=${encodeURIComponent(path.cat)}`}>
              <div>
                <h3>{path.title}</h3>
                <p>{path.note}</p>
              </div>
              <span className="path-go">
                Ver productos <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="projects-help">
        <div className="help-card">
          <h3>¿Compras para un taller o un aula?</h3>
          <p>Presupuestos, reposición y configuraciones repetibles para pequeños equipos.</p>
          <a href="mailto:pro@nexomaker.demo">
            Hablar con el equipo <ArrowRight size={16} />
          </a>
        </div>
        <div className="help-card ghost">
          <h3>¿No sabes por dónde empezar?</h3>
          <p>Nexo Assist recorre un ejemplo y prepara una configuración compatible de demostración.</p>
          <Link href="/nexo-assist">
            Probar Nexo Assist <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
