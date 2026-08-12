import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";

export const metadata: Metadata = {
  title: "Catálogo | NexoMaker",
  description: "Impresoras 3D, materiales, electrónica, CNC, láser, herramientas y kits con compatibilidad verificada.",
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="page catalog-page" />}>
      <CatalogView />
    </Suspense>
  );
}
