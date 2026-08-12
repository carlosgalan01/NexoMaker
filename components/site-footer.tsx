import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand">
        <Link className="logo" href="/">
          NEXO<span>MAKER</span>
          <i />
        </Link>
        <p>Tecnología para construir, explicada por personas que construyen.</p>
      </div>
      <div>
        <strong>Comprar</strong>
        <Link href="/catalogo">Catálogo</Link>
        <Link href="/proyectos">Kits y proyectos</Link>
        <Link href="/catalogo?cat=Herramientas">Herramientas</Link>
      </div>
      <div>
        <strong>Aprender</strong>
        <Link href="/proyectos">Guías</Link>
        <a href="mailto:soporte@nexomaker.demo">Soporte</a>
        <Link href="/nexo-assist">Nexo Assist</Link>
      </div>
      <div>
        <strong>Proyecto académico</strong>
        <p>
          Empresa y catálogo ficticios.
          <br />
          Prototipo conceptual v0.1.
        </p>
      </div>
    </footer>
  );
}
