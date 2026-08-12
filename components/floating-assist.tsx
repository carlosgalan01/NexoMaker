"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export function FloatingAssist() {
  const pathname = usePathname();
  if (pathname.startsWith("/nexo-assist")) return null;

  return (
    <Link className="floating-assist" href="/nexo-assist">
      <Sparkles size={19} />
      <span>¿Qué quieres construir?</span>
    </Link>
  );
}
