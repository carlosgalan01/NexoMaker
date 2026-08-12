import type { Metadata } from "next";
import { AssistExperience } from "@/components/assist/assist-experience";

export const metadata: Metadata = {
  title: "Nexo Assist — NexoMaker",
  description:
    "Demostración guiada de Nexo Assist: describe tu proyecto y descubre una configuración compatible basada en reglas fijas.",
};

export default function NexoAssistPage() {
  return <AssistExperience />;
}
