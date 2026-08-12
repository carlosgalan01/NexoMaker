import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { TopStrip } from "@/components/top-strip";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { FloatingAssist } from "@/components/floating-assist";

export const metadata: Metadata = {
  title: "NexoMaker | Tecnología para construir",
  description:
    "Impresión 3D, electrónica y herramientas con compatibilidad técnica verificada. Convierte una idea en una configuración de productos que encajan.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="bg-paper">
      <body>
        <CartProvider>
          <TopStrip />
          <SiteHeader />
          {children}
          <SiteFooter />
          <FloatingAssist />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
