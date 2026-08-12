import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page not-found">
      <span className="kicker">Error 404</span>
      <h1>No encontramos esa página</h1>
      <p>El enlace puede haber cambiado o el producto ya no está disponible.</p>
      <Link className="primary" href="/">
        Volver al inicio <ArrowRight size={17} />
      </Link>
    </main>
  );
}
