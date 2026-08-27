import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexoMaker Studio",
  description: "Prototipo de creación de campañas con Amazon Bedrock",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
