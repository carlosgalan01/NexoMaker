"use client";

import {
  ArrowRight,
  BadgeCheck,
  Box,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Cpu,
  Heart,
  Layers3,
  Menu,
  Minus,
  PackageCheck,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { categories, money, Product, products } from "@/data/products";

const categoryIcons = {
  printer: Box,
  spool: Layers3,
  cpu: Cpu,
  laser: Zap,
  tool: Wrench,
  kit: PackageCheck,
};

type CartLine = { product: Product; quantity: number };

const assistantReplies = [
  {
    question: "Quiero imprimir un soporte para dejar el móvil dentro del coche en verano.",
    title: "Evitaría PLA para este proyecto",
    body: "Dentro de un coche al sol se pueden alcanzar temperaturas en las que el PLA empieza a deformarse. La opción más segura del catálogo es ASA, siempre que la impresora tenga cámara cerrada.",
    checks: ["Uso expuesto a calor", "Pieza funcional", "Necesita resistencia UV"],
    productIds: [6, 2, 13],
    warning: "La Bambu Lab A1 no es la opción recomendada para ASA porque carece de cerramiento.",
  },
  {
    question: "Quiero montar un sistema de riego que pueda consultar desde el móvil.",
    title: "La ruta más directa es un kit ESP32",
    body: "El kit integra placa, sensor, relé y bomba. Evita comprar componentes incompatibles por separado y permite empezar con una guía comprobada.",
    checks: ["Conectividad WiFi", "Lectura de humedad", "Automatización de bomba"],
    productIds: [14, 8, 12],
    warning: "El kit está planteado para interior. Para exterior habría que añadir caja estanca y revisar la alimentación.",
  },
  {
    question: "Necesito una impresora fiable para un pequeño taller de prototipado.",
    title: "Priorizaría repetibilidad y mantenimiento",
    body: "Para un taller importa más repetir piezas y resolver incidencias que ganar una carrera de velocidad. La MK4S ofrece una base reparable; la K1C interesa si se usarán materiales técnicos con frecuencia.",
    checks: ["Uso frecuente", "Piezas funcionales", "Mantenimiento interno"],
    productIds: [3, 2, 5],
    warning: "La elección final depende del volumen semanal y de si se necesita imprimir ASA o materiales reforzados.",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todo");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantStep, setAssistantStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatches = category === "Todo" || product.category === category;
      const queryMatches =
        !normalized ||
        `${product.name} ${product.category} ${product.short} ${product.compatible.join(" ")}`
          .toLowerCase()
          .includes(normalized);
      return categoryMatches && queryMatches;
    });
  }, [category, query]);

  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);
  const cartTotal = cart.reduce((total, line) => total + line.product.price * line.quantity, 0);
  const activeReply = assistantReplies[assistantStep];
  const assistantProducts = activeReply.productIds.map((id) => products.find((p) => p.id === id)!);

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  }

  function removeOne(productId: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.product.id === productId ? { ...line, quantity: line.quantity - 1 } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  function jumpToCatalog(nextCategory = "Todo") {
    setCategory(nextCategory);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <div className="top-strip">
        <span><Truck size={15} /> Envío gratis desde 59 €</span>
        <span className="desktop-only">Soporte técnico de personas que construyen</span>
        <span className="desktop-only">Devoluciones durante 30 días</span>
      </div>

      <header className="site-header">
        <button className="mobile-menu" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={22} />
        </button>
        <a className="logo" href="#inicio" aria-label="NexoMaker, inicio">
          NEXO<span>MAKER</span><i />
        </a>
        <div className="header-search">
          <Search size={19} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => jumpToCatalog(category)}
            placeholder="Buscar impresoras, materiales, sensores…"
            aria-label="Buscar en el catálogo"
          />
          {query && <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><X size={17} /></button>}
        </div>
        <div className="header-actions">
          <button className="icon-button desktop-only" aria-label="Favoritos"><Heart size={21} /></button>
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Abrir cesta con ${cartCount} productos`}>
            <ShoppingBag size={21} />
            <span className="cart-label">Cesta</span>
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
        </div>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <button onClick={() => jumpToCatalog("Todo")}>Productos <ChevronDown size={14} /></button>
          <button onClick={() => jumpToCatalog("Kits de proyecto")}>Proyectos</button>
          <button onClick={() => setAssistantOpen(true)}>Nexo Assist <span>beta</span></button>
          <a href="#ayuda">Aprende</a>
          <a href="#profesionales">Profesionales</a>
          <a href="#soporte">Soporte</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={16} /> Tecnología que encaja contigo</div>
          <h1>No compres piezas.<br /><span>Construye lo que imaginas.</span></h1>
          <p>
            Impresión 3D, electrónica y herramientas seleccionadas para funcionar juntas.
            Te ayudamos a pasar de una idea a un proyecto completo.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setAssistantOpen(true)}>
              Cuéntanos tu proyecto <ArrowRight size={18} />
            </button>
            <button className="secondary" onClick={() => jumpToCatalog("Todo")}>Explorar catálogo</button>
          </div>
          <div className="trust-row">
            <span><BadgeCheck size={18} /> Compatibilidad revisada</span>
            <span><CircleHelp size={18} /> Asesoramiento técnico</span>
          </div>
        </div>
        <div className="hero-workbench" aria-label="Mesa de trabajo maker con impresora 3D y electrónica">
          <div className="grid-plane" />
          <div className="printer-scene">
            <div className="printer-top" />
            <div className="printer-frame left" />
            <div className="printer-frame right" />
            <div className="printer-rail" />
            <div className="printer-head"><Zap size={18} /></div>
            <div className="printed-part"><div /><div /><div /></div>
            <div className="printer-bed" />
          </div>
          <div className="hero-spool"><span /></div>
          <div className="hero-board"><Cpu size={36} /><i /><i /><i /></div>
          <div className="compat-card">
            <BadgeCheck size={22} />
            <div><strong>Configuración validada</strong><small>4 componentes compatibles</small></div>
          </div>
        </div>
      </section>

      <section className="category-section" aria-labelledby="category-title">
        <div className="section-heading">
          <div><span className="kicker">Encuentra tu punto de partida</span><h2 id="category-title">Todo para llevar una idea a la mesa</h2></div>
          <button className="text-link" onClick={() => jumpToCatalog("Todo")}>Ver todo <ArrowRight size={17} /></button>
        </div>
        <div className="category-grid">
          {categories.map((item) => {
            const Icon = categoryIcons[item.icon as keyof typeof categoryIcons];
            return (
              <button key={item.name} className="category-card" onClick={() => jumpToCatalog(item.name)}>
                <span><Icon size={25} /></span>
                <div><strong>{item.name}</strong><small>{item.note}</small></div>
                <ChevronRight size={18} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="assist-banner">
        <div className="assist-orb"><Sparkles size={31} /></div>
        <div className="assist-copy">
          <span className="beta">NEXO ASSIST · DEMOSTRACIÓN</span>
          <h2>“Quiero hacer esto, pero no sé qué necesito.”</h2>
          <p>Describe tu idea con tus propias palabras. El asistente te hará las preguntas necesarias y preparará una combinación compatible.</p>
        </div>
        <button className="light-button" onClick={() => setAssistantOpen(true)}>Probar un ejemplo <ArrowRight size={17} /></button>
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="section-heading catalog-heading">
          <div>
            <span className="kicker">Selección NexoMaker</span>
            <h2>Productos que se explican bien</h2>
            <p>No solo qué es cada producto: también para qué sirve y con qué funciona.</p>
          </div>
        </div>
        <div className="filter-row" role="tablist" aria-label="Filtrar por categoría">
          {["Todo", ...categories.map((item) => item.name)].map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.slice(0, 12).map((product) => (
              <article className="product-card" key={product.id}>
                <button className="product-visual" onClick={() => setSelectedProduct(product)} aria-label={`Ver ${product.name}`}>
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <ProductIllustration type={product.visual} />
                  <span className="quick-view">Ver detalles</span>
                </button>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <button className="product-name" onClick={() => setSelectedProduct(product)}>{product.name}</button>
                  <p>{product.short}</p>
                  <div className="rating"><Star size={14} fill="currentColor" /> {product.rating} <span>({product.reviews})</span></div>
                  <div className="product-bottom">
                    <strong>{money.format(product.price)}</strong>
                    <button onClick={() => addToCart(product)}><ShoppingBag size={17} /> Añadir</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state"><Search size={30} /><h3>No encontramos esa combinación</h3><p>Prueba con un material, una tecnología o una compatibilidad distinta.</p><button onClick={() => { setQuery(""); setCategory("Todo"); }}>Limpiar filtros</button></div>
        )}
      </section>

      <section className="project-section" id="ayuda">
        <div className="project-card project-main">
          <span className="kicker">Compra por proyecto</span>
          <h2>Una caja. Todas las piezas. Una guía que sí se entiende.</h2>
          <p>Los kits eliminan la parte más frustrante de empezar: descubrir demasiado tarde que falta un cable, un adaptador o una fuente adecuada.</p>
          <button onClick={() => jumpToCatalog("Kits de proyecto")}>Explorar kits <ArrowRight size={17} /></button>
        </div>
        <div className="project-card support-card" id="soporte">
          <CircleHelp size={29} />
          <h3>¿Una duda técnica?</h3>
          <p>El equipo de soporte conoce el catálogo y puede revisar tu configuración antes de comprar.</p>
          <a href="mailto:soporte@nexomaker.demo">Consultar al equipo <ArrowRight size={16} /></a>
        </div>
        <div className="project-card pro-card" id="profesionales">
          <Wrench size={29} />
          <h3>¿Compras para un taller?</h3>
          <p>Presupuestos, reposición y configuraciones repetibles para pequeños equipos.</p>
          <a href="mailto:pro@nexomaker.demo">Hablar con profesional <ArrowRight size={16} /></a>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><a className="logo" href="#inicio">NEXO<span>MAKER</span><i /></a><p>Tecnología para construir, explicada por personas que construyen.</p></div>
        <div><strong>Comprar</strong><a href="#catalogo">Catálogo</a><a href="#ayuda">Kits</a><a href="#profesionales">Profesionales</a></div>
        <div><strong>Aprender</strong><a href="#ayuda">Guías</a><a href="#soporte">Soporte</a><button onClick={() => setAssistantOpen(true)}>Nexo Assist</button></div>
        <div><strong>Proyecto académico</strong><p>Empresa y catálogo ficticios.<br />Prototipo conceptual v0.1.</p></div>
      </footer>

      <button className="floating-assist" onClick={() => setAssistantOpen(true)}><Sparkles size={19} /><span>¿Qué quieres construir?</span></button>

      {cartOpen && (
        <div className="overlay" onMouseDown={() => setCartOpen(false)}>
          <aside className="cart-drawer" onMouseDown={(event) => event.stopPropagation()}>
            <div className="drawer-head"><div><span>Tu cesta</span><strong>{cartCount} {cartCount === 1 ? "producto" : "productos"}</strong></div><button onClick={() => setCartOpen(false)} aria-label="Cerrar cesta"><X /></button></div>
            {cart.length === 0 ? (
              <div className="cart-empty"><ShoppingBag size={35} /><h3>La cesta está vacía</h3><p>Explora el catálogo o deja que Nexo Assist prepare una configuración.</p><button className="primary" onClick={() => { setCartOpen(false); setAssistantOpen(true); }}>Probar Nexo Assist</button></div>
            ) : (
              <>
                <div className="cart-lines">
                  {cart.map((line) => (
                    <div className="cart-line" key={line.product.id}>
                      <div className="mini-visual"><ProductIllustration type={line.product.visual} /></div>
                      <div><strong>{line.product.name}</strong><small>{money.format(line.product.price)}</small><div className="quantity"><button onClick={() => removeOne(line.product.id)}><Minus size={14} /></button><span>{line.quantity}</span><button onClick={() => addToCart(line.product)}>+</button></div></div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary"><div><span>Subtotal</span><strong>{money.format(cartTotal)}</strong></div><small>Impuestos incluidos. El envío se calcula en el siguiente paso.</small><button className="primary" disabled>Finalizar compra · Demo</button></div>
              </>
            )}
          </aside>
        </div>
      )}

      {assistantOpen && (
        <div className="overlay assistant-overlay" onMouseDown={() => setAssistantOpen(false)}>
          <section className="assistant-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="assistant-head">
              <div className="assistant-title"><span><Sparkles size={20} /></span><div><strong>Nexo Assist</strong><small>Demostración guiada · no utiliza un modelo real</small></div></div>
              <button onClick={() => setAssistantOpen(false)} aria-label="Cerrar asistente"><X /></button>
            </div>
            <div className="scenario-tabs">
              {assistantReplies.map((reply, index) => <button key={reply.question} onClick={() => setAssistantStep(index)} className={assistantStep === index ? "active" : ""}>Ejemplo {index + 1}</button>)}
            </div>
            <div className="chat-area">
              <div className="user-bubble">{activeReply.question}</div>
              <div className="assistant-bubble">
                <div className="thinking-label"><Sparkles size={15} /> Nexo Assist</div>
                <h3>{activeReply.title}</h3>
                <p>{activeReply.body}</p>
                <div className="check-list">{activeReply.checks.map((check) => <span key={check}><BadgeCheck size={16} /> {check}</span>)}</div>
              </div>
              <div className="recommendation-block">
                <span className="block-label">CONFIGURACIÓN PROPUESTA</span>
                {assistantProducts.map((product, index) => (
                  <div className="recommendation-line" key={product.id}>
                    <div className="number">{index + 1}</div>
                    <div className="mini-visual"><ProductIllustration type={product.visual} /></div>
                    <div><strong>{product.name}</strong><small>{product.short}</small></div>
                    <span>{money.format(product.price)}</span>
                    <button onClick={() => addToCart(product)}>Añadir</button>
                  </div>
                ))}
                <div className="warning"><CircleHelp size={18} /><span><strong>Límite importante:</strong> {activeReply.warning}</span></div>
              </div>
            </div>
            <div className="assistant-foot"><span><BadgeCheck size={16} /> Recomendación basada en reglas y fichas de demostración</span><button onClick={() => assistantProducts.forEach(addToCart)}>Añadir configuración a la cesta</button></div>
          </section>
        </div>
      )}

      {selectedProduct && (
        <div className="overlay" onMouseDown={() => setSelectedProduct(null)}>
          <section className="product-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}><X /></button>
            <div className="modal-visual"><ProductIllustration type={selectedProduct.visual} /></div>
            <div className="modal-copy">
              <span className="product-category">{selectedProduct.category}</span>
              <h2>{selectedProduct.name}</h2>
              <div className="rating"><Star size={14} fill="currentColor" /> {selectedProduct.rating} <span>({selectedProduct.reviews} opiniones)</span></div>
              <p>{selectedProduct.short}</p>
              <h4>Datos que importan</h4>
              <ul>{selectedProduct.specs.map((spec) => <li key={spec}><BadgeCheck size={16} /> {spec}</li>)}</ul>
              <h4>Compatibilidad declarada</h4>
              <div className="compat-tags">{selectedProduct.compatible.map((item) => <span key={item}>{item}</span>)}</div>
              <div className="modal-buy"><strong>{money.format(selectedProduct.price)}</strong><button className="primary" onClick={() => addToCart(selectedProduct)}><ShoppingBag size={18} /> Añadir a la cesta</button></div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function ProductIllustration({ type }: { type: string }) {
  const isPrinter = type.startsWith("printer");
  const isSpool = type.startsWith("spool");
  const isBoard = type.startsWith("board") || type === "sensors";
  return (
    <div className={`illustration ${type}`}>
      {isPrinter && <><div className="ill-printer"><i /><i /><span><b /></span><em /></div></>}
      {isSpool && <div className="ill-spool"><i /><span /><b /></div>}
      {isBoard && <div className="ill-board"><Cpu /><i /><i /><i /></div>}
      {type === "laser" && <div className="ill-laser"><i /><i /><span><Zap /></span><em /></div>}
      {type === "cnc" && <div className="ill-cnc"><i /><span /><b /></div>}
      {type === "solder" && <div className="ill-solder"><i /><span /><b /></div>}
      {type === "caliper" && <div className="ill-caliper"><i /><span /></div>}
      {type === "kit-plant" && <div className="ill-kit"><Cpu /><span className="plant">♧</span><i /><b /></div>}
      {type === "kit-weather" && <div className="ill-kit weather"><Cpu /><span>☀</span><i /><b /></div>}
    </div>
  );
}
