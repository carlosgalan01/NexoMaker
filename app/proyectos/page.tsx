import type { Metadata } from "next";
import { ProjectsView } from "@/components/projects/projects-view";

export const metadata: Metadata = {
  title: "Proyectos y kits | NexoMaker",
  description: "Kits completos y rutas por tipo de proyecto: todo lo necesario para empezar sin piezas incompatibles.",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
