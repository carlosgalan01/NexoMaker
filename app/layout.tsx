import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexoMaker | Tecnología para construir",
  description:
    "Impresión 3D, electrónica y herramientas con compatibilidad técnica verificada.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
