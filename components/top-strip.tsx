import { Truck } from "lucide-react";

export function TopStrip() {
  return (
    <div className="top-strip">
      <span>
        <Truck size={15} /> Envío gratis desde 59 €
      </span>
      <span className="desktop-only">Soporte técnico de personas que construyen</span>
      <span className="desktop-only">Devoluciones durante 30 días</span>
    </div>
  );
}
